"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatList } from "@/components/messaging/chat-list";
import { ChatWindow } from "@/components/messaging/chat-window";
import { useMessagingStore } from "@/lib/stores/messaging.store";
import { MOCK_CONVERSATIONS } from "@/lib/data/messages.mock";

export default function MessagesPage() {
  const {
    activeConversationId,
    conversations,
    mobileView,
  } = useMessagingStore();

  const activeConversation = conversations.find((c) => c.id === activeConversationId)
    ?? MOCK_CONVERSATIONS.find((c) => c.id === activeConversationId);

  return (
    /*
     * Full-height flex layout — no Topbar on this page since the
     * ChatWindow header already provides context.
     * On mobile: one panel at a time controlled by mobileView store.
     */
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-0px)]">

      {/* ── Conversation list — left panel ─────────────────────── */}
      <aside
        className={cn(
          "flex-col border-r border-[var(--surface-border)] bg-[var(--surface-bg)]",
          "w-full lg:w-80 xl:w-96 lg:flex shrink-0",
          // Mobile: show only list view
          mobileView === "list" ? "flex" : "hidden lg:flex"
        )}
      >
        <ChatList />
      </aside>

      {/* ── Chat window — right panel ───────────────────────────── */}
      <main
        className={cn(
          "flex-1 flex-col bg-[var(--surface-subtle)]",
          // Mobile: show only chat view
          mobileView === "chat" ? "flex" : "hidden lg:flex"
        )}
      >
        {activeConversation ? (
          <ChatWindow conversation={activeConversation} />
        ) : (
          /* Empty state — desktop only */
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[var(--radius-2xl)] bg-[var(--surface-muted)]">
              <MessageCircle size={36} className="text-[var(--text-muted)]" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-[var(--text-primary)]">
                Select a conversation
              </p>
              <p className="max-w-xs text-sm text-[var(--text-muted)]">
                Choose from your existing conversations or start a new one.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
