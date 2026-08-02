import type { Metadata } from "next";
import { buildMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "About Amar Lodhi — Founder of Vizo Tool",
  description:
    "Meet Amar Lodhi, the 22-year-old software engineer from Mathura building Vizo Tool — 40+ free, private, browser-based tools for images, PDFs, developers, SEO and more. No uploads, no ads, no sign-ups.",
  path: "/about",
  keywords: [
    "about vizotool",
    "amar lodhi",
    "vizotool founder",
    "free online tools",
    "browser based tools",
    "software engineer mathura",
  ],
});

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Amar Lodhi",
  jobTitle: "Software Engineer",
  url: `${SITE_URL}/about`,
  image: `${SITE_URL}/og?title=${encodeURIComponent("About Amar Lodhi")}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mathura",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Software Development",
    "Web Development",
    "React",
    "Next.js",
    "Node.js",
    "MongoDB",
    "SQL",
    "REST APIs",
    "AI Integrations",
    "SEO",
  ],
  worksFor: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

const webpageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "About Amar Lodhi — Founder of Vizo Tool",
  url: `${SITE_URL}/about`,
  description:
    "The story of Amar Lodhi, the software engineer behind Vizo Tool — a platform of 40+ free, private, browser-based tools.",
  isPartOf: {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  },
  about: {
    "@type": "Person",
    name: "Amar Lodhi",
  },
  dateModified: "2026-08-01",
  inLanguage: "en",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "About" }]} />
      <JsonLd data={personSchema} />
      <JsonLd data={webpageSchema} />
      {children}
    </>
  );
}
