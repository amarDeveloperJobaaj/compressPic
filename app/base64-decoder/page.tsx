"use client";

import { Binary } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { Base64Tool } from "@/features/devtools/tools/Base64Tool";

export default function Base64DecoderPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Binary}
          title="Base64 Decoder"
          description="Decode Base64 strings and data URLs back to text or files — with automatic image preview. 100% private."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <Base64Tool direction="decode" />
        </div>
      </div>
    </PageTransition>
  );
}
