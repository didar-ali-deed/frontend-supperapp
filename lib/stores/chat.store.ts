import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ChatState {
  activeConversationId: string | null;
  unreadCounts: Record<string, number>;
  setActiveConversation: (id: string | null) => void;
  incrementUnread: (conversationId: string) => void;
  clearUnread: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      activeConversationId: null,
      unreadCounts: {},
      setActiveConversation: (id) =>
        set({ activeConversationId: id }, false, "chat/setActive"),
      incrementUnread: (conversationId) =>
        set(
          (s) => ({
            unreadCounts: {
              ...s.unreadCounts,
              [conversationId]: (s.unreadCounts[conversationId] ?? 0) + 1,
            },
          }),
          false,
          "chat/incrementUnread"
        ),
      clearUnread: (conversationId) =>
        set(
          (s) => ({
            unreadCounts: { ...s.unreadCounts, [conversationId]: 0 },
          }),
          false,
          "chat/clearUnread"
        ),
    }),
    { name: "ChatStore" }
  )
);
