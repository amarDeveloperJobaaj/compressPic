"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Info,
  Minus,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SignalCheck } from "../types";

/* ------------------------------------------------------------------ */
/* Score tone helpers                                                  */
/* ------------------------------------------------------------------ */

export type ScoreTone = "success" | "warning" | "error";

export function scoreTone(value: number): ScoreTone {
  if (value >= 75) return "success";
  if (value >= 50) return "warning";
  return "error";
}

const toneText: Record<ScoreTone, string> = {
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

const toneBar: Record<ScoreTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

/* ------------------------------------------------------------------ */
/* AnimatedNumber — counts up with rAF once the value mounts           */
/* ------------------------------------------------------------------ */

interface AnimatedNumberProps {
  value: number;
  format?: (value: number) => string;
  duration?: number;
}

export function AnimatedNumber({
  value,
  format,
  duration = 900,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return <>{format ? format(display) : display.toLocaleString()}</>;
}

/* ------------------------------------------------------------------ */
/* ScoreRing — circular 0–100 gauge                                    */
/* ------------------------------------------------------------------ */

interface ScoreRingProps {
  label: string;
  value: number;
  size?: number;
}

export function ScoreRing({ label, value, size = 88 }: ScoreRingProps) {
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;
  const tone = scoreTone(value);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${label}: ${value} out of 100`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-[stroke-dashoffset] duration-700 ease-out", toneText[tone])}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatedNumber
            value={value}
            format={(v) => v.toString()}
            duration={700}
          />
          <span className="text-[10px] text-text-muted">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-medium text-text-secondary">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ScoreBar — horizontal labeled bar                                   */
/* ------------------------------------------------------------------ */

interface ScoreBarProps {
  label: string;
  value: number;
}

export function ScoreBar({ label, value }: ScoreBarProps) {
  const tone = scoreTone(value);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-text-primary">{label}</span>
        <span className={cn("font-semibold", toneText[tone])}>{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className={cn("h-full rounded-full transition-all duration-700", toneBar[tone])}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StatusPill — pass / warn / fail / unknown                           */
/* ------------------------------------------------------------------ */

const statusConfig: Record<SignalCheck["status"], { icon: typeof CheckCircle2; className: string }> = {
  pass: { icon: CheckCircle2, className: "bg-success-light text-success" },
  warn: { icon: AlertTriangle, className: "bg-warning-light text-warning" },
  fail: { icon: XCircle, className: "bg-error-light text-error" },
  unknown: { icon: HelpCircle, className: "bg-border text-text-muted" },
};

export function StatusPill({ status, detail }: { status: SignalCheck["status"]; detail?: string }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="capitalize">{status}</span>
      {detail && <span className="text-text-muted">· {detail}</span>}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* TrendBadge — High / Medium / Low traffic trend                      */
/* ------------------------------------------------------------------ */

export function TrendBadge({ trend }: { trend: "High" | "Medium" | "Low" }) {
  const config =
    trend === "High"
      ? { icon: TrendingUp, className: "bg-success-light text-success" }
      : trend === "Medium"
        ? { icon: Minus, className: "bg-warning-light text-warning" }
        : { icon: TrendingDown, className: "bg-error-light text-error" };
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {trend} trend
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* TrendChart — dependency-free SVG area chart                         */
/* ------------------------------------------------------------------ */

interface TrendChartProps {
  data: number[];
  labels?: string[];
}

export function TrendChart({ data, labels }: TrendChartProps) {
  const width = 600;
  const height = 200;
  const pad = 10;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = pad + (index * (width - pad * 2)) / (data.length - 1 || 1);
    const y = height - pad - ((value - min) / range) * (height - pad * 2);
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1]?.x.toFixed(1)},${height - pad} L${points[0]?.x.toFixed(1)},${height - pad} Z`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-44 w-full"
        role="img"
        aria-label="Projected 12-month traffic trend"
      >
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#trend-fill)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="2" />
        ))}
      </svg>
      {labels && labels.length === data.length && (
        <div className="mt-1 flex justify-between text-[10px] text-text-muted">
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DisclaimerBanner — required honesty notice                          */
/* ------------------------------------------------------------------ */

export function DisclaimerBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-light/60 p-4 text-sm">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <p className="text-text-secondary">
        <strong className="font-semibold text-text-primary">This is an estimation.</strong>{" "}
        Values are based on publicly available SEO signals and should not be considered exact analytics.
      </p>
    </div>
  );
}
