/** Pure content helpers derived from the blog block model. No React / no Node APIs. */

import { blocksToText } from "./utils";
import type { BlogBlock, BlogPost } from "./types";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToItem {
  name: string;
  text: string;
}

/** Smart excerpt: prefer the stored excerpt, else derive from the block text. */
export function generateExcerpt(input: BlogPost | BlogBlock[] | string, max = 160): string {
  const text =
    typeof input === "string"
      ? input
      : Array.isArray(input)
        ? blocksToText(input)
        : input.excerpt || blocksToText(input.content);

  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  const cut = cleaned.slice(0, max);
  return `${cut.slice(0, Math.max(0, cut.lastIndexOf(" ")))}…`;
}

/** FAQPage items from a post's `faq` blocks (schema + UI reuse the same shape). */
export function extractFaqs(post: BlogPost, limit = 8): FaqItem[] {
  const items: FaqItem[] = [];
  for (const block of post.content) {
    if (block.type === "faq") {
      for (const item of block.items) {
        if (items.length >= limit) return items;
        items.push({ question: item.question, answer: item.answer });
      }
    }
  }
  return items;
}

/** HowTo steps from a post's `steps` blocks (schema generation). */
export function extractSteps(post: BlogPost, limit = 10): HowToItem[] {
  const items: HowToItem[] = [];
  for (const block of post.content) {
    if (block.type === "steps") {
      for (const item of block.items) {
        if (items.length >= limit) return items;
        items.push({ name: item.title, text: item.text });
      }
    }
  }
  return items;
}
