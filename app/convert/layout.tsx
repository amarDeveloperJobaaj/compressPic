import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Image Converter — Convert JPG, PNG, WEBP, AVIF & HEIC Free",
  description:
    "Convert images to JPG, PNG, WEBP or AVIF online for free. Convert iPhone HEIC photos to JPG or PNG. Free, private, no uploads.",
  path: "/convert",
  keywords: [
    "image converter",
    "jpg to png",
    "png to jpg",
    "jpg to webp",
    "webp to jpg",
    "heic to jpg",
    "avif to jpg",
    "svg to png",
  ],
});

export default function ConvertLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Image Tools" }, { label: "Convert Format", href: "/convert" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="convert" />
    </>
  );
}
