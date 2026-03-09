/**
 * lib/stores/messaging.store.ts — Chat / messaging global state.
 *
 * Owns all conversation + message data so the Chat UI can work
 * without TanStack Query. Also calls the messagesService for
 * server operations.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { messagesService } from "@/services/messages";
import type { ExtConversation, ExtMessage } from "@/lib/data/messages.mock";

interface MessagingState {
  // ── Data ──────────────────────────────────────────────────────
  activeConversationId: string | null;
  conversations:        ExtConversation[];
  messages:             Record<string, ExtMessage[]>;
  typingUsers:          Record<string, boolean>;
  mobileView:           "list" | "chat";

  // ── Async status ───────────────────────────────────────────────
  isLoadingConvs:  boolean;
  isLoadingMsgs:   boolean;
  isSending:       boolean;
  error:           string | null;

  // ── Server actions ─────────────────────────────────────────────
  fetchConversations: () => Promise<void>;
  markRead:           (convId: string) => Promise<void>;

  // ── Local / optimistic actions ─────────────────────────────────
  setActiveConversation:  (id: string | null) => void;
  setConversations:       (convs: ExtConversation[]) => void;
  setMessages:            (convId: string, msgs: ExtMessage[]) => void;
  appendMessage:          (convId: string, msg: ExtMessage) => void;
  setTyping:              (convId: string, typing: boolean) => void;
  markConversationRead:   (convId: string) => void;
  setMobileView:          (view: "list" | "chat") => void;
  updateMessageStatus:    (convId: string, msgId: string, status: ExtMessage["status"]) => void;
}

export const useMessagingStore = create<MessagingState>()(
  devtools(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────────
      activeConversationId: null,
      conversations:        [],
      messages:             {},
      typingUsers:          {},
      mobileView:           "list",
      isLoadingConvs:       false,
      isLoadingMsgs:        false,
      isSending:            false,
      error:                null,

      // ── fetchConversations ─────────────────────────────────────
      fetchConversations: async () => {
        set({ isLoadingConvs: true, error: null }, false, "msg/fetchConvs/start");
        try {
          // Cast server response to ExtConversation (same shape)
          const convs = await messagesService.getConversations() as unknown as ExtConversation[];
          set({ conversations: convs, isLoadingConvs: false }, false, "msg/fetchConvs/success");
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Failed to load conversations";
          set({ isLoadingConvs: false, error: msg }, false, "msg/fetchConvs/error");
        }
      },

      // ── markRead ───────────────────────────────────────────────
      markRead: async (convId) => {
        get().markConversationRead(convId); // optimistic
        try {
          await messagesService.markRead(convId);
        } catch {
          // Silently fail — unread badge inconsistency is not critical
        }
      },

      // ── Local / optimistic ─────────────────────────────────────
      setActiveConversation: (id) =>
        set({ activeConversationId: id, mobileView: id ? "chat" : "list" }, false, "msg/setActive"),

      setConversations: (convs) =>
        set({ conversations: convs }, false, "msg/setConversations"),

      setMessages: (convId, msgs) =>
        set((s) => ({ messages: { ...s.messages, [convId]: msgs } }), false, "msg/setMessages"),

      appendMessage: (convId, msg) =>
        set(
          (s) => ({
            messages: {
              ...s.messages,
              [convId]: [...(s.messages[convId] ?? []), msg],
            },
            conversations: s.conversations.map((c) =>
              c.id === convId ? { ...c, lastMessage: msg, updatedAt: msg.createdAt } : c
            ),
          }),
          false,
          "msg/appendMessage",
        ),

      setTyping: (convId, typing) =>
        set((s) => ({ typingUsers: { ...s.typingUsers, [convId]: typing } }), false, "msg/setTyping"),

      markConversationRead: (convId) =>
        set(
          (s) => ({
            conversations: s.conversations.map((c) =>
              c.id === convId ? { ...c, unreadCount: 0 } : c
            ),
          }),
          false,
          "msg/markRead",
        ),

      setMobileView: (view) =>
        set({ mobileView: view }, false, "msg/setMobileView"),

      updateMessageStatus: (convId, msgId, status) =>
        set(
          (s) => ({
            messages: {
              ...s.messages,
              [convId]: (s.messages[convId] ?? []).map((m) =>
                m.id === msgId ? { ...m, status } : m
              ),
            },
          }),
          false,
          "msg/updateStatus",
        ),
    }),
    { name: "MessagingStore" },
  ),
);
