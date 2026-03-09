"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Context ──────────────────────────────────────────────────── */
interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}
const TabsContext = React.createContext<TabsContextValue>({
  active: "",
  setActive: () => {},
});

/* ── Tabs Root ────────────────────────────────────────────────── */
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
  onChange?: (value: string) => void;
}

function Tabs({ defaultValue, children, className, onChange }: TabsProps) {
  const [active, setActive] = React.useState(defaultValue);
  const handleChange = (id: string) => {
    setActive(id);
    onChange?.(id);
  };
  return (
    <TabsContext.Provider value={{ active, setActive: handleChange }}>
      <div className={cn("flex flex-col gap-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

/* ── TabList ──────────────────────────────────────────────────── */
function TabList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex gap-1 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ── Tab ──────────────────────────────────────────────────────── */
interface TabProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

function Tab({ value, children, disabled, className }: TabProps) {
  const { active, setActive } = React.useContext(TabsContext);
  const isActive = active === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => setActive(value)}
      className={cn(
        "flex-1 rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium",
        "transition-all duration-[var(--duration-normal)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        isActive
          ? "bg-[var(--surface-bg)] text-[var(--text-primary)] shadow-[var(--shadow-xs)]"
          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
        className
      )}
    >
      {children}
    </button>
  );
}

/* ── TabPanel ─────────────────────────────────────────────────── */
interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

function TabPanel({ value, children, className }: TabPanelProps) {
  const { active } = React.useContext(TabsContext);
  if (active !== value) return null;
  return (
    <div
      role="tabpanel"
      className={cn("animate-fade-in", className)}
    >
      {children}
    </div>
  );
}

/* ── Underline Tabs variant (e.g. for page-level navigation) ──── */
function TabListUnderline({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex gap-0 border-b border-[var(--surface-border)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function TabUnderline({ value, children, disabled, className }: TabProps) {
  const { active, setActive } = React.useContext(TabsContext);
  const isActive = active === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => setActive(value)}
      className={cn(
        "px-4 py-3 text-sm font-medium border-b-2 -mb-px",
        "transition-all duration-[var(--duration-normal)]",
        "focus-visible:outline-none",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        isActive
          ? "border-[var(--color-primary-600)] text-[var(--color-primary-600)]"
          : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--surface-border-strong)]",
        className
      )}
    >
      {children}
    </button>
  );
}

export { Tabs, TabList, Tab, TabPanel, TabListUnderline, TabUnderline };
