/**
 * Central tools registry — the single source of truth for every tool on the site.
 *
 * To add a new domain (e.g. "Developer Tools"), add a new entry to
 * TOOL_CATEGORIES. The header dropdowns, footer links, sitemap, and homepage
 * tool cards all derive from this file, so a new tool only needs:
 *   1. A page in app/<slug>/
 *   2. One entry in this registry
 *
 * NOTE: keep this file free of React/lucide imports so it can be imported by
 * server files (sitemap.ts) without pulling client code into the server bundle.
 */
export interface Tool {
  slug: string;
  /** Display name shown in navigation */
  name: string;
  /** Route to the tool page */
  href: string;
  /** One-line description (homepage cards, tooltips) */
  description: string;
  /** Marketing title for the homepage tool card */
  tagline: string;
  /** Example stat line shown on the homepage tool card */
  stat: string;
  /** Short pill badge shown on the homepage tool card */
  badge: string;
  /** Color tone for the homepage card badge */
  badgeTone?: "success" | "primary";
}

export interface ToolCategory {
  /** Stable id used for keys, e.g. "image", "developer" */
  id: string;
  /** Dropdown label shown in the header, e.g. "Image Tools" */
  label: string;
  tools: Tool[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "image",
    label: "Image Tools",
    tools: [
      {
        slug: "compress",
        name: "Compress",
        href: "/compress",
        description: "Reduce image file size instantly",
        tagline: "Compress Images",
        stat: "2.4 MB → 350 KB",
        badge: "-85%",
        badgeTone: "success",
      },
      {
        slug: "resize",
        name: "Resize",
        href: "/resize",
        description: "Perfect dimensions every time",
        tagline: "Resize & Crop",
        stat: "Passport, A4, Social media...",
        badge: "20+ presets",
      },
      {
        slug: "flip",
        name: "Flip",
        href: "/flip",
        description: "Mirror & rotate instantly",
        tagline: "Flip & Rotate",
        stat: "Flip H / Flip V / 90° rotation",
        badge: "1-click",
      },
      {
        slug: "convert",
        name: "Convert",
        href: "/convert",
        description: "PNG, JPEG, WEBP — instantly",
        tagline: "Convert Format",
        stat: "JPG → PNG → WEBP",
        badge: "Free",
        badgeTone: "success",
      },
      {
        slug: "watermark-image",
        name: "Watermark",
        href: "/watermark-image",
        description: "Protect photos with text or logo",
        tagline: "Add Watermark",
        stat: "Text · Logo · Drag to place",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "remove-background",
        name: "Remove Background",
        href: "/remove-background",
        description: "AI background remover in your browser",
        tagline: "Remove Background",
        stat: "AI · Transparent PNG · Batch",
        badge: "AI",
        badgeTone: "primary",
      },
      {
        slug: "passport-photo-maker",
        name: "Passport Photo",
        href: "/passport-photo-maker",
        description: "Passport-size photos for 25+ countries",
        tagline: "Passport Photo Maker",
        stat: "25+ sizes · Print sheets · 300 DPI",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "image-to-pdf",
        name: "Image to PDF",
        href: "/image-to-pdf",
        description: "Merge JPG, PNG & HEIC into one PDF",
        tagline: "Image to PDF",
        stat: "A4 · Letter · Reorder pages",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "pdf-to-image",
        name: "PDF to Image",
        href: "/pdf-to-image",
        description: "Convert PDF pages to JPG or PNG",
        tagline: "PDF to Image",
        stat: "High-res pages · ZIP download",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "signature-resizer",
        name: "Signature Resizer",
        href: "/signature-resizer",
        description: "Resize signatures to any size & KB limit",
        tagline: "Signature Resizer",
        stat: "20 KB · 50 KB · Transparent PNG",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "social-media-resizer",
        name: "Social Media Resizer",
        href: "/social-media-resizer",
        description: "Exact sizes for every social platform",
        tagline: "Social Media Resizer",
        stat: "20+ presets · Instagram → TikTok",
        badge: "New",
        badgeTone: "primary",
      },
    ],
  },
];

/** Flattened list of every tool across all categories. */
export const ALL_TOOLS: Tool[] = TOOL_CATEGORIES.flatMap((category) => category.tools);

export function getToolBySlug(slug: string): Tool | undefined {
  return ALL_TOOLS.find((tool) => tool.slug === slug);
}
