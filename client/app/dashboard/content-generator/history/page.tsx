"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiEdit3,
  FiFileText,
  FiSmartphone,
  FiBookOpen,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { useGenerationHistory } from "@/hooks/useContentGenerator";
import { cn } from "@/lib/utils";
import type { Generation, ContentType } from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const typeIcon: Record<ContentType, React.ElementType> = {
  blog: FiEdit3,
  "product-description": FiBookOpen,
  documentation: FiFileText,
  "social-post": FiSmartphone,
};

const typeLabel: Record<ContentType, string> = {
  blog: "Blog Post",
  "product-description": "Product Desc.",
  documentation: "Documentation",
  "social-post": "Social Post",
};

const typeColor: Record<ContentType, string> = {
  blog: "bg-signal/10 text-signal",
  "product-description": "bg-ember/10 text-ember",
  documentation: "bg-pulse/10 text-pulse",
  "social-post": "bg-ink/8 text-ash",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ─── Generation card ──────────────────────────────────────────────────────────

function GenerationCard({ gen }: { gen: Generation }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = typeIcon[gen.contentType];

  return (
    <div className="rounded-2xl border border-line bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4 p-5">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper-soft">
          <Icon className="h-4 w-4 text-ash" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                typeColor[gen.contentType]
              )}
            >
              {typeLabel[gen.contentType]}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ash-soft">
              {gen.tone}
            </span>
            <span className="font-mono text-[10px] text-ash-soft">
              {gen.wordCount} words
            </span>
            <span className="font-mono text-[10px] text-ash-soft ml-auto">
              {timeAgo(gen.createdAt)}
            </span>
          </div>

          <p className="mt-2 font-medium text-ink line-clamp-1">{gen.topic}</p>

          {/* Preview */}
          <p
            className={cn(
              "mt-1.5 text-sm leading-relaxed text-ash",
              expanded ? "" : "line-clamp-2"
            )}
          >
            {gen.generatedText}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 border-t border-line px-5 py-3">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="font-mono text-[11px] uppercase tracking-wider text-ash-soft transition-colors hover:text-ink"
        >
          {expanded ? "Collapse ↑" : "Expand ↓"}
        </button>

        <Link
          href="/dashboard/content-generator"
          className="ml-auto font-mono text-[11px] uppercase tracking-wider text-signal hover:underline"
        >
          Generate similar →
        </Link>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const router = useRouter();
  const { data: session, isPending: authPending } = authClient.useSession();
  const [page, setPage] = useState(1);

  // Auth guard
  useEffect(() => {
    if (!authPending && !session) router.replace("/login");
  }, [session, authPending, router]);

  const { data, isLoading, isError } = useGenerationHistory({ page, limit: 10 });
  const items = data?.items ?? [];
  const pagination = data?.pagination;

  if (authPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/content-generator"
          className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-ash-soft transition-colors hover:text-signal"
        >
          <FiArrowLeft className="h-3.5 w-3.5" />
          Back to generator
        </Link>

        <h1 className="mt-5 font-display text-2xl font-semibold text-ink">
          Generation History
        </h1>
        <p className="mt-1 text-sm text-ash">
          {pagination?.total ?? 0} total generation
          {(pagination?.total ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-paper-soft"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-ember/20 bg-ember/5 px-6 py-10 text-center">
          <p className="text-sm text-ash">
            Failed to load history. Please refresh.
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-paper-soft/50 px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            No generations yet
          </p>
          <p className="mt-2 text-sm text-ash">
            Go to the generator and create your first piece of content.
          </p>
          <Link
            href="/dashboard/content-generator"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2 font-mono text-[12px] uppercase tracking-wider text-ink hover:brightness-95"
          >
            Open generator →
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((gen) => (
              <GenerationCard key={gen._id} gen={gen} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                id="history-prev"
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPrev}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ash transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-mono text-sm text-ash">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                id="history-next"
                onClick={() => setPage((p) => p + 1)}
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
