"use client";

import * as React from "react";
import { Eye, EyeOff, ChevronLeft, ChevronRight, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import { useWalletStore } from "@/lib/stores/wallet.store";
import type { WalletCard as TWalletCard } from "@/lib/data/wallet.mock";

/* ── Network logo ─────────────────────────────────────────────── */
function NetworkLogo({ network }: { network: TWalletCard["network"] }) {
  if (network === "visa") {
    return (
      <span className="font-bold italic text-white text-lg tracking-wider select-none">
        VISA
      </span>
    );
  }
  if (network === "mastercard") {
    return (
      <div className="flex items-center">
        <div className="h-7 w-7 rounded-full bg-[#eb001b] opacity-90" />
        <div className="h-7 w-7 -ml-3 rounded-full bg-[#f79e1b] opacity-90" />
      </div>
    );
  }
  return <span className="text-white font-bold text-sm">AMEX</span>;
}

/* ── Chip SVG ─────────────────────────────────────────────────── */
function ChipIcon() {
  return (
    <svg width="38" height="30" viewBox="0 0 38 30" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="37" height="29" rx="4.5" fill="#d4a72c" stroke="#b8941a" />
      <rect x="13" y="0.5" width="12" height="29" fill="#c49822" stroke="#b8941a" strokeWidth="0.5" />
      <rect x="0.5" y="9" width="37" height="12" fill="#c49822" stroke="#b8941a" strokeWidth="0.5" />
      <rect x="13" y="9" width="12" height="12" fill="#b8841a" />
      <line x1="0.5" y1="9" x2="37.5" y2="9" stroke="#b8941a" strokeWidth="0.5" />
      <line x1="0.5" y1="21" x2="37.5" y2="21" stroke="#b8941a" strokeWidth="0.5" />
      <line x1="13" y1="0.5" x2="13" y2="29.5" stroke="#b8941a" strokeWidth="0.5" />
      <line x1="25" y1="0.5" x2="25" y2="29.5" stroke="#b8941a" strokeWidth="0.5" />
    </svg>
  );
}

/* ── Single card face ─────────────────────────────────────────── */
interface CardFaceProps {
  card: TWalletCard;
  balanceVisible: boolean;
}

function CardFace({ card, balanceVisible }: CardFaceProps) {
  const maskedNum = `•••• •••• •••• ${card.lastFour}`;

  return (
    <div
      className="relative flex h-48 w-full flex-col justify-between overflow-hidden rounded-[var(--radius-2xl)] p-6 select-none"
      style={{
        background: `linear-gradient(135deg, ${card.gradient[0]}, ${card.gradient[1]})`,
        boxShadow: `0 20px 40px -10px ${card.gradient[0]}66`,
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -right-10 -top-10 h-44 w-44 rounded-full opacity-20"
        style={{ background: card.gradient[1] }}
      />
      <div
        className="absolute -bottom-14 -left-6 h-44 w-44 rounded-full opacity-10"
        style={{ background: card.gradient[0] }}
      />

      {/* Top row */}
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-white/60">
            {card.label}
          </p>
          <p className="mt-1 text-2xl font-bold text-white">
            {balanceVisible
              ? formatCurrency(card.balance, card.currency)
              : "••••••"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Wifi size={20} className="text-white/70 rotate-90" />
        </div>
      </div>

      {/* Middle — chip */}
      <div className="relative flex items-center gap-4">
        <ChipIcon />
      </div>

      {/* Bottom row */}
      <div className="relative flex items-end justify-between">
        <div>
          <p className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">Card Number</p>
          <p className="font-mono text-sm font-semibold text-white/90 tracking-widest">
            {maskedNum}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">Expires</p>
          <p className="text-sm font-semibold text-white/90">
            {String(card.expiryMonth).padStart(2, "0")}/{String(card.expiryYear).slice(-2)}
          </p>
        </div>
        <NetworkLogo network={card.network} />
      </div>
    </div>
  );
}

/* ── WalletCard ───────────────────────────────────────────────── */
export function WalletCard() {
  const { cards, activeCardId, balanceVisible, setActiveCard, toggleBalanceVisibility } =
    useWalletStore();

  const activeIndex = cards.findIndex((c) => c.id === activeCardId);
  const activeCard = cards[activeIndex] ?? cards[0];

  const prev = () => setActiveCard(cards[Math.max(0, activeIndex - 1)].id);
  const next = () => setActiveCard(cards[Math.min(cards.length - 1, activeIndex + 1)].id);

  return (
    <div className="flex flex-col gap-3">
      {/* Card */}
      <div className="relative">
        <CardFace card={activeCard} balanceVisible={balanceVisible} />

        {/* Prev/Next nav */}
        {cards.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={activeIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm disabled:opacity-30 hover:bg-black/40 transition-colors"
              aria-label="Previous card"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              disabled={activeIndex === cards.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm disabled:opacity-30 hover:bg-black/40 transition-colors"
              aria-label="Next card"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Dots + toggle visibility */}
      <div className="flex items-center justify-between px-1">
        <div className="flex gap-1.5">
          {cards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveCard(c.id)}
              aria-label={c.label}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex
                  ? "w-5 bg-[var(--color-primary-600)]"
                  : "w-1.5 bg-[var(--surface-border-strong)]"
              )}
            />
          ))}
        </div>

        <button
          onClick={toggleBalanceVisibility}
          className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          aria-label={balanceVisible ? "Hide balance" : "Show balance"}
        >
          {balanceVisible
            ? <><EyeOff size={14} /> Hide balance</>
            : <><Eye size={14} /> Show balance</>
          }
        </button>
      </div>
    </div>
  );
}
