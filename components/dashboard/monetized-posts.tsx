"use client";

import * as React from "react";
import Image from "next/image";
import {
  Eye, Heart, MessageCircle, DollarSign,
  ArrowUpDown, Play, Pause, MoreHorizontal,
  TrendingUp, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatCount, formatRelativeTime } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { MOCK_MONETIZED_POSTS } from "@/lib/data/dashboard.mock";
import type { MonetizedPost } from "@/lib/data/dashboard.mock";

/* ── Status config ────────────────────────────────────────────── */
const STATUS_META: Record<
  MonetizedPost["status"],
  { variant: "success" | "warning" | "secondary"; label: string }
> = {
  active:  { variant: "success",   label: "Active"  },
  pending: { variant: "warning",   label: "Pending" },
  paused:  { variant: "secondary", label: "Paused"  },
};

/* ── Sort types ───────────────────────────────────────────────── */
type SortKey = "earnings" | "views" | "date";

/* ── Post row ─────────────────────────────────────────────────── */
function PostRow({
  post,
  rank,
  onToggle,
}: {
  post: MonetizedPost;
  rank: number;
  onToggle: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const meta = STATUS_META[post.status];

  return (
    <div className="flex items-start gap-4 px-5 py-4">
      {/* Rank */}
      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
        <span
          className={cn(
            "text-xs font-bold tabular-nums",
            rank <= 3 ? "text-[var(--color-primary-600)]" : "text-[var(--text-muted)]"
          )}
        >
          {rank}
        </span>
      </div>

      {/* Thumbnail */}
      <div className="relative h-[60px] w-[96px] shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-muted)]">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          className="object-cover"
          sizes="96px"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-semibold text-[var(--text-primary)] leading-snug">
            {post.title}
          </p>
          <Badge variant={meta.variant} size="sm" className="shrink-0 mt-0.5">
            {meta.label}
          </Badge>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <Eye size={11} /> {formatCount(post.views)}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={11} /> {formatCount(post.likes)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={11} /> {post.comments}
          </span>
          <span className="text-[var(--text-subtle)]">
            {formatRelativeTime(post.publishedAt)}
          </span>
        </div>
      </div>

      {/* Earnings */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <p className="text-base font-bold tabular-nums text-[var(--color-success-600)]">
          {formatCurrency(post.earnings)}
        </p>

        {/* Actions */}
        <div className="relative flex items-center gap-1">
          <button
            onClick={() => onToggle(post.id)}
            title={post.status === "active" ? "Pause" : "Activate"}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {post.status === "active"
              ? <Pause size={13} />
              : <Play  size={13} />
            }
          </button>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <MoreHorizontal size={14} />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 z-20 flex min-w-[140px] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] shadow-[var(--shadow-lg)]">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <ExternalLink size={12} /> View Post
                </button>
                <button
                  onClick={() => { onToggle(post.id); setMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors"
                >
                  {post.status === "active"
                    ? <><Pause size={12} /> Pause Monetization</>
                    : <><Play  size={12} /> Resume Monetization</>
                  }
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── MonetizedPostsList ───────────────────────────────────────── */
export function MonetizedPostsList() {
  const [posts, setPosts] = React.useState(MOCK_MONETIZED_POSTS);
  const [sortKey, setSortKey] = React.useState<SortKey>("earnings");
  const [filter, setFilter] = React.useState<MonetizedPost["status"] | "all">("all");

  const sorted = React.useMemo(() => {
    const filtered = filter === "all" ? posts : posts.filter((p) => p.status === filter);
    return [...filtered].sort((a, b) => {
      if (sortKey === "earnings") return b.earnings - a.earnings;
      if (sortKey === "views")    return b.views - a.views;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [posts, sortKey, filter]);

  const toggleStatus = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id !== id
          ? p
          : { ...p, status: p.status === "active" ? "paused" : "active" }
      )
    );
  };

  /* Summary row */
  const totalEarnings = posts.reduce((s, p) => s + p.earnings, 0);
  const totalViews    = posts.reduce((s, p) => s + p.views, 0);
  const activePosts   = posts.filter((p) => p.status === "active").length;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <DollarSign size={15} />, label: "Total Earned",  value: formatCurrency(totalEarnings), color: "#10b981" },
          { icon: <Eye        size={15} />, label: "Total Views",   value: formatCount(totalViews),       color: "#6366f1" },
          { icon: <TrendingUp size={15} />, label: "Active Posts",  value: String(activePosts),           color: "#f59e0b" },
        ].map(({ icon, label, value, color }) => (
          <div
            key={label}
            className="flex flex-col gap-1 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-subtle)] px-4 py-3"
          >
            <div className="flex items-center gap-1.5" style={{ color }}>
              {icon}
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {label}
              </p>
            </div>
            <p className="text-lg font-bold tabular-nums text-[var(--text-primary)]">{value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Filter chips */}
        <div className="flex gap-1.5">
          {(["all", "active", "pending", "paused"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all",
                filter === f
                  ? "bg-[var(--color-primary-600)] text-white"
                  : "border border-[var(--surface-border)] text-[var(--text-secondary)] hover:border-[var(--color-primary-300)]"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <ArrowUpDown size={12} />
          {(["earnings", "views", "date"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setSortKey(k)}
              className={cn(
                "rounded-[var(--radius-md)] px-2 py-1 capitalize transition-all",
                sortKey === k
                  ? "bg-[var(--surface-muted)] font-semibold text-[var(--text-primary)]"
                  : "hover:text-[var(--text-secondary)]"
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-[var(--surface-border)] rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] overflow-hidden">
        {sorted.length === 0 ? (
          <p className="py-10 text-center text-sm text-[var(--text-muted)]">No posts found.</p>
        ) : (
          sorted.map((post, i) => (
            <PostRow
              key={post.id}
              post={post}
              rank={i + 1}
              onToggle={toggleStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}
