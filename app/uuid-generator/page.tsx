"use client";

import { Hash } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { UuidGeneratorTool } from "@/features/devtools/tools/UuidGeneratorTool";

export default function UuidGeneratorPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Hash}
          title="UUID Generator"
          description="Generate UUID v1, v4, and v7 identifiers in bulk — with crypto-secure randomness and download options."
        />
        <div className="mx-auto mt-10 max-w-2xl">
          <UuidGeneratorTool />
        </div>
      </div>
    </PageTransition>
  );
}
