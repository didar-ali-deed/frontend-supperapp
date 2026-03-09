"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { PostCard } from "./post-card";
import { getMockFeedPage } from "@/lib/data/feed.mock";
import type { Post } from "@/types";

/* ── PostCard skeletons ───────────────────────────────────────── */
function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/* ── Infinite scroll sentinel ─────────────────────────────────── */
function Sentinel({ onVisible }: { onVisible: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(); },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return <div ref={ref} className="h-1 w-full" aria-hidden />;
}

/* ── FeedContainer ────────────────────────────────────────────── */
interface FeedContainerProps {
  className?: string;
  /** Injected at top (from PostEditor) */
  newPost?: Post | null;
}

export function FeedContainer({ className, newPost }: FeedContainerProps) {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [cursor, setCursor] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  /* ── Initial load ─────────────────────────────────────────── */
  const loadInitial = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      await new Promise((r) => setTimeout(r, 900)); // sim network
      const page = getMockFeedPage(null, 3);
      setPosts(page.posts);
      setCursor(page.nextCursor);
      setHasMore(page.nextCursor !== null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadInitial(); }, [loadInitial]);

  /* ── Refresh ──────────────────────────────────────────────── */
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 700));
    const page = getMockFeedPage(null, 3);
    setPosts(page.posts);
    setCursor(page.nextCursor);
    setHasMore(page.nextCursor !== null);
    setRefreshing(false);
  };

  /* ── Load more (infinite scroll) ─────────────────────────── */
  const loadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      const page = getMockFeedPage(cursor, 3);
      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const fresh = page.posts.filter((p) => !ids.has(p.id));
        return [...prev, ...fresh];
      });
      setCursor(page.nextCursor);
      setHasMore(page.nextCursor !== null);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, cursor]);

  /* ── New post prepend ─────────────────────────────────────── */
  React.useEffect(() => {
    if (!newPost) return;
    setPosts((prev) => [newPost, ...prev.filter((p) => p.id !== newPost.id)]);
  }, [newPost]);

  /* ── Render ───────────────────────────────────────────────── */
  if (loading) return <FeedSkeleton />;

  if (error) {
    return (
      <EmptyState
        title="Could not load feed"
        description="Something went wrong. Please try again."
        action={
          <Button variant="primary" onClick={loadInitial}>
            Try again
          </Button>
        }
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        title="Nothing here yet"
        description="Follow some creators to see their posts here."
      />
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Refresh bar */}
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <RefreshCw
            size={12}
            className={cn(refreshing && "animate-spin")}
          />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Post list */}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Infinite scroll sentinel */}
      {hasMore && !loadingMore && (
        <Sentinel onVisible={loadMore} />
      )}

      {/* Load-more skeleton */}
      {loadingMore && <FeedSkeleton count={2} />}

      {/* End of feed */}
      {!hasMore && (
        <div className="py-8 text-center text-xs text-[var(--text-muted)]">
          You're all caught up ✓
        </div>
      )}
    </div>
  );
}
