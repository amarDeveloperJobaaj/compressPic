import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Schema Markup Generator — Valid JSON-LD Structured Data Free",
  description:
    "Generate valid JSON-LD schema markup for 15+ types — Article, FAQ, Product, HowTo, Event, LocalBusiness, and more. Built-in JSON validation, copy & download. 100% free.",
  path: "/schema-markup-generator",
  keywords: ["schema generator", "json-ld generator", "structured data generator", "schema markup", "rich results"],
});

export default function SchemaMarkupGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "SEO Tools" }, { label: "Schema Markup Generator", href: "/schema-markup-generator" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="schema-markup-generator" />
    </>
  );
}
