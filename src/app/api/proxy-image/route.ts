import { NextRequest, NextResponse } from "next/server";

let lastRequestTime = 0;
const MIN_INTERVAL = 3000;

// Helper function to fetch with retry and exponential backoff
async function fetchWithRetry(url: string, retries = 4, delay = 2000): Promise<Response> {
  let currentUrl = url;
  let lastStatus = 200;
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[Proxy Image] Outbound attempt ${i + 1} to: ${currentUrl}`);
      const res = await fetch(currentUrl, {
        signal: AbortSignal.timeout(15000), // 15s timeout
      });

      lastStatus = res.status;

      // If rate-limited (402 Payment Required or 429 Too Many Requests), wait and retry
      if ((res.status === 402 || res.status === 429) && i < retries - 1) {
        // Fall back to turbo model to bypass rate limit
        if (currentUrl.includes("model=flux")) {
          currentUrl = currentUrl.replace("model=flux", "model=turbo");
          console.warn(`[Proxy Image] Rate limited (Status ${res.status}). Switching to turbo model for next attempt: ${currentUrl}`);
        }
        
        const jitter = Math.floor(Math.random() * 1000); // add jitter to prevent requests staying in sync
        const waitTime = delay * Math.pow(1.5, i) + jitter;
        console.warn(`[Proxy Image] Rate limited (Status ${res.status}) on attempt ${i + 1}. Retrying in ${Math.round(waitTime)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      return res;
    } catch (err) {
      if (i < retries - 1) {
        if (currentUrl.includes("model=flux")) {
          currentUrl = currentUrl.replace("model=flux", "model=turbo");
          console.warn(`[Proxy Image] Error on flux attempt. Switching to turbo model for next attempt: ${currentUrl}`);
        }
        const waitTime = delay * Math.pow(1.5, i);
        console.warn(`[Proxy Image] Fetch error on attempt ${i + 1}:`, err, `. Retrying in ${Math.round(waitTime)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }
      throw err;
    }
  }
  
  return new Response(`Max retries reached. Last status: ${lastStatus}`, { status: lastStatus });
}

// Map Indonesian recipe keywords to high-probability English food tags for LoremFlickr to ensure no cats are returned
function getFallbackKeywords(recipeName: string): string {
  const name = recipeName.toLowerCase();
  const tags: string[] = [];
  
  if (name.includes("cokelat") || name.includes("coklat") || name.includes("chocolate")) {
    tags.push("chocolate");
  }
  if (name.includes("keju") || name.includes("cheese")) {
    tags.push("cheese");
  }
  if (name.includes("pandan")) {
    tags.push("pandan");
  }
  if (name.includes("taro") || name.includes("talas") || name.includes("purple")) {
    tags.push("taro");
  }
  if (name.includes("pisang") || name.includes("banana")) {
    tags.push("banana");
  }
  if (name.includes("strawberry") || name.includes("stroberi")) {
    tags.push("strawberry");
  }
  if (name.includes("matcha") || name.includes("green tea")) {
    tags.push("matcha");
  }
  if (name.includes("vanilla") || name.includes("vanila")) {
    tags.push("vanilla");
  }
  if (name.includes("madu") || name.includes("honey")) {
    tags.push("honey");
  }
  if (name.includes("gula merah") || name.includes("brown sugar") || name.includes("caramel") || name.includes("rangi")) {
    tags.push("caramel");
  }
  if (name.includes("kelapa") || name.includes("coconut")) {
    tags.push("coconut");
  }

  // Determine type of baked good
  if (name.includes("roti") || name.includes("bread")) {
    tags.push("bread");
  } else if (name.includes("donat") || name.includes("donut")) {
    tags.push("donut");
  } else if (name.includes("pancake") || name.includes("serabi") || name.includes("martabak") || name.includes("putu")) {
    tags.push("pancake");
  } else if (name.includes("biskuit") || name.includes("cookie") || name.includes("cookies")) {
    tags.push("cookie");
  } else if (name.includes("pudding") || name.includes("puding")) {
    tags.push("pudding");
  } else if (name.includes("pie") || name.includes("pai") || name.includes("tart")) {
    tags.push("pie");
  } else {
    tags.push("cake");
  }
  
  // Add general food tags to ensure standard matches
  tags.push("dessert");
  tags.push("baked");
  
  return Array.from(new Set(tags)).join(",");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Stagger parallel requests in Next.js to avoid Pollinations AI concurrent/rate limit blocks (402)
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < MIN_INTERVAL) {
    const waitTime = MIN_INTERVAL - timeSinceLast;
    lastRequestTime = now + waitTime; // reserve slot in future
    console.log(`[Proxy Image] Outbound rate limiter active. Staggering fetch to Pollinations AI by ${waitTime}ms...`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  } else {
    lastRequestTime = now;
  }

  try {
    console.log(`[Proxy Image] Fetching: ${url}`);
    const res = await fetchWithRetry(url);

    if (!res.ok) {
      console.error(`[Proxy Image] Failed to fetch image after retries: ${res.status}`);
      throw new Error(`Status ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[Proxy Image] Pollinations AI failed, executing LoremFlickr fallback...", error);

    // Parse keywords from the prompt URL to fetch a relevant high quality cake/bread photo
    let keyword = "cake,dessert";
    try {
      const urlObj = new URL(url);

      // Decode pathname completely to handle double URL encoding (e.g. %2520 -> %20 -> space)
      let decodedPath = urlObj.pathname;
      let prevPath = "";
      while (decodedPath !== prevPath) {
        prevPath = decodedPath;
        try {
          decodedPath = decodeURIComponent(decodedPath);
        } catch (e) {
          break;
        }
      }

      console.log(`[Proxy Image] Fully decoded prompt path: ${decodedPath}`);

      // Extract the recipe name / description from the prompt path (everything before the first comma)
      const promptMatch = decodedPath.match(/\/prompt\/([^,/?]+)/);
      if (promptMatch && promptMatch[1]) {
        const rawRecipeName = promptMatch[1];
        keyword = getFallbackKeywords(rawRecipeName);
        console.log(`[Proxy Image] Extracted recipe name: "${rawRecipeName}" -> fallback keywords: "${keyword}"`);
      }
    } catch (e) {
      console.warn("[Proxy Image] Failed to extract keywords for fallback:", e);
    }

    const encodedKeywords = keyword
      .split(",")
      .map(w => encodeURIComponent(w.trim()))
      .join(",");

    const fallbackUrl = `https://loremflickr.com/1024/768/${encodedKeywords},baked,food`;
    console.log(`[Proxy Image] Fetching LoremFlickr fallback URL: ${fallbackUrl}`);

    try {
      const fallbackRes = await fetch(fallbackUrl, {
        signal: AbortSignal.timeout(10000),
      });

      if (fallbackRes.ok) {
        const contentType = fallbackRes.headers.get("content-type") || "image/jpeg";
        const buffer = await fallbackRes.arrayBuffer();

        console.log(`[Proxy Image] Fallback successful! Serving image with content-type: ${contentType}`);
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "no-cache, no-store, must-revalidate", // Do not cache fallbacks permanently
          },
        });
      }
    } catch (fallbackErr) {
      console.error("[Proxy Image] LoremFlickr fallback failed:", fallbackErr);
    }

    return new NextResponse("Error fetching image", { status: 500 });
  }
}
