"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, TrendingUp, User2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Mock recent & trending ───────────────────────────────────── */
const RECENT = ["design systems", "creator economy", "react 19"];
const TRENDING = ["#SuperApp", "Web3 Payments", "Short-form Video"];

/* ── SearchBar ────────────────────────────────────────────────── */
export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const showDropdown = focused && !query;
  const showResults = focused && query.length > 0;

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escape to close
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setFocused(false); inputRef.current?.blur(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setFocused(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const selectSuggestion = (term: string) => {
    setQuery(term);
    setFocused(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input */}
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "flex items-center gap-2 rounded-[var(--radius-xl)]",
            "border border-[var(--surface-border)] bg-[var(--surface-subtle)]",
            "px-3 h-10 transition-all duration-[var(--duration-normal)]",
            focused && "border-[var(--color-primary-400)] bg-[var(--surface-bg)] shadow-[0_0_0_3px_var(--color-primary-100)]"
          )}
        >
          <Search size={16} className="shrink-0 text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search…"
            className={cn(
              "flex-1 bg-transparent text-sm text-[var(--text-primary)]",
              "placeholder:text-[var(--text-muted)]",
              "focus:outline-none"
            )}
            aria-label="Search"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {(showDropdown || showResults) && (
        <div
          className={cn(
            "absolute top-[calc(100%+6px)] left-0 z-[var(--z-overlay)]",
            "w-full min-w-[320px] rounded-[var(--radius-xl)]",
            "border border-[var(--surface-border)] bg-[var(--surface-bg)]",
            "shadow-[var(--shadow-lg)] overflow-hidden",
            "animate-slide-up"
          )}
        >
          {showDropdown && (
            <>
              {/* Recent */}
              <div className="px-4 pt-3 pb-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2">
                  Recent
                </p>
                <ul className="space-y-0.5">
                  {RECENT.map((term) => (
                    <li key={term}>
                      <button
                        onClick={() => selectSuggestion(term)}
                        className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-2 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <Clock size={14} className="shrink-0 text-[var(--text-muted)]" />
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px bg-[var(--surface-border)] mx-4 my-2" />

              {/* Trending */}
              <div className="px-4 pb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2">
                  Trending
                </p>
                <ul className="space-y-0.5">
                  {TRENDING.map((term) => (
                    <li key={term}>
                      <button
                        onClick={() => selectSuggestion(term)}
                        className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-2 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <TrendingUp size={14} className="shrink-0 text-[var(--color-primary-500)]" />
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {showResults && (
            <div className="p-2">
              <button
                onClick={() => selectSuggestion(query)}
                className="flex w-full items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5 text-sm hover:bg-[var(--surface-muted)] transition-colors"
              >
                <Search size={14} className="shrink-0 text-[var(--color-primary-500)]" />
                <span className="text-[var(--text-primary)]">
                  Search for <strong>"{query}"</strong>
                </span>
              </button>
              {/* Mock people results */}
              <div className="h-px bg-[var(--surface-border)] mx-2 my-1.5" />
              {["Alex Morgan", "Jordan Lee"].map((name) => (
                <button
                  key={name}
                  onClick={() => selectSuggestion(name)}
                  className="flex w-full items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5 text-sm hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <User2 size={14} className="shrink-0 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">{name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
