import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Copy, Tag } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbListSchema, webPageSchema } from "@/lib/seo";
import { SEED_DESIGNS, DESIGN_CATEGORIES, getSeedDesignBySlug } from "@/lib/vizodesign/seed";
import { DesignCharacteristics } from "@/components/vizodesign/DesignCharacteristics";
import { DesignSystemViewer } from "@/components/vizodesign/DesignSystemViewer";
import { DesignMarkdown } from "@/components/vizodesign/DesignMarkdown";
import { CopyDesignButton } from "@/components/vizodesign/CopyDesignButton";
import { CopyPromptButton } from "@/components/vizodesign/CopyPromptButton";
import { RelatedDesigns } from "@/components/vizodesign/RelatedDesigns";
import DesignPreview from "@/components/vizodesign/DesignPreviewWrapper";

export function generateStaticParams() {
  return SEED_DESIGNS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const design = getSeedDesignBySlug(slug);
  if (!design) return {};

  const seo = design.seo;
  return buildMetadata({
    title: seo?.meta_title ?? `${design.name} — VizoDesign`,
    description: seo?.meta_description ?? design.short_description,
    path: `/vizodesign/${design.slug}`,
    keywords: seo?.keywords ?? design.tags,
  });
}

export default async function DesignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const design = getSeedDesignBySlug(slug);

  if (!design) notFound();

  const category = DESIGN_CATEGORIES.find((c) => c.id === design.category_id);
  const related = SEED_DESIGNS.filter(
    (d) => d.id !== design.id && (d.category_id === design.category_id || d.tags.some((t) => design.tags.includes(t)))
  ).slice(0, 4);

  return (
    <PageTransition>
      <JsonLd
        data={webPageSchema({
          name: design.name,
          description: design.short_description,
          url: `/vizodesign/${design.slug}`,
        })}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", url: "/" },
          { name: "VizoDesign", url: "/vizodesign" },
          ...(category ? [{ name: category.name, url: `/vizodesign/category/${category.slug}` }] : []),
          { name: design.name, url: `/vizodesign/${design.slug}` },
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
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Link
                  href={`/vizodesign/category/${category.slug}`}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  {category.name}
                </Link>
              )}
              {design.featured && (
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                  Featured
                </span>
              )}
              <span className="rounded-full bg-background border border-border px-3 py-1 text-xs font-medium text-text-muted">
                {design.theme}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {design.name}
            </h1>
            <p className="mt-3 text-lg text-text-secondary">{design.description}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-text-muted">
                <Eye className="h-4 w-4" />
                {design.view_count.toLocaleString()} views
              </div>
              <div className="flex items-center gap-1.5 text-sm text-text-muted">
                <Copy className="h-4 w-4" />
                {design.copy_count.toLocaleString()} copies
              </div>
            </div>
          </header>

          <div className="mb-8 overflow-hidden rounded-2xl border border-border">
            <DesignPreview slug={design.slug} />
          </div>

          <div className="mb-8 flex flex-wrap items-center gap-3">
            <CopyDesignButton design={design} />
            <CopyPromptButton design={design} />
          </div>

          <section className="mb-12">
            <h2 className="mb-4 text-xl font-bold text-text-primary">Characteristics</h2>
            <DesignCharacteristics design={design} />
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-xl font-bold text-text-primary">Design System</h2>
            <DesignSystemViewer designSystem={design.design_system} />
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-xl font-bold text-text-primary">DESIGN.md</h2>
            <DesignMarkdown markdown={design.design_markdown} designName={design.name} />
          </section>

          <section className="mb-12 rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-3 text-xl font-bold text-text-primary">How to Use</h2>
            <p className="mb-4 text-sm text-text-secondary">
              Copy the DESIGN.md above and paste it into your AI coding tool (Cursor, Copilot, Windsurf, etc.).
              The AI will use the design system rules to generate consistent, production-ready code.
            </p>
            <ol className="list-inside list-decimal space-y-2 text-sm text-text-secondary">
              <li>Click &quot;Copy DESIGN.md&quot; to copy the full design specification</li>
              <li>Open your AI coding tool (Cursor, GitHub Copilot, etc.)</li>
              <li>Paste the DESIGN.md into your project or as a system prompt</li>
              <li>Ask the AI to build components following the design rules</li>
              <li>Use &quot;Copy AI Prompt&quot; for a ready-made prompt to get started</li>
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="mb-3 text-xl font-bold text-text-primary">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {design.technologies.map((tech) => (
                <span key={tech} className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-3 text-xl font-bold text-text-primary">Frameworks</h2>
            <div className="flex flex-wrap gap-2">
              {design.frameworks.map((fw) => (
                <span key={fw} className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
                  {fw}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-3 text-xl font-bold text-text-primary">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {design.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section>
              <h2 className="mb-5 text-xl font-bold text-text-primary">Related Designs</h2>
              <RelatedDesigns designs={related} />
            </section>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
