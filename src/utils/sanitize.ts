/**
 * Sanitize and extract valid JSON from an AI response string.
 * This handles common issues like markdown code blocks, surrounding text, 
 * trailing commas, ellipsis, and invalid control characters.
 */
export function sanitizeAIResponse(text: string): string {
  let sanitized = text;

  // 1. Clean potential markdown code fences (even if responseMimeType is set)
  sanitized = sanitized
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // 2. Attempt to extract JSON object if there's surrounding text
  const startIndex = sanitized.indexOf("{");
  const endIndex = sanitized.lastIndexOf("}");

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    sanitized = sanitized.substring(startIndex, endIndex + 1);
  }

  // 3. Sanitize common JSON issues from LLM output
  // Remove trailing commas before } or ]
  sanitized = sanitized.replace(/,\s*([}\]])/g, "$1");
  
  // Remove ellipsis in arrays or objects (e.g., [...] or "...")
  sanitized = sanitized.replace(/,?\s*\.{3}\s*/g, "");
  
  // 4. Remove control characters that break JSON parsing (except common whitespace)
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, (char: string) =>
    char === "\n" || char === "\r" || char === "\t" ? char : ""
  );

  return sanitized;
}
