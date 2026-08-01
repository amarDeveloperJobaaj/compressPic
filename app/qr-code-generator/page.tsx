"use client";

import { QrCode } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";
import { QrCodeGeneratorTool } from "@/features/devtools/tools/QrCodeGeneratorTool";

export default function QrCodeGeneratorPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={QrCode}
          title="QR Code Generator"
          description="Create QR codes for URLs, WiFi, WhatsApp, UPI, and more — with custom colors and logo. Download as PNG, SVG, or PDF."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <QrCodeGeneratorTool />
        </div>
      </div>
    </PageTransition>
  );
}
