"use client";

import { Tags } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { MetaTagGeneratorTool } from "@/features/seo-tools/tools/MetaTagGeneratorTool";

export default function MetaTagGeneratorPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Tags}
          title="Meta Tag Generator"
          description="Create complete, SEO-optimized meta tags with a live SERP preview and SEO score. Open Graph, Twitter Cards, canonical, robots — all in your browser."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <MetaTagGeneratorTool />
        </div>
      </div>
    </PageTransition>
  );
}
