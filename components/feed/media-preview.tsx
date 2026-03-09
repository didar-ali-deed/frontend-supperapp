"use client";

import * as React from "react";
import Image from "next/image";
import { Play, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostMedia } from "@/types";

/* ── Layout helpers ───────────────────────────────────────────── */
function gridClass(count: number): string {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-2";
  return "grid-cols-2"; // 4+
}

/* ── Single media item ────────────────────────────────────────── */
interface MediaItemProps {
  item: PostMedia;
  fill?: boolean;
  overlay?: number;
  onClick?: () => void;
}

function MediaItem({ item, fill = false, overlay, onClick }: MediaItemProps) {
  const isVideo = item.type === "video";

  return (
    <div
      className={cn(
        "group relative overflow-hidden bg-[var(--surface-muted)] cursor-pointer",
        fill ? "h-full w-full" : "aspect-[4/3]",
        "rounded-[var(--radius-lg)]"
      )}
      onClick={onClick}
    >
      <Image
        src={item.url}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 600px"
        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        loading="lazy"
      />

      {/* Video play button */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-transform group-hover:scale-110">
            <Play size={24} className="text-white ml-1" fill="white" />
          </div>
        </div>
      )}

      {/* Overflow count */}
      {overlay !== undefined && overlay > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
          <span className="text-2xl font-bold text-white">+{overlay}</span>
        </div>
      )}

      {/* Expand icon on hover */}
      {!overlay && (
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
            <Maximize2 size={12} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Lightbox ─────────────────────────────────────────────────── */
interface LightboxProps {
  media: PostMedia[];
  startIndex: number;
  onClose: () => void;
}

function Lightbox({ media, startIndex, onClose }: LightboxProps) {
  const [idx, setIdx] = React.useState(startIndex);
  const item = media[idx];

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")  setIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIdx((i) => Math.min(media.length - 1, i + 1));
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [media.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/90 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-xl)]">
          <Image
            src={item.url}
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Nav arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              disabled={idx === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-30 hover:bg-black/80 transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => setIdx((i) => Math.min(media.length - 1, i + 1))}
              disabled={idx === media.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-30 hover:bg-black/80 transition-colors"
            >
              ›
            </button>
          </>
        )}

        {/* Dots */}
        {media.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {media.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === idx ? "w-5 bg-white" : "w-2 bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── MediaPreview ─────────────────────────────────────────────── */
interface MediaPreviewProps {
  media: PostMedia[];
  className?: string;
}

export function MediaPreview({ media, className }: MediaPreviewProps) {
  const [lightboxIdx, setLightboxIdx] = React.useState<number | null>(null);
  const count = media.length;

  if (count === 0) return null;

  const MAX_VISIBLE = 4;
  const visible = media.slice(0, MAX_VISIBLE);
  const overflow = count > MAX_VISIBLE ? count - MAX_VISIBLE : 0;

  return (
    <>
      <div
        className={cn(
          "overflow-hidden rounded-[var(--radius-xl)]",
          count === 1 ? "" : `grid gap-1 ${gridClass(count)}`,
          className
        )}
      >
        {count === 1 && (
          <MediaItem item={visible[0]} onClick={() => setLightboxIdx(0)} />
        )}

        {count === 2 &&
          visible.map((item, i) => (
            <MediaItem key={item.id} item={item} onClick={() => setLightboxIdx(i)} />
          ))}

        {count === 3 && (
          <>
            {/* First image takes full left column spanning 2 rows */}
            <div className="row-span-2">
              <MediaItem item={visible[0]} fill onClick={() => setLightboxIdx(0)} />
            </div>
            <MediaItem item={visible[1]} onClick={() => setLightboxIdx(1)} />
            <MediaItem item={visible[2]} onClick={() => setLightboxIdx(2)} />
          </>
        )}

        {count >= 4 &&
          visible.map((item, i) => (
            <MediaItem
              key={item.id}
              item={item}
              onClick={() => setLightboxIdx(i)}
              overlay={i === MAX_VISIBLE - 1 ? overflow : undefined}
            />
          ))}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          media={media}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}
