/**
 * services/index.ts
 *
 * Central export for all service modules.
 *
 * Architecture layers:
 *   lib/api/     → HTTP transport  (Axios instance, typed helpers)
 *   services/    → Business logic  (typed operations, error normalisation)
 *   lib/hooks/   → Server state    (TanStack Query — caching, revalidation)
 *   lib/stores/  → Client state    (Zustand — UI state, optimistic updates)
 */
export * from "./api";
export * from "./auth";
export * from "./posts";
export * from "./messages";
export * from "./payments";
