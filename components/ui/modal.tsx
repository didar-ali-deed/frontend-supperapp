"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/* ── Context ──────────────────────────────────────────────────── */
interface ModalContextValue {
  onClose: () => void;
}
const ModalContext = React.createContext<ModalContextValue>({
  onClose: () => {},
});

/* ── Modal Root ───────────────────────────────────────────────── */
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Clicking the backdrop closes the modal. Default: true */
  closeOnBackdrop?: boolean;
  /** Press Escape to close. Default: true */
  closeOnEsc?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const SIZE_CLASS = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  xl:   "max-w-2xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

function Modal({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
  closeOnEsc = true,
  size = "md",
}: ModalProps) {
  // Lock body scroll
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  // Escape key
  React.useEffect(() => {
    if (!closeOnEsc || !open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose, closeOnEsc]);

  if (!open) return null;

  return (
    <ModalContext.Provider value={{ onClose }}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={closeOnBackdrop ? onClose : undefined}
          aria-hidden
        />

        {/* Panel */}
        <div
          className={cn(
            "relative z-10 w-full rounded-[var(--radius-2xl)]",
            "bg-[var(--surface-bg)] shadow-[var(--shadow-xl)]",
            "animate-scale-in",
            SIZE_CLASS[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

/* ── ModalHeader ──────────────────────────────────────────────── */
interface ModalHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

function ModalHeader({ title, description, className }: ModalHeaderProps) {
  const { onClose } = React.useContext(ModalContext);
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-[var(--surface-border)] px-6 py-4",
        className
      )}
    >
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
        {description && (
          <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClose}
        aria-label="Close modal"
        className="shrink-0 -mr-1 -mt-1"
      >
        <X size={16} />
      </Button>
    </div>
  );
}

/* ── ModalBody ────────────────────────────────────────────────── */
function ModalBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-5", className)}>{children}</div>
  );
}

/* ── ModalFooter ──────────────────────────────────────────────── */
function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 border-t border-[var(--surface-border)] px-6 py-4",
        "sm:flex-row sm:justify-end",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ── ConfirmModal — shorthand for simple yes/no dialogs ───────── */
interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "primary";
  loading?: boolean;
}

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title={title} description={description} />
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export { Modal, ModalHeader, ModalBody, ModalFooter, ConfirmModal };
