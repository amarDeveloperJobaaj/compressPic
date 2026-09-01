import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbListSchema } from "@/lib/seo";
import { DESIGN_CATEGORIES, getSeedDesignsByCategory } from "@/lib/vizodesign/seed";
import { DesignCard } from "@/components/vizodesign/DesignCard";

export function generateStaticParams() {
  return DESIGN_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = DESIGN_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};

  return buildMetadata({
    title: `${category.name} Design Systems — VizoDesign`,
    description: category.description ?? `Explore ${category.name} design systems with live previews and DESIGN.md instructions.`,
    path: `/vizodesign/category/${category.slug}`,
    keywords: [category.name.toLowerCase(), "design systems", "web design"],
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = DESIGN_CATEGORIES.find((c) => c.slug === slug);

  if (!category) notFound();

  const designs = getSeedDesignsByCategory(slug);
  const others = DESIGN_CATEGORIES.filter((c) => c.slug !== slug);

  return (
    <PageTransition>
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", url: "/" },
          { name: "VizoDesign", url: "/vizodesign" },
          { name: category.name, url: `/vizodesign/category/${category.slug}` },
        ])}
      />

      <div className="container-page py-10 sm:py-16">
        <Link
          href="/vizodesign"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to VizoDesign
        </Link>

        <div className="mx-auto max-w-5xl">
          <header className="mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
              Category
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-3 text-lg text-text-secondary">{category.description}</p>
            )}
            <p className="mt-3 text-sm font-medium text-text-muted">
              {designs.length} design{designs.length === 1 ? "" : "s"}
            </p>
          </header>

          {designs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-20 text-center text-sm text-text-muted">
              No designs in this category yet — check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {designs.map((design) => (
                <DesignCard key={design.id} design={design} categoryName={category.name} />
              ))}
            </div>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
            {others.map((c) => (
              <Link
                key={c.slug}
                href={`/vizodesign/category/${c.slug}`}
                className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-primary/40 hover:text-primary"
              >
                {c.name}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
