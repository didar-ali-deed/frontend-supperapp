"use client";

import * as React from "react";
import { Copy, Share2, Download, Check, Scan, ZoomIn, ZoomOut, Flashlight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateQRMatrix } from "@/lib/data/wallet.mock";

/* ── SVG QR code renderer ─────────────────────────────────────── */
function QRCode({
  data,
  size = 220,
  fgColor = "#0f172a",
  bgColor = "#ffffff",
}: {
  data: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
}) {
  const matrix = React.useMemo(() => generateQRMatrix(data), [data]);
  const ROWS = matrix.length;
  if (ROWS === 0) return null;
  const cellSize = size / ROWS;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Payment QR code"
    >
      <rect width={size} height={size} fill={bgColor} />
      {matrix.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill={fgColor}
            />
          ) : null
        )
      )}
    </svg>
  );
}

/* ── QR receive panel ─────────────────────────────────────────── */
const MY_WALLET_ID = "supperapp://pay/me?id=usr_b7f3&v=1";

function ReceivePanel() {
  const [copied, setCopied] = React.useState(false);
  const [amount, setAmount] = React.useState("");

  const qrData = amount
    ? `${MY_WALLET_ID}&amount=${amount}`
    : MY_WALLET_ID;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(qrData).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* QR container */}
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            "relative flex items-center justify-center rounded-[var(--radius-2xl)] p-5",
            "border-2 border-[var(--surface-border)] bg-white shadow-[var(--shadow-lg)]"
          )}
        >
          {/* Corner decorations */}
          {[
            "-top-0.5 -left-0.5 border-t-2 border-l-2 rounded-tl-[var(--radius-xl)]",
            "-top-0.5 -right-0.5 border-t-2 border-r-2 rounded-tr-[var(--radius-xl)]",
            "-bottom-0.5 -left-0.5 border-b-2 border-l-2 rounded-bl-[var(--radius-xl)]",
            "-bottom-0.5 -right-0.5 border-b-2 border-r-2 rounded-br-[var(--radius-xl)]",
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute h-8 w-8 border-[var(--color-primary-600)] ${cls}`}
            />
          ))}

          <QRCode data={qrData} size={200} fgColor="#0f172a" />
        </div>

        {/* Amount badge */}
        {amount && (
          <Badge
            variant="primary"
            size="lg"
            rounded="full"
            className="absolute -bottom-4 shadow-md"
          >
            ${amount}
          </Badge>
        )}
      </div>

      {/* Username label */}
      <div className="flex flex-col items-center gap-0.5">
        <p className="text-base font-bold text-[var(--text-primary)]">@username</p>
        <p className="text-xs text-[var(--text-muted)]">Scan to pay</p>
      </div>

      {/* Optional fixed amount */}
      <div className="flex w-full items-center gap-2 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-subtle)] px-4 py-2.5">
        <span className="text-base font-semibold text-[var(--text-muted)]">$</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Set fixed amount (optional)"
          className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
        />
        {amount && (
          <button onClick={() => setAmount("")} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            ✕
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {[
          { icon: copied ? <Check size={18} /> : <Copy size={18} />, label: copied ? "Copied!" : "Copy link", onClick: handleCopy },
          { icon: <Share2 size={18} />, label: "Share", onClick: () => {} },
          { icon: <Download size={18} />, label: "Save QR", onClick: () => {} },
        ].map(({ icon, label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-[var(--radius-xl)] border border-[var(--surface-border)]",
              "py-3 text-xs font-medium text-[var(--text-secondary)]",
              "hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── QR scanner panel (simulated) ─────────────────────────────── */
function ScannerPanel() {
  const [scanning, setScanning] = React.useState(false);
  const [scanned, setScanned] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [flash, setFlash] = React.useState(false);

  const startScan = () => {
    setScanning(true);
    setScanned(false);
    // Simulate scan after 2.5s
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Viewfinder */}
      <div
        className={cn(
          "relative flex h-72 w-72 items-center justify-center overflow-hidden rounded-[var(--radius-2xl)]",
          "bg-neutral-900"
        )}
      >
        {/* Simulated camera feed */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                opacity: Math.random(),
              }}
            />
          ))}
        </div>

        {/* Corner brackets */}
        <div className="absolute inset-8 pointer-events-none">
          {[
            "top-0 left-0 border-t-2 border-l-2 rounded-tl-md",
            "top-0 right-0 border-t-2 border-r-2 rounded-tr-md",
            "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-md",
            "bottom-0 right-0 border-b-2 border-r-2 rounded-br-md",
          ].map((cls, i) => (
            <div key={i} className={`absolute h-8 w-8 border-white ${cls}`} />
          ))}
        </div>

        {/* Scan line */}
        {scanning && (
          <div
            className="absolute left-8 right-8 h-0.5 bg-[var(--color-primary-400)] shadow-[0_0_8px_var(--color-primary-400)]"
            style={{ animation: "scan-line 1.5s ease-in-out infinite alternate" }}
          />
        )}

        {/* Scanned QR preview (mock) */}
        {scanning && (
          <div className="relative z-10 rounded-[var(--radius-lg)] bg-white p-2 opacity-80">
            <QRCode data={MY_WALLET_ID} size={80} />
          </div>
        )}

        {/* Success overlay */}
        {scanned && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--color-success-600)]/80 backdrop-blur-sm animate-fade-in rounded-[var(--radius-2xl)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
              <Check size={32} className="text-[var(--color-success-600)]" strokeWidth={3} />
            </div>
            <p className="text-sm font-bold text-white">QR Code Detected!</p>
          </div>
        )}

        {/* Idle prompt */}
        {!scanning && !scanned && (
          <div className="flex flex-col items-center gap-2 text-white/60">
            <Scan size={32} />
            <p className="text-xs">Point camera at QR code</p>
          </div>
        )}

        {/* Controls overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <button
            onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
            disabled={zoom <= 1}
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-xs font-mono text-white/70">{zoom}×</span>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.5))}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
            disabled={zoom >= 3}
          >
            <ZoomIn size={14} />
          </button>
        </div>

        {/* Flash toggle */}
        <button
          onClick={() => setFlash((f) => !f)}
          className={cn(
            "absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm",
            flash ? "bg-yellow-400 text-yellow-900" : "bg-black/40 text-white"
          )}
        >
          <span className="text-sm">⚡</span>
        </button>
      </div>

      <style>{`
        @keyframes scan-line {
          from { top: 10%; }
          to   { top: 88%; }
        }
      `}</style>

      {/* Scan button */}
      {!scanned ? (
        <Button
          variant={scanning ? "outline" : "primary"}
          size="lg"
          className="w-full"
          onClick={scanning ? () => setScanning(false) : startScan}
          loading={scanning}
        >
          {scanning ? "Scanning…" : "Start Scanning"}
        </Button>
      ) : (
        <div className="flex w-full flex-col gap-2">
          <p className="text-center text-sm text-[var(--text-muted)]">
            Detected: <span className="font-medium text-[var(--text-primary)]">@alexmorgan</span> · $25.00
          </p>
          <Button variant="primary" size="lg" className="w-full">
            Pay $25.00 →
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={() => setScanned(false)}>
            Scan Again
          </Button>
        </div>
      )}

      <p className="text-center text-xs text-[var(--text-muted)]">
        Camera access required for scanning. Using device camera simulation in demo mode.
      </p>
    </div>
  );
}

/* ── QRScannerUI — tabbed receive + scan ──────────────────────── */
export function QRScannerUI({ defaultTab = "receive" }: { defaultTab?: "receive" | "scan" }) {
  const [tab, setTab] = React.useState<"receive" | "scan">(defaultTab);

  return (
    <div className="flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex gap-1 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] p-1">
        {[
          { id: "receive" as const, label: "My QR Code" },
          { id: "scan"    as const, label: "Scan & Pay"  },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex-1 rounded-[var(--radius-md)] py-2 text-sm font-medium transition-all",
              tab === id
                ? "bg-[var(--surface-bg)] text-[var(--text-primary)] shadow-[var(--shadow-xs)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="animate-fade-in">
        {tab === "receive" ? <ReceivePanel /> : <ScannerPanel />}
      </div>
    </div>
  );
}
