import { create } from "zustand";
import { MY_PROFILE } from "@/lib/data/profile.mock";
import type { ProfileUser } from "@/lib/data/profile.mock";

interface ProfileState {
  profile:         ProfileUser;
  isEditOpen:      boolean;
  followingIds:    Set<string>;

  openEdit:        () => void;
  closeEdit:       () => void;
  saveProfile:     (updates: Partial<ProfileUser>) => void;
  toggleFollow:    (userId: string) => void;
  isFollowing:     (userId: string) => boolean;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile:      MY_PROFILE,
  isEditOpen:   false,
  followingIds: new Set(["f1", "f3", "f4", "f7", "g1", "g2", "g3", "g4", "g5", "g6"]),

  openEdit:  () => set({ isEditOpen: true }),
  closeEdit: () => set({ isEditOpen: false }),

  saveProfile: (updates) =>
    set((s) => ({ profile: { ...s.profile, ...updates }, isEditOpen: false })),

  toggleFollow: (userId) =>
    set((s) => {
      const next = new Set(s.followingIds);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return { followingIds: next };
    }),

  isFollowing: (userId) => get().followingIds.has(userId),
}));
