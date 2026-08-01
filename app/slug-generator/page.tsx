"use client";

import { TextCursorInput } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { SlugGeneratorTool } from "@/features/seo-tools/tools/SlugGeneratorTool";

export default function SlugGeneratorPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={TextCursorInput}
          title="Slug Generator"
          description="Turn any headline into a clean, keyword-rich, SEO-friendly URL slug — with Unicode support, stop-word removal, and custom separators."
        />
        <div className="mx-auto mt-10 max-w-4xl">
          <SlugGeneratorTool />
        </div>
      </div>
    </PageTransition>
  );
}
