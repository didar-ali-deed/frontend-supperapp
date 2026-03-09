/**
 * lib/stores/feed.store.ts — Social feed global state.
 *
 * Holds both client-side UI state (optimistic likes/comments) and
 * server-fetched post data so components that don't use TanStack Query
 * can still access a hydrated feed.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { postsService } from "@/services/posts";
import type { Post, Comment } from "@/types";

interface FeedState {
  // ── Server-fetched posts ──────────────────────────────────────
  posts:        Post[];
  page:         number;
  hasMore:      boolean;
  isLoading:    boolean;
  isCreating:   boolean;
  error:        string | null;

  // ── Optimistic UI state ───────────────────────────────────────
  likedPosts:    Set<string>;
  localComments: Record<string, Comment[]>;
  openComments:  Set<string>;
  sharedPosts:   Set<string>;

  // ── Async actions ─────────────────────────────────────────────
  fetchFeed:    (reset?: boolean) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  createPost:   (content: string, media?: File[]) => Promise<void>;
  deletePost:   (postId: string) => Promise<void>;

  // ── Optimistic actions ────────────────────────────────────────
  toggleLike:     (postId: string) => void;
  addComment:     (postId: string, comment: Comment) => void;
  toggleComments: (postId: string) => void;
  markShared:     (postId: string) => void;
}

export const useFeedStore = create<FeedState>()(
  devtools(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────────
      posts:         [],
      page:          1,
      hasMore:       true,
      isLoading:     false,
      isCreating:    false,
      error:         null,
      likedPosts:    new Set(),
      localComments: {},
      openComments:  new Set(),
      sharedPosts:   new Set(),

      // ── fetchFeed ──────────────────────────────────────────────
      fetchFeed: async (reset = false) => {
        const page = reset ? 1 : get().page;
        set({ isLoading: true, error: null, ...(reset ? { posts: [], page: 1, hasMore: true } : {}) },
          false, "feed/fetch/start");
        try {
          const res = await postsService.getFeed({ page, limit: 20 });
          set(
            (s) => ({
              posts:     reset ? res.data : [...s.posts, ...res.data],
              page:      res.meta.page + 1,
              hasMore:   res.meta.hasNextPage,
              isLoading: false,
            }),
            false,
            "feed/fetch/success",
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Failed to load feed";
          set({ isLoading: false, error: msg }, false, "feed/fetch/error");
        }
      },

      fetchNextPage: async () => {
        if (!get().hasMore || get().isLoading) return;
        return get().fetchFeed(false);
      },

      // ── createPost ─────────────────────────────────────────────
      createPost: async (content, media) => {
        set({ isCreating: true, error: null }, false, "feed/create/start");
        try {
          const post = await postsService.createPost({ content, media });
          set(
            (s) => ({ posts: [post, ...s.posts], isCreating: false }),
            false,
            "feed/create/success",
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Failed to create post";
          set({ isCreating: false, error: msg }, false, "feed/create/error");
          throw err;
        }
      },

      // ── deletePost ─────────────────────────────────────────────
      deletePost: async (postId) => {
        // Optimistically remove
        set(
          (s) => ({ posts: s.posts.filter((p) => p.id !== postId) }),
          false, "feed/delete/optimistic",
        );
        try {
          await postsService.deletePost(postId);
        } catch (err) {
          // Re-fetch to restore on error
          get().fetchFeed(true);
          throw err;
        }
      },

      // ── Optimistic UI ──────────────────────────────────────────
      toggleLike: (postId) =>
        set(
          (s) => {
            const next = new Set(s.likedPosts);
            next.has(postId) ? next.delete(postId) : next.add(postId);
            return {
              likedPosts: next,
              posts: s.posts.map((p) =>
                p.id !== postId ? p : {
                  ...p,
                  isLiked:    !p.isLiked,
                  likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
                }
              ),
            };
          },
          false,
          "feed/toggleLike",
        ),

      addComment: (postId, comment) =>
        set(
          (s) => ({
            localComments: {
              ...s.localComments,
              [postId]: [...(s.localComments[postId] ?? []), comment],
            },
            posts: s.posts.map((p) =>
              p.id !== postId ? p : { ...p, commentsCount: p.commentsCount + 1 }
            ),
          }),
          false,
          "feed/addComment",
        ),

      toggleComments: (postId) =>
        set(
          (s) => {
            const next = new Set(s.openComments);
            next.has(postId) ? next.delete(postId) : next.add(postId);
            return { openComments: next };
          },
          false,
          "feed/toggleComments",
        ),

      markShared: (postId) =>
        set(
          (s) => ({
            sharedPosts: new Set([...s.sharedPosts, postId]),
            posts: s.posts.map((p) =>
              p.id !== postId ? p : { ...p, sharesCount: p.sharesCount + 1 }
            ),
          }),
          false,
          "feed/markShared",
        ),
    }),
    { name: "FeedStore" },
  ),
);
