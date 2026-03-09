"use client";

import * as React from "react";
import { ArrowLeft, Phone, Video, MoreVertical, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SkeletonText, SkeletonAvatar } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageBubble, DateSeparator } from "./message-bubble";
import { MessageInput } from "./message-input";
import { TypingIndicator } from "./typing-indicator";
import { useMessagingStore } from "@/lib/stores/messaging.store";
import { MOCK_MESSAGES, getOtherParticipant } from "@/lib/data/messages.mock";
import type { ExtMessage } from "@/lib/data/messages.mock";
import type { ExtConversation } from "@/lib/data/messages.mock";

/* ── Loading skeleton ─────────────────────────────────────────── */
function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {[false, true, false, true, false].map((isMine, i) => (
        <div key={i} className={cn("flex items-end gap-2", isMine ? "flex-row-reverse" : "flex-row")}>
          {!isMine && <SkeletonAvatar size={28} />}
          <div
            className={cn(
              "flex flex-col gap-1.5",
              isMine ? "items-end" : "items-start",
              "max-w-[60%]"
            )}
          >
            <div
              className={cn(
                "rounded-[var(--radius-2xl)] px-4 py-3",
                isMine
                  ? "rounded-br-[var(--radius-sm)] bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]"
                  : "rounded-bl-[var(--radius-sm)] bg-[var(--surface-muted)]"
              )}
              style={{ width: `${120 + Math.random() * 100}px` }}
            >
              <SkeletonText lines={i % 2 === 0 ? 1 : 2} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Message grouping helper ──────────────────────────────────── */
function shouldShowDate(prev: ExtMessage | undefined, curr: ExtMessage): boolean {
  if (!prev) return true;
  const a = new Date(prev.createdAt).toDateString();
  const b = new Date(curr.createdAt).toDateString();
  return a !== b;
}

function shouldShowAvatar(msgs: ExtMessage[], index: number): boolean {
  const curr = msgs[index];
  const next = msgs[index + 1];
  if (!next) return true;
  return next.sender.id !== curr.sender.id;
}

/* ── ChatWindow ───────────────────────────────────────────────── */
interface ChatWindowProps {
  conversation: ExtConversation;
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const {
    messages,
    setMessages,
    appendMessage,
    typingUsers,
    setTyping,
    markConversationRead,
    setMobileView,
    updateMessageStatus,
  } = useMessagingStore();

  const [loading, setLoading] = React.useState(true);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const convId = conversation.id;
  const other = getOtherParticipant(conversation);
  const convMessages = messages[convId] ?? [];
  const isTyping = typingUsers[convId] ?? false;

  /* ── Load messages ──────────────────────────────────────────── */
  React.useEffect(() => {
    setLoading(true);
    markConversationRead(convId);

    const timer = setTimeout(() => {
      setMessages(convId, MOCK_MESSAGES[convId] ?? []);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [convId, markConversationRead, setMessages]);

  /* ── Auto-scroll to bottom ──────────────────────────────────── */
  React.useEffect(() => {
    if (!loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [convMessages.length, loading, isTyping]);

  /* ── Simulate other person typing after 3s ──────────────────── */
  React.useEffect(() => {
    const t1 = setTimeout(() => setTyping(convId, true), 3000);
    const t2 = setTimeout(() => setTyping(convId, false), 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [convId, setTyping]);

  /* ── Send message ───────────────────────────────────────────── */
  const handleSend = async (content: string, pendingAttachments: any[]) => {
    const msg: ExtMessage = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      sender: { id: "me", name: "You", avatar: null },
      content,
      type: "text",
      read: false,
      status: "sending",
      createdAt: new Date().toISOString(),
      attachments: pendingAttachments.map((a) => ({
        id: a.id,
        name: a.file.name,
        url: a.url,
        size: a.file.size,
        type: a.type === "video" ? "file" : a.type,
      })),
    };

    appendMessage(convId, msg);

    // Simulate delivery
    setTimeout(() => updateMessageStatus(convId, msg.id, "sent"), 600);
    setTimeout(() => updateMessageStatus(convId, msg.id, "delivered"), 1500);
    setTimeout(() => updateMessageStatus(convId, msg.id, "read"), 4000);

    // Simulate auto-reply
    setTimeout(() => {
      const replies = [
        "That's interesting! Tell me more 👀",
        "Got it, thanks!",
        "Sounds great 🙌",
        "I'll check and get back to you",
        "Makes sense!",
      ];
      const reply: ExtMessage = {
        id: `reply-${Date.now()}`,
        conversationId: convId,
        sender: other,
        content: replies[Math.floor(Math.random() * replies.length)],
        type: "text",
        read: false,
        status: "delivered",
        createdAt: new Date().toISOString(),
      };
      appendMessage(convId, reply);
    }, 6000);
  };

  return (
    <div className="flex h-full flex-col">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-3 border-b border-[var(--surface-border)]",
          "bg-[var(--surface-bg)]/80 backdrop-blur-md px-4"
        )}
      >
        {/* Back button — mobile */}
        <button
          onClick={() => setMobileView("list")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-muted)] lg:hidden"
          aria-label="Back to conversations"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Contact info */}
        <div className="relative">
          <Avatar
            src={other.avatar}
            fallback={other.name}
            size="md"
          />
          {conversation.isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface-bg)] bg-[var(--color-success-500)]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {other.name}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {isTyping
              ? <span className="text-[var(--color-primary-600)] font-medium">typing…</span>
              : conversation.isOnline
              ? "Online"
              : `Last seen ${new Date(conversation.updatedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
            }
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon-sm" aria-label="Voice call">
            <Phone size={18} />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Video call">
            <Video size={18} />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Conversation info">
            <Info size={18} />
          </Button>
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-2"
        style={{ scrollBehavior: "smooth" }}
      >
        {loading ? (
          <ChatSkeleton />
        ) : convMessages.length === 0 ? (
          <EmptyState
            title={`Message ${other.name}`}
            description="Say hi to start the conversation!"
          />
        ) : (
          <div className="flex flex-col">
            {convMessages.map((msg, i) => {
              const prev = convMessages[i - 1];
              const isMine = msg.sender.id === "me";
              const showDate = shouldShowDate(prev, msg);
              const showAvatar = !isMine && shouldShowAvatar(convMessages, i);
              const isLastInGroup =
                i === convMessages.length - 1 ||
                convMessages[i + 1]?.sender.id !== msg.sender.id;

              return (
                <React.Fragment key={msg.id}>
                  {showDate && <DateSeparator date={msg.createdAt} />}
                  <MessageBubble
                    message={msg}
                    isMine={isMine}
                    showAvatar={showAvatar}
                    isLastInGroup={isLastInGroup}
                  />
                </React.Fragment>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="px-4 pb-3">
                <div className="flex items-end gap-2">
                  <Avatar src={other.avatar} fallback={other.name} size="xs" />
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Input ──────────────────────────────────────────────── */}
      <MessageInput
        conversationId={convId}
        onSend={handleSend}
        onTyping={(t) => {/* local typing — would emit to socket */}}
      />
    </div>
  );
}
