import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Resize Image Online Free — Crop to Passport, A4 & Social Media",
  description:
    "Resize and crop images online for free. 20+ preset sizes: passport, A4, Instagram, YouTube and more. Free, private, no uploads.",
  path: "/resize",
  keywords: [
    "resize image",
    "image resizer",
    "crop image online",
    "image crop",
    "passport size photo",
    "resize image to passport size",
    "a4 image size",
  ],
});

export default function ResizeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Image Tools" }, { label: "Resize & Crop", href: "/resize" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="resize" />
    </>
  );
}
