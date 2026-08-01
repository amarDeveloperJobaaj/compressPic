import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Password Generator — Create Strong Random Passwords Online Free",
  description:
    "Generate strong random passwords online for free. Length, symbols, numbers, and exclude-similar options. Live strength meter and entropy. 100% private.",
  path: "/password-generator",
  keywords: ["password generator", "strong password", "random password generator", "secure password", "password maker", "entropy"],
});

export default function PasswordGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Developer Tools" }, { label: "Password Generator", href: "/password-generator" }]} />
      {children}
      <AdSlot />
      <ToolSeoContent slug="password-generator" />
    </>
  );
}
