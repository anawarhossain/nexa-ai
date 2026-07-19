import { Router } from "express";
import { itemsController } from "./items.controller";
import { authGuard } from "../../core/middleware/authGuard";
import { requireFields } from "../../core/middleware/validation";

const router = Router();

// ⚠️ /mine must be registered BEFORE /:id to avoid Express matching "mine" as an id
router.get("/mine", authGuard, itemsController.myItems);

router.get("/", itemsController.list);
router.get("/:id", itemsController.getById);

router.post(
  "/",
  authGuard,
  requireFields(["title", "shortDescription", "fullDescription", "category"]),
  itemsController.create
);

router.put("/:id", authGuard, itemsController.update);
router.delete("/:id", authGuard, itemsController.remove);

export default router;
