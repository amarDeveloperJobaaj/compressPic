import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "SQL Playground — Run SQLite Queries Online Free",
  description:
    "Run real SQLite queries in your browser. Load sample databases, import CSV or .db files, explore results in a sortable grid, and export — 100% free and private.",
  path: "/sql-playground",
  keywords: ["sql playground", "sqlite online", "run sql online", "sqlite wasm", "sql query tool", "database playground"],
});

export default function SqlPlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Developer Tools" }, { label: "SQL Playground", href: "/sql-playground" }]}
      />
      {children}
      <AdSlot />
      <ToolSeoContent slug="sql-playground" />
    </>
  );
}
