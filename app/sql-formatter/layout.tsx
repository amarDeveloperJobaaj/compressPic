import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "SQL Formatter — Beautify & Minify SQL Queries Online Free",
  description:
    "Format SQL queries online for free. Beautify or minify SQL with syntax highlighting and 12+ dialect support. Copy or download the result. 100% private.",
  path: "/sql-formatter",
  keywords: ["sql formatter", "beautify sql", "sql beautifier", "format sql online", "sql pretty print", "sql minify"],
});

export default function SqlFormatterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Developer Tools" }, { label: "SQL Formatter", href: "/sql-formatter" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="sql-formatter" />
    </>
  );
}
