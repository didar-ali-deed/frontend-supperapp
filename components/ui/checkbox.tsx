"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Checkbox ─────────────────────────────────────────────────── */
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, label, description, indeterminate = false, error, id, ...props },
    ref
  ) => {
    const innerId = id ?? React.useId();

    const inputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        if (node) node.indeterminate = indeterminate;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [indeterminate, ref]
    );

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <label htmlFor={innerId} className="flex items-start gap-3 cursor-pointer group">
          {/* Hidden real checkbox */}
          <div className="relative mt-0.5 shrink-0">
            <input
              ref={inputRef}
              id={innerId}
              type="checkbox"
              className="sr-only peer"
              {...props}
            />
            {/* Custom box */}
            <div
              className={cn(
                "h-4.5 w-4.5 rounded-[var(--radius-sm)] border-2 transition-all duration-[var(--duration-normal)]",
                "border-[var(--surface-border-strong)]",
                "peer-checked:border-[var(--color-primary-600)] peer-checked:bg-[var(--color-primary-600)]",
                "peer-indeterminate:border-[var(--color-primary-600)] peer-indeterminate:bg-[var(--color-primary-600)]",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-primary-500)] peer-focus-visible:ring-offset-2",
                "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
                error && "border-[var(--color-danger-500)]"
              )}
              aria-hidden
            >
              <Check
                size={10}
                strokeWidth={3}
                className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              />
              {indeterminate && (
                <Minus
                  size={10}
                  strokeWidth={3}
                  className="absolute inset-0 m-auto text-white"
                />
              )}
            </div>
          </div>

          {(label || description) && (
            <div className="flex flex-col gap-0.5">
              {label && (
                <span className="text-sm font-medium text-[var(--text-primary)] group-has-[:disabled]:opacity-50">
                  {label}
                </span>
              )}
              {description && (
                <span className="text-xs text-[var(--text-muted)]">{description}</span>
              )}
            </div>
          )}
        </label>
        {error && (
          <p className="text-xs text-[var(--color-danger-600)]">{error}</p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

/* ── Switch / Toggle ──────────────────────────────────────────── */
export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  size?: "sm" | "md";
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, size = "md", id, ...props }, ref) => {
    const innerId = id ?? React.useId();

    const trackClass = size === "sm"
      ? "h-4 w-7"
      : "h-5 w-9";

    const thumbClass = size === "sm"
      ? "h-3 w-3 peer-checked:translate-x-3"
      : "h-3.5 w-3.5 peer-checked:translate-x-4";

    return (
      <label htmlFor={innerId} className={cn("flex items-start gap-3 cursor-pointer group", className)}>
        <div className="relative mt-0.5 shrink-0">
          <input
            ref={ref}
            id={innerId}
            type="checkbox"
            role="switch"
            className="sr-only peer"
            {...props}
          />
          {/* Track */}
          <div
            className={cn(
              "rounded-full border-2 border-transparent transition-colors duration-[var(--duration-normal)]",
              "bg-[var(--color-neutral-300)] peer-checked:bg-[var(--color-primary-600)]",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-primary-500)] peer-focus-visible:ring-offset-2",
              "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
              trackClass
            )}
            aria-hidden
          />
          {/* Thumb */}
          <div
            className={cn(
              "absolute top-0.5 left-0.5 rounded-full bg-white shadow-sm",
              "transition-transform duration-[var(--duration-normal)]",
              thumbClass
            )}
            aria-hidden
          />
        </div>

        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <span className="text-sm font-medium text-[var(--text-primary)] group-has-[:disabled]:opacity-50">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-[var(--text-muted)]">{description}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Checkbox, Switch };
