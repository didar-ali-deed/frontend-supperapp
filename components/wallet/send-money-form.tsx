"use client";

import * as React from "react";
import { Search, CheckCircle2, ChevronRight, X, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PaymentConfirmationModal } from "./payment-confirmation-modal";
import { useWalletStore } from "@/lib/stores/wallet.store";
import { MOCK_CONTACTS, QUICK_AMOUNTS } from "@/lib/data/wallet.mock";
import type { Contact, WalletTransaction } from "@/lib/data/wallet.mock";

/* ── Step indicator ───────────────────────────────────────────── */
function StepBar({ step }: { step: "recipient" | "amount" | "confirm" }) {
  const steps = ["recipient", "amount", "confirm"];
  const idx = steps.indexOf(step);
  const labels = ["Recipient", "Amount", "Confirm"];

  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                i < idx
                  ? "bg-[var(--color-success-500)] text-white"
                  : i === idx
                  ? "bg-[var(--color-primary-600)] text-white"
                  : "border-2 border-[var(--surface-border)] text-[var(--text-muted)]"
              )}
            >
              {i < idx ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span
              className={cn(
                "text-[10px] font-medium",
                i === idx ? "text-[var(--color-primary-600)]" : "text-[var(--text-muted)]"
              )}
            >
              {labels[i]}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "mb-4 h-px flex-1 mx-1 transition-colors",
                i < idx ? "bg-[var(--color-success-500)]" : "bg-[var(--surface-border)]"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Recipient step ───────────────────────────────────────────── */
function RecipientStep({ onSelect }: { onSelect: (c: Contact) => void }) {
  const [search, setSearch] = React.useState("");

  const filtered = MOCK_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
  );

  // Recent (first 4 contacts)
  const recent = MOCK_CONTACTS.slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      {/* Recent */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Recent
        </p>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {recent.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-80"
            >
              <div className="relative">
                <Avatar src={c.avatar} fallback={c.name} size="lg" />
                {c.verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary-600)]">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                )}
              </div>
              <span className="text-[10px] font-medium text-[var(--text-secondary)] truncate max-w-[52px]">
                {c.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <Input
        leftIcon={<Search size={15} />}
        placeholder="Search by name or @username"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* All contacts */}
      <div className="flex flex-col divide-y divide-[var(--surface-border)] rounded-[var(--radius-xl)] border border-[var(--surface-border)] overflow-hidden">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-muted)] transition-colors text-left"
          >
            <Avatar src={c.avatar} fallback={c.name} size="md" />
            <div className="flex flex-1 flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-[var(--text-primary)] truncate">{c.name}</span>
                {c.verified && <CheckCircle2 size={12} className="text-[var(--color-primary-600)] shrink-0" />}
              </div>
              <span className="text-xs text-[var(--text-muted)]">@{c.username}</span>
            </div>
            <ChevronRight size={16} className="text-[var(--text-muted)] shrink-0" />
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-[var(--text-muted)]">No contacts found</p>
        )}
      </div>
    </div>
  );
}

