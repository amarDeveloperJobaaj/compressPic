"use client";

import { Heading } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { HeadingCheckerTool } from "@/features/seo-tools/tools/HeadingCheckerTool";

export default function HeadingCheckerPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Heading}
          title="Heading Checker"
          description="Audit your H1–H6 heading structure — missing H1s, skipped levels, and duplicates — with a visual heading tree and actionable fixes."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <HeadingCheckerTool />
        </div>
      </div>
    </PageTransition>
  );
}
