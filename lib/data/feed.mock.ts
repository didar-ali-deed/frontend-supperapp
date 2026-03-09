import type { Post, Comment } from "@/types";

/* ── Mock users ───────────────────────────────────────────────── */
export const MOCK_USERS = [
  {
    id: "u1",
    name: "Alex Morgan",
    username: "alexmorgan",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces",
  },
  {
    id: "u2",
    name: "Sara Kim",
    username: "sarakim",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces",
  },
  {
    id: "u3",
    name: "Jordan Lee",
    username: "jordanlee",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=faces",
  },
  {
    id: "u4",
    name: "Mia Chen",
    username: "miachen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces",
  },
  {
    id: "u5",
    name: "Ryan Park",
    username: "ryanpark",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces",
  },
] as const;

/* ── Mock posts ───────────────────────────────────────────────── */
export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    author: MOCK_USERS[0],
    content:
      "Just launched the design system for our super app 🚀 Every component built from scratch with dark mode, accessibility, and a full token system. The bar for frontend tooling in 2026 is absolutely wild.",
    media: [
      {
        id: "m1",
        url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=500&fit=crop",
        type: "image",
        width: 800,
        height: 500,
      },
    ],
    likesCount: 342,
    commentsCount: 28,
    sharesCount: 54,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "p2",
    author: MOCK_USERS[1],
    content:
      "Working from the coast this week 🌊 Sometimes you just need a change of scenery to get the creative juices flowing. What's your favourite remote work spot?",
    media: [
      {
        id: "m2",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
        type: "image",
        width: 800,
        height: 500,
      },
      {
        id: "m3",
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=500&fit=crop",
        type: "image",
        width: 800,
        height: 500,
      },
    ],
    likesCount: 891,
    commentsCount: 67,
    sharesCount: 103,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "p3",
    author: MOCK_USERS[2],
    content:
      "Hot take: the best UI is no UI. Every interaction you remove is friction you've eliminated. The best products get out of the way and let people do what they came to do. Agree? Disagree?",
    media: [],
    likesCount: 1204,
    commentsCount: 193,
    sharesCount: 412,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "p4",
    author: MOCK_USERS[3],
    content:
      "Studio session highlights from last night 🎵 We recorded three tracks and I genuinely think one of them is going to change things. Can't wait to share. Stay tuned.",
    media: [
      {
        id: "m4",
        url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=500&fit=crop",
        type: "image",
        width: 800,
        height: 500,
      },
      {
        id: "m5",
        url: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=500&fit=crop",
        type: "image",
        width: 800,
        height: 500,
      },
      {
        id: "m6",
        url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=500&fit=crop",
        type: "image",
        width: 800,
        height: 500,
      },
    ],
    likesCount: 567,
    commentsCount: 44,
    sharesCount: 89,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "p5",
    author: MOCK_USERS[4],
    content:
      "Just hit 4K followers 🎉 I started this page with zero plan and zero audience. If you're early in your creator journey — keep going. The compounding effect of consistent content is real. Thank you all.",
    media: [],
    likesCount: 2103,
    commentsCount: 318,
    sharesCount: 276,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "p6",
    author: MOCK_USERS[0],
    content:
      "Morning coding session setup 💻☕ There's something about the early hours that makes complex problems feel tractable. What time do you do your best deep work?",
    media: [
      {
        id: "m7",
        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
        type: "image",
        width: 800,
        height: 500,
      },
      {
        id: "m8",
        url: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&h=500&fit=crop",
        type: "image",
        width: 800,
        height: 500,
      },
      {
        id: "m9",
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
        type: "image",
        width: 800,
        height: 500,
      },
      {
        id: "m10",
        url: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=500&fit=crop",
        type: "image",
        width: 800,
        height: 500,
      },
    ],
    likesCount: 723,
    commentsCount: 58,
    sharesCount: 91,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

/* ── Mock comments ────────────────────────────────────────────── */
export const MOCK_COMMENTS: Record<string, Comment[]> = {
  p1: [
    {
      id: "c1",
      postId: "p1",
      author: MOCK_USERS[1],
      content: "This is genuinely impressive. The token system especially — can we collab?",
      likesCount: 24,
      createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    },
    {
      id: "c2",
      postId: "p1",
      author: MOCK_USERS[2],
      content: "The dark mode implementation is 🔥 What's the animation library?",
      likesCount: 11,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: "c3",
      postId: "p1",
      author: MOCK_USERS[4],
      content: "Bookmarked. This is the kind of content I'm here for.",
      likesCount: 7,
      createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
  ],
  p2: [
    {
      id: "c4",
      postId: "p2",
      author: MOCK_USERS[0],
      content: "Beach + laptop = the dream combo. Which coast?",
      likesCount: 18,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "c5",
      postId: "p2",
      author: MOCK_USERS[3],
      content: "I do my best work from coffee shops honestly. But this looks amazing!",
      likesCount: 9,
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
  ],
  p3: [
    {
      id: "c6",
      postId: "p3",
      author: MOCK_USERS[1],
      content: "Hard agree. Complexity is the enemy. Every button you add is a decision you force on the user.",
      likesCount: 88,
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
      id: "c7",
      postId: "p3",
      author: MOCK_USERS[4],
      content: "Disagree slightly — sometimes surfacing options IS the product. Think settings pages.",
      likesCount: 45,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ],
};

/* ── Paginated feed simulator ─────────────────────────────────── */
export interface FeedPage {
  posts: Post[];
  nextCursor: string | null;
}

export function getMockFeedPage(cursor: string | null, limit = 3): FeedPage {
  const allPosts = [...MOCK_POSTS];
  const startIndex = cursor ? allPosts.findIndex((p) => p.id === cursor) + 1 : 0;
  const slice = allPosts.slice(startIndex, startIndex + limit);
  const nextItem = allPosts[startIndex + limit];
  return {
    posts: slice,
    nextCursor: nextItem ? nextItem.id : null,
  };
}
