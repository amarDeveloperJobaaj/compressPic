import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Resize Signature Online Free — Signature to 20KB, 50KB | Vizo Tool",
  description:
    "Resize a signature image online for free. Fit it to any pixel size and compress it under 20 KB or 50 KB limits — keep transparency, download as PNG or JPG, 100% in your browser.",
  path: "/signature-resizer",
  keywords: [
    "signature resize",
    "resize signature online",
    "signature to 20kb",
    "signature to 50kb",
    "online signature resizer",
    "compress signature image",
    "signature size for documents",
    "e-signature file size",
  ],
});

export default function SignatureResizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Image Tools" },
          { label: "Signature Resizer", href: "/signature-resizer" },
        ]}
      />
      {children}
      <AdSlot />
      <ToolSeoContent slug="signature-resizer" />
    </>
  );
}
