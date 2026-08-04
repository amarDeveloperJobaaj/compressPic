import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Lightbulb,
  Quote,
  TrendingUp,
  XCircle,
} from "lucide-react";
import type { BlogBlock as Block } from "@/lib/blog/types";
import { buildHeadingRefs } from "@/lib/blog/utils";
import { cn } from "@/lib/utils";
import {
  Accordion,
  BeforeAfterSlider,
  CodeBlock,
  NewsletterForm,
} from "./ClientBlocks";
import {
  DownloadCta,
  RelatedToolCard,
  ToolCta,
  ToolEmbed,
} from "./ToolEmbed";

/** Extract a YouTube / Vimeo embed id from common URL shapes. */
function videoEmbed(url: string): { kind: "youtube" | "vimeo"; id: string } | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) return { kind: "youtube", id: yt[1] };
  const vm = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vm) return { kind: "vimeo", id: vm[1] };
  return null;
}

const ALERT_STYLES: Record<string, { box: string; titleColor: string; Icon: React.ElementType }> = {
  info: {
    box: "border-sky-500/30 bg-sky-500/10",
    titleColor: "text-sky-700 dark:text-sky-300",
    Icon: Info,
  },
  success: {
    box: "border-emerald-500/30 bg-emerald-500/10",
    titleColor: "text-emerald-700 dark:text-emerald-300",
    Icon: CheckCircle2,
  },
  warning: {
    box: "border-amber-500/30 bg-amber-500/10",
    titleColor: "text-amber-700 dark:text-amber-300",
    Icon: AlertTriangle,
  },
  error: {
    box: "border-rose-500/30 bg-rose-500/10",
    titleColor: "text-rose-700 dark:text-rose-300",
    Icon: XCircle,
  },
  tip: {
    box: "border-violet-500/30 bg-violet-500/10",
    titleColor: "text-violet-700 dark:text-violet-300",
    Icon: Lightbulb,
  },
};

