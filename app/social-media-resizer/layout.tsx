import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Social Media Image Resizer Online Free — Instagram, YouTube, Facebook | Vizo Tool",
  description:
    "Resize images to exact social media dimensions for free — Instagram posts & stories, YouTube thumbnails, Facebook covers, X headers, LinkedIn banners, Pinterest pins & TikTok. 100% in your browser.",
  path: "/social-media-resizer",
  keywords: [
    "social media image resizer",
    "instagram image resizer",
    "youtube thumbnail resizer",
    "facebook cover resize",
    "linkedin banner resize",
    "twitter header size",
    "social media image size",
    "resize image for instagram",
    "youtube thumbnail size",
    "social media image dimensions",
  ],
});

export default function SocialMediaResizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Image Tools" },
          { label: "Social Media Resizer", href: "/social-media-resizer" },
        ]}
      />
      {children}
      <AdSlot />
      <ToolSeoContent slug="social-media-resizer" />
    </>
  );
}
