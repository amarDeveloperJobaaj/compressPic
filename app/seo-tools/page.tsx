import type { Metadata } from "next";
import { getCategoryPage } from "@/lib/category-pages";
import { buildCategoryMetadata } from "@/lib/category-meta";
import { CategoryLanding } from "@/components/category/CategoryLanding";

export const metadata: Metadata = buildCategoryMetadata("seo-tools");

export default function SeoToolsPage() {
  const category = getCategoryPage("seo-tools")!;
  return <CategoryLanding category={category} />;
}
