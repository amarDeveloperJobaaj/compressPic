import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "QR Code Generator — Create Free QR Codes Online (PNG, SVG, PDF)",
  description:
    "Create QR codes online for free. URL, WiFi, WhatsApp, UPI, email, and more. Add your logo, pick colors, and download as PNG, SVG, or PDF. 100% private.",
  path: "/qr-code-generator",
  keywords: ["qr code generator", "create qr code", "qr code online", "wifi qr code", "whatsapp qr code", "qr code maker"],
});

export default function QrCodeGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Developer Tools" }, { label: "QR Code Generator", href: "/qr-code-generator" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="qr-code-generator" />
    </>
  );
}
