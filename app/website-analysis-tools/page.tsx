import type { Metadata } from "next";
import { getCategoryPage } from "@/lib/category-pages";
import { buildCategoryMetadata } from "@/lib/category-meta";
import { CategoryLanding } from "@/components/category/CategoryLanding";

export const metadata: Metadata = buildCategoryMetadata("website-analysis-tools");

export default function WebsiteAnalysisToolsPage() {
  const category = getCategoryPage("website-analysis-tools")!;
  return <CategoryLanding category={category} />;
}
