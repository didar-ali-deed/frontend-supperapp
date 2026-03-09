"use client";

/**
 * components/shared/lazy-modules.tsx
 *
 * Dynamic imports for heavy components.
 * Use these instead of static imports to enable code splitting —
 * the bundle for each component is fetched only when it's needed.
 */

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/* ── Shared fallbacks ─────────────────────────────────────────── */
function ChartFallback() {
  return <Skeleton className="h-56 w-full rounded-[var(--radius-lg)]" />;
}

function CardFallback() {
  return <Skeleton className="h-48 w-full rounded-[var(--radius-xl)]" />;
}

function PanelFallback() {
  return <Skeleton className="h-64 w-full rounded-[var(--radius-xl)]" />;
}

/* ── Dashboard components ─────────────────────────────────────── */
export const LazyEarningsChart = dynamic(
  () => import("@/components/dashboard/earnings-chart").then((m) => m.EarningsChart),
  { loading: ChartFallback, ssr: false },
);

export const LazyRevenueCard = dynamic(
  () => import("@/components/dashboard/revenue-card").then((m) => m.RevenueCard),
  { loading: CardFallback, ssr: false },
);

export const LazyWithdrawPanel = dynamic(
  () => import("@/components/dashboard/withdraw-panel").then((m) => m.WithdrawPanel),
  { loading: PanelFallback, ssr: false },
);

export const LazyAnalyticsSummary = dynamic(
  () => import("@/components/dashboard/analytics-summary").then((m) => m.AnalyticsSummary),
  { loading: () => <Skeleton className="h-96 w-full rounded-[var(--radius-xl)]" />, ssr: false },
);

export const LazyMonetizedPostsList = dynamic(
  () => import("@/components/dashboard/monetized-posts").then((m) => m.MonetizedPostsList),
  { loading: PanelFallback, ssr: false },
);

/* ── Feed components ──────────────────────────────────────────── */
export const LazyPostEditor = dynamic(
  () => import("@/components/feed/post-editor").then((m) => m.PostEditor),
  { loading: () => <Skeleton className="h-24 w-full rounded-[var(--radius-xl)]" />, ssr: false },
);

export const LazyCommentSection = dynamic(
  () => import("@/components/feed/comment-section").then((m) => m.CommentSection),
  { loading: () => <Skeleton className="h-32 w-full rounded-[var(--radius-lg)]" />, ssr: false },
);

/* ── Profile components ───────────────────────────────────────── */
export const LazyEditProfileModal = dynamic(
  () => import("@/components/profile/edit-profile-modal").then((m) => m.EditProfileModal),
  { loading: () => null, ssr: false },
);

export const LazyFollowListModal = dynamic(
  () => import("@/components/profile/follow-list").then((m) => m.FollowListModal),
  { loading: () => null, ssr: false },
);
