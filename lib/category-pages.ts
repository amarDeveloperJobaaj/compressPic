/**
 * Category landing page registry — the single source of truth for the
 * programmatic category pages (/image-tools, /pdf-tools, /developer-tools, ...).
 *
 * Server-safe (no React/lucide imports) so sitemap.ts and server components can
 * consume it without pulling client code into the server bundle.
 *
 * HOW A NEW CATEGORY IS ADDED (fully programmatic — no page file needed):
 *   1. Add one entry to CATEGORY_PAGES below with its unique SEO content.
 *   2. The route page (app/category/[slug]/page.tsx), metadata, schemas,
 *      breadcrumbs, sitemap entry and related-category links are all generated
 *      automatically from this entry.
 *
 * TOOL RESOLUTION:
 *   - `categoryId` derives the tool list from TOOL_CATEGORIES in lib/tools.ts,
 *     so new tools added to that registry category appear here automatically.
 *   - `toolSlugs` lists tools explicitly for virtual categories (e.g. PDF
 *     tools live inside the image category in the registry).
 */
import type { Tool } from "./tools";
import { ALL_TOOLS, TOOL_CATEGORIES } from "./tools";

/** Capsule-compatible accent tones (subset of CapsuleVariant, kept string-safe). */
export type CategoryAccent =
  | "primary"
  | "sky"
  | "violet"
  | "teal"
  | "amber"
  | "rose"
  | "success"
  | "orange";

export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface CategoryPageConfig {
  /** Route segment, e.g. "image-tools" → /image-tools */
  slug: string;
  /** Full label, e.g. "Image Tools" */
  label: string;
  /** Short label for tight spaces, e.g. "Image" */
  shortLabel: string;
  /** Derive tools from a TOOL_CATEGORIES id (auto-updates with the registry). */
  categoryId?: string;
  /** Explicit tool slugs for virtual categories (mutually exclusive with categoryId). */
  toolSlugs?: string[];
  /** Accent tone used for capsules, dots and glows. */
  accent: CategoryAccent;
  /** Tailwind gradient classes for icon tiles / highlights. */
  gradient: string;
  /** Optional blog category name used to surface related guides. */
  relatedBlogCategory?: string;

  // ---- SEO ----
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  // ---- Hero ----
  heroBadge: string;
  h1: string;
  heroDescription: string;

  // ---- Educational content (unique per category) ----
  intro: string[];
  benefits: { title: string; description: string }[];
  features: { title: string; description: string }[];
  howTo: { title: string; description: string }[];
  useCases: string[];
  bestPractices: string[];
  commonMistakes: string[];
  faqs: CategoryFaq[];
}

/** Resolve the tool list for a category entry. */
export function getCategoryTools(config: CategoryPageConfig): Tool[] {
  if (config.categoryId) {
    return TOOL_CATEGORIES.find((c) => c.id === config.categoryId)?.tools ?? [];
  }
  if (config.toolSlugs) {
    return config.toolSlugs
      .map((slug) => ALL_TOOLS.find((t) => t.slug === slug))
      .filter((t): t is Tool => Boolean(t));
  }
  return [];
}

