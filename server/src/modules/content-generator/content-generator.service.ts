import { ContentGeneration } from "./content-generation.model";
import * as agentEngine from "../../ai/agent-engine";
import type { ContentType, Tone, Length } from "../../ai/agent-engine";

export interface GenerateParams {
  userId: string;
  contentType: ContentType;
  topic: string;
  tone: Tone;
  length: Length;
}

export const contentGeneratorService = {
  /** Run a new generation and persist to DB */
  async generate(params: GenerateParams) {
    const result = await agentEngine.run({
      contentType: params.contentType,
      topic: params.topic,
      tone: params.tone,
      length: params.length,
    });

    const doc = await ContentGeneration.create({
      userId: params.userId,
      contentType: params.contentType,
      topic: params.topic,
      tone: params.tone,
      length: params.length,
      prompt: result.prompt,
      generatedText: result.text,
      wordCount: result.wordCount,
    });

    return { generation: doc, steps: result.steps };
  },

  /** Regenerate using the saved prompt of an existing generation */
  async regenerate(generationId: string, userId: string) {
    const existing = await ContentGeneration.findOne({
      _id: generationId,
      userId,
    });

    if (!existing) {
      throw new Error("Generation not found or access denied.");
    }

    const result = await agentEngine.rerun(existing.prompt, existing.tone);

    // Save the new generation as a sibling record
    const doc = await ContentGeneration.create({
      userId,
      contentType: existing.contentType,
      topic: existing.topic,
      tone: existing.tone,
      length: existing.length,
      prompt: existing.prompt,
      generatedText: result.text,
      wordCount: result.wordCount,
    });

    return { generation: doc, steps: result.steps };
  },

  /** Paginated history for a specific user */
  async getHistory(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ContentGeneration.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-prompt") // prompt can be large, skip in list view
        .lean(),
      ContentGeneration.countDocuments({ userId }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  },

  /** Get a single generation (full, including prompt) */
  async getOne(generationId: string, userId: string) {
    const doc = await ContentGeneration.findOne({
      _id: generationId,
      userId,
    }).lean();

    if (!doc) throw new Error("Generation not found.");
    return doc;
  },
};
