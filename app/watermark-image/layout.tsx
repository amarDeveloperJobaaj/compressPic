import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Add Watermark to Image Online Free — Text & Logo Watermark",
  description:
    "Add a text or logo watermark to your images online for free. Custom fonts, opacity, rotation, drag-and-drop positioning — 100% in your browser, no uploads.",
  path: "/watermark-image",
  keywords: [
    "add watermark to image",
    "watermark image online",
    "text watermark",
    "logo watermark",
    "photo watermark",
    "watermark photos",
    "image watermark tool",
  ],
});

export default function WatermarkImageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Image Tools" }, { label: "Add Watermark", href: "/watermark-image" }]}
      />
      {children}
      <AdSlot />
      <ToolSeoContent slug="watermark-image" />
    </>
  );
}
