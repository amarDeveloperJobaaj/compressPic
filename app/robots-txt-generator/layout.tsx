import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Robots.txt Generator — Create Crawler Rules Online Free",
  description:
    "Build a clean, valid robots.txt with allow/disallow rules, sitemap, host, and crawl delay. Real-time syntax validation, copy & download. 100% free, in your browser.",
  path: "/robots-txt-generator",
  keywords: ["robots.txt generator", "robots txt", "seo robots", "crawl rules", "disallow rules"],
});

export default function RobotsTxtGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "SEO Tools" }, { label: "Robots.txt Generator", href: "/robots-txt-generator" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="robots-txt-generator" />
    </>
  );
}
