"use client";

import * as React from "react";
import { X, CheckCheck, Bell, Heart, MessageCircle, UserPlus, Wallet, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils/format";
import { useNotificationStore, type Notification, type NotificationType } from "@/lib/stores/notification.store";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

/* ── Notification type → icon ─────────────────────────────────── */
const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
  like:    <Heart    size={13} className="text-[var(--color-danger-500)]" />,
  comment: <MessageCircle size={13} className="text-[var(--color-primary-500)]" />,
  follow:  <UserPlus size={13} className="text-[var(--color-success-500)]" />,
  message: <MessageCircle size={13} className="text-[var(--color-primary-500)]" />,
  payment: <Wallet   size={13} className="text-[var(--color-warning-500)]" />,
  system:  <Info     size={13} className="text-[var(--text-muted)]" />,
};

/* ── Single notification row ──────────────────────────────────── */
function NotificationRow({ n }: { n: Notification }) {
  const markRead = useNotificationStore((s) => s.markRead);

  return (
    <button
      onClick={() => markRead(n.id)}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3 text-left",
        "transition-colors duration-[var(--duration-fast)]",
        "hover:bg-[var(--surface-muted)]",
        !n.read && "bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-950)]"
      )}
    >
      {/* Avatar + type icon badge */}
      <div className="relative mt-0.5 shrink-0">
        <Avatar src={n.avatar} fallback={n.title.slice(0, 2)} size="sm" />
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center",
            "rounded-full border border-[var(--surface-bg)] bg-[var(--surface-muted)]"
          )}
        >
          {TYPE_ICON[n.type]}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <p className={cn("text-sm leading-snug text-[var(--text-primary)]", !n.read && "font-medium")}>
          {n.title}
        </p>
        <p className="text-xs text-[var(--text-muted)] truncate">{n.body}</p>
        <p className="text-xs text-[var(--text-muted)]">{formatRelativeTime(n.createdAt)}</p>
      </div>

      {/* Unread dot */}
      {!n.read && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary-500)]" />
      )}
    </button>
  );
}

/* ── Notification Panel ───────────────────────────────────────── */
export function NotificationPanel() {
  const { notifications, panelOpen, setPanelOpen, markAllRead } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on Escape
  React.useEffect(() => {
    if (!panelOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setPanelOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [panelOpen, setPanelOpen]);

  return (
    <>
      {/* Backdrop (mobile) */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-[var(--z-modal)] lg:hidden"
          onClick={() => setPanelOpen(false)}
          aria-hidden
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-[var(--z-modal)] flex h-full w-full flex-col",
          "max-w-[380px] border-l border-[var(--surface-border)] bg-[var(--surface-bg)]",
          "shadow-[var(--shadow-xl)]",
          "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          panelOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="Notifications"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--surface-border)] px-5">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[var(--text-primary)]" />
            <span className="text-base font-semibold text-[var(--text-primary)]">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary-600)] px-1.5 text-xs font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                leftIcon={<CheckCheck size={14} />}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setPanelOpen(false)}
              aria-label="Close notifications"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--surface-border)]">
          {["All", "Unread"].map((tab) => (
            <button
              key={tab}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                tab === "All"
                  ? "border-[var(--color-primary-600)] text-[var(--color-primary-600)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--surface-border)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-2xl)] bg-[var(--surface-muted)]">
                <Bell size={24} className="text-[var(--text-muted)]" />
              </div>
              <p className="text-sm text-[var(--text-muted)]">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => <NotificationRow key={n.id} n={n} />)
          )}
        </div>
      </div>
    </>
  );
}

/* ── Notification Bell Button (used in topbar) ────────────────── */
export function NotificationBell() {
  const { notifications, togglePanel, panelOpen } = useNotificationStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <button
      onClick={togglePanel}
      aria-label="Toggle notifications"
      aria-expanded={panelOpen}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)]",
        "text-[var(--text-secondary)] transition-colors duration-[var(--duration-fast)]",
        "hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
        panelOpen && "bg-[var(--surface-muted)] text-[var(--text-primary)]"
      )}
    >
      <Bell size={20} />
      {unread > 0 && (
        <span
          className={cn(
            "absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center",
            "rounded-full bg-[var(--color-danger-500)] text-[9px] font-bold text-white"
          )}
        >
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </button>
  );
}
