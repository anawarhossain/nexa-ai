import { Response } from "express";
import { contentGeneratorService } from "./content-generator.service";
import type { AuthenticatedRequest } from "../../core/middleware/authGuard";

export const contentGeneratorController = {
  /** POST /api/content-generator/generate */
  async generate(req: AuthenticatedRequest, res: Response) {
    try {
      const { contentType, topic, tone, length } = req.body;

      if (!contentType || !topic || !tone || !length) {
        return res.status(400).json({
          success: false,
          message: "contentType, topic, tone, and length are required.",
        });
      }

      const result = await contentGeneratorService.generate({
        userId: req.user!.id,
        contentType,
        topic,
        tone,
        length,
      });

      res.status(201).json({
        success: true,
        generation: result.generation,
        steps: result.steps,
      });
    } catch (err: any) {
      console.error("[content-generator] generate error:", err.message);
      res.status(500).json({
        success: false,
        message:
          err.message?.includes("GEMINI_API_KEY")
            ? "AI provider is not configured. Please contact the administrator."
            : "Failed to generate content. Please try again.",
      });
    }
  },

  /** POST /api/content-generator/regenerate/:id */
  async regenerate(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await contentGeneratorService.regenerate(
        String(req.params.id),
        req.user!.id
      );

      res.status(201).json({
        success: true,
        generation: result.generation,
        steps: result.steps,
      });
    } catch (err: any) {
      console.error("[content-generator] regenerate error:", err.message);
      const status = err.message?.includes("not found") ? 404 : 500;
      res.status(status).json({
        success: false,
        message: err.message || "Failed to regenerate content.",
      });
    }
  },

  /** GET /api/content-generator/history */
  async history(req: AuthenticatedRequest, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await contentGeneratorService.getHistory(
        req.user!.id,
        page,
        limit
      );

      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch generation history.",
      });
    }
  },

  /** GET /api/content-generator/history/:id */
  async getOne(req: AuthenticatedRequest, res: Response) {
    try {
      const doc = await contentGeneratorService.getOne(
        String(req.params.id),
        req.user!.id
      );
      res.json({ success: true, generation: doc });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  },
};
