"use client";

import { Network } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { SitemapGeneratorTool } from "@/features/seo-tools/tools/SitemapGeneratorTool";

export default function SitemapGeneratorPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Network}
          title="Sitemap Generator"
          description="Build a valid XML sitemap from your URL list — with lastmod, priority, image and video entries — and download a search-ready sitemap.xml."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <SitemapGeneratorTool />
        </div>
      </div>
    </PageTransition>
  );
}
