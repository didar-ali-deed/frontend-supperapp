"use client";

import { ErrorDisplay } from "@/components/shared/error-boundary";

export default function ProfileError({
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
      title="Couldn't load profile"
      description="There was a problem fetching your profile data. Please try again."
    />
  );
}
