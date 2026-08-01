import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Meta Tag Analyzer — Audit SEO Tags & Get an SEO Score Free",
  description:
    "Analyze any page's meta tags — title, description, canonical, Open Graph, Twitter Cards, and structured data. Find missing and duplicate tags, get an SEO score and fixes. Free.",
  path: "/meta-tag-analyzer",
  keywords: ["meta tag analyzer", "seo analyzer", "meta tags checker", "seo audit", "meta tag audit"],
});

export default function MetaTagAnalyzerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "SEO Tools" }, { label: "Meta Tag Analyzer", href: "/meta-tag-analyzer" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="meta-tag-analyzer" />
    </>
  );
}
