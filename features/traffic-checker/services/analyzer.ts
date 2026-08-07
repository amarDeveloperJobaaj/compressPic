"use client";

import type { SignalCheck, TechDetect, WebsiteScores } from "../types";

/* ------------------------------------------------------------------ */
/* URL normalization + validation                                      */
/* ------------------------------------------------------------------ */

/** Normalize a user-entered domain into { domain, url }. */
export function normalizeDomain(input: string): { domain: string; url: string } {
  let raw = input.trim().toLowerCase();
  raw = raw.replace(/^https?:\/\//, "").replace(/^www\./, "");
  raw = raw.split(/[/?#]/)[0];
  const domain = raw.replace(/\/+$/, "");
  return { domain, url: `https://${domain}` };
}

/** Validate a normalized domain. Returns an error message or null. */
export function validateDomain(domain: string): string | null {
  if (!domain) return "Enter a domain to analyze.";
  if (domain.length > 253) return "Domain is too long.";
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(domain)) {
    return "That doesn't look like a valid domain (e.g. example.com).";
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Fetching helpers                                                    */
/* ------------------------------------------------------------------ */

/**
 * Fetch raw text through our server-side fetcher first, falling back to a
 * chain of public CORS proxies — a single flaky proxy can no longer surface
 * as "Failed to fetch".
 *
 * Returns null on abort/timeout/non-OK so an AbortError ("signal is aborted
 * without reason") can never surface as an unhandled runtime error. The
 * external signal (if any) cancels in-flight requests so a superseded analysis
 * stops immediately instead of racing the current one.
 */
async function fetchViaProxy(url: string, external?: AbortSignal): Promise<string | null> {
  const controller = new AbortController();
  const onExternalAbort = () => controller.abort();
  if (external) {
    if (external.aborted) controller.abort();
    else external.addEventListener("abort", onExternalAbort, { once: true });
  }

  // Fetch one URL with its own timeout while honoring the shared controller
  // (external cancel or a superseded analysis). Never throws — returns null on
  // any failure so a timeout/abort can't surface as an unhandled rejection.
  const attempt = async (input: string): Promise<string | null> => {
    const attemptController = new AbortController();
    const timer = setTimeout(() => attemptController.abort(), 8000);
    const onAbort = () => attemptController.abort();
    if (controller.signal.aborted) attemptController.abort();
    else controller.signal.addEventListener("abort", onAbort, { once: true });
    try {
      const res = await fetch(input, { signal: attemptController.signal });
      if (!res.ok) return null;
      const text = await res.text();
      return text && text.length > 10 ? text : null;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
      controller.signal.removeEventListener("abort", onAbort);
    }
  };

  try {
    // 1) Server-side fetch via our API route (no CORS, follows redirects,
    //    browser UA). Validation failures (400) simply return null.
    const api = await attempt(`/api/fetch-url?url=${encodeURIComponent(url)}`);
    if (api) return api;

    // 2) Public CORS proxy chain (keeps the tool working on static hosting).
    const proxies = [
      (target: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
      (target: string) => `https://corsproxy.io/?url=${encodeURIComponent(target)}`,
    ];
    for (const build of proxies) {
      const text = await attempt(build(url));
      if (text) return text;
    }
    return null;
  } finally {
    external?.removeEventListener("abort", onExternalAbort);
  }
}

/** Best-effort fetch that never throws. */
async function tryFetch(url: string, signal?: AbortSignal): Promise<string | null> {
  try {
    return await fetchViaProxy(url, signal);
  } catch {
    return null;
  }
}

/** Estimate domain age in years from public RDAP registration data. */
export async function fetchDomainAgeYears(domain: string, external?: AbortSignal): Promise<number | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  const onExternalAbort = () => controller.abort();
  if (external) {
    if (external.aborted) controller.abort();
    else external.addEventListener("abort", onExternalAbort, { once: true });
  }
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, {
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    const events: { eventAction?: string; eventDate?: string }[] = data?.events ?? [];
    const registered = events.find((e) => e.eventAction === "registration");
    if (!registered?.eventDate) return null;
    const ageMs = Date.now() - new Date(registered.eventDate).getTime();
    if (ageMs <= 0) return null;
    return ageMs / (365.25 * 24 * 60 * 60 * 1000);
  } catch (err) {
    // Aborts (timeout or external cancel) are expected — treat as unknown age.
    if (err instanceof Error && err.name === "AbortError") return null;
    return null;
  } finally {
    clearTimeout(timer);
    external?.removeEventListener("abort", onExternalAbort);
  }
}

/* ------------------------------------------------------------------ */
/* HTML signal extraction                                              */
/* ------------------------------------------------------------------ */

function parseDoc(html: string): Document {
  return new DOMParser().parseFromString(html, "text/html");
}

function wordCount(doc: Document): number {
  const text = (doc.body?.textContent ?? "").replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
}

function detectTech(html: string): TechDetect[] {
  const tech: TechDetect[] = [];
  const rules: [RegExp, string, "high" | "medium" | "low"][] = [
    [new RegExp("wp-content|wp-includes|wordpress", "i"), "WordPress", "high"],
    [new RegExp("next\\s*\\.\\s*js|__NEXT_DATA__|/_next/", "i"), "Next.js", "high"],
    [new RegExp("__NUXT__|nuxt", "i"), "Nuxt.js", "medium"],
    [new RegExp("cdn\\.shopify\\.com|myshopify", "i"), "Shopify", "high"],
    [new RegExp("googletagmanager\\.com|gtm\\.js", "i"), "Google Tag Manager", "high"],
    [new RegExp("google-analytics\\.com|gtag/", "i"), "Google Analytics", "high"],
    [new RegExp("cloudflare|__cf_|cf-chl", "i"), "Cloudflare", "medium"],
    [new RegExp("react\\.js|react-dom|_reactroot", "i"), "React", "medium"],
    [new RegExp("jquery", "i"), "jQuery", "low"],
    [new RegExp("bootstrap", "i"), "Bootstrap", "low"],
    [new RegExp("tailwind", "i"), "Tailwind CSS", "low"],
  ];
  for (const [re, name, confidence] of rules) {
    if (re.test(html)) tech.push({ name, confidence });
  }
  return tech.slice(0, 8);
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

/** Combine checks into a 0–100 score: pass=100, warn=50, fail=0, unknown ignored. */
export function scoreChecks(checks: SignalCheck[]): number {
  const known = checks.filter((c) => c.status !== "unknown");
  if (known.length === 0) return 0;
  const total = known.reduce((sum, c) => sum + (c.status === "pass" ? 100 : c.status === "warn" ? 50 : 0), 0);
  return Math.round(total / known.length);
}

/** Compute all five-part scores plus health from the grouped checks. */
export function computeScores(groups: {
  seo: SignalCheck[];
  technical: SignalCheck[];
  performance: SignalCheck[];
  content: SignalCheck[];
}): WebsiteScores {
  const seo = scoreChecks(groups.seo);
  const technical = scoreChecks(groups.technical);
  const performance = scoreChecks(groups.performance);
  const accessibility = scoreChecks(groups.content); // content group carries a11y checks
  const content = scoreChecks(groups.content);

  // Mobile is derived from viewport + page size (both live in technical/performance).
  const mobileChecks: SignalCheck[] = [
    ...groups.technical.filter((c) => c.label.toLowerCase().includes("viewport")),
    ...groups.performance.filter((c) => c.label.toLowerCase().includes("page size")),
  ];
  const mobile = scoreChecks(mobileChecks);

  const bestPractices = Math.round(
    (seo * 0.2 + technical * 0.4 + performance * 0.4)
  );

  const health = Math.round(
    seo * 0.25 + technical * 0.2 + performance * 0.15 + accessibility * 0.15 + content * 0.1 + bestPractices * 0.1 + mobile * 0.05
  );

  return {
    seo,
    technical,
    performance,
    accessibility,
    bestPractices,
    content,
    mobile,
    health,
  };
}

/** Extract `Sitemap:` URLs declared inside a robots.txt body. */
function parseSitemapUrls(robotsText: string): string[] {
  const urls: string[] = [];
  for (const line of robotsText.split(/\r?\n/)) {
    const m = line.match(/^\s*Sitemap\s*:\s*(\S+)\s*$/i);
    if (m && /^https?:\/\//i.test(m[1])) urls.push(m[1]);
  }
  return urls;
}

/**
 * Public helper: fetch + extract raw signals for a domain.
 *
 * The sitemap is discovered the way real crawlers do it — `Sitemap:`
 * declarations inside robots.txt take priority, because many large sites
 * (Adobe, enterprise sites) never serve a sitemap at the canonical
 * `/sitemap.xml` path. `/sitemap.xml` is only a fallback.
 */
export async function fetchSignals(url: string, onSignal?: () => void, signal?: AbortSignal) {
  const html = await tryFetch(url, signal);
  onSignal?.();
  const robots = await tryFetch(`${url}/robots.txt`, signal);
  onSignal?.();

  // robots.txt declarations first (up to 2), then the canonical path.
  const declared = robots ? parseSitemapUrls(robots) : [];
  const candidates = [...new Set([...declared.slice(0, 2), `${url}/sitemap.xml`])];
  let sitemap: string | null = null;
  for (const candidate of candidates) {
    sitemap = await tryFetch(candidate, signal);
    if (sitemap) break;
  }
  onSignal?.();
  return { html, robots, sitemap };
}

export { parseDoc, wordCount, detectTech };
