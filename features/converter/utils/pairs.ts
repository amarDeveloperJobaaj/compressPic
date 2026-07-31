/**
 * Dedicated conversion pairs registry.
 *
 * Each entry generates a dedicated conversion page (via app/[slug]/page.tsx),
 * a sitemap entry, and a quick-link on the /convert page.
 *
 * To add a new conversion page (e.g. PNG → WEBP) you only need ONE entry here:
 *   { slug: "png-to-webp", from: { type: "image/png", label: "PNG", ext: "png", extensions: ["png"] }, to: { type: "image/webp", label: "WEBP", ext: "webp", extensions: ["webp"] }, ... }
 *
 * NOTE: keep this file free of React imports so it can be imported by server
 * files (sitemap.ts) without pulling client code into the server bundle.
 */
export interface FormatSpec {
  /** MIME type of the format, e.g. "image/jpeg" */
  type: string;
  /** Short display label, e.g. "JPG" */
  label: string;
  /** File extension for downloads, e.g. "jpg" */
  ext: string;
  /** Accepted file extensions for the upload input */
  extensions: string[];
}

export interface ConversionPair {
  /** URL slug, e.g. "jpg-to-png" (also used as the route param) */
  slug: string;
  /** SEO title, e.g. "JPG to PNG Converter" */
  title: string;
  /** SEO description */
  description: string;
  from: FormatSpec;
  to: FormatSpec;
}

export const CONVERSION_PAIRS: ConversionPair[] = [
  {
    slug: "jpg-to-png",
    title: "JPG to PNG Converter — Free & Private",
    description:
      "Convert JPG to PNG online for free. Preserves transparency, no uploads, no servers — everything happens in your browser.",
    from: { type: "image/jpeg", label: "JPG", ext: "jpg", extensions: ["jpg", "jpeg"] },
    to: { type: "image/png", label: "PNG", ext: "png", extensions: ["png"] },
  },
  {
    slug: "png-to-jpg",
    title: "PNG to JPG Converter — Free & Private",
    description:
      "Convert PNG to JPG online for free. Shrink file sizes instantly with adjustable quality — 100% in your browser.",
    from: { type: "image/png", label: "PNG", ext: "png", extensions: ["png"] },
    to: { type: "image/jpeg", label: "JPG", ext: "jpg", extensions: ["jpg", "jpeg"] },
  },
  {
    slug: "jpg-to-webp",
    title: "JPG to WEBP Converter — Free & Private",
    description:
      "Convert JPG to WEBP online for free. Modern, efficient web format with smaller file sizes — processed right in your browser.",
    from: { type: "image/jpeg", label: "JPG", ext: "jpg", extensions: ["jpg", "jpeg"] },
    to: { type: "image/webp", label: "WEBP", ext: "webp", extensions: ["webp"] },
  },
  {
    slug: "webp-to-jpg",
    title: "WEBP to JPG Converter — Free & Private",
    description:
      "Convert WEBP to JPG online for free. Perfect for compatibility with older apps and editors — no uploads, 100% private.",
    from: { type: "image/webp", label: "WEBP", ext: "webp", extensions: ["webp"] },
    to: { type: "image/jpeg", label: "JPG", ext: "jpg", extensions: ["jpg", "jpeg"] },
  },
  {
    slug: "heic-to-jpg",
    title: "HEIC to JPG Converter — Free & Private",
    description:
      "Convert iPhone HEIC photos to JPG online for free. Instantly opens HEIC files on any device — all in your browser, nothing is uploaded.",
    from: { type: "image/heic", label: "HEIC", ext: "heic", extensions: ["heic", "heif"] },
    to: { type: "image/jpeg", label: "JPG", ext: "jpg", extensions: ["jpg", "jpeg"] },
  },
  {
    slug: "avif-to-jpg",
    title: "AVIF to JPG Converter — Free & Private",
    description:
      "Convert AVIF to JPG online for free. Downsize next-gen AVIF images to the universal JPG format — processed locally in your browser.",
    from: { type: "image/avif", label: "AVIF", ext: "avif", extensions: ["avif"] },
    to: { type: "image/jpeg", label: "JPG", ext: "jpg", extensions: ["jpg", "jpeg"] },
  },
  {
    slug: "svg-to-png",
    title: "SVG to PNG Converter — Free & Private",
    description:
      "Convert SVG to PNG online for free. Turn vector graphics into raster PNGs with full control — no uploads, entirely in your browser.",
    from: { type: "image/svg+xml", label: "SVG", ext: "svg", extensions: ["svg"] },
    to: { type: "image/png", label: "PNG", ext: "png", extensions: ["png"] },
  },
];

/** Find a conversion pair by its URL slug. */
export function getConversionPair(slug: string): ConversionPair | undefined {
  return CONVERSION_PAIRS.find((pair) => pair.slug === slug);
}
