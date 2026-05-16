"use server";

import { sanitizeAIResponse } from "@/utils/sanitize";

export async function generateRecipes(prompt: string) {
  try {
    const apiKey = process.env.GOOGLE_AI_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_AI_KEY is not defined in environment variables");
    }

    const systemInstruction = `You are a recipe API. You MUST output ONLY raw JSON with no markdown formatting, no explanations, and no greetings.

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
      "procedure": ["Step 1", "Step 2"]
    }
  ]
}

Generate exactly 3 unique recipes that are ALL relevant to the user's request, in the SAME LANGUAGE as the user's request.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                recipes: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      id: { type: "STRING" },
                      name: { type: "STRING" },
                      description: { type: "STRING" },
                      prepTime: { type: "STRING" },
                      difficulty: { type: "STRING" },
                      servings: { type: "STRING" },
                      ingredients: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                      },
                      procedure: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                      },
                    },
                    required: [
                      "id",
                      "name",
                      "description",
                      "prepTime",
                      "difficulty",
                      "servings",
                      "ingredients",
                      "procedure",
                    ],
                  },
                },
              },
              required: ["recipes"],
            },
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini 2.5 Flash Error Body:", errorText);
      throw new Error(`Google API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated from Gemini 2.5 Flash");
    }

    const text = sanitizeAIResponse(data.candidates[0].content.parts[0].text);

    let parsedData: any;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError: any) {
      console.error("Raw AI response text:", text);
      console.error("JSON parse error:", parseError.message);
      throw new Error(
        `AI mengembalikan format JSON yang tidak valid. Silakan coba lagi.`,
      );
    }

    const recipes = parsedData.recipes || parsedData;

    if (!Array.isArray(recipes)) {
      throw new Error("AI did not return an array of recipes");
    }

    // Assign unique IDs just in case the AI generated the same IDs
    const formattedRecipes = recipes.map((recipe: any, index: number) => ({
      ...recipe,
      id: `rec-ai-${Date.now()}-${index}`,
      image: "/assets/cake/macaron.svg",
    }));

    return { success: true, data: formattedRecipes };
  } catch (error: any) {
    console.error("Error generating recipes:", error);
    return { success: false, error: error.message || "Gagal membuat resep" };
  }
}
