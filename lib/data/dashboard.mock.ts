/* ── Dashboard mock data ──────────────────────────────────────── */

export type TimeRange = "7D" | "30D" | "90D" | "1Y";

export interface EarningsPoint {
  date: string;
  earnings: number;
  views: number;
}

export interface RevenueSource {
  id: string;
  label: string;
  amount: number;
  color: string;
}

export interface MonetizedPost {
  id: string;
  title: string;
  thumbnail: string;
  earnings: number;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  status: "active" | "pending" | "paused";
}

export interface PayoutMethod {
  id: string;
  label: string;
  type: "bank" | "paypal" | "crypto";
  last4?: string;
}

export interface AnalyticsStat {
  key: string;
  label: string;
  value: number;
  delta: number;
  prefix?: string;
  suffix?: string;
}

/* ── Seeded LCG random (deterministic, no hydration issues) ─── */
function makeLcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function generatePoints(days: number, base: number, seed: number): EarningsPoint[] {
  const rng = makeLcg(seed);
  const now = new Date("2026-03-08");
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - 1 - i));
    const noise  = (rng() - 0.38) * base * 0.55;
    const trend  = (i / days) * base * 0.25;
    const weekly = Math.sin((i / 7) * Math.PI * 2) * base * 0.08;
    return {
      date: date.toISOString().split("T")[0],
      earnings: Math.max(2, Math.round((base + noise + trend + weekly) * 100) / 100),
      views: Math.round(400 + rng() * 5200),
    };
  });
}

export const EARNINGS_DATA: Record<TimeRange, EarningsPoint[]> = {
  "7D":  generatePoints(7,   52,  42),
  "30D": generatePoints(30,  44,  77),
  "90D": generatePoints(90,  38,  13),
  "1Y":  generatePoints(365, 30,  99),
};

export const REVENUE_SOURCES: RevenueSource[] = [
  { id: "subscriptions", label: "Subscriptions",  amount: 1240.50, color: "#6366f1" },
  { id: "tips",          label: "Tips & Gifts",    amount:  380.00, color: "#10b981" },
  { id: "ads",           label: "Ad Revenue",      amount:  510.75, color: "#f59e0b" },
  { id: "sponsored",     label: "Sponsored Posts", amount:  850.00, color: "#ec4899" },
  { id: "ppv",           label: "Pay-per-view",    amount:  195.25, color: "#8b5cf6" },
];

export const MOCK_MONETIZED_POSTS: MonetizedPost[] = [
  {
    id: "mp1",
    title: "How I built a $10k/month SaaS in 90 days",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=160&h=100&fit=crop",
    earnings: 342.50, views: 18400, likes: 1230, comments: 87,
    publishedAt: "2026-02-28T10:00:00Z", status: "active",
  },
  {
    id: "mp2",
    title: "Morning routine that changed my productivity",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=160&h=100&fit=crop",
    earnings: 198.00, views: 9200, likes: 740, comments: 45,
    publishedAt: "2026-02-20T08:30:00Z", status: "active",
  },
  {
    id: "mp3",
    title: "Behind the scenes: My studio setup 2026",
    thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=160&h=100&fit=crop",
    earnings: 127.75, views: 6100, likes: 510, comments: 32,
    publishedAt: "2026-02-15T14:00:00Z", status: "active",
  },
  {
    id: "mp4",
    title: "Exclusive Q&A — Ask Me Anything",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=160&h=100&fit=crop",
    earnings:  89.25, views: 3800, likes: 290, comments: 156,
    publishedAt: "2026-02-10T19:00:00Z", status: "active",
  },
  {
    id: "mp5",
    title: "Design system deep dive (members only)",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=160&h=100&fit=crop",
    earnings:  64.00, views: 2200, likes: 180, comments: 21,
    publishedAt: "2026-02-05T11:00:00Z", status: "pending",
  },
  {
    id: "mp6",
    title: "Live coding session — building with AI",
    thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=160&h=100&fit=crop",
    earnings:  41.00, views: 1650, likes: 130, comments: 14,
    publishedAt: "2026-01-30T16:00:00Z", status: "paused",
  },
];

export const PAYOUT_METHODS: PayoutMethod[] = [
  { id: "bank1",   label: "Chase Checking", type: "bank",   last4: "4821" },
  { id: "paypal1", label: "PayPal",          type: "paypal"              },
  { id: "crypto1", label: "USDC (Polygon)",  type: "crypto"              },
];

export interface PayoutRecord {
  id: string;
  amount: number;
  status: "completed" | "processing" | "pending" | "failed";
  method: string;
  date: string;
}

export const PAYOUT_HISTORY: PayoutRecord[] = [
  { id: "po1", amount: 850.00, status: "completed",  method: "Chase Checking •4821", date: "2026-03-01T10:00:00Z" },
  { id: "po2", amount: 500.00, status: "completed",  method: "PayPal",                date: "2026-02-15T14:00:00Z" },
  { id: "po3", amount: 320.00, status: "processing", method: "Chase Checking •4821", date: "2026-02-01T09:00:00Z" },
  { id: "po4", amount: 200.00, status: "completed",  method: "USDC (Polygon)",        date: "2026-01-15T11:00:00Z" },
];

export const ANALYTICS_STATS: AnalyticsStat[] = [
  { key: "totalViews",      label: "Total Views",     value: 84200, delta:  12.4 },
  { key: "uniqueViewers",   label: "Unique Viewers",  value: 31500, delta:   8.7 },
  { key: "engagementRate",  label: "Engagement Rate", value:   6.8, delta:   1.2, suffix: "%" },
  { key: "followersGained", label: "New Followers",   value:  1840, delta:  23.5 },
  { key: "avgEarnings",     label: "Avg. Per Post",   value: 142.3, delta:   5.1, prefix: "$" },
  { key: "conversionRate",  label: "Conversion Rate", value:   3.4, delta:  -0.8, suffix: "%" },
];
