"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMOJI_CATEGORIES } from "@/lib/data/messages.mock";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  className?: string;
}

export function EmojiPicker({ onSelect, className }: EmojiPickerProps) {
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState(0);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return null;
    const all = EMOJI_CATEGORIES.flatMap((c) => c.emojis);
    return all.filter((e) => e.includes(search));
  }, [search]);

  const displayEmojis =
    filtered ?? EMOJI_CATEGORIES[activeCategory]?.emojis ?? [];

  return (
    <div
      className={cn(
        "flex flex-col rounded-[var(--radius-2xl)] border border-[var(--surface-border)]",
        "bg-[var(--surface-bg)] shadow-[var(--shadow-xl)]",
        "w-[320px] overflow-hidden animate-scale-in origin-bottom-left",
        className
      )}
    >
      {/* Search */}
      <div className="flex items-center gap-2 border-b border-[var(--surface-border)] px-3 py-2.5">
        <Search size={14} className="shrink-0 text-[var(--text-muted)]" />
        <input
          type="search"
          placeholder="Search emoji…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          autoFocus
        />
      </div>

      {/* Category tabs */}
      {!search && (
        <div className="flex overflow-x-auto border-b border-[var(--surface-border)] px-2 py-1 gap-0.5 scrollbar-hide">
          {EMOJI_CATEGORIES.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(i)}
              title={cat.label}
              className={cn(
                "shrink-0 h-8 w-8 flex items-center justify-center rounded-[var(--radius-md)] text-base",
                "transition-colors hover:bg-[var(--surface-muted)]",
                activeCategory === i && "bg-[var(--surface-muted)]"
              )}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* Emoji grid */}
      <div className="h-52 overflow-y-auto p-2">
        {!search && (
          <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {EMOJI_CATEGORIES[activeCategory]?.label}
          </p>
        )}

        {displayEmojis.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-[var(--text-muted)]">No emoji found</p>
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-0.5">
            {displayEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => onSelect(emoji)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]",
                  "text-xl transition-all hover:bg-[var(--surface-muted)] hover:scale-125"
                )}
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Frequently used */}
      <div className="border-t border-[var(--surface-border)] px-2 py-1.5">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Quick
        </p>
        <div className="flex gap-0.5">
          {["👍","❤️","😂","😮","😢","🔥","🎉","👏"].map((e) => (
            <button
              key={e}
              onClick={() => onSelect(e)}
              className="h-8 w-8 flex items-center justify-center rounded-[var(--radius-md)] text-xl hover:bg-[var(--surface-muted)] hover:scale-125 transition-all"
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
