import { Schema, model, models, Document } from "mongoose";
import type { ContentType, Tone, Length } from "../../ai/agent-engine";

export interface IContentGeneration extends Document {
  userId: string;
  contentType: ContentType;
  topic: string;
  tone: Tone;
  length: Length;
  /** The full built prompt sent to Gemini */
  prompt: string;
  /** Gemini output text */
  generatedText: string;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const contentGenerationSchema = new Schema<IContentGeneration>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    contentType: {
      type: String,
      enum: ["blog", "product-description", "documentation", "social-post"],
      required: true,
    },
    topic: {
      type: String,
      required: true,
      maxlength: 300,
    },
    tone: {
      type: String,
      enum: ["Professional", "Casual", "Creative", "Technical", "Persuasive"],
      required: true,
    },
    length: {
      type: String,
      enum: ["short", "medium", "long"],
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    generatedText: {
      type: String,
      required: true,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, collection: "content_generations" }
);

export const ContentGeneration =
  models.ContentGeneration ||
  model<IContentGeneration>("ContentGeneration", contentGenerationSchema);
