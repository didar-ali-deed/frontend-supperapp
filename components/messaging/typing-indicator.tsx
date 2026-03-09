"use client";

import { cn } from "@/lib/utils";

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-end gap-2.5", className)}>
      {/* Match received bubble style */}
      <div
        className={cn(
          "flex items-center gap-1 rounded-[var(--radius-xl)] rounded-bl-[var(--radius-sm)]",
          "bg-[var(--surface-muted)] px-4 py-3"
        )}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-2 w-2 rounded-full bg-[var(--text-muted)]"
            style={{
              animation: "typing-bounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
