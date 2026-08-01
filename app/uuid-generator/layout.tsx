import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "UUID Generator — Generate v1, v4 & v7 UUIDs Online Free",
  description:
    "Generate UUID v1, v4, and v7 identifiers online for free. Bulk generation up to 10,000, copy all, and download as txt, csv, or json. 100% private.",
  path: "/uuid-generator",
  keywords: ["uuid generator", "uuid v4", "uuid v7", "generate uuid", "guid generator", "random uuid"],
});

export default function UuidGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Developer Tools" }, { label: "UUID Generator", href: "/uuid-generator" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="uuid-generator" />
    </>
  );
}
