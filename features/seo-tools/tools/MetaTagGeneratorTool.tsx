"use client";

import { useMemo, useState } from "react";
import { Copy, Download, Globe, Lightbulb } from "lucide-react";
import { ToolPanel } from "@/features/devtools/components/ToolPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CodeOutput } from "@/features/devtools/components/CodeOutput";
import { copyToClipboard, downloadText } from "@/features/devtools/utils/download";
import { escapeXml } from "../utils/seo";
import { cn } from "@/lib/utils";

interface MetaFields {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  robots: string;
  viewport: boolean;
  author: string;
  language: string;
  themeColor: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogSiteName: string;
  twCard: string;
  twTitle: string;
  twDescription: string;
  twImage: string;
  manifestUrl: string;
  appleMeta: boolean;
}

const DEFAULT_FIELDS: MetaFields = {
  title: "Meta Tag Generator — Free Online SEO Tool",
  description:
    "Generate complete, SEO-optimized meta tags with a live SERP preview and SEO score. Open Graph, Twitter Cards, canonical, robots — all in your browser.",
  keywords: "meta tag generator, seo meta tags, generate meta tags",
  canonical: "https://vizotool.com/meta-tag-generator",
  robots: "index, follow",
  viewport: true,
  author: "Vizo Tool",
  language: "en",
  themeColor: "#2563EB",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogType: "website",
  ogSiteName: "Vizo Tool",
  twCard: "summary_large_image",
  twTitle: "",
  twDescription: "",
  twImage: "",
  manifestUrl: "/manifest.json",
  appleMeta: true,
};

/** Build the meta tag HTML from the current form fields. */
function buildMetaHtml(f: MetaFields): string {
  const lines: string[] = [
    `  <title>${escapeXml(f.title)}</title>`,
    `  <meta name="description" content="${escapeXml(f.description)}" />`,
  ];
  if (f.keywords) lines.push(`  <meta name="keywords" content="${escapeXml(f.keywords)}" />`);
  if (f.robots) lines.push(`  <meta name="robots" content="${escapeXml(f.robots)}" />`);
  if (f.viewport) lines.push(`  <meta name="viewport" content="width=device-width, initial-scale=1" />`);
  if (f.author) lines.push(`  <meta name="author" content="${escapeXml(f.author)}" />`);
  if (f.language) lines.push(`  <meta http-equiv="content-language" content="${escapeXml(f.language)}" />`);
  if (f.themeColor) lines.push(`  <meta name="theme-color" content="${escapeXml(f.themeColor)}" />`);
  if (f.appleMeta) {
    lines.push(`  <meta name="apple-mobile-web-app-capable" content="yes" />`);
    lines.push(`  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />`);
  }
  if (f.manifestUrl) lines.push(`  <link rel="manifest" href="${escapeXml(f.manifestUrl)}" />`);
  if (f.canonical) lines.push(`  <link rel="canonical" href="${escapeXml(f.canonical)}" />`);

  lines.push("");
  lines.push(`  <!-- Open Graph -->`);
  lines.push(`  <meta property="og:title" content="${escapeXml(f.ogTitle || f.title)}" />`);
  lines.push(`  <meta property="og:description" content="${escapeXml(f.ogDescription || f.description)}" />`);
  if (f.ogImage) lines.push(`  <meta property="og:image" content="${escapeXml(f.ogImage)}" />`);
  if (f.canonical) lines.push(`  <meta property="og:url" content="${escapeXml(f.canonical)}" />`);
  lines.push(`  <meta property="og:type" content="${escapeXml(f.ogType)}" />`);
  if (f.ogSiteName) lines.push(`  <meta property="og:site_name" content="${escapeXml(f.ogSiteName)}" />`);

  lines.push("");
  lines.push(`  <!-- Twitter Card -->`);
  lines.push(`  <meta name="twitter:card" content="${escapeXml(f.twCard)}" />`);
  lines.push(`  <meta name="twitter:title" content="${escapeXml(f.twTitle || f.title)}" />`);
  lines.push(`  <meta name="twitter:description" content="${escapeXml(f.twDescription || f.description)}" />`);
  if (f.twImage) lines.push(`  <meta name="twitter:image" content="${escapeXml(f.twImage)}" />`);

  return `<head>\n${lines.join("\n")}\n</head>`;
}

