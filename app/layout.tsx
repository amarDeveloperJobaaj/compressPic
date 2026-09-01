import type { Metadata, Viewport } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import { MotionProvider } from "@/components/shared/MotionProvider";
import { RouteChromeGuard } from "@/components/shared/RouteChromeGuard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsScripts } from "@/components/seo/AnalyticsScripts";
import { JsonLd } from "@/components/seo/JsonLd";
import Script from "next/script";
import { Analytics } from '@vercel/analytics/next';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  ogImageUrl,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
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
    url: SITE_URL,
  },
  featureList: [
    "Image Compression & Resizing",
    "Image Format Conversion",
    "PDF Conversion Tools",
    "JSON Formatter & Validator",
    "QR Code Generator",
    "SEO Meta Tag Generator",
    "Schema Markup Generator",
    "Finance Calculators",
    "YouTube Creator Tools",
    "AI Mock Interview",
    "HTML/CSS/JS Playground",
    "SQL Playground",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B1120" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

const HOME_TITLE = "VizoTool — 60+ Free Online Tools for Images, PDFs, Developers, SEO & More";
const HOME_IMAGE = ogImageUrl(HOME_TITLE);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s | Vizo Tool",
  },
  
  description: "Explore 60+ free online tools for images, PDFs, developers, SEO, finance, YouTube and everyday tasks. Fast, simple and private — all in one place, no sign-up needed.",
  keywords: [
    "vizotool",
    "vizo tool",
    "vizotool.com",
    "free online tools",
    "online tools",
    "all in one tools",
    "web tools",
    "free web tools",
    "image tools online",
    "pdf tools online",
    "developer tools online",
    "seo tools online",
    "finance calculators",
    "youtube tools",
    "browser based tools",
    "no upload tools",
    "free tools no sign up",
    "image compressor online free",
    "json formatter online",
    "meta tag generator",
    "emi calculator",
    "qr code generator",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "tools-platform",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "VizoTool — 60+ Free Online Tools",
    description: "Free online tools for images, PDFs, developers, SEO, finance and more. Fast, private and easy to use — no sign-up required.",
    images: [
      {
        url: HOME_IMAGE,
        width: 1200,
        height: 630,
        alt: "VizoTool — 60+ Free Online Tools for Everything",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VizoTool — 60+ Free Online Tools",
    description: "Free online tools for images, PDFs, developers, SEO, finance and more. Fast, private and easy to use.",
    images: [HOME_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // Search-console verification
  verification: {
    google: "RTE8j-fnl2EGl_touOdZ1CPHX3ADNyuHKkjP1LaxkpE",
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : {}),
  },
  // Additional metadata for SEO
  other: {
    "application-name": "VizoTool",
    "msapplication-TileColor": "#0B1120",
    "apple-mobile-web-app-title": "VizoTool",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      itemScope
      itemType="https://schema.org/WebApplication"
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla's
          cz-shortcut-listen) inject attributes onto <body> before hydration,
          which would otherwise trigger a false-positive mismatch warning. */}
      <body
        className="flex min-h-full flex-col bg-background font-sans text-text-primary"
        suppressHydrationWarning
      >
        {/* Apply the saved theme before first paint — dark is the default, so
            there is never a light flash for first-time visitors. Rendered via
            next/script (beforeInteractive) instead of a raw <script> tag —
            raw inline scripts inside React components are never executed on
            the client and trigger a hydration console error. */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("vizotool-theme")||localStorage.getItem("compresspix-theme");var d=t?t==="dark":true;if(d){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}}catch(e){}})();`,
          }}
        />
        {/* Skip to content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        {/* JSON-LD Structured Data: WebSite + Organization + SoftwareApplication */}
        <JsonLd data={websiteSchema()} />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={softwareAppSchema} />
        <AnalyticsScripts />
        <MotionProvider>
          <RouteChromeGuard />
          <Header />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
            <Analytics />
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
