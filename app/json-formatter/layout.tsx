import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "JSON Formatter — Beautify, Minify & Validate JSON Online Free",
  description:
    "Format and validate JSON online for free. Beautify, minify, and explore JSON with a tree view. Error line numbers included. 100% private, no uploads.",
  path: "/json-formatter",
  keywords: ["json formatter", "beautify json", "minify json", "json pretty print", "json validator", "format json online"],
});

export default function JsonFormatterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Developer Tools" }, { label: "JSON Formatter", href: "/json-formatter" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="json-formatter" />
    </>
  );
}
