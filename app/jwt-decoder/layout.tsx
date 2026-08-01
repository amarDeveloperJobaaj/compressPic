import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "JWT Decoder — Decode JSON Web Tokens Online Free",
  description:
    "Decode JWT tokens online for free. View header, payload, and signature with human-readable expiry timestamps. 100% private, runs in your browser.",
  path: "/jwt-decoder",
  keywords: ["jwt decoder", "decode jwt", "jwt inspector", "json web token decoder", "jwt payload", "jwt expiry"],
});

export default function JwtDecoderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Developer Tools" }, { label: "JWT Decoder", href: "/jwt-decoder" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="jwt-decoder" />
    </>
  );
}