/* ── Amount step ──────────────────────────────────────────────── */
function AmountStep({
  recipient,
  onBack,
  onNext,
}: {
  recipient: Contact;
  onBack: () => void;
  onNext: (amount: number, note: string) => void;
}) {
  const { cards, activeCardId } = useWalletStore();
  const activeCard = cards.find((c) => c.id === activeCardId) ?? cards[0];
  const [rawAmount, setRawAmount] = React.useState("");
  const [note, setNote] = React.useState("");

  const amount = parseFloat(rawAmount || "0");
  const isValid = amount > 0 && amount <= activeCard.balance;
  const overBalance = amount > activeCard.balance;

  /* Numpad */
  const numpad = ["1","2","3","4","5","6","7","8","9",".","0","⌫"] as const;

  const handleNumpad = (val: string) => {
    if (val === "⌫") { setRawAmount((p) => p.slice(0, -1)); return; }
    if (val === "." && rawAmount.includes(".")) return;
    if (rawAmount.split(".")[1]?.length >= 2) return;
    if (rawAmount === "0" && val !== ".") { setRawAmount(val); return; }
    setRawAmount((p) => p + val);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Recipient summary */}
      <div className="flex items-center gap-3 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-subtle)] px-4 py-3">
        <Avatar src={recipient.avatar} fallback={recipient.name} size="md" />
        <div className="flex flex-1 flex-col">
          <p className="text-sm font-semibold text-[var(--text-primary)]">{recipient.name}</p>
          <p className="text-xs text-[var(--text-muted)]">@{recipient.username}</p>
        </div>
        <button onClick={onBack} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          <X size={16} />
        </button>
      </div>

      {/* Amount display */}
      <div className="flex flex-col items-center gap-1 py-2">
        <div className="flex items-start">
          <span className="mt-2 text-2xl font-semibold text-[var(--text-muted)]">$</span>
          <span
            className={cn(
              "text-5xl font-bold tabular-nums transition-colors",
              overBalance ? "text-[var(--color-danger-500)]" : "text-[var(--text-primary)]",
              !rawAmount && "text-[var(--surface-border-strong)]"
            )}
          >
            {rawAmount || "0"}
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Available: {formatCurrency(activeCard.balance)}
        </p>
        {overBalance && (
          <Badge variant="danger" size="sm">Exceeds balance</Badge>
        )}
      </div>

      {/* Quick amounts */}
      <div className="grid grid-cols-3 gap-2">
        {QUICK_AMOUNTS.map((q) => (
          <button
            key={q}
            onClick={() => setRawAmount(String(q))}
            className={cn(
              "rounded-[var(--radius-lg)] border py-2 text-sm font-medium transition-all",
              parseFloat(rawAmount) === q
                ? "border-[var(--color-primary-400)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                : "border-[var(--surface-border)] text-[var(--text-secondary)] hover:border-[var(--color-primary-300)]"
            )}
          >
            ${q}
          </button>
        ))}
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-2">
        {numpad.map((k) => (
          <button
            key={k}
            onClick={() => handleNumpad(k)}
            className={cn(
              "flex h-12 items-center justify-center rounded-[var(--radius-xl)] text-lg font-semibold transition-all active:scale-95",
              k === "⌫"
                ? "text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                : "bg-[var(--surface-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] border border-[var(--surface-border)]"
            )}
            aria-label={k === "⌫" ? "Backspace" : k}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Note */}
      <Input
        leftIcon={<DollarSign size={15} />}
        placeholder="Add a note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={60}
      />

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!isValid}
        onClick={() => onNext(amount, note)}
      >
        Continue → {isValid ? formatCurrency(amount) : ""}
      </Button>
    </div>
  );
}

/* ── SendMoneyForm ────────────────────────────────────────────── */
export function SendMoneyForm() {
  const { sendStep, sendRecipient, setSendRecipient, setSendStep, commitTransaction, resetSendFlow } =
    useWalletStore();

  const [pendingAmount, setPendingAmount] = React.useState(0);
  const [pendingNote, setPendingNote] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleRecipient = (c: Contact) => setSendRecipient(c);
  const handleAmount = (amount: number, note: string) => {
    setPendingAmount(amount);
    setPendingNote(note);
    setModalOpen(true);
  };

  const handleConfirmed = () => {
    if (!sendRecipient) return;
    const tx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      title: `Sent to ${sendRecipient.name}`,
      subtitle: pendingNote || "Transfer",
      amount: pendingAmount,
      direction: "debit",
      category: "transfer",
      status: "completed",
      avatar: sendRecipient.avatar,
      initials: sendRecipient.initials,
      color: sendRecipient.color,
      date: new Date().toISOString(),
      note: pendingNote,
    };
    commitTransaction(tx);
    setModalOpen(false);
    resetSendFlow();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Step bar */}
      <StepBar step={sendStep} />

      {/* Step content */}
      {sendStep === "recipient" && (
        <RecipientStep onSelect={handleRecipient} />
      )}

      {sendStep === "amount" && sendRecipient && (
        <AmountStep
          recipient={sendRecipient}
          onBack={() => setSendStep("recipient")}
          onNext={handleAmount}
        />
      )}

      {/* PIN + success modal */}
      {sendRecipient && (
        <PaymentConfirmationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          recipient={sendRecipient}
          amount={pendingAmount}
          note={pendingNote}
          onConfirmed={handleConfirmed}
        />
      )}
    </div>
  );
}
