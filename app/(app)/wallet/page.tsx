"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight, ArrowDownLeft, QrCode, Plus,
  History, CreditCard
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { WalletCard } from "@/components/wallet/wallet-card";
import { TransactionList } from "@/components/wallet/transaction-list";
import { Card } from "@/components/ui/card";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/* ── Quick action button ──────────────────────────────────────── */
function QuickAction({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 group"
    >
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-[var(--radius-2xl)]",
          "transition-all duration-200 group-hover:scale-105 group-hover:shadow-[var(--shadow-md)]",
          "shadow-[var(--shadow-sm)]"
        )}
        style={{ backgroundColor: color + "22", color }}
      >
        {icon}
      </div>
      <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
    </Link>
  );
}

export default function WalletPage() {
  return (
    <>
      <Topbar title="Wallet" />

      <div className="animate-enter mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Main card carousel */}
        <WalletCard />

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2">
          <QuickAction
            href="/wallet/send"
            icon={<ArrowUpRight size={22} />}
            label="Send"
            color="#6366f1"
          />
          <QuickAction
            href="/wallet/receive"
            icon={<ArrowDownLeft size={22} />}
            label="Receive"
            color="#10b981"
          />
          <QuickAction
            href="/wallet/receive?tab=scan"
            icon={<QrCode size={22} />}
            label="Scan QR"
            color="#f59e0b"
          />
          <QuickAction
            href="/wallet/send"
            icon={<Plus size={22} />}
            label="Top Up"
            color="#ec4899"
          />
        </div>

        {/* Tabs: transactions / cards */}
        <Tabs defaultValue="history">
          <TabList>
            <Tab value="history">
              <span className="flex items-center gap-1.5">
                <History size={14} /> Transactions
              </span>
            </Tab>
            <Tab value="cards">
              <span className="flex items-center gap-1.5">
                <CreditCard size={14} /> Cards
              </span>
            </Tab>
          </TabList>

          <TabPanel value="history">
            <div className="mt-4">
              <TransactionList />
            </div>
          </TabPanel>

          <TabPanel value="cards">
            <div className="mt-4 flex flex-col gap-3">
              <Card variant="flat" className="p-5">
                <p className="text-sm text-[var(--text-muted)]">
                  Card management coming soon. Tap the arrows on the wallet card above to switch between your cards.
                </p>
              </Card>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
