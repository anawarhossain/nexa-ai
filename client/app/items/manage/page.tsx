"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FiGrid,
  FiList,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiTag,
  FiAlertCircle,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { useMyItems, useDeleteItem, useUpdateItem } from "@/hooks/useItems";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Item, ItemFormData } from "@/lib/api";

type ViewMode = "table" | "grid";

const categoryColor: Record<string, string> = {
  Prompt: "bg-signal/10 text-signal",
  Tutorial: "bg-pulse/10 text-pulse",
  Tool: "bg-ember/10 text-ember",
  Template: "bg-ink/8 text-ash",
  Resource: "bg-paper-soft text-ash",
};

const priorityDot: Record<string, string> = {
  high: "bg-signal",
  medium: "bg-ember",
  low: "bg-ash-soft",
};

export default function ManageItemsPage() {
  const router = useRouter();
  const { data: session, isPending: authPending } = authClient.useSession();

  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [page, setPage] = useState(1);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const deleteItem = useDeleteItem();

  // Edit state (inline modal)
  const [editTarget, setEditTarget] = useState<Item | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editPriority, setEditPriority] = useState<Item["priority"]>("medium");
  const updateItem = useUpdateItem();

  // Auth guard
  useEffect(() => {
    if (!authPending && !session) router.replace("/login");
  }, [session, authPending, router]);

  const { data, isLoading, isError } = useMyItems({ page, limit: 10 });
  const items = data?.items ?? [];
  const pagination = data?.pagination;

  function openEdit(item: Item) {
    setEditTarget(item);
    setEditTitle(item.title);
    setEditPrice(item.price);
    setEditPriority(item.priority);
  }

  async function handleUpdate() {
    if (!editTarget) return;
    await updateItem.mutateAsync({
      id: editTarget._id,
      data: {
        title: editTitle,
        price: editPrice,
        priority: editPriority,
      } as Partial<ItemFormData>,
    });
    setEditTarget(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteItem.mutateAsync(deleteTarget._id);
    setDeleteTarget(null);
  }

  if (authPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-signal">
            My Items
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
            Manage Items
          </h1>
          <p className="mt-1 text-sm text-ash">
            {pagination?.total ?? 0} item
            {(pagination?.total ?? 0) !== 1 ? "s" : ""} published
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid / Table toggle */}
          <div className="flex rounded-full border border-line bg-white p-1">
            <button
              id="view-table"
              onClick={() => setViewMode("table")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                viewMode === "table"
                  ? "bg-ink text-paper"
                  : "text-ash-soft hover:text-ink"
              )}
              aria-label="Table view"
            >
              <FiList className="h-4 w-4" />
            </button>
            <button
              id="view-grid"
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                viewMode === "grid"
                  ? "bg-ink text-paper"
                  : "text-ash-soft hover:text-ink"
              )}
              aria-label="Grid view"
            >
              <FiGrid className="h-4 w-4" />
            </button>
          </div>

          <Link
            href="/items/add"
            className={cn(buttonVariants({ variant: "accent", size: "sm" }))}
            id="add-item-btn"
          >
            <FiPlus className="h-4 w-4" /> Add item
          </Link>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ink">
          <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
          <span>Failed to load your items. Please refresh the page.</span>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl bg-paper-soft"
              />
            ))}
          </div>
        )
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-paper-soft px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            No items yet
          </p>
          <p className="mt-2 text-sm text-ash">
            Share an AI prompt, tutorial, or resource with the community.
          </p>
          <Link
            href="/items/add"
            className={cn(
              buttonVariants({ variant: "accent", size: "sm" }),
              "mt-5 inline-flex"
            )}
          >
            <FiPlus className="h-4 w-4" /> Add your first item
          </Link>
        </div>
      ) : viewMode === "table" ? (
        /* ─── Table view ───────────────────────────────────────── */
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper-soft">
                <th className="px-5 py-3.5 text-left font-mono text-[11px] uppercase tracking-wider text-ash-soft">
                  Item
                </th>
                <th className="px-4 py-3.5 text-left font-mono text-[11px] uppercase tracking-wider text-ash-soft">
                  Category
                </th>
                <th className="px-4 py-3.5 text-left font-mono text-[11px] uppercase tracking-wider text-ash-soft">
                  Priority
                </th>
                <th className="px-4 py-3.5 text-left font-mono text-[11px] uppercase tracking-wider text-ash-soft">
                  Price
                </th>
                <th className="px-4 py-3.5 text-right font-mono text-[11px] uppercase tracking-wider text-ash-soft">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((item) => (
                <tr
                  key={item._id}
                  className="transition-colors hover:bg-paper-soft/50"
                >
                  {/* Item info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-paper-soft">
                        {item.images?.[0] ? (
                          <Image
                            src={item.images[0]}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-ash-soft">
                            <FiTag className="h-4 w-4 opacity-40" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">
                          {item.title}
                        </p>
                        <p className="truncate text-[11px] text-ash-soft">
                          {item.shortDescription}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                        categoryColor[item.category]
                      )}
                    >
                      {item.category}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ash">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          priorityDot[item.priority]
                        )}
                      />
                      {item.priority}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm text-ink">
                      {item.price === 0 ? "Free" : `$${item.price.toFixed(2)}`}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/items/${item._id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ash-soft transition-colors hover:border-signal hover:text-signal"
                        aria-label="View item"
                        title="View"
                      >
                        <FiEye className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => openEdit(item)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ash-soft transition-colors hover:border-pulse hover:text-pulse"
                        aria-label="Edit item"
                        title="Edit"
                      >
                        <FiEdit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ash-soft transition-colors hover:border-ember hover:text-ember"
                        aria-label="Delete item"
                        title="Delete"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ─── Grid view ───────────────────────────────────────── */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-paper-soft">
                {item.images?.[0] ? (
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-ash-soft">
                    <FiTag className="h-8 w-8 opacity-20" />
                  </div>
                )}
                <span
                  className={cn(
                    "absolute right-3 top-3 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold",
                    item.price === 0
                      ? "bg-signal text-ink"
                      : "bg-ink/80 text-paper"
                  )}
                >
                  {item.price === 0 ? "Free" : `$${item.price.toFixed(2)}`}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <span
                  className={cn(
                    "self-start rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                    categoryColor[item.category]
                  )}
                >
                  {item.category}
                </span>
                <h3 className="line-clamp-2 font-display text-base font-semibold text-ink">
                  {item.title}
                </h3>

                {/* Actions */}
                <div className="mt-auto flex gap-2 border-t border-line pt-4">
                  <Link
                    href={`/items/${item._id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ash-soft hover:border-signal hover:text-signal"
                    aria-label="View"
                  >
                    <FiEye className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => openEdit(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ash-soft hover:border-pulse hover:text-pulse"
                    aria-label="Edit"
                  >
                    <FiEdit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ash-soft hover:border-ember hover:text-ember"
                    aria-label="Delete"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!pagination.hasPrev}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ash disabled:opacity-40"
          >
            ←
          </button>
          <span className="font-mono text-sm text-ash">
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNext}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ash disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}

      {/* ─── Delete confirmation dialog ──────────────────────── */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this item?"
        description={`"${deleteTarget?.title}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteItem.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ─── Inline edit modal ────────────────────────────────── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setEditTarget(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-line bg-paper p-6 shadow-2xl">
            <h2 className="font-display text-lg font-semibold text-ink">
              Quick edit
            </h2>
            <p className="mt-1 text-sm text-ash">
              Update the most common fields. For full edits use the detail page.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="h-11 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-signal/40"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    Priority
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) =>
                      setEditPriority(e.target.value as Item["priority"])
                    }
                    className="h-11 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-signal/40"
                  >
                    {["low", "medium", "high"].map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="h-11 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-signal/40"
                  />
                </div>
              </div>
            </div>

            {updateItem.isError && (
              <p className="mt-3 text-xs text-ember">
                Update failed. Please try again.
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={() => setEditTarget(null)}
                disabled={updateItem.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={handleUpdate}
                disabled={updateItem.isPending}
              >
                {updateItem.isPending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
