"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Topbar } from "@/components/layout/topbar";
import { QRScannerUI } from "@/components/wallet/qr-scanner-ui";

function ReceiveContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "scan" ? "scan" : "receive";

  return <QRScannerUI defaultTab={tab} />;
}

export default function ReceivePage() {
  return (
    <>
      <Topbar title="Receive Money" />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-[var(--radius-2xl)] bg-[var(--surface-muted)]" />}>
          <ReceiveContent />
        </Suspense>
      </div>
    </>
  );
}
