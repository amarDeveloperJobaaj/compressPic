/**
 * Blog SEO generation — metadata + JSON-LD built from a single post.
 *
 * Reuses the site-wide builders in lib/seo.ts (articleSchema,
 * breadcrumbListSchema, faqPageSchema, howToSchema, personSchema,
 * webPageSchema, softwareApplicationSchema) so every blog gets consistent,
 * valid structured data without duplicating logic.
 */
import type { Metadata } from "next";

import {
  articleSchema,
  breadcrumbListSchema,
  faqPageSchema,
  howToSchema,
  ogImageUrl,
  personSchema,
  SITE_URL,
  softwareApplicationSchema,
  webPageSchema,
} from "@/lib/seo";

import { extractFaqs, extractSteps } from "./content";
import { getEmbeddedToolSlugs, getToolRef } from "./service";
import type { BlogPost } from "./types";

export interface BlogSeoOptions {
  /** Path the post is served at (e.g. `/blog/how-to-compress-images`). */
  path: string;
  /** Site name used in titles, e.g. "Vizo Tool Blog". */
  siteTitle?: string;
}

/** Unique Metadata for a blog post (drafts get noindex so they never rank). */
export function generateBlogMetadata(post: BlogPost, options: BlogSeoOptions): Metadata {
  const siteTitle = options.siteTitle ?? "Vizo Tool";
  const title = post.seo?.metaTitle ?? `${post.title} | ${siteTitle}`;
  const description = post.seo?.metaDescription ?? post.excerpt;
  const image = post.seo?.ogImage ?? post.cover ?? ogImageUrl(post.title);
  const canonicalPath = options.path;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      url: `${SITE_URL}${canonicalPath}`,
      siteName: siteTitle,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.seo?.twitterImage ?? image],
    },
    keywords: [...post.tags, ...(post.seo?.keywords ?? [])],
    robots: {
      index: post.status === "published",
      follow: post.status === "published",
    },
  };
}

/**
 * Complete JSON-LD for a post: Article + Breadcrumb + FAQ (from faq blocks) +
 * HowTo (from steps blocks) + Person (author) + WebPage + SoftwareApplication
 * for every embedded tool. Returns an array — render each with <script> tags.
 */
export function buildBlogJsonLd(post: BlogPost, path: string) {
  const schemas: Record<string, unknown>[] = [];

  schemas.push(
    articleSchema({
      title: post.title,
      description: post.excerpt || post.subtitle,
      url: path,
      image: post.cover,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authorName: post.author,
      keywords: post.tags,
    })
  );

  schemas.push(
    breadcrumbListSchema([
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blogs" },
      { name: post.category, url: `/blog/category/${post.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` },
      { name: post.title },
    ])
  );

  const faqs = extractFaqs(post);
  if (faqs.length) schemas.push(faqPageSchema(faqs));

  const steps = extractSteps(post);
  if (steps.length) {
    schemas.push(
      howToSchema({
        name: post.title,
        description: post.subtitle || post.excerpt,
        steps,
      })
    );
  }

  schemas.push(
    personSchema({
      name: post.author,
      role: post.authorRole ?? "Author",
      description: post.subtitle || post.excerpt,
    })
  );

  schemas.push(webPageSchema({ name: post.title, description: post.excerpt, url: path }));

  for (const slug of getEmbeddedToolSlugs(post)) {
    const tool = getToolRef(slug);
    if (tool) {
      schemas.push(
        softwareApplicationSchema({
          name: tool.name,
          description: tool.description,
          url: tool.href,
        })
      );
    }
  }

  return schemas;
}
