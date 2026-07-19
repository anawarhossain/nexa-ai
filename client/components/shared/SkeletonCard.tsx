import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]",
        className
      )}
      aria-hidden="true"
    >
      {/* Image area */}
      <div className="aspect-[16/9] animate-pulse bg-paper-soft" />

      {/* Body */}
      <div className="flex flex-col gap-3 p-5">
        {/* Category + priority */}
        <div className="flex gap-2">
          <div className="h-5 w-20 animate-pulse rounded-full bg-paper-soft" />
          <div className="h-5 w-14 animate-pulse rounded-full bg-paper-soft" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-4 w-full animate-pulse rounded bg-paper-soft" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-paper-soft" />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-full animate-pulse rounded bg-paper-soft" />
          <div className="h-3.5 w-3/4 animate-pulse rounded bg-paper-soft" />
        </div>

        {/* Tags */}
        <div className="flex gap-1.5">
          <div className="h-4 w-12 animate-pulse rounded-full bg-paper-soft" />
          <div className="h-4 w-16 animate-pulse rounded-full bg-paper-soft" />
          <div className="h-4 w-10 animate-pulse rounded-full bg-paper-soft" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-line pt-3">
          <div className="h-3 w-24 animate-pulse rounded bg-paper-soft" />
          <div className="h-3 w-20 animate-pulse rounded bg-paper-soft" />
        </div>
      </div>
    </div>
  );
}

/** Grid of skeleton cards for loading state */
export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
