import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "JSON Validator — Validate JSON Syntax Online Free",
  description:
    "Validate JSON online in real time. Get the exact error line and column with a plain-English explanation. Free, private, 100% browser-based.",
  path: "/json-validator",
  keywords: ["json validator", "validate json", "json syntax check", "check json online", "json error finder"],
});

export default function JsonValidatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Developer Tools" }, { label: "JSON Validator", href: "/json-validator" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="json-validator" />
    </>
  );
}
