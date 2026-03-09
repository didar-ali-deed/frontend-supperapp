/**
 * components/shared/page-transition.tsx
 *
 * Thin wrapper that applies a consistent enter animation
 * to each page's content area.
 */

import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div className={cn("animate-enter", className)}>
      {children}
    </div>
  );
}
