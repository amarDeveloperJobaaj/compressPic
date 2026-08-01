"use client";

import { Search } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { SerpPreviewTool } from "@/features/seo-tools/tools/SerpPreviewTool";

export default function SerpPreviewPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Search}
          title="SERP Preview"
          description="See exactly how your page looks in Google search — desktop and mobile — with truncation warnings, scores, and keyword highlighting as you type."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <SerpPreviewTool />
        </div>
      </div>
    </PageTransition>
  );
}
