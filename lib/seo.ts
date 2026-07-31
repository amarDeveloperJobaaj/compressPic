import type { Metadata } from "next";

/** Central site constants — change once, apply everywhere. */
export const SITE_URL = "https://compresspix.com";
export const SITE_NAME = "CompressPix";
export const SITE_TAGLINE = "Free Online Image Tools — 100% in Your Browser";
export const SITE_DESCRIPTION =
  "Compress, resize, crop, flip, and convert images online for free. 100% browser-based — no uploads, no servers, no limits.";
export const SITE_KEYWORDS = [
  "image tools",
  "image compressor",
  "compress image online",
  "resize image",
  "crop image online",
  "flip image online",
  "image converter",
  "jpg to png",
  "png to jpg",
];

/** Dynamic OG image generator route (app/og/route.tsx) — takes ?title=. */
export function ogImageUrl(title: string): string {
  return `/og?title=${encodeURIComponent(title)}`;
}

/** Build a complete Metadata object for a single route (title, description, canonical, OG, Twitter). */
export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImageUrl(title);
  return {
    title,
    description,
    keywords: [...SITE_KEYWORDS, ...keywords],
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD schema builders (valid schema.org, no fabricated data)      */
/* ------------------------------------------------------------------ */

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og?title=${encodeURIComponent(SITE_NAME)}`,
  };
}

export function softwareApplicationSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    url: `${SITE_URL}${url}`,
    description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (Web browser)",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

export function breadcrumbListSchema(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: `${SITE_URL}${item.url}` } : {}),
    })),
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function howToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
