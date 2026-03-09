/* ── Profile mock data ────────────────────────────────────────── */

export interface ProfileUser {
  id:               string;
  name:             string;
  username:         string;
  avatar:           string;
  coverUrl:         string | null;
  coverGradient:    [string, string];
  bio:              string;
  location:         string;
  website:          string;
  joinedAt:         string;
  role:             "creator" | "viewer";
  verified:         boolean;
  verificationTier: "blue" | "gold" | null;
  postsCount:       number;
  followersCount:   number;
  followingCount:   number;
}

export interface ProfilePost {
  id:          string;
  thumbnail:   string | null;
  type:        "image" | "video" | "text";
  likesCount:  number;
  commentsCount: number;
  content?:    string;
  createdAt:   string;
}

export interface FollowUser {
  id:          string;
  name:        string;
  username:    string;
  avatar:      string;
  bio:         string;
  verified:    boolean;
  isFollowing: boolean;
}

/* ── Own profile ─────────────────────────────────────────────── */
export const MY_PROFILE: ProfileUser = {
  id:               "u_me",
  name:             "Alex Morgan",
  username:         "alexmorgan",
  avatar:           "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop&crop=faces",
  coverUrl:         "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1200&h=400&fit=crop",
  coverGradient:    ["#6366f1", "#a855f7"],
  bio:              "Building the future of social. Creator · Developer · Coffee enthusiast ☕\nSharing thoughts on tech, design & the creator economy.",
  location:         "San Francisco, CA",
  website:          "https://alexmorgan.dev",
  joinedAt:         "2024-06-15T00:00:00Z",
  role:             "creator",
  verified:         true,
  verificationTier: "gold",
  postsCount:       128,
  followersCount:   4200,
  followingCount:   380,
};

/* ── Posts grid mock ─────────────────────────────────────────── */
export const MY_POSTS: ProfilePost[] = [
  { id: "pp1",  thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop", type: "image",  likesCount: 342,  commentsCount: 28,  createdAt: "2026-03-05T10:00:00Z" },
  { id: "pp2",  thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop", type: "image", likesCount: 891,  commentsCount: 45,  createdAt: "2026-03-04T08:00:00Z" },
  { id: "pp3",  thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop", type: "video", likesCount: 1230, commentsCount: 87,  createdAt: "2026-03-03T14:00:00Z" },
  { id: "pp4",  thumbnail: null,   type: "text",  likesCount: 204,  commentsCount: 19,  content: "Hot take: the best code is no code. Automate everything that bores you.",                createdAt: "2026-03-02T11:00:00Z" },
  { id: "pp5",  thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop", type: "image", likesCount: 567,  commentsCount: 33,  createdAt: "2026-03-01T09:00:00Z" },
  { id: "pp6",  thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=400&fit=crop", type: "video",  likesCount: 430,  commentsCount: 22,  createdAt: "2026-02-28T16:00:00Z" },
  { id: "pp7",  thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop", type: "image", likesCount: 312,  commentsCount: 15,  createdAt: "2026-02-26T12:00:00Z" },
  { id: "pp8",  thumbnail: null,   type: "text",  likesCount: 890,  commentsCount: 72,  content: "We shipped 3 major features this week while most people were arguing about tabs vs spaces. Focus is a superpower.",  createdAt: "2026-02-24T10:00:00Z" },
  { id: "pp9",  thumbnail: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=400&fit=crop", type: "image",  likesCount: 228,  commentsCount: 11,  createdAt: "2026-02-22T08:00:00Z" },
  { id: "pp10", thumbnail: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop", type: "image", likesCount: 158,  commentsCount: 9,   createdAt: "2026-02-20T15:00:00Z" },
  { id: "pp11", thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=600&fit=crop", type: "image", likesCount: 445,  commentsCount: 26,  createdAt: "2026-02-18T11:00:00Z" },
  { id: "pp12", thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=400&fit=crop", type: "image", likesCount: 273,  commentsCount: 18,  createdAt: "2026-02-16T09:00:00Z" },
];

/* ── Followers / Following ───────────────────────────────────── */
export const MOCK_FOLLOWERS: FollowUser[] = [
  { id: "f1", name: "Sara Kim",       username: "sarakim",    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces", bio: "Designer & dreamer",        verified: true,  isFollowing: true  },
  { id: "f2", name: "Jordan Lee",     username: "jordanlee",  avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=faces", bio: "Full-stack engineer",       verified: false, isFollowing: false },
  { id: "f3", name: "Mia Chen",       username: "miachen",    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces", bio: "Product lead at TechCo",   verified: true,  isFollowing: true  },
  { id: "f4", name: "Ryan Park",      username: "ryanpark",   avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces", bio: "Indie hacker & builder",   verified: false, isFollowing: true  },
  { id: "f5", name: "Lily Torres",    username: "lilytorres", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces", bio: "Photographer & traveller",  verified: false, isFollowing: false },
  { id: "f6", name: "James Wu",       username: "jameswu",    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces", bio: "iOS dev, coffee snob",      verified: true,  isFollowing: false },
  { id: "f7", name: "Priya Patel",    username: "priyap",     avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop&crop=faces", bio: "AI researcher & writer",   verified: true,  isFollowing: true  },
  { id: "f8", name: "Carlos Rivera",  username: "carlosr",    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=faces", bio: "Startup founder · ex-Google", verified: false, isFollowing: false },
];

export const MOCK_FOLLOWING: FollowUser[] = [
  { id: "g1", name: "Evan Sharp",     username: "evansharp",  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces", bio: "Design lead & creator",     verified: true,  isFollowing: true  },
  { id: "g2", name: "Nora Walsh",     username: "norawalsh",  avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=faces", bio: "UX writer & content strategist", verified: false, isFollowing: true },
  { id: "g3", name: "David Kim",      username: "davidkim",   avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&crop=faces", bio: "Venture partner @ SeedCap",  verified: true,  isFollowing: true  },
  { id: "g4", name: "Aisha Patel",    username: "aishap",     avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=faces", bio: "Open source contributor",   verified: false, isFollowing: true  },
  { id: "g5", name: "Tom Carter",     username: "tomcarter",  avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&crop=faces", bio: "Podcast host · The Build",   verified: true,  isFollowing: true  },
  { id: "g6", name: "Zoe Martinez",   username: "zoem",       avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=faces", bio: "Creative director",          verified: false, isFollowing: true  },
];

/* ── Achievements ────────────────────────────────────────────── */
export interface Achievement {
  id:    string;
  label: string;
  icon:  string;
  color: string;
}

export const MY_ACHIEVEMENTS: Achievement[] = [
  { id: "a1", label: "Early Creator",   icon: "🚀", color: "#6366f1" },
  { id: "a2", label: "Top 1% Earner",   icon: "💰", color: "#f59e0b" },
  { id: "a3", label: "Viral Post",      icon: "🔥", color: "#ef4444" },
  { id: "a4", label: "1K Followers",    icon: "👥", color: "#10b981" },
  { id: "a5", label: "Verified Creator",icon: "✅", color: "#3b82f6" },
];
