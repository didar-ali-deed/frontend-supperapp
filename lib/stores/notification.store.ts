import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type NotificationType = "like" | "comment" | "follow" | "message" | "payment" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  avatar?: string | null;
  href?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Notification) => void;
  clearAll: () => void;
}

// Seed data so the UI is immediately populated
const SEED: Notification[] = [
  {
    id: "n1",
    type: "like",
    title: "Alex liked your post",
    body: "Your post got a new like.",
    avatar: null,
    href: "/feed",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "n2",
    type: "follow",
    title: "Sara started following you",
    body: "You have a new follower.",
    avatar: null,
    href: "/profile",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: "n3",
    type: "payment",
    title: "Payment received",
    body: "You received $25.00 from Jordan.",
    avatar: null,
    href: "/wallet",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "n4",
    type: "comment",
    title: "New comment on your post",
    body: '"Great work! Love this content."',
    avatar: null,
    href: "/feed",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "n5",
    type: "system",
    title: "Your payout is processing",
    body: "Your $200 payout will arrive within 2 business days.",
    avatar: null,
    href: "/dashboard",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set) => ({
      notifications: SEED,
      panelOpen: false,
      setPanelOpen: (open) => set({ panelOpen: open }, false, "notif/setPanel"),
      togglePanel: () =>
        set((s) => ({ panelOpen: !s.panelOpen }), false, "notif/toggle"),
      markRead: (id) =>
        set(
          (s) => ({
            notifications: s.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
          }),
          false,
          "notif/markRead"
        ),
      markAllRead: () =>
        set(
          (s) => ({
            notifications: s.notifications.map((n) => ({ ...n, read: true })),
          }),
          false,
          "notif/markAllRead"
        ),
      addNotification: (n) =>
        set(
          (s) => ({ notifications: [n, ...s.notifications] }),
          false,
          "notif/add"
        ),
      clearAll: () =>
        set({ notifications: [] }, false, "notif/clearAll"),
    }),
    { name: "NotificationStore" }
  )
);
