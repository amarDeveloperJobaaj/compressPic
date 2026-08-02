import type { Metadata } from "next";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Remove Background from Image Online Free | Vizo Tool",
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
      {/* WebPage structured data — complements the SoftwareApplication,
          BreadcrumbList, FAQ and HowTo schemas emitted by the SEO components. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Remove Background from Image Online Free | Vizo Tool",
          url: `${SITE_URL}/remove-background`,
          description:
            "Remove image backgrounds instantly using AI. Create transparent PNGs, replace backgrounds with colors or images, and download in HD for free — 100% in your browser.",
          isPartOf: {
            "@type": "WebSite",
            name: "Vizo Tool",
            url: SITE_URL,
          },
          about: {
            "@type": "SoftwareApplication",
            name: "AI Background Remover",
            applicationCategory: "MultimediaApplication",
          },
        }}
      />
      <Breadcrumbs
        items={[{ label: "Image Tools" }, { label: "Remove Background", href: "/remove-background" }]}
      />
      {children}
      <AdSlot />
      <ToolSeoContent slug="remove-background" />
    </>
  );
}
