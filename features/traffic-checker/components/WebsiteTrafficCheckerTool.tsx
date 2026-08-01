"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Globe,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import type { WebsiteReport } from "../types";
import { normalizeDomain, validateDomain } from "../services/analyzer";
import { runAnalysis } from "../services/engine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ReportDashboard } from "./ReportDashboard";
import { CompareView } from "./CompareView";
import { HistoryPanel, type HistoryItem } from "./HistoryPanel";
import { DisclaimerBanner } from "./ui";

const HISTORY_KEY = "compresspix:traffic-checker:history";

interface PipelineStage {
  pct: number;
  label: string;
}

/** Ordered pipeline stages shown with live progress. */
const PIPELINE: { min: number; label: string }[] = [
  { min: 0, label: "Normalize & validate domain" },
  { min: 18, label: "Fetch public website data" },
  { min: 78, label: "Analyze SEO signals" },
  { min: 90, label: "Score & estimate traffic" },
  { min: 100, label: "Generate report" },
];

function currentStage(pct: number): string {
  for (let i = PIPELINE.length - 1; i >= 0; i--) {
    if (pct >= PIPELINE[i].min) return PIPELINE[i].label;
  }
  return PIPELINE[0].label;
}

/** Index of the pipeline stage the given progress percentage is in. */
function stageIndex(pct: number): number {
  let idx = 0;
  for (let i = 0; i < PIPELINE.length; i++) {
    if (pct >= PIPELINE[i].min) idx = i;
  }
  return idx;
}

/** Module-level timestamp helper (keeps Date.now() out of render scope). */
function nowMs(): number {
  return Date.now();
}

