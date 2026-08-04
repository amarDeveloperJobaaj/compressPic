import type { Metadata } from "next";
import { getCategoryPage } from "@/lib/category-pages";
import { buildCategoryMetadata } from "@/lib/category-meta";
import { CategoryLanding } from "@/components/category/CategoryLanding";

export const metadata: Metadata = buildCategoryMetadata("image-tools");

export default function ImageToolsPage() {
  const category = getCategoryPage("image-tools")!;
  return <CategoryLanding category={category} />;
}
