"use client";

/* ------------------------------------------------------------------ */
/* XML helpers                                                         */
/* ------------------------------------------------------------------ */

/** Escape a string for safe inclusion in XML/HTML text and attributes. */
export function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Best-effort XML well-formedness check. Returns an error message or null. */
export function validateXml(input: string): string | null {
  if (!input.trim()) return "XML is empty.";
  if (input.includes("<") === false) return "Not valid XML — missing markup.";
  // A tiny parser-lite sanity check: matching root tags and balanced braces for attributes
  const open = (input.match(/<\?/g) ?? []).length;
  const close = (input.match(/\?>/g) ?? []).length;
  if (open !== close) return "Unclosed XML declaration.";
  // Check for unescaped ampersands in text (rough heuristic)
  if (/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/.test(input)) {
    return "Unescaped '&' found — use &amp; instead.";
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Sitemap builder                                                     */
/* ------------------------------------------------------------------ */

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  /** Google News headline for this specific URL (overrides the shared news.title). */
  newsTitle?: string;
}

export interface SitemapOptions {
  images?: { url: string; title?: string; caption?: string }[];
  videos?: { thumbnail: string; title: string; description: string; duration?: number }[];
  /** Build a sitemapindex wrapper instead of a urlset. */
  index?: boolean;
  /** Google News sitemap settings. Per-URL headlines come from each SitemapUrl.newsTitle. */
  news?: {
    publication: string;
    language: string;
    date: string;
    title: string;
  };
}

const VALID_FREQ = new Set([
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
]);

/** Build an XML sitemap (or sitemap index) document from URL entries. */
export function buildSitemap(urls: SitemapUrl[], options: SitemapOptions = {}): string {
  const { images = [], videos = [], index = false, news } = options;

  if (index) {
    const entries = urls
      .map((u) => {
        const lastmod = u.lastmod ? `\n      <lastmod>${escapeXml(u.lastmod)}</lastmod>` : "";
        return `  <sitemap>\n      <loc>${escapeXml(u.loc)}</loc>${lastmod}\n    </sitemap>`;
      })
      .join("\n  ");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${entries}\n</sitemapindex>`;
  }

  const imageBlock =
    images.length > 0
      ? images
          .map((img) => {
            const title = img.title ? `\n        <image:title>${escapeXml(img.title)}</image:title>` : "";
            const caption = img.caption
              ? `\n        <image:caption>${escapeXml(img.caption)}</image:caption>`
              : "";
            return `\n      <image:image>\n        <image:loc>${escapeXml(img.url)}</image:loc>${title}${caption}\n      </image:image>`;
          })
          .join("")
      : "";

  const videoBlock =
    videos.length > 0
      ? videos
          .map((v) => {
            const duration = v.duration
              ? `\n        <video:duration>${v.duration}</video:duration>`
              : "";
            return `\n      <video:video>\n        <video:thumbnail_loc>${escapeXml(v.thumbnail)}</video:thumbnail_loc>\n        <video:title>${escapeXml(v.title)}</video:title>\n        <video:description>${escapeXml(v.description)}</video:description>${duration}\n      </video:video>`;
          })
          .join("")
      : "";

  const urlEntries = urls
    .map((u) => {
      const lastmod = u.lastmod ? `\n      <lastmod>${escapeXml(u.lastmod)}</lastmod>` : "";
      const changefreq =
        u.changefreq && VALID_FREQ.has(u.changefreq)
          ? `\n      <changefreq>${escapeXml(u.changefreq)}</changefreq>`
          : "";
      const priority =
        u.priority && /^(0(\.\d{1,2})?|1(\.0{1,2})?)$/.test(u.priority)
          ? `\n      <priority>${escapeXml(u.priority)}</priority>`
          : "";
      const newsBlock = news
        ? `\n      <news:news>\n        <news:publication>\n          <news:name>${escapeXml(news.publication)}</news:name>\n          <news:language>${escapeXml(news.language)}</news:language>\n        </news:publication>\n        <news:publication_date>${escapeXml(news.date)}</news:publication_date>\n        <news:title>${escapeXml(u.newsTitle ?? news.title)}</news:title>\n      </news:news>`
        : "";
      return `  <url>\n    <loc>${escapeXml(u.loc)}</loc>${lastmod}${changefreq}${priority}${newsBlock}${imageBlock}${videoBlock}\n  </url>`;
    })
    .join("\n  ");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${
    news ? '\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"' : ""
  }${
    images.length > 0 ? '\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : ""
  }${
    videos.length > 0 ? '\n        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"' : ""
  }>\n  ${urlEntries}\n</urlset>`;
}

/* ------------------------------------------------------------------ */
/* robots.txt builder                                                  */
/* ------------------------------------------------------------------ */

export interface RobotsRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
}

export interface RobotsOptions {
  rules: RobotsRule[];
  sitemap?: string;
  host?: string;
  crawlDelay?: string;
}

/** Build a robots.txt document from rule groups. */
export function buildRobotsTxt(options: RobotsOptions): string {
  const { rules, sitemap, host, crawlDelay } = options;
  const groups = rules
    .map((rule) => {
      const lines = [`User-agent: ${rule.userAgent}`];
      for (const path of rule.disallow) lines.push(`Disallow: ${path}`);
      for (const path of rule.allow) lines.push(`Allow: ${path}`);
      if (crawlDelay) lines.push(`Crawl-delay: ${crawlDelay}`);
      return lines.join("\n");
    })
    .join("\n\n");
  const sitemapLine = sitemap ? `\n\nSitemap: ${sitemap}` : "";
  const hostLine = host ? `\nHost: ${host}` : "";
  return `${groups}${sitemapLine}${hostLine}\n`;
}

/* ------------------------------------------------------------------ */
/* URL fetching via a public CORS proxy                                */
/* ------------------------------------------------------------------ */

/** Fetch the raw HTML of a URL through a public CORS proxy. */
export async function fetchUrlHtml(url: string): Promise<string> {
  const target = encodeURIComponent(url.trim());
  const res = await fetch(`https://api.allorigins.win/raw?url=${target}`);
  if (!res.ok) throw new Error(`Failed to fetch the page (HTTP ${res.status}).`);
  const text = await res.text();
  if (!text || text.length < 50) throw new Error("The page returned no readable content.");
  return text;
}

/** Parse an HTML string into a detached DOM (client-only). */
export function parseHtml(html: string): Document {
  return new DOMParser().parseFromString(html, "text/html");
}
