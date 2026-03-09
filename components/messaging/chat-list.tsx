"use client";

import * as React from "react";
import { Search, Edit, Pin, BellOff, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils/format";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useMessagingStore } from "@/lib/stores/messaging.store";
import { MOCK_CONVERSATIONS, getOtherParticipant } from "@/lib/data/messages.mock";
import type { ExtConversation } from "@/lib/data/messages.mock";

/* ── Conversation row ─────────────────────────────────────────── */
interface ConvRowProps {
  conv: ExtConversation;
  isActive: boolean;
  onSelect: () => void;
}

function ConvRow({ conv, isActive, onSelect }: ConvRowProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const other = getOtherParticipant(conv);
  const lastMsg = conv.lastMessage;
  const isFromMe = lastMsg?.sender.id === "me";

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer items-center gap-3 px-3 py-3 rounded-[var(--radius-xl)]",
        "transition-colors duration-[var(--duration-fast)]",
        isActive
          ? "bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-950)]"
          : "hover:bg-[var(--surface-muted)]"
      )}
      onClick={onSelect}
    >
      {/* Avatar + online dot */}
      <div className="relative shrink-0">
        <Avatar
          src={other.avatar}
          fallback={other.name}
          size="md"
        />
        {conv.isOnline && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface-bg)] bg-[var(--color-success-500)]" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate text-sm",
              conv.unreadCount > 0 ? "font-bold text-[var(--text-primary)]" : "font-medium text-[var(--text-primary)]"
            )}
          >
            {other.name}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            {conv.isPinned && (
              <Pin size={11} className="text-[var(--text-muted)]" />
            )}
            {conv.isMuted && (
              <BellOff size={11} className="text-[var(--text-muted)]" />
            )}
            <span className="text-[10px] text-[var(--text-muted)]">
              {lastMsg ? formatRelativeTime(lastMsg.createdAt) : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-xs",
              conv.unreadCount > 0 ? "font-medium text-[var(--text-secondary)]" : "text-[var(--text-muted)]"
            )}
          >
            {conv.isTyping ? (
              <span className="text-[var(--color-primary-600)]">typing…</span>
            ) : (
              <>
                {isFromMe && <span className="text-[var(--text-muted)]">You: </span>}
                {lastMsg?.content}
              </>
            )}
          </p>

          {conv.unreadCount > 0 && !conv.isMuted && (
            <Badge variant="primary" size="sm" rounded="full" className="shrink-0">
              {conv.unreadCount}
            </Badge>
          )}
          {conv.unreadCount > 0 && conv.isMuted && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--text-muted)]" />
          )}
        </div>
      </div>

      {/* Context menu trigger */}
      <button
        onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2",
          "flex h-7 w-7 items-center justify-center rounded-full",
          "text-[var(--text-muted)] hover:bg-[var(--surface-border)]",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          menuOpen && "opacity-100"
        )}
        aria-label="Conversation options"
      >
        <MoreHorizontal size={15} />
      </button>

      {/* Mini context menu */}
      {menuOpen && (
        <ConvMenu onClose={() => setMenuOpen(false)} />
      )}
    </div>
  );
}

/* ── Conversation context menu ────────────────────────────────── */
function ConvMenu({ onClose }: { onClose: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    setTimeout(() => document.addEventListener("mousedown", h), 0);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-2 top-10 z-[var(--z-overlay)] w-40",
        "rounded-[var(--radius-xl)] border border-[var(--surface-border)]",
        "bg-[var(--surface-bg)] shadow-[var(--shadow-lg)] overflow-hidden",
        "animate-scale-in origin-top-right"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {[
        { icon: <Pin size={14} />, label: "Pin chat" },
        { icon: <BellOff size={14} />, label: "Mute" },
        { icon: <Trash2 size={14} />, label: "Delete", className: "text-[var(--color-danger-600)]" },
      ].map(({ icon, label, className }) => (
        <button
          key={label}
          onClick={onClose}
          className={cn(
            "flex w-full items-center gap-2.5 px-3 py-2 text-xs",
            "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]",
            className
          )}
        >
          {icon}{label}
        </button>
      ))}
    </div>
  );
}

/* ── ChatList ─────────────────────────────────────────────────── */
export function ChatList() {
  const {
    activeConversationId,
    conversations,
    setConversations,
    setActiveConversation,
  } = useMessagingStore();

  const [search, setSearch] = React.useState("");

  /* Load conversations */
  React.useEffect(() => {
    if (conversations.length === 0) {
      setConversations(MOCK_CONVERSATIONS);
    }
  }, [conversations.length, setConversations]);

  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const other = getOtherParticipant(c);
    return (
      other.name.toLowerCase().includes(search.toLowerCase()) ||
      other.username.toLowerCase().includes(search.toLowerCase())
    );
  });

  const pinned = filtered.filter((c) => c.isPinned);
  const unpinned = filtered.filter((c) => !c.isPinned);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--surface-border)] px-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-[var(--text-primary)]">Messages</h2>
          {totalUnread > 0 && (
            <Badge variant="primary" size="sm">{totalUnread}</Badge>
          )}
        </div>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="New message"
        >
          <Edit size={17} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-subtle)] px-3 py-2 focus-within:border-[var(--color-primary-400)] focus-within:bg-[var(--surface-bg)] transition-all">
          <Search size={15} className="shrink-0 text-[var(--text-muted)]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations"
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-1 pb-4 space-y-0.5">
        {/* Pinned */}
        {pinned.length > 0 && (
          <>
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Pinned
            </p>
            {pinned.map((conv) => (
              <ConvRow
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeConversationId}
                onSelect={() => setActiveConversation(conv.id)}
              />
            ))}
            {unpinned.length > 0 && (
              <p className="mt-1 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                All Messages
              </p>
            )}
          </>
        )}

        {/* Unpinned */}
        {unpinned.map((conv) => (
          <ConvRow
            key={conv.id}
            conv={conv}
            isActive={conv.id === activeConversationId}
            onSelect={() => setActiveConversation(conv.id)}
          />
        ))}

        {/* Empty search */}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-[var(--text-muted)]">No conversations match "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
