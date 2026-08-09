import type { Metadata } from "next";
import { ArrowRight, BookOpen, Newspaper, PenLine, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageTransition } from "@/components/shared/PageTransition";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Capsule } from "@/components/ui/capsule";
import { GridPattern } from "@/components/ui/grid-pattern";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { NewsletterForm } from "@/components/blog/ClientBlocks";
import { buildMetadata, organizationSchema, webPageSchema } from "@/lib/seo";
import { getBlogRepository } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Vizo Tool Blog — Guides, Tutorials & Tool How-Tos",
  description:
    "Practical, ad-free guides on image editing, developer tools, SEO, finance calculators and YouTube growth — written by the Vizo Tool team.",
  path: "/blogs",
  keywords: ["vizo tool blog", "image editing guides", "developer tutorials", "seo guides", "how to compress images", "online tools blog"],
});

export default async function BlogsPage() {
  const repo = getBlogRepository();
  const [{ items: posts }, featured, categories, tags] = await Promise.all([
    repo.listPublished({ pageSize: 100 }),
    repo.getFeaturedPosts(3),
    repo.getCategories(),
    repo.getTags(),
  ]);

  return (
    <PageTransition>
      <Breadcrumbs items={[{ label: "Blog" }]} />
      <JsonLd data={organizationSchema()} />
      <JsonLd
        data={webPageSchema({
          name: "Vizo Tool Blog",
          description: "Guides, tutorials and how-tos for image tools, developer tools, SEO and more.",
          url: "/blogs",
        })}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <BackgroundBeams />
        <GridPattern />
        <div className="relative container-page py-14 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <Capsule variant="primary" dot glow>
              <Sparkles className="h-3.5 w-3.5" /> The Vizo Tool Blog
            </Capsule>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              Learn faster with{" "}
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                hands-on guides
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
              Practical tutorials for image editing, developer workflows, SEO and more — written by
              people who build tools, with live tools embedded right inside the articles.
            </p>

            {/* Stats row */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <Newspaper className="h-4 w-4 text-primary" /> {posts.length}+ articles
              </span>
              <span className="flex items-center gap-1.5">
                <PenLine className="h-4 w-4 text-primary" /> {categories.length} categories
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-primary" /> Fresh guides weekly
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container-page pb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
              <Sparkles className="h-5 w-5 text-amber-500" /> Featured
            </h2>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-300">
              Hand-picked reads
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {featured.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Explorer */}
      <section className="container-page pb-16">
        <BlogExplorer posts={posts} categories={categories} tags={tags} />

        {/* Browse categories CTA */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/category/${c.slug}`}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-primary/40 hover:text-primary"
            >
              <BookOpen className="h-4 w-4 text-primary" />
              {c.name}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-page pb-16">
        <NewsletterForm />
      </section>
    </PageTransition>
  );
}
