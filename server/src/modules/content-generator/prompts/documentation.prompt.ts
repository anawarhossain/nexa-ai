export interface DocumentationPromptVars {
  topic: string;
  tone: string;
  wordCount: number;
}

/**
 * Builds a technical documentation prompt.
 * Output: overview, prerequisites, step-by-step guide, code examples, troubleshooting.
 */
export function buildDocumentationPrompt({
  topic,
  tone,
  wordCount,
}: DocumentationPromptVars): string {
  return `You are a senior technical writer who creates clear, accurate developer documentation.

Write technical documentation for the following topic.

TOPIC: ${topic}
TONE: ${tone} (adapt this for technical writing — even "casual" should remain precise and scannable)
TARGET LENGTH: approximately ${wordCount} words

DOCUMENTATION STRUCTURE:
1. **Overview** — 2-3 sentences explaining what this is and why it matters
2. **Prerequisites** — a short bulleted list of what the reader needs before starting (knowledge, tools, access)
3. **How it works** — a conceptual explanation of the mechanism or architecture (non-steps)
4. **Step-by-step guide** — numbered steps with clear actions; include inline code snippets where relevant (use backticks for inline code, triple backticks for blocks)
5. **Common errors & troubleshooting** — 2-3 realistic error scenarios with causes and fixes
6. **Next steps** — 2-3 suggestions for what to explore after completing this guide

FORMATTING RULES:
- Use ## for section headings
- Use \`code\` for commands, file paths, and identifiers
- Use numbered lists for sequential steps, bullet lists for non-sequential items
- Do NOT include a table of contents
- Output ONLY the documentation body

Begin now:`;
}
