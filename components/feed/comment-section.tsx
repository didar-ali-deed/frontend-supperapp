"use client";

import * as React from "react";
import { Heart, Send, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime, formatCount } from "@/lib/utils/format";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton, SkeletonAvatar } from "@/components/ui/skeleton";
import { useFeedStore } from "@/lib/stores/feed.store";
import { MOCK_COMMENTS } from "@/lib/data/feed.mock";
import type { Comment } from "@/types";

/* ── CommentSkeleton ──────────────────────────────────────────── */
function CommentSkeleton() {
  return (
    <div className="flex gap-2.5 py-3">
      <SkeletonAvatar size={28} className="shrink-0 mt-0.5" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

/* ── Single comment ───────────────────────────────────────────── */
function CommentRow({ comment }: { comment: Comment }) {
  const [liked, setLiked] = React.useState(false);
  const [count, setCount] = React.useState(comment.likesCount);

  const handleLike = () => {
    setLiked((prev) => {
      setCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  return (
    <div className="flex gap-2.5 py-3">
      <Avatar
        src={comment.author.avatar}
        fallback={comment.author.name}
        size="xs"
        className="mt-0.5 shrink-0"
      />
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {/* Bubble */}
        <div className="rounded-[var(--radius-lg)] rounded-tl-none bg-[var(--surface-subtle)] px-3 py-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              {comment.author.name}
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              @{comment.author.username}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)] leading-relaxed">
            {comment.content}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 pl-1">
          <span className="text-[10px] text-[var(--text-muted)]">
            {formatRelativeTime(comment.createdAt)}
          </span>
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1 text-[10px] font-medium transition-colors",
              liked
                ? "text-[var(--color-danger-500)]"
                : "text-[var(--text-muted)] hover:text-[var(--color-danger-400)]"
            )}
          >
            <Heart
              size={11}
              className={cn("transition-all", liked && "fill-current scale-110")}
            />
            {count > 0 && formatCount(count)}
          </button>
          <button className="text-[10px] font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Comment input ────────────────────────────────────────────── */
interface CommentInputProps {
  postId: string;
  onSubmit: (content: string) => void;
}

function CommentInput({ postId, onSubmit }: CommentInputProps) {
  const [value, setValue] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    setSubmitting(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 400));
    onSubmit(trimmed);
    setValue("");
    setSubmitting(false);
    textareaRef.current?.focus();
  };

  // Auto-resize textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-[var(--surface-border)] pt-3 pb-1"
    >
      <Avatar fallback="Me" size="xs" className="mb-1.5 shrink-0" />
      <div
        className={cn(
          "flex flex-1 items-end gap-2 rounded-[var(--radius-xl)] border px-3 py-2",
          "border-[var(--surface-border-strong)] bg-[var(--surface-subtle)]",
          "focus-within:border-[var(--color-primary-400)] focus-within:bg-[var(--surface-bg)]",
          "transition-all duration-[var(--duration-normal)]"
        )}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment… (Enter to send)"
          className={cn(
            "flex-1 resize-none bg-transparent text-sm text-[var(--text-primary)]",
            "placeholder:text-[var(--text-muted)] focus:outline-none",
            "max-h-28 overflow-y-auto"
          )}
        />
        <button
          type="submit"
          disabled={!value.trim() || submitting}
          className={cn(
            "mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            "transition-all duration-[var(--duration-fast)]",
            value.trim()
              ? "bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] scale-100"
              : "text-[var(--text-muted)] scale-90 opacity-60"
          )}
          aria-label="Send comment"
        >
          {submitting ? (
            <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <Send size={14} />
          )}
        </button>
      </div>
    </form>
  );
}

/* ── CommentSection ───────────────────────────────────────────── */
interface CommentSectionProps {
  postId: string;
  initialCount: number;
}

const SHOW_INITIAL = 2;

export function CommentSection({ postId, initialCount }: CommentSectionProps) {
  const { localComments, addComment } = useFeedStore();
  const [loading, setLoading] = React.useState(true);
  const [serverComments, setServerComments] = React.useState<Comment[]>([]);
  const [expanded, setExpanded] = React.useState(false);

  // Simulate fetching comments
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setServerComments(MOCK_COMMENTS[postId] ?? []);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [postId]);

  const extras = localComments[postId] ?? [];
  const allComments = [...serverComments, ...extras];
  const visibleComments = expanded ? allComments : allComments.slice(0, SHOW_INITIAL);
  const hiddenCount = allComments.length - SHOW_INITIAL;

  const handleSubmit = (content: string) => {
    const comment: Comment = {
      id: `local-${Date.now()}`,
      postId,
      author: {
        id: "me",
        name: "You",
        username: "me",
        avatar: null,
      },
      content,
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };
    addComment(postId, comment);
    if (!expanded) setExpanded(true);
  };

  return (
    <div className="flex flex-col px-4 pb-2">
      {loading ? (
        <>
          <CommentSkeleton />
          <CommentSkeleton />
        </>
      ) : (
        <>
          {allComments.length === 0 && (
            <p className="py-4 text-center text-xs text-[var(--text-muted)]">
              No comments yet. Be the first!
            </p>
          )}

          <div className="divide-y divide-[var(--surface-border)]">
            {visibleComments.map((c) => (
              <CommentRow key={c.id} comment={c} />
            ))}
          </div>

          {!expanded && hiddenCount > 0 && (
            <button
              onClick={() => setExpanded(true)}
              className="flex items-center gap-1 py-2 text-xs font-medium text-[var(--color-primary-600)] hover:underline"
            >
              <ChevronDown size={13} />
              View {hiddenCount} more comment{hiddenCount > 1 ? "s" : ""}
            </button>
          )}
        </>
      )}

      <CommentInput postId={postId} onSubmit={handleSubmit} />
    </div>
  );
}
