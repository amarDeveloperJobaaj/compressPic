import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CONVERSION_PAIRS, getConversionPair } from "@/features/converter/utils/pairs";
import { ConversionPairPage } from "@/features/converter/components/ConversionPairPage";
import { ConversionSeoContent } from "@/components/seo/ConversionSeoContent";
import { getFinanceConfig, FINANCE_SLUGS } from "@/features/finance/configs";
import { FinanceCalculatorPage } from "@/features/finance/components/FinanceCalculatorPage";
import { getYouTubeConfig, YOUTUBE_SLUGS } from "@/features/youtube/configs";
import { YouTubeTool } from "@/features/youtube/components/YouTubeTool";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageTransition } from "@/components/shared/PageTransition";
import { buildMetadata } from "@/lib/seo";

// Only render routes listed in the registries below; anything else 404s
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...CONVERSION_PAIRS.map((pair) => ({ slug: pair.slug })),
    ...FINANCE_SLUGS.map((slug) => ({ slug })),
    ...YOUTUBE_SLUGS.map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const finance = getFinanceConfig(slug);
  if (finance) {
    return buildMetadata({
      title: `${finance.title} — Free & Instant`,
      description: `${finance.description} Calculate in seconds — free, private, and 100% in your browser.`,
      path: `/${slug}`,
      keywords: [
        finance.title.toLowerCase(),
        `${finance.title.toLowerCase()} online`,
        `${finance.title.toLowerCase()} free`,
        `${finance.name.toLowerCase()} calculator`,
        "finance calculator",
        "calculator online",
      ],
    });
  }

  const youtube = getYouTubeConfig(slug);
  if (youtube) {
    return buildMetadata({
      title: youtube.title,
      description: `${youtube.description} Free, private, and 100% in your browser.`,
      path: `/${slug}`,
      keywords: [
        ...youtube.keywords,
        "youtube tools",
        "youtube creator tools",
        "youtube seo",
      ],
    });
  }

  const pair = getConversionPair(slug);
  if (!pair) return {};
  return buildMetadata({
    title: pair.title,
    description: pair.description,
    path: `/${pair.slug}`,
    keywords: [
      `${pair.from.label} to ${pair.to.label}`,
      `convert ${pair.from.label} to ${pair.to.label}`,
      `${pair.from.label.toLowerCase()} to ${pair.to.label.toLowerCase()} converter`,
      "image converter",
    ],
  });
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const finance = getFinanceConfig(slug);
  if (finance) {
    return (
      <PageTransition>
        <Breadcrumbs
          items={[
            { label: "Finance Tools" },
            { label: finance.name, href: `/${finance.slug}` },
          ]}
        />
        <section className="py-8 sm:py-10">
          <div className="container-page">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                {finance.title}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-text-secondary">
                {finance.description}
              </p>
            </div>
            <FinanceCalculatorPage slug={slug} />
          </div>
        </section>
        <ToolSeoContent slug={slug} />
      </PageTransition>
    );
  }

  const youtube = getYouTubeConfig(slug);
  if (youtube) {
    return (
      <PageTransition>
        <Breadcrumbs
          items={[
            { label: "YouTube Tools" },
            { label: youtube.name, href: `/${youtube.slug}` },
          ]}
        />
        <section className="py-8 sm:py-10">
          <div className="container-page">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                {youtube.title}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-text-secondary">
                {youtube.description}
              </p>
            </div>
            <YouTubeTool slug={slug} />
          </div>
        </section>
        <ToolSeoContent slug={slug} />
      </PageTransition>
    );
  }

  const pair = getConversionPair(slug);
  if (!pair) notFound();

  return (
    <PageTransition>
      <Breadcrumbs
        items={[
          { label: "Image Tools" },
          { label: "Convert", href: "/convert" },
          { label: `${pair.from.label} to ${pair.to.label}`, href: `/${pair.slug}` },
        ]}
      />
      <ConversionPairPage pair={pair} />
      <ConversionSeoContent pair={pair} />
    </PageTransition>
  );
}
