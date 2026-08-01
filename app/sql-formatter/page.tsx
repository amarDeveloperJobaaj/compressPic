"use client";

import { Database } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { SqlFormatterTool } from "@/features/devtools/tools/SqlFormatterTool";

export default function SqlFormatterPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Database}
          title="SQL Formatter"
          description="Beautify or minify SQL with syntax highlighting and 12+ dialect support. Private, fast, and free."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <SqlFormatterTool />
        </div>
      </div>
    </PageTransition>
  );
}
