import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Passport Photo Maker Online Free — 25+ Countries | Vizo Tool",
  description:
    "Make a passport-size photo online free for 25+ countries. Choose your size, set the background color, download a print sheet — 100% in your browser, no uploads.",
  path: "/passport-photo-maker",
  keywords: [
    "passport photo maker",
    "passport photo maker online",
    "passport size photo maker",
    "passport photo online",
    "photo for passport",
    "passport photo tool",
    "passport photo 35x45",
    "passport photo 2x2",
    "visa photo maker",
    "print passport photos",
  ],
});

export default function PassportPhotoMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Image Tools" },
          { label: "Passport Photo Maker", href: "/passport-photo-maker" },
        ]}
      />
      {children}
      <AdSlot />
      <ToolSeoContent slug="passport-photo-maker" />
    </>
  );
}
