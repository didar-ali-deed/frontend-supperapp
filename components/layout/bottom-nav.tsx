"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/lib/stores/chat.store";
import { NAV_ITEMS } from "./nav-config";

export const BottomNav = memo(function BottomNav() {
  const pathname    = usePathname();
  const unreadCounts = useChatStore((s) => s.unreadCounts);
  const totalUnread  = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  return (
    <nav
      /*
       * h-bottom-bar = 4rem + env(safe-area-inset-bottom)
       * The colour extends under the iPhone home indicator bar,
       * and the nav items sit in the upper 4rem only.
       */
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[var(--z-sticky)]",
        "h-bottom-bar",                    // safe-area-aware height
        "flex items-start border-t border-[var(--surface-border)]",
        "bg-[var(--surface-bg)]/95 backdrop-blur-md",
        "lg:hidden no-select gpu",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Main navigation"
    >
      {/* Tap area is contained in the top 4rem (h-16) */}
      <div className="flex h-16 w-full items-center px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active     = pathname === href || pathname.startsWith(href + "/");
          const isMessages = href === "/messages";
          const hasUnread  = isMessages && totalUnread > 0;

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2 touch-target"
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              {/* Icon */}
              <span className="relative">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-[var(--radius-lg)]",
                    "transition-all duration-[var(--duration-normal)]",
                    active
                      ? "bg-[var(--color-primary-100)] text-[var(--color-primary-600)] scale-110 dark:bg-[var(--color-primary-900)] dark:text-[var(--color-primary-300)]"
                      : "text-[var(--text-muted)]",
                  )}
                >
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                </span>

                {hasUnread && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center",
                      "rounded-full bg-[var(--color-danger-500)] px-1",
                      "text-[9px] font-bold text-white",
                    )}
                  >
                    {totalUnread > 9 ? "9+" : totalUnread}
                  </span>
                )}
              </span>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  active
                    ? "text-[var(--color-primary-600)] dark:text-[var(--color-primary-300)]"
                    : "text-[var(--text-muted)]",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
});
