import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Compress Image Online Free — Reduce to 50KB, 100KB or 200KB",
  description:
    "Compress JPG, PNG and WEBP images online without losing quality. Compress to 50KB, 100KB or 200KB — free, private, no uploads.",
  path: "/compress",
  keywords: [
    "compress image",
    "compress image online",
    "compress image to 50kb",
    "compress image to 100kb",
    "compress image to 200kb",
    "jpg compressor",
    "png compressor",
  ],
});

export default function CompressLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Image Tools" }, { label: "Compress Image", href: "/compress" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="compress" />
    </>
  );
}
