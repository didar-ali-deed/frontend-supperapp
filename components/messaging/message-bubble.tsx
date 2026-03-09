"use client";

import * as React from "react";
import Image from "next/image";
import { Check, CheckCheck, Clock, Download, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils/format";
import { Avatar } from "@/components/ui/avatar";
import type { ExtMessage } from "@/lib/data/messages.mock";
import { formatFileSize } from "@/lib/data/messages.mock";

/* ── Message status icon ──────────────────────────────────────── */
function StatusIcon({ status }: { status?: ExtMessage["status"] }) {
  if (!status || status === "sending")
    return <Clock size={11} className="text-[var(--text-muted)] opacity-70" />;
  if (status === "sent")
    return <Check size={11} className="text-[var(--text-muted)]" />;
  if (status === "delivered")
    return <CheckCheck size={11} className="text-[var(--text-muted)]" />;
  // read
  return <CheckCheck size={11} className="text-[var(--color-primary-400)]" />;
}

/* ── Reaction chips ───────────────────────────────────────────── */
function Reactions({
  reactions,
  isMine,
}: {
  reactions: ExtMessage["reactions"];
  isMine: boolean;
}) {
  if (!reactions?.length) return null;
  return (
    <div className={cn("flex gap-1 mt-1", isMine ? "justify-end" : "justify-start")}>
      {reactions.map(({ emoji, count, mine }) => (
        <button
          key={emoji}
          className={cn(
            "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
            "transition-all hover:scale-105",
            mine
              ? "border-[var(--color-primary-300)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)] dark:border-[var(--color-primary-700)]"
              : "border-[var(--surface-border)] bg-[var(--surface-bg)] text-[var(--text-secondary)]"
          )}
        >
          <span>{emoji}</span>
          {count > 1 && <span className="font-medium">{count}</span>}
        </button>
      ))}
    </div>
  );
}

/* ── Reply preview strip ──────────────────────────────────────── */
function ReplyPreview({ reply, isMine }: { reply: NonNullable<ExtMessage["replyTo"]>; isMine: boolean }) {
  return (
    <div
      className={cn(
        "mb-1.5 rounded-[var(--radius-md)] border-l-2 px-2.5 py-1.5 text-xs",
        "bg-black/5 dark:bg-white/5",
        isMine
          ? "border-[var(--color-primary-300)]"
          : "border-[var(--color-neutral-400)]"
      )}
    >
      <p className="font-semibold text-[var(--color-primary-600)] dark:text-[var(--color-primary-300)]">
        {reply.senderName}
      </p>
      <p className="truncate text-[var(--text-muted)]">{reply.preview}</p>
    </div>
  );
}

/* ── Attachment block ─────────────────────────────────────────── */
function AttachmentBlock({ att }: { att: NonNullable<ExtMessage["attachments"]>[number] }) {
  if (att.type === "image") {
    return (
      <div className="mt-1.5 overflow-hidden rounded-[var(--radius-lg)] cursor-pointer">
        <Image
          src={att.url}
          alt={att.name}
          width={280}
          height={180}
          className="object-cover hover:opacity-95 transition-opacity"
        />
      </div>
    );
  }

  return (
    <a
      href={att.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "mt-1.5 flex items-center gap-3 rounded-[var(--radius-lg)] border p-3",
        "border-[var(--surface-border)] bg-[var(--surface-muted)]",
        "hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]">
        <FileIcon size={18} className="text-[var(--color-primary-600)]" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="truncate text-xs font-medium text-[var(--text-primary)]">{att.name}</span>
        <span className="text-[10px] text-[var(--text-muted)]">
          {formatFileSize(att.size)}
        </span>
      </div>
      <Download size={15} className="ml-auto shrink-0 text-[var(--text-muted)]" />
    </a>
  );
}

/* ── Date separator ───────────────────────────────────────────── */
export function DateSeparator({ date }: { date: string }) {
  const label = (() => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  })();

  return (
    <div className="flex items-center gap-3 py-2 px-4">
      <div className="h-px flex-1 bg-[var(--surface-border)]" />
      <span className="shrink-0 rounded-full bg-[var(--surface-muted)] px-3 py-1 text-[10px] font-medium text-[var(--text-muted)]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[var(--surface-border)]" />
    </div>
  );
}

/* ── MessageBubble ────────────────────────────────────────────── */
interface MessageBubbleProps {
  message: ExtMessage;
  isMine: boolean;
  showAvatar?: boolean;
  isLastInGroup?: boolean;
}

export function MessageBubble({ message, isMine, showAvatar = true, isLastInGroup = true }: MessageBubbleProps) {
  const [hovered, setHovered] = React.useState(false);
  const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢"];

  return (
    <div
      className={cn(
        "group flex items-end gap-2 px-4",
        isMine ? "flex-row-reverse" : "flex-row",
        isLastInGroup ? "mb-3" : "mb-0.5"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar — received only */}
      {!isMine && (
        <div className="w-7 shrink-0">
          {showAvatar && (
            <Avatar
              src={message.sender.avatar}
              fallback={message.sender.name}
              size="xs"
              className="mb-0.5"
            />
          )}
        </div>
      )}

      {/* Hover action bar */}
      <div
        className={cn(
          "flex items-center gap-1 self-center transition-all duration-150",
          isMine ? "order-first mr-1" : "order-last ml-1",
          hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
        )}
      >
        {QUICK_REACTIONS.map((e) => (
          <button
            key={e}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-bg)] border border-[var(--surface-border)] shadow-sm text-sm hover:scale-125 transition-transform"
          >
            {e}
          </button>
        ))}
      </div>

      {/* Bubble */}
      <div className={cn("flex max-w-[70%] flex-col", isMine ? "items-end" : "items-start")}>
        {/* Sender name for received */}
        {!isMine && showAvatar && (
          <span className="mb-1 ml-1 text-[10px] font-semibold text-[var(--text-secondary)]">
            {message.sender.name}
          </span>
        )}

        {/* Reply strip */}
        {message.replyTo && (
          <ReplyPreview reply={message.replyTo} isMine={isMine} />
        )}

        {/* Bubble body */}
        <div
          className={cn(
            "relative px-3.5 py-2.5 text-sm leading-relaxed",
            "shadow-[var(--shadow-xs)]",
            // shape
            isMine
              ? cn(
                  "rounded-[var(--radius-2xl)] rounded-br-[var(--radius-sm)]",
                  "bg-[var(--color-primary-600)] text-white",
                )
              : cn(
                  "rounded-[var(--radius-2xl)] rounded-bl-[var(--radius-sm)]",
                  "bg-[var(--surface-muted)] text-[var(--text-primary)]",
                )
          )}
        >
          {message.content && <p className="break-words">{message.content}</p>}

          {/* Attachments */}
          {message.attachments?.map((att) => (
            <AttachmentBlock key={att.id} att={att} />
          ))}

          {/* Time + status row */}
          <div
            className={cn(
              "mt-1 flex items-center gap-1",
              isMine ? "justify-end" : "justify-start"
            )}
          >
            <span
              className={cn(
                "text-[10px]",
                isMine ? "text-white/60" : "text-[var(--text-muted)]"
              )}
            >
              {new Date(message.createdAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
            {isMine && <StatusIcon status={message.status} />}
          </div>
        </div>

        {/* Reactions */}
        <Reactions reactions={message.reactions} isMine={isMine} />
      </div>
    </div>
  );
}
