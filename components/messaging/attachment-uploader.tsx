"use client";

import * as React from "react";
import Image from "next/image";
import { X, File as FileIcon, ImageIcon, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/data/messages.mock";

export interface PendingAttachment {
  id: string;
  file: File;
  url: string; // object URL for preview
  type: "image" | "video" | "file";
}

interface AttachmentUploaderProps {
  attachments: PendingAttachment[];
  onRemove: (id: string) => void;
}

function AttachmentThumb({ att, onRemove }: { att: PendingAttachment; onRemove: () => void }) {
  const isImage = att.type === "image";
  const isVideo = att.type === "video";

  return (
    <div className="relative group shrink-0">
      <div
        className={cn(
          "flex h-16 w-16 overflow-hidden rounded-[var(--radius-lg)]",
          "border border-[var(--surface-border)] bg-[var(--surface-muted)]"
        )}
      >
        {isImage ? (
          <Image src={att.url} alt={att.file.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 p-1">
            {isVideo
              ? <Video size={20} className="text-[var(--color-primary-500)]" />
              : <FileIcon size={20} className="text-[var(--text-muted)]" />
            }
            <span className="text-center text-[9px] leading-tight text-[var(--text-muted)] line-clamp-2 px-1">
              {att.file.name}
            </span>
          </div>
        )}
      </div>

      {/* File size badge */}
      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white">
        {formatFileSize(att.file.size)}
      </span>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className={cn(
          "absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center",
          "rounded-full bg-[var(--color-neutral-900)] text-white",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "hover:bg-[var(--color-danger-600)]"
        )}
        aria-label={`Remove ${att.file.name}`}
      >
        <X size={10} />
      </button>
    </div>
  );
}

export function AttachmentUploader({ attachments, onRemove }: AttachmentUploaderProps) {
  if (attachments.length === 0) return null;

  return (
    <div
      className={cn(
        "flex items-end gap-2 overflow-x-auto px-4 py-2",
        "border-t border-[var(--surface-border)] bg-[var(--surface-subtle)]",
        "scrollbar-hide"
      )}
    >
      {attachments.map((att) => (
        <AttachmentThumb key={att.id} att={att} onRemove={() => onRemove(att.id)} />
      ))}
    </div>
  );
}

/* ── Hook: manage pending attachments ─────────────────────────── */
export function usePendingAttachments() {
  const [attachments, setAttachments] = React.useState<PendingAttachment[]>([]);

  const add = (files: FileList | File[]) => {
    const arr = Array.from(files);
    const pending: PendingAttachment[] = arr.map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      file: f,
      url: URL.createObjectURL(f),
      type: f.type.startsWith("image/")
        ? "image"
        : f.type.startsWith("video/")
        ? "video"
        : "file",
    }));
    setAttachments((prev) => [...prev, ...pending].slice(0, 6));
  };

  const remove = (id: string) => {
    setAttachments((prev) => {
      const att = prev.find((a) => a.id === id);
      if (att) URL.revokeObjectURL(att.url);
      return prev.filter((a) => a.id !== id);
    });
  };

  const clear = () => {
    attachments.forEach((a) => URL.revokeObjectURL(a.url));
    setAttachments([]);
  };

  return { attachments, add, remove, clear };
}
