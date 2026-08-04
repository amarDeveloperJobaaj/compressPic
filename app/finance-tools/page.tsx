import type { Metadata } from "next";
import { getCategoryPage } from "@/lib/category-pages";
import { buildCategoryMetadata } from "@/lib/category-meta";
import { CategoryLanding } from "@/components/category/CategoryLanding";

export const metadata: Metadata = buildCategoryMetadata("finance-tools");

export default function FinanceToolsPage() {
  const category = getCategoryPage("finance-tools")!;
  return <CategoryLanding category={category} />;
}
