import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Base64 Encoder — Encode Text & Images to Base64 Online Free",
  description:
    "Encode text, files, and images to Base64 online for free. UTF-8 safe with data URL output. Copy or download the result. 100% private, no uploads.",
  path: "/base64-encoder",
  keywords: ["base64 encoder", "encode to base64", "base64 text", "base64 image", "data url encoder", "base64 file"],
});

export default function Base64EncoderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Developer Tools" }, { label: "Base64 Encoder", href: "/base64-encoder" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="base64-encoder" />
    </>
  );
}
