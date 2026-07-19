import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider, AIResponse, GenerateOptions } from "./provider.interface";
import { env } from "../../core/config/env";

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  readonly defaultModel = "gemini-2.0-flash";

  private readonly client: GoogleGenerativeAI;

  constructor() {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    this.client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  async generate(prompt: string, options: GenerateOptions = {}): Promise<AIResponse> {
    const { temperature = 0.7, maxTokens = 4096 } = options;

    const model = this.client.getGenerativeModel({
      model: this.defaultModel,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const wordCount = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;

    return {
      text,
      wordCount,
      provider: this.name,
      model: this.defaultModel,
    };
  }
}

/** Returns a fresh provider instance so the latest API key is always used */
export function getGeminiProvider(): GeminiProvider {
  return new GeminiProvider();
}