export function BlogBlocks({
  blocks,
  author = "",
  authorRole = "",
}: {
  blocks: Block[];
  author?: string;
  authorRole?: string;
}) {
  // Unique anchors for headings — shared with the article TOC so links match.
  const headingRefs = buildHeadingRefs(blocks);
  let headingIndex = 0;

  return (
    <div className="space-y-0">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const id = headingRefs[headingIndex++]?.id ?? `section-${index}`;
            const classes = {
              2: "mt-10 mb-4 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl",
              3: "mt-8 mb-3 text-xl font-bold tracking-tight text-text-primary",
              4: "mt-6 mb-2 text-lg font-semibold text-text-primary",
            }[block.level];
            const Tag = `h${block.level}` as "h2" | "h3" | "h4";
            return (
              <Tag key={index} id={id} className={cn(classes, "scroll-mt-24")}>
                {block.text}
              </Tag>
            );
          }

          case "paragraph":
            return (
              <p key={index} className="my-4 leading-relaxed text-text-secondary">
                {block.text}
              </p>
            );

          case "quote":
            return (
              <blockquote
                key={index}
                className="my-6 border-l-4 border-primary bg-primary-light/30 px-5 py-4"
              >
                <Quote className="mb-2 h-5 w-5 text-primary/60" />
                <p className="text-lg font-medium leading-relaxed text-text-primary">{block.text}</p>
                {block.cite && (
                  <cite className="mt-2 block text-sm not-italic text-text-muted">— {block.cite}</cite>
                )}
              </blockquote>
            );

          case "code":
            return <CodeBlock key={index} code={block.code} language={block.language} />;

          case "terminal":
            return <CodeBlock key={index} code={block.lines} terminal />;

          case "alert": {
            const style = ALERT_STYLES[block.tone] ?? ALERT_STYLES.info;
            const Icon = style.Icon;
            return (
              <div key={index} className={cn("my-6 rounded-xl border px-5 py-4", style.box)}>
                <div className="flex items-start gap-3">
                  <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", style.titleColor)} />
                  <div>
                    <p className={cn("text-sm font-semibold", style.titleColor)}>{block.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">{block.text}</p>
                  </div>
                </div>
              </div>
            );
          }

          case "callout":
            return (
              <div
                key={index}
                className="my-6 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-surface to-sky-500/10 p-5"
              >
                <p className="text-sm font-bold uppercase tracking-wide text-primary">{block.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{block.text}</p>
              </div>
            );

          case "checklist":
            return (
              <ul key={index} className="my-5 space-y-2.5">
                {block.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "list":
            return block.ordered ? (
              <ol key={index} className="my-5 list-decimal space-y-2 pl-5 text-sm text-text-secondary marker:font-semibold marker:text-primary">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="my-5 list-disc space-y-2 pl-5 text-sm text-text-secondary marker:text-primary">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );

          case "table": {
            const isPricing = block.kind === "pricing";
            return (
              <div key={index} className="my-6 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-background/80">
                      {block.columns.map((col, i) => (
                        <th
                          key={i}
                          className={cn(
                            "border-b border-border px-4 py-3 text-left font-semibold text-text-primary",
                            isPricing && i > 0 && "text-center"
                          )}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} className={cn("transition-colors hover:bg-primary-light/30", ri % 2 === 1 && "bg-background/50")}>
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={cn(
                              "border-b border-border px-4 py-3 text-text-secondary",
                              isPricing && ci > 0 && "text-center font-semibold text-primary"
                            )}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case "prosCons":
            return (
              <div key={index} className="my-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-success/30 bg-success-light/20 p-5">
                  <p className="flex items-center gap-2 text-sm font-bold text-success">
                    <CheckCircle2 className="h-4 w-4" /> Pros
                  </p>
                  <ul className="mt-3 space-y-2">
                    {block.pros.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-5">
                  <p className="flex items-center gap-2 text-sm font-bold text-rose-600 dark:text-rose-300">
                    <XCircle className="h-4 w-4" /> Cons
                  </p>
                  <ul className="mt-3 space-y-2">
                    {block.cons.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );

          case "image":
            return (
              <figure key={index} className="my-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.src}
                  alt={block.alt}
                  loading="lazy"
                  className="w-full rounded-xl border border-border shadow-lg"
                />
                {block.caption && (
                  <figcaption className="mt-2 text-center text-xs text-text-muted">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "gallery":
            return (
              <div key={index} className="my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {block.images.map((img, i) => (
                  <figure key={i} className="overflow-hidden rounded-xl border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="aspect-video h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </figure>
                ))}
              </div>
            );

          case "beforeAfter":
            return (
              <BeforeAfterSlider
                key={index}
                before={block.before}
                after={block.after}
                labelBefore={block.labelBefore}
                labelAfter={block.labelAfter}
              />
            );

          case "timeline":
            return (
              <ol key={index} className="my-6 space-y-0 border-l-2 border-primary/20 pl-6">
                {block.items.map((item, i) => (
                  <li key={i} className="relative pb-6 last:pb-0">
                    <span className="absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-surface">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                    <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">{item.text}</p>
                  </li>
                ))}
              </ol>
            );

          case "steps":
            return (
              <ol key={index} className="my-6 space-y-4">
                {block.items.map((item, i) => (
                  <li key={i} className="flex gap-4 rounded-xl border border-border bg-surface p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-sm font-bold text-white shadow-md">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-text-secondary">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            );

          case "accordion":
            return (
              <Accordion
                key={index}
                items={block.items.map((i) => ({ title: i.title, text: i.text }))}
              />
            );

          case "faq":
            return (
              <div key={index} className="my-6">
                <h3 className="mb-3 text-lg font-bold text-text-primary">
                  Frequently asked questions
                </h3>
                <Accordion items={block.items.map((i) => ({ title: i.question, text: i.answer }))} />
              </div>
            );

          case "stats":
            return (
              <div key={index} className="my-6 grid gap-3 sm:grid-cols-3">
                {block.items.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-surface p-5 text-center shadow-sm"
                  >
                    <p className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-2xl font-extrabold text-transparent">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-text-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            );

          case "chartPlaceholder":
            return (
              <div key={index} className="my-6 rounded-2xl border border-dashed border-border bg-background/60 p-8 text-center">
                <TrendingUp className="mx-auto h-8 w-8 text-text-muted" />
                <p className="mt-2 text-sm font-semibold text-text-primary">{block.title}</p>
                <p className="mt-1 text-xs text-text-muted">{block.note}</p>
              </div>
            );

          case "video": {
            const embed = videoEmbed(block.url);
            if (!embed) {
              return (
                <div key={index} className="my-6 rounded-xl border border-border bg-surface p-5">
                  <p className="text-sm text-text-secondary">Watch: {block.url}</p>
                </div>
              );
            }
            return (
              <figure key={index} className="my-6">
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-border shadow-lg">
                  <iframe
                    src={
                      embed.kind === "youtube"
                        ? `https://www.youtube-nocookie.com/embed/${embed.id}`
                        : `https://player.vimeo.com/video/${embed.id}`
                    }
                    title={block.caption ?? "Embedded video"}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-2 text-center text-xs text-text-muted">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          case "toolEmbed":
            return <ToolEmbed key={index} toolSlug={block.toolSlug} />;

          case "downloadCta":
            return (
              <DownloadCta
                key={index}
                title={block.title}
                text={block.text}
                href={block.href}
                buttonLabel={block.buttonLabel}
              />
            );

          case "toolCta":
            return (
              <ToolCta key={index} toolSlug={block.toolSlug} title={block.title} text={block.text} />
            );

          case "relatedToolCard":
            return (
              <div key={index} className="my-4">
                <RelatedToolCard toolSlug={block.toolSlug} />
              </div>
            );

          case "authorCard":
            return (
              <div key={index} className="my-8 flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-xl font-bold text-white shadow-lg">
                  {author.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{author}</p>
                  <p className="text-xs text-text-muted">{authorRole}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    Written by {author}, who builds fast, private, browser-based tools that save people time.
                  </p>
                </div>
              </div>
            );

          case "newsletterCard":
            return <NewsletterForm key={index} />;

          case "divider":
            return (
              <div key={index} className="my-8 flex items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-border" />
                <span className="flex items-center gap-1 text-primary/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
            );

          case "customHtml":
            return (
              <div
                key={index}
                className="my-6"
                // Admin-authored custom HTML — only trusted editors can reach the admin panel.
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            );

          default:
            return null;
        }
      })}

    </div>
  );
}
