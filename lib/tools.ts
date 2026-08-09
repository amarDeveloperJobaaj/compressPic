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
import { FINANCE_CATEGORY } from "./finance-tools";
import { YOUTUBE_CATEGORY } from "./youtube-tools";

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
  {
    id: "developer",
    label: "Developer Tools",
    tools: [
      {
        slug: "json-formatter",
        name: "JSON Formatter",
        href: "/json-formatter",
        description: "Beautify, minify & validate JSON instantly",
        tagline: "JSON Formatter",
        stat: "Beautify · Minify · Tree view",
        badge: "Free",
        badgeTone: "success",
      },
      {
        slug: "json-validator",
        name: "JSON Validator",
        href: "/json-validator",
        description: "Validate JSON with error line numbers",
        tagline: "JSON Validator",
        stat: "Real-time · Error line numbers",
        badge: "Free",
        badgeTone: "success",
      },
      {
        slug: "base64-encoder",
        name: "Base64 Encoder",
        href: "/base64-encoder",
        description: "Encode text or files to Base64",
        tagline: "Base64 Encoder",
        stat: "Text · File · Image",
        badge: "Free",
        badgeTone: "success",
      },
      {
        slug: "base64-decoder",
        name: "Base64 Decoder",
        href: "/base64-decoder",
        description: "Decode Base64 back to text or files",
        tagline: "Base64 Decoder",
        stat: "Text · File · Image",
        badge: "Free",
        badgeTone: "success",
      },
      {
        slug: "password-generator",
        name: "Password Generator",
        href: "/password-generator",
        description: "Strong random passwords with a strength meter",
        tagline: "Password Generator",
        stat: "Entropy · Strength meter",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "uuid-generator",
        name: "UUID Generator",
        href: "/uuid-generator",
        description: "Generate UUID v1, v4 & v7 in bulk",
        tagline: "UUID Generator",
        stat: "v1 · v4 · v7 · Bulk",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "qr-code-generator",
        name: "QR Code Generator",
        href: "/qr-code-generator",
        description: "QR codes for URLs, WiFi, WhatsApp & more",
        tagline: "QR Code Generator",
        stat: "WiFi · Logo · PNG / SVG / PDF",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "css-gradient-generator",
        name: "Gradient Generator",
        href: "/css-gradient-generator",
        description: "Linear, radial & conic CSS gradients",
        tagline: "CSS Gradient Generator",
        stat: "Linear · Radial · Conic",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "css-box-shadow-generator",
        name: "Box Shadow Generator",
        href: "/css-box-shadow-generator",
        description: "Design CSS box shadows visually",
        tagline: "Box Shadow Generator",
        stat: "Live preview · Inset",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "jwt-decoder",
        name: "JWT Decoder",
        href: "/jwt-decoder",
        description: "Decode JWT tokens & check expiry",
        tagline: "JWT Decoder",
        stat: "Header · Payload · Expiry",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "sql-formatter",
        name: "SQL Formatter",
        href: "/sql-formatter",
        description: "Beautify & minify SQL queries",
        tagline: "SQL Formatter",
        stat: "Beautify · Syntax highlight",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "html-css-js-playground",
        name: "HTML/CSS/JS Playground",
        href: "/html-css-js-playground",
        description: "CodePen-style editor with live preview & console",
        tagline: "HTML/CSS/JS Playground",
        stat: "Live preview · Console · Templates · Export ZIP",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "sql-playground",
        name: "SQL Playground",
        href: "/sql-playground",
        description: "Run SQLite queries in your browser with sql.js",
        tagline: "SQL Playground",
        stat: "SQLite WASM · Sample DBs · CSV import/export",
        badge: "New",
        badgeTone: "primary",
      },
    ],
  },
  {
    id: "seo",
    label: "SEO Tools",
    tools: [
      {
        slug: "meta-tag-generator",
        name: "Meta Tag Generator",
        href: "/meta-tag-generator",
        description: "Create perfect SEO meta tags & SERP preview",
        tagline: "Meta Tag Generator",
        stat: "Title · Description · OG · Twitter",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "schema-markup-generator",
        name: "Schema Generator",
        href: "/schema-markup-generator",
        description: "Generate JSON-LD structured data for 15+ types",
        tagline: "Schema Markup Generator",
        stat: "Article · FAQ · Product · HowTo",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "open-graph-generator",
        name: "Open Graph Generator",
        href: "/open-graph-generator",
        description: "Design social share cards with live previews",
        tagline: "Open Graph Generator",
        stat: "Facebook · LinkedIn · Twitter preview",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "robots-txt-generator",
        name: "Robots.txt Generator",
        href: "/robots-txt-generator",
        description: "Build a clean robots.txt in seconds",
        tagline: "Robots.txt Generator",
        stat: "Allow · Disallow · Sitemap · Host",
        badge: "Free",
        badgeTone: "success",
      },
      {
        slug: "sitemap-generator",
        name: "Sitemap Generator",
        href: "/sitemap-generator",
        description: "Create XML sitemaps with image & video entries",
        tagline: "Sitemap Generator",
        stat: "XML · Image · Video · News",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "utm-builder",
        name: "UTM Builder",
        href: "/utm-builder",
        description: "Build trackable campaign URLs with QR code",
        tagline: "UTM Builder",
        stat: "Source · Medium · Campaign · QR",
        badge: "Free",
        badgeTone: "success",
      },
      {
        slug: "serp-preview",
        name: "SERP Preview",
        href: "/serp-preview",
        description: "See how your listing looks in Google search",
        tagline: "SERP Preview",
        stat: "Desktop · Mobile · Character count",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "slug-generator",
        name: "Slug Generator",
        href: "/slug-generator",
        description: "Create clean SEO-friendly URL slugs",
        tagline: "Slug Generator",
        stat: "Unicode · Stop words · Separators",
        badge: "Free",
        badgeTone: "success",
      },
      {
        slug: "meta-tag-analyzer",
        name: "Meta Tag Analyzer",
        href: "/meta-tag-analyzer",
        description: "Audit any page's meta tags & SEO score",
        tagline: "Meta Tag Analyzer",
        stat: "Title · OG · Structured data · Score",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "heading-checker",
        name: "Heading Checker",
        href: "/heading-checker",
        description: "Check H1–H6 hierarchy & duplicate headings",
        tagline: "Heading Checker",
        stat: "Hierarchy · Duplicates · Tree view",
        badge: "New",
        badgeTone: "primary",
      },
      {
        slug: "website-traffic-checker",
        name: "Traffic Checker",
        href: "/website-traffic-checker",
        description: "Estimate website traffic from public SEO signals",
        tagline: "Website Traffic Checker",
        stat: "Estimated visits · SEO score · Compare",
        badge: "New",
        badgeTone: "primary",
      },
    ],
  },
  FINANCE_CATEGORY,
  YOUTUBE_CATEGORY,
  {
    id: "ai",
    label: "AI Tools",
    tools: [
      {
        slug: "ai-mock-interview",
        name: "AI Interview",
        href: "/ai-mock-interview",
        description: "Practice mock interviews with an AI interviewer",
        tagline: "AI Mock Interview",
        stat: "Voice · Camera · Scored feedback",
        badge: "AI",
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
