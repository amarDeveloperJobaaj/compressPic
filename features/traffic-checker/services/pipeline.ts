"use client";

import type { Recommendation, SignalCheck, WebsiteReport } from "../types";
import {
  computeScores,
  detectTech,
  fetchDomainAgeYears,
  fetchSignals,
  parseDoc,
  wordCount,
} from "./analyzer";
import { estimateTraffic } from "./estimator";

/** Deterministic numeric seed from a domain string (for the trend model). */
function domainSeed(domain: string): number {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = (hash << 5) - hash + domain.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/* ------------------------------------------------------------------ */
/* Signal extraction                                                   */
/* ------------------------------------------------------------------ */

function buildChecks(
  html: string | null,
  robots: string | null,
  sitemap: string | null,
  domain: string,
  doc: Document | null
) {
  const seo: SignalCheck[] = [];
  const technical: SignalCheck[] = [];
  const performance: SignalCheck[] = [];
  const content: SignalCheck[] = [];

  if (!html || !doc) {
    seo.push({ label: "Page fetch", status: "fail", detail: "Could not retrieve the homepage HTML." });
    technical.push({ label: "robots.txt", status: "unknown" });
    technical.push({ label: "sitemap.xml", status: "unknown" });
    performance.push({ label: "Page size", status: "unknown" });
    content.push({ label: "Content", status: "unknown" });
    return { seo, technical, performance, content };
  }

  // --- SEO checks ---
  const title = doc.querySelector("title")?.textContent?.trim() ?? "";
  seo.push({
    label: "Title tag",
    status: title ? (title.length > 60 ? "warn" : "pass") : "fail",
    detail: title ? `${title.length} chars` : "Missing <title>",
  });

  const desc = doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "";
  seo.push({
    label: "Meta description",
    status: desc ? (desc.length > 160 ? "warn" : "pass") : "fail",
    detail: desc ? `${desc.length} chars` : "Missing meta description",
  });

  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
  seo.push({
    label: "Canonical URL",
    status: canonical ? "pass" : "fail",
    detail: canonical || "Missing canonical",
  });

  const h1s = doc.querySelectorAll("h1");
  seo.push({
    label: "Heading structure (H1)",
    status: h1s.length === 1 ? "pass" : h1s.length === 0 ? "fail" : "warn",
    detail: `${h1s.length} H1 found`,
  });

  const jsonLd = doc.querySelectorAll('script[type="application/ld+json"]').length;
  seo.push({
    label: "Structured data (JSON-LD)",
    status: jsonLd > 0 ? "pass" : "warn",
    detail: jsonLd > 0 ? `${jsonLd} blocks` : "None found — consider adding schema",
  });

  const og = doc.querySelectorAll('meta[property^="og:"]').length;
  seo.push({
    label: "Open Graph tags",
    status: og >= 3 ? "pass" : og > 0 ? "warn" : "fail",
    detail: `${og} OG tags`,
  });

  const tw = doc.querySelectorAll('meta[name^="twitter:"]').length;
  seo.push({
    label: "Twitter Cards",
    status: tw >= 2 ? "pass" : tw > 0 ? "warn" : "fail",
    detail: `${tw} Twitter tags`,
  });

  const noindex = (doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "").toLowerCase().includes("noindex");
  seo.push({
    label: "Indexability (no noindex)",
    status: noindex ? "fail" : "pass",
    detail: noindex ? "Page is blocked from indexing" : "Page is indexable",
  });

  // --- Technical checks ---
  technical.push({
    label: "HTTPS",
    status: "pass",
    detail: "Served over https",
  });

  technical.push({
    label: "robots.txt",
    status: robots ? (robots.includes("Disallow: /") && !robots.includes("Allow: /") ? "warn" : "pass") : "warn",
    detail: robots ? "Found robots.txt" : "Not found or unreachable",
  });

  technical.push({
    label: "sitemap.xml",
    status: sitemap ? "pass" : "warn",
    detail: sitemap ? "Found sitemap.xml" : "Not found or unreachable",
  });

  const viewport = doc.querySelector('meta[name="viewport"]');
  technical.push({
    label: "Viewport (mobile)",
    status: viewport ? "pass" : "fail",
    detail: viewport ? "Responsive viewport set" : "Missing viewport meta",
  });

  const charset = doc.querySelector('meta[charset]') || doc.querySelector('meta[http-equiv="Content-Type"]');
  technical.push({
    label: "Charset declaration",
    status: charset ? "pass" : "warn",
    detail: charset ? "Declared" : "Missing charset",
  });

  const favicon = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  technical.push({
    label: "Favicon",
    status: favicon ? "pass" : "warn",
    detail: favicon ? "Found" : "No favicon link",
  });

  // --- Performance checks ---
  const sizeKb = Math.round((new Blob([html]).size / 1024) * 10) / 10;
  performance.push({
    label: "Page size",
    status: sizeKb < 300 ? "pass" : sizeKb < 1500 ? "warn" : "fail",
    detail: `${sizeKb.toLocaleString()} KB`,
  });

  const images = Array.from(doc.querySelectorAll("img"));
  const withoutDimensions = images.filter((img) => !img.hasAttribute("width") && !img.hasAttribute("height")).length;
  performance.push({
    label: "Image dimensions",
    status: withoutDimensions === 0 ? "pass" : withoutDimensions < images.length / 2 ? "warn" : "fail",
    detail: `${withoutDimensions}/${images.length} images lack width/height`,
  });

  const lazyImages = images.filter((img) => img.getAttribute("loading") === "lazy" || img.getAttribute("loading") === "eager").length;
  performance.push({
    label: "Image lazy-loading",
    status: lazyImages > 0 ? "pass" : images.length > 3 ? "warn" : "pass",
    detail: `${lazyImages}/${images.length} images opt into loading behavior`,
  });

  const scripts = doc.querySelectorAll("script").length;
  performance.push({
    label: "Script count",
    status: scripts <= 15 ? "pass" : scripts <= 30 ? "warn" : "fail",
    detail: `${scripts} scripts`,
  });

  // --- Content / a11y checks ---
  const words = wordCount(doc);
  content.push({
    label: "Content volume",
    status: words >= 500 ? "pass" : words >= 150 ? "warn" : "fail",
    detail: `~${words.toLocaleString()} words`,
  });

  const imgsNoAlt = images.filter((img) => !img.getAttribute("alt")).length;
  content.push({
    label: "Image alt text",
    status: imgsNoAlt === 0 ? "pass" : imgsNoAlt < images.length / 2 ? "warn" : "fail",
    detail: `${imgsNoAlt}/${images.length} images missing alt`,
  });

  const internalLinks = Array.from(doc.querySelectorAll("a[href]")).filter((a) => {
    const href = a.getAttribute("href") ?? "";
    return href.startsWith("/") || href.startsWith(domain) || href.startsWith(`https://${domain}`);
  }).length;
  content.push({
    label: "Internal linking",
    status: internalLinks >= 10 ? "pass" : internalLinks >= 3 ? "warn" : "fail",
    detail: `${internalLinks} internal links`,
  });

  return { seo, technical, performance, content };
}

/* ------------------------------------------------------------------ */
/* Recommendations                                                     */
/* ------------------------------------------------------------------ */

function buildRecommendations(checks: SignalCheck[], groups: ReturnType<typeof buildChecks>): Recommendation[] {
  const recs: Recommendation[] = [];
  const find = (label: string) => [...groups.seo, ...groups.technical, ...groups.performance, ...groups.content].find((c) => c.label === label);

  const title = find("Title tag");
  if (title?.status === "fail") recs.push({ severity: "high", title: "Add a page title", detail: "Every page needs a unique <title> tag — it's the most visible element in search results." });
  else if (title?.status === "warn") recs.push({ severity: "medium", title: "Shorten the page title", detail: "Titles over 60 characters get truncated in search results. Trim to 50–60 characters." });

  const desc = find("Meta description");
  if (desc?.status === "fail") recs.push({ severity: "high", title: "Add a meta description", detail: "Write a 150–160 character description that summarizes the page and includes a call to action." });
  else if (desc?.status === "warn") recs.push({ severity: "medium", title: "Tighten the meta description", detail: "Descriptions over 160 characters are cut off — keep yours under the limit." });

  const canonical = find("Canonical URL");
  if (canonical?.status === "fail") recs.push({ severity: "medium", title: "Add a canonical URL", detail: "A canonical tag prevents duplicate-content issues and consolidates ranking signals." });

  const jsonLd = find("Structured data (JSON-LD)");
  if (jsonLd?.status === "warn") recs.push({ severity: "medium", title: "Add structured data", detail: "Schema markup (JSON-LD) can earn rich results like stars, FAQs, and breadcrumbs." });

  const viewport = find("Viewport (mobile)");
  if (viewport?.status === "fail") recs.push({ severity: "high", title: "Add a viewport meta tag", detail: "Without a viewport meta tag, the page isn't mobile-friendly — a confirmed ranking factor." });

  const robots = find("robots.txt");
  if (robots?.status === "warn") recs.push({ severity: "low", title: "Add a robots.txt file", detail: "A robots.txt guides crawlers and can declare your sitemap location." });

  const sitemap = find("sitemap.xml");
  if (sitemap?.status === "warn") recs.push({ severity: "medium", title: "Add an XML sitemap", detail: "A sitemap helps search engines discover and crawl your pages faster." });

  const pageSize = find("Page size");
  if (pageSize?.status === "warn" || pageSize?.status === "fail") recs.push({ severity: "medium", title: "Reduce page size", detail: "Large pages load slowly, hurting Core Web Vitals and bounce rate. Compress images and lazy-load below the fold." });

  const alt = find("Image alt text");
  if (alt?.status === "warn" || alt?.status === "fail") recs.push({ severity: "medium", title: "Add image alt text", detail: "Alt text improves image SEO and accessibility for screen-reader users." });

  const links = find("Internal linking");
  if (links?.status === "warn" || links?.status === "fail") recs.push({ severity: "low", title: "Strengthen internal linking", detail: "More internal links help distribute authority and help users discover related content." });

  const h1 = find("Heading structure (H1)");
  if (h1?.status === "fail") recs.push({ severity: "high", title: "Add an H1 heading", detail: "Each page should have exactly one H1 that describes the main topic." });
  else if (h1?.status === "warn") recs.push({ severity: "low", title: "Use a single H1", detail: "Multiple H1s dilute the page's topic signal — keep one H1, use H2/H3 for sections." });

  return recs;
}

/* ------------------------------------------------------------------ */
/* Pipeline                                                            */
/* ------------------------------------------------------------------ */

/** Full analysis pipeline: fetch → extract → score → estimate → report. */
export async function analyzeWebsite(
  domain: string,
  url: string,
  onProgress?: (pct: number, label: string) => void,
  signal?: AbortSignal
): Promise<WebsiteReport> {
  onProgress?.(8, "Normalizing URL");
  onProgress?.(18, "Validating domain");
  onProgress?.(35, "Fetching public data");
  let fetched = 0;
  const agePromise = fetchDomainAgeYears(domain, signal);
  const { html, robots, sitemap } = await fetchSignals(
    url,
    () => {
      fetched += 1;
      const pct = [45, 58, 70][Math.min(fetched - 1, 2)];
      onProgress?.(pct, `Fetching public data (${fetched}/3)`);
    },
    signal
  );
  const domainAgeYears = await agePromise;
  const doc = html ? parseDoc(html) : null;

  onProgress?.(78, "Analyzing SEO signals");
  const groups = buildChecks(html, robots, sitemap, domain, doc);
  const allChecks = [...groups.seo, ...groups.technical, ...groups.performance, ...groups.content];
  const knownChecks = allChecks.filter((c) => c.status !== "unknown").length;
  const scores = computeScores(groups);

  // Domain age is a soft authority signal — folded into the estimate, never claimed as exact.
  const traffic = estimateTraffic({
    scores,
    knownChecks,
    totalChecks: allChecks.length,
    domainSeed: domainSeed(domain),
    domainAgeYears,
  });

  onProgress?.(90, "Scoring & estimating traffic");
  const recommendations = buildRecommendations(allChecks, groups);

  const sizeKb = html ? Math.round((new Blob([html]).size / 1024) * 10) / 10 : 0;
  const images = doc ? doc.querySelectorAll("img").length : 0;
  const internalLinks = doc
    ? Array.from(doc.querySelectorAll("a[href]")).filter((a) => {
        const href = a.getAttribute("href") ?? "";
        return href.startsWith("/") || href.startsWith(domain) || href.startsWith(`https://${domain}`);
      }).length
    : 0;
  const externalLinks = doc
    ? Array.from(doc.querySelectorAll("a[href]")).filter((a) => {
        const href = a.getAttribute("href") ?? "";
        return /^https?:\/\//.test(href) && !href.startsWith(`https://${domain}`) && !href.startsWith(`http://${domain}`);
      }).length
    : 0;

  onProgress?.(100, "Generating report");
  return {
    domain,
    url,
    analyzedAt: Date.now(),
    checks: allChecks,
    groups,
    scores,
    traffic,
    recommendations,
    tech: html ? detectTech(html) : [],
    meta: {
      title: doc?.querySelector("title")?.textContent?.trim() || undefined,
      description: doc?.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || undefined,
      pageSizeKb: sizeKb,
      wordCount: doc ? wordCount(doc) : 0,
      imageCount: images,
      internalLinks,
      externalLinks,
      indexedPages: "unknown",
      backlinks: "unknown",
    },
  };
}
