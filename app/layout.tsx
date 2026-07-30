import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CompressPix",
  url: "https://compresspix.com",
  description:
    "Compress JPG, PNG, and WEBP images online for free. 100% browser-based – no uploads, no servers, no limits.",
  applicationCategory: "Multimedia",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "CompressPix",
  },
};

export const metadata: Metadata = {
  title: {
    default: "CompressPix — Free Online Image Compressor",
    template: "%s | CompressPix",
  },
  description:
    "Compress JPG, PNG, and WEBP images online for free. 100% browser-based – no uploads, no servers, no limits.",
  keywords: [
    "image compressor",
    "compress image",
    "free image compressor",
    "jpg compressor",
    "png compressor",
    "webp compressor",
    "browser compression",
  ],
  authors: [{ name: "CompressPix" }],
  creator: "CompressPix",
  publisher: "CompressPix",
  metadataBase: new URL("https://compresspix.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "CompressPix",
    title: "CompressPix — Free Online Image Compressor",
    description:
      "Compress JPG, PNG, and WEBP images online for free. 100% browser-based – no uploads, no servers, no limits.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CompressPix",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CompressPix — Free Online Image Compressor",
    description:
      "Compress JPG, PNG, and WEBP images online for free. 100% browser-based – no uploads, no servers.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
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
      <body className="flex min-h-full flex-col bg-background font-sans text-text-primary">
        {/* Skip to content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
