/**
 * lib/stores/auth.store.ts — Global user / auth state.
 *
 * Usage:
 *   1. Clerk sync hook calls syncToken(token) on every session change.
 *   2. Call fetchUser() once to hydrate the user from /profile/me.
 *   3. Call clear() on logout.
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { authService } from "@/services/auth";
import { tokenManager } from "@/services/api";
import type { User } from "@/types";

export type UserRole = "viewer" | "creator" | "admin";

interface AuthState {
  user:            User | null;
  token:           string | null;
  isLoading:       boolean;
  error:           string | null;
  isHydrated:      boolean;
  isAuthenticated: boolean;
  isCreator:       boolean;

  syncToken:   (token: string | null) => void;
  fetchUser:   () => Promise<void>;
  setUser:     (user: User | null) => void;
  setHydrated: (v: boolean) => void;
  clear:       () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user:            null,
        token:           null,
        isLoading:       false,
        error:           null,
        isHydrated:      false,
        isAuthenticated: false,
        isCreator:       false,

        syncToken: (token) => {
          tokenManager.set(token);
          set({ token, isAuthenticated: token !== null }, false, "auth/syncToken");
        },

        fetchUser: async () => {
          if (!get().token) return;
          set({ isLoading: true, error: null }, false, "auth/fetchUser/start");
          try {
            const user = await authService.getMe();
            set(
              {
                user,
                isLoading:       false,
                isAuthenticated: true,
                isCreator:       user.role === "creator" || user.role === "admin",
              },
              false,
              "auth/fetchUser/success",
            );
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to load user";
            set({ isLoading: false, error: msg }, false, "auth/fetchUser/error");
          }
        },

        setUser: (user) =>
          set(
            {
              user,
              isAuthenticated: user !== null,
              isCreator:       user?.role === "creator" || user?.role === "admin",
            },
            false,
            "auth/setUser",
          ),

        setHydrated: (v) => set({ isHydrated: v }, false, "auth/setHydrated"),

        clear: () => {
          tokenManager.clear();
          set(
            { user: null, token: null, isAuthenticated: false, isCreator: false, error: null },
            false,
            "auth/clear",
          );
        },
      }),
      {
        name: "auth-store",
        partialize: (s) => ({ user: s.user }),
        onRehydrateStorage: () => (state) => { state?.setHydrated(true); },
      },
    ),
    { name: "AuthStore" },
  ),
);
