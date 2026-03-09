/* ── Transaction categories ────────────────────────────────────── */
export type TxCategory =
  | "transfer"
  | "subscription"
  | "tip"
  | "payout"
  | "topup"
  | "purchase"
  | "refund";

export type TxDirection = "credit" | "debit";
export type TxStatus = "completed" | "pending" | "failed" | "refunded";

export interface WalletTransaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;          // always positive
  direction: TxDirection;
  category: TxCategory;
  status: TxStatus;
  avatar?: string | null;
  initials?: string;
  color?: string;          // avatar fallback bg color
  date: string;            // ISO
  note?: string;
}

export interface WalletCard {
  id: string;
  label: string;
  balance: number;
  currency: string;
  gradient: [string, string];
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  network: "visa" | "mastercard" | "amex";
}

export interface Contact {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  initials: string;
  color: string;
  verified: boolean;
}

/* ── Cards ─────────────────────────────────────────────────────── */
export const MOCK_CARDS: WalletCard[] = [
  {
    id: "card1",
    label: "Primary Wallet",
    balance: 2_847.50,
    currency: "USD",
    gradient: ["#4f46e5", "#7c3aed"],
    lastFour: "4242",
    expiryMonth: 8,
    expiryYear: 2028,
    network: "visa",
  },
  {
    id: "card2",
    label: "Creator Earnings",
    balance: 1_230.00,
    currency: "USD",
    gradient: ["#0ea5e9", "#0284c7"],
    lastFour: "8831",
    expiryMonth: 3,
    expiryYear: 2027,
    network: "mastercard",
  },
];

