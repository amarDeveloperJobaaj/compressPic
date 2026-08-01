"use client";

import { useMemo, useState } from "react";
import { Copy, Download, FileText, ShieldCheck, ShieldAlert } from "lucide-react";
import { ToolPanel } from "@/features/devtools/components/ToolPanel";
import { Button } from "@/components/ui/button";
import { CodeOutput } from "@/features/devtools/components/CodeOutput";
import { copyToClipboard, downloadText } from "@/features/devtools/utils/download";
import { buildSitemap, validateXml, type SitemapUrl } from "../utils/seo";
import { cn } from "@/lib/utils";

const EXAMPLE_URLS = `https://compresspix.com
https://compresspix.com/compress
https://compresspix.com/resize
https://compresspix.com/flip`;

/** Capture today's date once on mount (lazy initializer — no impure render). */
const todayIso = () => new Date().toISOString().slice(0, 10);

interface ParsedLine {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  newsTitle?: string;
}

function parseUrlLines(input: string): ParsedLine[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      // Split off an optional per-URL news title: "url lastmod changefreq priority | Headline"
      const [urlAndMeta, ...titleParts] = line.split("|");
      const newsTitle = titleParts.join("|").trim() || undefined;
      const parts = urlAndMeta.split(/[\s,]+/);
      const loc = parts[0] ?? "";
      const lastmod = /^\d{4}-\d{2}-\d{2}$/.test(parts[1] ?? "") ? parts[1] : undefined;
      const changefreq = parts[2];
      const priority = parts[3];
      return { loc, lastmod, changefreq, priority, newsTitle };
    });
}

