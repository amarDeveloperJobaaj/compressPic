"use client";

import { useId } from "react";
import type { ChartDef } from "../types";
import { formatByKind } from "../utils/format";

function Legend({ chart }: { chart: ChartDef }) {
  if (chart.datasets.length <= 1 && chart.type !== "donut") return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {chart.labels.map((label, i) => (
        <span key={label} className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: chart.colors?.[i] ?? "#2563EB" }}
          />
          {label}
        </span>
      ))}
    </div>
  );
}

/** Multi-series line/area chart (SVG, theme-aware via CSS vars). */
function LineChart({ chart }: { chart: ChartDef }) {
  const gradId = useId();
  const W = 560;
  const H = 220;
  const pad = { top: 16, right: 12, bottom: 28, left: 56 };

  const all = chart.datasets.flat();
  const max = Math.max(...all, 1);
  const min = Math.min(...all, 0);
  const range = max - min || 1;
  const n = chart.categories.length;

  const x = (i: number) => pad.left + (i / Math.max(1, n - 1)) * (W - pad.left - pad.right);
  const y = (v: number) => pad.top + (1 - (v - min) / range) * (H - pad.top - pad.bottom);

  const gridLines = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={chart.title}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: gridLines + 1 }).map((_, gi) => {
        const gy = pad.top + (gi / gridLines) * (H - pad.top - pad.bottom);
        const val = max - (gi / gridLines) * range;
        return (
          <g key={gi}>
            <line x1={pad.left} y1={gy} x2={W - pad.right} y2={gy} stroke="var(--color-border)" strokeDasharray="3 4" />
            <text x={pad.left - 8} y={gy + 4} textAnchor="end" fontSize="11" fill="var(--color-text-muted)">
              {formatByKind(val, chart.format)}
            </text>
          </g>
        );
      })}
      {chart.datasets.map((series, si) => {
        const points = series.map((v, i) => `${x(i)},${y(v)}`).join(" ");
        return (
          <g key={si}>
            {chart.type === "area" && si === 0 && (
              <polygon
                points={`${x(0)},${y(0)} ${points} ${x(n - 1)},${y(0)}`}
                fill={`url(#${gradId})`}
              />
            )}
            <polyline
              points={points}
              fill="none"
              stroke={chart.colors?.[si] ?? "var(--color-primary)"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {series.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={chart.colors?.[si] ?? "var(--color-primary)"} />
            ))}
          </g>
        );
      })}
      {chart.categories.map((cat, i) => (
        <text
          key={cat}
          x={x(i)}
          y={H - 8}
          textAnchor="middle"
          fontSize="11"
          fill="var(--color-text-muted)"
        >
          {cat}
        </text>
      ))}
    </svg>
  );
}

/** Horizontal bar chart for discrete comparisons. */
function BarChart({ chart }: { chart: ChartDef }) {
  const max = Math.max(...chart.datasets.flat(), 1);

  return (
    <div className="w-full" role="img" aria-label={chart.title}>
      {chart.categories.map((cat, i) => {
        const value = chart.datasets[0]?.[i] ?? 0;
        const widthPct = Math.max(2, (value / max) * 100);
        return (
          <div key={cat} className="mb-3 flex items-center gap-3">
            <span className="w-24 shrink-0 truncate text-right text-xs text-text-muted">{cat}</span>
            <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-primary-light/40">
              <div
                className="flex h-full items-center rounded-md bg-gradient-to-r from-primary to-sky-500 pl-2 text-[11px] font-semibold text-white transition-all duration-500"
                style={{ width: `${widthPct}%` }}
              >
                {formatByKind(value, chart.format)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Compute donut arc offsets immutably (avoids render-scope mutation). */
function donutSegments(values: number[], total: number, circumference: number) {
  const segments: { dash: number; offset: number }[] = [];
  let offset = 0;
  for (const v of values) {
    const frac = Math.max(0, v) / total;
    segments.push({ dash: frac * circumference, offset });
    offset += frac * circumference;
  }
  return segments;
}

/** Donut chart built from SVG circles (stroke-dasharray). */
function DonutChart({ chart }: { chart: ChartDef }) {
  const data = chart.datasets[0] ?? [];
  const total = data.reduce((s, v) => s + Math.max(0, v), 0) || 1;
  const R = 70;
  const C = 2 * Math.PI * R;
  const segments = donutSegments(data, total, C);

  return (
    <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-center">
      <svg viewBox="0 0 200 200" className="h-44 w-44 shrink-0" role="img" aria-label={chart.title}>
        <circle cx="100" cy="100" r={R} fill="none" stroke="var(--color-border)" strokeWidth="22" />
        {data.map((v, i) => {
          const seg = segments[i];
          return (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={chart.colors?.[i] ?? "#2563EB"}
              strokeWidth="22"
              strokeDasharray={`${seg.dash} ${C - seg.dash}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="butt"
              transform="rotate(-90 100 100)"
            />
          );
        })}
        <text x="100" y="96" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--color-text-primary)">
          {total >= 1e7 ? `${(total / 1e7).toFixed(1)}Cr` : total >= 1e5 ? `${(total / 1e5).toFixed(1)}L` : formatByKind(total, chart.format)}
        </text>
        <text x="100" y="116" textAnchor="middle" fontSize="11" fill="var(--color-text-muted)">
          Total
        </text>
      </svg>
      <ul className="space-y-2">
        {data.map((v, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: chart.colors?.[i] ?? "#2563EB" }} />
            <span className="w-24">{chart.labels[i]}</span>
            <span className="font-semibold text-text-primary">{formatByKind(v, chart.format)}</span>
            <span className="text-xs text-text-muted">({((v / total) * 100).toFixed(1)}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Render any chart definition. */
export function FinanceChart({ chart }: { chart: ChartDef }) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-5">
      <h3 className="mb-4 text-center text-sm font-semibold text-text-primary">{chart.title}</h3>
      {chart.type === "donut" ? (
        <DonutChart chart={chart} />
      ) : chart.type === "bar" ? (
        <BarChart chart={chart} />
      ) : (
        <LineChart chart={chart} />
      )}
      <div className="mt-3">
        <Legend chart={chart} />
      </div>
    </div>
  );
}