/* ── Contacts ──────────────────────────────────────────────────── */
export const MOCK_CONTACTS: Contact[] = [
  { id: "u1", name: "Alex Morgan",  username: "alexmorgan",  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces", initials: "AM", color: "#6366f1", verified: true },
  { id: "u2", name: "Sara Kim",     username: "sarakim",     avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces", initials: "SK", color: "#ec4899", verified: true },
  { id: "u3", name: "Jordan Lee",   username: "jordanlee",   avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=faces", initials: "JL", color: "#10b981", verified: false },
  { id: "u4", name: "Mia Chen",     username: "miachen",     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces", initials: "MC", color: "#f59e0b", verified: true },
  { id: "u5", name: "Ryan Park",    username: "ryanpark",    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces", initials: "RP", color: "#ef4444", verified: false },
  { id: "u6", name: "Priya Sharma", username: "priyasharma", avatar: null, initials: "PS", color: "#8b5cf6", verified: true },
  { id: "u7", name: "Tom Wu",       username: "tomwu",       avatar: null, initials: "TW", color: "#06b6d4", verified: false },
];

/* ── Transactions ──────────────────────────────────────────────── */
export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  { id: "tx1",  title: "From Alex Morgan",    subtitle: "Tip for post",           amount: 12.00,   direction: "credit", category: "tip",          status: "completed", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces", date: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: "tx2",  title: "Netflix",             subtitle: "Monthly subscription",   amount: 15.99,   direction: "debit",  category: "subscription", status: "completed", initials: "N",  color: "#ef4444", date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: "tx3",  title: "Creator Payout",      subtitle: "March earnings",         amount: 320.00,  direction: "credit", category: "payout",       status: "completed", initials: "SA", color: "#10b981", date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "tx4",  title: "Sent to Sara Kim",    subtitle: "Dinner split",           amount: 32.50,   direction: "debit",  category: "transfer",     status: "completed", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces", date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
  { id: "tx5",  title: "Wallet Top-up",       subtitle: "Bank transfer",          amount: 500.00,  direction: "credit", category: "topup",        status: "completed", initials: "BK", color: "#6366f1", date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: "tx6",  title: "From Jordan Lee",     subtitle: "Concert ticket share",   amount: 45.00,   direction: "credit", category: "transfer",     status: "completed", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=faces", date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
  { id: "tx7",  title: "Spotify",             subtitle: "Monthly subscription",   amount: 9.99,    direction: "debit",  category: "subscription", status: "completed", initials: "SP", color: "#22c55e", date: new Date(Date.now() - 1000 * 60 * 60 * 74).toISOString() },
  { id: "tx8",  title: "Refund — Course",     subtitle: "Cancelled order",        amount: 79.00,   direction: "credit", category: "refund",       status: "completed", initials: "RF", color: "#f59e0b", date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString() },
  { id: "tx9",  title: "Sent to Mia Chen",    subtitle: "Collab payment",         amount: 150.00,  direction: "debit",  category: "transfer",     status: "pending",   avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces", date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString() },
  { id: "tx10", title: "Apple iCloud",        subtitle: "Annual plan",            amount: 2.99,    direction: "debit",  category: "subscription", status: "completed", initials: "AP", color: "#64748b", date: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString() },
  { id: "tx11", title: "From Priya Sharma",   subtitle: "Freelance project",      amount: 480.00,  direction: "credit", category: "transfer",     status: "completed", initials: "PS", color: "#8b5cf6", date: new Date(Date.now() - 1000 * 60 * 60 * 170).toISOString() },
  { id: "tx12", title: "Payment Failed",      subtitle: "Insufficient balance",   amount: 200.00,  direction: "debit",  category: "transfer",     status: "failed",    initials: "?", color: "#ef4444",  date: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString() },
];

/* ── Quick amounts ─────────────────────────────────────────────── */
export const QUICK_AMOUNTS = [5, 10, 20, 50, 100, 200];

/* ── Category meta ─────────────────────────────────────────────── */
export const CATEGORY_META: Record<TxCategory, { label: string; color: string; bg: string }> = {
  transfer:     { label: "Transfer",     color: "#6366f1", bg: "#eef2ff" },
  subscription: { label: "Subscription", color: "#ef4444", bg: "#fef2f2" },
  tip:          { label: "Tip",          color: "#f59e0b", bg: "#fffbeb" },
  payout:       { label: "Payout",       color: "#10b981", bg: "#ecfdf5" },
  topup:        { label: "Top-up",       color: "#0ea5e9", bg: "#f0f9ff" },
  purchase:     { label: "Purchase",     color: "#8b5cf6", bg: "#f5f3ff" },
  refund:       { label: "Refund",       color: "#f59e0b", bg: "#fffbeb" },
};

/* ── Helpers ───────────────────────────────────────────────────── */
export function groupTransactionsByDate(txs: WalletTransaction[]) {
  const groups: Record<string, WalletTransaction[]> = {};
  txs.forEach((tx) => {
    const d = new Date(tx.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let key: string;
    if (d.toDateString() === today.toDateString()) key = "Today";
    else if (d.toDateString() === yesterday.toDateString()) key = "Yesterday";
    else key = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  });
  return groups;
}

/* ── SVG QR code generator (pure, no dependency) ──────────────── */
export function generateQRMatrix(data: string): boolean[][] {
  // Deterministic pseudo-random matrix seeded by data string
  const seed = data.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const SIZE = 25;
  const matrix: boolean[][] = [];

  // Finder patterns (top-left, top-right, bottom-left corners)
  const addFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (!matrix[r + i]) matrix[r + i] = [];
        matrix[r + i][c + j] =
          i === 0 || i === 6 || j === 0 || j === 6 ||
          (i >= 2 && i <= 4 && j >= 2 && j <= 4);
      }
    }
  };

  // Init matrix
  for (let i = 0; i < SIZE; i++) {
    matrix[i] = new Array(SIZE).fill(false);
  }

  addFinder(0, 0);
  addFinder(0, SIZE - 7);
  addFinder(SIZE - 7, 0);

  // Timing patterns
  for (let i = 8; i < SIZE - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Data modules with seeded pseudo-random
  let s = seed;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      // Skip finder pattern zones
      const inTopLeft     = r < 8 && c < 8;
      const inTopRight    = r < 8 && c >= SIZE - 8;
      const inBottomLeft  = r >= SIZE - 8 && c < 8;
      const onTiming      = r === 6 || c === 6;
      if (inTopLeft || inTopRight || inBottomLeft || onTiming) continue;
      if (!matrix[r][c]) {
        s = (s * 1664525 + 1013904223) & 0x7fffffff;
        matrix[r][c] = (s & 1) === 1;
      }
    }
  }

  return matrix;
}
