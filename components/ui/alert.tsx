import * as React from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ── Alert Variants ───────────────────────────────────────────── */
const alertVariants = cva(
  "relative flex w-full gap-3 rounded-[var(--radius-lg)] border p-4 text-sm",
  {
    variants: {
      variant: {
        info: [
          "border-[var(--color-primary-200)] bg-[var(--color-primary-50)] text-[var(--color-primary-800)]",
          "dark:border-[var(--color-primary-800)] dark:bg-[var(--color-primary-950)] dark:text-[var(--color-primary-200)]",
        ],
        success: [
          "border-[var(--color-success-100)] bg-[var(--color-success-50)] text-[var(--color-success-700)]",
          "dark:border-[var(--color-success-700)] dark:bg-[var(--color-success-950)] dark:text-[var(--color-success-300)]",
        ],
        warning: [
          "border-[var(--color-warning-100)] bg-[var(--color-warning-50)] text-[var(--color-warning-700)]",
          "dark:border-[var(--color-warning-700)] dark:bg-[var(--color-warning-950)] dark:text-[var(--color-warning-300)]",
        ],
        danger: [
          "border-[var(--color-danger-100)] bg-[var(--color-danger-50)] text-[var(--color-danger-700)]",
          "dark:border-[var(--color-danger-700)] dark:bg-[var(--color-danger-950)] dark:text-[var(--color-danger-300)]",
        ],
        neutral: [
          "border-[var(--surface-border)] bg-[var(--surface-subtle)] text-[var(--text-primary)]",
        ],
      },
    },
    defaultVariants: { variant: "info" },
  }
);

const ICON_MAP = {
  info:    <Info size={18} className="mt-0.5 shrink-0" />,
  success: <CheckCircle2 size={18} className="mt-0.5 shrink-0" />,
  warning: <TriangleAlert size={18} className="mt-0.5 shrink-0" />,
  danger:  <AlertCircle size={18} className="mt-0.5 shrink-0" />,
  neutral: <Info size={18} className="mt-0.5 shrink-0" />,
};

/* ── Alert ────────────────────────────────────────────────────── */
export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  onDismiss?: () => void;
}

function Alert({ variant = "info", title, children, onDismiss, className, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {ICON_MAP[variant ?? "info"]}
      <div className="flex flex-1 flex-col gap-0.5">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="opacity-90">{children}</div>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export { Alert, alertVariants };
