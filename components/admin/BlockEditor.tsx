"use client";

import {
  ArrowDown,
  ArrowUp,
  Code2,
  Copy,
  FileCode2,
  GripVertical,
  Image as ImageIcon,
  List,
  ListChecks,
  MessageSquare,
  Milestone,
  Minus,
  Plus,
  Quote,
  Rows3,
  SlidersHorizontal,
  Sparkles,
  SquareCode,
  TextCursorInput,
  Trash2,
  Video,
  Wand2,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { ALL_TOOLS } from "@/lib/tools";
import type { BlogBlock } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Defaults for every block type                                       */
/* ------------------------------------------------------------------ */

export const DEFAULT_BLOCKS: Record<BlogBlock["type"], () => BlogBlock> = {
  heading: () => ({ type: "heading", level: 2, text: "New heading" }),
  paragraph: () => ({ type: "paragraph", text: "" }),
  quote: () => ({ type: "quote", text: "", cite: "" }),
  code: () => ({ type: "code", code: "// your code here", language: "ts" }),
  terminal: () => ({ type: "terminal", lines: "npm run dev" }),
  alert: () => ({ type: "alert", tone: "info", title: "Note", text: "" }),
  callout: () => ({ type: "callout", title: "Key point", text: "" }),
  checklist: () => ({ type: "checklist", items: ["Item one", "Item two"] }),
  list: () => ({ type: "list", ordered: false, items: ["Item one", "Item two"] }),
  table: () => ({
    type: "table",
    kind: "features",
    columns: ["Column A", "Column B"],
    rows: [["Row 1", "Value"]],
  }),
  prosCons: () => ({ type: "prosCons", pros: ["Advantage"], cons: ["Disadvantage"] }),
  image: () => ({ type: "image", src: "/og?title=Cover", alt: "", caption: "" }),
  gallery: () => ({
    type: "gallery",
    images: [
      { src: "/og?title=Image 1", alt: "" },
      { src: "/og?title=Image 2", alt: "" },
    ],
  }),
  beforeAfter: () => ({
    type: "beforeAfter",
    before: "/og?title=Before",
    after: "/og?title=After",
    labelBefore: "Before",
    labelAfter: "After",
  }),
  timeline: () => ({ type: "timeline", items: [{ title: "Milestone", text: "" }] }),
  steps: () => ({ type: "steps", items: [{ title: "Step 1", text: "" }] }),
  accordion: () => ({ type: "accordion", items: [{ title: "Question", text: "" }] }),
  faq: () => ({ type: "faq", items: [{ question: "Question?", answer: "" }] }),
  stats: () => ({ type: "stats", items: [{ value: "50%", label: "Label" }] }),
  chartPlaceholder: () => ({
    type: "chartPlaceholder",
    title: "Chart title",
    note: "Interactive chart placeholder.",
  }),
  video: () => ({ type: "video", url: "https://www.youtube.com/watch?v=VIDEO_ID", caption: "" }),
  toolEmbed: () => ({ type: "toolEmbed", toolSlug: "compress" }),
  downloadCta: () => ({
    type: "downloadCta",
    title: "Download now",
    text: "",
    href: "/",
    buttonLabel: "Download",
  }),
  toolCta: () => ({ type: "toolCta", toolSlug: "compress", title: "Try it free", text: "" }),
  relatedToolCard: () => ({ type: "relatedToolCard", toolSlug: "compress" }),
  authorCard: () => ({ type: "authorCard" }),
  newsletterCard: () => ({ type: "newsletterCard" }),
  divider: () => ({ type: "divider" }),
  customHtml: () => ({ type: "customHtml", html: "<p>Custom HTML</p>" }),
};

const BLOCK_LABELS: Record<BlogBlock["type"], string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  quote: "Quote",
  code: "Code block",
  terminal: "Terminal",
  alert: "Alert box",
  callout: "Callout",
  checklist: "Checklist",
  list: "List",
  table: "Table",
  prosCons: "Pros & cons",
  image: "Image",
  gallery: "Image gallery",
  beforeAfter: "Before / after",
  timeline: "Timeline",
  steps: "Steps",
  accordion: "Accordion",
  faq: "FAQ",
  stats: "Statistics",
  chartPlaceholder: "Chart placeholder",
  video: "Video embed",
  toolEmbed: "Live tool embed",
  downloadCta: "Download CTA",
  toolCta: "Tool CTA",
  relatedToolCard: "Related tool card",
  authorCard: "Author card",
  newsletterCard: "Newsletter card",
  divider: "Divider",
  customHtml: "Custom HTML",
};

