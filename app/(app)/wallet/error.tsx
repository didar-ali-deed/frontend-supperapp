"use client";

import { ErrorDisplay } from "@/components/shared/error-boundary";

export default function WalletError({
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
      title="Couldn't load your wallet"
      description="There was a problem fetching your balance and transactions. Please try again."
    />
  );
}
