import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Newspaper,
  PenLine,
  Twitter,
  UserRound,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageTransition } from "@/components/shared/PageTransition";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Capsule } from "@/components/ui/capsule";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterForm } from "@/components/blog/ClientBlocks";
import {
  buildMetadata,
  breadcrumbListSchema,
  personSchema,
  webPageSchema,
} from "@/lib/seo";
import { getBlogRepository } from "@/lib/blog/repository";

export const revalidate = 60;

export async function generateStaticParams() {
  // Repository may be Supabase-backed (cookies() unavailable at build time) —
  // fall back to on-demand ISR rendering rather than failing the build.
  try {
    const { items } = await getBlogRepository().listPublished({ pageSize: 100 });
    return [...new Set(items.map((p) => p.authorSlug).filter(Boolean))].map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getBlogRepository().getAuthorBySlug(slug);
  if (!author) return {};
  return buildMetadata({
    title: `${author.name} — Author at Vizo Tool Blog`,
    description: author.bio || `Articles written by ${author.name} on the Vizo Tool blog.`,
    path: `/blog/author/${slug}`,
    keywords: [author.name.toLowerCase(), "blog author", "guides", "vizo tool"],
  });
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const repo = getBlogRepository();
  const [author, listing, categories] = await Promise.all([
    repo.getAuthorBySlug(slug),
    repo.listPublished({ author: slug, pageSize: 100 }),
    repo.getCategories(),
  ]);
  if (!author) notFound();

  const posts = listing.items;
  const totalReads = posts.reduce((sum, p) => sum + p.readCount, 0);
  const url = `/blog/author/${slug}`;

  const socials: { label: string; href: string; Icon: React.ComponentType<{ className?: string }> }[] = [];
  if (author.twitter) socials.push({ label: "Twitter / X", href: author.twitter, Icon: Twitter });
  if (author.linkedin) socials.push({ label: "LinkedIn", href: author.linkedin, Icon: Linkedin });
  if (author.instagram) socials.push({ label: "Instagram", href: author.instagram, Icon: Instagram });
  if (author.website) socials.push({ label: "Website", href: author.website, Icon: Globe });
  if (author.email) socials.push({ label: "Email", href: `mailto:${author.email}`, Icon: Mail });

  return (
    <PageTransition>
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blogs" },
          { label: "Authors", href: "/blogs" },
          { label: author.name },
        ]}
      />

      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blogs" },
          { name: author.name, url },
        ])}
      />
      <JsonLd
        data={personSchema({
          name: author.name,
          role: author.role,
          description: author.bio || `Author on the Vizo Tool blog.`,
        })}
      />
      <JsonLd
        data={webPageSchema({
          name: `${author.name} — Author`,
          description: author.bio || `Articles written by ${author.name}.`,
          url,
        })}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <BackgroundBeams />
        <div className="relative container-page py-14 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <UserRound className="h-3.5 w-3.5" /> Author profile
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {author.name}
            </h1>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-text-muted">
              {author.role}
            </p>
            {author.bio && (
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-text-secondary">
                {author.bio}
              </p>
            )}

            {/* Stats */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <Newspaper className="h-4 w-4 text-primary" /> {posts.length} article
                {posts.length === 1 ? "" : "s"}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary" />{" "}
                {totalReads.toLocaleString()} reads
              </span>
              <span className="flex items-center gap-1.5">
                <PenLine className="h-4 w-4 text-primary" /> Practical, ad-free guides
              </span>
            </div>

            {/* Socials */}
            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="container-page pb-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-text-primary">Articles by {author.name}</h2>
          <Capsule variant="primary" sm dot>
            {posts.length} posts
          </Capsule>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center text-sm text-text-muted">
            No published articles yet — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Browse categories CTA */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
          {categories.slice(0, 6).map((c) => (
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
