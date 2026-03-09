/**
 * lib/hooks/useClerkSync.ts
 *
 * Keeps the Clerk session token in sync with:
 *   1. The Axios Authorization header  (via tokenManager)
 *   2. The auth Zustand store          (isAuthenticated, user)
 *
 * Mount this once inside the root <Providers> or root layout.
 *
 * Example:
 *   function Providers({ children }) {
 *     useClerkSync();
 *     return <>{children}</>;
 *   }
 */

"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useAuthStore } from "@/lib/stores/auth.store";

export function useClerkSync() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const syncToken  = useAuthStore((s) => s.syncToken);
  const fetchUser  = useAuthStore((s) => s.fetchUser);
  const clearStore = useAuthStore((s) => s.clear);

  // Track whether we've already fetched the user in this session
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      clearStore();
      hasFetched.current = false;
      return;
    }

    // Signed in — inject fresh token then fetch user
    let cancelled = false;

    async function sync() {
      try {
        const token = await getToken();
        if (cancelled) return;
        syncToken(token);

        if (!hasFetched.current) {
          hasFetched.current = true;
          await fetchUser();
        }
      } catch {
        // Silently ignore — Clerk manages auth state
      }
    }

    sync();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken, syncToken, fetchUser, clearStore]);
}
