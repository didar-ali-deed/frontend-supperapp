/**
 * services/posts.ts
 *
 * Social feed service.
 * Wraps all /feed/* endpoints with typed request / response shapes.
 */

import { get, post, patch, del } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { safeRequest, withRetry } from "./api";
import type { Post, Comment, PaginatedResponse } from "@/types";

/* ── Request types ────────────────────────────────────────────── */

export interface FeedParams {
  page?:   number;
  limit?:  number;
  /** Filter to a specific user's posts */
  userId?: string;
}

export interface CreatePostInput {
  content: string;
  media?:  File[];
}

export interface CreateCommentInput {
  content: string;
  /** Optional parent for threaded replies */
  parentId?: string;
}

export interface SharePostResult {
  sharesCount: number;
}

/* ── postsService ─────────────────────────────────────────────── */

export const postsService = {
  /**
   * Paginated feed. Returns the caller's personalised timeline.
   */
  getFeed({ page = 1, limit = 20, userId }: FeedParams = {}): Promise<PaginatedResponse<Post>> {
    return withRetry(() =>
      get<PaginatedResponse<Post>>(ENDPOINTS.feed.list, {
        params: { page, limit, ...(userId ? { userId } : {}) },
      })
    );
  },

  /**
   * Fetch a single post by ID.
   */
  getPost(id: string): Promise<Post> {
    return safeRequest(() => get<Post>(ENDPOINTS.feed.post(id)));
  },

  /**
   * Create a new post, optionally with media files.
   * Uses multipart/form-data when files are provided.
   */
  createPost({ content, media }: CreatePostInput): Promise<Post> {
    if (media && media.length > 0) {
      const form = new FormData();
      form.append("content", content);
      media.forEach((f) => form.append("media", f));
      return safeRequest(() =>
        post<Post>(ENDPOINTS.feed.create, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      );
    }
    return safeRequest(() => post<Post>(ENDPOINTS.feed.create, { content }));
  },

  /**
   * Toggle a like on a post (idempotent POST).
   */
  likePost(id: string): Promise<{ likesCount: number; isLiked: boolean }> {
    return safeRequest(() =>
      post<{ likesCount: number; isLiked: boolean }>(ENDPOINTS.feed.like(id))
    );
  },

  /**
   * Remove a like from a post.
   */
  unlikePost(id: string): Promise<{ likesCount: number; isLiked: boolean }> {
    return safeRequest(() =>
      del<{ likesCount: number; isLiked: boolean }>(ENDPOINTS.feed.unlike(id))
    );
  },

  /**
   * Share / repost.
   */
  sharePost(id: string): Promise<SharePostResult> {
    return safeRequest(() => post<SharePostResult>(ENDPOINTS.feed.share(id)));
  },

  /**
   * Paginated comments for a post.
   */
  getComments(
    postId: string,
    page = 1,
    limit = 30,
  ): Promise<PaginatedResponse<Comment>> {
    return withRetry(() =>
      get<PaginatedResponse<Comment>>(ENDPOINTS.feed.comment(postId), {
        params: { page, limit },
      })
    );
  },

  /**
   * Add a comment (or reply) to a post.
   */
  addComment(postId: string, input: CreateCommentInput): Promise<Comment> {
    return safeRequest(() =>
      post<Comment>(ENDPOINTS.feed.comment(postId), input)
    );
  },

  /**
   * Delete a post by ID. Caller must own the post.
   */
  deletePost(id: string): Promise<void> {
    return safeRequest(() => del<void>(ENDPOINTS.feed.delete(id)));
  },
};
