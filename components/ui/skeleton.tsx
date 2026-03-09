import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Skeleton ─────────────────────────────────────────────────── */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "skeleton-shimmer rounded-[var(--radius-md)]",
        className
      )}
      {...props}
    />
  );
}

/* ── SkeletonText — multi-line text placeholder ──────────────── */
function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3.5", i === lines - 1 ? "w-3/4" : "w-full")}
        />
      ))}
    </div>
  );
}

/* ── SkeletonCard — full card placeholder ─────────────────────── */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-6", className)}>
      <div className="flex items-start gap-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <Skeleton className="mt-4 h-48 w-full rounded-[var(--radius-lg)]" />
    </div>
  );
}

/* ── SkeletonAvatar ───────────────────────────────────────────── */
function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Skeleton
      className={cn("rounded-full shrink-0", className)}
      style={{ width: size, height: size }}
    />
  );
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar };
