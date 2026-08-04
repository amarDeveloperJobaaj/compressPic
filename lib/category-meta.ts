import type { Metadata } from "next";
import { getCategoryPage } from "./category-pages";
import { buildMetadata } from "./seo";

/** Build unique Metadata for a category landing page from its config entry. */
export function buildCategoryMetadata(slug: string): Metadata {
  const category = getCategoryPage(slug);
  if (!category) return {};
  return buildMetadata({
    title: category.metaTitle,
    description: category.metaDescription,
    path: `/${category.slug}`,
    keywords: category.keywords,
  });
}
