import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Convert PDF to Image Online Free — PDF to JPG, PNG | Vizo Tool",
  description:
    "Turn PDF pages into high-resolution JPG or PNG images for free. Preview each page, download individually, or grab all as a ZIP — 100% in your browser, no uploads.",
  path: "/pdf-to-image",
  keywords: [
    "pdf to image",
    "pdf to jpg",
    "pdf to png",
    "convert pdf to image",
    "pdf to jpg converter",
    "extract pages from pdf as images",
    "pdf pages to images",
    "convert pdf to jpg online free",
  ],
});

export default function PdfToImageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Image Tools" },
          { label: "PDF to Image", href: "/pdf-to-image" },
        ]}
      />
      {children}
      <AdSlot />
      <ToolSeoContent slug="pdf-to-image" />
    </>
  );
}
