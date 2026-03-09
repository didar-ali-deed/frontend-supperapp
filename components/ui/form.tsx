"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Form ─────────────────────────────────────────────────────── */
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, ...props }, ref) => (
    <form
      ref={ref}
      className={cn("flex flex-col gap-5", className)}
      noValidate
      {...props}
    >
      {children}
    </form>
  )
);
Form.displayName = "Form";

/* ── FormField — wraps label + input + error ──────────────────── */
interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

function FormField({ children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>{children}</div>
  );
}

/* ── FormLabel ────────────────────────────────────────────────── */
export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-[var(--text-primary)]",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-[var(--color-danger-500)]" aria-hidden>*</span>
      )}
    </label>
  )
);
FormLabel.displayName = "FormLabel";

/* ── FormHint ─────────────────────────────────────────────────── */
function FormHint({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-xs text-[var(--text-muted)]", className)}>
      {children}
    </p>
  );
}

/* ── FormError ────────────────────────────────────────────────── */
function FormError({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className={cn("flex items-center gap-1 text-xs text-[var(--color-danger-600)]", className)}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
        <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.5a.5.5 0 011 0v3a.5.5 0 01-1 0v-3zm.5 5.25a.75.75 0 110-1.5.75.75 0 010 1.5z" />
      </svg>
      {message}
    </p>
  );
}

/* ── FormSection — groups related fields with a heading ───────── */
function FormSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("flex flex-col gap-4", className)}>
      {(title || description) && (
        <div className="flex flex-col gap-0.5">
          {title && (
            <legend className="text-base font-semibold text-[var(--text-primary)]">
              {title}
            </legend>
          )}
          {description && (
            <p className="text-sm text-[var(--text-secondary)]">{description}</p>
          )}
        </div>
      )}
      {children}
    </fieldset>
  );
}

/* ── FormActions — right-aligns submit + cancel ───────────────── */
function FormActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Form, FormField, FormLabel, FormHint, FormError, FormSection, FormActions };
