import type { Metadata } from "next";
import { getCategoryPage } from "@/lib/category-pages";
import { buildCategoryMetadata } from "@/lib/category-meta";
import { CategoryLanding } from "@/components/category/CategoryLanding";

export const metadata: Metadata = buildCategoryMetadata("pdf-tools");

export default function PdfToolsPage() {
  const category = getCategoryPage("pdf-tools")!;
  return <CategoryLanding category={category} />;
}
