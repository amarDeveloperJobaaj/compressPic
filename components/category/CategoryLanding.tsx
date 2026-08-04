import Link from "next/link";
import { ArrowRight, BookOpen, Image as ImageIcon, Newspaper, PenLine } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageTransition } from "@/components/shared/PageTransition";
import { Capsule, type CapsuleVariant } from "@/components/ui/capsule";
import { NewsletterForm } from "@/components/blog/ClientBlocks";
import type { CategoryPageConfig } from "@/lib/category-pages";
import { getCategoryTools } from "@/lib/category-pages";
import {
  collectionPageSchema,
  itemListSchema,
  organizationSchema,
  webPageSchema,
} from "@/lib/seo";
import { getPublishedPosts } from "@/lib/blog/service";
import { CategoryHero } from "./CategoryHero";
import { CategoryExplorer } from "./CategoryExplorer";
import { CategoryFaq } from "./CategoryFaq";
import { CategorySeoContent } from "./CategorySeoContent";
import { CATEGORY_ICONS } from "./CategoryIcon";

/** Assemble a full category landing page from its config entry. */
export function CategoryLanding({ category }: { category: CategoryPageConfig }) {
  const tools = getCategoryTools(category);
  const Icon = CATEGORY_ICONS[category.slug] ?? ImageIcon;

  // Related guides from the blog, matched by blog category name when present.
  const relatedPosts = category.relatedBlogCategory
    ? getPublishedPosts()
        .filter((p) => p.category === category.relatedBlogCategory)
        .slice(0, 3)
    : [];

  return (
    <PageTransition>
      <Breadcrumbs items={[{ label: category.label }]} />

      {/* Programmatic JSON-LD: CollectionPage + ItemList + WebPage + Organization */}
      <JsonLd
        data={collectionPageSchema({
          name: category.label,
          description: category.metaDescription,
          url: `/${category.slug}`,
        })}
      />
      <JsonLd
        data={itemListSchema(
          tools.map((tool) => ({ name: tool.name, url: tool.href }))
        )}
      />
      <JsonLd
        data={webPageSchema({
          name: category.label,
          description: category.heroDescription,
          url: `/${category.slug}`,
        })}
      />
      <JsonLd data={organizationSchema()} />

      {/* Hero */}
      <CategoryHero category={category} />

      {/* Explorer */}
      <section className="container-page pb-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-text-primary">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-md`}>
              <Icon className="h-5 w-5" />
            </span>
            All {category.label}
          </h2>
          <Capsule variant={category.accent as CapsuleVariant} sm dot>
            {tools.length} tools
          </Capsule>
        </div>

        <CategoryExplorer tools={tools} accent={category.accent} />

        {/* Related guides from the blog */}
        {relatedPosts.length > 0 && (
          <div className="mt-14">
            <div className="mb-5 flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-text-primary">
                Related Guides
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                >
                  <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
                    <BookOpen className="h-3.5 w-3.5" />
                    {post.category}
                  </span>
                  <h3 className="mt-2.5 flex-1 text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <span className="mt-4 flex items-center gap-1.5 text-xs text-text-muted">
                    <PenLine className="h-3.5 w-3.5" />
                    {post.readTime}
                    <span aria-hidden="true">·</span>
                    Read article
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Educational content: benefits, features, how-to, use-cases, FAQs */}
      <CategorySeoContent category={category} />

      <CategoryFaq category={category} />

      {/* Newsletter */}
      <section className="container-page pb-16">
        <NewsletterForm />
      </section>
    </PageTransition>
  );
}
