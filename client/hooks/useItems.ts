import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  itemsApi,
  ItemsListParams,
  ItemFormData,
  ItemsListResponse,
  ItemDetailResponse,
} from "@/lib/api";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const itemKeys = {
  all: ["items"] as const,
  lists: () => [...itemKeys.all, "list"] as const,
  list: (params: ItemsListParams) => [...itemKeys.lists(), params] as const,
  mine: (params?: object) => [...itemKeys.all, "mine", params] as const,
  details: () => [...itemKeys.all, "detail"] as const,
  detail: (id: string) => [...itemKeys.details(), id] as const,
};

// ─── Read hooks ───────────────────────────────────────────────────────────────

/** Public items list (explore page) */
export function useItems(params?: ItemsListParams) {
  return useQuery<ItemsListResponse>({
    queryKey: itemKeys.list(params ?? {}),
    queryFn: () => itemsApi.list(params).then((r) => r.data),
  });
}

/** Single item + related (details page) */
export function useItem(id: string) {
  return useQuery<ItemDetailResponse>({
    queryKey: itemKeys.detail(id),
    queryFn: () => itemsApi.getById(id).then((r) => r.data),
    enabled: Boolean(id),
  });
}

/** Owner's items (manage page) */
export function useMyItems(params?: { page?: number; limit?: number }) {
  return useQuery<ItemsListResponse>({
    queryKey: itemKeys.mine(params),
    queryFn: () => itemsApi.mine(params).then((r) => r.data),
  });
}

// ─── Mutation hooks ───────────────────────────────────────────────────────────

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ItemFormData) => itemsApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: itemKeys.lists() });
      qc.invalidateQueries({ queryKey: itemKeys.mine() });
    },
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemFormData> }) =>
      itemsApi.update(id, data).then((r) => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: itemKeys.lists() });
      qc.invalidateQueries({ queryKey: itemKeys.mine() });
      qc.invalidateQueries({ queryKey: itemKeys.detail(id) });
    },
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itemsApi.remove(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: itemKeys.lists() });
      qc.invalidateQueries({ queryKey: itemKeys.mine() });
    },
  });
}
