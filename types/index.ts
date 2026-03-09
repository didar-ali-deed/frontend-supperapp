// ─── Generic API Response ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = "viewer" | "creator" | "admin";

export interface User {
  id: string;
  clerkId: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  website: string | null;
  role: UserRole;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  createdAt: string;
}

// ─── Feed ───────────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  author: Pick<User, "id" | "name" | "username" | "avatar">;
  content: string;
  media: PostMedia[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface PostMedia {
  id: string;
  url: string;
  type: "image" | "video";
  width?: number;
  height?: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: Pick<User, "id" | "name" | "username" | "avatar">;
  content: string;
  likesCount: number;
  createdAt: string;
}

// ─── Messaging ──────────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  participants: Pick<User, "id" | "name" | "username" | "avatar">[];
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: Pick<User, "id" | "name" | "avatar">;
  content: string;
  type: "text" | "image" | "file";
  read: boolean;
  createdAt: string;
}

// ─── Payments ───────────────────────────────────────────────────────────────

export type TransactionStatus = "pending" | "completed" | "failed" | "refunded";
export type TransactionType = "tip" | "subscription" | "purchase" | "payout";

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  type: TransactionType;
  from: Pick<User, "id" | "name" | "avatar"> | null;
  to: Pick<User, "id" | "name" | "avatar"> | null;
  description: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

// ─── Creator Dashboard ──────────────────────────────────────────────────────

export interface EarningsSummary {
  totalEarnings: number;
  pendingPayout: number;
  thisMonth: number;
  lastMonth: number;
  currency: string;
}

export interface EarningsChart {
  date: string;
  amount: number;
}

export interface PayoutRequest {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  requestedAt: string;
  completedAt: string | null;
}
