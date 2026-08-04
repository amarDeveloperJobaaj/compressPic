import type { MetadataRoute } from "next";
import { ALL_TOOLS } from "@/lib/tools";
import { CATEGORY_PAGES } from "@/lib/category-pages";
import { CONVERSION_PAIRS } from "@/features/converter/utils/pairs";
import {
  getCategories,
  getPublishedPosts,
  getTags,
} from "@/lib/blog/service";

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

  // Category landing pages — future categories in CATEGORY_PAGES appear automatically
  const categoryPageRoutes: MetadataRoute.Sitemap = CATEGORY_PAGES.map((category) => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Blog — every new category, tag and published post is included automatically
  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blogs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
  const categoryRoutes: MetadataRoute.Sitemap = getCategories().map((category) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));
  const tagRoutes: MetadataRoute.Sitemap = getTags().map((tag) => ({
    url: `${baseUrl}/blog/tag/${encodeURIComponent(tag.name.toLowerCase())}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));
  const postRoutes: MetadataRoute.Sitemap = getPublishedPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const blogRoutes: MetadataRoute.Sitemap = [
    ...blogIndex,
    ...categoryRoutes,
    ...tagRoutes,
    ...postRoutes,
  ];

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...toolRoutes,
    ...conversionRoutes,
    ...categoryPageRoutes,
    ...blogRoutes,
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
