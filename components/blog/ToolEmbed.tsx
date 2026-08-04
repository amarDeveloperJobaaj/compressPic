import Link from "next/link";
import { ArrowUpRight, Download, ExternalLink, Sparkles, Wrench } from "lucide-react";
import { getToolRef } from "@/lib/blog/service";

const TILE_GRADIENTS = [
  "from-primary to-sky-500",
  "from-violet-500 to-fuchsia-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-cyan-500 to-blue-500",
];

function gradientFor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return TILE_GRADIENTS[hash % TILE_GRADIENTS.length];
}

/** Live interactive tool embedded inside the article (same-origin iframe). */
export function ToolEmbed({ toolSlug }: { toolSlug: string }) {
  const tool = getToolRef(toolSlug);
  if (!tool) return null;

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-black/5">
      {/* Frame header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-background/60 px-4 py-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradientFor(tool.slug)} text-sm font-bold text-white shadow-md`}
        >
          {tool.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{tool.name}</p>
          <p className="truncate text-xs text-text-muted">
            Live tool — try it right here, no uploads
          </p>
        </div>
        <span className="hidden items-center gap-1 rounded-full bg-success-light px-2.5 py-1 text-[11px] font-semibold text-success sm:inline-flex">
          <Sparkles className="h-3 w-3" /> Interactive
        </span>
        <Link
          href={tool.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open full screen
        </Link>
      </div>

      {/* The tool itself */}
      <iframe
        src={tool.href}
        title={`${tool.name} — interactive tool`}
        loading="lazy"
        className="h-[540px] w-full border-0 bg-background"
      />
    </div>
  );
}

/** Bold CTA banner pointing to a tool. */
export function ToolCta({
  toolSlug,
  title,
  text,
}: {
  toolSlug: string;
  title: string;
  text: string;
}) {
  const tool = getToolRef(toolSlug);
  if (!tool) return null;
  return (
    <div className="relative my-8 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-surface to-sky-500/10 p-6 sm:p-8">
      <div className="pointer-events-none absolute -left-16 -bottom-20 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Wrench className="h-3.5 w-3.5" /> Free tool
          </span>
          <h3 className="mt-3 text-lg font-bold text-text-primary sm:text-xl">{title}</h3>
          <p className="mt-1.5 max-w-lg text-sm text-text-secondary">{text}</p>
        </div>
        <Link
          href={tool.href}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40 active:translate-y-px"
        >
          Try it now
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

/** Compact related-tool card (used in the article sidebar + inside content). */
export function RelatedToolCard({ toolSlug }: { toolSlug: string }) {
  const tool = getToolRef(toolSlug);
  if (!tool) return null;
  return (
    <Link
      href={tool.href}
      className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5 transition-all hover:border-primary/40 hover:bg-primary-light/30"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradientFor(tool.slug)} text-base font-bold text-white shadow`}
      >
        {tool.name.charAt(0)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-text-primary group-hover:text-primary">
          {tool.name}
        </span>
        <span className="block truncate text-xs text-text-muted">{tool.tagline}</span>
      </span>
      <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

/** Download-focused CTA. */
export function DownloadCta({
  title,
  text,
  href,
  buttonLabel,
}: {
  title: string;
  text: string;
  href: string;
  buttonLabel: string;
}) {
  return (
    <div className="my-8 rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <p className="mt-1.5 max-w-lg text-sm text-text-secondary">{text}</p>
        </div>
        <Link
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-text-primary px-6 py-3 text-sm font-semibold text-background shadow-lg transition-all hover:opacity-90 active:translate-y-px"
        >
          <Download className="h-4 w-4" />
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}
