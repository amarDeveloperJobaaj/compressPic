import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  PenLine,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageTransition } from "@/components/shared/PageTransition";
import { Capsule } from "@/components/ui/capsule";
import { BlogBlocks } from "@/components/blog/BlogBlocks";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterForm } from "@/components/blog/ClientBlocks";
import { RelatedToolCard } from "@/components/blog/ToolEmbed";
import {
  ArticleActions,
  BackToTop,
  CommentSection,
  ReadingProgressBar,
  ShareButtons,
  Toc,
} from "@/components/blog/ArticleChrome";
import {
  SITE_URL,
  articleSchema,
  breadcrumbListSchema,
  buildMetadata,
  faqPageSchema,
  howToSchema,
  personSchema,
  softwareApplicationSchema,
  webPageSchema,
} from "@/lib/seo";
import { buildHeadingRefs } from "@/lib/blog/utils";
import { getBlogRepository } from "@/lib/blog/repository";
import { isAdmin } from "@/lib/admin/session";
import type { BlogPost } from "@/lib/blog/types";
import {
  getEmbeddedToolSlugs,
  getRelatedTools,
  getToolRef,
} from "@/lib/blog/service";

// The article page reads the request cookies to decide whether a logged-in
// admin may preview drafts (isAdmin). That forces a fully dynamic render —
// which also guarantees production `next start` never attempts a static
// generation for unknown slugs (the root cause of the earlier 500s).
export const dynamic = "force-dynamic";

/**
 * Resolve the post to render: published posts for everyone, plus any-status
 * drafts/scheduled for logged-in admins (draft preview).
 */
