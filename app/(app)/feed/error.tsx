"use client";

import { ErrorDisplay } from "@/components/shared/error-boundary";

export default function FeedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      error={error}
      reset={reset}
      title="Couldn't load your feed"
      description="There was a problem fetching posts. Pull to refresh or try again."
    />
  );
}
