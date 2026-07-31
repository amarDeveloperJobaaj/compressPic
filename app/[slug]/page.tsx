import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CONVERSION_PAIRS, getConversionPair } from "@/features/converter/utils/pairs";
import { ConversionPairPage } from "@/features/converter/components/ConversionPairPage";
import { ConversionSeoContent } from "@/components/seo/ConversionSeoContent";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PageTransition } from "@/components/shared/PageTransition";
import { buildMetadata } from "@/lib/seo";

// Only render routes listed in the conversion pairs registry; anything else 404s
export const dynamicParams = false;

export function generateStaticParams() {
  return CONVERSION_PAIRS.map((pair) => ({ slug: pair.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
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

export default async function ConversionSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
