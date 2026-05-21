"use server";

import { sanitizeAIResponse } from "@/utils/sanitize";

// MODEL CONFIGURATION

// Gemma models for recipe text generation (via Google AI Studio)
const GEMMA_MODELS = [
  "models/gemma-4-26b-a4b-it", // Primary — MoE 26B-A4B (Stable and functional)
  "models/gemma-4-31b-it", // Fallback — Dense 31B (Currently returning 500, kept as secondary fallback)
];


// Retry with exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 2,
  baseDelay = 1000,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // If 503 (high demand) or 429 (rate limit) and we have retries left, wait and retry
      if (
        (response.status === 503 || response.status === 429) &&
        attempt < maxRetries
      ) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(
          `Attempt ${attempt + 1} failed with ${response.status}, retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(
          `⏳ Attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

// STEP 1: GENERATE RECIPE TEXT (Gemma via OpenRouter)

const RECIPE_SYSTEM_PROMPT = `You are a recipe API. You MUST output ONLY raw JSON with no markdown formatting, no explanations, and no greetings.

CRITICAL: Always include the imagePrompt field for every recipe!

MANDATORY RULE — LANGUAGE DETECTION:
- Detect the language of the user's request.
- If the user writes in INDONESIAN → respond entirely in Indonesian (names, descriptions, ingredients, procedure, units, difficulty levels, everything).
- If the user writes in ENGLISH → respond entirely in English (names, descriptions, ingredients, procedure, units, difficulty levels, everything).
- NEVER mix languages. The response language must match the request language exactly.

MANDATORY RULE — TOPIC RELEVANCE:
- You MUST generate exactly 3 recipes that are ALL direct variations of the food/ingredient requested by the user.
- STRICTLY FORBIDDEN to generate recipes unrelated to the request. Example: if the user asks for "soto mie", ALL recipes must be soto-themed (e.g. Soto Mie Bogor, Soto Mie Betawi, Soto Mie Kuah Santan). Do NOT generate nasi goreng, mie goreng, or any other unrelated dish.
- Vary the recipes in a relevant way: different regional origin, cooking technique, toppings/fillings, or seasoning — but always within the same theme.

JSON SCHEMA YOU MUST FOLLOW:
{
  "recipes": [
    {
      "id": "rec-1",
      "name": "Recipe Name",
      "description": "Short description of the recipe",
      "prepTime": "Time (e.g. 45 minutes)",
      "difficulty": "Level (e.g. Easy, Medium, Hard)",
      "servings": "Portions (e.g. 6 servings)",
      "ingredients": ["Ingredient 1", "Ingredient 2"],
      "procedure": ["Step 1", "Step 2"],
      "imagePrompt": "Detailed English description for food photography image generation. Must be in English regardless of recipe language. It MUST specifically describe the unique features, toppings, ingredients, and visual appearance of this specific recipe variant (e.g. showing honey drizzle, melting cheese, chocolate crumbs, color accents) so the generated image matches the recipe perfectly. Example: 'Professional food photography of golden crispy fried chicken, beautifully plated on white ceramic dish, garnished with fresh herbs, soft natural lighting, warm tones, appetizing, restaurant quality, editorial style, no text, no watermark, no human'"
    }
  ]
}

Generate exactly 3 unique recipes that are ALL relevant to the user's request, in the SAME LANGUAGE as the user's request.`;

async function generateRecipeText(
  prompt: string,
  googleApiKey: string,
): Promise<{ recipes: unknown[] }> {
  let lastError: string | null = null;

  for (const model of GEMMA_MODELS) {
    try {
      console.log(`[Gemma] Trying model: ${model} via Google AI Studio...`);

      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${googleApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            systemInstruction: {
              parts: [
                {
                  text: RECIPE_SYSTEM_PROMPT,
                },
              ],
            },
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.7,
              topP: 0.95,
              maxOutputTokens: 4096,
            },
          }),
        },
        2, // 2 retries per model
        1500, // 1.5 second base delay
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(
          `[Gemma] Model ${model} failed (${response.status}): ${errorText.substring(0, 200)}`,
        );
        lastError = errorText;
        continue;
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts ?? [];

      interface ContentPart {
        text?: string;
        thought?: boolean;
      }

      // Filter out thinking parts, only join actual response text
      const textParts = parts.filter(
        (p: unknown): p is ContentPart =>
          typeof p === "object" &&
          p !== null &&
          "text" in p &&
          !(p as ContentPart).thought
      );

      const content = textParts.map((p: ContentPart) => p.text).join("").trim();

      if (!content) {
        console.warn(`[Gemma] Model ${model} returned empty content`);
        lastError = "Empty response from model";
        continue;
      }

      console.log(`[Gemma] Successfully used model: ${model}`);

      // Parse JSON from Gemma response
      const sanitized = sanitizeAIResponse(content);
      let parsedData: { recipes?: unknown[] } | unknown[];

      try {
        parsedData = JSON.parse(sanitized);
      } catch (parseError: unknown) {
        const errorMessage =
          parseError instanceof Error
            ? parseError.message
            : "Unknown parse error";
        console.error("[Gemma] Raw response text:", content);
        console.error("[Gemma] JSON parse error:", errorMessage);
        lastError = `JSON parse error: ${errorMessage}`;
        continue; // Try next model if JSON parsing fails
      }

      const recipes =
        parsedData && typeof parsedData === "object" && "recipes" in parsedData
          ? parsedData.recipes
          : parsedData;

      if (!Array.isArray(recipes) || recipes.length === 0) {
        console.warn(`[Gemma] Model ${model} returned invalid recipe array`);
        lastError = "Invalid recipe array from model";
        continue;
      }

      return { recipes };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.warn(`⚠️ [Gemma] Model ${model} error: ${errorMessage}`);
      lastError = errorMessage;
      continue;
    }
  }

  throw new Error(
    `Semua model Gemma sedang sibuk. Silakan coba lagi dalam beberapa saat. (Error: ${lastError || "Unknown"})`,
  );
}

