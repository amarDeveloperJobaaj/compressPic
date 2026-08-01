"use client";

import { Link } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { UtmBuilderTool } from "@/features/seo-tools/tools/UtmBuilderTool";

export default function UtmBuilderPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Link}
          title="UTM Builder"
          description="Create trackable campaign URLs with utm_source, utm_medium, utm_campaign, and more — plus a QR code and local history for every link."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <UtmBuilderTool />
        </div>
      </div>
    </PageTransition>
  );
}
