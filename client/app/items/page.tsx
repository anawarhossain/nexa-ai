"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { FiSearch, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useItems } from "@/hooks/useItems";
import { ItemCard } from "@/components/shared/ItemCard";
import { SkeletonGrid } from "@/components/shared/SkeletonCard";
import type { ItemsListParams } from "@/lib/api";

const CATEGORIES = ["Prompt", "Tutorial", "Tool", "Template", "Resource"] as const;
const PRIORITIES = ["high", "medium", "low"] as const;

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest first" },
  { value: "createdAt_asc", label: "Oldest first" },
  { value: "price_asc", label: "Price: low → high" },
  { value: "price_desc", label: "Price: high → low" },
  { value: "title_asc", label: "Title A → Z" },
];

export default function ExploreItemsPage() {
  const [query, setQuery] = useState<ItemsListParams>({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    order: "desc",
  });

  // Debounced search
  const [searchDraft, setSearchDraft] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((value: string) => {
    setSearchDraft(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery((q) => ({ ...q, q: value || undefined, page: 1 }));
    }, 400);
  }, []);

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const { data, isLoading, isError } = useItems(query);
  const items = data?.items ?? [];
  const pagination = data?.pagination;

  function handleSortChange(value: string) {
    const [sortBy, order] = value.split("_") as [string, "asc" | "desc"];
    setQuery((q) => ({ ...q, sortBy, order, page: 1 }));
  }

  function handleCategoryChange(cat: string) {
    setQuery((q) => ({
      ...q,
      category: q.category === cat ? undefined : cat,
      page: 1,
    }));
  }

  function handlePriorityChange(val: string) {
    setQuery((q) => ({
      ...q,
      priority: q.priority === val ? undefined : val,
      page: 1,
    }));
  }

  function clearFilters() {
    setSearchDraft("");
    setQuery({ page: 1, limit: 12, sortBy: "createdAt", order: "desc" });
  }

  const hasActiveFilters = !!(query.q || query.category || query.priority);
  const sortValue = `${query.sortBy}_${query.order}`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      {/* Page header */}
      <div className="mb-10">
        <span className="font-mono text-[11px] uppercase tracking-wider text-signal">
          Community library
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Explore AI Resources
        </h1>
        <p className="mt-3 max-w-xl text-ash">
          Prompts, tutorials, tools, templates, and resources — created by the
          Nexa community.
        </p>
      </div>

      {/* ─── Filters bar ─────────────────────────────────────── */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Row 1: Search + Sort */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ash-soft" />
            <input
              id="search-items"
              type="search"
              value={searchDraft}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search titles, tags…"
              className="h-11 w-full rounded-xl border border-line bg-white pl-10 pr-4 text-sm text-ink placeholder:text-ash-soft focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>

          {/* Sort */}
          <select
            id="sort-items"
            value={sortValue}
            onChange={(e) => handleSortChange(e.target.value)}
            className="h-11 rounded-xl border border-line bg-white px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-signal/40"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Row 2: Category + Priority pill filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ash-soft">
            Filter:
          </span>

          {/* Category filter */}
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase()}`}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                query.category === cat
                  ? "border-signal bg-signal/10 text-signal"
                  : "border-line bg-white text-ash hover:border-signal/30 hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}

          <span className="text-line">|</span>

          {/* Priority filter */}
          {PRIORITIES.map((pri) => (
            <button
              key={pri}
              id={`filter-pri-${pri}`}
              onClick={() => handlePriorityChange(pri)}
              className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                query.priority === pri
                  ? "border-ember bg-ember/10 text-ember"
                  : "border-line bg-white text-ash hover:border-ember/30 hover:text-ink"
              }`}
            >
              {pri}
            </button>
          ))}

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ash-soft transition-colors hover:text-ink"
            >
              <FiX className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ─── Results ─────────────────────────────────────────── */}
      {isLoading ? (
        <SkeletonGrid count={12} />
      ) : isError ? (
        <div className="rounded-2xl border border-ember/20 bg-ember/5 px-6 py-10 text-center">
          <p className="text-sm text-ash">
            Failed to load items. Please refresh the page.
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-paper-soft px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            No items found
          </p>
          <p className="mt-2 text-sm text-ash">
            Try clearing your filters or search for something else.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 font-mono text-sm text-signal hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Result count */}
          <p className="mb-5 font-mono text-[12px] text-ash-soft">
            {pagination?.total ?? 0} result
            {(pagination?.total ?? 0) !== 1 ? "s" : ""}
            {hasActiveFilters ? " matching your filters" : ""}
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                id="pagination-prev"
                onClick={() =>
                  setQuery((q) => ({ ...q, page: (q.page ?? 1) - 1 }))
                }
                disabled={!pagination.hasPrev}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ash transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>

              <span className="font-mono text-sm text-ash">
                {pagination.page} / {pagination.totalPages}
              </span>

              <button
                id="pagination-next"
                onClick={() =>
                  setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))
                }
                disabled={!pagination.hasNext}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ash transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
