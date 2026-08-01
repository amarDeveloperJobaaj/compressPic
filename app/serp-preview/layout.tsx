import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "SERP Preview — See Your Google Result Before Publishing",
  description:
    "Preview your page's Google search result on desktop and mobile. Pixel-accurate truncation, title & description scores, keyword highlighting, and CTR tips. Free.",
  path: "/serp-preview",
  keywords: ["serp preview", "google snippet preview", "meta title preview", "search result preview", "seo snippet checker"],
});

export default function SerpPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "SEO Tools" }, { label: "SERP Preview", href: "/serp-preview" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="serp-preview" />
    </>
  );
}
