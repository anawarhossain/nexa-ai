import { Schema, model, models, Document } from "mongoose";

export const ITEM_CATEGORIES = [
  "Prompt",
  "Tutorial",
  "Tool",
  "Template",
  "Resource",
] as const;

export const ITEM_PRIORITIES = ["low", "medium", "high"] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];
export type ItemPriority = (typeof ITEM_PRIORITIES)[number];

export interface IItem extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  category: ItemCategory;
  priority: ItemPriority;
  price: number;
  tags: string[];
  ownerId: string;
  ownerName: string;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 300,
    },
    fullDescription: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ITEM_CATEGORIES,
      default: "Resource",
    },
    priority: {
      type: String,
      enum: ITEM_PRIORITIES,
      default: "medium",
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    ownerName: {
      type: String,
      default: "Anonymous",
    },
  },
  { timestamps: true, collection: "items" }
);

// Full-text search index
itemSchema.index({ title: "text", shortDescription: "text", tags: "text" });

export const Item = models.Item || model<IItem>("Item", itemSchema);
