"use client";

import { ErrorDisplay } from "@/components/shared/error-boundary";

export default function DashboardError({
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
      title="Couldn't load dashboard"
      description="There was a problem fetching your earnings and analytics. Please try again."
    />
  );
}
