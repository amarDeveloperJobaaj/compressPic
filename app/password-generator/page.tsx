"use client";

import { KeyRound } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { PasswordGeneratorTool } from "@/features/devtools/tools/PasswordGeneratorTool";

export default function PasswordGeneratorPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={KeyRound}
          title="Password Generator"
          description="Create strong, random passwords with a live strength meter and entropy readout. Generated locally with crypto-grade randomness."
        />
        <div className="mx-auto mt-10 max-w-2xl">
          <PasswordGeneratorTool />
        </div>
      </div>
    </PageTransition>
  );
}
