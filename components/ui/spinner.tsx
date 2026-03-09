import * as React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "xs" | "sm" | "md" | "lg";
}

const SIZE_CLASS = {
  xs: "h-3 w-3 border-[1.5px]",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
};

function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block rounded-full border-[var(--color-primary-500)] border-t-transparent animate-spin",
        SIZE_CLASS[size],
        className
      )}
      {...props}
    />
  );
}

/* ── Full-page loading state ──────────────────────────────────── */
function LoadingScreen({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20">
      <Spinner size="lg" />
      <p className="text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}

export { Spinner, LoadingScreen };
