import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "CSS Box Shadow Generator — Design Shadows Online Free",
  description:
    "Create CSS box shadows online for free. Adjust X, Y, blur, spread, opacity, and inset with live preview. Copy ready-to-use CSS in one click.",
  path: "/css-box-shadow-generator",
  keywords: ["css box shadow generator", "box shadow css", "shadow generator", "inset shadow", "css shadow maker"],
});

export default function CssBoxShadowGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Developer Tools" }, { label: "CSS Box Shadow Generator", href: "/css-box-shadow-generator" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="css-box-shadow-generator" />
    </>
  );
}
