import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Open Graph Generator — Live Social Share Previews Free",
  description:
    "Generate Open Graph and Twitter Card tags with live Facebook, LinkedIn, and X previews. Perfect social share images and descriptions — 100% free, in your browser.",
  path: "/open-graph-generator",
  keywords: ["open graph generator", "og tags generator", "social share preview", "twitter card generator", "facebook sharing"],
});

export default function OpenGraphGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "SEO Tools" }, { label: "Open Graph Generator", href: "/open-graph-generator" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="open-graph-generator" />
    </>
  );
}
