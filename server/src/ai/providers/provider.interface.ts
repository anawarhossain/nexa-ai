/**
 * Provider-agnostic AI interface.
 * যেকোনো নতুন provider (OpenAI, Claude, Groq) এই interface implement করলেই
 * agent-engine.ts কোনো পরিবর্তন ছাড়াই কাজ করবে।
 */

export interface GenerateOptions {
  /** Model temperature: 0 = deterministic, 1 = creative */
  temperature?: number;
  /** Max output tokens */
  maxTokens?: number;
}

export interface AIResponse {
  text: string;
  /** Approximate word count of the generated text */
  wordCount: number;
  /** Provider that generated the response */
  provider: string;
  /** Model used */
  model: string;
}

export interface AIProvider {
  readonly name: string;
  readonly defaultModel: string;

  generate(prompt: string, options?: GenerateOptions): Promise<AIResponse>;
}
