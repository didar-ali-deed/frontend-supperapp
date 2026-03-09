"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores/ui.store";
import { Avatar } from "@/components/ui/avatar";
import { SearchBar } from "./search-bar";
import { NotificationBell } from "./notification-panel";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { toggleSidebar } = useUIStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-sticky)] flex h-16 shrink-0 items-center gap-3 px-4",
        "border-b border-[var(--surface-border)] bg-[var(--surface-bg)]/80 backdrop-blur-md"
      )}
    >
      {/* ── Left ─────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)]",
            "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
            "transition-colors lg:hidden"
          )}
        >
          <Menu size={20} />
        </button>

        {/* Mobile logo */}
        <Link
          href="/feed"
          className="flex items-center gap-2 lg:hidden"
          aria-label="SupperApp home"
        >
          <Image
            src="/logo.png"
            alt="SupperApp"
            width={28}
            height={28}
            className="rounded-[var(--radius-md)]"
            priority
          />
        </Link>

        {/* Page title — desktop */}
        {title && (
          <h1 className="hidden lg:block text-base font-semibold text-[var(--text-primary)]">
            {title}
          </h1>
        )}
      </div>

      {/* ── Center — Search ───────────────────── */}
      <div className="flex flex-1 justify-center px-2">
        <SearchBar className="w-full max-w-[480px]" />
      </div>

      {/* ── Right — Actions ───────────────────── */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Notifications */}
        <NotificationBell />

        {/* Settings */}
        <Link
          href="/profile"
          aria-label="Settings"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)]",
            "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
            "transition-colors hidden sm:flex"
          )}
        >
          <Settings size={20} />
        </Link>

        {/* User avatar */}
        <Link
          href="/profile"
          aria-label="My profile"
          className="ml-1 rounded-full ring-2 ring-transparent hover:ring-[var(--color-primary-300)] transition-all"
        >
          <Avatar fallback="Me" size="sm" />
        </Link>
      </div>
    </header>
  );
}
