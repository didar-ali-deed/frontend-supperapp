import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ── Card Variants ────────────────────────────────────────────── */
const cardVariants = cva(
  "rounded-[var(--radius-xl)] border text-[var(--text-primary)] transition-shadow duration-[var(--duration-normal)]",
  {
    variants: {
      variant: {
        /* Default elevated card */
        default: [
          "bg-[var(--surface-bg)] border-[var(--surface-border)]",
          "shadow-[var(--shadow-sm)]",
        ],
        /* Flat — no shadow, muted background */
        flat: [
          "bg-[var(--surface-subtle)] border-[var(--surface-border)]",
          "shadow-none",
        ],
        /* Outlined — just a border */
        outlined: [
          "bg-transparent border-[var(--surface-border-strong)]",
          "shadow-none",
        ],
        /* Interactive — hover lift */
        interactive: [
          "bg-[var(--surface-bg)] border-[var(--surface-border)]",
          "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
          "cursor-pointer",
        ],
        /* Brand highlighted */
        primary: [
          "bg-[var(--color-primary-50)] border-[var(--color-primary-200)]",
          "dark:bg-[var(--color-primary-900)] dark:border-[var(--color-primary-700)]",
          "shadow-none",
        ],
      },
      padding: {
        none: "p-0",
        sm:   "p-4",
        md:   "p-6",
        lg:   "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "none",
    },
  }
);

/* ── Card ─────────────────────────────────────────────────────── */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

/* ── CardHeader ───────────────────────────────────────────────── */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-1 px-6 pt-6 pb-0",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/* ── CardTitle ────────────────────────────────────────────────── */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-base font-semibold leading-none tracking-tight text-[var(--text-primary)]",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/* ── CardDescription ──────────────────────────────────────────── */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--text-secondary)]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/* ── CardContent ──────────────────────────────────────────────── */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 py-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

/* ── CardFooter ───────────────────────────────────────────────── */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-3 px-6 pb-6 pt-0",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

/* ── StatCard — dashboard metric card ────────────────────────── */
interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

function StatCard({ label, value, delta, deltaType = "neutral", icon, className }: StatCardProps) {
  const deltaColor = {
    positive: "text-[var(--color-success-600)]",
    negative: "text-[var(--color-danger-600)]",
    neutral:  "text-[var(--text-muted)]",
  }[deltaType];

  return (
    <Card variant="default" className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            {label}
          </span>
          <span className="text-2xl font-bold text-[var(--text-primary)]">{value}</span>
          {delta && (
            <span className={cn("text-xs font-medium", deltaColor)}>{delta}</span>
          )}
        </div>
        {icon && (
          <div className="rounded-[var(--radius-lg)] bg-[var(--color-primary-50)] p-2.5 text-[var(--color-primary-600)] dark:bg-[var(--color-primary-900)] dark:text-[var(--color-primary-300)]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatCard,
  cardVariants,
};
