import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiTag } from "react-icons/fi";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/api";

const categoryColor: Record<Item["category"], string> = {
  Prompt: "bg-signal/10 text-signal",
  Tutorial: "bg-pulse/10 text-pulse",
  Tool: "bg-ember/10 text-ember",
  Template: "bg-ink/8 text-ash",
  Resource: "bg-paper-soft text-ash",
};

const priorityDot: Record<Item["priority"], string> = {
  high: "bg-signal",
  medium: "bg-ember",
  low: "bg-ash-soft",
};

interface ItemCardProps {
  item: Item;
  className?: string;
}

export function ItemCard({ item, className }: ItemCardProps) {
  const image = item.images?.[0];
  const isFree = item.price === 0;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-paper-soft">
        {image ? (
          <Image
            src={image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ash-soft">
            <FiTag className="h-8 w-8 opacity-30" />
          </div>
        )}

        {/* Price badge */}
        <span
          className={cn(
            "absolute right-3 top-3 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold",
            isFree
              ? "bg-signal text-ink"
              : "bg-ink/80 text-paper backdrop-blur-sm"
          )}
        >
          {isFree ? "Free" : `$${item.price.toFixed(2)}`}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Category + Priority */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
              categoryColor[item.category]
            )}
          >
            {item.category}
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-ash-soft">
            <span
              className={cn(
                "inline-block h-1.5 w-1.5 rounded-full",
                priorityDot[item.priority]
              )}
            />
            {item.priority}
          </span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-ink">
          {item.title}
        </h3>

        {/* Short description */}
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-ash">
          {item.shortDescription}
        </p>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-ash-soft"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className="font-mono text-[11px] text-ash-soft">
            by {item.ownerName}
          </span>
          <Link
            href={`/items/${item._id}`}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-signal transition-all hover:gap-2.5"
            aria-label={`View details for ${item.title}`}
          >
            View details
            <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
