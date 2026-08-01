import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Sitemap Generator — Create XML Sitemaps Online Free",
  description:
    "Create a valid XML sitemap with image and video entries in seconds. Paste your URLs, set lastmod and priority, validate, and download sitemap.xml. 100% free.",
  path: "/sitemap-generator",
  keywords: ["sitemap generator", "xml sitemap", "sitemap.xml", "image sitemap", "video sitemap", "seo sitemap"],
});

export default function SitemapGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "SEO Tools" }, { label: "Sitemap Generator", href: "/sitemap-generator" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="sitemap-generator" />
    </>
  );
}
