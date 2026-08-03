import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow all search engines (Google, Bing, Yahoo, DuckDuckGo, Yandex,
    // Baidu, ...) — every route on the site is intentionally indexable.
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [], // no private/admin routes exist
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