/** Simple 0–100 SEO score based on title/description length and presence. */
function scoreMeta(f: MetaFields): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;

  if (!f.title) {
    issues.push("Title is missing — add a title tag.");
    score -= 30;
  } else if (f.title.length > 60) {
    issues.push(`Title is ${f.title.length} chars — Google truncates titles past ~60 chars.`);
    score -= 15;
  } else if (f.title.length < 30) {
    issues.push("Title is short — aim for 30–60 characters for a fuller, more relevant snippet.");
    score -= 5;
  }

  if (!f.description) {
    issues.push("Meta description is missing — add a compelling 150–160 char summary.");
    score -= 25;
  } else if (f.description.length > 160) {
    issues.push(`Description is ${f.description.length} chars — Google truncates around 160 chars.`);
    score -= 10;
  } else if (f.description.length < 70) {
    issues.push("Description is thin — use 70–160 characters to describe the page fully.");
    score -= 5;
  }

  if (!f.canonical) {
    issues.push("Canonical URL is missing — helps prevent duplicate-content issues.");
    score -= 10;
  }
  if (!f.ogImage) {
    issues.push("og:image is missing — social shares will show no preview image.");
    score -= 10;
  }
  if (!f.ogTitle && f.title) {
    issues.push("og:title falls back to the title tag — consider an explicit og:title for social control.");
    score -= 5;
  }
  if (!f.robots) {
    issues.push("Robots directive missing — defaults to index,follow, which is usually fine.");
    score -= 5;
  }

  return { score: Math.max(0, score), issues };
}

function domainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function MetaTagGeneratorTool() {
  const [fields, setFields] = useState<MetaFields>(DEFAULT_FIELDS);
  const set = (key: keyof MetaFields, value: string | boolean) =>
    setFields((f) => ({ ...f, [key]: value }));

  const metaHtml = useMemo(() => buildMetaHtml(fields), [fields]);
  const { score, issues } = useMemo(() => scoreMeta(fields), [fields]);

  const syncSocialTitles = () =>
    setFields((f) => ({
      ...f,
      ogTitle: f.ogTitle || f.title,
      ogDescription: f.ogDescription || f.description,
      twTitle: f.twTitle || f.title,
      twDescription: f.twDescription || f.description,
    }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form — min-w-0 so the panel can shrink on mobile (grid items default
          to min-width:auto, which would let long code lines blow out the page) */}
      <ToolPanel className="min-w-0" title="Page Details" description="Fill in your page information — the tags update live.">
        <div className="space-y-4">
          <Input label="Page Title" value={fields.title} onChange={(e) => set("title", e.target.value)} maxLength={70} />
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
          <Input label="Keywords" value={fields.keywords} onChange={(e) => set("keywords", e.target.value)} placeholder="keyword1, keyword2" />
          <Input label="Canonical URL" value={fields.canonical} onChange={(e) => set("canonical", e.target.value)} placeholder="https://example.com/page" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Robots" value={fields.robots} onChange={(e) => set("robots", e.target.value)} placeholder="index, follow" />
            <Input label="Author" value={fields.author} onChange={(e) => set("author", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Language" value={fields.language} onChange={(e) => set("language", e.target.value)} placeholder="en" />
            <Input label="Theme Color" type="color" value={fields.themeColor} onChange={(e) => set("themeColor", e.target.value)} className="h-10" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Manifest URL" value={fields.manifestUrl} onChange={(e) => set("manifestUrl", e.target.value)} placeholder="/manifest.json" />
            <label className="flex items-end gap-2 pb-2.5 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={fields.appleMeta}
                onChange={(e) => set("appleMeta", e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Apple mobile-web meta
            </label>
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-3 text-sm font-semibold text-text-primary">Open Graph</p>
            <div className="space-y-4">
              <Input label="OG Title (optional)" value={fields.ogTitle} onChange={(e) => set("ogTitle", e.target.value)} placeholder={`Defaults to "${fields.title.slice(0, 30)}…"`} />
              <Input label="OG Description (optional)" value={fields.ogDescription} onChange={(e) => set("ogDescription", e.target.value)} />
              <Input label="OG Image URL" value={fields.ogImage} onChange={(e) => set("ogImage", e.target.value)} placeholder="https://example.com/share.jpg" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="OG Type" value={fields.ogType} onChange={(e) => set("ogType", e.target.value)} placeholder="website" />
                <Input label="Site Name" value={fields.ogSiteName} onChange={(e) => set("ogSiteName", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-3 text-sm font-semibold text-text-primary">Twitter Card</p>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Card Type" value={fields.twCard} onChange={(e) => set("twCard", e.target.value)} placeholder="summary_large_image" />
                <Input label="Twitter Image URL" value={fields.twImage} onChange={(e) => set("twImage", e.target.value)} placeholder="https://example.com/tw.jpg" />
              </div>
            </div>
          </div>
        </div>
      </ToolPanel>

      {/* Preview + output — min-w-0 lets the code block scroll inside instead of widening the page */}
      <div className="min-w-0 space-y-6">
        {/* Live SERP preview */}
        <ToolPanel title="Live SERP Preview" description="How Google renders your title & description right now.">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              <Globe className="h-3.5 w-3.5" />
              {domainFromUrl(fields.canonical) || "your-site.com"}
            </p>
            <p className="mt-1 cursor-pointer truncate text-[18px] leading-snug text-[#1a0dab] hover:underline dark:text-[#8ab4f8]">
              {fields.title || "Your page title appears here"}
            </p>
            <p className="mt-1 cursor-pointer text-sm text-[#006621] dark:text-[#9fc080]">
              {domainFromUrl(fields.canonical) || "https://your-site.com/page"}
              <span className="text-text-muted"> › {domainFromUrl(fields.canonical) ? "Page" : ""}</span>
            </p>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              {fields.description || "Your meta description appears here — write a compelling 150–160 character summary of the page."}
            </p>
          </div>

          {/* SEO score */}
          <div className="mt-4 rounded-xl border border-border bg-background p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text-primary">SEO Score</p>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-bold",
                  score >= 80 ? "bg-success-light text-success" : score >= 50 ? "bg-warning/20 text-warning" : "bg-error-light text-error"
                )}
              >
                {score}/100
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  score >= 80 ? "bg-success" : score >= 50 ? "bg-warning" : "bg-error"
                )}
                style={{ width: `${score}%` }}
              />
            </div>
            {issues.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {issues.map((issue) => (
                  <li key={issue} className="flex items-start gap-2 text-xs text-text-secondary">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                    {issue}
                  </li>
                ))}
              </ul>
            )}
            {issues.length === 0 && (
              <p className="mt-3 text-xs text-success">All checks passed — your meta tags look great!</p>
            )}
          </div>
        </ToolPanel>

        {/* Generated HTML */}
        <ToolPanel
          title="Generated Meta Tags"
          description="Copy this <head> block into your CMS or template."
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(metaHtml)}>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => downloadText("meta-tags.html", metaHtml, "text/html")}>
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </>
          }
        >
          <CodeOutput text={metaHtml} title="Meta Tags HTML" filename="meta-tags.html" mime="text/html" previewClass="max-h-96" />
          <button
            type="button"
            onClick={syncSocialTitles}
            className="mt-3 text-xs font-medium text-primary transition-colors hover:underline"
          >
            Sync OG &amp; Twitter titles from page title
          </button>
        </ToolPanel>
      </div>
    </div>
  );
}
