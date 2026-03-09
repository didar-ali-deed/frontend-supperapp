"use client";

import * as React from "react";
import { Check, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import type { Contact } from "@/lib/data/wallet.mock";

/* ── PIN pad ──────────────────────────────────────────────────── */
const PIN_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "⌫"] as const;
const CORRECT_PIN = "1234";

interface PinPadProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function PinPad({ onSuccess, onCancel }: PinPadProps) {
  const [pin, setPin] = React.useState("");
  const [error, setError] = React.useState(false);
  const [shake, setShake] = React.useState(false);

  const handleDigit = (d: number | null | "⌫") => {
    if (d === "⌫") { setPin((p) => p.slice(0, -1)); setError(false); return; }
    if (d === null) return;
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);

    if (next.length === 4) {
      setTimeout(() => {
        if (next === CORRECT_PIN) {
          onSuccess();
        } else {
          setError(true);
          setShake(true);
          setTimeout(() => { setPin(""); setShake(false); }, 600);
        }
      }, 150);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-1.5">
        <ShieldCheck size={28} className="text-[var(--color-primary-600)]" />
        <p className="text-sm font-semibold text-[var(--text-primary)]">Enter your PIN</p>
        <p className="text-xs text-[var(--text-muted)]">Confirm with PIN 1234 (demo)</p>
      </div>

      {/* Dots */}
      <div className={cn("flex gap-3", shake && "animate-[shake_0.4s_ease]")}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-3.5 w-3.5 rounded-full border-2 transition-all duration-150",
              i < pin.length
                ? error
                  ? "border-[var(--color-danger-500)] bg-[var(--color-danger-500)]"
                  : "border-[var(--color-primary-600)] bg-[var(--color-primary-600)]"
                : "border-[var(--surface-border-strong)] bg-transparent"
            )}
          />
        ))}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-[var(--color-danger-600)]">
          <AlertCircle size={13} /> Incorrect PIN. Try again.
        </p>
      )}

      {/* Keypad grid */}
      <div className="grid grid-cols-3 gap-2 w-56">
        {PIN_DIGITS.map((d, i) => (
          <button
            key={i}
            onClick={() => handleDigit(d)}
            disabled={d === null}
            className={cn(
              "flex h-14 items-center justify-center rounded-[var(--radius-xl)]",
              "text-lg font-semibold transition-all duration-100",
              d === null
                ? "opacity-0 pointer-events-none"
                : d === "⌫"
                ? "text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                : "bg-[var(--surface-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] active:scale-95 border border-[var(--surface-border)]"
            )}
            aria-label={d === null ? "" : d === "⌫" ? "Delete" : String(d)}
          >
            {d}
          </button>
        ))}
      </div>

      <Button variant="ghost" size="sm" onClick={onCancel} className="text-[var(--text-muted)]">
        Cancel
      </Button>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

/* ── PaymentConfirmationModal ─────────────────────────────────── */
export type PaymentStep = "confirm" | "pin" | "processing" | "success" | "failed";

interface PaymentConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  recipient: Contact;
  amount: number;
  note?: string;
  onConfirmed?: () => void;
}

export function PaymentConfirmationModal({
  open,
  onClose,
  recipient,
  amount,
  note,
  onConfirmed,
}: PaymentConfirmationModalProps) {
  const [step, setStep] = React.useState<PaymentStep>("confirm");

  // Reset on open
  React.useEffect(() => { if (open) setStep("confirm"); }, [open]);

  const handlePinSuccess = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      onConfirmed?.();
    }, 1800);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep("confirm"), 400);
  };

  return (
    <Modal open={open} onClose={step === "processing" ? () => {} : handleClose} size="sm">
      {/* ── Confirm summary ────────────────────────────────────── */}
      {step === "confirm" && (
        <>
          <ModalHeader title="Confirm Payment" />
          <ModalBody className="flex flex-col items-center gap-5 py-6">
            <Avatar src={recipient.avatar} fallback={recipient.name} size="xl" />

            <div className="flex flex-col items-center gap-1">
              <p className="text-sm text-[var(--text-muted)]">Sending to</p>
              <p className="text-base font-bold text-[var(--text-primary)]">{recipient.name}</p>
              <p className="text-xs text-[var(--text-muted)]">@{recipient.username}</p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <p className="text-4xl font-bold text-[var(--text-primary)]">
                {formatCurrency(amount)}
              </p>
              {note && (
                <p className="text-sm text-[var(--text-muted)]">"{note}"</p>
              )}
            </div>

            {/* Fee row */}
            <div className="w-full rounded-[var(--radius-xl)] bg-[var(--surface-subtle)] border border-[var(--surface-border)] divide-y divide-[var(--surface-border)]">
              {[
                { label: "Amount",  value: formatCurrency(amount) },
                { label: "Fee",     value: "$0.00" },
                { label: "Total",   value: formatCurrency(amount), bold: true },
              ].map(({ label, value, bold }) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-[var(--text-muted)]">{label}</span>
                  <span className={cn("text-sm", bold ? "font-bold text-[var(--text-primary)]" : "text-[var(--text-secondary)]")}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex w-full flex-col gap-2">
              <Button variant="primary" className="w-full" onClick={() => setStep("pin")}>
                Continue to PIN
              </Button>
              <Button variant="outline" className="w-full" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </ModalBody>
        </>
      )}

      {/* ── PIN entry ──────────────────────────────────────────── */}
      {step === "pin" && (
        <ModalBody className="py-6">
          <PinPad onSuccess={handlePinSuccess} onCancel={() => setStep("confirm")} />
        </ModalBody>
      )}

      {/* ── Processing ─────────────────────────────────────────── */}
      {step === "processing" && (
        <ModalBody className="flex flex-col items-center gap-4 py-12">
          <Loader2 size={48} className="animate-spin text-[var(--color-primary-600)]" />
          <p className="text-base font-semibold text-[var(--text-primary)]">Processing payment…</p>
          <p className="text-sm text-[var(--text-muted)]">Please do not close this window</p>
        </ModalBody>
      )}

      {/* ── Success ────────────────────────────────────────────── */}
      {step === "success" && (
        <ModalBody className="flex flex-col items-center gap-5 py-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-success-100)] animate-scale-in">
            <Check size={40} className="text-[var(--color-success-600)]" strokeWidth={3} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xl font-bold text-[var(--text-primary)]">Payment Sent!</p>
            <p className="text-sm text-[var(--text-muted)]">
              {formatCurrency(amount)} sent to {recipient.name}
            </p>
          </div>
          <Button variant="primary" className="w-full" onClick={handleClose}>
            Done
          </Button>
        </ModalBody>
      )}
    </Modal>
  );
}
