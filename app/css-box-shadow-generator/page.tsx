"use client";

import { Box } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { CssBoxShadowGeneratorTool } from "@/features/devtools/tools/CssBoxShadowGeneratorTool";

export default function CssBoxShadowGeneratorPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Box}
          title="CSS Box Shadow Generator"
          description="Design the perfect box shadow — X, Y, blur, spread, opacity, and inset — with live preview and copy-ready CSS."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <CssBoxShadowGeneratorTool />
        </div>
      </div>
    </PageTransition>
  );
}
