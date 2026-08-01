"use client";

import { useRef, useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Printer,
  Share2,
  Star,
} from "lucide-react";
import type { WebsiteReport } from "../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/features/devtools/utils/download";
import {
  AnimatedNumber,
  DisclaimerBanner,
  ScoreBar,
  ScoreRing,
  StatusPill,
  TrendBadge,
  TrendChart,
} from "./ui";
import { buildSummaryText, formatVisitors, printReport } from "../utils/report";

interface ReportDashboardProps {
  report: WebsiteReport;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onCompare: () => void;
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Metric card with an animated number. */
function MetricCard({
  label,
  value,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-text-primary sm:text-3xl">
          <AnimatedNumber value={value} format={formatVisitors} />
        </span>
        {suffix && <span className="text-sm text-text-secondary">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
    </div>
  );
}

export function ReportDashboard({
  report,
  isFavorite,
  onToggleFavorite,
  onCompare,
}: ReportDashboardProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async () => {
    const ok = await copyToClipboard(buildSummaryText(report));
    if (!ok) return;
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1600);
  };

  const handleShare = async () => {
    const text = buildSummaryText(report);
    if (navigator.share) {
      try {
        await navigator.share({ title: `${report.domain} — estimated traffic`, text });
        return;
      } catch {
        // fall back to copy
      }
    }
    await handleCopy();
  };

  const handlePrint = () => printReport(report);

  const groupPanels: { title: string; checks: WebsiteReport["groups"]["seo"] }[] = [
    { title: "SEO Signals", checks: report.groups.seo },
    { title: "Technical", checks: report.groups.technical },
    { title: "Performance", checks: report.groups.performance },
    { title: "Content & Accessibility", checks: report.groups.content },
  ];

  return (
    <div className="space-y-6" aria-live="polite">
      {/* Report header + export actions */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="truncate text-xl font-bold text-text-primary">{report.domain}</h2>
              <TrendBadge trend={report.traffic.trend} />
            </div>
            <a
              href={report.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-primary"
            >
              {report.url}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleCopy} aria-label="Copy report summary">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleShare}>
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
            <Button variant="secondary" size="sm" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
            <Button variant="secondary" size="sm" onClick={handlePrint}>
              <Download className="h-3.5 w-3.5" />
              PDF
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={isFavorite ? "text-warning" : "text-text-muted hover:text-warning"}
            >
              <Star className={cn("h-4 w-4", isFavorite && "fill-warning")} />
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <DisclaimerBanner />
        </div>
      </section>

      {/* Traffic metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Estimated Monthly Traffic"
          value={report.traffic.monthlyVisitors}
          hint="Estimated monthly visitors"
        />
        <MetricCard
          label="Estimated Yearly Traffic"
          value={report.traffic.yearlyVisitors}
          hint="Estimated yearly visitors"
        />
        <MetricCard label="Confidence" value={report.traffic.confidence} suffix="%" hint="How grounded the estimate is" />
        <MetricCard label="Website Health" value={report.scores.health} suffix="/100" hint="Overall technical & SEO health" />
      </div>

      {/* Score rings + trend chart */}
      <div className="grid gap-4 lg:grid-cols-5">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6 lg:col-span-3">
          <h3 className="text-sm font-semibold text-text-primary">Score Breakdown</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <ScoreRing label="SEO" value={report.scores.seo} />
            <ScoreRing label="Technical" value={report.scores.technical} />
            <ScoreRing label="Performance" value={report.scores.performance} />
            <ScoreRing label="Accessibility" value={report.scores.accessibility} />
            <ScoreRing label="Best Practices" value={report.scores.bestPractices} />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">12-Month Trend</h3>
            <TrendBadge trend={report.traffic.trend} />
          </div>
          <div className="mt-4">
            <TrendChart data={report.traffic.trendSeries} labels={MONTH_LABELS} />
          </div>
          <p className="mt-2 text-xs text-text-muted">
            Projected monthly visitors from a deterministic growth model — an estimate, not real analytics.
          </p>
        </section>
      </div>

      {/* Breakdown panels */}
      <div className="grid gap-4 lg:grid-cols-2">
        {groupPanels.map((panel) => (
          <section key={panel.title} className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <h3 className="mb-3 text-sm font-semibold text-text-primary">{panel.title}</h3>
            <ul className="space-y-2">
              {panel.checks.map((check) => (
                <li
                  key={check.label}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-background px-3 py-2"
                >
                  <span className="text-sm text-text-primary">{check.label}</span>
                  <StatusPill status={check.status} detail={check.detail} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Recommendations + site meta */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">Recommendations</h3>
          {report.recommendations.length === 0 ? (
            <p className="text-sm text-text-secondary">No major issues detected — keep it up!</p>
          ) : (
            <ul className="space-y-3">
              {report.recommendations.map((rec) => (
                <li key={rec.title} className="flex gap-3">
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      rec.severity === "high" ? "bg-error" : rec.severity === "medium" ? "bg-warning" : "bg-success"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{rec.title}</p>
                    <p className="mt-0.5 text-sm text-text-secondary">{rec.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-text-primary">Site Overview</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ScoreBar label="SEO" value={report.scores.seo} />
            <ScoreBar label="Technical" value={report.scores.technical} />
            <ScoreBar label="Performance" value={report.scores.performance} />
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-text-muted">Page size</dt>
              <dd className="font-medium text-text-primary">{report.meta.pageSizeKb.toLocaleString()} KB</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Content words</dt>
              <dd className="font-medium text-text-primary">{report.meta.wordCount.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Images</dt>
              <dd className="font-medium text-text-primary">{report.meta.imageCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Internal links</dt>
              <dd className="font-medium text-text-primary">{report.meta.internalLinks}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">External links</dt>
              <dd className="font-medium text-text-primary">{report.meta.externalLinks}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Detected stack</dt>
              <dd className="font-medium text-text-primary">
                {report.tech.length > 0 ? report.tech.map((t) => t.name).join(", ") : "Unknown"}
              </dd>
            </div>
          </dl>
          <Button variant="outline" size="sm" className="mt-5 w-full" onClick={onCompare}>
            Compare with another website
          </Button>
        </section>
      </div>
    </div>
  );
}
