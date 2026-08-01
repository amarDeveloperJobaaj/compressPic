import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "UTM Builder — Create Trackable Campaign URLs Free",
  description:
    "Build trackable UTM campaign URLs with source, medium, campaign, term, and content. Live URL preview, QR code, and local campaign history. 100% free.",
  path: "/utm-builder",
  keywords: ["utm builder", "utm url generator", "campaign url", "utm parameters", "google analytics tracking"],
});

export default function UtmBuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "SEO Tools" }, { label: "UTM Builder", href: "/utm-builder" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="utm-builder" />
    </>
  );
}
