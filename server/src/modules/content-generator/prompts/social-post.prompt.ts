export interface SocialPostPromptVars {
  topic: string;
  tone: string;
  wordCount: number;
}

/**
 * Builds a multi-platform social media post prompt.
 * Output: LinkedIn post + Twitter/X thread + Instagram caption.
 */
export function buildSocialPostPrompt({
  topic,
  tone,
  wordCount,
}: SocialPostPromptVars): string {
  return `You are an expert social media strategist and copywriter who creates high-engagement content.

Write social media posts for the following topic.

TOPIC: ${topic}
TONE: ${tone}
TOTAL LENGTH: approximately ${wordCount} words across all posts

Create THREE variations:

---
LINKEDIN POST
---
- Length: 150-250 words
- Open with a bold first line (this is the hook — it must make people click "see more")
- Share a specific insight, lesson, or perspective — not generic advice
- Use short paragraphs (1-3 lines max) for mobile readability
- End with a question to drive comments
- Include 3-5 relevant hashtags at the end
- Tone: ${tone}, but professional

---
TWITTER / X THREAD
---
- Write a 3-tweet thread
- Tweet 1: The hook (max 200 chars, creates curiosity or states a surprising fact)
- Tweet 2: The context or evidence
- Tweet 3: The takeaway or call to action
- Format as: [1/3], [2/3], [3/3]
- Keep each tweet under 250 characters

---
INSTAGRAM CAPTION
---
- Length: 80-120 words
- Start with an attention-grabbing emoji + sentence
- Conversational, warm, and ${tone}
- End with a CTA ("Save this for later", "Drop a comment", "Tag someone who needs this")
- Include a line break before hashtags
- Include 8-10 hashtags

Output the three sections with their headings. Begin now:`;
}
