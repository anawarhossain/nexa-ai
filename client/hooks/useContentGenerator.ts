import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  contentGeneratorApi,
  GenerateRequest,
  GenerateResponse,
  HistoryResponse,
} from "@/lib/api";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const cgKeys = {
  history: (params?: object) => ["content-generator", "history", params] as const,
  detail: (id: string) => ["content-generator", "detail", id] as const,
};

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Generate new content — returns generation + agent steps */
export function useGenerate() {
  const qc = useQueryClient();
  return useMutation<GenerateResponse, Error, GenerateRequest>({
    mutationFn: (data) =>
      contentGeneratorApi.generate(data).then((r) => r.data),
    onSuccess: () => {
      // Invalidate history so the new item appears immediately
      qc.invalidateQueries({ queryKey: ["content-generator", "history"] });
    },
  });
}

/** Regenerate from an existing generation's id */
export function useRegenerate() {
  const qc = useQueryClient();
  return useMutation<GenerateResponse, Error, string>({
    mutationFn: (id) =>
      contentGeneratorApi.regenerate(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content-generator", "history"] });
    },
  });
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Paginated generation history */
export function useGenerationHistory(params?: { page?: number; limit?: number }) {
  return useQuery<HistoryResponse>({
    queryKey: cgKeys.history(params),
    queryFn: () =>
      contentGeneratorApi.history(params).then((r) => r.data),
  });
}

/** Single generation detail */
export function useGenerationDetail(id: string) {
  return useQuery({
    queryKey: cgKeys.detail(id),
    queryFn: () =>
      contentGeneratorApi.getOne(id).then((r) => r.data.generation),
    enabled: Boolean(id),
  });
}
