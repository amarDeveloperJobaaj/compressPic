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
          title="Free Website Traffic Checker"
          description="Check estimated website traffic for any site — analyze visitors, SEO score, performance & compare competitors. Free, fast & private — no sign-up needed."
        />
        <div className="mx-auto mt-10 max-w-5xl">
          <WebsiteTrafficCheckerTool />
        </div>
      </div>
    </PageTransition>
  );
}
