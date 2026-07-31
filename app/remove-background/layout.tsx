import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Remove Background from Image Online Free | CompressPix",
  description:
    "Remove image backgrounds instantly using AI. Create transparent PNGs, replace backgrounds with colors or images, and download in HD for free — 100% in your browser.",
  path: "/remove-background",
  keywords: [
    "remove background",
    "background remover",
    "remove image background",
    "remove bg",
    "transparent background maker",
    "ai background remover",
    "remove background from image",
    "remove background online",
    "background remover free",
    "png background remover",
    "transparent png",
    "remove white background",
  ],
});

export default function RemoveBackgroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Image Tools" }, { label: "Remove Background", href: "/remove-background" }]}
      />
      {children}
      <AdSlot />
      <ToolSeoContent slug="remove-background" />
    </>
  );
}
