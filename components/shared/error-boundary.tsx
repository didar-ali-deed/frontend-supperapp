"use client";

/**
 * components/shared/error-boundary.tsx
 *
 * Reusable error display used by all route error.tsx files.
 */

import * as React from "react";
import { AlertTriangle, WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
  /** Show a "Go home" link back to /feed */
  showHome?: boolean;
  /** Compact — used inside a page section rather than full-screen */
  compact?: boolean;
}

export function ErrorDisplay({
  error,
  reset,
  title,
  description,
  showHome = false,
  compact = false,
}: ErrorDisplayProps) {
  React.useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  const isNetwork =
    error.message?.toLowerCase().includes("network") ||
    error.message?.toLowerCase().includes("fetch") ||
    error.message?.toLowerCase().includes("failed to fetch");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 px-4 text-center animate-fade-in",
        compact ? "py-12" : "py-20",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center rounded-[var(--radius-2xl)]",
          compact ? "h-12 w-12" : "h-16 w-16",
          isNetwork
            ? "bg-[var(--color-warning-100)] text-[var(--color-warning-600)]"
            : "bg-[var(--color-danger-100)] text-[var(--color-danger-600)]",
        )}
      >
        {isNetwork
          ? <WifiOff size={compact ? 22 : 30} />
          : <AlertTriangle size={compact ? 22 : 30} />}
      </div>

      {/* Copy */}
      <div className="max-w-sm space-y-2">
        <h2
          className={cn(
            "font-bold text-[var(--text-primary)]",
            compact ? "text-base" : "text-lg",
          )}
        >
          {title ?? (isNetwork ? "Connection problem" : "Something went wrong")}
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          {description ??
            (isNetwork
              ? "Check your internet connection and try again."
              : "An unexpected error occurred. Please try again.")}
        </p>

        {/* Dev-only error message */}
        {process.env.NODE_ENV === "development" && error.message && (
          <code className="mt-2 block rounded-[var(--radius-md)] bg-[var(--surface-muted)] px-3 py-2 text-left font-mono text-xs text-[var(--color-danger-600)]">
            {error.message}
            {error.digest && (
              <span className="ml-2 opacity-60">digest:{error.digest}</span>
            )}
          </code>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className={cn(
            "inline-flex items-center gap-2 rounded-[var(--radius-lg)]",
            "bg-[var(--color-primary-600)] px-4 py-2 text-sm font-medium text-white",
            "hover:bg-[var(--color-primary-700)] transition-colors active:scale-[0.98]",
          )}
        >
          <RefreshCw size={15} />
          Try again
        </button>

        {showHome && (
          <Link
            href="/feed"
            className={cn(
              "inline-flex items-center gap-2 rounded-[var(--radius-lg)] border",
              "border-[var(--surface-border)] px-4 py-2 text-sm font-medium",
              "text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors",
            )}
          >
            <Home size={15} />
            Go home
          </Link>
        )}
      </div>
    </div>
  );
}
