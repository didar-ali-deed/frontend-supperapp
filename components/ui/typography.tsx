import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ── Heading ──────────────────────────────────────────────────── */
const headingVariants = cva(
  "font-bold tracking-[var(--tracking-tight)] text-[var(--text-primary)]",
  {
    variants: {
      size: {
        h1: "text-[var(--text-4xl)] leading-[var(--leading-tight)]",
        h2: "text-[var(--text-3xl)] leading-[var(--leading-tight)]",
        h3: "text-[var(--text-2xl)] leading-[var(--leading-snug)]",
        h4: "text-[var(--text-xl)]  leading-[var(--leading-snug)]",
        h5: "text-[var(--text-lg)]  leading-[var(--leading-normal)]",
        h6: "text-[var(--text-base)] leading-[var(--leading-normal)]",
      },
    },
    defaultVariants: { size: "h2" },
  }
);

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: HeadingLevel;
}

function Heading({ as: Tag = "h2", size, className, ...props }: HeadingProps) {
  return (
    <Tag
      className={cn(headingVariants({ size: size ?? (Tag as keyof typeof headingVariants) }), className)}
      {...props}
    />
  );
}

/* ── Text ─────────────────────────────────────────────────────── */
const textVariants = cva("", {
  variants: {
    size: {
      xs:   "text-[var(--text-xs)]",
      sm:   "text-[var(--text-sm)]",
      base: "text-[var(--text-base)]",
      lg:   "text-[var(--text-lg)]",
      xl:   "text-[var(--text-xl)]",
    },
    weight: {
      normal:   "font-[var(--font-normal)]",
      medium:   "font-[var(--font-medium)]",
      semibold: "font-[var(--font-semibold)]",
      bold:     "font-[var(--font-bold)]",
    },
    color: {
      primary:   "text-[var(--text-primary)]",
      secondary: "text-[var(--text-secondary)]",
      muted:     "text-[var(--text-muted)]",
      inverse:   "text-[var(--text-inverse)]",
      danger:    "text-[var(--color-danger-600)]",
      success:   "text-[var(--color-success-600)]",
      warning:   "text-[var(--color-warning-600)]",
      brand:     "text-[var(--color-primary-600)]",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    color: "primary",
  },
});

interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div" | "label" | "strong" | "em" | "small";
}

function Text({ as: Tag = "p", size, weight, color, className, ...props }: TextProps) {
  return (
    <Tag className={cn(textVariants({ size, weight, color }), className)} {...props} />
  );
}

/* ── Code ─────────────────────────────────────────────────────── */
function Code({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "rounded-[var(--radius-sm)] bg-[var(--surface-muted)] px-1.5 py-0.5",
        "font-mono text-[var(--text-sm)] text-[var(--color-primary-700)]",
        "dark:text-[var(--color-primary-300)]",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

/* ── Lead — larger intro paragraph ───────────────────────────── */
function Lead({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-[var(--text-xl)] text-[var(--text-secondary)] leading-[var(--leading-relaxed)]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

/* ── Muted ────────────────────────────────────────────────────── */
function Muted({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-[var(--text-muted)]", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export { Heading, Text, Code, Lead, Muted, headingVariants, textVariants };
