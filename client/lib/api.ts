import axios from "axios";

/**
 * Shared Axios instance — সব API call এর জন্য।
 * withCredentials: true দেওয়া আছে তাই Better Auth এর session cookie
 * প্রতিটা request এ পাঠানো হবে।
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ─── Items API ────────────────────────────────────────────────────────────────

export interface ItemsListParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  priority?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export const itemsApi = {
  list: (params?: ItemsListParams) =>
    api.get<ItemsListResponse>("/api/items", { params }),

  getById: (id: string) =>
    api.get<ItemDetailResponse>(`/api/items/${id}`),

  mine: (params?: Omit<ItemsListParams, "q" | "category" | "priority">) =>
    api.get<ItemsListResponse>("/api/items/mine", { params }),

  create: (data: ItemFormData) =>
    api.post<{ success: boolean; item: Item }>("/api/items", data),

  update: (id: string, data: Partial<ItemFormData>) =>
    api.put<{ success: boolean; item: Item }>(`/api/items/${id}`, data),

  remove: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/items/${id}`),
};

// ─── Types (shared between hooks and components) ──────────────────────────────

export interface Item {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  category: "Prompt" | "Tutorial" | "Tool" | "Template" | "Resource";
  priority: "low" | "medium" | "high";
  price: number;
  tags: string[];
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ItemsListResponse {
  success: boolean;
  items: Item[];
  pagination: Pagination;
}

export interface ItemDetailResponse {
  success: boolean;
  item: Item;
  related: Item[];
}

export interface ItemFormData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  category: Item["category"];
  priority: Item["priority"];
  price: number;
  tags: string[];
}

// ─── Content Generator API ────────────────────────────────────────────────────

export type ContentType =
  | "blog"
  | "product-description"
  | "documentation"
  | "social-post";

export type Tone =
  | "Professional"
  | "Casual"
  | "Creative"
  | "Technical"
  | "Persuasive";

export type GenerationLength = "short" | "medium" | "long";

export interface GenerateRequest {
  contentType: ContentType;
  topic: string;
  tone: Tone;
  length: GenerationLength;
}

export interface AgentStep {
  label: string;
  detail: string;
}

export interface Generation {
  _id: string;
  userId: string;
  contentType: ContentType;
  topic: string;
  tone: Tone;
  length: GenerationLength;
  generatedText: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateResponse {
  success: boolean;
  generation: Generation;
  steps: AgentStep[];
}

export interface HistoryResponse {
  success: boolean;
  items: Generation[];
  pagination: Pagination;
}

export const contentGeneratorApi = {
  generate: (data: GenerateRequest) =>
    api.post<GenerateResponse>("/api/content-generator/generate", data),

  regenerate: (id: string) =>
    api.post<GenerateResponse>(`/api/content-generator/regenerate/${id}`),

  history: (params?: { page?: number; limit?: number }) =>
    api.get<HistoryResponse>("/api/content-generator/history", { params }),

  getOne: (id: string) =>
    api.get<{ success: boolean; generation: Generation }>(
      `/api/content-generator/history/${id}`
    ),
};
