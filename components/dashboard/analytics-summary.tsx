"use client";

import * as React from "react";
import {
  Eye, Users, TrendingUp, UserPlus, DollarSign, Percent,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCount } from "@/lib/utils/format";
import { ANALYTICS_STATS, EARNINGS_DATA } from "@/lib/data/dashboard.mock";
import type { AnalyticsStat, TimeRange } from "@/lib/data/dashboard.mock";

/* ── Icon map ─────────────────────────────────────────────────── */
const STAT_ICONS: Record<string, React.ReactNode> = {
  totalViews:      <Eye        size={18} />,
  uniqueViewers:   <Users      size={18} />,
  engagementRate:  <TrendingUp size={18} />,
  followersGained: <UserPlus   size={18} />,
  avgEarnings:     <DollarSign size={18} />,
  conversionRate:  <Percent    size={18} />,
};

const STAT_COLORS: Record<string, string> = {
  totalViews:      "#6366f1",
  uniqueViewers:   "#8b5cf6",
  engagementRate:  "#10b981",
  followersGained: "#ec4899",
  avgEarnings:     "#f59e0b",
  conversionRate:  "#3b82f6",
};

/* ── Mini sparkline (SVG bar chart) ───────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const W = 80, H = 28;
  const barW = W / data.length - 1;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
      {data.map((v, i) => {
        const h = Math.max(2, (v / max) * H);
        return (
          <rect
            key={i}
            x={i * (barW + 1)}
            y={H - h}
            width={barW}
            height={h}
            rx="1.5"
            fill={color}
            opacity={i === data.length - 1 ? 1 : 0.35 + (i / data.length) * 0.45}
          />
        );
      })}
    </svg>
  );
}

/* ── Stat card ────────────────────────────────────────────────── */
function StatTile({ stat, sparkData }: { stat: AnalyticsStat; sparkData: number[] }) {
  const positive = stat.delta >= 0;
  const color    = STAT_COLORS[stat.key] ?? "#6366f1";
  const icon     = STAT_ICONS[stat.key];

  const displayValue = stat.prefix
    ? `${stat.prefix}${stat.value.toLocaleString()}`
    : stat.suffix
    ? `${stat.value.toLocaleString()}${stat.suffix}`
    : formatCount(stat.value);

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-5 shadow-[var(--shadow-xs)]">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)]"
          style={{ backgroundColor: color + "18", color }}
        >
          {icon}
        </div>
        <Sparkline data={sparkData} color={color} />
      </div>

      {/* Value */}
      <div className="flex flex-col gap-0.5">
        <p className="text-2xl font-bold tabular-nums text-[var(--text-primary)]">
          {displayValue}
        </p>
        <p className="text-xs font-medium text-[var(--text-muted)]">{stat.label}</p>
      </div>

      {/* Delta */}
      <div
        className={cn(
          "flex items-center gap-1 text-xs font-semibold",
          positive ? "text-[var(--color-success-600)]" : "text-[var(--color-danger-600)]"
        )}
      >
        {positive
          ? <ArrowUpRight size={13} />
          : <ArrowDownRight size={13} />
        }
        {Math.abs(stat.delta)}% vs last period
      </div>
    </div>
  );
}

