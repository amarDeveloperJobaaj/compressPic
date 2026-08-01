"use client";

import { Palette } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { CssGradientGeneratorTool } from "@/features/devtools/tools/CssGradientGeneratorTool";

export default function CssGradientGeneratorPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Palette}
          title="CSS Gradient Generator"
          description="Design linear, radial, and conic gradients with unlimited color stops and copy-ready CSS."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <CssGradientGeneratorTool />
        </div>
      </div>
    </PageTransition>
  );
}
