"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageCircle,
  CreditCard,
  BarChart3,
  User,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores";

const NAV_ITEMS = [
  { href: "/feed",      label: "Feed",      icon: Home },
  { href: "/messages",  label: "Messages",  icon: MessageCircle },
  { href: "/payments",  label: "Payments",  icon: CreditCard },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/profile",   label: "Profile",   icon: User },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-30 flex h-full w-64 flex-col border-r border-neutral-200 bg-white transition-transform duration-300 dark:border-neutral-800 dark:bg-neutral-950",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            SupperApp
          </span>
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 lg:hidden dark:hover:bg-neutral-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export function SidebarToggle() {
  const { toggleSidebar } = useUIStore();
  return (
    <button
      onClick={toggleSidebar}
      className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
    >
      <Menu size={20} />
    </button>
  );
}
