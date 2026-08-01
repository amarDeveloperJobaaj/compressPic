"use client";

import { BarChart3 } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { WebsiteTrafficCheckerTool } from "@/features/traffic-checker/components/WebsiteTrafficCheckerTool";

export default function WebsiteTrafficCheckerPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={BarChart3}
          title="Website Traffic Checker"
          description="Estimate any website's monthly and yearly traffic from public SEO signals — with score breakdowns, a 12-month trend, compare mode and PDF reports."
        />
        <div className="mx-auto mt-10 max-w-5xl">
          <WebsiteTrafficCheckerTool />
        </div>
      </div>
    </PageTransition>
  );
}
