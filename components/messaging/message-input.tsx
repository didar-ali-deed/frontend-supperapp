"use client";

import * as React from "react";
import { Paperclip, Smile, Send, X, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmojiPicker } from "./emoji-picker";
import { AttachmentUploader, usePendingAttachments } from "./attachment-uploader";
import type { PendingAttachment } from "./attachment-uploader";

interface MessageInputProps {
  conversationId: string;
  onSend: (content: string, attachments: PendingAttachment[]) => void;
  onTyping?: (typing: boolean) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, onTyping, disabled }: MessageInputProps) {
  const [content, setContent] = React.useState("");
  const [showEmoji, setShowEmoji] = React.useState(false);
  const { attachments, add: addFiles, remove: removeFile, clear: clearFiles } = usePendingAttachments();

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const emojiRef = React.useRef<HTMLDivElement>(null);
  const typingTimerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const canSend = content.trim().length > 0 || attachments.length > 0;

  /* ── Auto-resize ──────────────────────────────────────────── */
  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  /* ── Typing signal ────────────────────────────────────────── */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    resize();
    onTyping?.(true);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => onTyping?.(false), 1500);
  };

  /* ── Close emoji on outside click ────────────────────────── */
  React.useEffect(() => {
    if (!showEmoji) return;
    const handler = (e: MouseEvent) => {
      if (!emojiRef.current?.contains(e.target as Node)) setShowEmoji(false);
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmoji]);

  /* ── Insert emoji at cursor ───────────────────────────────── */
  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) {
      setContent((c) => c + emoji);
      return;
    }
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    const next = content.slice(0, start) + emoji + content.slice(end);
    setContent(next);
    setShowEmoji(false);
    // Restore cursor
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + emoji.length, start + emoji.length);
      resize();
    }, 0);
  };

  /* ── Send ─────────────────────────────────────────────────── */
  const handleSend = () => {
    if (!canSend || disabled) return;
    onSend(content.trim(), attachments);
    setContent("");
    clearFiles();
    onTyping?.(false);
    clearTimeout(typingTimerRef.current);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ── File pick ────────────────────────────────────────────── */
  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div className="relative flex flex-col border-t border-[var(--surface-border)] bg-[var(--surface-bg)]">

      {/* Pending attachments strip */}
      <AttachmentUploader attachments={attachments} onRemove={removeFile} />

      {/* Emoji picker */}
      {showEmoji && (
        <div ref={emojiRef} className="absolute bottom-full left-4 mb-2 z-[var(--z-overlay)]">
          <EmojiPicker onSelect={insertEmoji} />
        </div>
      )}

      {/* Main input row */}
      <div className="flex items-end gap-2 px-3 py-3">
        {/* Left actions */}
        <div className="flex shrink-0 items-end gap-0.5 pb-0.5">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.zip"
            className="sr-only"
            onChange={handleFilePick}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
              "transition-colors"
            )}
            aria-label="Attach file"
          >
            <Paperclip size={20} />
          </button>
        </div>

        {/* Textarea wrapper */}
        <div
          className={cn(
            "relative flex flex-1 items-end rounded-[var(--radius-2xl)] border",
            "border-[var(--surface-border-strong)] bg-[var(--surface-subtle)]",
            "focus-within:border-[var(--color-primary-400)] focus-within:bg-[var(--surface-bg)]",
            "transition-all duration-[var(--duration-normal)]"
          )}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Type a message…"
            className={cn(
              "flex-1 resize-none bg-transparent px-4 py-2.5 text-sm",
              "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              "focus:outline-none max-h-[120px] overflow-y-auto leading-relaxed"
            )}
          />

          {/* Emoji button inside input */}
          <button
            onClick={() => setShowEmoji((s) => !s)}
            className={cn(
              "mb-2 mr-2 shrink-0 flex h-7 w-7 items-center justify-center rounded-full",
              "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--color-warning-500)]",
              "transition-colors",
              showEmoji && "text-[var(--color-warning-500)] bg-[var(--surface-muted)]"
            )}
            aria-label="Emoji picker"
            type="button"
          >
            <Smile size={18} />
          </button>
        </div>

        {/* Send / Mic button */}
        <button
          onClick={canSend ? handleSend : undefined}
          disabled={disabled}
          aria-label={canSend ? "Send message" : "Voice message"}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            "transition-all duration-200",
            canSend
              ? "bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] scale-100"
              : "bg-[var(--surface-muted)] text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]"
          )}
        >
          {canSend
            ? <Send size={18} className="translate-x-0.5 -translate-y-0.5" />
            : <Mic size={18} />
          }
        </button>
      </div>
    </div>
  );
}
