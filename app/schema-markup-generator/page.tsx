"use client";

import { FileJson } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { SchemaMarkupGeneratorTool } from "@/features/seo-tools/tools/SchemaMarkupGeneratorTool";

export default function SchemaMarkupGeneratorPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={FileJson}
          title="Schema Markup Generator"
          description="Generate valid JSON-LD structured data for 15+ schema.org types — Article, FAQ, Product, HowTo, Event, and more — with built-in validation."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <SchemaMarkupGeneratorTool />
        </div>
      </div>
    </PageTransition>
  );
}
