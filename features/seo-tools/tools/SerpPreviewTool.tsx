"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Smartphone, Monitor, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ToolPanel } from "@/features/devtools/components/ToolPanel";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const TITLE_LIMIT_DESKTOP = 60;
const TITLE_LIMIT_MOBILE = 55;
const DESC_LIMIT = 155;

interface SerpFields {
  title: string;
  description: string;
  url: string;
  breadcrumb: string;
  keyword: string;
}

const DEFAULTS: SerpFields = {
  title: "Meta Tag Generator — Free Online SEO Tool",
  description:
    "Generate complete, SEO-optimized meta tags with a live SERP preview and SEO score. Open Graph, Twitter Cards, canonical, robots — all in your browser.",
  url: "https://vizotool.com/meta-tag-generator",
  breadcrumb: "Vizo Tool › SEO Tools",
  keyword: "meta tag generator",
};

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightKeyword(text: string, keyword: string): ReactNode {
  if (!keyword.trim() || !text) return text;
  const pattern = `(${escapeRegExp(keyword)})`;
  const parts = text.split(new RegExp(pattern, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={i} className="rounded bg-yellow-200/70 px-0.5 text-inherit dark:bg-yellow-500/30">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

interface Score {
  titleScore: number;
  descScore: number;
  titleNote: string;
  descNote: string;
}

function scoreSnippet(f: SerpFields): Score {
  const t = f.title.length;
  const d = f.description.length;

  let titleScore = 100;
  let titleNote = "Title length looks great.";
  if (!f.title) {
    titleScore = 0;
    titleNote = "Title is empty — add a title tag.";
  } else if (t > TITLE_LIMIT_DESKTOP) {
    titleScore = 50;
    titleNote = `Title is ${t} chars — will be truncated on desktop (>${TITLE_LIMIT_DESKTOP}).`;
  } else if (t > TITLE_LIMIT_MOBILE) {
    titleScore = 75;
    titleNote = `Title is ${t} chars — may truncate on mobile (>${TITLE_LIMIT_MOBILE}).`;
  } else if (t < 25) {
    titleScore = 85;
    titleNote = "Title is short — consider adding more context (25–60 chars ideal).";
  }

  let descScore = 100;
  let descNote = "Description length looks great.";
  if (!f.description) {
    descScore = 0;
    descNote = "Description is empty — write a 120–155 char summary.";
  } else if (d > DESC_LIMIT) {
    descScore = 50;
    descNote = `Description is ${d} chars — will be truncated past ~${DESC_LIMIT} chars.`;
  } else if (d < 70) {
    descScore = 80;
    descNote = "Description is thin — use 120–155 characters for best CTR.";
  }

  return { titleScore, descScore, titleNote, descNote };
}

function ctrSuggestion(f: SerpFields): string {
  const tips: string[] = [];
  if (f.keyword && !f.title.toLowerCase().includes(f.keyword.toLowerCase())) {
    tips.push("Include your target keyword in the title.");
  }
  if (!f.title.toLowerCase().includes("free") && !f.title.toLowerCase().includes("guide") && !f.title.toLowerCase().includes("how to")) {
    tips.push("Front-load value words like 'free', 'how to', or a number.");
  }
  if (f.description.length < 100) {
    tips.push("Expand the description with a benefit and a call to action.");
  }
  return tips[0] ?? "Your snippet is well optimized for clicks.";
}

export function SerpPreviewTool() {
  const [fields, setFields] = useState<SerpFields>(DEFAULTS);
  const set = (key: keyof SerpFields, value: string) =>
    setFields((f) => ({ ...f, [key]: value }));

  const { titleScore, descScore, titleNote, descNote } = useMemo(() => scoreSnippet(fields), [fields]);
  const ctrTip = useMemo(() => ctrSuggestion(fields), [fields]);

  const displayUrl = fields.breadcrumb || fields.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || "example.com";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Inputs */}
      <ToolPanel title="Snippet Details" description="Enter your title, description, URL, and target keyword.">
        <div className="space-y-4">
          <Input label="Page Title" value={fields.title} onChange={(e) => set("title", e.target.value)} maxLength={80} />
          <Input label="Keyword (for highlighting)" value={fields.keyword} onChange={(e) => set("keyword", e.target.value)} placeholder="your target keyword" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Meta Description</label>
            <textarea
              value={fields.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              maxLength={200}
              className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="URL" value={fields.url} onChange={(e) => set("url", e.target.value)} placeholder="https://example.com/page" />
            <Input label="Breadcrumb (optional)" value={fields.breadcrumb} onChange={(e) => set("breadcrumb", e.target.value)} placeholder="Home › Category › Page" />
          </div>

          {/* Scores */}
          <div className="space-y-3 border-t border-border pt-4">
            <ScoreRow label="Title" score={titleScore} note={titleNote} count={fields.title.length} limit={TITLE_LIMIT_DESKTOP} />
            <ScoreRow label="Description" score={descScore} note={descNote} count={fields.description.length} limit={DESC_LIMIT} />
            <p className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary-light/30 px-4 py-3 text-xs text-text-secondary">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              {ctrTip}
            </p>
          </div>
        </div>
      </ToolPanel>

      {/* Previews — min-w-0 lets panels shrink instead of overflowing on mobile */}
      <div className="min-w-0 space-y-6">
        {/* Desktop */}
        <ToolPanel title="Desktop Preview" description="Google desktop results — ~600px content width.">
          <div className="rounded-xl border border-border bg-background p-5">
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              <Monitor className="h-3.5 w-3.5" />
              {fields.title.length} chars · truncates after {TITLE_LIMIT_DESKTOP}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-xs font-bold text-white">
                {displayUrl.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[14px] leading-tight text-text-secondary">{displayUrl}</p>
                <p className="truncate text-xs text-text-muted">{fields.url || "https://example.com"}</p>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 cursor-pointer text-[20px] font-normal leading-snug text-[#1a0dab] hover:underline dark:text-[#8ab4f8]">
              {highlightKeyword(fields.title, fields.keyword) || "Your title appears here"}
            </p>
            <p className="mt-1 line-clamp-2 cursor-pointer text-sm leading-relaxed text-text-secondary">
              {highlightKeyword(fields.description, fields.keyword) || "Your meta description appears here."}
            </p>
          </div>
        </ToolPanel>

        {/* Mobile */}
        <ToolPanel title="Mobile Preview" description="Google mobile results — narrow viewport truncates sooner.">
          <div className="rounded-xl border border-border bg-background p-5">
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              <Smartphone className="h-3.5 w-3.5" />
              {fields.title.length} chars · truncates after {TITLE_LIMIT_MOBILE}
            </p>
            <div className="mx-auto mt-3 max-w-[360px] rounded-2xl border border-border bg-surface p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-[10px] font-bold text-white">
                  {displayUrl.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs text-text-secondary">{displayUrl}</p>
                  <p className="truncate text-[10px] text-text-muted">{fields.url || "https://example.com"}</p>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 cursor-pointer text-[16px] font-normal leading-snug text-[#1a0dab] hover:underline dark:text-[#8ab4f8]">
                {highlightKeyword(fields.title, fields.keyword) || "Your title appears here"}
              </p>
              <p className="mt-1 line-clamp-3 cursor-pointer text-[13px] leading-relaxed text-text-secondary">
                {highlightKeyword(fields.description, fields.keyword) || "Your meta description appears here."}
              </p>
            </div>
          </div>
        </ToolPanel>
      </div>
    </div>
  );
}

function ScoreRow({
  label,
  score,
  note,
  count,
  limit,
}: {
  label: string;
  score: number;
  note: string;
  count: number;
  limit: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-text-primary">{label}</span>
        <span className={cn("flex items-center gap-1.5 text-xs font-semibold", score >= 80 ? "text-success" : score >= 50 ? "text-warning" : "text-error")}>
          {score >= 80 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
          {score}/100 · {count} chars
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className={cn("h-full rounded-full transition-all", score >= 80 ? "bg-success" : score >= 50 ? "bg-warning" : "bg-error")}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-text-muted">
        {note} Limit: {limit} chars
      </p>
    </div>
  );
}
