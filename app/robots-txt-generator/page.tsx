"use client";

import { Bot } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { RobotsTxtGeneratorTool } from "@/features/seo-tools/tools/RobotsTxtGeneratorTool";

export default function RobotsTxtGeneratorPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Bot}
          title="Robots.txt Generator"
          description="Build a clean, standards-compliant robots.txt with allow/disallow rules, sitemap, host, and crawl delay — validated as you type."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <RobotsTxtGeneratorTool />
        </div>
      </div>
    </PageTransition>
  );
}
