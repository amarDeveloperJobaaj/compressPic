import type { MetadataRoute } from "next";
import { ALL_TOOLS } from "@/lib/tools";
import { CONVERSION_PAIRS } from "@/features/converter/utils/pairs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vizotool.com";
  const now = new Date();

  // Tool pages stay in sync with the registry — new tools are indexed automatically
  const toolRoutes: MetadataRoute.Sitemap = ALL_TOOLS.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Dedicated conversion pages (jpg-to-png, heic-to-jpg, ...) — driven by the pairs registry
  const conversionRoutes: MetadataRoute.Sitemap = CONVERSION_PAIRS.map((pair) => ({
    url: `${baseUrl}/${pair.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...toolRoutes,
    ...conversionRoutes,
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
