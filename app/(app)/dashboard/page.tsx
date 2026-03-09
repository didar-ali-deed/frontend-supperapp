"use client";

import * as React from "react";
import { DollarSign, Clock, TrendingUp, Wallet } from "lucide-react";
import { Topbar }   from "@/components/layout/topbar";
import { Card }     from "@/components/ui/card";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils/format";
import { useDashboardStore } from "@/lib/stores/dashboard.store";
import {
  LazyEarningsChart,
  LazyRevenueCard,
  LazyWithdrawPanel,
  LazyAnalyticsSummary,
  LazyMonetizedPostsList,
} from "@/components/shared/lazy-modules";

/* ── Stat card ────────────────────────────────────────────────── */
const TopStat = React.memo(function TopStat({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="card-hover flex items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] px-5 py-4 shadow-[var(--shadow-xs)]">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)]"
        style={{ backgroundColor: color + "18", color }}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </p>
        <p className="text-xl font-bold tabular-nums text-[var(--text-primary)] truncate">
          {value}
        </p>
        <p className="text-xs text-[var(--text-muted)] truncate">{sub}</p>
      </div>
    </div>
  );
});

/* ── Page ─────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { availableBalance, pendingEarnings } = useDashboardStore();

  const totalEarned   = 3_176.50;
  const lifetimeViews = "84.2K";

  return (
    <>
      <Topbar title="Creator Dashboard" />

      <div className="animate-enter mx-auto max-w-5xl px-4 py-6 space-y-6">

        {/* ── Stat cards ─────────────────────────────────────── */}
        <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
          <TopStat
            icon={<Wallet size={20} />}
            label="Available"
            value={formatCurrency(availableBalance)}
            sub="Ready to withdraw"
            color="#10b981"
          />
          <TopStat
            icon={<Clock size={20} />}
            label="Pending"
            value={formatCurrency(pendingEarnings)}
            sub="Clears in 2–5 days"
            color="#f59e0b"
          />
          <TopStat
            icon={<DollarSign size={20} />}
            label="Total Earned"
            value={formatCurrency(totalEarned)}
            sub="All time"
            color="#6366f1"
          />
          <TopStat
            icon={<TrendingUp size={20} />}
            label="Total Views"
            value={lifetimeViews}
            sub="Across all posts"
            color="#ec4899"
          />
        </div>

        {/* ── Tabs ───────────────────────────────────────────── */}
        <Tabs defaultValue="overview">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="monetization">Monetization</Tab>
            <Tab value="analytics">Analytics</Tab>
          </TabList>

          {/* Overview */}
          <TabPanel value="overview">
            <div className="mt-5 flex flex-col gap-5 animate-enter">
              <Card variant="default" className="p-5 sm:p-6">
                <LazyEarningsChart />
              </Card>
              <div className="grid gap-5 lg:grid-cols-2">
                <Card variant="default" className="p-5 sm:p-6">
                  <LazyRevenueCard />
                </Card>
                <Card variant="default" className="p-5 sm:p-6">
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Withdraw Funds
                    </p>
                    <p className="text-lg font-bold text-[var(--text-primary)]">Cash Out</p>
                  </div>
                  <LazyWithdrawPanel />
                </Card>
              </div>
            </div>
          </TabPanel>

          {/* Monetization */}
          <TabPanel value="monetization">
            <div className="mt-5 flex flex-col gap-5 animate-enter">
              <Card variant="default" className="p-5 sm:p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Withdraw Funds
                </p>
                <LazyWithdrawPanel />
              </Card>
              <Card variant="default" className="p-5 sm:p-6">
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Monetized Content
                  </p>
                  <p className="text-lg font-bold text-[var(--text-primary)]">Your Posts</p>
                </div>
                <LazyMonetizedPostsList />
              </Card>
            </div>
          </TabPanel>

          {/* Analytics */}
          <TabPanel value="analytics">
            <div className="mt-5 animate-enter">
              <Card variant="default" className="p-5 sm:p-6">
                <LazyAnalyticsSummary />
              </Card>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
