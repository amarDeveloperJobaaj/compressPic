"use client";

import { useState } from "react";
import { Loader2, ScanSearch, AlertTriangle, CheckCircle2, ListTree } from "lucide-react";
import { ToolPanel } from "@/features/devtools/components/ToolPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchUrlHtml, parseHtml } from "../utils/seo";
import { cn } from "@/lib/utils";

interface HeadingEntry {
  level: number;
  text: string;
}

interface HeadingReport {
  headings: HeadingEntry[];
  missing: string[];
  issues: string[];
  score: number;
}

function analyzeHeadings(html: string): HeadingReport {
  const doc = parseHtml(html);
  const headings: HeadingEntry[] = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"))
    .map((el) => ({
      level: Number(el.tagName.slice(1)),
      text: (el.textContent ?? "").trim().slice(0, 120),
    }))
    .filter((h) => h.text.length > 0);

  const missing: string[] = [];
  const issues: string[] = [];

  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count === 0) missing.push("H1 heading");
  else if (h1Count > 1) issues.push(`Found ${h1Count} H1 headings — use exactly one H1 per page.`);

  // Check for skipped levels
  let expected = 1;
  for (const h of headings) {
    if (h.level > expected + 1) {
      issues.push(`Skipped heading level: H${expected} → H${h.level} ("${h.text}").`);
    }
    expected = Math.max(expected, h.level);
  }

  // Duplicate headings
  const seen = new Map<string, number>();
  for (const h of headings) {
    const key = `${h.level}:${h.text.toLowerCase()}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  for (const [key, count] of seen) {
    if (count > 1) {
      const [level, text] = key.split(":");
      issues.push(`Duplicate H${level}: "${text}" appears ${count} times.`);
    }
  }

  // Score
  let score = 100;
  if (h1Count === 0) score -= 25;
  if (h1Count > 1) score -= 15;
  score -= issues.length * 5;
  if (headings.length === 0) score = 0;
  score = Math.max(0, Math.min(100, score));

  return { headings, missing, issues, score };
}

function HeadingTree({ headings }: { headings: HeadingEntry[] }) {
  return (
    <ul className="space-y-1">
      {headings.map((h, i) => (
        // Indent caps at 54px so deep H5/H6 rows don't overflow on phones;
        // the text span gets min-w-0 flex-1 so it truncates, never wraps wide.
        <li
          key={`${h.level}-${i}`}
          className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5"
          style={{ marginLeft: Math.min((h.level - 1) * 18, 54) }}
        >
          <span
            className={cn(
              "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold",
              h.level === 1 ? "bg-primary-light text-primary" : "bg-surface text-text-muted"
            )}
          >
            H{h.level}
          </span>
          <span className="min-w-0 flex-1 truncate text-xs text-text-secondary" title={h.text}>
            {h.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function HeadingCheckerTool() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [report, setReport] = useState<HeadingReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runCheck = async (source: "url" | "html") => {
    setError(null);
    setReport(null);
    if (source === "url") {
      if (!/^https?:\/\//.test(url.trim())) {
        setError("Enter a valid URL starting with http:// or https://");
        return;
      }
      setLoading(true);
      try {
        const fetched = await fetchUrlHtml(url);
        setReport(analyzeHeadings(fetched));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch the page. Try pasting the HTML source instead.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!html.trim()) {
        setError("Paste some HTML source to check.");
        return;
      }
      try {
        setReport(analyzeHeadings(html));
      } catch {
        setError("Could not parse the HTML — is it valid markup?");
      }
    }
  };

  const headingCount = report?.headings.length ?? 0;

  return (
    <div className="space-y-6">
      <ToolPanel title="Check a Page" description="Enter a URL to fetch it, or paste raw HTML source.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            label="Page URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/page"
          />
          <Button
            className="sm:mt-6"
            onClick={() => runCheck("url")}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
            Check URL
          </Button>
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <label className="mb-1.5 block text-sm font-medium text-text-primary">…or paste HTML source</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={6}
            spellCheck={false}
            placeholder="<h1>Title</h1><h2>Section</h2>…"
            className="w-full resize-y rounded-xl border border-border bg-surface p-4 font-mono text-[13px] leading-relaxed text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          <Button variant="secondary" className="mt-3" onClick={() => runCheck("html")}>
            Check HTML
          </Button>
        </div>
        {error && (
          <p className="mt-3 flex items-center gap-2 rounded-lg border border-error/20 bg-error-light px-3 py-2 text-sm text-error" role="alert">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}
      </ToolPanel>

      {loading && (
        <p className="flex items-center justify-center gap-2 py-8 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Fetching and analyzing headings…
        </p>
      )}

      {report && (
        <>
          <ToolPanel title="Heading Structure Score">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold",
                  report.score >= 80 ? "bg-success-light text-success" : report.score >= 50 ? "bg-warning/20 text-warning" : "bg-error-light text-error"
                )}
              >
                {report.score}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">
                  {report.score >= 80 ? "Clean heading hierarchy" : report.score >= 50 ? "Needs attention" : "Major issues found"}
                </p>
                <p className="text-xs text-text-muted">
                  {headingCount} heading{headingCount === 1 ? "" : "s"} · {report.missing.length} missing · {report.issues.length} issue
                  {report.issues.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {report.missing.length > 0 && (
              <p className="mt-4 rounded-lg border border-error/20 bg-error-light px-3 py-2 text-sm text-error">
                Missing: {report.missing.join(", ")}
              </p>
            )}
            {report.issues.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {report.issues.map((issue) => (
                  <li key={issue} className="flex items-start gap-2 text-xs text-warning">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            )}
            {report.missing.length === 0 && report.issues.length === 0 && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Perfect — one H1, no skipped levels, no duplicates.
              </p>
            )}
          </ToolPanel>

          <ToolPanel
            title="Heading Tree"
            description="The full H1–H6 structure in document order."
            actions={
              <span className="flex items-center gap-1.5 text-xs text-text-muted">
                <ListTree className="h-3.5 w-3.5" />
                {headingCount} nodes
              </span>
            }
          >
            {headingCount === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-text-muted">
                No headings found in the provided content.
              </p>
            ) : (
              <HeadingTree headings={report.headings} />
            )}
          </ToolPanel>
        </>
      )}
    </div>
  );
}
