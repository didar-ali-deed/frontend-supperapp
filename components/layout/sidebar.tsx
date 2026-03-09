"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores/ui.store";
import { useChatStore } from "@/lib/stores/chat.store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NAV_ITEMS } from "./nav-config";

/* ── Sidebar ──────────────────────────────────────────────────── */
export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { unreadCounts } = useChatStore();

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[var(--z-overlay)] bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-[var(--z-sticky)] flex h-full w-64 flex-col",
          "border-r border-[var(--surface-border)] bg-[var(--surface-bg)]",
          "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-[var(--surface-border)]">
          <Link href="/feed" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="SupperApp"
              width={32}
              height={32}
              className="rounded-[var(--radius-md)]"
              priority
            />
            <span className="text-base font-bold tracking-tight text-[var(--text-primary)]">
              SupperApp
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-[var(--radius-md)] p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              const isMessages = href === "/messages";
              const unread = isMessages && totalUnread > 0;

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "group flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5",
                      "text-sm font-medium transition-all duration-[var(--duration-fast)]",
                      active
                        ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)] dark:text-[var(--color-primary-200)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {/* Icon wrapper */}
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
                        "transition-colors duration-[var(--duration-fast)]",
                        active
                          ? "bg-[var(--color-primary-100)] text-[var(--color-primary-600)] dark:bg-[var(--color-primary-800)]"
                          : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                      )}
                    >
                      <Icon size={18} />
                    </span>

                    <span className="flex-1">{label}</span>

                    {unread && (
                      <Badge variant="danger" size="sm" className="ml-auto">
                        {totalUnread > 99 ? "99+" : totalUnread}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom user section */}
        <div className="shrink-0 border-t border-[var(--surface-border)] p-3">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5 hover:bg-[var(--surface-muted)] transition-colors"
          >
            <Avatar fallback="Me" size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                My Profile
              </span>
              <span className="text-xs text-[var(--text-muted)] truncate">
                @username
              </span>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
