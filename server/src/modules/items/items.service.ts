import { Item, IItem } from "./item.model";

export interface ItemListQuery {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  priority?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export const itemsService = {
  /** Public listing — search, filter, sort, paginate */
  async list(query: ItemListQuery) {
    const {
      page = 1,
      limit = 12,
      q,
      category,
      priority,
      sortBy = "createdAt",
      order = "desc",
    } = query;

    const filter: Record<string, unknown> = {};
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Item.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Item.countDocuments(filter),
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

  /** Single item by id */
  async findById(id: string) {
    return Item.findById(id).lean();
  },

  /** Related items — same category, different id */
  async findRelated(id: string, category: string, limit = 4) {
    return Item.find({ _id: { $ne: id }, category }).limit(limit).lean();
  },

  /** Create a new item */
  async create(data: Partial<IItem>) {
    return Item.create(data);
  },

  /** Update — ownership enforced */
  async update(id: string, ownerId: string, data: Partial<IItem>) {
    const item = await Item.findOneAndUpdate(
      { _id: id, ownerId },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!item) {
      throw new Error("Item not found or you don't have permission to edit it.");
    }
    return item;
  },

  /** Delete — ownership enforced */
  async remove(id: string, ownerId: string) {
    const item = await Item.findOneAndDelete({ _id: id, ownerId });
    if (!item) {
      throw new Error("Item not found or you don't have permission to delete it.");
    }
    return item;
  },

  /** All items owned by a specific user */
  async listByOwner(ownerId: string, query: ItemListQuery) {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
    } = query;

    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Item.find({ ownerId })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Item.countDocuments({ ownerId }),
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
};