export const CATEGORY_PAGES: CategoryPageConfig[] = [
  {
    slug: "image-tools",
    label: "Image Tools",
    shortLabel: "Image",
    categoryId: "image",
    accent: "primary",
    gradient: "from-primary to-sky-500",
    relatedBlogCategory: "Image Editing",

    metaTitle: "Free Online Image Tools — Compress, Resize, Crop & Convert | Vizo Tool",
    metaDescription:
      "40+ free image tools: compress JPG/PNG/WEBP to 50KB, resize & crop to any ratio, flip, watermark, remove backgrounds and convert formats — 100% in your browser, no uploads.",
    keywords: [
      "image tools",
      "free image tools online",
      "compress image",
      "resize image",
      "crop image online",
      "image converter",
      "flip image",
      "remove background",
      "watermark image",
    ],

    heroBadge: "Image Tools",
    h1: "Free Online Image Tools — Edit in Your Browser",
    heroDescription:
      "Compress, resize, crop, flip, watermark and convert images without uploading them anywhere. Every tool runs locally on your device — fast, private and free forever.",

    intro: [
      "Image editing used to mean installing heavy software or uploading your photos to a random website. Vizo Tool's image tools work differently: every editor runs 100% in your browser, so your pictures never leave your device.",
      "From compressing a 4MB photo to 50KB for a job form, to cropping a passport photo to the exact official dimensions, to removing a background in seconds — the whole suite is free, unlimited and ready when you are.",
    ],
    benefits: [
      {
        title: "100% Private — Zero Uploads",
        description:
          "All processing happens locally with the Canvas API. Your images never touch a server, so nothing can be stored, sold or leaked.",
      },
      {
        title: "Free & Unlimited",
        description:
          "No sign-ups, no watermarks, no daily limits. Compress, crop and convert as many images as you want, forever.",
      },
      {
        title: "Works on Any Device",
        description:
          "Desktop, tablet or phone — every tool is fully responsive and works offline-capable in the browser. No apps to install.",
      },
      {
        title: "Professional Results in Seconds",
        description:
          "Passport sizes for 25+ countries, social media presets, target-size compression and AI background removal — all in a few clicks.",
      },
    ],
    features: [
      {
        title: "Target-Size Compression",
        description:
          "Shrink images to exactly 50KB, 100KB or 200KB with a smart quality algorithm that keeps photos looking sharp.",
      },
      {
        title: "Preset Ratios & Passport Sizes",
        description:
          "Crop to passport, A4, Instagram, YouTube and 20+ more presets, or define a fully custom aspect ratio.",
      },
      {
        title: "Format Conversion & HEIC",
        description:
          "Convert between JPG, PNG, WEBP and AVIF — including HEIC files straight from your iPhone.",
      },
      {
        title: "AI Background Removal",
        description:
          "Cut out any subject automatically, swap in colors or images, and export a transparent PNG — all on-device.",
      },
    ],
    howTo: [
      {
        title: "Open the tool you need",
        description:
          "Pick compress, resize, crop, flip, watermark or remove background from the grid below.",
      },
      {
        title: "Add your image",
        description:
          "Drag & drop, click to browse, or paste from your clipboard. Files stay on your device.",
      },
      {
        title: "Tune the settings",
        description:
          "Choose a target size, ratio, format, watermark style or background — preview updates instantly.",
      },
      {
        title: "Download the result",
        description:
          "Export as PNG, JPG or WEBP with quality control. Done — nothing was ever uploaded.",
      },
    ],
    useCases: [
      "Reducing image size for job applications, college portals and email attachments",
      "Making compliant passport and visa photos at home",
      "Preparing social media posts at the exact platform dimensions",
      "Removing backgrounds for product listings and thumbnails",
      "Protecting photography with text or logo watermarks",
    ],
    bestPractices: [
      "Always compress from the original file — recompressing an already-compressed image loses quality.",
      "Use WEBP for web images, JPG for universal compatibility, PNG for logos and text.",
      "Crop from the highest-resolution master to keep output sharp.",
      "Preview the result at 100% zoom before downloading.",
    ],
    commonMistakes: [
      "Compressing a PNG photo instead of converting it to JPG or WEBP first.",
      "Forgetting that resizing down to a small size loses detail you can't get back.",
      "Using a low-quality export when a modern format like WEBP would halve the size.",
    ],
    faqs: [
      {
        question: "Are Vizo Tool image tools really free?",
        answer:
          "Yes — every image tool is completely free with no sign-up, no watermark and no usage limits. We don't believe in paywalling basic editing.",
      },
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. All image processing happens locally in your browser using the Canvas API. Your files never leave your device, which is why the tools feel instant and private.",
      },
      {
        question: "Which image formats are supported?",
        answer:
          "JPG, JPEG, PNG, WEBP, AVIF and HEIC (iPhone) are supported across the suite. You can also convert between formats directly.",
      },
      {
        question: "Do the tools work on mobile?",
        answer:
          "Yes — every tool is fully responsive and works on phones and tablets. You can edit images directly from your camera roll in the browser.",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "There's no artificial limit, but very large files (50MB+) may take a moment to process since everything runs in your browser.",
      },
      {
        question: "Do I need to install anything?",
        answer:
          "No installations, no extensions, no account. Just open the tool in any modern browser and start editing.",
      },
    ],
  },

  {
    slug: "pdf-tools",
    label: "PDF Tools",
    shortLabel: "PDF",
    toolSlugs: ["image-to-pdf", "pdf-to-image"],
    accent: "rose",
    gradient: "from-rose-500 to-orange-500",
    relatedBlogCategory: "Image Editing",

    metaTitle: "Free PDF Tools — Image to PDF & PDF to Image Online | Vizo Tool",
    metaDescription:
      "Convert JPG, PNG & HEIC images to PDF and extract PDF pages to high-res JPG or PNG — free, private and 100% in your browser. No uploads, no sign-up.",
    keywords: [
      "pdf tools",
      "image to pdf",
      "jpg to pdf",
      "png to pdf",
      "pdf to image",
      "pdf to jpg",
      "pdf to png",
      "free pdf converter",
    ],

    heroBadge: "PDF Tools",
    h1: "Free PDF Tools — Convert Images & PDFs in Your Browser",
    heroDescription:
      "Turn your images into clean PDF documents and extract PDF pages as high-resolution images. Everything runs locally — private, instant and free.",

    intro: [
      "PDFs are the universal format for documents, but creating or extracting them usually means heavy desktop software. Our PDF tools handle the two most common jobs — images to PDF and PDF to images — entirely in your browser.",
      "Merge scans, receipts or photos into a single PDF with adjustable page size and orientation, or pull out every page of a PDF as a crisp JPG or PNG. No uploads, no watermarks, no limits.",
    ],
    benefits: [
      {
        title: "Merge Images Into One PDF",
        description:
          "Combine JPG, PNG and HEIC files into a single multi-page PDF and reorder pages before exporting.",
      },
      {
        title: "Extract PDF Pages as Images",
        description:
          "Convert every page of a PDF to high-resolution JPG or PNG, downloaded individually or as a ZIP.",
      },
      {
        title: "Private by Design",
        description:
          "Files are processed locally in your browser — your documents never leave your device.",
      },
      {
        title: "Print-Ready Output",
        description:
          "Choose A4, Letter or custom page sizes with quality control for clean, print-ready results.",
      },
    ],
    features: [
      {
        title: "Multi-Format Input",
        description:
          "Image to PDF accepts JPG, PNG, WEBP and HEIC. PDF to Image exports to JPG or PNG at your chosen quality.",
      },
      {
        title: "Page Reordering",
        description:
          "Drag to rearrange image pages before generating your PDF — perfect for organizing scanned documents.",
      },
      {
        title: "High-Resolution Export",
        description:
          "Extract PDF pages at full resolution so text and graphics stay sharp for printing or editing.",
      },
      {
        title: "ZIP Download",
        description:
          "Convert a whole PDF in one pass and download all extracted images as a single ZIP archive.",
      },
    ],
    howTo: [
      {
        title: "Pick your conversion direction",
        description:
          "Choose Image to PDF to create a document, or PDF to Image to extract pages.",
      },
      {
        title: "Add your files",
        description:
          "Drag & drop images or a PDF. Multi-page inputs are processed automatically.",
      },
      {
        title: "Adjust page settings",
        description:
          "Set page size, orientation, margins or output quality as needed.",
      },
      {
        title: "Download",
        description:
          "Export your PDF or image set — as individual files or a ZIP — directly from the browser.",
      },
    ],
    useCases: [
      "Turning scanned documents and photos into a single PDF for uploads",
      "Creating photo sheets or print-ready pages from phone images",
      "Extracting slides from a deck as images for social posts",
      "Sending contract pages as JPGs when PDFs are rejected by a form",
    ],
    bestPractices: [
      "Use A4 with standard margins for official submissions.",
      "Export extracted pages at high quality when you plan to edit them.",
      "Order your images before converting — reordering after is extra work.",
    ],
    commonMistakes: [
      "Exporting extracted pages at low resolution and ending up with blurry text.",
      "Converting a 50-page PDF to images when only a few pages were needed.",
      "Forgetting to rotate portrait photos before merging them into a document.",
    ],
    faqs: [
      {
        question: "Can I convert multiple images to one PDF?",
        answer:
          "Yes — add as many JPG, PNG or HEIC images as you need and they're merged into a single multi-page PDF, with options to reorder pages.",
      },
      {
        question: "Can I convert PDF pages to JPG?",
        answer:
          "Yes — the PDF to Image tool extracts every page as a high-resolution JPG (or PNG) you can download individually or as a ZIP.",
      },
      {
        question: "Are my documents uploaded anywhere?",
        answer:
          "No. Both tools process everything locally in your browser, so your PDFs and images never leave your device.",
      },
      {
        question: "Is the PDF converter free?",
        answer:
          "Completely free — unlimited pages, no watermarks and no sign-up required.",
      },
      {
        question: "What page sizes are supported?",
        answer:
          "A4, Letter and custom sizes with portrait or landscape orientation are supported for PDF generation.",
      },
    ],
  },

  {
    slug: "developer-tools",
    label: "Developer Tools",
    shortLabel: "Developer",
    categoryId: "developer",
    accent: "violet",
    gradient: "from-violet-500 to-fuchsia-500",
    relatedBlogCategory: "Developer Tools",

    metaTitle: "Free Developer Tools — JSON, Base64, QR Codes & More | Vizo Tool",
    metaDescription:
      "13+ free developer tools: JSON formatter & validator, Base64 encoder/decoder, password & UUID generators, QR code generator, CSS generators, JWT decoder, SQL formatter and live playgrounds.",
    keywords: [
      "developer tools",
      "json formatter",
      "base64 encoder",
      "qr code generator",
      "password generator",
      "uuid generator",
      "jwt decoder",
      "sql formatter",
      "css gradient generator",
    ],

    heroBadge: "Developer Tools",
    h1: "Free Developer Tools — Code Faster, Ship Cleaner",
    heroDescription:
      "Format JSON, encode Base64, generate QR codes and passwords, decode JWTs and more — all in your browser with zero installs and zero data leaving your machine.",

    intro: [
      "Every developer has a browser tab full of scattered tools for the same five jobs: formatting JSON, encoding strings, generating IDs, designing CSS and decoding tokens. Vizo Tool collects them all in one fast, private place.",
      "Better still — the HTML/CSS/JS and SQL playgrounds let you write and run real code without leaving the site. No accounts, no uploads, no telemetry.",
    ],
    benefits: [
      {
        title: "Private by Default",
        description:
          "Sensitive data like passwords, JWTs and SQL stays in your browser — it never hits a server.",
      },
      {
        title: "Instant Results",
        description:
          "Real-time formatting, validation and generation with zero page reloads and zero latency.",
      },
      {
        title: "No Installs Needed",
        description:
          "No npm packages, no CLI setup, no extensions. Every tool works in any modern browser.",
      },
      {
        title: "Live Playgrounds",
        description:
          "Run HTML/CSS/JS with a live preview and console, or execute SQLite queries with sql.js — fully client-side.",
      },
    ],
    features: [
      {
        title: "JSON Formatter & Validator",
        description:
          "Beautify, minify and validate JSON with a tree view and precise error line numbers.",
      },
      {
        title: "Base64 Encoder / Decoder",
        description:
          "Encode and decode text, files and images to and from Base64 with copy and download.",
      },
      {
        title: "QR Code Generator",
        description:
          "QR codes for URLs, WiFi, WhatsApp, UPI and more — with colors, logos and PNG/SVG/PDF export.",
      },
      {
        title: "Password & UUID Generators",
        description:
          "Cryptographically strong passwords with a strength meter, and UUID v1/v4/v7 in bulk.",
      },
      {
        title: "CSS Generators",
        description:
          "Design gradients and box shadows visually with live preview and one-click CSS copy.",
      },
      {
        title: "JWT Decoder & SQL Formatter",
        description:
          "Decode JWT headers, payloads and expiry, and beautify SQL with syntax highlighting.",
      },
    ],
    howTo: [
      {
        title: "Open the tool",
        description:
          "Choose JSON, Base64, QR, password, UUID, CSS, JWT, SQL — or a full playground.",
      },
      {
        title: "Paste or generate your input",
        description:
          "Drop in code, text or a URL. Most tools validate and format as you type.",
      },
      {
        title: "Copy or export",
        description:
          "Copy the result to your clipboard, download a file, or keep iterating in the live playground.",
      },
    ],
    useCases: [
      "Beautifying minified API responses before debugging",
      "Encoding images as data URLs for inline assets",
      "Generating WiFi and payment QR codes for print",
      "Creating strong, unique passwords for every account",
      "Inspecting JWT tokens during auth debugging",
    ],
    bestPractices: [
      "Never paste production secrets — the tools are private, but your clipboard isn't your friend.",
      "Use the tree view on large JSON to navigate nested data instead of scrolling.",
      "Pick UUID v7 for time-ordered database keys, v4 for random identifiers.",
    ],
    commonMistakes: [
      "Treating Base64 as encryption — it's encoding and is trivially reversible.",
      "Reusing the same password generator settings for master passwords.",
      "Generating QR codes without a quiet zone, then finding they don't scan.",
    ],
    faqs: [
      {
        question: "Are the developer tools really free?",
        answer:
          "Yes — every developer tool is free, unlimited and requires no sign-up.",
      },
      {
        question: "Does the JSON formatter validate as I type?",
        answer:
          "Yes — it validates in real time and shows the exact error with a line number for fast fixes.",
      },
      {
        question: "Can the QR generator encode WiFi networks?",
        answer:
          "Yes — enter the network name and password to generate a scannable WiFi QR code.",
      },
      {
        question: "Are my passwords and tokens stored anywhere?",
        answer:
          "No. Everything is generated and processed locally in your browser — nothing is transmitted or saved.",
      },
      {
        question: "What can the SQL playground do?",
        answer:
          "It runs real SQLite in the browser with sql.js — create tables, query sample databases, import CSV and export results.",
      },
      {
        question: "Is the HTML/CSS/JS playground like CodePen?",
        answer:
          "Very similar — split editors for HTML, CSS and JS with a live preview, console, templates and ZIP export.",
      },
    ],
  },

  {
    slug: "seo-tools",
    label: "SEO Tools",
    shortLabel: "SEO",
    categoryId: "seo",
    accent: "teal",
    gradient: "from-teal-500 to-emerald-500",
    relatedBlogCategory: "SEO & Marketing",

    metaTitle: "Free SEO Tools — Meta Tags, Schema, SERP Preview & More | Vizo Tool",
    metaDescription:
      "10+ free SEO tools: meta tag generator, schema markup generator, robots.txt & sitemap generators, UTM builder, SERP preview, slug generator and meta tag analyzer — all in your browser.",
    keywords: [
      "seo tools",
      "free seo tools online",
      "meta tag generator",
      "schema markup generator",
      "robots.txt generator",
      "sitemap generator",
      "utm builder",
      "serp preview",
      "slug generator",
    ],

    heroBadge: "SEO Tools",
    h1: "Free SEO Tools — Rank Higher, Work Smarter",
    heroDescription:
      "Generate perfect meta tags, structured data, robots.txt and sitemaps, preview your SERP listing and build trackable UTM links — free, private and right in your browser.",

    intro: [
      "Technical SEO is a checklist: meta tags, structured data, sitemaps, robots.txt, clean URLs and a SERP listing worth clicking. Vizo Tool turns that checklist into a set of one-click generators.",
      "Every tool outputs production-ready code with live previews — see your title and description exactly as Google would, validate your JSON-LD, and preview social cards before you ship.",
    ],
    benefits: [
      {
        title: "Live SERP Previews",
        description:
          "See exactly how your title, description and URL will look in Google results — desktop and mobile — before you publish.",
      },
      {
        title: "Valid Output, Every Time",
        description:
          "Generated meta tags, schema and sitemaps follow current best practices, with built-in validation where it matters.",
      },
      {
        title: "Private Audits",
        description:
          "Analyze any page's meta tags and headings directly from your browser — no third-party crawler sees your site.",
      },
      {
        title: "Built for Beginners & Pros",
        description:
          "From quick meta tag generation to full schema markup — approachable for marketers, powerful enough for SEOs.",
      },
    ],
    features: [
      {
        title: "Meta Tag Generator",
        description:
          "Generate title, description, canonical, robots, Open Graph and Twitter tags with a live SERP preview and SEO score.",
      },
      {
        title: "Schema Markup Generator",
        description:
          "Valid JSON-LD for 15+ types — Article, FAQ, Product, HowTo, Breadcrumb, Organization and more.",
      },
      {
        title: "Robots.txt & Sitemap Generators",
        description:
          "Build clean robots.txt files and XML sitemaps (including image and video entries) with syntax validation.",
      },
      {
        title: "SERP Preview & Slug Generator",
        description:
          "Preview search listings with character counts and truncation warnings, and generate clean SEO-friendly slugs.",
      },
      {
        title: "UTM Builder & Analyzers",
        description:
          "Build trackable campaign URLs with QR codes, audit meta tags with an SEO score, and check heading hierarchy.",
      },
    ],
    howTo: [
      {
        title: "Pick a generator",
        description:
          "Choose meta tags, schema, robots.txt, sitemap, UTM or a preview/analyzer tool.",
      },
      {
        title: "Fill in your page details",
        description:
          "Add title, description, URL and fields — previews update live as you type.",
      },
      {
        title: "Copy or download",
        description:
          "Grab the ready-to-paste HTML, JSON-LD or config file and drop it straight into your site.",
      },
    ],
    useCases: [
      "Writing title tags and meta descriptions for every page of a new site",
      "Adding FAQ and Article schema to blog posts for rich results",
      "Building a fresh robots.txt and XML sitemap at launch",
      "Auditing competitors' meta tags and heading structure",
      "Tagging campaign links with UTM parameters for analytics",
    ],
    bestPractices: [
      "Write one unique title (50–60 chars) and description (150–160 chars) per page.",
      "Use structured data only for content that's visible on the page — no fake markup.",
      "Keep canonical tags pointing to the exact URL you want indexed.",
      "Submit your sitemap in Google Search Console after launch.",
    ],
    commonMistakes: [
      "Copying the same meta description across dozens of pages.",
      "Adding schema markup for content that isn't on the page (a spam risk).",
      "Forgetting canonical tags and letting duplicate pages compete.",
    ],
    faqs: [
      {
        question: "Are the SEO tools really free?",
        answer:
          "Yes — every SEO tool is free, unlimited and runs entirely in your browser. No sign-up required.",
      },
      {
        question: "What does the SERP preview show?",
        answer:
          "It renders your title, description and URL exactly as they appear in Google search results, with character counts and truncation warnings for desktop and mobile.",
      },
      {
        question: "Can I generate schema markup without coding?",
        answer:
          "Yes — pick a type like Article or FAQ, fill in the fields, and the generator writes valid JSON-LD you can copy straight into your page.",
      },
      {
        question: "Do the analyzers upload my site's data?",
        answer:
          "No — the meta tag analyzer and heading checker work directly in your browser, so no third party sees your pages.",
      },
      {
        question: "Is UTM tagging important for SEO?",
        answer:
          "UTMs don't affect rankings directly, but clean, consistent campaign tracking gives you the analytics you need to measure and improve SEO performance.",
      },
      {
        question: "Do you support image and video sitemaps?",
        answer:
          "Yes — the sitemap generator outputs standard XML plus image and video sitemap entries.",
      },
    ],
  },

  {
    slug: "website-analysis-tools",
    label: "Website Analysis Tools",
    shortLabel: "Analysis",
    categoryId: "analysis",
    accent: "amber",
    gradient: "from-amber-500 to-orange-500",
    relatedBlogCategory: "SEO & Marketing",

    metaTitle: "Free Website Analysis Tools — Traffic Checker & SEO Signals | Vizo Tool",
    metaDescription:
      "Estimate website traffic from public SEO signals, check technical health, SEO score and performance — free, with transparent methodology and no misleading numbers.",
    keywords: [
      "website analysis tools",
      "website traffic checker",
      "traffic estimator",
      "seo score checker",
      "website health check",
      "domain analysis",
    ],

    heroBadge: "Website Analysis Tools",
    h1: "Free Website Analysis Tools — Understand Any Site",
    heroDescription:
      "Estimate traffic and audit the technical health of any website from public signals — domain age, indexability, meta tags, performance and more. Transparent estimates, never fake precision.",

    intro: [
      "How many visitors does a website really get? Only the site owner knows for sure. But public signals — domain age, indexability, content quality, performance — reveal a lot.",
      "The website traffic checker combines those signals into a transparent, weighted estimate of monthly and yearly visits, alongside a full technical health score with actionable recommendations.",
    ],
    benefits: [
      {
        title: "Transparent Methodology",
        description:
          "Every estimate is labeled as an estimate, with the public SEO signals behind it — no made-up precision.",
      },
      {
        title: "Full-Site Health Audit",
        description:
          "Get SEO, technical, performance and accessibility scores in one report, plus specific fixes to apply.",
      },
      {
        title: "Competitor Comparison",
        description:
          "Compare two domains side by side — estimated traffic, SEO score, performance and technical health.",
      },
      {
        title: "Privacy-First Analysis",
        description:
          "Reports are generated in your browser and saved locally — your search history stays yours.",
      },
    ],
    features: [
      {
        title: "Traffic Estimation Engine",
        description:
          "A weighted scoring model over SEO signals produces estimated monthly and yearly visitors with a confidence score.",
      },
      {
        title: "SEO Signal Analysis",
        description:
          "Checks domain age, HTTPS, indexability, meta tags, headings, canonical, robots.txt, sitemap and structured data.",
      },
      {
        title: "Performance & Health Scores",
        description:
          "Visual score cards for SEO, technical, performance, accessibility and overall website health.",
      },
      {
        title: "Actionable Recommendations",
        description:
          "Auto-generated fixes for missing meta descriptions, weak headings, missing sitemaps and slow-loading pages.",
      },
      {
        title: "Compare & History",
        description:
          "Compare two domains, save previous searches locally and favorite sites for quick re-checks.",
      },
    ],
    howTo: [
      {
        title: "Enter a domain",
        description:
          "Type example.com or https://example.com — the tool normalizes and validates it.",
      },
      {
        title: "Review the signals",
        description:
          "Watch the analysis pipeline walk through public SEO signals in real time.",
      },
      {
        title: "Read the report",
        description:
          "Explore estimated traffic, scores, charts and the recommendation list.",
      },
      {
        title: "Export or compare",
        description:
          "Download the PDF report, print it, share a summary — or run a head-to-head comparison.",
      },
    ],
    useCases: [
      "Researching a competitor's online presence before entering a market",
      "Estimating the size of a niche before starting a content site",
      "Checking your own site's technical SEO health and fixing gaps",
      "Evaluating potential partnership or link-building targets",
    ],
    bestPractices: [
      "Treat estimates as ranges, not analytics — only the site owner has exact numbers.",
      "Combine the traffic estimate with the technical audit for the full picture.",
      "Re-run the analysis after making recommended fixes to track improvement.",
    ],
    commonMistakes: [
      "Assuming the estimated traffic is an exact figure — it never is.",
      "Judging a site on traffic alone while ignoring its technical health.",
      "Comparing sites of very different ages without considering domain age.",
    ],
    faqs: [
      {
        question: "Is the traffic number exact?",
        answer:
          "No — it's an estimation based on publicly available SEO signals and should never be treated as official analytics. Only the site owner sees real numbers.",
      },
      {
        question: "How is traffic estimated?",
        answer:
          "A weighted scoring model combines public signals — domain age, indexability, content quality, performance and technical SEO — to produce a confidence-scored estimate.",
      },
      {
        question: "What signals does the analysis check?",
        answer:
          "Domain age, HTTPS, indexability, meta tags, headings, canonical, robots.txt, sitemap, structured data, security headers, performance and more.",
      },
      {
        question: "Is this tool free?",
        answer:
          "Yes — the traffic checker and analysis tools are completely free with no usage limits.",
      },
      {
        question: "Can I compare two websites?",
        answer:
          "Yes — compare mode shows two domains side by side across traffic, SEO, performance and technical scores.",
      },
      {
        question: "Where is my analysis history stored?",
        answer:
          "Locally in your browser — previous searches and favorites never leave your device.",
      },
    ],
  },

  {
    slug: "finance-tools",
    label: "Finance Tools",
    shortLabel: "Finance",
    categoryId: "finance",
    accent: "success",
    gradient: "from-emerald-500 to-teal-500",
    relatedBlogCategory: "Finance & Calculators",

    metaTitle: "Free Finance Calculators — SIP, EMI, Tax, FD & More | Vizo Tool",
    metaDescription:
      "14+ free finance calculators: SIP, compound interest, EMI, GST, FD, CAGR, ROI, income tax, retirement, salary and more — with charts, breakdowns and instant results in your browser.",
    keywords: [
      "finance calculators",
      "sip calculator",
      "emi calculator",
      "gst calculator",
      "compound interest calculator",
      "income tax calculator",
      "fd calculator",
      "retirement calculator",
      "salary calculator",
    ],

    heroBadge: "Finance Tools",
    h1: "Free Finance Calculators — Plan Your Money with Confidence",
    heroDescription:
      "SIP, EMI, GST, tax, FD, retirement and 8 more calculators — each with live charts, year-by-year breakdowns and clear explanations. Free, private and educational.",

    intro: [
      "Money decisions get easier when you can see the numbers. Vizo Tool's finance calculators turn formulas into clear visuals — growth charts, amortization tables and year-wise breakdowns.",
      "Every calculator is free, private and runs entirely in your browser. Results are estimates for educational purposes — not financial, tax or investment advice.",
    ],
    benefits: [
      {
        title: "Live Results While You Type",
        description:
          "Every slider and input updates the charts and summary instantly — explore scenarios without pressing a button.",
      },
      {
        title: "Year-by-Year Breakdowns",
        description:
          "See exactly how SIPs, EMIs and FDs grow year over year with detailed tables and growth charts.",
      },
      {
        title: "India-First, World-Ready",
        description:
          "Income tax (old & new regimes), GST with CGST/SGST, and INR formatting — designed with Indian users in mind.",
      },
      {
        title: "Educational & Transparent",
        description:
          "Each calculator shows the formula and a plain-English explanation, so you understand the result, not just see it.",
      },
    ],
    features: [
      {
        title: "SIP & Compound Interest",
        description:
          "Project SIP growth with step-up and inflation adjustment, or compound any principal with custom frequency.",
      },
      {
        title: "EMI & Loan Planning",
        description:
          "Monthly EMI, total interest and a full amortization schedule with processing fee and prepayment options.",
      },
      {
        title: "Tax & Salary",
        description:
          "Income tax under old and new regimes with education cess, and take-home salary from CTC with PF and professional tax.",
      },
      {
        title: "Investments & Business",
        description:
          "CAGR, ROI, profit margin, stock averaging and discount calculators for investors and store owners.",
      },
      {
        title: "Retirement & Inflation",
        description:
          "Project your retirement corpus with the 4% rule and see how inflation erodes purchasing power.",
      },
    ],
    howTo: [
      {
        title: "Choose a calculator",
        description:
          "Pick SIP, EMI, tax, FD or any of the 14 calculators from the grid.",
      },
      {
        title: "Adjust the inputs",
        description:
          "Move sliders or type values — results, charts and tables update instantly.",
      },
      {
        title: "Explore the breakdown",
        description:
          "Open the year-wise table or growth chart to understand how the numbers add up.",
      },
      {
        title: "Copy or save",
        description:
          "Copy the result, download a PDF summary, or save the calculation to your history.",
      },
    ],
    useCases: [
      "Estimating the monthly SIP needed to reach a target corpus",
      "Comparing home loan EMIs across tenures before applying",
      "Calculating GST on invoices and purchases",
      "Estimating income tax under old vs new regime",
      "Working out the average cost of stock purchases",
    ],
    bestPractices: [
      "Use conservative return assumptions for long-term projections.",
      "Check both old and new tax regimes before filing.",
      "Treat all results as estimates — consult a professional for major decisions.",
    ],
    commonMistakes: [
      "Assuming past or assumed returns are guaranteed.",
      "Forgetting inflation when projecting retirement needs.",
      "Basing an EMI decision on the monthly figure without considering total interest.",
    ],
    faqs: [
      {
        question: "Are the finance calculators free?",
        answer:
          "Yes — all 14 calculators are completely free with no sign-up, no limits and no ads interrupting your math.",
      },
      {
        question: "Are the results financial advice?",
        answer:
          "No — every result is an estimate for educational purposes only and is not financial, investment, tax or legal advice.",
      },
      {
        question: "Does the income tax calculator support both regimes?",
        answer:
          "Yes — it computes tax under both the old and new regimes with standard deduction and education cess.",
      },
      {
        question: "Can I see how my SIP grows over time?",
        answer:
          "Yes — the SIP calculator shows a year-wise table and growth chart, with step-up and inflation options.",
      },
      {
        question: "Is my financial data private?",
        answer:
          "Completely — calculations run in your browser and nothing you enter is transmitted or stored.",
      },
      {
        question: "Do you support INR formatting?",
        answer:
          "Yes — results are formatted in Indian numbering (lakhs/crores) with the ₹ symbol by default.",
      },
    ],
  },

  {
    slug: "youtube-tools",
    label: "YouTube Tools",
    shortLabel: "YouTube",
    categoryId: "youtube",
    accent: "orange",
    gradient: "from-orange-500 to-red-500",
    relatedBlogCategory: "YouTube Creators",

    metaTitle: "Free YouTube Tools — Thumbnails, Tags, Titles & More | Vizo Tool",
    metaDescription:
      "5+ free YouTube creator tools: thumbnail downloader, tags extractor, transcript extractor, title generator and description generator — built for creators, in your browser.",
    keywords: [
      "youtube tools",
      "youtube thumbnail downloader",
      "youtube tags extractor",
      "youtube transcript",
      "youtube title generator",
      "youtube description generator",
      "youtube seo",
    ],

    heroBadge: "YouTube Tools",
    h1: "Free YouTube Tools — Create Faster, Grow Smarter",
    heroDescription:
      "Download thumbnails in every resolution, extract tags and transcripts, and generate SEO-scored titles and descriptions — the creator workflow, all in your browser.",

    intro: [
      "Growing on YouTube is a content operation: thumbnail, title, tags, description, transcript. Each one takes time — unless you have the right tools.",
      "Vizo Tool's YouTube suite handles the repetitive parts: grabbing thumbnails at max resolution, extracting tags and transcripts from public data, and generating SEO-scored titles and descriptions.",
    ],
    benefits: [
      {
        title: "Grab Thumbnails at Max Resolution",
        description:
          "Pull the default, medium, high, standard or max-resolution thumbnail from any video URL in one click.",
      },
      {
        title: "SEO-Scored Titles & Descriptions",
        description:
          "Generate multiple title options with SEO scores and character counts, plus full descriptions with hashtags.",
      },
      {
        title: "Transcripts with Timestamps",
        description:
          "Extract publicly available transcripts in timestamp or plain-text view, searchable and exportable.",
      },
      {
        title: "Built for Creator Workflows",
        description:
          "Copy, download and history features that slot into your existing publishing routine.",
      },
    ],
    features: [
      {
        title: "Thumbnail Downloader",
        description:
          "Extract the video ID, preview the thumbnail gallery and download any available resolution as an image.",
      },
      {
        title: "Tags Extractor",
        description:
          "Analyze video tags with counts and character budgets, and get related tag suggestions.",
      },
      {
        title: "Transcript Extractor",
        description:
          "Fetch publicly available transcripts with timestamp or plain-text views, search, copy, TXT or PDF export.",
      },
      {
        title: "Title & Description Generators",
        description:
          "Generate SEO-scored title ideas by keyword, category and tone, plus description templates with CTAs and hashtags.",
      },
    ],
    howTo: [
      {
        title: "Paste a video URL",
        description:
          "Drop a YouTube link into the thumbnail, tags or transcript tool — the ID is extracted automatically.",
      },
      {
        title: "Review & refine",
        description:
          "Pick a thumbnail resolution, copy tags, or regenerate titles until one clicks.",
      },
      {
        title: "Export",
        description:
          "Download images or TXT/PDF files, or copy straight into YouTube Studio.",
      },
    ],
    useCases: [
      "Grabbing a video's best thumbnail for scheduling or analysis",
      "Researching tags and transcripts from top-performing videos",
      "Brainstorming click-worthy titles with SEO scores",
      "Writing complete descriptions with hashtags and CTAs in minutes",
    ],
    bestPractices: [
      "Use max-resolution thumbnails for reference, but create your own for originality.",
      "Keep titles under 60 characters and front-load the keyword.",
      "Put the most important hashtags in the first three lines of the description.",
    ],
    commonMistakes: [
      "Copying competitors' thumbnails or titles verbatim instead of making your own.",
      "Stuffing every possible tag instead of using a focused tag set.",
      "Ignoring the description — it's an SEO surface you control fully.",
    ],
    faqs: [
      {
        question: "Are the YouTube tools free?",
        answer:
          "Yes — all creator tools are free, unlimited and run entirely in your browser.",
      },
      {
        question: "Can I download thumbnails in HD?",
        answer:
          "Yes — the thumbnail downloader shows every available resolution, up to max resolution, and lets you save each one.",
      },
      {
        question: "Can I get a transcript of any video?",
        answer:
          "You can extract the transcript whenever one is publicly available — results include a timestamp view and search.",
      },
      {
        question: "Do the generators write clickbait titles?",
        answer:
          "No — they produce SEO-scored, keyword-aware title options you can tailor to your tone and audience.",
      },
      {
        question: "Is my data private?",
        answer:
          "Yes — URL parsing and generation happen locally; nothing you paste is stored on our servers.",
      },
      {
        question: "Can I export transcripts and tags?",
        answer:
          "Yes — transcripts export as TXT or PDF, and tags export as TXT with copy support.",
      },
    ],
  },
];

export function getCategoryPage(slug: string): CategoryPageConfig | undefined {
  return CATEGORY_PAGES.find((c) => c.slug === slug);
}

/** Map a TOOL_CATEGORIES id to its category landing page slug (for nav/footer links). */
export const CATEGORY_PAGE_BY_CATEGORY_ID: Record<string, string> = Object.fromEntries(
  CATEGORY_PAGES.filter((c) => c.categoryId).map((c) => [c.categoryId!, c.slug])
);

