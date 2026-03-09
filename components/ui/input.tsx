"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Base Input ───────────────────────────────────────────────── */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightIcon, type = "text", ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 text-[var(--text-muted)]">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            // Base
            "h-10 w-full rounded-[var(--radius-lg)] border bg-[var(--surface-bg)]",
            "px-3 py-2 text-sm text-[var(--text-primary)]",
            "placeholder:text-[var(--text-muted)]",
            // Border
            "border-[var(--surface-border-strong)]",
            // Focus
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent",
            // Transitions
            "transition-[border-color,box-shadow] duration-[var(--duration-normal)]",
            // Disabled
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--surface-muted)]",
            // Error
            error && "border-[var(--color-danger-500)] focus:ring-[var(--color-danger-500)]",
            // Icon padding
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {rightIcon && (
          <span className="pointer-events-none absolute right-3 text-[var(--text-muted)]">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

/* ── Textarea ─────────────────────────────────────────────────── */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  resize?: "none" | "y" | "x" | "both";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, resize = "y", ...props }, ref) => {
    const resizeClass = {
      none: "resize-none",
      y: "resize-y",
      x: "resize-x",
      both: "resize",
    }[resize];

    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-[100px] rounded-[var(--radius-lg)] border bg-[var(--surface-bg)]",
          "px-3 py-2.5 text-sm text-[var(--text-primary)]",
          "placeholder:text-[var(--text-muted)]",
          "border-[var(--surface-border-strong)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent",
          "transition-[border-color,box-shadow] duration-[var(--duration-normal)]",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--surface-muted)]",
          error && "border-[var(--color-danger-500)] focus:ring-[var(--color-danger-500)]",
          resizeClass,
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

/* ── Select ───────────────────────────────────────────────────── */
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, placeholder, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-10 w-full appearance-none rounded-[var(--radius-lg)] border bg-[var(--surface-bg)]",
            "px-3 pr-9 text-sm text-[var(--text-primary)]",
            "border-[var(--surface-border-strong)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent",
            "transition-[border-color,box-shadow] duration-[var(--duration-normal)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "cursor-pointer",
            error && "border-[var(--color-danger-500)] focus:ring-[var(--color-danger-500)]",
            className
          )}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        {/* Chevron */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    );
  }
);
Select.displayName = "Select";

export { Input, Textarea, Select };