export function SitemapGeneratorTool() {
  const [urlsInput, setUrlsInput] = useState(EXAMPLE_URLS);
  const [imageInput, setImageInput] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoThumb, setVideoThumb] = useState("");
  const [includeImages, setIncludeImages] = useState(false);
  const [includeVideos, setIncludeVideos] = useState(false);
  const [asIndex, setAsIndex] = useState(false);
  const [includeNews, setIncludeNews] = useState(false);
  const [newsPublication, setNewsPublication] = useState("CompressPix");
  const [newsLanguage, setNewsLanguage] = useState("en");
  const [newsTitle, setNewsTitle] = useState("");
  const [newsDate] = useState(todayIso);

  const parsed = useMemo(() => parseUrlLines(urlsInput), [urlsInput]);

  const sitemapUrl = useMemo(() => {
    const urls: SitemapUrl[] = parsed.map((p) => ({
      loc: p.loc,
      lastmod: p.lastmod,
      changefreq: p.changefreq,
      priority: p.priority,
      newsTitle: p.newsTitle,
    }));
    const images = includeImages
      ? imageInput
          .split("\n")
          .map((u) => u.trim())
          .filter((u) => u.startsWith("http"))
          .map((url) => ({ url }))
      : [];
    const videos = includeVideos && videoThumb && videoTitle && videoDescription
      ? [{ thumbnail: videoThumb.trim(), title: videoTitle.trim(), description: videoDescription.trim() }]
      : [];
    const news =
      includeNews &&
      newsPublication.trim() &&
      (newsTitle.trim() || parsed.some((p) => p.newsTitle))
        ? {
            publication: newsPublication.trim(),
            language: newsLanguage.trim() || "en",
            date: newsDate,
            title: newsTitle.trim(),
          }
        : undefined;
    return buildSitemap(urls, { images, videos, index: asIndex, news });
  }, [parsed, imageInput, includeImages, includeVideos, videoTitle, videoDescription, videoThumb, asIndex, includeNews, newsPublication, newsLanguage, newsTitle, newsDate]);

  const xmlError = useMemo(() => validateXml(sitemapUrl), [sitemapUrl]);
  const valid = xmlError === null && parsed.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Builder */}
      <div className="space-y-6">
        <ToolPanel title="Page URLs" description="One URL per line. Optionally append: lastmod changefreq priority">
          <textarea
            value={urlsInput}
            onChange={(e) => setUrlsInput(e.target.value)}
            rows={10}
            spellCheck={false}
            placeholder={"https://example.com\nhttps://example.com/about 2026-08-01 monthly 0.8"}
            className="w-full resize-y rounded-xl border border-border bg-surface p-4 font-mono text-[13px] leading-relaxed text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          <p className="mt-2 text-xs text-text-muted">
            Format: <code className="rounded bg-background px-1.5 py-0.5">url</code> or{" "}
            <code className="rounded bg-background px-1.5 py-0.5">url 2026-08-01 monthly 0.8</code>
            {includeNews && (
              <>
                {" "}· for unique news headlines use{" "}
                <code className="rounded bg-background px-1.5 py-0.5">url|Headline</code>
              </>
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" checked={asIndex} onChange={(e) => setAsIndex(e.target.checked)} className="h-4 w-4 accent-primary" />
              Generate sitemap index
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" checked={includeImages} onChange={(e) => setIncludeImages(e.target.checked)} className="h-4 w-4 accent-primary" />
              Add image entries
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" checked={includeVideos} onChange={(e) => setIncludeVideos(e.target.checked)} className="h-4 w-4 accent-primary" />
              Add video entry
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" checked={includeNews} onChange={(e) => setIncludeNews(e.target.checked)} className="h-4 w-4 accent-primary" />
              Add Google News entry
            </label>
          </div>
        </ToolPanel>

        {includeImages && (
          <ToolPanel title="Image Entries" description="One image URL per line — attached to every page.">
            <textarea
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              rows={4}
              spellCheck={false}
              placeholder="https://example.com/images/hero.jpg"
              className="w-full resize-y rounded-xl border border-border bg-surface p-4 font-mono text-[13px] leading-relaxed text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </ToolPanel>
        )}

        {includeNews && (
          <ToolPanel title="News Entry" description="Google News sitemap — publication, language, and default title. Add url|Headline per line for unique article titles; the date is auto-set to today.">
            <div className="space-y-3">
              <input
                type="text"
                value={newsPublication}
                onChange={(e) => setNewsPublication(e.target.value)}
                placeholder="Publication name"
                className="h-10 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={newsLanguage}
                  onChange={(e) => setNewsLanguage(e.target.value)}
                  placeholder="Language code (en)"
                  className="h-10 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
                <input
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="News title"
                  className="h-10 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
            </div>
          </ToolPanel>
        )}

        {includeVideos && (
          <ToolPanel title="Video Entry" description="One video entry attached to every page.">
            <div className="space-y-3">
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Video title"
                className="h-10 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              <input
                type="text"
                value={videoThumb}
                onChange={(e) => setVideoThumb(e.target.value)}
                placeholder="Thumbnail URL"
                className="h-10 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              <textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                rows={2}
                placeholder="Video description"
                className="w-full resize-y rounded-xl border border-border bg-surface p-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          </ToolPanel>
        )}
      </div>

      {/* Output */}
      <ToolPanel
        title="Generated Sitemap"
        description="Valid XML ready to upload to your site root."
        actions={
          <>
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                valid ? "bg-success-light text-success" : "bg-error-light text-error"
              )}
            >
              {valid ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
              {valid ? "Valid XML" : xmlError ?? "Add at least one URL"}
            </span>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(sitemapUrl)}>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={() => downloadText("sitemap.xml", sitemapUrl, "application/xml")}>
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </>
        }
      >
        <div className="mb-3 flex items-center gap-1.5 text-xs text-text-muted">
          <FileText className="h-3.5 w-3.5" />
          {parsed.length} URL{parsed.length === 1 ? "" : "s"} ·{" "}
          {new Blob([sitemapUrl]).size.toLocaleString()} bytes
        </div>
        <CodeOutput text={sitemapUrl} title="sitemap.xml" filename="sitemap.xml" mime="application/xml" previewClass="max-h-[420px]" />
      </ToolPanel>
    </div>
  );
}
