import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Heading Checker — Audit H1-H6 Structure & Hierarchy Free",
  description:
    "Check your page's H1-H6 heading structure — missing H1s, skipped levels, and duplicate headings. Visual heading tree with SEO and accessibility suggestions. Free.",
  path: "/heading-checker",
  keywords: ["heading checker", "h1 checker", "heading structure", "h1 h2 h3 audit", "seo headings"],
});

export default function HeadingCheckerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "SEO Tools" }, { label: "Heading Checker", href: "/heading-checker" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="heading-checker" />
    </>
  );
}
