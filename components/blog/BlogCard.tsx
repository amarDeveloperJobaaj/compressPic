import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays } from "lucide-react";
import { Capsule } from "@/components/ui/capsule";
import type { BlogSummary } from "@/lib/blog/service";

const CATEGORY_VARIANT: Record<string, "primary" | "success" | "purple" | "sky" | "rose" | "amber" | "teal" | "fuchsia"> = {
  "Image Editing": "primary",
  "Developer Tools": "sky",
  "SEO & Marketing": "amber",
  "Finance & Calculators": "success",
  "YouTube Creators": "rose",
  "Guides & How-Tos": "teal",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogCard({ post }: { post: BlogSummary }) {
  const variant = CATEGORY_VARIANT[post.category] ?? "primary";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Cover */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.cover}
          alt={post.coverAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3">
          <Capsule variant={variant} sm glow={false}>
            {post.category}
          </Capsule>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-text-primary transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">
          {post.excerpt}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 text-xs text-text-muted">
          <span className="flex items-center gap-1.5 font-medium text-text-secondary">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-[9px] font-bold text-white">
              {post.author.charAt(0)}
            </span>
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
          <ArrowUpRight className="ml-auto h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
