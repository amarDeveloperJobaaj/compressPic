"use client";

import { useMemo, useState } from "react";
import { Copy, Download, Facebook, Linkedin, Twitter } from "lucide-react";
import { ToolPanel } from "@/features/devtools/components/ToolPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CodeOutput } from "@/features/devtools/components/CodeOutput";
import { copyToClipboard, downloadText } from "@/features/devtools/utils/download";
import { escapeXml } from "../utils/seo";

interface OgFields {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  ogSiteName: string;
  twCard: string;
  twTitle: string;
  twDescription: string;
  twImage: string;
}

const DEFAULTS: OgFields = {
  ogTitle: "Open Graph Generator — Preview Social Shares",
  ogDescription:
    "Design your social share cards with live Facebook, LinkedIn, and X previews. Copy-ready Open Graph and Twitter tags.",
  ogImage: "https://compresspix.com/og?title=Open%20Graph%20Generator",
  ogUrl: "https://compresspix.com/open-graph-generator",
  ogType: "website",
  ogSiteName: "CompressPix",
  twCard: "summary_large_image",
  twTitle: "",
  twDescription: "",
  twImage: "",
};

function buildOgHtml(f: OgFields): string {
  const lines: string[] = [
    `  <!-- Open Graph -->`,
    `  <meta property="og:title" content="${escapeXml(f.ogTitle)}" />`,
    `  <meta property="og:description" content="${escapeXml(f.ogDescription)}" />`,
    `  <meta property="og:image" content="${escapeXml(f.ogImage)}" />`,
    `  <meta property="og:url" content="${escapeXml(f.ogUrl)}" />`,
    `  <meta property="og:type" content="${escapeXml(f.ogType)}" />`,
    `  <meta property="og:site_name" content="${escapeXml(f.ogSiteName)}" />`,
    ``,
    `  <!-- Twitter Card -->`,
    `  <meta name="twitter:card" content="${escapeXml(f.twCard)}" />`,
    `  <meta name="twitter:title" content="${escapeXml(f.twTitle || f.ogTitle)}" />`,
    `  <meta name="twitter:description" content="${escapeXml(f.twDescription || f.ogDescription)}" />`,
    `  <meta name="twitter:image" content="${escapeXml(f.twImage || f.ogImage)}" />`,
  ];
  return `<head>\n${lines.join("\n")}\n</head>`;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function imageSizeNote(url: string): string | null {
  if (!url) return "og:image is empty — add an image URL (1200×630 recommended).";
  if (!/^https?:\/\//.test(url)) return "Image URL should be absolute (start with https://).";
  return null;
}

export function OpenGraphGeneratorTool() {
  const [fields, setFields] = useState<OgFields>(DEFAULTS);
  const set = (key: keyof OgFields, value: string) =>
    setFields((f) => ({ ...f, [key]: value }));

  const html = useMemo(() => buildOgHtml(fields), [fields]);
  const imgNote = useMemo(() => imageSizeNote(fields.ogImage), [fields.ogImage]);
  const host = hostOf(fields.ogUrl) || "example.com";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form */}
      <ToolPanel title="Open Graph Settings" description="Fill in the share details — previews update live.">
        <div className="space-y-4">
          <Input label="OG Title" value={fields.ogTitle} onChange={(e) => set("ogTitle", e.target.value)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">OG Description</label>
            <textarea
              value={fields.ogDescription}
              onChange={(e) => set("ogDescription", e.target.value)}
              rows={3}
              className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>
          <Input label="OG Image URL" value={fields.ogImage} onChange={(e) => set("ogImage", e.target.value)} placeholder="https://example.com/share-1200x630.jpg" />
          {imgNote && <p className="text-xs text-warning">{imgNote}</p>}
          <Input label="OG URL" value={fields.ogUrl} onChange={(e) => set("ogUrl", e.target.value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="OG Type" value={fields.ogType} onChange={(e) => set("ogType", e.target.value)} />
            <Input label="Site Name" value={fields.ogSiteName} onChange={(e) => set("ogSiteName", e.target.value)} />
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-3 text-sm font-semibold text-text-primary">Twitter Card</p>
            <div className="space-y-4">
              <Input label="Card Type" value={fields.twCard} onChange={(e) => set("twCard", e.target.value)} placeholder="summary_large_image" />
              <Input label="Twitter Image URL (optional)" value={fields.twImage} onChange={(e) => set("twImage", e.target.value)} placeholder="Falls back to og:image" />
            </div>
          </div>
        </div>
      </ToolPanel>

      {/* Previews + output */}
      <div className="space-y-6">
        {/* Facebook preview */}
        <ToolPanel title="Facebook / WhatsApp Preview">
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            {fields.ogImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fields.ogImage} alt="OG preview" className="aspect-[1.91/1] w-full object-cover" />
            ) : (
              <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-surface text-xs text-text-muted">
                No image — add an og:image URL
              </div>
            )}
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">{host}</p>
              <p className="mt-1 line-clamp-1 font-semibold text-text-primary">{fields.ogTitle}</p>
              <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{fields.ogDescription}</p>
            </div>
          </div>
        </ToolPanel>

        {/* LinkedIn preview */}
        <ToolPanel title="LinkedIn Preview">
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <div className="p-4">
              <p className="text-xs text-text-muted">{fields.ogSiteName}</p>
              <p className="mt-1 line-clamp-2 font-semibold text-text-primary">{fields.ogTitle}</p>
              <p className="mt-1 line-clamp-3 text-sm text-text-secondary">{fields.ogDescription}</p>
            </div>
            {fields.ogImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fields.ogImage} alt="LinkedIn preview" className="aspect-[1.91/1] w-full object-cover" />
            ) : (
              <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-surface text-xs text-text-muted">
                No image
              </div>
            )}
          </div>
        </ToolPanel>

        {/* Twitter preview */}
        <ToolPanel title="X (Twitter) Preview">
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            {fields.twImage || fields.ogImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fields.twImage || fields.ogImage} alt="Twitter preview" className="aspect-[1.91/1] w-full object-cover" />
            ) : (
              <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-surface text-xs text-text-muted">
                No image
              </div>
            )}
            <div className="flex items-start gap-3 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                <Twitter className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">{fields.ogSiteName || "Your Handle"}</p>
                <p className="mt-1 text-sm text-text-secondary">{fields.ogTitle}</p>
                <p className="mt-1 text-xs text-text-muted">pic.twitter.com/example</p>
              </div>
            </div>
          </div>
        </ToolPanel>

        {/* Generated tags */}
        <ToolPanel
          title="Generated Meta Tags"
          description="Copy the Open Graph + Twitter block into your page head."
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(html)}>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => downloadText("open-graph.html", html, "text/html")}>
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </>
          }
        >
          <CodeOutput text={html} title="OG + Twitter Tags" filename="open-graph.html" mime="text/html" previewClass="max-h-72" />
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <Facebook className="h-3.5 w-3.5" />
            Verify with Facebook Sharing Debugger
            <span aria-hidden="true">·</span>
            <Linkedin className="h-3.5 w-3.5" />
            LinkedIn Post Inspector
          </div>
        </ToolPanel>
      </div>
    </div>
  );
}
