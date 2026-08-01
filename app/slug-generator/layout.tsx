import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Slug Generator — Create SEO-Friendly URL Slugs Free",
  description:
    "Turn any headline into a clean, lowercase, SEO-friendly URL slug. Unicode transliteration, stop-word removal, custom separators, and live preview. 100% free.",
  path: "/slug-generator",
  keywords: ["slug generator", "url slug", "seo slug", "clean urls", "url friendly text"],
});

export default function SlugGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "SEO Tools" }, { label: "Slug Generator", href: "/slug-generator" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="slug-generator" />
    </>
  );
}
