/** Pure helpers shared by the blog data layer. No React / no Node APIs. */

import type { BlogBlock } from "./types";

/** "Hello, World!" -> "hello-world" (ASCII-friendly, used for slugs & anchors). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['".,!?()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Rough reading time from visible text (~200 wpm), min "1 min read". */
export function estimateReadTime(blocks: BlogBlock[]): string {
  let words = 0;
  for (const block of blocks) {
    switch (block.type) {
      case "heading":
      case "paragraph":
      case "quote":
      case "alert":
      case "callout":
        words += (block.text ?? "").split(/\s+/).length;
        break;
      case "customHtml":
        words += (block.html ?? "").split(/\s+/).length / 2;
        break;
      case "code":
        words += (block.code ?? "").split(/\s+/).length / 2;
        break;
      case "terminal":
        words += (block.lines ?? "").split(/\s+/).length / 2;
        break;
      case "checklist":
      case "list":
        words += block.items.join(" ").split(/\s+/).length;
        break;
      case "table":
        words += block.rows.flat().join(" ").split(/\s+/).length;
        break;
      case "prosCons":
        words += [...block.pros, ...block.cons].join(" ").split(/\s+/).length;
        break;
      case "timeline":
      case "steps":
      case "accordion":
      case "faq":
        words += block.items
          .map((i) => `${"title" in i ? i.title : ""} ${"question" in i ? i.question : ""} ${"answer" in i ? i.answer : ""} ${"text" in i ? i.text : ""}`)
          .join(" ")
          .split(/\s+/).length;
        break;
      case "stats":
        words += block.items.map((i) => i.label).join(" ").split(/\s+/).length;
        break;
      case "tabs":
        words += block.tabs.map((t) => `${t.title} ${t.text}`).join(" ").split(/\s+/).length;
        break;
      case "button":
        words += block.label.split(/\s+/).length;
        break;
      case "mermaid":
        words += (block.code ?? "").split(/\s+/).length / 2;
        break;
      case "math":
        words += (block.formula ?? "").split(/\s+/).length;
        break;
      case "tweetEmbed":
      case "githubEmbed":
      case "gallery":
      case "video":
      case "image":
      case "beforeAfter":
      case "toolEmbed":
      case "downloadCta":
      case "toolCta":
      case "relatedToolCard":
      case "authorCard":
      case "newsletterCard":
      case "divider":
      case "chartPlaceholder":
        break;
    }
  }
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

/**
 * Flatten every block into a single plain-text string (used for search,
 * excerpt generation and read-time fallbacks).
 */
export function blocksToText(blocks: BlogBlock[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    switch (block.type) {
      case "heading":
      case "paragraph":
      case "quote":
      case "alert":
      case "callout":
        parts.push(block.text);
        break;
      case "customHtml":
        parts.push(block.html);
        break;
      case "code":
        parts.push(block.code);
        break;
      case "terminal":
        parts.push(block.lines);
        break;
      case "checklist":
      case "list":
        parts.push(block.items.join(" "));
        break;
      case "table":
        parts.push(block.rows.flat().join(" "));
        break;
      case "prosCons":
        parts.push([...block.pros, ...block.cons].join(" "));
        break;
      case "timeline":
      case "steps":
      case "accordion":
      case "faq":
        parts.push(
          block.items
            .map((i) => {
              const title = "title" in i ? i.title : "";
              const question = "question" in i ? i.question : "";
              const answer = "answer" in i ? i.answer : "";
              const text = "text" in i ? i.text : "";
              return `${title} ${question} ${answer} ${text}`;
            })
            .join(" ")
        );
        break;
      case "stats":
        parts.push(block.items.map((i) => `${i.value} ${i.label}`).join(" "));
        break;
      case "tabs":
        parts.push(block.tabs.map((t) => `${t.title} ${t.text}`).join(" "));
        break;
      case "button":
        parts.push(block.label);
        break;
      case "tweetEmbed":
      case "githubEmbed":
        parts.push(block.url);
        break;
      case "mermaid":
        parts.push(block.code);
        break;
      case "math":
        parts.push(block.formula);
        break;
      case "video":
      case "image":
      case "gallery":
      case "beforeAfter":
      case "chartPlaceholder":
      case "toolEmbed":
      case "downloadCta":
      case "toolCta":
      case "relatedToolCard":
      case "authorCard":
      case "newsletterCard":
      case "divider":
        break;
    }
  }
  return parts.filter(Boolean).join(" ");
}

export interface HeadingRef {
  id: string;
  label: string;
  level: number;
}

/**
 * Build deduplicated heading anchors in document order. The block renderer and
 * the article TOC must use the SAME ids, so both call this helper.
 */
export function buildHeadingRefs(blocks: BlogBlock[]): HeadingRef[] {
  const used = new Set<string>();
  const refs: HeadingRef[] = [];
  for (const block of blocks) {
    if (block.type !== "heading") continue;
    const base = slugify(block.text) || "section";
    let id = base;
    let i = 2;
    while (used.has(id)) id = `${base}-${i++}`;
    used.add(id);
    refs.push({ id, label: block.text, level: block.level });
  }
  return refs;
}

/** ISO date N days ago (stable — avoids Date.now() during SSR/SSG). */
export function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

/** Keep ISO strings stable for SSG: today's date at a fixed time. */
export function todayIso(): string {
  return new Date().toISOString();
}