// STEP 2: GENERATE IMAGE (Gemini via Google AI Studio)

async function generateImageForRecipe(
  imagePrompt: string,
  recipeName: string,
  apiKey: string,
): Promise<string> {
  console.log(`[Image] Generating image URL for: ${recipeName} (Free Tier - Pollinations AI)...`);
  try {
    let finalPrompt = imagePrompt;
    if (recipeName && !imagePrompt.toLowerCase().includes(recipeName.toLowerCase())) {
      finalPrompt = `${recipeName}, ${imagePrompt}`;
    }
    const cleanPrompt = finalPrompt.replace(/[\n\r]+/g, " ").trim();
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      cleanPrompt,
    )}?width=1024&height=768&model=flux&nologo=true&seed=${seed}`;

    // Wrap the URL in our local proxy to prevent client-side ISP blocking (common in ID)
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(pollinationsUrl)}`;
    console.log(`  ✨ Successfully generated local proxy URL: ${proxyUrl}`);
    return proxyUrl;
  } catch (error) {
    console.error("  ❌ Pollinations AI fallback failed:", error);
    return "";
  }
}

// MAIN EXPORT: generateRecipes

export async function generateRecipes(prompt: string) {
  try {
    const googleApiKey = process.env.GOOGLE_AI_KEY;

    if (!googleApiKey) {
      throw new Error("GOOGLE_AI_KEY is not defined in environment variables");
    }

    // ── Step 1: Generate recipe text via Gemma (Google AI Studio) ──
    console.log(`\n📝 ═══ STEP 1: Generating recipes with Gemma ═══`);
    const { recipes } = await generateRecipeText(prompt, googleApiKey);

    // Assign unique IDs
    const formattedRecipes = recipes.map((recipe: unknown, index: number) => ({
      ...(typeof recipe === "object" && recipe !== null ? recipe : {}),
      id: `rec-ai-${Date.now()}-${index}`,
    }));

    console.log(
      `Generated ${formattedRecipes.length} recipes, now generating images SEQUENTIALLY...`,
    );

    // Step 2: Generate images via Gemini (Google AI Studio)
    console.log(`\n🎨 STEP 2: Generating images with Gemini`);
    const recipesWithImages = [];

    for (let i = 0; i < formattedRecipes.length; i++) {
      const recipe = formattedRecipes[i];

      if (
        typeof recipe === "object" &&
        recipe !== null &&
        "imagePrompt" in recipe &&
        "name" in recipe &&
        typeof recipe.imagePrompt === "string" &&
        typeof recipe.name === "string"
      ) {
        const imageUrl = await generateImageForRecipe(
          recipe.imagePrompt,
          recipe.name,
          googleApiKey,
        );

        recipesWithImages.push({
          ...recipe,
          imageUrl: imageUrl || undefined,
        });

        console.log(`  ✓ Recipe ${i + 1}/${formattedRecipes.length} complete`);
      } else {
        recipesWithImages.push({
          ...recipe,
          imageUrl: undefined,
        });
      }
    }

    console.log(`\nAll recipes with images generated successfully`);
    return { success: true, data: recipesWithImages };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal membuat resep";
    console.error("Error generating recipes:", error);
    return { success: false, error: errorMessage };
  }
}
