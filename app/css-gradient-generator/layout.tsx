import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "CSS Gradient Generator — Linear, Radial & Conic Online Free",
  description:
    "Create CSS gradients online for free. Linear, radial, and conic gradients with unlimited color stops and angle control. Live preview and copy-ready CSS.",
  path: "/css-gradient-generator",
  keywords: ["css gradient generator", "linear gradient", "radial gradient", "conic gradient", "gradient css", "background gradient"],
});

export default function CssGradientGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Developer Tools" }, { label: "CSS Gradient Generator", href: "/css-gradient-generator" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="css-gradient-generator" />
    </>
  );
}
