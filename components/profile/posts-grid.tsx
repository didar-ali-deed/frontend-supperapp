"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, MessageCircle, Play, FileText, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCount } from "@/lib/utils/format";
import { MY_POSTS } from "@/lib/data/profile.mock";
import type { ProfilePost } from "@/lib/data/profile.mock";

/* ── Post cell ────────────────────────────────────────────────── */
const PostCell = React.memo(function PostCell({
  post,
  onClick,
}: {
  post: ProfilePost;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-square w-full overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-400)]"
    >
      {post.thumbnail ? (
        <Image
          src={post.thumbnail}
          alt=""
          fill
          sizes="(max-width: 640px) 33vw, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      ) : (
        /* Text post tile */
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-50)] p-3">
          <p className="line-clamp-4 text-center text-xs font-medium text-[var(--color-primary-700)] leading-relaxed">
            {post.content}
          </p>
        </div>
      )}

      {/* Type badge */}
      {post.type === "video" && (
        <div className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white">
          <Play size={10} fill="white" />
        </div>
      )}
      {post.type === "text" && post.thumbnail && (
        <div className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white">
          <FileText size={10} />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="flex items-center gap-1.5 text-sm font-bold text-white">
          <Heart size={16} fill="white" /> {formatCount(post.likesCount)}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-bold text-white">
          <MessageCircle size={16} fill="white" /> {formatCount(post.commentsCount)}
        </span>
      </div>
    </button>
  );
});

/* ── Lightbox ─────────────────────────────────────────────────── */
function Lightbox({
  posts,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  posts: ProfilePost[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const post = posts[index];
  if (!post) return null;

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Content */}
      <div
        className="relative max-h-[90vh] max-w-[90vw] w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt=""
            className="max-h-[80vh] max-w-full rounded-[var(--radius-xl)] object-contain shadow-2xl"
          />
        ) : (
          <div className="max-w-sm rounded-[var(--radius-2xl)] bg-[var(--surface-bg)] p-8">
            <p className="text-base text-[var(--text-primary)] leading-relaxed text-center">
              {post.content}
            </p>
          </div>
        )}

        {/* Stats bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-full bg-black/60 px-5 py-2 backdrop-blur-sm">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
            <Heart size={14} fill="white" /> {formatCount(post.likesCount)}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
            <MessageCircle size={14} fill="white" /> {formatCount(post.commentsCount)}
          </span>
        </div>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X size={20} />
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Next */}
      {index < posts.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Counter */}
      <p className="absolute bottom-4 right-4 text-xs text-white/60">
        {index + 1} / {posts.length}
      </p>
    </div>
  );
}

/* ── PostsGrid ────────────────────────────────────────────────── */
interface PostsGridProps {
  mediaOnly?: boolean;
}

export function PostsGrid({ mediaOnly = false }: PostsGridProps) {
  const [lightboxIdx, setLightboxIdx] = React.useState<number | null>(null);

  const posts = mediaOnly
    ? MY_POSTS.filter((p) => p.type === "image" || p.type === "video")
    : MY_POSTS;

  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-[var(--text-muted)]">
        No posts to display.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
        {posts.map((post, i) => (
          <PostCell
            key={post.id}
            post={post}
            onClick={() => setLightboxIdx(i)}
          />
        ))}
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          posts={posts}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() => setLightboxIdx((i) => Math.min(posts.length - 1, (i ?? 0) + 1))}
        />
      )}
    </>
  );
}
