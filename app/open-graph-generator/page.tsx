"use client";

import { Share2 } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { OpenGraphGeneratorTool } from "@/features/seo-tools/tools/OpenGraphGeneratorTool";

export default function OpenGraphGeneratorPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Share2}
          title="Open Graph Generator"
          description="Design your social share cards with live Facebook, LinkedIn, and X previews — then copy the Open Graph and Twitter tags straight into your page."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <OpenGraphGeneratorTool />
        </div>
      </div>
    </PageTransition>
  );
}
