"use client";

import { ScanSearch } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { MetaTagAnalyzerTool } from "@/features/seo-tools/tools/MetaTagAnalyzerTool";

export default function MetaTagAnalyzerPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={ScanSearch}
          title="Meta Tag Analyzer"
          description="Audit any page's meta tags — title, description, canonical, Open Graph, Twitter Cards, and structured data — with an SEO score and actionable fixes."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <MetaTagAnalyzerTool />
        </div>
      </div>
    </PageTransition>
  );
}
