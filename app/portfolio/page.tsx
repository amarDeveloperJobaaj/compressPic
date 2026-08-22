import { Metadata } from "next";
import { SITE_URL, SITE_NAME, ogImageUrl } from "@/lib/seo";
import { PortfolioPageClient } from "./PortfolioPageClient";

const TITLE = "Amar Lodhi — Software Engineer | Full Stack & AI Developer";
const DESCRIPTION = "Software Engineer specializing in full-stack development, AI/GenAI integration, and product engineering. Building VizoTool.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Amar Lodhi", "software engineer", "full stack developer", "React", "Next.js", "AI developer", "VizoTool"],
  authors: [{ name: "Amar Lodhi" }],
  alternates: { canonical: "/portfolio" },
  openGraph: { type: "profile", locale: "en_US", url: `${SITE_URL}/portfolio`, siteName: SITE_NAME, title: TITLE, description: DESCRIPTION, images: [{ url: ogImageUrl(TITLE), width: 1200, height: 630, alt: "Amar Lodhi — Software Engineer Portfolio" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [ogImageUrl(TITLE)] },
  robots: { index: true, follow: true },
};

export default function PortfolioPage() {
  return <PortfolioPageClient />;
}