async function resolvePost(slug: string): Promise<{ post: BlogPost | null; preview: boolean }> {
  const repo = getBlogRepository();
  const published = await repo.getPostBySlug(slug);
  if (published) return { post: published, preview: false };
  if (await isAdmin()) {
    const draft = await repo.getPostBySlugForPreview(slug);
    if (draft) return { post: draft, preview: true };
  }
  return { post: null, preview: false };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { post, preview } = await resolvePost(slug);
  if (!post) return {};

  const seo = post.seo;
  const meta = buildMetadata({
    title: `${preview ? "Draft preview: " : ""}${seo?.metaTitle ?? post.title}`,
    description: seo?.metaDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: [...post.tags, post.category, "vizo tool"],
    type: "article",
  });

  // Drafts/scheduled posts are never indexed — they must not leak to search
  // engines even when the admin is previewing them.
  if (preview) {
    meta.robots = { index: false, follow: false, nocache: true };
  }

  // Blog covers are real images (OG-style) — surface them in OG/Twitter tags.
  const ogImage = seo?.ogImage ?? post.cover;
  if (ogImage) {
    meta.openGraph = {
      ...meta.openGraph,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    };
    meta.twitter = { ...meta.twitter, images: [ogImage] };
  }
  return meta;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const repo = getBlogRepository();
  const { post, preview } = await resolvePost(slug);
  // Drafts are never served to anonymous visitors — only a logged-in admin
  // gets the preview (see resolvePost above).
  if (!post) notFound();

  const url = `/blog/${post.slug}`;
  const absoluteUrl = `${SITE_URL}${url}`;
  const tocItems = buildHeadingRefs(post.content);
  const [relatedPosts, prevNext, categories, initialComments] = await Promise.all([
    repo.getRelatedPosts(post),
    repo.getPrevNext(post),
    repo.getCategories(),
    repo.listComments(post.id),
  ]);
  const { prev, next } = prevNext;
  const relatedTools = getRelatedTools(post);
  const embeddedSlugs = getEmbeddedToolSlugs(post);
  const categorySlug = categories.find((c) => c.name === post.category)?.slug;

  // Schema content from the post's own blocks
  const faqItems = post.content
    .filter((b): b is Extract<typeof b, { type: "faq" }> => b.type === "faq")
    .flatMap((b) => b.items);
  const howToSteps = post.content
    .filter((b): b is Extract<typeof b, { type: "steps" }> => b.type === "steps")
    .flatMap((b) => b.items);

  return (
    <PageTransition>
      <ReadingProgressBar />
      <BackToTop />

      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blogs" },
          ...(categorySlug
            ? [{ label: post.category, href: `/blog/category/${categorySlug}` }]
            : []),
          { label: post.title },
        ]}
      />

      {/* JSON-LD */}
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.excerpt,
          url,
          image: post.cover,
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt,
          authorName: post.author,
          keywords: post.tags,
        })}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blogs" },
          ...(categorySlug
            ? [{ name: post.category, url: `/blog/category/${categorySlug}` }]
            : []),
          { name: post.title, url },
        ])}
      />
      <JsonLd
        data={webPageSchema({
          name: post.title,
          description: post.excerpt,
          url,
        })}
      />
      <JsonLd
        data={personSchema({
          name: post.author,
          role: post.authorRole ?? "Author",
          description: `Author of “${post.title}” on the Vizo Tool blog.`,
        })}
      />
      {faqItems.length > 0 && (
        <JsonLd data={faqPageSchema(faqItems.map((f) => ({ question: f.question, answer: f.answer })))} />
      )}
      {howToSteps.length > 0 && (
        <JsonLd
          data={howToSchema({
            name: post.title,
            description: post.excerpt,
            steps: howToSteps.map((s) => ({ name: s.title, text: s.text })),
          })}
        />
      )}
      {embeddedSlugs.map((toolSlug) => {
        const tool = getToolRef(toolSlug);
        if (!tool) return null;
        return (
          <JsonLd
            key={toolSlug}
            data={softwareApplicationSchema({
              name: tool.name,
              description: tool.description,
              url: tool.href,
            })}
          />
        );
      })}

      <article className="container-page pb-16">
        {/* Admin draft preview banner — never indexed (see generateMetadata) */}
        {preview && (
          <div className="mx-auto mb-6 flex max-w-3xl items-center gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3" role="status">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-500">
              <PenLine className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-300">
                Draft preview — not visible to visitors
              </p>
              <p className="text-xs text-text-muted">
                This page is only shown to logged-in admins and is excluded from search engines.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            {categorySlug ? (
              <Link href={`/blog/category/${categorySlug}`}>
                <Capsule variant="primary" sm>
                  {post.category}
                </Capsule>
              </Link>
            ) : (
              <Capsule variant="primary" sm>
                {post.category}
              </Capsule>
            )}
            {post.tags.slice(0, 3).map((tag) => (
              <Link key={tag} href={`/blog/tag/${tag.toLowerCase()}`}>
                <Capsule variant="sky" sm glow={false}>
                  #{tag}
                </Capsule>
              </Link>
            ))}
            {post.authorSlug && (
              <Link href={`/blog/author/${post.authorSlug}`}>
                <Capsule variant="success" sm glow={false}>
                  By {post.author}
                </Capsule>
              </Link>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-text-secondary">{post.subtitle}</p>

          {/* Author + meta row */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border py-4 text-sm text-text-muted">
            <span className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-sm font-bold text-white shadow-md">
                {post.author.charAt(0)}
              </span>
              <span>
                <span className="block text-sm font-semibold text-text-primary">{post.author}</span>
                <span className="block text-xs">{post.authorRole}</span>
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {formatDate(post.publishedAt)}
            </span>
            {post.updatedAt !== post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4" /> Updated {formatDate(post.updatedAt)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> {post.readTime}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <ShareButtons title={post.title} url={absoluteUrl} />
            <ArticleActions slug={post.slug} postId={post.id} preview={preview} />
          </div>
        </header>

        {/* Cover */}
        <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-border shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover} alt={post.coverAlt} className="w-full" />
        </div>

        {/* Body: content + sticky sidebar */}
        <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <BlogBlocks blocks={post.content} author={post.author} authorRole={post.authorRole} />
          </div>

          {/* Sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <Toc items={tocItems} />
              {relatedTools.length > 0 && (
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Tools mentioned
                  </p>
                  <div className="mt-2.5 space-y-2">
                    {relatedTools.map((tool) => (
                      <RelatedToolCard key={tool.slug} toolSlug={tool.slug} />
                    ))}
                  </div>
                </div>
              )}
              <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-4">
                <p className="flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <UserRound className="h-3.5 w-3.5" /> Author
                </p>
                {post.authorSlug ? (
                  <Link
                    href={`/blog/author/${post.authorSlug}`}
                    className="mt-2 block text-sm font-semibold text-text-primary transition-colors hover:text-primary"
                  >
                    {post.author}
                  </Link>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-text-primary">{post.author}</p>
                )}
                <p className="mt-0.5 text-xs text-text-muted">{post.authorRole}</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Prev / Next */}
        {(prev || next) && (
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </span>
                <span className="mt-2 line-clamp-2 block text-sm font-semibold text-text-primary transition-colors group-hover:text-primary">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="group rounded-2xl border border-border bg-surface p-5 text-right transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <span className="flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="mt-2 line-clamp-2 block text-sm font-semibold text-text-primary transition-colors group-hover:text-primary">
                  {next.title}
                </span>
              </Link>
            )}
          </div>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mx-auto mt-14 max-w-5xl">
            <h2 className="mb-5 text-xl font-bold text-text-primary">Related articles</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <BlogCard key={related.id} post={related} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter + comments */}
        <div className="mx-auto mt-14 max-w-3xl space-y-12">
          <NewsletterForm />
          <CommentSection postId={post.id} initialComments={initialComments} />
        </div>
      </article>
    </PageTransition>
  );
}
