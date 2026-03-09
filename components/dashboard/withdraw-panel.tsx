"use client";

import * as React from "react";
import {
  Building2, Wallet2, Bitcoin,
  ChevronRight, Check, Loader2, History, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatRelativeTime } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDashboardStore } from "@/lib/stores/dashboard.store";
import { PAYOUT_METHODS, PAYOUT_HISTORY } from "@/lib/data/dashboard.mock";
import type { PayoutMethod } from "@/lib/data/dashboard.mock";

/* ── Method icon ──────────────────────────────────────────────── */
function MethodIcon({ type }: { type: PayoutMethod["type"] }) {
  if (type === "bank")    return <Building2  size={16} />;
  if (type === "paypal")  return <Wallet2    size={16} />;
  return <Bitcoin size={16} />;
}

const QUICK_WITHDRAW = [50, 100, 250, 500];

const PAYOUT_STATUS_VARIANT: Record<
  string,
  "success" | "warning" | "danger" | "secondary"
> = {
  completed:  "success",
  processing: "warning",
  pending:    "secondary",
  failed:     "danger",
};

/* ── WithdrawPanel ────────────────────────────────────────────── */
export function WithdrawPanel() {
  const {
    availableBalance,
    pendingEarnings,
    withdrawStep,
    withdrawAmount,
    selectedPayoutMethodId,
    setWithdrawAmount,
    setSelectedPayoutMethod,
    confirmWithdraw,
    resetWithdraw,
  } = useDashboardStore();

  const [confirming, setConfirming] = React.useState(false);

  const amount  = parseFloat(withdrawAmount || "0");
  const isValid = amount > 0 && amount <= availableBalance;
  const over    = amount > availableBalance;

  const selectedMethod = PAYOUT_METHODS.find(
    (m) => m.id === selectedPayoutMethodId
  ) ?? PAYOUT_METHODS[0];

  const handleQuick = (v: number) => setWithdrawAmount(String(v));
  const handleMax   = () => setWithdrawAmount(availableBalance.toFixed(2));

  const handleSubmit = () => {
    if (!isValid) return;
    setConfirming(true);
  };

  const handleConfirm = () => {
    setConfirming(false);
    confirmWithdraw();
  };

  /* ── Success state ──────────────────────────────────────────── */
  if (withdrawStep === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success-100)] animate-scale-in">
          <Check size={32} className="text-[var(--color-success-600)]" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-lg font-bold text-[var(--text-primary)]">Withdrawal Initiated!</p>
          <p className="text-sm text-[var(--text-muted)]">
            {formatCurrency(parseFloat(withdrawAmount || "0"))} will arrive in 1–3 business days
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetWithdraw}>
          Withdraw Again
        </Button>
      </div>
    );
  }

  /* ── Processing state ───────────────────────────────────────── */
  if (withdrawStep === "processing") {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <Loader2 size={40} className="animate-spin text-[var(--color-primary-600)]" />
        <p className="text-sm font-semibold text-[var(--text-primary)]">Processing withdrawal…</p>
        <p className="text-xs text-[var(--text-muted)]">Please wait</p>
      </div>
    );
  }

  /* ── Confirm state ──────────────────────────────────────────── */
  if (confirming) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-subtle)] py-6 px-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            You are withdrawing
          </p>
          <p className="text-4xl font-bold text-[var(--text-primary)] tabular-nums">
            {formatCurrency(amount)}
          </p>
          <div className="flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-bg)] px-3 py-1.5">
            <MethodIcon type={selectedMethod.type} />
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              {selectedMethod.label}
              {selectedMethod.last4 && ` •${selectedMethod.last4}`}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Estimated arrival: 1–3 business days</p>
        </div>

        <Button variant="primary" size="lg" className="w-full" onClick={handleConfirm}>
          Confirm Withdrawal
        </Button>
        <Button variant="outline" size="lg" className="w-full" onClick={() => setConfirming(false)}>
          Go Back
        </Button>
      </div>
    );
  }

  /* ── Form state ─────────────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-5">
      {/* Balance summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-0.5 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-subtle)] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Available
          </p>
          <p className="text-xl font-bold tabular-nums text-[var(--color-success-600)]">
            {formatCurrency(availableBalance)}
          </p>
        </div>
        <div className="flex flex-col gap-0.5 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-subtle)] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Pending
          </p>
          <p className="text-xl font-bold tabular-nums text-[var(--color-warning-600)]">
            {formatCurrency(pendingEarnings)}
          </p>
        </div>
      </div>

      {/* Amount input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[var(--text-secondary)]">
          Amount to Withdraw
        </label>
        <div
          className={cn(
            "flex items-center gap-2 rounded-[var(--radius-xl)] border px-4 py-3 transition-colors",
            "bg-[var(--surface-bg)] focus-within:border-[var(--color-primary-400)]",
            over
              ? "border-[var(--color-danger-400)]"
              : "border-[var(--surface-border)]"
          )}
        >
          <span className="text-xl font-semibold text-[var(--text-muted)]">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl font-bold tabular-nums text-[var(--text-primary)] placeholder:text-[var(--surface-border-strong)] focus:outline-none"
          />
        </div>
        {over && (
          <p className="flex items-center gap-1.5 text-xs text-[var(--color-danger-600)]">
            <AlertCircle size={12} /> Exceeds available balance
          </p>
        )}
      </div>

      {/* Quick amounts */}
      <div className="flex flex-wrap gap-2">
        {QUICK_WITHDRAW.map((v) => (
          <button
            key={v}
            onClick={() => handleQuick(v)}
            disabled={v > availableBalance}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition-all disabled:opacity-40",
              parseFloat(withdrawAmount) === v
                ? "border-[var(--color-primary-400)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                : "border-[var(--surface-border)] text-[var(--text-secondary)] hover:border-[var(--color-primary-300)]"
            )}
          >
            ${v}
          </button>
        ))}
        <button
          onClick={handleMax}
          className="rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--color-primary-300)] transition-all"
        >
          MAX
        </button>
      </div>

      {/* Payout method */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[var(--text-secondary)]">
          Payout Method
        </label>
        <div className="flex flex-col gap-1.5">
          {PAYOUT_METHODS.map((m) => {
            const selected = m.id === selectedPayoutMethodId;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedPayoutMethod(m.id)}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-xl)] border px-4 py-3 text-left transition-all",
                  selected
                    ? "border-[var(--color-primary-400)] bg-[var(--color-primary-50)]"
                    : "border-[var(--surface-border)] bg-[var(--surface-subtle)] hover:border-[var(--color-primary-200)]"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    selected
                      ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]"
                      : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                  )}
                >
                  <MethodIcon type={m.type} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {m.label}
                    {m.last4 && (
                      <span className="ml-1.5 text-xs font-normal text-[var(--text-muted)]">
                        •{m.last4}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] capitalize">{m.type}</p>
                </div>
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-2 transition-all",
                    selected
                      ? "border-[var(--color-primary-600)] bg-[var(--color-primary-600)]"
                      : "border-[var(--surface-border-strong)]"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!isValid}
        onClick={handleSubmit}
      >
        {isValid
          ? `Withdraw ${formatCurrency(amount)} →`
          : "Enter an amount"}
      </Button>

      {/* Payout history */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 pt-1">
          <History size={13} className="text-[var(--text-muted)]" />
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Recent Payouts
          </p>
        </div>
        <div className="divide-y divide-[var(--surface-border)] rounded-[var(--radius-xl)] border border-[var(--surface-border)] overflow-hidden">
          {PAYOUT_HISTORY.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3 bg-[var(--surface-bg)]">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                  {formatCurrency(p.amount)}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {p.method} · {formatRelativeTime(p.date)}
                </p>
              </div>
              <Badge variant={PAYOUT_STATUS_VARIANT[p.status]} size="sm">
                {p.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
