"use client";

import { useState } from "react";
import { Loader2, ScanSearch, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { ToolPanel } from "@/features/devtools/components/ToolPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchUrlHtml, parseHtml } from "../utils/seo";
import { cn } from "@/lib/utils";

interface TagInfo {
  present: boolean;
  value?: string;
  count: number;
  duplicate?: boolean;
}

interface AnalysisResult {
  title: TagInfo;
  description: TagInfo;
  canonical: TagInfo;
  robots: TagInfo;
  viewport: TagInfo;
  charset: TagInfo;
  ogTags: { tag: string; value: string }[];
  twitterTags: { tag: string; value: string }[];
  schemas: { type: string }[];
  missing: string[];
  issues: string[];
  score: number;
}

function analyzeHtml(html: string): AnalysisResult {
  const doc = parseHtml(html);

  const get = (selector: string): TagInfo => {
    const nodes = Array.from(doc.querySelectorAll(selector));
    return {
      present: nodes.length > 0,
      value: nodes[0]?.getAttribute("content") || nodes[0]?.getAttribute("href") || nodes[0]?.textContent?.slice(0, 160) || undefined,
      count: nodes.length,
      duplicate: nodes.length > 1,
    };
  };

  const title = get("title");
  const description = get('meta[name="description"]');
  const canonical = get('link[rel="canonical"]');
  const robots = get('meta[name="robots"]');
  const viewport = get('meta[name="viewport"]');
  const charset = { present: !!doc.querySelector('meta[charset], meta[http-equiv="Content-Type"]'), count: 1, duplicate: false };

  const ogTags = Array.from(doc.querySelectorAll('meta[property^="og:"]')).map((el) => ({
    tag: el.getAttribute("property") ?? "",
    value: el.getAttribute("content") ?? "",
  }));
  const twitterTags = Array.from(doc.querySelectorAll('meta[name^="twitter:"]')).map((el) => ({
    tag: el.getAttribute("name") ?? "",
    value: el.getAttribute("content") ?? "",
  }));

  const schemas = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'))
    .map((el) => {
      try {
        const parsed = JSON.parse(el.textContent ?? "{}");
        const t = Array.isArray(parsed) ? parsed[0]?.["@type"] : parsed["@type"];
        return { type: Array.isArray(t) ? t.join(", ") : String(t ?? "Unknown") };
      } catch {
        return { type: "Invalid JSON" };
      }
    })
    .filter((s) => s.type !== "Unknown");

  const missing: string[] = [];
  if (!title.present) missing.push("meta title");
  if (!description.present) missing.push("meta description");
  if (!canonical.present) missing.push("canonical URL");
  if (ogTags.length === 0) missing.push("Open Graph tags");
  if (twitterTags.length === 0) missing.push("Twitter Card tags");
  if (!viewport.present) missing.push("viewport meta");
  if (!charset.present) missing.push("charset declaration");

  const issues: string[] = [];
  if (title.present && (title.value?.length ?? 0) > 60) issues.push("Title exceeds 60 characters and may be truncated.");
  if (description.present && (description.value?.length ?? 0) > 160) issues.push("Meta description exceeds 160 characters and may be truncated.");
  if (title.duplicate) issues.push("Duplicate <title> tags found.");
  if (description.duplicate) issues.push("Duplicate meta description tags found.");
  if (robots.present && robots.value?.includes("noindex")) issues.push("Robots directive contains noindex — page won't be indexed.");
  if (ogTags.length > 0 && !ogTags.some((t) => t.tag === "og:image")) issues.push("og:image missing — social shares will lack a preview image.");
  if (schemas.length === 0) issues.push("No JSON-LD structured data found.");

  // Weighted score: start 100, subtract for missing/issue categories
  let score = 100;
  if (!title.present) score -= 25;
  if (!description.present) score -= 20;
  if (!canonical.present) score -= 15;
  if (ogTags.length === 0) score -= 10;
  if (twitterTags.length === 0) score -= 5;
  if (!viewport.present) score -= 5;
  if (schemas.length === 0) score -= 5;
  score -= issues.length * 3;
  score = Math.max(0, Math.min(100, score));

  return {
    title,
    description,
    canonical,
    robots,
    viewport,
    charset,
    ogTags,
    twitterTags,
    schemas,
    missing,
    issues,
    score,
  };
}

function TagRow({ label, info }: { label: string; info: TagInfo }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {info.value && <p className="mt-0.5 break-all text-xs text-text-muted">{info.value}</p>}
      </div>
      <span
        className={cn(
          "flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
          info.present ? "bg-success-light text-success" : "bg-error-light text-error"
        )}
      >
        {info.present ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
        {info.present ? (info.duplicate ? `×${info.count} duplicate` : "Found") : "Missing"}
      </span>
    </div>
  );
}

export function MetaTagAnalyzerTool() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async (source: "url" | "html") => {
    setError(null);
    setResult(null);
    if (source === "url") {
      if (!/^https?:\/\//.test(url.trim())) {
        setError("Enter a valid URL starting with http:// or https://");
        return;
      }
      setLoading(true);
      try {
        const fetched = await fetchUrlHtml(url);
        setResult(analyzeHtml(fetched));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch the page. Try pasting the HTML source instead.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!html.trim()) {
        setError("Paste some HTML source to analyze.");
        return;
      }
      try {
        setResult(analyzeHtml(html));
      } catch {
        setError("Could not parse the HTML — is it valid markup?");
      }
    }
  };

  return (
    <div className="space-y-6">
      <ToolPanel title="Analyze a Page" description="Enter a URL to fetch it, or paste raw HTML source.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            label="Page URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/page"
          />
          <Button
            className="sm:mt-6"
            onClick={() => runAnalysis("url")}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
            Analyze URL
          </Button>
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <label className="mb-1.5 block text-sm font-medium text-text-primary">…or paste HTML source</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={6}
            spellCheck={false}
            placeholder="<html><head><title>…</title>…</head>…"
            className="w-full resize-y rounded-xl border border-border bg-surface p-4 font-mono text-[13px] leading-relaxed text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          <Button variant="secondary" className="mt-3" onClick={() => runAnalysis("html")}>
            Analyze HTML
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
          Fetching and analyzing the page…
        </p>
      )}

      {result && (
        <>
          <ToolPanel title="SEO Score">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold",
                  result.score >= 80 ? "bg-success-light text-success" : result.score >= 50 ? "bg-warning/20 text-warning" : "bg-error-light text-error"
                )}
              >
                {result.score}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">
                  {result.score >= 80 ? "Great on-page SEO" : result.score >= 50 ? "Needs improvement" : "Critical issues found"}
                </p>
                <p className="text-xs text-text-muted">
                  {result.missing.length} missing tag{result.missing.length === 1 ? "" : "s"} · {result.issues.length} issue
                  {result.issues.length === 1 ? "" : "s"} · {result.schemas.length} structured data block
                  {result.schemas.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {result.missing.length > 0 && (
              <p className="mt-4 rounded-lg border border-error/20 bg-error-light px-3 py-2 text-sm text-error">
                Missing: {result.missing.join(", ")}
              </p>
            )}
            {result.issues.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {result.issues.map((issue) => (
                  <li key={issue} className="flex items-start gap-2 text-xs text-warning">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            )}
            {result.missing.length === 0 && result.issues.length === 0 && (
              <p className="mt-3 text-xs text-success">No missing or duplicate tags — this page is well optimized.</p>
            )}
          </ToolPanel>

          <ToolPanel title="Essential Tags">
            <div className="space-y-2">
              <TagRow label="Title" info={result.title} />
              <TagRow label="Meta description" info={result.description} />
              <TagRow label="Canonical" info={result.canonical} />
              <TagRow label="Robots" info={result.robots} />
              <TagRow label="Viewport" info={result.viewport} />
              <TagRow label="Charset" info={result.charset} />
            </div>
          </ToolPanel>

          <div className="grid gap-6 lg:grid-cols-2">
            <ToolPanel title={`Open Graph (${result.ogTags.length})`}>
              {result.ogTags.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-text-muted">No OG tags found.</p>
              ) : (
                <ul className="space-y-1.5">
                  {result.ogTags.map((t) => (
                    <li key={t.tag} className="flex items-start justify-between gap-2 rounded-lg bg-background px-3 py-1.5 text-xs">
                      <code className="shrink-0 text-primary">{t.tag}</code>
                      <span className="min-w-0 flex-1 break-all text-right text-text-secondary">{t.value || "(empty)"}</span>
                    </li>
                  ))}
                </ul>
              )}
            </ToolPanel>
            <ToolPanel title={`Twitter Cards (${result.twitterTags.length})`}>
              {result.twitterTags.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-text-muted">No Twitter tags found.</p>
              ) : (
                <ul className="space-y-1.5">
                  {result.twitterTags.map((t) => (
                    <li key={t.tag} className="flex items-start justify-between gap-2 rounded-lg bg-background px-3 py-1.5 text-xs">
                      <code className="shrink-0 text-primary">{t.tag}</code>
                      <span className="min-w-0 flex-1 break-all text-right text-text-secondary">{t.value || "(empty)"}</span>
                    </li>
                  ))}
                </ul>
              )}
            </ToolPanel>
          </div>

          <ToolPanel title={`Structured Data (${result.schemas.length})`}>
            {result.schemas.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-text-muted">
                No JSON-LD found — add structured data with our Schema Markup Generator.
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {result.schemas.map((s) => (
                  <li key={s.type} className="rounded-full border border-primary/30 bg-primary-light/30 px-3 py-1 text-xs font-medium text-primary">
                    {s.type}
                  </li>
                ))}
              </ul>
            )}
          </ToolPanel>
        </>
      )}
    </div>
  );
}
