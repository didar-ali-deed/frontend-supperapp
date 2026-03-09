import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ── Badge Variants ───────────────────────────────────────────── */
const badgeVariants = cva(
  "inline-flex items-center gap-1 font-medium transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default:     "bg-[var(--color-neutral-900)] text-white dark:bg-white dark:text-[var(--color-neutral-900)]",
        primary:     "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)] dark:text-[var(--color-primary-200)]",
        secondary:   "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
        success:     "bg-[var(--color-success-100)] text-[var(--color-success-700)] dark:bg-[var(--color-success-900)] dark:text-[var(--color-success-300)]",
        warning:     "bg-[var(--color-warning-100)] text-[var(--color-warning-700)] dark:bg-[var(--color-warning-900)] dark:text-[var(--color-warning-300)]",
        danger:      "bg-[var(--color-danger-100)] text-[var(--color-danger-700)] dark:bg-[var(--color-danger-900)] dark:text-[var(--color-danger-300)]",
        outline:     "border border-[var(--surface-border-strong)] bg-transparent text-[var(--text-secondary)]",
      },
      size: {
        sm: "px-2 py-0.5 text-[var(--text-2xs)] rounded-[var(--radius-sm)]",
        md: "px-2.5 py-0.5 text-[var(--text-xs)] rounded-[var(--radius-md)]",
        lg: "px-3 py-1 text-[var(--text-sm)] rounded-[var(--radius-md)]",
      },
      rounded: {
        default: "",
        full: "!rounded-full",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
      rounded: "full",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, rounded, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, rounded }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-[var(--color-success-500)]",
            variant === "danger"  && "bg-[var(--color-danger-500)]",
            variant === "warning" && "bg-[var(--color-warning-500)]",
            variant === "primary" && "bg-[var(--color-primary-500)]",
            !["success","danger","warning","primary"].includes(variant ?? "") && "bg-current"
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
