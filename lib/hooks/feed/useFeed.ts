import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { PaginatedResponse, Post } from "@/types";

const FEED_KEYS = {
  all: ["feed"] as const,
  list: () => [...FEED_KEYS.all, "list"] as const,
  post: (id: string) => [...FEED_KEYS.all, "post", id] as const,
};

export function useFeed() {
  return useInfiniteQuery({
    queryKey: FEED_KEYS.list(),
    queryFn: ({ pageParam = 1 }) =>
      get<PaginatedResponse<Post>>(ENDPOINTS.feed.list, {
        params: { page: pageParam, limit: 20 },
      }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.hasNextPage ? last.meta.page + 1 : undefined,
  });
}

export function useLikePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => post(ENDPOINTS.feed.like(postId)),
    onMutate: async (postId) => {
      await qc.cancelQueries({ queryKey: FEED_KEYS.list() });
      // Optimistic update handled in component via snapshot
      return { postId };
    },
    onSettled: () => qc.invalidateQueries({ queryKey: FEED_KEYS.list() }),
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; media?: File[] }) =>
      post<Post>(ENDPOINTS.feed.create, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: FEED_KEYS.list() }),
  });
}
