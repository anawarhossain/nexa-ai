export interface BlogPromptVars {
  topic: string;
  tone: string;
  wordCount: number;
}

/**
 * Builds a structured blog post prompt.
 * Output: full article with intro, H2 sections, conclusion.
 */
export function buildBlogPrompt({ topic, tone, wordCount }: BlogPromptVars): string {
  return `You are an expert content writer and SEO strategist.

Write a comprehensive, well-structured blog post about the following topic.

TOPIC: ${topic}
TONE: ${tone}
TARGET WORD COUNT: approximately ${wordCount} words

REQUIREMENTS:
- Start with a compelling hook in the introduction (2-3 sentences)
- Use 3-5 H2 section headings that are descriptive and keyword-rich
- Each section should have 2-4 substantive paragraphs
- Include a strong conclusion with a clear takeaway
- Write in a ${tone} tone throughout — be consistent
- Do NOT use filler phrases like "In conclusion", "It's important to note", or "As we can see"
- Do NOT include meta tags or SEO notes — just the article body
- Use active voice where possible
- Output ONLY the article text, starting with the title

Begin now:`;
}
