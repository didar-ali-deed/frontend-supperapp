import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Conversation, Message, PaginatedResponse } from "@/types";

const MSG_KEYS = {
  conversations: ["conversations"] as const,
  conversation: (id: string) => ["conversations", id] as const,
  messages: (id: string) => ["conversations", id, "messages"] as const,
};

export function useConversations() {
  return useQuery({
    queryKey: MSG_KEYS.conversations,
    queryFn: () => get<Conversation[]>(ENDPOINTS.messages.conversations),
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: MSG_KEYS.messages(conversationId),
    queryFn: () =>
      get<PaginatedResponse<Message>>(
        ENDPOINTS.messages.messages(conversationId)
      ),
    enabled: !!conversationId,
    refetchInterval: false, // handled by WebSocket
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => post<Message>(ENDPOINTS.messages.send(conversationId), { content }),
    onSuccess: (_, { conversationId }) => {
      qc.invalidateQueries({ queryKey: MSG_KEYS.messages(conversationId) });
      qc.invalidateQueries({ queryKey: MSG_KEYS.conversations });
    },
  });
}
