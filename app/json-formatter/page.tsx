"use client";

import { Braces } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { JsonFormatterTool } from "@/features/devtools/tools/JsonFormatterTool";

export default function JsonFormatterPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Braces}
          title="JSON Formatter"
          description="Beautify, minify, validate, and explore JSON with a collapsible tree view. Everything stays in your browser."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <JsonFormatterTool />
        </div>
      </div>
    </PageTransition>
  );
}
