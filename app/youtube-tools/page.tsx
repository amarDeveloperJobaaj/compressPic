import type { Metadata } from "next";
import { getCategoryPage } from "@/lib/category-pages";
import { buildCategoryMetadata } from "@/lib/category-meta";
import { CategoryLanding } from "@/components/category/CategoryLanding";

export const metadata: Metadata = buildCategoryMetadata("youtube-tools");

export default function YoutubeToolsPage() {
  const category = getCategoryPage("youtube-tools")!;
  return <CategoryLanding category={category} />;
}
