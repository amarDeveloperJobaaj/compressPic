import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Hash } from "lucide-react";
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
    const tags = await getBlogRepository().getTags();
    return tags.map((tag) => ({ tag: tag.name.toLowerCase() }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const tags = await getBlogRepository().getTags();
  const match = tags.find((t) => t.name.toLowerCase() === tag.toLowerCase());
  if (!match) return {};
  return buildMetadata({
    title: `${match.name} — Articles & Guides`,
    description: `All Vizo Tool articles tagged with “${match.name}”.`,
    path: `/blog/tag/${encodeURIComponent(tag)}`,
    keywords: [match.name, "blog", "guides"],
  });
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const repo = getBlogRepository();
  const [tags, listing] = await Promise.all([
    repo.getTags(),
    repo.listPublished({ tag, pageSize: 100 }),
  ]);
  const match = tags.find((t) => t.name.toLowerCase() === tag.toLowerCase());
  if (!match) notFound();

  const posts = listing.items;
  const otherTags = tags
    .filter((t) => t.name.toLowerCase() !== tag.toLowerCase())
    .slice(0, 12);

  return (
    <PageTransition>
      <Breadcrumbs items={[{ label: "Blog", href: "/blogs" }, { label: `#${match.name}` }]} />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blogs" },
          { name: match.name, url: `/blog/tag/${encodeURIComponent(tag)}` },
        ])}
      />

      <section className="relative overflow-hidden">
        <BackgroundBeams />
        <div className="relative container-page py-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <Hash className="h-3.5 w-3.5" /> Tag
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              #{match.name}
            </h1>
            <p className="mt-3 text-text-secondary">
              {posts.length} article{posts.length === 1 ? "" : "s"} tagged with #{match.name}.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page pb-16">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center text-sm text-text-muted">
            No articles with this tag yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {otherTags.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
            {otherTags.map((t) => (
              <Link
                key={t.name}
                href={`/blog/tag/${t.name.toLowerCase()}`}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-primary/40 hover:text-primary"
              >
                #{t.name}
                <span className="ml-1 text-xs opacity-60">{t.count}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  );
}
