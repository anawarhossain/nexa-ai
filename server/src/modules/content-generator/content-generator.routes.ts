import { Router } from "express";
import { contentGeneratorController } from "./content-generator.controller";
import { authGuard } from "../../core/middleware/authGuard";
import { requireFields, generationRateLimit } from "../../core/middleware/validation";

const router = Router();

// All content-generator routes are protected
router.use(authGuard);

router.post(
  "/generate",
  requireFields(["contentType", "topic", "tone", "length"]),
  generationRateLimit,
  contentGeneratorController.generate
);

router.post(
  "/regenerate/:id",
  generationRateLimit,
  contentGeneratorController.regenerate
);

router.get("/history", contentGeneratorController.history);
router.get("/history/:id", contentGeneratorController.getOne);

export default router;
