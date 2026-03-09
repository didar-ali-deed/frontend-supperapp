"use client";

import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatCount } from "@/lib/utils/format";
import { EARNINGS_DATA } from "@/lib/data/dashboard.mock";
import type { TimeRange } from "@/lib/data/dashboard.mock";

/* ── Chart geometry ───────────────────────────────────────────── */
const TIME_RANGES: TimeRange[] = ["7D", "30D", "90D", "1Y"];
const W   = 600;
const H   = 240;
const PAD = { top: 24, right: 20, bottom: 44, left: 62 };

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const mx = (p0.x + p1.x) / 2;
    d += ` C ${mx},${p0.y} ${mx},${p1.y} ${p1.x},${p1.y}`;
  }
  return d;
}

/* ── EarningsChart ────────────────────────────────────────────── */
export function EarningsChart() {
  const [range, setRange]       = React.useState<TimeRange>("30D");
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const data = EARNINGS_DATA[range];

  /* Derived stats */
  const total      = data.reduce((s, d) => s + d.earnings, 0);
  const avg        = total / (data.length || 1);
  const peak       = Math.max(...data.map((d) => d.earnings), 0);
  const totalViews = data.reduce((s, d) => s + d.views, 0);
  const first      = data[0]?.earnings ?? 0;
  const last       = data[data.length - 1]?.earnings ?? 0;
  const trendPct   = first > 0 ? ((last - first) / first) * 100 : 0;
  const positive   = trendPct >= 0;

  /* Coordinate helpers */
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top  - PAD.bottom;
  const maxVal = peak * 1.18 || 1;
  const toX = (i: number) =>
    data.length <= 1 ? PAD.left + chartW / 2 : PAD.left + (i / (data.length - 1)) * chartW;
  const toY = (v: number) => PAD.top + chartH - (v / maxVal) * chartH;

  const pts      = data.map((d, i) => ({ x: toX(i), y: toY(d.earnings) }));
  const linePath = smoothPath(pts);
  const areaPath = linePath && pts.length
    ? `${linePath} L ${pts[pts.length - 1].x},${PAD.top + chartH} L ${pts[0].x},${PAD.top + chartH} Z`
    : "";

  /* Axis ticks */
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: toY(maxVal * f),
    label: formatCurrency(maxVal * f),
  }));
  const xCount = Math.min(5, data.length);
  const xTicks = Array.from({ length: xCount }, (_, i) => {
    const idx = Math.round((i / Math.max(xCount - 1, 1)) * (data.length - 1));
    const safe = Math.min(idx, data.length - 1);
    return {
      x: toX(safe),
      label: new Date(data[safe].date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });

  /* Hover */
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || !data.length) return;
    const svgX  = ((e.clientX - rect.left) / rect.width) * W;
    const idx   = Math.round(((svgX - PAD.left) / chartW) * (data.length - 1));
    setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
  };

  const hovered   = hoverIdx !== null ? data[hoverIdx]  : null;
  const hoveredPt = hoverIdx !== null ? pts[hoverIdx]   : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Total Earnings
          </p>
          <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
            {formatCurrency(total)}
          </p>
          <div className={cn(
            "mt-0.5 flex items-center gap-1 text-xs font-semibold",
            positive ? "text-[var(--color-success-600)]" : "text-[var(--color-danger-600)]"
          )}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trendPct).toFixed(1)}% vs start of period
          </div>
        </div>

        {/* Time range pills */}
        <div className="flex gap-1 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] p-1">
          {TIME_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => { setRange(r); setHoverIdx(null); }}
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

      {/* Chart */}
      <div className="relative w-full select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="ec-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Gridlines + Y labels */}
          {yTicks.map(({ y, label }) => (
            <g key={label}>
              <line
                x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                style={{ stroke: "var(--surface-border)" }}
                strokeWidth="1" strokeDasharray="4 4"
              />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="9.5"
                style={{ fill: "var(--text-muted)" }}>
                {label}
              </text>
            </g>
          ))}

          {/* X labels */}
          {xTicks.map(({ x, label }) => (
            <text key={label} x={x} y={H - 6} textAnchor="middle" fontSize="9.5"
              style={{ fill: "var(--text-muted)" }}>
              {label}
            </text>
          ))}

          {/* Area */}
          {areaPath && <path d={areaPath} fill="url(#ec-fill)" />}

          {/* Line */}
          {linePath && (
            <path d={linePath} fill="none" stroke="#6366f1"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          )}

          {/* Hover overlay */}
          {hoveredPt && hovered && (() => {
            const tipW = 134;
            const tipH = 60;
            const tipX = Math.max(PAD.left, Math.min(hoveredPt.x - tipW / 2, W - PAD.right - tipW));
            const tipY = hoveredPt.y - tipH - 14 < PAD.top
              ? hoveredPt.y + 14
              : hoveredPt.y - tipH - 14;
            return (
              <>
                <line
                  x1={hoveredPt.x} y1={PAD.top}
                  x2={hoveredPt.x} y2={PAD.top + chartH}
                  style={{ stroke: "var(--surface-border-strong)" }}
                  strokeWidth="1" strokeDasharray="3 3"
                />
                <circle cx={hoveredPt.x} cy={hoveredPt.y}
                  r="5" fill="#6366f1" stroke="white" strokeWidth="2.5" />
                <g>
                  <rect x={tipX} y={tipY} width={tipW} height={tipH} rx="8"
                    style={{ fill: "var(--surface-bg)", stroke: "var(--surface-border)" }}
                    strokeWidth="1"
                    filter="drop-shadow(0 4px 8px rgba(0,0,0,0.08))"
                  />
                  <text x={tipX + 10} y={tipY + 17} fontSize="9.5"
                    style={{ fill: "var(--text-muted)" }}>
                    {hovered.date}
                  </text>
                  <text x={tipX + 10} y={tipY + 36} fontSize="14" fontWeight="700"
                    style={{ fill: "var(--text-primary)" }}>
                    {formatCurrency(hovered.earnings)}
                  </text>
                  <text x={tipX + 10} y={tipY + 51} fontSize="9"
                    style={{ fill: "var(--text-muted)" }}>
                    {hovered.views.toLocaleString()} views
                  </text>
                </g>
              </>
            );
          })()}
        </svg>
      </div>

      {/* Footer stats */}
      <div className="grid grid-cols-3 gap-4 border-t border-[var(--surface-border)] pt-4">
        {[
          { label: "Daily Avg",   value: formatCurrency(avg) },
          { label: "Peak Day",    value: formatCurrency(peak) },
          { label: "Total Views", value: formatCount(totalViews) },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              {label}
            </p>
            <p className="text-base font-bold tabular-nums text-[var(--text-primary)]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