/* ── Audience bar chart ───────────────────────────────────────── */
function AudienceChart({ range }: { range: TimeRange }) {
  const data    = EARNINGS_DATA[range];
  const sampled = React.useMemo(() => {
    const step = Math.max(1, Math.floor(data.length / 20));
    return data.filter((_, i) => i % step === 0);
  }, [data]);

  const maxViews = Math.max(...sampled.map((d) => d.views), 1);
  const W = 580, H = 100, PAD = { left: 48, right: 12, top: 8, bottom: 24 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const barW   = Math.max(4, (chartW / sampled.length) - 2);

  return (
    <div className="w-full overflow-hidden select-none">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        {/* Y labels */}
        {[0, 0.5, 1].map((f) => {
          const y = PAD.top + chartH - f * chartH;
          return (
            <g key={f}>
              <line
                x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                style={{ stroke: "var(--surface-border)" }}
                strokeWidth="1" strokeDasharray="3 3"
              />
              <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="8.5"
                style={{ fill: "var(--text-muted)" }}>
                {formatCount(maxViews * f)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {sampled.map((d, i) => {
          const h  = Math.max(2, (d.views / maxViews) * chartH);
          const x  = PAD.left + (i / sampled.length) * chartW;
          const y  = PAD.top + chartH - h;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={h}
              rx="2"
              fill="#6366f1"
              opacity="0.65"
            />
          );
        })}

        {/* X labels — first and last */}
        {sampled.length > 1 && (
          <>
            <text x={PAD.left} y={H - 4} fontSize="8.5" style={{ fill: "var(--text-muted)" }}>
              {new Date(sampled[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </text>
            <text x={W - PAD.right} y={H - 4} textAnchor="end" fontSize="8.5" style={{ fill: "var(--text-muted)" }}>
              {new Date(sampled[sampled.length - 1].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

/* ── AnalyticsSummary ─────────────────────────────────────────── */
const TIME_RANGES: TimeRange[] = ["7D", "30D", "90D", "1Y"];

export function AnalyticsSummary() {
  const [range, setRange] = React.useState<TimeRange>("30D");

  /* Build sparkline data per stat from EARNINGS_DATA views */
  const viewsData  = EARNINGS_DATA[range].map((d) => d.views);
  const sparks = React.useMemo<Record<string, number[]>>(() => {
    const sample = (arr: number[], n = 12) => {
      const step = Math.max(1, Math.floor(arr.length / n));
      return arr.filter((_, i) => i % step === 0).slice(0, n);
    };
    return {
      totalViews:      sample(viewsData),
      uniqueViewers:   sample(viewsData.map((v) => Math.round(v * 0.37))),
      engagementRate:  sample(viewsData.map((_, i) => 5 + Math.sin(i * 0.7) * 2.5)),
      followersGained: sample(viewsData.map((v) => Math.round(v * 0.022))),
      avgEarnings:     sample(EARNINGS_DATA[range].map((d) => d.earnings)),
      conversionRate:  sample(viewsData.map((_, i) => 3 + Math.cos(i * 0.5) * 1.2)),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header + range selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Analytics Overview
          </p>
          <p className="text-lg font-bold text-[var(--text-primary)]">
            Performance Metrics
          </p>
        </div>
        <div className="flex gap-1 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] p-1">
          {TIME_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-semibold transition-all",
                range === r
                  ? "bg-[var(--surface-bg)] text-[var(--text-primary)] shadow-[var(--shadow-xs)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {ANALYTICS_STATS.map((stat) => (
          <StatTile
            key={stat.key}
            stat={stat}
            sparkData={sparks[stat.key] ?? []}
          />
        ))}
      </div>

      {/* Audience views chart */}
      <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-5 shadow-[var(--shadow-xs)]">
        <div className="flex items-center gap-2">
          <Eye size={15} className="text-[var(--color-primary-600)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Audience Views — {range}
          </p>
        </div>
        <AudienceChart range={range} />
      </div>

      {/* Top content breakdown */}
      <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-5 shadow-[var(--shadow-xs)]">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Traffic Sources</p>
        <div className="flex flex-col gap-3">
          {[
            { source: "Organic Search",  pct: 42, color: "#6366f1" },
            { source: "Social Media",    pct: 28, color: "#10b981" },
            { source: "Direct",          pct: 18, color: "#f59e0b" },
            { source: "Referral",        pct:  8, color: "#ec4899" },
            { source: "Email",           pct:  4, color: "#8b5cf6" },
          ].map(({ source, pct, color }) => (
            <div key={source} className="flex items-center gap-3">
              <p className="w-32 shrink-0 text-xs text-[var(--text-secondary)]">{source}</p>
              <div className="flex flex-1 items-center gap-2">
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-semibold text-[var(--text-muted)]">
                  {pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
