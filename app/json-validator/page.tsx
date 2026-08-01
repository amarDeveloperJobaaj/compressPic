"use client";

import { ShieldCheck } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { JsonValidatorTool } from "@/features/devtools/tools/JsonValidatorTool";

export default function JsonValidatorPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={ShieldCheck}
          title="JSON Validator"
          description="Validate JSON in real time with exact error lines and plain-English explanations. 100% private."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <JsonValidatorTool />
        </div>
      </div>
    </PageTransition>
  );
}
