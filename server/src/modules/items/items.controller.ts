import { Request, Response } from "express";
import { itemsService } from "./items.service";
import { AuthenticatedRequest } from "../../core/middleware/authGuard";

export const itemsController = {
  /** GET /api/items — public, paginated list */
  async list(req: Request, res: Response) {
    try {
      const result = await itemsService.list({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 12,
        q: req.query.q as string | undefined,
        category: req.query.category as string | undefined,
        priority: req.query.priority as string | undefined,
        sortBy: (req.query.sortBy as string) || "createdAt",
        order: (req.query.order as "asc" | "desc") || "desc",
      });
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to fetch items." });
    }
  },

  /** GET /api/items/:id — public, single item + related */
  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const item = await itemsService.findById(id);
      if (!item) {
        return res.status(404).json({ success: false, message: "Item not found." });
      }
      const related = await itemsService.findRelated(
        id,
        (item as any).category
      );
      res.json({ success: true, item, related });
    } catch (err: any) {
      // Mongoose CastError — invalid ObjectId format
      if (err.name === "CastError") {
        return res.status(400).json({ success: false, message: "Invalid item ID format." });
      }
      res.status(500).json({ success: false, message: "Failed to fetch item." });
    }
  },


  /** GET /api/items/mine — protected, owner's items */
  async myItems(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await itemsService.listByOwner(req.user!.id, {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        sortBy: (req.query.sortBy as string) || "createdAt",
        order: (req.query.order as "asc" | "desc") || "desc",
      });
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to fetch your items." });
    }
  },

  /** POST /api/items — protected */
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const item = await itemsService.create({
        ...req.body,
        ownerId: req.user!.id,
        ownerName: req.user!.name,
      });
      res.status(201).json({ success: true, item });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || "Failed to create item.",
      });
    }
  },

  /** PUT /api/items/:id — protected, owner only */
  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const item = await itemsService.update(String(req.params.id), req.user!.id, req.body);
      res.json({ success: true, item });
    } catch (err: any) {
      const status = err.message?.includes("not found") ? 404 : 400;
      res.status(status).json({ success: false, message: err.message });
    }
  },

  /** DELETE /api/items/:id — protected, owner only */
  async remove(req: AuthenticatedRequest, res: Response) {
    try {
      await itemsService.remove(String(req.params.id), req.user!.id);
      res.json({ success: true, message: "Item deleted successfully." });
    } catch (err: any) {
      const status = err.message?.includes("not found") ? 404 : 400;
      res.status(status).json({ success: false, message: err.message });
    }
  },
};
