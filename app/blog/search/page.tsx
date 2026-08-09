import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageTransition } from "@/components/shared/PageTransition";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Capsule } from "@/components/ui/capsule";
import { GridPattern } from "@/components/ui/grid-pattern";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { NewsletterForm } from "@/components/blog/ClientBlocks";
import { buildMetadata, webPageSchema } from "@/lib/seo";
import { getBlogRepository } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Search Articles — Vizo Tool Blog",
  description:
    "Search every guide, tutorial and how-to on the Vizo Tool blog — image editing, developer tools, SEO, finance and YouTube creators.",
  path: "/blog/search",
  keywords: ["search blog", "articles", "guides", "tutorials", "vizo tool"],
});

export default async function BlogSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const repo = getBlogRepository();
  const [posts, categories, tags] = await Promise.all([
    repo.listPublished({ pageSize: 100 }),
    repo.getCategories(),
    repo.getTags(),
  ]);

  return (
    <PageTransition>
      <Breadcrumbs items={[{ label: "Blog", href: "/blogs" }, { label: "Search" }]} />
      <JsonLd
        data={webPageSchema({
          name: "Search Articles",
          description: "Search all Vizo Tool blog articles by title, topic, tag or author.",
          url: "/blog/search",
        })}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <BackgroundBeams />
        <GridPattern />
        <div className="relative container-page py-14 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <Capsule variant="primary" dot glow>
              <Search className="h-3.5 w-3.5" /> Search the blog
            </Capsule>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              Find the guide{" "}
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                you need
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
              {posts.items.length} free articles on image editing, developer tools, SEO, finance
              calculators and YouTube growth — search by title, topic, tag or author.
            </p>
          </div>
        </div>
      </section>

      {/* Explorer with instant client search */}
      <section className="container-page pb-16">
        <BlogExplorer
          posts={posts.items}
          categories={categories}
          tags={tags}
          initialQuery={q}
        />
      </section>

      {/* Newsletter */}
      <section className="container-page pb-16">
        <NewsletterForm />
      </section>
    </PageTransition>
  );
}
