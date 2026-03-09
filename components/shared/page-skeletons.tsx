/**
 * components/shared/page-skeletons.tsx
 *
 * Full-page skeleton screens used as loading.tsx fallbacks.
 * Each skeleton mirrors the visual shape of its module page
 * so the layout doesn't shift when content loads.
 */

import * as React from "react";
import { Skeleton, SkeletonAvatar } from "@/components/ui/skeleton";

/* ── Shared topbar skeleton ───────────────────────────────────── */
function TopbarSkeleton() {
  return (
    <div className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-[var(--surface-border)] bg-[var(--surface-bg)]/80 px-4">
      <Skeleton className="h-7 w-7 rounded-[var(--radius-md)] lg:hidden" />
      <Skeleton className="h-5 w-28" />
      <div className="ml-auto flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

/* ── Feed skeleton ────────────────────────────────────────────── */
export function FeedSkeleton() {
  return (
    <div>
      <TopbarSkeleton />
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        {/* Post composer */}
        <div className="rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-4">
          <div className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <Skeleton className="h-10 flex-1 rounded-[var(--radius-xl)]" />
          </div>
        </div>

        {/* Post cards */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-5 space-y-4"
          >
            <div className="flex items-start gap-3">
              <SkeletonAvatar size={40} />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
              <Skeleton className="h-3.5 w-4/6" />
            </div>
            {i === 1 && <Skeleton className="h-52 w-full rounded-[var(--radius-lg)]" />}
            <div className="flex gap-6 pt-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Messages skeleton ────────────────────────────────────────── */
export function MessagesSkeleton() {
  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Conversation list */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col border-r border-[var(--surface-border)] bg-[var(--surface-bg)]">
        {/* Search bar */}
        <div className="p-4 border-b border-[var(--surface-border)]">
          <Skeleton className="h-10 w-full rounded-[var(--radius-xl)]" />
        </div>
        {/* Rows */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <SkeletonAvatar size={44} />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>

      {/* Chat panel — desktop only */}
      <div className="hidden lg:flex flex-1 items-center justify-center">
        <Skeleton className="h-20 w-20 rounded-[var(--radius-2xl)]" />
      </div>
    </div>
  );
}

/* ── Wallet skeleton ──────────────────────────────────────────── */
export function WalletSkeleton() {
  return (
    <div>
      <TopbarSkeleton />
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Card */}
        <Skeleton className="h-48 w-full rounded-[var(--radius-2xl)]" />
        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-14 w-14 rounded-[var(--radius-2xl)]" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div className="flex gap-1 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] p-1">
          <Skeleton className="h-8 flex-1 rounded-[var(--radius-md)]" />
          <Skeleton className="h-8 flex-1 rounded-[var(--radius-md)]" />
        </div>
        {/* Transaction rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 py-1">
            <SkeletonAvatar size={40} />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3.5 w-16" />
              </div>
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Dashboard skeleton ───────────────────────────────────────── */
export function DashboardSkeleton() {
  return (
    <div>
      <TopbarSkeleton />
      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] px-5 py-4"
            >
              <Skeleton className="h-11 w-11 rounded-[var(--radius-lg)] shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
        {/* Tab bar */}
        <div className="flex gap-1 border-b border-[var(--surface-border)] pb-0">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-t-[var(--radius-md)]" />
          ))}
        </div>
        {/* Chart */}
        <div className="rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-6">
          <div className="mb-4 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-36" />
          </div>
          <Skeleton className="h-56 w-full rounded-[var(--radius-lg)]" />
          <div className="mt-4 grid grid-cols-3 gap-4 border-t border-[var(--surface-border)] pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>
        {/* Two-col */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-64 rounded-[var(--radius-xl)]" />
        </div>
      </div>
    </div>
  );
}

/* ── Profile skeleton ─────────────────────────────────────────── */
export function ProfileSkeleton() {
  return (
    <div>
      <TopbarSkeleton />
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        {/* Header card */}
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)]">
          {/* Cover */}
          <Skeleton className="h-36 sm:h-48 w-full rounded-none" />
          <div className="px-6 pb-5">
            <div className="-mt-12 mb-3 flex items-end justify-between">
              <Skeleton className="h-20 w-20 rounded-full ring-4 ring-[var(--surface-bg)]" />
              <Skeleton className="h-9 w-28 rounded-[var(--radius-lg)]" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <Skeleton className="h-3.5 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-4/5" />
              </div>
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
              <div className="flex gap-1 pt-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-1 px-3 py-1">
                    <Skeleton className="h-5 w-10" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] p-1">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 flex-1 rounded-[var(--radius-md)]" />
          ))}
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-[var(--radius-lg)]" />
          ))}
        </div>
      </div>
    </div>
  );
}
