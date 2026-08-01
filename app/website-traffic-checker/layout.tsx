import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "Website Traffic Checker — Estimate Any Site's Monthly Visitors",
  description:
    "Estimate website traffic from public SEO signals: domain age, meta tags, robots.txt, sitemap, page size and more. Score breakdown, trend chart, compare mode and PDF reports — 100% free.",
  path: "/website-traffic-checker",
  keywords: [
    "website traffic checker",
    "estimate website traffic",
    "check website visitors",
    "site traffic estimator",
    "competitor traffic analysis",
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
          { label: "Website Analysis Tools" },
          { label: "Traffic Checker", href: "/website-traffic-checker" },
        ]}
      />
      {children}
      <AdSlot />
      <ToolSeoContent slug="website-traffic-checker" />
    </>
  );
}
