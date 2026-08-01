"use client";

import { useMemo, useState } from "react";
import { Copy, Link2 } from "lucide-react";
import { ToolPanel } from "@/features/devtools/components/ToolPanel";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/features/devtools/utils/download";
import { cn } from "@/lib/utils";

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "of", "for", "on", "in", "with", "to", "at", "by", "from", "as", "is", "are", "was", "were", "be", "been", "this", "that",
]);

interface SlugOptions {
  lowercase: boolean;
  separator: string;
  removeStopWords: boolean;
  transliterate: boolean;
  removeNumbers: boolean;
}

const DEFAULT_OPTIONS: SlugOptions = {
  lowercase: true,
  separator: "-",
  removeStopWords: false,
  transliterate: true,
  removeNumbers: false,
};

/** Simple Unicode transliteration map for common accented chars. */
const TRANSLIT: Record<string, string> = {
  á: "a", à: "a", â: "a", ä: "a", ã: "a", å: "a",
  é: "e", è: "e", ê: "e", ë: "e",
  í: "i", ì: "i", î: "i", ï: "i",
  ó: "o", ò: "o", ô: "o", ö: "o", õ: "o",
  ú: "u", ù: "u", û: "u", ü: "u",
  ñ: "n", ç: "c", ß: "ss", ø: "o", æ: "ae", œ: "oe",
};

function transliterate(input: string): string {
  return input
    .split("")
    .map((ch) => TRANSLIT[ch.toLowerCase()] ?? ch)
    .join("");
}

function generateSlug(input: string, options: SlugOptions): string {
  let text = input;
  if (options.transliterate) text = transliterate(text);
  if (options.lowercase) text = text.toLowerCase();

  // Replace symbols/emoji with separator
  text = text.replace(/[^\p{L}\p{N}\s-]/gu, options.separator);

  const words = text.split(/\s+/).filter(Boolean);
  let filtered = words;
  if (options.removeStopWords) filtered = filtered.filter((w) => !STOP_WORDS.has(w));
  if (options.removeNumbers) filtered = filtered.filter((w) => !/^\d+$/.test(w));

  let slug = filtered.join(options.separator);
  if (options.separator !== " ") {
    slug = slug.replace(new RegExp(`[${options.separator === "-" ? "\\-" : options.separator}]{2,}`, "g"), options.separator);
  }
  slug = slug.replace(new RegExp(`^[${options.separator === "-" ? "\\-" : options.separator}]+|[${options.separator === "-" ? "\\-" : options.separator}]+$`, "g"), "");
  return slug;
}

export function SlugGeneratorTool() {
  const [input, setInput] = useState("10 Best Free Online SEO Tools for 2026 — The Ultimate Guide!");
  const [options, setOptions] = useState<SlugOptions>(DEFAULT_OPTIONS);
  const [baseUrl, setBaseUrl] = useState("https://compresspix.com/blog/");

  const set = (key: keyof SlugOptions, value: boolean) =>
    setOptions((o) => ({ ...o, [key]: value }));

  const slug = useMemo(() => generateSlug(input, options), [input, options]);
  const fullUrl = useMemo(() => `${baseUrl.replace(/\/$/, "")}/${slug}`, [baseUrl, slug]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <ToolPanel title="Title / Text" description="Type or paste a headline — the slug updates instantly.">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="Your post title or phrase…"
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        />
      </ToolPanel>

      <ToolPanel title="Options">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-sm text-text-secondary">Lowercase</span>
            <input type="checkbox" checked={options.lowercase} onChange={(e) => set("lowercase", e.target.checked)} className="h-4 w-4 accent-primary" />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-sm text-text-secondary">Unicode transliteration</span>
            <input type="checkbox" checked={options.transliterate} onChange={(e) => set("transliterate", e.target.checked)} className="h-4 w-4 accent-primary" />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-sm text-text-secondary">Remove stop words</span>
            <input type="checkbox" checked={options.removeStopWords} onChange={(e) => set("removeStopWords", e.target.checked)} className="h-4 w-4 accent-primary" />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-sm text-text-secondary">Remove standalone numbers</span>
            <input type="checkbox" checked={options.removeNumbers} onChange={(e) => set("removeNumbers", e.target.checked)} className="h-4 w-4 accent-primary" />
          </label>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Separator</label>
          <div className="flex flex-wrap gap-2">
            {(["-", "_", ".", "/"] as const).map((sep) => (
              <button
                key={sep}
                type="button"
                onClick={() => setOptions((o) => ({ ...o, separator: sep }))}
                className={cn(
                  "rounded-lg border px-3 py-1.5 font-mono text-sm transition-all",
                  options.separator === sep ? "border-primary bg-primary text-white" : "border-border bg-background text-text-secondary"
                )}
              >
                {sep === "/" ? "slash" : sep}
              </button>
            ))}
          </div>
        </div>
      </ToolPanel>

      <ToolPanel
        title="Generated Slug"
        description="Copy the slug or the full example URL."
        actions={
          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(slug)}>
            <Copy className="h-3.5 w-3.5" />
            Copy slug
          </Button>
        }
      >
        <div className="break-all rounded-xl border border-border bg-background p-4 font-mono text-[13px] text-text-primary">
          {slug || "—"}
        </div>
        <div className="mt-3 rounded-xl border border-border bg-background p-4">
          <label className="mb-1.5 block text-xs font-medium text-text-muted">Base URL (optional)</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://example.com/blog/"
            className="mb-2 h-10 w-full rounded-lg border border-border bg-surface px-3 font-mono text-xs text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          <p className="flex items-center gap-1.5 break-all font-mono text-xs text-text-secondary">
            <Link2 className="h-3.5 w-3.5 shrink-0 text-primary" />
            {fullUrl}
          </p>
        </div>
      </ToolPanel>
    </div>
  );
}
