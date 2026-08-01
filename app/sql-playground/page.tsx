"use client";

import { Database } from "lucide-react";
import dynamic from "next/dynamic";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";

// sql.js + Monaco are heavy — load the tool lazily.
const SqlPlaygroundTool = dynamic(
  () =>
    import("@/features/playground/tools/sql/SqlPlaygroundTool").then((m) => ({
      default: m.SqlPlaygroundTool,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-text-muted">Loading SQLite engine…</p>
        </div>
      </div>
    ),
  }
);

export default function SqlPlaygroundPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Database}
          title="SQL Playground"
          description="Write and run real SQLite queries in your browser. Load sample databases, import CSV or .db files, and inspect results in a sortable grid — no backend, fully private."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <SqlPlaygroundTool />
        </div>
      </div>
    </PageTransition>
  );
}
