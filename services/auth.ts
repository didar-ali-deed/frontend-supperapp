/**
 * services/auth.ts
 *
 * Authentication & profile service.
 * Wraps the /auth/* and /profile/me endpoints.
 * Framework-agnostic — no React hooks, no Zustand.
 */

import { get, post, patch, del } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { safeRequest, tokenManager } from "./api";
import type { User } from "@/types";
import type { UpdateProfileInput } from "@/lib/validations";

/* ── Request / response types ─────────────────────────────────── */

export interface LoginInput {
  email:    string;
  password: string;
}

export interface AuthTokens {
  accessToken:  string;
  refreshToken: string;
  expiresIn:    number; // seconds
}

export interface RefreshResult {
  accessToken: string;
  expiresIn:   number;
}

export interface FollowResult {
  followersCount: number;
  isFollowing:    boolean;
}

/* ── authService ──────────────────────────────────────────────── */

export const authService = {
  /**
   * Fetch the currently authenticated user's profile.
   * Called on app boot once the Clerk token is injected.
   */
  getMe(): Promise<User> {
    return safeRequest(() => get<User>(ENDPOINTS.profile.me));
  },

  /**
   * Update the authenticated user's display name, bio, etc.
   */
  updateProfile(data: UpdateProfileInput): Promise<User> {
    return safeRequest(() => patch<User>(ENDPOINTS.profile.update, data));
  },

  /**
   * Upload a new avatar image.
   * Sends multipart/form-data with the file under the key "avatar".
   */
  uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const form = new FormData();
    form.append("avatar", file);
    return safeRequest(() =>
      post<{ avatarUrl: string }>(ENDPOINTS.profile.avatar, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  },

  /**
   * Fetch any user's public profile by ID.
   */
  getUserProfile(userId: string): Promise<User> {
    return safeRequest(() => get<User>(ENDPOINTS.profile.user(userId)));
  },

  /**
   * Follow a user.
   */
  follow(userId: string): Promise<FollowResult> {
    return safeRequest(() => post<FollowResult>(ENDPOINTS.profile.follow(userId)));
  },

  /**
   * Unfollow a user.
   */
  unfollow(userId: string): Promise<FollowResult> {
    return safeRequest(() => del<FollowResult>(ENDPOINTS.profile.unfollow(userId)));
  },

  /**
   * Inject / clear the bearer token from Axios defaults.
   * Call this from a Clerk sync hook when the session token changes.
   */
  setToken(token: string | null): void {
    tokenManager.set(token);
  },

  clearToken(): void {
    tokenManager.clear();
  },

  /**
   * Attempt a silent token refresh using a stored refresh token.
   */
  refreshToken(refreshToken: string): Promise<RefreshResult> {
    return safeRequest(() =>
      post<RefreshResult>(ENDPOINTS.auth.refresh, { refreshToken })
    );
  },

  /**
   * Server-side logout (invalidate refresh token).
   */
  logout(): Promise<void> {
    return safeRequest(() => post<void>(ENDPOINTS.auth.logout));
  },
};
