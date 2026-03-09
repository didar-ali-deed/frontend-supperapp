"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import { REVENUE_SOURCES } from "@/lib/data/dashboard.mock";

/* ── SVG donut helpers ────────────────────────────────────────── */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number): string {
  const s    = polarToCartesian(cx, cy, r, start);
  const e    = polarToCartesian(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

/* ── RevenueCard ──────────────────────────────────────────────── */
const CX = 80, CY = 80, R = 54, SW = 18;
const GAP = 2.5; // degrees gap between arcs

export function RevenueCard() {
  const [hovered, setHovered] = React.useState<string | null>(null);

  const total = REVENUE_SOURCES.reduce((s, r) => s + r.amount, 0);
  const totalDeg = 360 - GAP * REVENUE_SOURCES.length;

  /* Build arc segments */
  let cursor = 0;
  const arcs = REVENUE_SOURCES.map((src) => {
    const sweep = (src.amount / total) * totalDeg;
    const seg = { ...src, startAngle: cursor, endAngle: cursor + sweep };
    cursor += sweep + GAP;
    return seg;
  });

  const hoveredSrc = hovered ? REVENUE_SOURCES.find((s) => s.id === hovered) : null;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Revenue Breakdown
        </p>
        <p className="text-2xl font-bold tabular-nums text-[var(--text-primary)]">
          {formatCurrency(total)}
        </p>
        <p className="text-xs text-[var(--text-muted)]">this month</p>
      </div>

      {/* Donut + legend */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* SVG Donut */}
        <div className="flex shrink-0 justify-center">
          <svg width={160} height={160} viewBox="0 0 160 160">
            {/* Track ring */}
            <circle
              cx={CX} cy={CY} r={R}
              fill="none"
              style={{ stroke: "var(--surface-muted)" }}
              strokeWidth={SW}
            />

            {/* Data arcs */}
            {arcs.map((arc) => {
              const isHov = hovered === arc.id;
              const dr    = isHov ? R + 3 : R;
              const dsw   = isHov ? SW + 4 : SW;
              return (
                <path
                  key={arc.id}
                  d={arcPath(CX, CY, dr, arc.startAngle, arc.endAngle)}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={dsw}
                  strokeLinecap="round"
                  style={{ transition: "all 0.18s ease", cursor: "pointer" }}
                  onMouseEnter={() => setHovered(arc.id)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}

            {/* Center label */}
            {hoveredSrc ? (
              <>
                <text x={CX} y={CY - 7} textAnchor="middle" fontSize="9"
                  style={{ fill: "var(--text-muted)" }} fontWeight="600">
                  {hoveredSrc.label}
                </text>
                <text x={CX} y={CY + 10} textAnchor="middle" fontSize="13" fontWeight="700"
                  style={{ fill: hoveredSrc.color }}>
                  {formatCurrency(hoveredSrc.amount)}
                </text>
                <text x={CX} y={CY + 24} textAnchor="middle" fontSize="9"
                  style={{ fill: "var(--text-muted)" }}>
                  {((hoveredSrc.amount / total) * 100).toFixed(1)}%
                </text>
              </>
            ) : (
              <>
                <text x={CX} y={CY - 6} textAnchor="middle" fontSize="9"
                  style={{ fill: "var(--text-muted)" }} fontWeight="600">
                  TOTAL
                </text>
                <text x={CX} y={CY + 11} textAnchor="middle" fontSize="12" fontWeight="700"
                  style={{ fill: "var(--text-primary)" }}>
                  {formatCurrency(total)}
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Legend list */}
        <div className="flex flex-1 flex-col gap-1.5 min-w-0">
          {REVENUE_SOURCES.map((src) => {
            const pct = (src.amount / total) * 100;
            const isHov = hovered === src.id;
            return (
              <button
                key={src.id}
                onMouseEnter={() => setHovered(src.id)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "flex items-center gap-2.5 rounded-[var(--radius-lg)] p-2 text-left transition-all",
                  isHov ? "bg-[var(--surface-muted)]" : "hover:bg-[var(--surface-subtle)]"
                )}
              >
                <div
                  className="h-3 w-3 shrink-0 rounded-sm transition-all"
                  style={{ backgroundColor: src.color, transform: isHov ? "scale(1.2)" : "scale(1)" }}
                />
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-xs font-medium text-[var(--text-primary)]">
                      {src.label}
                    </span>
                    <span className="shrink-0 text-xs font-bold tabular-nums text-[var(--text-primary)]">
                      {formatCurrency(src.amount)}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: src.color }}
                    />
                  </div>
                </div>
                <span className="shrink-0 text-[10px] font-semibold text-[var(--text-muted)]">
                  {pct.toFixed(0)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
