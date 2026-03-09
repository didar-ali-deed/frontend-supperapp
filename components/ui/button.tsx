"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ── Variants ─────────────────────────────────────────────────── */
const buttonVariants = cva(
  // Base
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium leading-none select-none",
    "border border-transparent",
    "transition-all duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-[var(--color-primary-500)]",
    "disabled:pointer-events-none disabled:opacity-40",
    "cursor-pointer",
  ].join(" "),
  {
    variants: {
      variant: {
        /* Filled — primary brand */
        primary: [
          "bg-[var(--color-primary-600)] text-white",
          "hover:bg-[var(--color-primary-700)]",
          "active:scale-[0.98]",
        ],
        /* Filled neutral — default action */
        default: [
          "bg-[var(--color-neutral-900)] text-white",
          "hover:bg-[var(--color-neutral-700)]",
          "dark:bg-[var(--color-neutral-0)] dark:text-[var(--color-neutral-900)]",
          "dark:hover:bg-[var(--color-neutral-200)]",
          "active:scale-[0.98]",
        ],
        /* Destructive */
        destructive: [
          "bg-[var(--color-danger-600)] text-white",
          "hover:bg-[var(--color-danger-700)]",
          "active:scale-[0.98]",
        ],
        /* Outlined */
        outline: [
          "border-[var(--surface-border-strong)] bg-transparent text-[var(--text-primary)]",
          "hover:bg-[var(--surface-muted)]",
          "active:scale-[0.98]",
        ],
        /* Ghost */
        ghost: [
          "bg-transparent text-[var(--text-secondary)]",
          "hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
          "active:scale-[0.98]",
        ],
        /* Success */
        success: [
          "bg-[var(--color-success-600)] text-white",
          "hover:bg-[var(--color-success-700)]",
          "active:scale-[0.98]",
        ],
        /* Link */
        link: [
          "bg-transparent text-[var(--color-primary-600)] underline-offset-4",
          "hover:underline hover:text-[var(--color-primary-700)]",
          "p-0 h-auto",
        ],
      },
      size: {
        xs:   "h-7  px-2.5 text-xs   rounded-[var(--radius-md)]",
        sm:   "h-8  px-3   text-sm   rounded-[var(--radius-md)]",
        md:   "h-10 px-4   text-sm   rounded-[var(--radius-lg)]",
        lg:   "h-11 px-5   text-base rounded-[var(--radius-lg)]",
        xl:   "h-12 px-6   text-base rounded-[var(--radius-xl)]",
        icon: "h-10 w-10  text-sm   rounded-[var(--radius-lg)]",
        "icon-sm": "h-8 w-8 text-xs rounded-[var(--radius-md)]",
        "icon-lg": "h-12 w-12 text-base rounded-[var(--radius-xl)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

/* ── Types ────────────────────────────────────────────────────── */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/* ── Component ────────────────────────────────────────────────── */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

/* ── Inline Spinner (used internally) ────────────────────────── */
function Spinner({ size = "sm" }: { size?: "sm" | "md" }) {
  const cls = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <span
      className={cn(
        "inline-block rounded-full border-2 border-current border-t-transparent animate-spin",
        cls
      )}
      aria-hidden
    />
  );
}

export { Button, buttonVariants, Spinner };
