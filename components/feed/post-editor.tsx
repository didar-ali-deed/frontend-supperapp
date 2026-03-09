"use client";

import * as React from "react";
import Image from "next/image";
import { Image as ImageIcon, Video, Smile, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Card } from "@/components/ui/card";

/* ── Media preview strip ──────────────────────────────────────── */
interface PreviewStripProps {
  files: File[];
  onRemove: (idx: number) => void;
}

function PreviewStrip({ files, onRemove }: PreviewStripProps) {
  const urls = React.useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );

  React.useEffect(() => {
    return () => urls.forEach(URL.revokeObjectURL);
  }, [urls]);

  if (files.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap px-4 pb-3">
      {urls.map((url, i) => {
        const isVideo = files[i].type.startsWith("video/");
        return (
          <div key={url} className="relative h-20 w-20 shrink-0">
            {isVideo ? (
              <div className="h-full w-full rounded-[var(--radius-lg)] bg-[var(--surface-muted)] flex items-center justify-center">
                <Video size={24} className="text-[var(--text-muted)]" />
              </div>
            ) : (
              <Image
                src={url}
                alt={`Preview ${i + 1}`}
                fill
                className="rounded-[var(--radius-lg)] object-cover"
              />
            )}
            <button
              onClick={() => onRemove(i)}
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-neutral-900)] text-white hover:bg-[var(--color-danger-600)] transition-colors"
              aria-label="Remove file"
            >
              <X size={11} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ── Toolbar icon button ──────────────────────────────────────── */
function ToolbarBtn({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-[var(--radius-lg)]",
        "text-[var(--color-primary-600)] transition-colors",
        "hover:bg-[var(--color-primary-50)] dark:hover:bg-[var(--color-primary-900)]",
        "disabled:opacity-40 disabled:cursor-not-allowed"
      )}
    >
      {icon}
    </button>
  );
}

/* ── PostEditor ───────────────────────────────────────────────── */
const MAX_CHARS = 500;
const MAX_FILES = 4;
const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime";

interface PostEditorProps {
  onPost?: (content: string, files: File[]) => void;
  className?: string;
}

export function PostEditor({ onPost, className }: PostEditorProps) {
  const [content, setContent] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [posted, setPosted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const remaining = MAX_CHARS - content.length;
  const canPost = (content.trim().length > 0 || files.length > 0) && remaining >= 0;
  const nearLimit = remaining <= 50;
  const overLimit = remaining < 0;

  /* Auto-resize textarea */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  /* File pick */
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const picked = Array.from(e.target.files ?? []);
    if (files.length + picked.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files per post.`);
      return;
    }
    setFiles((prev) => [...prev, ...picked]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  /* Submit */
  const handleSubmit = async () => {
    if (!canPost || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 800));
      onPost?.(content, files);
      setContent("");
      setFiles([]);
      setPosted(true);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setTimeout(() => setPosted(false), 3000);
    } catch {
      setError("Failed to post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      variant="default"
      className={cn("overflow-hidden", className)}
    >
      {/* Author row */}
      <div className="flex gap-3 p-4 pb-0">
        <Avatar fallback="Me" size="md" className="shrink-0 mt-0.5" />

        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            rows={2}
            value={content}
            onChange={handleChange}
            placeholder="What's on your mind?"
            className={cn(
              "w-full resize-none bg-transparent text-sm leading-relaxed",
              "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              "focus:outline-none"
            )}
            maxLength={MAX_CHARS + 50} // allow typing past to show over-limit
            aria-label="Post content"
          />
        </div>
      </div>

      {/* Media preview */}
      <PreviewStrip files={files} onRemove={removeFile} />

      {/* Error */}
      {error && (
        <div className="mx-4 mb-2 flex items-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-danger-50)] px-3 py-2 text-xs text-[var(--color-danger-700)]">
          <AlertCircle size={13} />
          {error}
        </div>
      )}

      {/* Success flash */}
      {posted && (
        <div className="mx-4 mb-2 rounded-[var(--radius-lg)] bg-[var(--color-success-50)] px-3 py-2 text-xs text-[var(--color-success-700)]">
          ✓ Post published!
        </div>
      )}

      <Divider className="mt-3" />

      {/* Toolbar + post button */}
      <div className="flex items-center justify-between px-3 py-2">
        {/* Media tools */}
        <div className="flex items-center gap-0.5">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED}
            multiple
            className="sr-only"
            onChange={handleFiles}
            aria-label="Attach files"
          />
          <ToolbarBtn
            icon={<ImageIcon size={18} />}
            label="Add photo"
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= MAX_FILES}
          />
          <ToolbarBtn
            icon={<Video size={18} />}
            label="Add video"
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= MAX_FILES}
          />
          <ToolbarBtn
            icon={<Smile size={18} />}
            label="Add emoji"
          />
        </div>

        {/* Right side: counter + button */}
        <div className="flex items-center gap-3">
          {/* Character count */}
          {content.length > 0 && (
            <div className="relative flex items-center justify-center h-7 w-7">
              {/* Ring progress */}
              <svg
                className="absolute inset-0 -rotate-90"
                width="28"
                height="28"
                viewBox="0 0 28 28"
              >
                <circle cx="14" cy="14" r="11" strokeWidth="2.5" stroke="var(--surface-muted)" fill="none" />
                <circle
                  cx="14"
                  cy="14"
                  r="11"
                  strokeWidth="2.5"
                  fill="none"
                  stroke={
                    overLimit
                      ? "var(--color-danger-500)"
                      : nearLimit
                      ? "var(--color-warning-500)"
                      : "var(--color-primary-500)"
                  }
                  strokeDasharray={`${2 * Math.PI * 11}`}
                  strokeDashoffset={`${2 * Math.PI * 11 * (1 - Math.min(content.length / MAX_CHARS, 1))}`}
                  strokeLinecap="round"
                  className="transition-all duration-150"
                />
              </svg>
              {nearLimit && (
                <span
                  className={cn(
                    "text-[9px] font-bold tabular-nums",
                    overLimit
                      ? "text-[var(--color-danger-600)]"
                      : "text-[var(--color-warning-600)]"
                  )}
                >
                  {remaining}
                </span>
              )}
            </div>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!canPost || overLimit}
          >
            Post
          </Button>
        </div>
      </div>
    </Card>
  );
}
