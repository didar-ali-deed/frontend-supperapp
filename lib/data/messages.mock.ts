import type { Conversation, Message } from "@/types";

export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export interface ExtMessage extends Message {
  status?: MessageStatus;
  reactions?: { emoji: string; count: number; mine: boolean }[];
  attachments?: { id: string; name: string; url: string; size: number; type: "image" | "file" }[];
  replyTo?: { id: string; preview: string; senderName: string } | null;
}

export interface ExtConversation extends Conversation {
  isOnline?: boolean;
  isTyping?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
}

/* ── Participants ──────────────────────────────────────────────── */
const ME = { id: "me", name: "You", username: "me", avatar: null };

const USERS = {
  alex: {
    id: "u1", name: "Alex Morgan", username: "alexmorgan",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces",
  },
  sara: {
    id: "u2", name: "Sara Kim", username: "sarakim",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces",
  },
  jordan: {
    id: "u3", name: "Jordan Lee", username: "jordanlee",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=faces",
  },
  mia: {
    id: "u4", name: "Mia Chen", username: "miachen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces",
  },
};

/* ── Conversations ─────────────────────────────────────────────── */
export const MOCK_CONVERSATIONS: ExtConversation[] = [
  {
    id: "conv1",
    participants: [ME, USERS.alex],
    lastMessage: {
      id: "m_last1", conversationId: "conv1",
      sender: USERS.alex,
      content: "That design system looks amazing btw 🔥",
      type: "text", read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    },
    unreadCount: 2,
    isOnline: true,
    isPinned: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
  {
    id: "conv2",
    participants: [ME, USERS.sara],
    lastMessage: {
      id: "m_last2", conversationId: "conv2",
      sender: ME,
      content: "Sent you the files, let me know what you think!",
      type: "text", read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    },
    unreadCount: 0,
    isOnline: true,
    isTyping: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
  },
  {
    id: "conv3",
    participants: [ME, USERS.jordan],
    lastMessage: {
      id: "m_last3", conversationId: "conv3",
      sender: USERS.jordan,
      content: "Let's catch up this week?",
      type: "text", read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    unreadCount: 1,
    isOnline: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "conv4",
    participants: [ME, USERS.mia],
    lastMessage: {
      id: "m_last4", conversationId: "conv4",
      sender: USERS.mia,
      content: "Check out this track I finished 🎵",
      type: "text", read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    unreadCount: 0,
    isOnline: false,
    isMuted: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

/* ── Messages per conversation ─────────────────────────────────── */
export const MOCK_MESSAGES: Record<string, ExtMessage[]> = {
  conv1: [
    {
      id: "m1", conversationId: "conv1", sender: USERS.alex,
      content: "Hey! Saw you launched the super app project — looks incredible!",
      type: "text", read: true, status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "m2", conversationId: "conv1", sender: ME,
      content: "Thanks so much! Been working on it all week. The design system took the longest.",
      type: "text", read: true, status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    },
    {
      id: "m3", conversationId: "conv1", sender: USERS.alex,
      content: "I saw the component library — the modal system is clean 👌 What's your token approach?",
      type: "text", read: true, status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
      id: "m4", conversationId: "conv1", sender: ME,
      content: "CSS custom properties on :root with semantic aliases. Light/dark swap happens at one layer — no Tailwind dark: prefix sprawl.",
      type: "text", read: true, status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    },
    {
      id: "m5", conversationId: "conv1", sender: USERS.alex,
      content: "That's the move. Here's a screenshot of our current setup for comparison",
      type: "text", read: true, status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      attachments: [
        {
          id: "att1", name: "design-tokens.png",
          url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
          size: 248_000, type: "image",
        },
      ],
    },
    {
      id: "m6", conversationId: "conv1", sender: ME,
      content: "Oh nice — you're using a similar scale. We should sync on the spacing decisions, mine's 4px base.",
      type: "text", read: true, status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      reactions: [{ emoji: "👍", count: 1, mine: false }],
    },
    {
      id: "m7", conversationId: "conv1", sender: USERS.alex,
      content: "That design system looks amazing btw 🔥",
      type: "text", read: false, status: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    },
  ],
  conv2: [
    {
      id: "m8", conversationId: "conv2", sender: USERS.sara,
      content: "Hey, can you send me the Figma file for the feed component?",
      type: "text", read: true, status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "m9", conversationId: "conv2", sender: ME,
      content: "Sure! Give me 5 minutes to export it properly.",
      type: "text", read: true, status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
    },
    {
      id: "m10", conversationId: "conv2", sender: ME,
      content: "Sent you the files, let me know what you think!",
      type: "text", read: true, status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
      attachments: [
        {
          id: "att2", name: "feed-components.fig",
          url: "#", size: 1_240_000, type: "file",
        },
      ],
    },
  ],
  conv3: [
    {
      id: "m11", conversationId: "conv3", sender: ME,
      content: "Jordan! Hope you're doing well.",
      type: "text", read: true, status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: "m12", conversationId: "conv3", sender: USERS.jordan,
      content: "All good! Been heads down on a project. Let's catch up this week?",
      type: "text", read: false, status: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ],
  conv4: [
    {
      id: "m13", conversationId: "conv4", sender: USERS.mia,
      content: "Check out this track I finished 🎵",
      type: "text", read: true, status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    },
    {
      id: "m14", conversationId: "conv4", sender: USERS.mia,
      content: "Recorded it last night. The mix still needs work but the vibe is right.",
      type: "text", read: true, status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ],
};

/* ── Helpers ───────────────────────────────────────────────────── */
export function getOtherParticipant(conv: ExtConversation) {
  return conv.participants.find((p) => p.id !== "me") ?? conv.participants[0];
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ── Emoji data ────────────────────────────────────────────────── */
export const EMOJI_CATEGORIES = [
  {
    label: "Smileys",
    icon: "😊",
    emojis: ["😀","😃","😄","😁","😅","😂","🤣","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","🥸","😎","🤓","🧐"],
  },
  {
    label: "Gestures",
    icon: "👋",
    emojis: ["👋","🤚","🖐","✋","🖖","👌","🤌","🤏","✌","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🙏","✍","💅","🤳","💪","🦾","🦿"],
  },
  {
    label: "Hearts",
    icon: "❤️",
    emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","❤️‍🔥","❤️‍🩹","💔","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉","✡️","🔯","🛐","⛎"],
  },
  {
    label: "Nature",
    icon: "🌿",
    emojis: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐒","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🦟","🦗"],
  },
  {
    label: "Food",
    icon: "🍕",
    emojis: ["🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶","🫑","🧄","🧅","🥔","🌽","🍠","🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍔","🍟","🍕"],
  },
  {
    label: "Travel",
    icon: "✈️",
    emojis: ["🚗","🚕","🚙","🚌","🚎","🏎","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🛵","🏍","🚲","🛴","🛹","🛼","🚏","🛣","🛤","⛽","🚨","🚥","🚦","🚧","⚓","🛟","⛵","🚤","🛥","🛳","⛴","🚢","✈️","🛩","🛫","🛬","🪂","💺","🚁","🚟","🚃","🚋","🚞"],
  },
  {
    label: "Objects",
    icon: "💡",
    emojis: ["⌚","📱","💻","⌨","🖥","🖨","🖱","🖲","💾","💿","📀","📷","📸","📹","🎥","📽","🎞","📞","☎","📟","📠","📺","📻","🧭","⏱","⏲","⏰","🕰","⌛","⏳","📡","🔋","🪫","🔌","💡","🔦","🕯","🪔","🧯","🛢","💸","💵","💴","💶","💷","🪙","💰","💳","💹","✉","📧"],
  },
  {
    label: "Symbols",
    icon: "🔥",
    emojis: ["🔥","💫","⭐","🌟","✨","⚡","☄","💥","🎉","🎊","🎈","🎁","🎀","🎗","🎟","🎫","🏆","🥇","🥈","🥉","🏅","🎖","🎗","🎪","🤹","🎭","🎨","🎬","🎤","🎧","🎼","🎵","🎶","🎷","🎸","🎹","🥁","🪘","🎺","🎻","🪕","🎮","🕹","🎲","♟","🃏","🀄","🎯","🎳","🎰","🎳"],
  },
];
