import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { ALL_TOOLS } from "@/lib/tools";
import { CONVERSION_PAIRS } from "@/features/converter/utils/pairs";

/**
 * Dynamic sitemap for vizotool.com.
 *
 * Everything is derived from the central registries (lib/tools.ts and the
 * conversion-pairs config), so new tools, finance calculators and YouTube
 * tools are indexed automatically — zero manual updates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Every tool across all categories (Image, PDF, Developer, SEO, Finance,
  // Website Analysis, YouTube) — driven by the tools registry
  const toolRoutes: MetadataRoute.Sitemap = ALL_TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Dedicated conversion routes (jpg-to-png, heic-to-jpg, ...)
  const conversionRoutes: MetadataRoute.Sitemap = CONVERSION_PAIRS.map((pair) => ({
    url: `${SITE_URL}/${pair.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const entries: MetadataRoute.Sitemap = [
    // Homepage — highest priority
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolRoutes,
    ...conversionRoutes,
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Hard guarantee: no URL may ever appear twice, even as the registries evolve.
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
