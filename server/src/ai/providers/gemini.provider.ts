import { GoogleGenerativeAI, GoogleGenerativeAIFetchError, GoogleGenerativeAIRequestInputError } from "@google/generative-ai";
import type { AIProvider, AIResponse, GenerateOptions } from "./provider.interface";
import { env } from "../../core/config/env";

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 3_000;
const REQUEST_TIMEOUT_MS = 30_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(err: unknown): boolean {
  if (err instanceof GoogleGenerativeAIFetchError) {
    const status = err.status ?? 0;
    return status === 429 || status >= 500;
  }
  if (err instanceof GoogleGenerativeAIRequestInputError) {
    return false;
  }
  return true;
}

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  readonly defaultModel = "gemini-3.5-flash";

  private readonly client: GoogleGenerativeAI;

  constructor() {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    this.client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  async generate(prompt: string, options: GenerateOptions = {}): Promise<AIResponse> {
    const { temperature = 0.7, maxTokens = 4096 } = options;

    const model = this.client.getGenerativeModel(
      {
        model: this.defaultModel,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      },
      { timeout: REQUEST_TIMEOUT_MS },
    );

    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        await sleep(backoff);
      }

      try {
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
      } catch (err) {
        if (!isRetryable(err)) throw err;
        lastError = err;
      }
    }

    throw lastError;
  }
}

/** Returns a fresh provider instance so the latest API key is always used */
export function getGeminiProvider(): GeminiProvider {
  return new GeminiProvider();
}
