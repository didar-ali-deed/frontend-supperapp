/**
 * Centralised API endpoint map.
 * Keep all URL strings here — never hardcode in hooks/components.
 */
export const ENDPOINTS = {
  // ── Auth ──────────────────────────────────────────────────────
  auth: {
    refresh: "/auth/refresh",
    logout:  "/auth/logout",
  },

  // ── Feed ──────────────────────────────────────────────────────
  feed: {
    list:    "/feed",
    post:    (id: string) => `/feed/${id}`,
    create:  "/feed",
    like:    (id: string) => `/feed/${id}/like`,
    unlike:  (id: string) => `/feed/${id}/like`,
    share:   (id: string) => `/feed/${id}/share`,
    comment: (id: string) => `/feed/${id}/comments`,
    delete:  (id: string) => `/feed/${id}`,
  },

  // ── Messaging ─────────────────────────────────────────────────
  messages: {
    conversations: "/conversations",
    conversation:  (id: string) => `/conversations/${id}`,
    create:        "/conversations",
    messages:      (convId: string) => `/conversations/${convId}/messages`,
    send:          (convId: string) => `/conversations/${convId}/messages`,
    read:          (convId: string) => `/conversations/${convId}/read`,
    deleteMsg:     (convId: string, msgId: string) => `/conversations/${convId}/messages/${msgId}`,
    attachment:    (convId: string) => `/conversations/${convId}/attachments`,
  },

  // ── Payments / Wallet ─────────────────────────────────────────
  payments: {
    balance:      "/payments/balance",
    intent:       "/payments/intent",
    send:         "/payments/send",
    transactions: "/payments/transactions",
    transaction:  (id: string) => `/payments/transactions/${id}`,
    methods:      "/payments/methods",
    payout:       "/payments/payouts",
  },

  // ── Creator Dashboard ─────────────────────────────────────────
  dashboard: {
    earnings:      "/dashboard/earnings",
    analytics:     "/dashboard/analytics",
    payouts:       "/dashboard/payouts",
    requestPayout: "/dashboard/payouts/request",
  },

  // ── Profile ───────────────────────────────────────────────────
  profile: {
    me:        "/profile/me",
    user:      (id: string) => `/profile/${id}`,
    update:    "/profile/me",
    avatar:    "/profile/me/avatar",
    followers: (id: string) => `/profile/${id}/followers`,
    following: (id: string) => `/profile/${id}/following`,
    follow:    (id: string) => `/profile/${id}/follow`,
    unfollow:  (id: string) => `/profile/${id}/follow`,
  },
} as const;
