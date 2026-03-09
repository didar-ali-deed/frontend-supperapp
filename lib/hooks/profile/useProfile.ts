import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, patch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { User } from "@/types";
import type { UpdateProfileInput } from "@/lib/validations";

const PROFILE_KEYS = {
  me: ["profile", "me"] as const,
  user: (id: string) => ["profile", id] as const,
};

export function useMe() {
  return useQuery({
    queryKey: PROFILE_KEYS.me,
    queryFn: () => get<User>(ENDPOINTS.profile.me),
  });
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: PROFILE_KEYS.user(userId),
    queryFn: () => get<User>(ENDPOINTS.profile.user(userId)),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      patch<User>(ENDPOINTS.profile.update, data),
    onSuccess: (updated) => {
      qc.setQueryData(PROFILE_KEYS.me, updated);
    },
  });
}
