"use client";

import { Bell } from "lucide-react";
import { SidebarToggle } from "./sidebar";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="flex items-center gap-3">
        <SidebarToggle />
        {title && (
          <h1 className="text-base font-semibold text-neutral-900 dark:text-white">
            {title}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button className="relative rounded-full p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}
