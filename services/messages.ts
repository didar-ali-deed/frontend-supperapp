/**
 * services/messages.ts
 *
 * Messaging service.
 * Wraps all /conversations/* endpoints.
 */

import { get, post, del } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { safeRequest, withRetry } from "./api";
import type { Conversation, Message, PaginatedResponse } from "@/types";

/* ── Request / response types ─────────────────────────────────── */

export interface SendMessageInput {
  content:     string;
  type?:       "text" | "image" | "file";
  /** Pre-uploaded attachment URL (from uploadAttachment) */
  attachmentUrl?: string;
}

export interface CreateConversationInput {
  /** The other participant's user ID */
  participantId: string;
  /** Optional opening message */
  initialMessage?: string;
}

export interface UploadAttachmentResult {
  url:      string;
  filename: string;
  size:     number;
  mimeType: string;
}

export interface MessagesParams {
  page?:  number;
  limit?: number;
}

/* ── messagesService ──────────────────────────────────────────── */

export const messagesService = {
  /**
   * List all conversations for the authenticated user,
   * sorted by most recent message descending.
   */
  getConversations(): Promise<Conversation[]> {
    return withRetry(() => get<Conversation[]>(ENDPOINTS.messages.conversations));
  },

  /**
   * Get a single conversation by ID.
   */
  getConversation(id: string): Promise<Conversation> {
    return safeRequest(() =>
      get<Conversation>(ENDPOINTS.messages.conversation(id))
    );
  },

  /**
   * Paginated message history for a conversation.
   * Messages are returned newest-first; reverse for display.
   */
  getMessages(
    convId: string,
    { page = 1, limit = 40 }: MessagesParams = {},
  ): Promise<PaginatedResponse<Message>> {
    return withRetry(() =>
      get<PaginatedResponse<Message>>(ENDPOINTS.messages.messages(convId), {
        params: { page, limit },
      })
    );
  },

  /**
   * Send a message in a conversation.
   * Returns the created message with server-assigned id and timestamps.
   */
  sendMessage(convId: string, input: SendMessageInput): Promise<Message> {
    return safeRequest(() =>
      post<Message>(ENDPOINTS.messages.send(convId), input)
    );
  },

  /**
   * Open a new 1-to-1 conversation (or return existing).
   */
  createConversation(input: CreateConversationInput): Promise<Conversation> {
    return safeRequest(() =>
      post<Conversation>(ENDPOINTS.messages.create, input)
    );
  },

  /**
   * Mark all messages in a conversation as read.
   */
  markRead(convId: string): Promise<void> {
    return safeRequest(() =>
      post<void>(ENDPOINTS.messages.read(convId))
    );
  },

  /**
   * Delete a specific message (soft delete on server).
   */
  deleteMessage(convId: string, msgId: string): Promise<void> {
    return safeRequest(() =>
      del<void>(ENDPOINTS.messages.deleteMsg(convId, msgId))
    );
  },

  /**
   * Upload a file/image attachment and get back a CDN URL.
   * The URL is then passed into sendMessage.
   */
  uploadAttachment(
    convId: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<UploadAttachmentResult> {
    const form = new FormData();
    form.append("file", file);

    return safeRequest(() =>
      post<UploadAttachmentResult>(
        ENDPOINTS.messages.attachment(convId),
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: onProgress
            ? (e) => {
                const pct = e.total
                  ? Math.round((e.loaded / e.total) * 100)
                  : 0;
                onProgress(pct);
              }
            : undefined,
        },
      )
    );
  },
};
