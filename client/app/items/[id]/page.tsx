"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiTag,
  FiCopy,
  FiCheck,
  FiExternalLink,
} from "react-icons/fi";
import { useItem } from "@/hooks/useItems";
import { ItemCard } from "@/components/shared/ItemCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { cn } from "@/lib/utils";

type Tab = "overview" | "specs" | "related";

const categoryColor: Record<string, string> = {
  Prompt: "bg-signal/10 text-signal",
  Tutorial: "bg-pulse/10 text-pulse",
  Tool: "bg-ember/10 text-ember",
  Template: "bg-ink/8 text-ash",
  Resource: "bg-paper-soft text-ash",
};

const priorityLabel: Record<string, string> = {
  high: "🔴 High",
  medium: "🟡 Medium",
  low: "🟢 Low",
};

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useItem(id);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="mb-8 h-5 w-32 animate-pulse rounded bg-paper-soft" />
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="space-y-4">
            <div className="aspect-video animate-pulse rounded-2xl bg-paper-soft" />
            <div className="flex gap-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-16 w-16 animate-pulse rounded-xl bg-paper-soft"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-paper-soft" />
            <div className="h-4 w-full animate-pulse rounded bg-paper-soft" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-paper-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.item) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <p className="font-display text-2xl font-semibold text-ink">
          Item not found
        </p>
        <p className="mt-3 text-ash">
          This item may have been removed or the link is incorrect.
        </p>
        <Link
          href="/items"
          className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-signal hover:underline"
        >
          <FiArrowLeft className="h-4 w-4" /> Back to explore
        </Link>
      </div>
    );
  }

  const { item, related } = data;
  const images = item.images?.length > 0 ? item.images : [];
  const isFree = item.price === 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      {/* Breadcrumb */}
      <Link
        href="/items"
        className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-ash-soft transition-colors hover:text-signal"
      >
        <FiArrowLeft className="h-3.5 w-3.5" />
        Explore Items
      </Link>

      {/* ─── Main grid ─────────────────────────────────────────── */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Left: Images */}
        <div>
          {images.length > 0 ? (
            <>
              {/* Main image */}
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-paper-soft">
                <Image
                  src={images[activeImage]}
                  alt={`${item.title} — image ${activeImage + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        "relative h-16 w-16 overflow-hidden rounded-xl border-2 transition-colors",
                        i === activeImage
                          ? "border-signal"
                          : "border-transparent hover:border-line"
                      )}
                      aria-label={`View image ${i + 1}`}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-2xl border border-line bg-paper-soft text-ash-soft">
              <FiTag className="h-12 w-12 opacity-20" />
            </div>
          )}

          {/* ─── Tabs ───────────────────────────────────────────── */}
          <div className="mt-10">
            <div className="flex gap-0 border-b border-line">
              {(["overview", "specs", "related"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  id={`tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-5 py-3 font-mono text-[12px] uppercase tracking-wider transition-colors",
                    activeTab === tab
                      ? "border-b-2 border-signal text-signal"
                      : "text-ash-soft hover:text-ink"
                  )}
                >
                  {tab === "related" ? `Related (${related?.length ?? 0})` : tab}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {/* Overview tab */}
              {activeTab === "overview" && (
                <div className="prose prose-sm max-w-none text-ash">
                  <div
                    className="whitespace-pre-wrap leading-relaxed"
                    style={{ fontFamily: "inherit" }}
                  >
                    {item.fullDescription}
                  </div>
                </div>
              )}

              {/* Specs tab */}
              {activeTab === "specs" && (
                <dl className="divide-y divide-line">
                  {[
                    ["Category", item.category],
                    ["Priority", priorityLabel[item.priority]],
                    [
                      "Price",
                      isFree ? "Free" : `$${item.price.toFixed(2)}`,
                    ],
                    [
                      "Tags",
                      item.tags.length
                        ? item.tags.join(", ")
                        : "—",
                    ],
                    ["Author", item.ownerName],
                    [
                      "Published",
                      new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }),
                    ],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-6 py-3.5">
                      <dt className="w-28 shrink-0 font-mono text-[12px] uppercase tracking-wider text-ash-soft">
                        {label}
                      </dt>
                      <dd className="text-sm text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* Related tab */}
              {activeTab === "related" && (
                <div>
                  {!related || related.length === 0 ? (
                    <p className="text-sm text-ash">
                      No related items found in the same category.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {related.map((r) => (
                        <ItemCard key={r._id} item={r} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Sidebar info */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
            {/* Category + Priority */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider",
                  categoryColor[item.category] ?? "bg-paper-soft text-ash"
                )}
              >
                {item.category}
              </span>
              <span className="font-mono text-[11px] text-ash-soft">
                {priorityLabel[item.priority]}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-4 font-display text-xl font-semibold leading-snug text-ink">
              {item.title}
            </h1>

            {/* Short description */}
            <p className="mt-3 text-sm leading-relaxed text-ash">
              {item.shortDescription}
            </p>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] text-ash-soft"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-ink">
                {isFree ? "Free" : `$${item.price.toFixed(2)}`}
              </span>
              {isFree && (
                <span className="font-mono text-[11px] text-ash-soft">
                  no account required
                </span>
              )}
            </div>

            {/* Copy link button */}
            <button
              id="copy-link-btn"
              onClick={() => handleCopy(window.location.href)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
            >
              {copied ? (
                <>
                  <FiCheck className="h-4 w-4 text-signal" /> Link copied!
                </>
              ) : (
                <>
                  <FiCopy className="h-4 w-4" /> Copy link
                </>
              )}
            </button>

            {/* Divider */}
            <div className="my-5 border-t border-line" />

            {/* Author */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-ash-soft">
                  Created by
                </p>
                <p className="mt-1 text-sm font-medium text-ink">
                  {item.ownerName}
                </p>
              </div>
              <Link
                href="/items"
                className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-signal hover:underline"
              >
                More <FiExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
