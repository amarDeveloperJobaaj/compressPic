import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Meta Tag Generator — Create Perfect SEO Meta Tags Online Free",
  description:
    "Generate complete SEO meta tags with a live SERP preview and SEO score. Title, description, canonical, Open Graph, and Twitter Cards — 100% free, no sign-up, in your browser.",
  path: "/meta-tag-generator",
  keywords: ["meta tag generator", "generate meta tags", "seo meta tags", "meta description generator", "open graph generator"],
});

export default function MetaTagGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "SEO Tools" }, { label: "Meta Tag Generator", href: "/meta-tag-generator" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="meta-tag-generator" />
    </>
  );
}
