import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Base64 Decoder — Decode Base64 to Text Online Free",
  description:
    "Decode Base64 strings and data URLs to readable text or files online for free. Automatic image preview and file download. 100% private, no uploads.",
  path: "/base64-decoder",
  keywords: ["base64 decoder", "decode base64", "base64 to text", "decode data url", "base64 to image", "base64 online"],
});

export default function Base64DecoderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Developer Tools" }, { label: "Base64 Decoder", href: "/base64-decoder" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="base64-decoder" />
    </>
  );
}
