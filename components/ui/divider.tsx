import * as React from "react";
import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  orientation?: "horizontal" | "vertical";
}

function Divider({ label, orientation = "horizontal", className, ...props }: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={cn(
          "self-stretch w-px bg-[var(--surface-border)]",
          className
        )}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)} role="separator" {...props}>
        <div className="h-px flex-1 bg-[var(--surface-border)]" />
        <span className="text-xs font-medium text-[var(--text-muted)]">{label}</span>
        <div className="h-px flex-1 bg-[var(--surface-border)]" />
      </div>
    );
  }

  return (
    <hr
      className={cn("border-none h-px bg-[var(--surface-border)] w-full", className)}
      {...props}
    />
  );
}

export { Divider };
