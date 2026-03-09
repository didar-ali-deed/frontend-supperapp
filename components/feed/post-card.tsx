"use client";

import * as React from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  Flag,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime, formatCount } from "@/lib/utils/format";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MediaPreview } from "./media-preview";
import { CommentSection } from "./comment-section";
import { useFeedStore } from "@/lib/stores/feed.store";
import type { Post } from "@/types";

/* ── Action button ────────────────────────────────────────────── */
interface ActionBtnProps {
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  activeClass?: string;
  onClick: () => void;
}

function ActionBtn({
  icon,
  activeIcon,
  label,
  count,
  active,
  activeClass = "text-[var(--color-primary-600)]",
  onClick,
}: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "group flex items-center gap-1.5 rounded-[var(--radius-lg)] px-3 py-2",
        "text-sm font-medium transition-all duration-[var(--duration-fast)]",
        "hover:bg-[var(--surface-muted)]",
        active ? activeClass : "text-[var(--text-muted)]"
      )}
    >
      <span
        className={cn(
          "transition-transform duration-[var(--duration-fast)]",
          active ? "scale-110" : "group-hover:scale-110"
        )}
      >
        {active && activeIcon ? activeIcon : icon}
      </span>
      {count !== undefined && (
        <span className="text-xs tabular-nums">{formatCount(count)}</span>
      )}
    </button>
  );
}

/* ── More options menu ────────────────────────────────────────── */
function MoreMenu({ onClose }: { onClose: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const items = [
    { icon: <Bookmark size={15} />, label: "Save post" },
    { icon: <Copy size={15} />, label: "Copy link" },
    { icon: <Flag size={15} />, label: "Report", className: "text-[var(--color-danger-600)]" },
  ];

  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 top-8 z-[var(--z-overlay)] w-44",
        "rounded-[var(--radius-xl)] border border-[var(--surface-border)]",
        "bg-[var(--surface-bg)] shadow-[var(--shadow-lg)] overflow-hidden",
        "animate-scale-in origin-top-right"
      )}
    >
      {items.map(({ icon, label, className }) => (
        <button
          key={label}
          onClick={onClose}
          className={cn(
            "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm",
            "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors",
            className
          )}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}

/* ── Read-more text ───────────────────────────────────────────── */
const MAX_CHARS = 220;

function PostContent({ text }: { text: string }) {
  const [expanded, setExpanded] = React.useState(false);
  const isLong = text.length > MAX_CHARS;
  const display = isLong && !expanded ? text.slice(0, MAX_CHARS) + "…" : text;

  return (
    <p className="text-sm leading-relaxed text-[var(--text-primary)] whitespace-pre-line">
      {display}
      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="ml-1 text-[var(--color-primary-600)] font-medium hover:underline"
        >
          {expanded ? "Show less" : "more"}
        </button>
      )}
    </p>
  );
}

/* ── PostCard ─────────────────────────────────────────────────── */
interface PostCardProps {
  post: Post;
  className?: string;
}

export const PostCard = React.memo(function PostCard({ post, className }: PostCardProps) {
  const { likedPosts, openComments, sharedPosts, toggleLike, toggleComments, markShared } =
    useFeedStore();

  const isLiked = likedPosts.has(post.id) ? !post.isLiked : post.isLiked;
  const likeCount = post.likesCount + (
    likedPosts.has(post.id) ? (post.isLiked ? -1 : 1) : 0
  );
  const commentsOpen = openComments.has(post.id);
  const copied = sharedPosts.has(post.id);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/feed/${post.id}`
      );
    } catch (_) {}
    markShared(post.id);
  };

  return (
    <article
      className={cn(
        "rounded-[var(--radius-2xl)] border border-[var(--surface-border)]",
        "bg-[var(--surface-bg)] shadow-[var(--shadow-xs)]",
        "overflow-hidden transition-shadow hover:shadow-[var(--shadow-sm)]",
        className
      )}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="flex items-start gap-3 min-w-0">
          <Link href={`/profile/${post.author.username}`} className="shrink-0">
            <Avatar
              src={post.author.avatar}
              fallback={post.author.name}
              size="md"
              className="ring-2 ring-[var(--surface-border)] hover:ring-[var(--color-primary-300)] transition-all"
            />
          </Link>
          <div className="flex flex-col min-w-0">
            <Link
              href={`/profile/${post.author.username}`}
              className="text-sm font-semibold text-[var(--text-primary)] hover:underline truncate"
            >
              {post.author.name}
            </Link>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-[var(--text-muted)]">
                @{post.author.username}
              </span>
              <span className="text-[var(--text-muted)] text-xs">·</span>
              <span className="text-xs text-[var(--text-muted)]">
                {formatRelativeTime(post.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* More options */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
              "transition-colors"
            )}
            aria-label="More options"
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && <MoreMenu onClose={() => setMenuOpen(false)} />}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="px-4 pb-3">
        <PostContent text={post.content} />
      </div>

      {/* ── Media ──────────────────────────────────────────────── */}
      {post.media.length > 0 && (
        <div className="px-4 pb-3">
          <MediaPreview media={post.media} />
        </div>
      )}

      {/* ── Action bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-[var(--surface-border)] px-2 py-1">
        {/* Like */}
        <ActionBtn
          icon={<Heart size={18} />}
          activeIcon={<Heart size={18} className="fill-current" />}
          label={isLiked ? "Unlike" : "Like"}
          count={likeCount}
          active={isLiked}
          activeClass="text-[var(--color-danger-500)]"
          onClick={() => toggleLike(post.id)}
        />

        {/* Comment */}
        <ActionBtn
          icon={<MessageCircle size={18} />}
          label="Comment"
          count={post.commentsCount + (useFeedStore.getState().localComments[post.id]?.length ?? 0)}
          active={commentsOpen}
          onClick={() => toggleComments(post.id)}
        />

        {/* Share */}
        <ActionBtn
          icon={<Share2 size={18} />}
          activeIcon={<Check size={18} />}
          label="Share"
          count={post.sharesCount}
          active={copied}
          activeClass="text-[var(--color-success-600)]"
          onClick={handleShare}
        />
      </div>

      {/* ── Comments ───────────────────────────────────────────── */}
      {commentsOpen && (
        <div className="border-t border-[var(--surface-border)]">
          <CommentSection
            postId={post.id}
            initialCount={post.commentsCount}
          />
        </div>
      )}
    </article>
  );
});
