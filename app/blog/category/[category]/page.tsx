import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageTransition } from "@/components/shared/PageTransition";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BlogCard } from "@/components/blog/BlogCard";
import { buildMetadata, breadcrumbListSchema } from "@/lib/seo";
import { getBlogRepository } from "@/lib/blog/repository";

export const revalidate = 60;

export async function generateStaticParams() {
  // Repository may be Supabase-backed (cookies() unavailable at build time) —
  // fall back to on-demand ISR rendering rather than failing the build.
  try {
    const categories = await getBlogRepository().getCategories();
    return categories.map((category) => ({ category: category.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categories = await getBlogRepository().getCategories();
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return {};
  return buildMetadata({
    title: `${cat.name} Articles & Guides`,
    description: cat.description,
    path: `/blog/category/${cat.slug}`,
    keywords: [cat.name.toLowerCase(), "guides", "tutorials", "how to"],
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const repo = getBlogRepository();
  const [categories, listing] = await Promise.all([
    repo.getCategories(),
    repo.listPublished({ category, pageSize: 100 }),
  ]);
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  const posts = listing.items;
  const others = categories.filter((c) => c.slug !== category);

  return (
    <PageTransition>
      <Breadcrumbs
        items={[{ label: "Blog", href: "/blogs" }, { label: cat.name }]}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blogs" },
          { name: cat.name, url: `/blog/category/${cat.slug}` },
        ])}
      />

      <section className="relative overflow-hidden">
        <BackgroundBeams />
        <div className="relative container-page py-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <FolderOpen className="h-3.5 w-3.5" /> Category
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {cat.name}
            </h1>
            <p className="mt-3 text-text-secondary">{cat.description}</p>
            <p className="mt-4 text-sm font-medium text-text-muted">
              {posts.length} article{posts.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </section>

      <section className="container-page pb-16">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center text-sm text-text-muted">
            No articles in this category yet — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
          {others.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/category/${c.slug}`}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-primary/40 hover:text-primary"
            >
              {c.name}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