export function WebsiteTrafficCheckerTool() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [report, setReport] = useState<WebsiteReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<PipelineStage>({ pct: 0, label: "Normalize & validate domain" });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [compareSlot, setCompareSlot] = useState<0 | 1 | null>(null);
  const [compareReports, setCompareReports] = useState<(WebsiteReport | null)[]>([null, null]);
  const [compareLoading, setCompareLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const compareAbortRef = useRef<AbortController | null>(null);

  // Load history from localStorage (client-only, deferred past SSR).
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as HistoryItem[];
          if (Array.isArray(parsed)) setHistory(parsed.slice(0, 20));
        }
      } catch {
        // ignore corrupt history
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup any in-flight analysis on unmount.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      compareAbortRef.current?.abort();
    };
  }, []);

  const persistHistory = (next: HistoryItem[]) => {
    setHistory(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next.slice(0, 20)));
    } catch {
      // storage unavailable
    }
  };

  const pushHistory = (domain: string, time: number) => {
    const next = [{ domain, time, favorite: false }, ...history.filter((h) => h.domain !== domain)];
    persistHistory(next);
  };

  const analyze = async (input: string) => {
    const normalized = normalizeDomain(input);
    const validationError = validateDomain(normalized.domain);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    abortRef.current?.abort();
    compareAbortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("running");
    setError(null);
    setProgress({ pct: 0, label: "Normalize & validate domain" });

    try {
      const result = await runAnalysis(normalized.domain, normalized.url, (pct, label) => {
        if (!controller.signal.aborted) setProgress({ pct, label });
      }, controller.signal);
      if (controller.signal.aborted) return;
      setReport(result);
      setStatus("done");
      pushHistory(result.domain, nowMs());
    } catch {
      if (controller.signal.aborted) return;
      setStatus("error");
      setError(
        `We couldn't fetch reliable data for "${normalized.domain}". The site may block automated requests or the domain may not be reachable. Try again or pick another site.`
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || status === "running") return;
    void analyze(query);
  };

  const suggestions = showSuggestions && query
    ? history.filter((h) => h.domain.includes(query.toLowerCase().trim())).slice(0, 5)
    : [];

  const toggleFavorite = (domain: string) => {
    persistHistory(history.map((h) => (h.domain === domain ? { ...h, favorite: !h.favorite } : h)));
  };

  const removeHistory = (domain: string) => {
    persistHistory(history.filter((h) => h.domain !== domain));
  };

  const clearHistory = () => persistHistory([]);

  /** Analyze a domain directly into a compare slot (0 or 1). */
  const analyzeIntoSlot = async (domain: string, slot: 0 | 1) => {
    const normalized = normalizeDomain(domain);
    const validationError = validateDomain(normalized.domain);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      setCompareSlot(null);
      return;
    }
    setCompareLoading(true);
    compareAbortRef.current?.abort();
    const slotController = new AbortController();
    compareAbortRef.current = slotController;
    try {
      const result = await runAnalysis(normalized.domain, normalized.url, undefined, slotController.signal);
      if (slotController.signal.aborted) return;
      setCompareReports((prev) => prev.map((r, i) => (i === slot ? result : r)) as (WebsiteReport | null)[]);
      pushHistory(result.domain, nowMs());
      setCompareSlot(slot === 0 ? 1 : null);
    } catch {
      if (slotController.signal.aborted) return;
      setError(
        `Could not analyze "${normalized.domain}" for comparison. The site may block automated requests.`
      );
      setCompareSlot(null);
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sticky search bar */}
      <div className="sticky top-16 z-30">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-surface/95 p-3 shadow-lg shadow-primary/5 backdrop-blur-xl sm:p-4"
        >
          <div className="relative flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Enter a domain — e.g. example.com"
                className="h-12 pl-10 text-base"
                aria-label="Website domain to analyze"
                inputMode="url"
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-40 mt-1.5 overflow-hidden rounded-xl border border-border bg-surface shadow-xl animate-scale-in">
                  {suggestions.map((item) => (
                    <li key={item.domain}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setQuery(item.domain);
                          setShowSuggestions(false);
                        }}
                        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
                      >
                        <Globe className="h-3.5 w-3.5 shrink-0" />
                        {item.domain}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={status === "running"}
              className="h-12 px-8 sm:w-auto"
            >
              {status === "running" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  Analyze
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          <div className="mt-3 hidden sm:block">
            <DisclaimerBanner />
          </div>
        </form>
      </div>

      {/* Pipeline progress */}
      {status === "running" && (
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              {currentStage(progress.pct)}
            </p>
            <span className="text-sm font-semibold text-primary">{progress.pct}%</span>
          </div>
          <div
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border"
            role="progressbar"
            aria-valuenow={progress.pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
          <ol className="mt-4 grid gap-2 text-xs text-text-muted sm:grid-cols-2">
            {PIPELINE.map((stage, index) => {
              const idx = stageIndex(progress.pct);
              const done = index < idx || progress.pct >= 100;
              const active = !done && index === idx;
              return (
                <li key={stage.label} className={cn("flex items-center gap-1.5", done && "text-success")}>
                  {done ? <Check className="h-3.5 w-3.5" /> : active ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span className="h-3.5 w-3.5 rounded-full border border-border" />}
                  {stage.label}
                </li>
              );
            })}
          </ol>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-border/60" />
            ))}
          </div>
        </section>
      )}

      {/* Error state */}
      {status === "error" && (
        <section className="rounded-2xl border border-error/30 bg-error-light/50 p-5 shadow-sm sm:p-6" role="alert">
          <p className="text-sm font-semibold text-error">Analysis failed</p>
          <p className="mt-1.5 text-sm text-text-secondary">{error}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => void analyze(query)}>
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setStatus("idle")}>
              Dismiss
            </Button>
          </div>
        </section>
      )}

      {/* Empty state */}
      {status === "idle" && (
        <section className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center shadow-sm sm:p-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light">
            <BarChart3 className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-text-primary">Estimate any website&apos;s traffic</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
            Enter a domain above and we&apos;ll analyze public SEO signals — meta tags, headings, robots.txt,
            sitemap, page size, images and more — to produce an estimated monthly &amp; yearly traffic report
            with scores, trends and recommendations.
          </p>
          <div className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-2 text-xs text-text-muted">
            {["No sign-up", "In your browser", "Free forever"].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1">
                <Sparkles className="h-3 w-3 text-primary" />
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Report dashboard */}
      {status === "done" && report && (
        <ReportDashboard
          report={report}
          isFavorite={history.some((h) => h.domain === report.domain && h.favorite)}
          onToggleFavorite={() => toggleFavorite(report.domain)}
          onCompare={() => setCompareSlot(0)}
        />
      )}

      {/* Compare view */}
      {(compareReports[0] || compareReports[1]) && (
        <CompareView
          reports={compareReports}
          onSelectSlot={(slot) => setCompareSlot(slot)}
          onClearSlot={(slot) =>
            setCompareReports((prev) => prev.map((r, i) => (i === slot ? null : r)) as (WebsiteReport | null)[])
          }
        />
      )}

      {compareLoading && (
        <div
          className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary"
          role="status"
        >
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Analyzing website for comparison…
        </div>
      )}

      {/* Compare picker */}
      {compareSlot !== null && (
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-text-primary">
              Compare — choose website {compareSlot + 1}
            </h2>
            <button
              type="button"
              onClick={() => {
                compareAbortRef.current?.abort();
                setCompareSlot(null);
              }}
              className="text-xs text-text-muted transition-colors hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {report && report.domain !== compareReports[0]?.domain && (
              <button
                type="button"
                onClick={() => {
                  setCompareReports((prev) =>
                    prev.map((r, i) => (i === compareSlot ? report : r)) as (WebsiteReport | null)[]
                  );
                  setCompareSlot(compareSlot === 0 ? 1 : null);
                }}
                className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary"
              >
                <span className="flex items-center gap-2 font-medium text-text-primary">
                  <Globe className="h-4 w-4 text-primary" />
                  {report.domain}
                  <span className="text-xs text-text-muted">(current report)</span>
                </span>
                <ArrowRight className="h-4 w-4 text-text-muted" />
              </button>
            )}
            {history
              .filter(
                (h) =>
                  h.domain !== report?.domain &&
                  h.domain !== compareReports[0]?.domain &&
                  h.domain !== compareReports[1]?.domain
              )
              .slice(0, 5)
              .map((item) => (
                <button
                  key={item.domain}
                  type="button"
                  onClick={() => void analyzeIntoSlot(item.domain, compareSlot)}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary"
                >
                  <span className="flex items-center gap-2 font-medium text-text-primary">
                    <Globe className="h-4 w-4 text-primary" />
                    {item.domain}
                  </span>
                  <ArrowRight className="h-4 w-4 text-text-muted" />
                </button>
              ))}
          </div>
          {report === null && history.length === 0 && (
            <p className="mt-2 text-sm text-text-muted">
              Analyze a website first so you can add it to the comparison.
            </p>
          )}
        </div>
      )}

      {/* History */}
      <HistoryPanel
        items={history}
        onSelect={(domain) => {
          setQuery(domain);
          void analyze(domain);
        }}
        onToggleFavorite={toggleFavorite}
        onRemove={removeHistory}
        onClear={clearHistory}
      />
    </div>
  );
}
