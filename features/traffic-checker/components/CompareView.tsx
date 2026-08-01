"use client";

import { ArrowRight, Crown } from "lucide-react";
import type { WebsiteReport } from "../types";
import { cn } from "@/lib/utils";
import { formatVisitors } from "../utils/report";
import { DisclaimerBanner } from "./ui";

interface CompareViewProps {
  reports: (WebsiteReport | null)[];
  onSelectSlot: (slot: 0 | 1) => void;
  onClearSlot: (slot: 0 | 1) => void;
}

type RowKey = "monthly" | "yearly" | "confidence" | "seo" | "technical" | "performance" | "accessibility" | "pageSize";

const ROWS: { key: RowKey; label: string; lowerIsBetter?: boolean }[] = [
  { key: "monthly", label: "Estimated Monthly Visitors" },
  { key: "yearly", label: "Estimated Yearly Visitors" },
  { key: "confidence", label: "Confidence" },
  { key: "seo", label: "SEO Score" },
  { key: "technical", label: "Technical Score" },
  { key: "performance", label: "Performance Score" },
  { key: "accessibility", label: "Accessibility Score" },
  { key: "pageSize", label: "Page Size", lowerIsBetter: true },
];

function cellValue(report: WebsiteReport | null, key: RowKey): { text: string; numeric: number } | null {
  if (!report) return null;
  switch (key) {
    case "monthly":
      return { text: formatVisitors(report.traffic.monthlyVisitors), numeric: report.traffic.monthlyVisitors };
    case "yearly":
      return { text: formatVisitors(report.traffic.yearlyVisitors), numeric: report.traffic.yearlyVisitors };
    case "confidence":
      return { text: `${report.traffic.confidence}%`, numeric: report.traffic.confidence };
    case "seo":
      return { text: String(report.scores.seo), numeric: report.scores.seo };
    case "technical":
      return { text: String(report.scores.technical), numeric: report.scores.technical };
    case "performance":
      return { text: String(report.scores.performance), numeric: report.scores.performance };
    case "accessibility":
      return { text: String(report.scores.accessibility), numeric: report.scores.accessibility };
    case "pageSize":
      return { text: `${report.meta.pageSizeKb.toLocaleString()} KB`, numeric: report.meta.pageSizeKb };
  }
}

export function CompareView({ reports, onSelectSlot, onClearSlot }: CompareViewProps) {
  const [a, b] = reports;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Compare Websites</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Pick two analyzed websites and compare their estimated traffic and scores side by side.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <DisclaimerBanner />
      </div>

      {/* Slot headers */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[0, 1].map((slot) => {
          const report = reports[slot];
          return (
            <div key={slot} className="rounded-xl border border-border bg-background p-3">
              {report ? (
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold text-text-primary">{report.domain}</p>
                    <button
                      type="button"
                      onClick={() => onClearSlot(slot as 0 | 1)}
                      className="shrink-0 text-xs text-text-muted transition-colors hover:text-error"
                      aria-label={`Remove ${report.domain} from comparison`}
                    >
                      Remove
                    </button>
                  </div>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {formatVisitors(report.traffic.monthlyVisitors)}/mo · Health {report.scores.health}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectSlot(slot as 0 | 1)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-4 text-sm text-text-muted transition-colors hover:border-primary hover:text-primary"
                >
                  Select website {slot + 1}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      {a && b ? (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-medium text-text-muted">Metric</th>
                {[0, 1].map((slot) => {
                  const report = reports[slot];
                  const winner = slot === 0 ? a : b;
                  return (
                    <th key={slot} className={cn("px-3 py-2 font-semibold", winner === a && slot === 0 ? "text-primary" : winner === b && slot === 1 ? "text-primary" : "")}>
                      {report?.domain}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const left = cellValue(a, row.key);
                const right = cellValue(b, row.key);
                if (!left || !right) return null;
                const leftWins = row.lowerIsBetter ? left.numeric <= right.numeric : left.numeric >= right.numeric;
                const rightWins = row.lowerIsBetter ? right.numeric <= left.numeric : right.numeric >= left.numeric;
                const tie = left.numeric === right.numeric;
                return (
                  <tr key={row.key} className="border-b border-border/60">
                    <td className="py-2.5 pr-4 text-text-secondary">{row.label}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5 font-medium text-text-primary">
                        {!tie && leftWins && <Crown className="h-3.5 w-3.5 text-warning" />}
                        {left.text}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5 font-medium text-text-primary">
                        {!tie && rightWins && <Crown className="h-3.5 w-3.5 text-warning" />}
                        {right.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-border p-6 text-center text-sm text-text-muted">
          Select two websites from the dashboard or history to compare them here.
        </p>
      )}
    </section>
  );
}