interface PaletteItem {
  type: BlogBlock["type"];
  label: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const PALETTE: { group: string; items: PaletteItem[] }[] = [
  {
    group: "Text",
    items: [
      { type: "heading", label: "Heading", description: "H2 / H3 / H4", Icon: TextCursorInput },
      { type: "paragraph", label: "Paragraph", description: "Body text", Icon: GripVertical },
      { type: "quote", label: "Quote", description: "Pull quote", Icon: Quote },
      { type: "checklist", label: "Checklist", description: "✓ items", Icon: ListChecks },
      { type: "list", label: "List", description: "Bullets / numbers", Icon: List },
    ],
  },
  {
    group: "Code",
    items: [
      { type: "code", label: "Code block", description: "Syntax + copy", Icon: Code2 },
      { type: "terminal", label: "Terminal", description: "CLI output", Icon: SquareCode },
      { type: "customHtml", label: "Custom HTML", description: "Raw markup", Icon: FileCode2 },
    ],
  },
  {
    group: "Media",
    items: [
      { type: "image", label: "Image", description: "Single image", Icon: ImageIcon },
      { type: "gallery", label: "Gallery", description: "Image grid", Icon: ImageIcon },
      { type: "beforeAfter", label: "Before / After", description: "Slider", Icon: SlidersHorizontal },
      { type: "video", label: "Video", description: "YouTube / Vimeo", Icon: Video },
    ],
  },
  {
    group: "Structure",
    items: [
      { type: "table", label: "Table", description: "Comparison / pricing", Icon: Rows3 },
      { type: "prosCons", label: "Pros & Cons", description: "Two columns", Icon: Minus },
      { type: "timeline", label: "Timeline", description: "Vertical journey", Icon: Milestone },
      { type: "steps", label: "Steps", description: "Numbered guide", Icon: ArrowDown },
      { type: "accordion", label: "Accordion", description: "Collapsible", Icon: ArrowUp },
      { type: "faq", label: "FAQ", description: "Q&A accordion", Icon: MessageSquare },
      { type: "stats", label: "Statistics", description: "Big numbers", Icon: Sparkles },
      { type: "chartPlaceholder", label: "Chart", description: "Placeholder", Icon: SlidersHorizontal },
      { type: "divider", label: "Divider", description: "Section break", Icon: Minus },
    ],
  },
  {
    group: "Tools & CTA",
    items: [
      { type: "toolEmbed", label: "Live tool embed", description: "Interactive tool", Icon: Wand2 },
      { type: "toolCta", label: "Tool CTA", description: "Link banner", Icon: Wrench },
      { type: "relatedToolCard", label: "Related tool", description: "Tool card", Icon: Wrench },
      { type: "downloadCta", label: "Download CTA", description: "File button", Icon: ArrowDown },
      { type: "authorCard", label: "Author card", description: "Byline block", Icon: GripVertical },
      { type: "newsletterCard", label: "Newsletter", description: "Email capture", Icon: ListChecks },
    ],
  },
];

const TONES: { value: string; label: string }[] = [
  { value: "info", label: "Info" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "error", label: "Error" },
  { value: "tip", label: "Tip" },
];

const TABLE_KINDS: { value: string; label: string }[] = [
  { value: "features", label: "Features" },
  { value: "comparison", label: "Comparison" },
  { value: "pricing", label: "Pricing" },
];

const LANGUAGES = ["ts", "js", "tsx", "jsx", "json", "html", "css", "sql", "bash", "python", "text", "xml"];

/* ------------------------------------------------------------------ */
/* Small field components                                              */
/* ------------------------------------------------------------------ */

function Field({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-border bg-background/60 px-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
  mono = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  mono?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={cn(
          "w-full resize-y rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          mono && "font-mono text-[12.5px]"
        )}
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-border bg-background/60 px-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToolSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select
      label="Tool"
      value={value}
      onChange={onChange}
      options={ALL_TOOLS.map((t) => ({ value: t.slug, label: t.name }))}
    />
  );
}

function LinesEditor({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  hint?: string;
}) {
  return (
    <div>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </span>
      <textarea
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
        rows={Math.max(2, value.length + 1)}
        className="w-full resize-y rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {hint && <p className="mt-1 text-[11px] text-text-muted">{hint}</p>}
    </div>
  );
}

function PairRowsEditor({
  label,
  keyLabel,
  valueLabel,
  value,
  onChange,
}: {
  label: string;
  keyLabel: string;
  valueLabel: string;
  value: { key: string; value: string }[];
  onChange: (v: { key: string; value: string }[]) => void;
}) {
  return (
    <div>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </span>
      <div className="space-y-1.5">
        {value.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              value={item.key}
              onChange={(e) =>
                onChange(value.map((it, j) => (j === i ? { ...it, key: e.target.value } : it)))
              }
              placeholder={keyLabel}
              aria-label={`${label} ${i + 1} ${keyLabel}`}
              className="h-9 w-2/5 rounded-lg border border-border bg-background/60 px-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
            <input
              value={item.value}
              onChange={(e) =>
                onChange(value.map((it, j) => (j === i ? { ...it, value: e.target.value } : it)))
              }
              placeholder={valueLabel}
              aria-label={`${label} ${i + 1} ${valueLabel}`}
              className="h-9 flex-1 rounded-lg border border-border bg-background/60 px-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              aria-label={`Remove ${label} row`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-error/50 hover:text-error"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, { key: "", value: "" }])}
          className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" /> Add row
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The per-type editor                                                 */
/* ------------------------------------------------------------------ */

function BlockFieldsEditor({
  block,
  onChange,
}: {
  block: BlogBlock;
  onChange: (next: BlogBlock) => void;
}) {
  const patch = (p: Partial<BlogBlock> & Record<string, unknown>) =>
    onChange({ ...block, ...p } as BlogBlock);

  switch (block.type) {
    case "heading":
      return (
        <div className="grid gap-2.5 sm:grid-cols-[120px_minmax(0,1fr)]">
          <Select
            label="Level"
            value={String(block.level)}
            options={[
              { value: "2", label: "H2" },
              { value: "3", label: "H3" },
              { value: "4", label: "H4" },
            ]}
            onChange={(v) => patch({ level: Number(v) as 2 | 3 | 4 })}
          />
          <Field label="Text" value={block.text} onChange={(text) => patch({ text })} />
        </div>
      );
    case "paragraph":
      return <Area label="Paragraph" value={block.text} onChange={(text) => patch({ text })} rows={4} />;
    case "quote":
      return (
        <div className="grid gap-2.5">
          <Area label="Quote" value={block.text} onChange={(text) => patch({ text })} rows={3} />
          <Field label="Cite (optional)" value={block.cite ?? ""} onChange={(cite) => patch({ cite })} />
        </div>
      );
    case "code":
      return (
        <div className="grid gap-2.5">
          <Select
            label="Language"
            value={block.language ?? "text"}
            options={LANGUAGES.map((l) => ({ value: l, label: l }))}
            onChange={(language) => patch({ language })}
          />
          <Area label="Code" value={block.code} onChange={(code) => patch({ code })} rows={6} mono />
        </div>
      );
    case "terminal":
      return (
        <Area label="Command / output lines" value={block.lines} onChange={(lines) => patch({ lines })} rows={4} mono />
      );
    case "alert":
    case "callout":
      return (
        <div className="grid gap-2.5">
          {block.type === "alert" && (
            <Select
              label="Tone"
              value={block.tone}
              options={TONES}
              onChange={(tone) => patch({ tone })}
            />
          )}
          <Field label="Title" value={block.title} onChange={(title) => patch({ title })} />
          <Area label="Text" value={block.text} onChange={(text) => patch({ text })} rows={3} />
        </div>
      );
    case "checklist":
    case "list":
      return (
        <div className="grid gap-2.5">
          {block.type === "list" && (
            <Select
              label="Style"
              value={block.ordered ? "ordered" : "unordered"}
              options={[
                { value: "unordered", label: "Bullets" },
                { value: "ordered", label: "Numbers" },
              ]}
              onChange={(v) => patch({ ordered: v === "ordered" })}
            />
          )}
          <LinesEditor label="Items" value={block.items} onChange={(items) => patch({ items })} hint="One item per line" />
        </div>
      );
    case "table":
      return (
        <div className="grid gap-2.5">
          <Select
            label="Kind"
            value={block.kind}
            options={TABLE_KINDS}
            onChange={(kind) => patch({ kind })}
          />
          <Field
            label="Columns (comma separated)"
            value={block.columns.join(", ")}
            onChange={(v) => patch({ columns: v.split(",").map((s) => s.trim()).filter(Boolean) })}
          />
          <Area
            label="Rows (| separated cells, one row per line)"
            value={block.rows.map((r) => r.join(" | ")).join("\n")}
            onChange={(v) =>
              patch({
                rows: v
                  .split("\n")
                  .filter((l) => l.trim())
                  .map((l) => l.split("|").map((s) => s.trim())),
              })
            }
            rows={4}
          />
        </div>
      );
    case "prosCons":
      return (
        <div className="grid gap-2.5 sm:grid-cols-2">
          <LinesEditor label="Pros" value={block.pros} onChange={(pros) => patch({ pros })} />
          <LinesEditor label="Cons" value={block.cons} onChange={(cons) => patch({ cons })} />
        </div>
      );
    case "image":
      return (
        <div className="grid gap-2.5">
          <Field label="Image URL" value={block.src} onChange={(src) => patch({ src })} placeholder="/og?title=… or https://…" />
          <Field label="Alt text" value={block.alt} onChange={(alt) => patch({ alt })} />
          <Field label="Caption (optional)" value={block.caption ?? ""} onChange={(caption) => patch({ caption })} />
        </div>
      );
    case "gallery":
      return (
        <div>
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            Images (one URL per line)
          </span>
          <textarea
            value={block.images.map((i) => i.src).join("\n")}
            onChange={(e) =>
              patch({
                images: e.target.value
                  .split("\n")
                  .filter((l) => l.trim())
                  .map((src) => ({ src: src.trim(), alt: "" })),
              })
            }
            rows={4}
            className="w-full resize-y rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      );
    case "beforeAfter":
      return (
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Field label="Before URL" value={block.before} onChange={(before) => patch({ before })} />
          <Field label="After URL" value={block.after} onChange={(after) => patch({ after })} />
          <Field label="Before label" value={block.labelBefore ?? ""} onChange={(labelBefore) => patch({ labelBefore })} />
          <Field label="After label" value={block.labelAfter ?? ""} onChange={(labelAfter) => patch({ labelAfter })} />
        </div>
      );
    case "timeline":
    case "steps":
    case "accordion":
      return (
        <PairRowsEditor
          label="Items"
          keyLabel={block.type === "accordion" ? "Title" : "Title"}
          valueLabel="Text"
          value={block.items.map((i) => ({ key: i.title, value: i.text }))}
          onChange={(rows) =>
            patch({
              items: rows
                .filter((r) => r.key.trim() || r.value.trim())
                .map((r) => ({ title: r.key, text: r.value })),
            })
          }
        />
      );
    case "faq":
      return (
        <PairRowsEditor
          label="Questions"
          keyLabel="Question"
          valueLabel="Answer"
          value={block.items.map((i) => ({ key: i.question, value: i.answer }))}
          onChange={(rows) =>
            patch({
              items: rows
                .filter((r) => r.key.trim() || r.value.trim())
                .map((r) => ({ question: r.key, answer: r.value })),
            })
          }
        />
      );
    case "stats":
      return (
        <PairRowsEditor
          label="Stats"
          keyLabel="Value (e.g. 90%)"
          valueLabel="Label"
          value={block.items.map((i) => ({ key: i.value, value: i.label }))}
          onChange={(rows) =>
            patch({
              items: rows
                .filter((r) => r.key.trim() || r.value.trim())
                .map((r) => ({ value: r.key, label: r.value })),
            })
          }
        />
      );
    case "chartPlaceholder":
      return (
        <div className="grid gap-2.5">
          <Field label="Chart title" value={block.title} onChange={(title) => patch({ title })} />
          <Field label="Note" value={block.note} onChange={(note) => patch({ note })} />
        </div>
      );
    case "video":
      return (
        <div className="grid gap-2.5">
          <Field label="Video URL" value={block.url} onChange={(url) => patch({ url })} placeholder="https://www.youtube.com/watch?v=…" />
          <Field label="Caption (optional)" value={block.caption ?? ""} onChange={(caption) => patch({ caption })} />
        </div>
      );
    case "toolEmbed":
    case "toolCta":
    case "relatedToolCard":
      return (
        <div className="grid gap-2.5">
          <ToolSelect value={block.toolSlug} onChange={(toolSlug) => patch({ toolSlug })} />
          {block.type === "toolCta" && (
            <>
              <Field label="Title" value={block.title} onChange={(title) => patch({ title })} />
              <Area label="Text" value={block.text} onChange={(text) => patch({ text })} rows={2} />
            </>
          )}
        </div>
      );
    case "downloadCta":
      return (
        <div className="grid gap-2.5">
          <Field label="Title" value={block.title} onChange={(title) => patch({ title })} />
          <Area label="Text" value={block.text} onChange={(text) => patch({ text })} rows={2} />
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label="Link href" value={block.href} onChange={(href) => patch({ href })} />
            <Field label="Button label" value={block.buttonLabel} onChange={(buttonLabel) => patch({ buttonLabel })} />
          </div>
        </div>
      );
    case "customHtml":
      return (
        <Area label="HTML" value={block.html} onChange={(html) => patch({ html })} rows={6} mono />
      );
    case "authorCard":
    case "newsletterCard":
    case "divider":
      return (
        <p className="text-xs text-text-muted">
          This block renders automatically ({BLOCK_LABELS[block.type]}).
        </p>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Block row + palette                                                 */
/* ------------------------------------------------------------------ */

export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: BlogBlock[];
  onChange: (blocks: BlogBlock[]) => void;
}) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  const update = (index: number, next: BlogBlock) =>
    onChange(blocks.map((b, i) => (i === index ? next : b)));
  const remove = (index: number) => onChange(blocks.filter((_, i) => i !== index));
  const duplicate = (index: number) => onChange([...blocks.slice(0, index + 1), blocks[index], ...blocks.slice(index + 1)]);
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const add = (type: BlogBlock["type"]) => {
    onChange([...blocks, DEFAULT_BLOCKS[type]()]);
    setPaletteOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Add palette */}
      <button
        type="button"
        onClick={() => setPaletteOpen((o) => !o)}
        aria-expanded={paletteOpen}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-3.5 text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary/10"
      >
        <Plus className="h-4 w-4" /> Add content block
      </button>

      {paletteOpen && (
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {PALETTE.map((group) => (
              <div key={group.group}>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  {group.group}
                </p>
                <div className="grid gap-1.5">
                  {group.items.map(({ type, label, description, Icon }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => add(type)}
                      className="group flex items-center gap-2.5 rounded-lg border border-border bg-background/50 px-3 py-2 text-left transition-all hover:border-primary/40 hover:bg-primary-light/40"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-text-primary">{label}</span>
                        <span className="block truncate text-[11px] text-text-muted">{description}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Block list */}
      {blocks.length === 0 && !paletteOpen && (
        <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-text-muted">
          No blocks yet — add a heading, paragraph, tool embed or anything else.
        </p>
      )}

      {blocks.map((block, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-border bg-surface">
          {/* Row header */}
          <div className="flex items-center gap-1.5 border-b border-border bg-background/50 px-3 py-2">
            <span className="rounded-md bg-primary-light px-2 py-0.5 text-[11px] font-bold text-primary">
              {BLOCK_LABELS[block.type]}
            </span>
            <span className="text-[11px] text-text-muted">#{index + 1}</span>
            <div className="ml-auto flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-primary-light hover:text-primary disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === blocks.length - 1}
                aria-label="Move down"
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-primary-light hover:text-primary disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => duplicate(index)}
                aria-label="Duplicate block"
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Delete block"
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-error-light hover:text-error"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Inline editor */}
          <div className="p-3.5">
            <BlockFieldsEditor
              key={index}
              block={block}
              onChange={(next) => update(index, next)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
