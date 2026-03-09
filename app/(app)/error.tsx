"use client";

import { ErrorDisplay } from "@/components/shared/error-boundary";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-[100dvh] items-center justify-center">
      <ErrorDisplay error={error} reset={reset} showHome />
    </div>
  );
}
