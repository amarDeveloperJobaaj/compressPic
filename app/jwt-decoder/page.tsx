"use client";

import { Fingerprint } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { JwtDecoderTool } from "@/features/devtools/tools/JwtDecoderTool";

export default function JwtDecoderPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Fingerprint}
          title="JWT Decoder"
          description="Decode any JWT's header, payload, and signature — with human-readable expiry timestamps. 100% local."
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <JwtDecoderTool />
        </div>
      </div>
    </PageTransition>
  );
}
