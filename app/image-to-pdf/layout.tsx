import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Convert Images to PDF Online Free — JPG, PNG to PDF | CompressPix",
  description:
    "Merge JPG, PNG, WEBP, and HEIC images into one PDF file for free. Reorder pages, choose A4 or Letter, adjust quality — 100% in your browser, no uploads.",
  path: "/image-to-pdf",
  keywords: [
    "image to pdf",
    "jpg to pdf",
    "png to pdf",
    "convert image to pdf",
    "merge images into pdf",
    "images to pdf converter",
    "make pdf from images",
    "photo to pdf",
  ],
});

export default function ImageToPdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Image Tools" },
          { label: "Image to PDF", href: "/image-to-pdf" },
        ]}
      />
      {children}
      <AdSlot />
      <ToolSeoContent slug="image-to-pdf" />
    </>
  );
}
