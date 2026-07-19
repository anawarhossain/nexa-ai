import { getGeminiProvider } from "./providers/gemini.provider";
import { buildBlogPrompt } from "../modules/content-generator/prompts/blog.prompt";
import { buildProductDescriptionPrompt } from "../modules/content-generator/prompts/product-description.prompt";
import { buildDocumentationPrompt } from "../modules/content-generator/prompts/documentation.prompt";
import { buildSocialPostPrompt } from "../modules/content-generator/prompts/social-post.prompt";
import type { AIResponse } from "./providers/provider.interface";

export type ContentType =
  | "blog"
  | "product-description"
  | "documentation"
  | "social-post";

export type Tone =
  | "Professional"
  | "Casual"
  | "Creative"
  | "Technical"
  | "Persuasive";

export type Length = "short" | "medium" | "long";

export interface AgentInput {
  contentType: ContentType;
  topic: string;
  tone: Tone;
  length: Length;
}

export interface AgentResult extends AIResponse {
  /** The fully-built prompt that was sent to the AI (useful for debugging/history) */
  prompt: string;
  /** Ordered list of step labels shown to the user */
  steps: AgentStep[];
}

export interface AgentStep {
  label: string;
  detail: string;
}

// ─── Word count targets ──────────────────────────────────────────────────────

const WORD_COUNTS: Record<Length, number> = {
  short: 300,
  medium: 600,
  long: 1000,
};

// ─── Temperature per tone ────────────────────────────────────────────────────

const TONE_TEMPERATURE: Record<Tone, number> = {
  Professional: 0.4,
  Casual: 0.65,
  Creative: 0.9,
  Technical: 0.3,
  Persuasive: 0.7,
};

// ─── Agent Engine ────────────────────────────────────────────────────────────

/**
 * run() — orchestrates the 4-step agentic pipeline:
 *   Step 1: Parse & validate input
 *   Step 2: Select template + build prompt
 *   Step 3: Call AI provider
 *   Step 4: Structure & return output
 */
export async function run(input: AgentInput): Promise<AgentResult> {
  const steps: AgentStep[] = [];

  // ── Step 1: Parse input ──────────────────────────────────────────────────
  steps.push({
    label: "Analysing request",
    detail: `Content type: ${input.contentType} | Tone: ${input.tone} | Length: ${input.length}`,
  });

  const { contentType, topic, tone, length } = input;
  const wordCount = WORD_COUNTS[length];
  const temperature = TONE_TEMPERATURE[tone];

  // ── Step 2: Build prompt ─────────────────────────────────────────────────
  const vars = { topic, tone, wordCount };
  let prompt: string;

  switch (contentType) {
    case "blog":
      prompt = buildBlogPrompt(vars);
      break;
    case "product-description":
      prompt = buildProductDescriptionPrompt(vars);
      break;
    case "documentation":
      prompt = buildDocumentationPrompt(vars);
      break;
    case "social-post":
      prompt = buildSocialPostPrompt(vars);
      break;
    default:
      throw new Error(`Unknown content type: ${contentType}`);
  }

  steps.push({
    label: "Building prompt",
    detail: `Using ${contentType} template → targeting ~${wordCount} words`,
  });

  // ── Step 3: Call AI ──────────────────────────────────────────────────────
  steps.push({
    label: "Calling AI model",
    detail: `Gemini 1.5 Flash | temperature=${temperature}`,
  });

  const provider = getGeminiProvider();
  const response = await provider.generate(prompt, { temperature, maxTokens: 4096 });

  // ── Step 4: Structure output ─────────────────────────────────────────────
  steps.push({
    label: "Structuring output",
    detail: `Generated ${response.wordCount} words`,
  });

  return {
    ...response,
    prompt,
    steps,
  };
}

/**
 * rerun() — regenerate with the same prompt (different temperature jitter).
 * Used by the "Regenerate" button on the frontend.
 */
export async function rerun(
  originalPrompt: string,
  tone: Tone
): Promise<AgentResult> {
  const steps: AgentStep[] = [
    { label: "Reusing request parameters", detail: "Same topic and settings" },
    { label: "Re-building prompt", detail: "Identical template, fresh call" },
    { label: "Calling AI model", detail: "New generation with slight temperature jitter" },
  ];

  // Add a small jitter so the output is meaningfully different
  const baseTemp = TONE_TEMPERATURE[tone];
  const jitter = (Math.random() - 0.5) * 0.2; // ±0.1
  const temperature = Math.min(1, Math.max(0, baseTemp + jitter));

  const provider = getGeminiProvider();
  const response = await provider.generate(originalPrompt, {
    temperature,
    maxTokens: 4096,
  });

  steps.push({
    label: "Structuring output",
    detail: `Regenerated ${response.wordCount} words`,
  });

  return { ...response, prompt: originalPrompt, steps };
}
