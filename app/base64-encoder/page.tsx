"use client";

import { Binary } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { Base64Tool } from "@/features/devtools/tools/Base64Tool";

export default function Base64EncoderPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Binary}
          title="Base64 Encoder"
          description="Encode text, files, and images to Base64 — UTF-8 safe with data URL output. No uploads, fully private."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <Base64Tool direction="encode" />
        </div>
      </div>
    </PageTransition>
  );
}
