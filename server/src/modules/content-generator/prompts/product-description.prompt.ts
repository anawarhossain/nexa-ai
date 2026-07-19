export interface ProductDescriptionPromptVars {
  topic: string;
  tone: string;
  wordCount: number;
}

/**
 * Builds a conversion-optimised product description prompt.
 * Output: headline + short description + bullet benefits + CTA.
 */
export function buildProductDescriptionPrompt({
  topic,
  tone,
  wordCount,
}: ProductDescriptionPromptVars): string {
  return `You are an expert e-commerce copywriter who specialises in conversion optimisation.

Write a compelling product description for the following product or service.

PRODUCT / SERVICE: ${topic}
TONE: ${tone}
TARGET LENGTH: approximately ${wordCount} words

STRUCTURE (in this order):
1. A punchy headline (max 10 words)
2. A short opening paragraph (2-3 sentences) that hooks the reader by addressing their core desire or pain point
3. 4-6 bullet points highlighting key benefits (not just features — explain WHY each matters)
4. A closing paragraph that reinforces trust and urgency
5. A short, direct call-to-action sentence

TONE GUIDE: Write in a ${tone} voice. Avoid hype words like "revolutionary", "game-changing", or "best-in-class" — use specific, credible language instead.

Output ONLY the product description. Do not include headers like "Headline:" or "Bullets:". Format bullets with a dash (-).

Begin now:`;
}
