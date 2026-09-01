import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Free Website Traffic Checker — Check Any Site's Traffic",
  description:
    "Check estimated website traffic for any site — free online traffic checker. Analyze visitors, SEO score & compare competitors. Quick, easy & private.",
  path: "/website-traffic-checker",
  keywords: [
    "website traffic checker",
    "check website traffic",
    "website traffic estimator",
    "website traffic analysis",
    "website visitor checker",
    "estimate website traffic",
    "competitor website traffic",
    "website analytics tool",
    "free traffic checker",
    "site traffic checker",
  ],
});

export default function WebsiteTrafficCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "SEO Tools" },
          { label: "Traffic Checker", href: "/website-traffic-checker" },
        ]}
      />
      {children}
      <AdSlot />
      <ToolSeoContent slug="website-traffic-checker" />
    </>
  );
}
