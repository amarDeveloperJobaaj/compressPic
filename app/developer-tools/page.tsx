import type { Metadata } from "next";
import { getCategoryPage } from "@/lib/category-pages";
import { buildCategoryMetadata } from "@/lib/category-meta";
import { CategoryLanding } from "@/components/category/CategoryLanding";

export const metadata: Metadata = buildCategoryMetadata("developer-tools");

export default function DeveloperToolsPage() {
  const category = getCategoryPage("developer-tools")!;
  return <CategoryLanding category={category} />;
}
