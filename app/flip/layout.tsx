import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Flip Image Online Free — Mirror & Rotate Photos",
  description:
    "Flip and rotate images online for free. Mirror horizontally or vertically and rotate 90° at a time. Free, private, no uploads.",
  path: "/flip",
  keywords: [
    "flip image",
    "flip image online",
    "mirror image online",
    "rotate image",
    "rotate image online",
    "flip photo",
  ],
});

export default function FlipLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Image Tools" }, { label: "Flip & Rotate", href: "/flip" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="flip" />
    </>
  );
}
