import { NextRequest, NextResponse } from "next/server";

// Gemini model for image generation (via Google AI Studio)
const GEMINI_IMAGE_MODELS = [
  "gemini-2.5-flash-image",
  "gemini-3.1-flash-image-preview",
  "gemini-3-pro-image-preview",
];

// Generate image using Gemini with IMAGE modality, falling back to Pollinations AI on failure
async function generateImageWithGemini(
  apiKey: string,
  imagePrompt: string,
  recipeName?: string,
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  console.log(`[Image API] Generating image URL for: ${recipeName || "recipe"} (Free Tier - Pollinations AI)...`);
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
    console.log(`✅ Successfully generated local proxy URL: ${proxyUrl}`);
    return {
      success: true,
      imageUrl: proxyUrl,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return {
      success: false,
      error: `Failed to generate proxy image URL: ${errorMessage}`,
    };
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { imagePrompt, recipeName } = await req.json();

    if (!imagePrompt) {
      return NextResponse.json(
        { error: "Image prompt is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GOOGLE_AI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    console.log(`🎨 Generating image for: ${recipeName || "recipe"}`);

    const result = await generateImageWithGemini(apiKey, imagePrompt, recipeName);

    if (result.success && result.imageUrl) {
      return NextResponse.json({ success: true, imageUrl: result.imageUrl });
    }

    // Gemini failed — return error but don't crash
    console.warn(
      `⚠️ Failed to generate image for "${recipeName || "recipe"}": ${result.error}`,
    );
    return NextResponse.json(
      { error: result.error || "Failed to generate image" },
      { status: 502 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Generate image route error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
