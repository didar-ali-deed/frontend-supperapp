"use client";

import * as React from "react";
import { Search, SlidersHorizontal, ArrowDownLeft, ArrowUpRight, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatRelativeTime } from "@/lib/utils/format";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton, SkeletonAvatar } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useWalletStore } from "@/lib/stores/wallet.store";
import { groupTransactionsByDate, CATEGORY_META } from "@/lib/data/wallet.mock";
import type { WalletTransaction } from "@/lib/data/wallet.mock";

/* ── Status badge ─────────────────────────────────────────────── */
const STATUS_VARIANT: Record<WalletTransaction["status"], "success" | "warning" | "danger" | "secondary"> = {
  completed: "success",
  pending:   "warning",
  failed:    "danger",
  refunded:  "secondary",
};

/* ── Transaction row ──────────────────────────────────────────── */
const TxRow = React.memo(function TxRow({ tx }: { tx: WalletTransaction }) {
  const catMeta = CATEGORY_META[tx.category];
  const isCredit = tx.direction === "credit";

  return (
    <div className="flex items-center gap-3 py-3 px-1">
      {/* Avatar / icon */}
      <div className="relative shrink-0">
        {tx.avatar ? (
          <Avatar src={tx.avatar} fallback={tx.initials ?? "?"} size="md" />
        ) : (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
            style={{ backgroundColor: (tx.color ?? "#6366f1") + "22", color: tx.color ?? "#6366f1" }}
          >
            {tx.initials ?? "?"}
          </div>
        )}
        {/* Direction badge */}
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full",
            isCredit
              ? "bg-[var(--color-success-500)]"
              : "bg-[var(--color-danger-500)]"
          )}
        >
          {isCredit
            ? <ArrowDownLeft size={9} className="text-white" />
            : <ArrowUpRight size={9} className="text-white" />
          }
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{tx.title}</p>
          <p
            className={cn(
              "shrink-0 text-sm font-bold tabular-nums",
              isCredit ? "text-[var(--color-success-600)]" : "text-[var(--text-primary)]"
            )}
          >
            {isCredit ? "+" : "−"}{formatCurrency(tx.amount)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-[var(--text-muted)] truncate">{tx.subtitle}</p>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="text-[10px] text-[var(--text-muted)]">{formatRelativeTime(tx.date)}</span>
            {tx.status !== "completed" && (
              <Badge variant={STATUS_VARIANT[tx.status]} size="sm">{tx.status}</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

/* ── Skeleton row ─────────────────────────────────────────────── */
function TxSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 px-1">
      <SkeletonAvatar size={40} />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3.5 w-16" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

/* ── Filter chips ─────────────────────────────────────────────── */
type FilterType = "all" | "credit" | "debit" | "pending";

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "all",     label: "All" },
  { id: "credit",  label: "Received" },
  { id: "debit",   label: "Sent" },
  { id: "pending", label: "Pending" },
];

/* ── TransactionList ──────────────────────────────────────────── */
export function TransactionList() {
  const { transactions } = useWalletStore();
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<FilterType>("all");
  const [loading, setLoading] = React.useState(true);

  // Simulate load
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = transactions.filter((tx) => {
    const matchSearch =
      !search.trim() ||
      tx.title.toLowerCase().includes(search.toLowerCase()) ||
      tx.subtitle.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all" ||
      (filter === "credit"  && tx.direction === "credit") ||
      (filter === "debit"   && tx.direction === "debit") ||
      (filter === "pending" && tx.status === "pending");

    return matchSearch && matchFilter;
  });

  const grouped = groupTransactionsByDate(filtered);

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-subtle)] px-3 py-2.5 focus-within:border-[var(--color-primary-400)] focus-within:bg-[var(--surface-bg)] transition-all">
        <Search size={15} className="shrink-0 text-[var(--text-muted)]" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions…"
          className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
        />
        <SlidersHorizontal size={15} className="shrink-0 text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-primary)] transition-colors" />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              filter === id
                ? "bg-[var(--color-primary-600)] text-white shadow-sm"
                : "border border-[var(--surface-border)] text-[var(--text-secondary)] hover:border-[var(--color-primary-300)] hover:text-[var(--color-primary-600)]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="divide-y divide-[var(--surface-border)]">
          {Array.from({ length: 5 }).map((_, i) => <TxSkeleton key={i} />)}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <EmptyState
          icon={<Search size={24} />}
          title="No transactions found"
          description="Try a different search or filter."
        />
      ) : (
        Object.entries(grouped).map(([date, txs]) => (
          <div key={date}>
            <p className="mb-1 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide py-1">
              {date}
            </p>
            <div className="divide-y divide-[var(--surface-border)] rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] overflow-hidden px-4">
              {txs.map((tx) => (
                <TxRow key={tx.id} tx={tx} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
