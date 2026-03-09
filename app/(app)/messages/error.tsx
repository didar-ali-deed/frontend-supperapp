"use client";

import { ErrorDisplay } from "@/components/shared/error-boundary";

export default function MessagesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <ErrorDisplay
        error={error}
        reset={reset}
        title="Couldn't load messages"
        description="There was a problem connecting to your conversations. Please try again."
      />
    </div>
  );
}
