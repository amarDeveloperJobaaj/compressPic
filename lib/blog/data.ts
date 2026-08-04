import type {
  BlockTone,
  BlogBlock,
  BlogCategory,
  BlogPost,
  TableKind,
} from "./types";
import { daysAgo, estimateReadTime } from "./utils";

/* ---------------------------------------------------------------------------
 * Builder helpers — keep the seed content compact and type-safe.
 * ------------------------------------------------------------------------- */

const h = (level: 2 | 3 | 4, text: string): BlogBlock => ({ type: "heading", level, text });
const p = (text: string): BlogBlock => ({ type: "paragraph", text });
const code = (code: string, language?: string): BlogBlock => ({ type: "code", code, language });
const alert = (tone: BlockTone, title: string, text: string): BlogBlock => ({ type: "alert", tone, title, text });
const callout = (title: string, text: string): BlogBlock => ({ type: "callout", title, text });
const checklist = (items: string[]): BlogBlock => ({ type: "checklist", items });
const list = (ordered: boolean, items: string[]): BlogBlock => ({ type: "list", ordered, items });
const table = (kind: TableKind, columns: string[], rows: string[][]): BlogBlock => ({
  type: "table",
  kind,
  columns,
  rows,
});
const prosCons = (pros: string[], cons: string[]): BlogBlock => ({ type: "prosCons", pros, cons });
const gallery = (images: { src: string; alt: string }[]): BlogBlock => ({ type: "gallery", images });
const beforeAfter = (before: string, after: string, labelBefore?: string, labelAfter?: string): BlogBlock => ({
  type: "beforeAfter",
  before,
  after,
  labelBefore,
  labelAfter,
});
const steps = (items: { title: string; text: string }[]): BlogBlock => ({ type: "steps", items });
const faq = (items: { question: string; answer: string }[]): BlogBlock => ({ type: "faq", items });
const stats = (items: { value: string; label: string }[]): BlogBlock => ({ type: "stats", items });
const toolEmbed = (toolSlug: string): BlogBlock => ({ type: "toolEmbed", toolSlug });
const toolCta = (toolSlug: string, title: string, text: string): BlogBlock => ({
  type: "toolCta",
  toolSlug,
  title,
  text,
});
const relatedToolCard = (toolSlug: string): BlogBlock => ({ type: "relatedToolCard", toolSlug });
const authorCard = (): BlogBlock => ({ type: "authorCard" });
const newsletter = (): BlogBlock => ({ type: "newsletterCard" });

/** Same-origin OG-style cover image generated for a title. */
const og = (title: string) => `/og?title=${encodeURIComponent(title)}`;

/* ---------------------------------------------------------------------------
 * Categories
 * ------------------------------------------------------------------------- */

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "image-editing",
    name: "Image Editing",
    description: "Compress, resize, crop, flip and watermark photos — all in your browser.",
  },
  {
    slug: "developer",
    name: "Developer Tools",
    description: "Format JSON, generate QR codes, write SQL and ship faster with practical dev guides.",
  },
  {
    slug: "seo",
    name: "SEO & Marketing",
    description: "Meta tags, schema markup, SERP previews and search optimization guides that actually work.",
  },
  {
    slug: "finance",
    name: "Finance & Calculators",
    description: "SIP, EMI, tax and investment calculators explained with real numbers.",
  },
  {
    slug: "youtube",
    name: "YouTube Creators",
    description: "Thumbnails, transcripts, titles and descriptions — creator workflows without the guesswork.",
  },
  {
    slug: "guides",
    name: "Guides & How-Tos",
    description: "Practical, ad-free walkthroughs for everyday online tasks.",
  },
];

/* ---------------------------------------------------------------------------
 * Posts
 * ------------------------------------------------------------------------- */

interface PostSeed {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  tags: string[];
  author?: string;
  authorRole?: string;
  publishedDaysAgo: number;
  updatedDaysAgo: number;
  status?: "published" | "draft";
  featured?: boolean;
  trending?: boolean;
  editorsPick?: boolean;
  readCount?: number;
  content: BlogBlock[];
}

function makePost(seed: PostSeed): BlogPost {
  const coverTitle = seed.title.length > 60 ? seed.title : seed.title;
  return {
    id: `seed-${seed.slug}`,
    slug: seed.slug,
    title: seed.title,
    subtitle: seed.subtitle,
    excerpt: seed.excerpt,
    cover: og(coverTitle),
    coverAlt: seed.title,
    category: seed.category,
    tags: seed.tags,
    author: seed.author ?? "Amar Lodhi",
    authorRole: seed.authorRole ?? "Founder, Vizo Tool",
    publishedAt: daysAgo(seed.publishedDaysAgo),
    updatedAt: daysAgo(seed.updatedDaysAgo),
    readTime: estimateReadTime(seed.content),
    status: seed.status ?? "published",
    featured: seed.featured ?? false,
    trending: seed.trending ?? false,
    editorsPick: seed.editorsPick ?? false,
    readCount: seed.readCount ?? 1200,
    content: seed.content,
  };
}

export const BLOG_POSTS: BlogPost[] = [
  makePost({
    slug: "how-to-compress-images-without-losing-quality",
    title: "How to Compress Images Without Losing Quality (2026 Guide)",
    subtitle: "Shrink JPG, PNG and WEBP files to 50 KB or 100 KB while keeping them sharp.",
    excerpt:
      "A practical, no-nonsense guide to compressing images in your browser — target sizes, format trade-offs, and the mistakes that ruin quality.",
    category: "Image Editing",
    tags: ["image compression", "jpg", "png", "webp", "file size"],
    publishedDaysAgo: 2,
    updatedDaysAgo: 0,
    featured: true,
    trending: true,
    readCount: 18240,
    content: [
      p(
        "Large images are the silent killer of page speed, email deliverability and app review queues. A 4 MB photo can become a 120 KB file with almost no visible difference — if you compress it the right way."
      ),
      stats([
        { value: "90%", label: "typical size reduction on photos" },
        { value: "50 KB", label: "common limit for forms & apps" },
        { value: "0", label: "uploads — everything stays local" },
      ]),
      h(2, "Why compression matters more in 2026"),
      p(
        "Google's Core Web Vitals treat image weight as a direct ranking factor, and every messaging app enforces file limits. Compressing before you upload is the single highest-leverage habit you can build."
      ),
      list(true, [
        "Faster pages mean better SEO and higher conversions.",
        "Smaller files upload faster and use less bandwidth.",
        "Email and job-portal forms reject images above their limit.",
        "Your original stays untouched — you always keep the master copy.",
      ]),
      h(2, "Try it right now — no uploads, no sign-up"),
      p(
        "The compressor below runs 100% in your browser using the Canvas API. Drop any image on it, pick a target size like 50 KB or 100 KB, and download the result."
      ),
      toolEmbed("compress"),
      h(2, "The 3-step workflow professionals use"),
      steps([
        {
          title: "Pick a target size, not a quality slider",
          text: "Decide the limit you need — 50 KB for forms, 100 KB for email, 200 KB for most websites — and let the algorithm hit it.",
        },
        {
          title: "Choose the right output format",
          text: "Photos compress best as JPG or WEBP. Logos and screenshots with text stay crisp as PNG.",
        },
        {
          title: "Verify quality before you ship",
          text: "Always preview the compressed image side by side with the original at 100% zoom.",
        },
      ]),
      h(2, "JPG vs PNG vs WEBP — which should you compress?"),
      table(
        "comparison",
        ["Format", "Best for", "Transparency", "Typical saving"],
        [
          ["JPG", "Photos, gradients", "No", "Up to 85%"],
          ["PNG", "Logos, screenshots, text", "Yes", "Lossless only"],
          ["WEBP", "Web images, everything modern", "Yes", "Up to 90%"],
        ]
      ),
      alert(
        "tip",
        "The PNG trap",
        "PNG re-encodes losslessly, so a PNG photo often stays huge. If your file won't shrink, convert to JPG or WEBP first — then compress."
      ),
      h(2, "Common compression mistakes"),
      checklist([
        "Compressing a PNG photo instead of converting to JPG first.",
        "Setting quality to 10% to force a size — always look at the preview.",
        "Compressing the same file twice (quality degrades each pass).",
        "Forgetting to keep the original master file.",
      ]),
      h(2, "Frequently asked questions"),
      faq([
        {
          question: "Can I compress an image to exactly 50 KB?",
          answer:
            "Yes. Set 50 KB as the target and the algorithm adjusts the encoding to land as close as possible while preserving quality.",
        },
        {
          question: "Is it really free and private?",
          answer:
            "Completely free and private — processing happens in your browser and your image never leaves your device.",
        },
        {
          question: "What's the best format for photos?",
          answer:
            "WEBP gives the smallest file at equal quality for most photos. JPG is the safest for universal compatibility.",
        },
        {
          question: "Will compressing reduce quality?",
          answer:
            "Done right, the difference is invisible at screen size. The tool previews the result so you can judge before downloading.",
        },
      ]),
      toolCta(
        "compress",
        "Compress your first image in seconds",
        "Free, unlimited and 100% in your browser — no watermarks, no queues, no sign-up."
      ),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "passport-photo-size-guide-by-country",
    title: "Passport Photo Size Guide by Country (2026)",
    subtitle: "Exact passport & visa photo dimensions for the US, India, UK, Canada and 20+ more.",
    excerpt:
      "One wrong pixel and your visa application gets rejected. Here are the official passport photo sizes by country — and how to make one at home for free.",
    category: "Image Editing",
    tags: ["passport photo", "visa photo", "photo size", "id photo"],
    publishedDaysAgo: 5,
    updatedDaysAgo: 1,
    featured: true,
    readCount: 15780,
    content: [
      p(
        "Every country's passport office publishes its own photo requirements — and they're surprisingly strict. In this guide we've collected the exact dimensions for the most common destinations so you can make a compliant photo at home."
      ),
      h(2, "Official sizes by country"),
      table(
        "features",
        ["Country", "Size", "Pixels @ 300 DPI", "Background"],
        [
          ["United States", "2 × 2 in (51 × 51 mm)", "600 × 600", "White"],
          ["India", "35 × 45 mm", "413 × 531", "White / light"],
          ["United Kingdom", "35 × 45 mm", "413 × 531", "Light grey"],
          ["Canada", "50 × 70 mm", "590 × 826", "White"],
          ["Australia", "35 × 45 mm", "413 × 531", "Light grey"],
          ["Schengen (EU)", "35 × 45 mm", "413 × 531", "Light grey"],
          ["China", "33 × 48 mm", "390 × 567", "White"],
        ]
      ),
      alert(
        "warning",
        "Rules change",
        "Always double-check the latest embassy requirements before submitting. Sizes above are a starting point, not a guarantee.",
      ),
      h(2, "Make a compliant photo in 4 steps"),
      steps([
        {
          title: "Take a straight-on photo",
          text: "Face the camera, neutral expression, even lighting, plain background.",
        },
        {
          title: "Choose your country",
          text: "Pick from 25+ presets — the tool applies the official dimensions automatically.",
        },
        {
          title: "Position your face",
          text: "Drag and zoom until your head fills the frame the way the guidelines describe.",
        },
        {
          title: "Download or print a sheet",
          text: "Export a single photo or a full 4×6 / A4 print sheet with multiple copies.",
        },
      ]),
      h(2, "Try the passport photo maker"),
      toolEmbed("passport-photo-maker"),
      h(2, "Common rejection reasons"),
      checklist([
        "Head too small or too large in the frame.",
        "Shadows or red-eye from flash photography.",
        "Wrong background color for the country.",
        "Glasses glare or hair covering the eyes.",
        "Photo resized to fit instead of cropped to spec.",
      ]),
      h(2, "FAQ"),
      faq([
        {
          question: "What size is a US passport photo?",
          answer: "2 × 2 inches (51 × 51 mm), which is 600 × 600 pixels at 300 DPI.",
        },
        {
          question: "What size is an Indian passport photo?",
          answer: "35 × 45 mm (413 × 531 pixels at 300 DPI) with a white or light background.",
        },
        {
          question: "Can I use a phone photo for a passport?",
          answer:
            "Yes, as long as the lighting and framing meet the guidelines. The tool crops it to the exact official dimensions.",
        },
        {
          question: "Is a print sheet the same as a single photo?",
          answer:
            "A print sheet arranges multiple copies of your photo on one page for home printing — ideal when you need several prints.",
        },
      ]),
      toolCta(
        "passport-photo-maker",
        "Make your passport photo now",
        "Free, private, and built for 25+ countries — download a single photo or a full print sheet."
      ),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "how-to-remove-background-from-image",
    title: "How to Remove Background from an Image in Seconds",
    subtitle: "Cut out any subject, replace the background, and export a transparent PNG — free.",
    excerpt:
      "The complete beginner's guide to AI background removal in the browser: how it works, how to get clean edges, and how to export without artifacts.",
    category: "Image Editing",
    tags: ["background remover", "transparent png", "ai tool", "cutout"],
    publishedDaysAgo: 8,
    updatedDaysAgo: 2,
    trending: true,
    editorsPick: true,
    readCount: 21340,
    content: [
      p(
        "Removing a background used to mean minutes of lasso-tool work. Modern AI models detect the subject in a single pass — and now that runs entirely inside your browser, on your device, with zero uploads."
      ),
      h(2, "How browser-based background removal works"),
      p(
        "A neural network (an ONNX model) processes the image and predicts a pixel-level mask: subject or background. The first run downloads the model once, then everything is cached locally."
      ),
      steps([
        {
          title: "Upload your image",
          text: "JPG, PNG or WEBP, up to 50 MB. Drag, browse or paste from clipboard.",
        },
        {
          title: "AI cuts out the subject",
          text: "Hair, fur and fine edges are detected automatically — no manual selection.",
        },
        {
          title: "Refine & replace",
          text: "Swap in a color, gradient, blur, or another photo. Use the restore/erase brushes for tricky spots.",
        },
        {
          title: "Export",
          text: "Download a transparent PNG, colored PNG, JPG or WEBP — or the whole batch as a ZIP.",
        },
      ]),
      h(2, "Before / after"),
      p("Drag the slider to compare the original with a transparent cutout."),
      beforeAfter(
        og("Original photo"),
        og("Background removed"),
        "Original",
        "Transparent PNG"
      ),
      h(2, "Try it live"),
      toolEmbed("remove-background"),
      h(2, "Where transparent PNGs shine"),
      list(false, [
        "E-commerce product photos with clean, consistent backdrops.",
        "Logos and social media assets that adapt to any color.",
        "YouTube thumbnails that pop against bright backgrounds.",
        "Presentations and documents where photos must blend in.",
      ]),
      h(2, "Tips for clean edges"),
      checklist([
        "Shoot the subject against a contrasting background.",
        "Light hair — use the hair refinement and restore brush.",
        "Use the erase brush for leftover shadow blobs.",
        "Export PNG for crisp transparency, JPG for small file size.",
      ]),
      h(2, "FAQ"),
      faq([
        {
          question: "Is AI background removal really free?",
          answer:
            "Yes — unlimited, no watermarks and no sign-up. The AI model runs in your browser.",
        },
        {
          question: "Are my photos uploaded anywhere?",
          answer:
            "Never. Everything runs locally with WebAssembly, so images never leave your device.",
        },
        {
          question: "Why does the first use download a model?",
          answer:
            "The ~80 MB AI model must be fetched once so it can run offline afterwards. It's cached for future sessions.",
        },
        {
          question: "Can I process multiple images at once?",
          answer:
            "Yes — the batch queue processes uploads automatically and lets you download everything as a ZIP.",
        },
      ]),
      toolCta(
        "remove-background",
        "Remove a background in seconds",
        "AI-powered, private, and free — cut out any subject and export a transparent PNG."
      ),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "jpg-vs-png-vs-webp-vs-avif",
    title: "JPG vs PNG vs WEBP vs AVIF: Which Image Format Should You Use?",
    subtitle: "A plain-English comparison of the four formats that matter in 2026.",
    excerpt:
      "Transparency, file size, quality and browser support — everything you need to pick the right image format for the job.",
    category: "Image Editing",
    tags: ["jpg", "png", "webp", "avif", "image formats"],
    publishedDaysAgo: 12,
    updatedDaysAgo: 3,
    readCount: 9840,
    content: [
      p(
        "Format choice is a trade-off between quality, size and compatibility. This guide breaks down the four formats you'll actually meet in 2026 and when each one wins."
      ),
      h(2, "The 60-second verdict"),
      table(
        "comparison",
        ["Format", "Transparency", "Compression", "Best use case"],
        [
          ["JPG", "No", "Lossy, universal", "Photos anywhere"],
          ["PNG", "Yes", "Lossless", "Logos, screenshots, text"],
          ["WEBP", "Yes", "Lossy + lossless", "Modern web images"],
          ["AVIF", "Yes", "State-of-the-art", "Smallest files, new browsers"],
        ]
      ),
      h(2, "JPG — the reliable workhorse"),
      p(
        "JPG has been the web's default photo format for 30 years. It compresses photos well and every device, app and printer reads it. Its weakness: no transparency, and blocky artifacts at very low quality."
      ),
      h(2, "PNG — crisp where it counts"),
      p(
        "PNG is lossless, which makes it perfect for flat graphics: logos, icons, screenshots and anything with text. The catch is file size — a PNG photo is usually enormous compared to JPG."
      ),
      h(2, "WEBP — the practical upgrade"),
      p(
        "WEBP gives you JPG-level photo compression with PNG-style transparency support, and every modern browser supports it. It's the safest 'best of both worlds' pick for websites."
      ),
      h(2, "AVIF — the size king"),
      p(
        "AVIF offers the best compression of the four — often 50% smaller than JPG at equal quality — but encoder support varies by browser. It's ideal for web delivery where you can also serve a JPG fallback."
      ),
      h(2, "Convert between formats"),
      p("Use the converter below to switch any image to the format you need — including HEIC from iPhones."),
      toolEmbed("convert"),
      h(2, "Which should you use?"),
      checklist([
        "Photos on a website → WEBP (or JPG fallback).",
        "Logos & screenshots → PNG.",
        "Email attachments → JPG (smallest compatible).",
        "Maximum web performance → AVIF with JPG fallback.",
      ]),
      h(2, "FAQ"),
      faq([
        {
          question: "Does PNG have transparency?",
          answer: "Yes — PNG supports full and partial transparency, which is why it's the logo format.",
        },
        {
          question: "Is AVIF better than WEBP?",
          answer:
            "AVIF compresses better but WEBP has broader support. For most sites, WEBP is the safer default and AVIF a bonus optimization.",
        },
        {
          question: "Can I convert HEIC to JPG?",
          answer: "Yes — the converter decodes iPhone HEIC files in your browser.",
        },
        {
          question: "What format should I use for email?",
          answer: "JPG for photos, PNG for logos. Keep attachments under the 20–25 MB limit most providers enforce.",
        },
      ]),
      toolCta("convert", "Convert an image format now", "JPG, PNG, WEBP, AVIF — and HEIC input. Free and private."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "how-to-add-watermark-to-photos",
    title: "How to Add a Watermark to Photos (Free & Private)",
    subtitle: "Protect your work with text or logo watermarks — no Photoshop required.",
    excerpt:
      "A step-by-step guide to watermarking photos in your browser: text styles, logo overlays, positioning presets and export formats.",
    category: "Image Editing",
    tags: ["watermark", "logo", "copyright", "photography"],
    publishedDaysAgo: 15,
    updatedDaysAgo: 4,
    readCount: 7230,
    content: [
      p(
        "Whether you're a photographer, designer or seller, a watermark tells people the work is yours. Here's how to add a professional-looking one in minutes — without uploading your files anywhere."
      ),
      h(2, "Text or logo? Choose your weapon"),
      prosCons(
        [
          "Text watermarks are instant and fully customizable — font, weight, color, opacity, rotation.",
          "Logo watermarks look more branded and professional.",
          "Both can be dragged to any position with presets for corners and center.",
        ],
        [
          "A giant center watermark can ruin the photo's impact.",
          "Text-only marks are easier for others to crop out.",
          "Too many watermarks make images feel cluttered.",
        ]
      ),
      h(2, "Try it live"),
      toolEmbed("watermark-image"),
      h(2, "Watermark design rules that work"),
      checklist([
        "Keep it small — 5–10% of the image width is plenty.",
        "Use 40–60% opacity so the photo stays the star.",
        "Place it where it's hard to crop: over a busy area or straddling an edge.",
        "Add a subtle shadow or outline so it's readable on any background.",
        "Use your logo + a small copyright line for maximum protection.",
      ]),
      h(2, "Best practices by use case"),
      gallery([
        { src: og("Photography portfolios"), alt: "Corner logo watermark for photographers" },
        { src: og("E-commerce product photos"), alt: "Diagonal text watermark for product shots" },
        { src: og("Blog & social graphics"), alt: "Center watermark for shareable graphics" },
      ]),
      h(2, "FAQ"),
      faq([
        {
          question: "Can I watermark without Photoshop?",
          answer: "Yes — the watermark tool runs entirely in your browser with text and logo support.",
        },
        {
          question: "Text or logo watermark: which is better?",
          answer: "Logos are more brandable; text is more flexible. Many creators use both.",
        },
        {
          question: "Does watermarking reduce image quality?",
          answer: "No — the result exports at full resolution in PNG, JPG or WEBP.",
        },
        {
          question: "Can I undo mistakes?",
          answer: "Yes, the tool keeps full undo/redo history plus a reset button.",
        },
      ]),
      toolCta("watermark-image", "Watermark your first photo", "Text and logo watermarks, drag positioning, and full undo history — free."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "social-media-image-sizes-2026",
    title: "Social Media Image Sizes 2026: The Complete Cheat Sheet",
    subtitle: "Instagram, X, YouTube, Facebook, LinkedIn — every dimension you need, in one table.",
    excerpt:
      "Posting at the wrong size gets you cropped or compressed. Bookmark this exact-dimension cheat sheet for every major platform.",
    category: "Image Editing",
    tags: ["social media", "instagram", "youtube", "thumbnail", "resize"],
    publishedDaysAgo: 18,
    updatedDaysAgo: 1,
    readCount: 13560,
    content: [
      p(
        "Every platform re-encodes and crops images that don't match its specs. This cheat sheet lists the exact dimensions so your content ships pixel-perfect."
      ),
      h(2, "The master size table"),
      table(
        "features",
        ["Platform", "Post", "Recommended size"],
        [
          ["Instagram", "Square post", "1080 × 1080"],
          ["Instagram", "Portrait", "1080 × 1350"],
          ["Instagram", "Story / Reel", "1080 × 1920"],
          ["X (Twitter)", "Post", "1600 × 900"],
          ["X (Twitter)", "Header", "1500 × 500"],
          ["YouTube", "Thumbnail", "1280 × 720"],
          ["YouTube", "Channel banner", "2560 × 1440"],
          ["Facebook", "Feed post", "1200 × 630"],
          ["Facebook", "Cover", "851 × 315"],
          ["LinkedIn", "Feed post", "1200 × 627"],
          ["LinkedIn", "Banner", "1584 × 396"],
        ]
      ),
      h(2, "Why exact sizes matter"),
      p(
        "An oversized image gets downscaled and re-compressed — visible as softness and banding. An undersized one looks blurry on retina displays. Matching the spec avoids both."
      ),
      h(2, "Resize with the social media resizer"),
      toolEmbed("social-media-resizer"),
      h(2, "Quick checklist before posting"),
      checklist([
        "Use 1080 px on the long edge for Instagram.",
        "Export JPEG quality 80+ or PNG for sharp text.",
        "Keep the safe zones — platforms crop in feeds.",
        "Re-check YouTube thumbnails at small sizes (they're tiny in search).",
      ]),
      alert(
        "info",
        "Thumbnail text rule",
        "Text on a 1280×720 thumbnail should be legible at roughly 120×68 px — that's how big it appears in most search results."
      ),
      h(2, "FAQ"),
      faq([
        {
          question: "What's the best Instagram post size?",
          answer: "1080 × 1080 for squares, 1080 × 1350 for portraits — both display at full quality.",
        },
        {
          question: "What size should a YouTube thumbnail be?",
          answer: "1280 × 720 pixels, under 2 MB, and keep key text inside the center-safe area.",
        },
        {
          question: "Why do my images look blurry after posting?",
          answer: "You're likely uploading above or below the platform's spec, causing re-compression.",
        },
        {
          question: "Is the resizer free?",
          answer: "Yes — 20+ presets, fully in your browser, no sign-up.",
        },
      ]),
      toolCta("social-media-resizer", "Resize for any platform", "20+ presets for Instagram, YouTube, Facebook, LinkedIn and more."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "how-to-crop-and-resize-images-to-any-ratio",
    title: "How to Crop & Resize Images to Any Ratio",
    subtitle: "Passport, A4, Instagram, custom — crop anything to the exact shape you need.",
    excerpt:
      "Stop stretching images. Learn the drag-to-crop workflow that produces perfect aspect ratios every time.",
    category: "Image Editing",
    tags: ["crop", "resize", "aspect ratio", "a4"],
    publishedDaysAgo: 21,
    updatedDaysAgo: 5,
    readCount: 6120,
    content: [
      p(
        "Cropping isn't just about making images smaller — it's about controlling composition and matching exact ratios: passport 2×2, A4 documents, Instagram squares, YouTube 16:9."
      ),
      h(2, "The ratio-first workflow"),
      steps([
        {
          title: "Pick the ratio first",
          text: "Choose a preset — passport, A4, Instagram, YouTube — or enter a custom width × height.",
        },
        {
          title: "Drag the crop window",
          text: "Position the frame over the best part of the image; the ratio stays locked.",
        },
        {
          title: "Set output dimensions",
          text: "Define exact pixel output (e.g. 600 × 600) for print or platform specs.",
        },
        {
          title: "Export",
          text: "Download as PNG, JPEG or WEBP with quality control.",
        },
      ]),
      h(2, "Try the crop & resize tool"),
      toolEmbed("resize"),
      h(2, "Common ratio recipes"),
      table(
        "features",
        ["Use case", "Ratio", "Typical pixels"],
        [
          ["Passport photo (US)", "1:1", "600 × 600"],
          ["A4 document", "1 : 1.414", "1240 × 1754"],
          ["Instagram post", "1:1", "1080 × 1080"],
          ["YouTube thumbnail", "16:9", "1280 × 720"],
          ["Twitter header", "3:1", "1500 × 500"],
        ]
      ),
      alert(
        "tip",
        "Always work from the original",
        "Crop from your highest-resolution master, not from an already-exported low-res file."
      ),
      h(2, "FAQ"),
      faq([
        {
          question: "What is an aspect ratio?",
          answer:
            "The proportional relationship between width and height (e.g. 16:9). Cropping to a ratio guarantees your output matches a spec without distortion.",
        },
        {
          question: "Can I crop to A4?",
          answer: "Yes — A4, Letter and Legal presets are built in, plus custom ratios.",
        },
        {
          question: "Does cropping reduce quality?",
          answer: "Cropping removes pixels but keeps the remaining ones sharp. Export at high quality to stay crisp.",
        },
        {
          question: "Can I resize a HEIC photo?",
          answer: "Yes — iPhone HEIC files are decoded automatically before cropping.",
        },
      ]),
      toolCta("resize", "Crop an image to any ratio", "20+ presets, custom ratios and exact output dimensions — all in your browser."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "json-formatter-guide",
    title: "JSON Formatter Guide: Beautify, Minify & Validate",
    subtitle: "Stop squinting at one-line JSON. Learn to format, validate and debug like a pro.",
    excerpt:
      "Pretty-print, minify and validate JSON in seconds — plus the error messages that save you hours of debugging.",
    category: "Developer Tools",
    tags: ["json", "formatter", "developer", "api", "validation"],
    publishedDaysAgo: 3,
    updatedDaysAgo: 0,
    trending: true,
    readCount: 16420,
    content: [
      p(
        "JSON is everywhere — API responses, config files, database exports. The moment it arrives as one unbroken line, your eyes glaze over. A good formatter fixes that in one click."
      ),
      h(2, "Try the JSON formatter"),
      toolEmbed("json-formatter"),
      h(2, "What a formatter actually does"),
      list(false, [
        "Beautify: indents nested objects so structure is visible.",
        "Minify: strips whitespace for payloads and logs.",
        "Validate: catches trailing commas, unquoted keys and syntax errors.",
        "Tree view: lets you expand/collapse nested data visually.",
      ]),
      h(2, "Example: before and after"),
      p("Paste this ugly blob into the formatter above:"),
      code(
        JSON.stringify(
          { user: { id: 42, name: "Amar", tags: ["dev", "blog"], active: true }, meta: { views: 1234 } },
          null,
          0
        ),
        "json"
      ),
      p("…and it becomes readable in a single click."),
      h(2, "Common JSON mistakes (and how to spot them)"),
      table(
        "comparison",
        ["Mistake", "Example", "Error you'll see"],
        [
          ["Trailing comma", "\"a\": 1,", "Unexpected token }"],
          ["Unquoted key", "{ name: \"x\" }", "Unexpected token n"],
          ["Single quotes", "{'a': 1}", "Unexpected token '"],
          ["Comment", "// note", "Unexpected token /"],
        ]
      ),
      alert(
        "info",
        "JSON vs JavaScript objects",
        "JSON is strict: keys must be double-quoted, no trailing commas, no comments. That's why a validator is your best friend."
      ),
      h(2, "FAQ"),
      faq([
        {
          question: "How do I beautify JSON?",
          answer: "Paste or upload your JSON and hit Beautify — indentation and structure are applied instantly.",
        },
        {
          question: "How do I validate JSON?",
          answer: "The formatter validates as you type and shows the exact error with a line number.",
        },
        {
          question: "What does minified JSON mean?",
          answer: "All whitespace is removed, producing the smallest possible payload for APIs and logs.",
        },
        {
          question: "Is my JSON uploaded anywhere?",
          answer: "No — everything is processed locally in your browser.",
        },
      ]),
      toolCta("json-formatter", "Format your JSON now", "Beautify, minify, validate and explore — free, private, instant."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "how-to-generate-qr-codes",
    title: "How to Generate QR Codes for WiFi, WhatsApp & Payments",
    subtitle: "Turn URLs, WiFi networks and UPI IDs into scannable QR codes — with your logo.",
    excerpt:
      "Everything from menu QR codes to contactless payments, with colors, logos and high-res downloads.",
    category: "Developer Tools",
    tags: ["qr code", "wifi", "whatsapp", "upi", "payments"],
    publishedDaysAgo: 6,
    updatedDaysAgo: 1,
    readCount: 11230,
    content: [
      p(
        "QR codes went from novelty to necessity. Restaurants, payments, events, product packaging — a well-designed QR code is the bridge between the physical and digital world."
      ),
      h(2, "Try the QR generator"),
      toolEmbed("qr-code-generator"),
      h(2, "What you can encode"),
      table(
        "features",
        ["Type", "What it does", "Example"],
        [
          ["URL", "Opens a link", "Menu, portfolio, booking"],
          ["WiFi", "Connects to a network", "Guest WiFi poster"],
          ["WhatsApp", "Starts a chat", "Customer support"],
          ["Email / Phone", "Prefills a message", "Contact cards"],
          ["UPI", "Starts a payment", "Store payment QR"],
        ]
      ),
      h(2, "Design tips that keep QR codes scannable"),
      checklist([
        "Keep a quiet zone (white margin) around the code.",
        "High contrast: dark modules on light background.",
        "Test at the smallest size it will be printed.",
        "Avoid logos covering the three finder squares.",
        "Use PNG at 1024+ px for print, SVG for vector output.",
      ]),
      alert(
        "warning",
        "Dynamic vs static",
        "A static QR encodes the data directly — it never expires but can't be edited. Keep that in mind before printing thousands."
      ),
      h(2, "FAQ"),
      faq([
        {
          question: "Can I add a logo to a QR code?",
          answer: "Yes — place your logo in the center and the generator keeps the code scannable.",
        },
        {
          question: "Can I make a WiFi QR code?",
          answer: "Yes — enter the network name and password, and anyone can scan to connect.",
        },
        {
          question: "What formats can I download?",
          answer: "PNG for screens and print, SVG for vector use, and PDF for documents.",
        },
        {
          question: "Do QR codes expire?",
          answer: "Static QR codes don't expire — they encode the data permanently.",
        },
      ]),
      toolCta("qr-code-generator", "Generate your first QR code", "URLs, WiFi, WhatsApp, UPI — with colors, logos and HD downloads."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "base64-encoding-explained",
    title: "Base64 Encoding Explained (With Real Examples)",
    subtitle: "What Base64 is, why it exists, and when you should (and shouldn't) use it.",
    excerpt:
      "Base64 powers email attachments, data URLs and API tokens. Here's a developer-friendly explainer with working examples.",
    category: "Developer Tools",
    tags: ["base64", "encoding", "developer", "data-url"],
    publishedDaysAgo: 9,
    updatedDaysAgo: 2,
    readCount: 8910,
    content: [
      p(
        "Base64 encodes binary data as safe ASCII text — 3 bytes become 4 characters. It exists because email, URLs and JSON can't always carry raw binary safely."
      ),
      h(2, "The quick version"),
      code(
        "echo -n \"Hello, Vizo Tool!\" | base64\n# SGVsbG8sIFZpem8gVG9vbCE=",
        "bash"
      ),
      code(
        "// Decode in the browser\nconst decoded = atob(\"SGVsbG8sIFZpem8gVG9vbCE=\");\nconsole.log(decoded); // \"Hello, Vizo Tool!\"",
        "javascript"
      ),
      h(2, "Where you'll meet it"),
      list(false, [
        "Email attachments (MIME)",
        "Data URLs: `data:image/png;base64,...`",
        "JWT payloads (base64url)",
        "Storing small binaries in JSON",
      ]),
      h(2, "Try the encoder / decoder"),
      toolEmbed("base64-encoder"),
      h(2, "When NOT to use it"),
      alert(
        "warning",
        "The 33% tax",
        "Base64 inflates data by ~33%. Never base64 large files into JSON — use real uploads or blob storage instead."
      ),
      checklist([
        "Small assets (icons) as data URLs: fine.",
        "Large images in JSON: avoid — use URLs.",
        "Passwords: never base64 — it's not encryption.",
      ]),
      h(2, "FAQ"),
      faq([
        {
          question: "Is Base64 encryption?",
          answer: "No — it's encoding. Anyone can decode it instantly; use it for transport, not secrecy.",
        },
        {
          question: "Why does Base64 use '=' padding?",
          answer: "Padding '=' characters align the output to 4-character blocks when the input length isn't a multiple of 3.",
        },
        {
          question: "Can I encode an image with Base64?",
          answer: "Yes — the tool encodes files to data URLs, useful for inline assets and previews.",
        },
        {
          question: "What's base64url?",
          answer: "A URL-safe variant that swaps + and / for - and _ and drops padding — used in JWTs.",
        },
      ]),
      toolCta("base64-encoder", "Encode or decode now", "Text, files and images — instant, private, in your browser."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "sql-formatting-best-practices",
    title: "SQL Formatting Best Practices Every Developer Should Know",
    subtitle: "Readable queries are debuggable queries. Here's how to format SQL consistently.",
    excerpt:
      "Consistent SQL formatting makes reviews faster and bugs obvious. Learn the conventions teams actually use.",
    category: "Developer Tools",
    tags: ["sql", "database", "formatting", "developer"],
    publishedDaysAgo: 11,
    updatedDaysAgo: 3,
    readCount: 7650,
    content: [
      p(
        "You'll spend far more time reading SQL than writing it. Formatting conventions turn an unreadable wall of text into a query you can scan in seconds."
      ),
      h(2, "Bad vs good"),
      code(
        "SELECT id,name,email,created_at FROM users WHERE status='active' AND plan='pro' ORDER BY created_at DESC LIMIT 10;",
        "sql"
      ),
      p("Same query, formatted:"),
      code(
        "SELECT\n  id,\n  name,\n  email,\n  created_at\nFROM users\nWHERE status = 'active'\n  AND plan = 'pro'\nORDER BY created_at DESC\nLIMIT 10;",
        "sql"
      ),
      h(2, "The rules that matter"),
      checklist([
        "Keywords (SELECT, FROM, WHERE) in uppercase.",
        "One column per line in long SELECT lists.",
        "Indent continuations with two spaces.",
        "Put AND / OR at the start of the line.",
        "Alias tables meaningfully: users u.",
      ]),
      h(2, "Try the SQL formatter"),
      toolEmbed("sql-formatter"),
      prosCons(
        [
          "Faster code reviews — diff noise disappears.",
          "Syntax errors become visually obvious.",
          "Consistent style across a whole team.",
        ],
        [
          "It's not a linter — it won't fix bad queries.",
          "Style choices vary by project (some prefer lowercase).",
        ]
      ),
      h(2, "FAQ"),
      faq([
        {
          question: "Should SQL keywords be uppercase?",
          answer: "Most teams uppercase keywords and lowercase identifiers — it's the most common convention.",
        },
        {
          question: "Does formatting change performance?",
          answer: "No — whitespace is ignored by the database. Formatting is purely for humans.",
        },
        {
          question: "Can I minify SQL?",
          answer: "Yes — the formatter also offers a minified output for compact storage.",
        },
        {
          question: "Is it private?",
          answer: "Completely — formatting happens locally in your browser.",
        },
      ]),
      toolCta("sql-formatter", "Format your SQL now", "Beautify and minify SQL instantly — free and private."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "how-to-generate-strong-passwords",
    title: "Password Security: How to Generate Unbreakable Passwords",
    subtitle: "Length beats complexity — and here's how to generate (and remember) truly strong passwords.",
    excerpt:
      "The real rules of password strength, the entropy you should target, and a generator that does the math for you.",
    category: "Developer Tools",
    tags: ["password", "security", "entropy", "privacy"],
    publishedDaysAgo: 14,
    updatedDaysAgo: 2,
    editorsPick: true,
    readCount: 13450,
    content: [
      p(
        "Most 'password rules' are decades out of date. The science says: length and randomness beat forced complexity. Here's what actually protects you."
      ),
      stats([
        { value: "16+", label: "characters for long-term secrets" },
        { value: "100+", label: "bits of entropy is the target" },
        { value: "0", label: "passwords you should reuse" },
      ]),
      h(2, "What makes a password strong?"),
      p(
        "Entropy — measured in bits — is the number of guesses an attacker needs. A 16-character random password from the full character set gives ~104 bits. A 8-character one with a '!' swapped in gives far less, because patterns like leetspeak are guessable."
      ),
      h(2, "Try the password generator"),
      toolEmbed("password-generator"),
      h(2, "The rules that actually matter"),
      checklist([
        "Use 16+ random characters for important accounts.",
        "Never reuse passwords across sites.",
        "Let a password manager store them for you.",
        "Enable two-factor authentication everywhere.",
        "Avoid personal info: names, birthdays, pet names.",
      ]),
      alert(
        "success",
        "The passphrase trick",
        "A random 6-word passphrase (correct-horse-battery-staple) is long, memorable and strong — great for master passwords."
      ),
      h(2, "FAQ"),
      faq([
        {
          question: "How long should a password be?",
          answer: "16 characters or more for anything important; 20+ for master passwords.",
        },
        {
          question: "What is entropy?",
          answer:
            "A measure of unpredictability in bits. Higher entropy means more guesses required to crack it.",
        },
        {
          question: "Should I exclude similar characters?",
          answer: "Excluding lookalikes (0/O, 1/l/I) helps when typing on different devices.",
        },
        {
          question: "Can the generator create passphrases?",
          answer: "It generates random character strings; combine words yourself for a memorable passphrase.",
        },
      ]),
      toolCta("password-generator", "Generate a strong password", "Length, symbols, entropy meter — all in your browser, never stored."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "complete-guide-to-meta-tags-for-seo",
    title: "The Complete Guide to Meta Tags for SEO (2026)",
    subtitle: "Title, description, canonical, robots, OG and Twitter tags — what they do and how to write them.",
    excerpt:
      "Meta tags are the smallest, highest-ROI part of technical SEO. Learn exactly which ones matter and how to generate them perfectly.",
    category: "SEO & Marketing",
    tags: ["meta tags", "seo", "title tag", "description", "og tags"],
    publishedDaysAgo: 4,
    updatedDaysAgo: 0,
    featured: true,
    trending: true,
    readCount: 19870,
    content: [
      p(
        "Meta tags are the invisible instructions that tell search engines and social platforms what your page is about. Get them right and you control your listings; get them wrong and Google invents them for you."
      ),
      h(2, "The essential tag checklist"),
      table(
        "features",
        ["Tag", "Purpose", "Length guideline"],
        [
          ["Title", "Search listing headline", "50–60 chars"],
          ["Meta description", "Listing snippet", "150–160 chars"],
          ["Canonical", "Prevents duplicate-indexing", "1 per page"],
          ["Robots", "Index/follow control", "per page"],
          ["Open Graph", "Social card control", "1200 × 630 image"],
          ["Twitter Card", "X card control", "summary_large_image"],
        ]
      ),
      h(2, "Example: a well-formed head"),
      code(
        `<title>How to Compress Images — Free & Private | Vizo Tool</title>\n<meta name="description" content="Compress JPG, PNG and WEBP to 50 KB or 100 KB in your browser. No uploads, no sign-up, unlimited and free." />\n<link rel="canonical" href="https://vizotool.com/compress" />`,
        "html"
      ),
      h(2, "Try the meta tag generator"),
      toolEmbed("meta-tag-generator"),
      h(2, "Writing a title that earns the click"),
      checklist([
        "Lead with the keyword, then the benefit.",
        "Keep it under 60 characters or Google truncates.",
        "Add your brand at the end, not the start.",
        "Match the title to the page content — no bait.",
      ]),
      alert(
        "warning",
        "Duplicate titles kill CTR",
        "Every page needs a unique title and description. Duplicates waste your crawl budget and confuse users.",
      ),
      h(2, "FAQ"),
      faq([
        {
          question: "What are meta tags in SEO?",
          answer:
            "HTML tags like title, description and canonical that tell search engines how to understand and display your page.",
        },
        {
          question: "How long should a meta description be?",
          answer: "Aim for 150–160 characters — Google typically truncates around there.",
        },
        {
          question: "Do meta keywords still matter?",
          answer: "No — Google ignores the keywords tag. Focus on title, description and content quality.",
        },
        {
          question: "Can I generate meta tags for free?",
          answer: "Yes — the generator builds title, description, canonical, OG and Twitter tags with a live SERP preview.",
        },
      ]),
      toolCta("meta-tag-generator", "Generate perfect meta tags", "Title, description, canonical, OG and Twitter — with a live SERP preview."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "json-ld-schema-markup-beginners-guide",
    title: "JSON-LD Schema Markup: A Beginner's Guide",
    subtitle: "Help Google understand your pages with structured data — FAQ, Article, HowTo and more.",
    excerpt:
      "Structured data unlocks rich results: FAQ dropdowns, breadcrumbs and review stars. Here's how to add JSON-LD the right way.",
    category: "SEO & Marketing",
    tags: ["schema", "json-ld", "structured data", "rich results"],
    publishedDaysAgo: 7,
    updatedDaysAgo: 1,
    readCount: 11020,
    content: [
      p(
        "Schema markup is a vocabulary that describes your content to machines. Add it and search engines can display your pages as rich results — with stars, FAQs, breadcrumbs and more."
      ),
      h(2, "What JSON-LD looks like"),
      code(
        `{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [{\n    "@type": "Question",\n    "name": "What is schema markup?",\n    "acceptedAnswer": {\n      "@type": "Answer",\n      "text": "Structured data that describes your page to search engines."\n    }\n  }]\n}`,
        "json"
      ),
      h(2, "The most valuable types for most sites"),
      table(
        "features",
        ["Schema type", "Unlocks", "Best for"],
        [
          ["FAQPage", "FAQ rich result", "Support & how-to pages"],
          ["Article / BlogPosting", "Article carousels", "Blog content"],
          ["BreadcrumbList", "Breadcrumb trails", "Every site"],
          ["HowTo", "Step-by-step display", "Tutorials"],
          ["SoftwareApplication", "App-style listings", "Tools & SaaS"],
          ["Organization", "Knowledge panel info", "Brand sites"],
        ]
      ),
      h(2, "Try the schema generator"),
      toolEmbed("schema-markup-generator"),
      h(2, "Validation is non-negotiable"),
      steps([
        {
          title: "Generate",
          text: "Pick a type and fill in the fields — the generator writes valid JSON-LD.",
        },
        {
          title: "Validate",
          text: "Paste into Google's Rich Results Test before shipping.",
        },
        {
          title: "Monitor",
          text: "Watch Search Console for rich-result report changes.",
        },
      ]),
      alert(
        "error",
        "No fake markup",
        "Never mark up content that isn't visible on the page — Google can penalize disguised structured data."
      ),
      h(2, "FAQ"),
      faq([
        {
          question: "What is JSON-LD?",
          answer: "A JavaScript-based format for structured data that Google recommends for schema markup.",
        },
        {
          question: "Does schema improve rankings?",
          answer: "Not directly — but rich results raise click-through rates, which compounds visibility.",
        },
        {
          question: "Which schema types matter most?",
          answer: "FAQPage, Article, BreadcrumbList and Organization cover most sites' needs.",
        },
        {
          question: "How do I test my schema?",
          answer: "Use Google's Rich Results Test or the generator's built-in JSON validation.",
        },
      ]),
      toolCta("schema-markup-generator", "Generate your schema", "15+ types, valid JSON-LD, built-in validation — free."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "how-to-write-meta-descriptions-that-get-clicks",
    title: "How to Write a Meta Description That Gets Clicks",
    subtitle: "The 160-character sales pitch that decides whether people click your result.",
    excerpt:
      "Meta descriptions don't affect rankings directly — they affect click-through rate, which absolutely does. Here's the formula.",
    category: "SEO & Marketing",
    tags: ["meta description", "ctr", "seo copywriting", "serp"],
    publishedDaysAgo: 10,
    updatedDaysAgo: 2,
    readCount: 9340,
    content: [
      p(
        "Your meta description is the first impression in search results. It's a tiny sales pitch — and the difference between a 2% and 6% click-through rate can be written in 160 characters."
      ),
      h(2, "The formula"),
      code(
        "[Primary keyword] + [specific benefit] + [differentiator] + [subtle CTA]\n\nExample:\nCompress images to 50 KB or 100 KB in your browser. No uploads, no sign-up — unlimited and free.",
        "text"
      ),
      h(2, "What to include"),
      checklist([
        "Your primary keyword near the start.",
        "A concrete outcome, not vague adjectives.",
        "Numbers and specifics: 'in 3 steps', '50 KB', '24/7'.",
        "A differentiator: free, private, instant, no sign-up.",
        "A light call to action: 'Try it now', 'Get the guide'.",
      ]),
      h(2, "See it in a live SERP preview"),
      toolEmbed("serp-preview"),
      h(2, "Common mistakes"),
      alert(
        "warning",
        "Don't pad with keywords",
        "Repeating keywords reads as spam and users scroll past. Write for humans first."
      ),
      table(
        "comparison",
        ["Weak description", "Strong description"],
        [
          ["We offer the best image compression service online with great quality.", "Compress images to 50 KB in your browser. No uploads, no sign-up — free and unlimited."],
        ]
      ),
      h(2, "FAQ"),
      faq([
        {
          question: "Do meta descriptions affect rankings?",
          answer: "Not directly — but higher CTRs signal relevance and drive more traffic, which compounds SEO.",
        },
        {
          question: "What's the ideal length?",
          answer: "150–160 characters on desktop; around 120 on mobile to be safe.",
        },
        {
          question: "Can Google ignore my description?",
          answer: "Yes — if it doesn't match the query, Google may rewrite the snippet from your content.",
        },
        {
          question: "Should every page have one?",
          answer: "Every indexable page, yes. Duplicate or missing descriptions waste impressions.",
        },
      ]),
      toolCta("serp-preview", "Preview your listing", "Desktop and mobile SERP previews with character counts and truncation warnings."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "build-sitemap-and-robots-txt",
    title: "Build a Sitemap & robots.txt in 5 Minutes",
    subtitle: "The two files that tell search engines what to index — and what to leave alone.",
    excerpt:
      "A quick, practical walkthrough of XML sitemaps and robots.txt, with generators so you never write XML by hand.",
    category: "SEO & Marketing",
    tags: ["sitemap", "robots.txt", "crawling", "indexing"],
    publishedDaysAgo: 13,
    updatedDaysAgo: 3,
    readCount: 8120,
    content: [
      p(
        "Sitemaps and robots.txt control how search engines discover your site. Together they're ~15 lines of config that every healthy website should have."
      ),
      h(2, "What robots.txt does"),
      code(
        `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: https://vizotool.com/sitemap.xml`,
        "text"
      ),
      h(2, "What a sitemap looks like"),
      code(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://vizotool.com/compress</loc>\n    <lastmod>2026-08-01</lastmod>\n    <priority>0.9</priority>\n  </url>\n</urlset>`,
        "xml"
      ),
      h(2, "Try the generators"),
      toolEmbed("robots-txt-generator"),
      toolEmbed("sitemap-generator"),
      h(2, "Best practices"),
      checklist([
        "Submit your sitemap in Google Search Console.",
        "Keep robots.txt short and avoid blocking assets.",
        "List every indexable URL in the sitemap.",
        "Update lastmod when content changes.",
        "Use disallow for admin and private areas only.",
      ]),
      alert(
        "info",
        "robots.txt is a request, not a lock",
        "Robots.txt only stops compliant crawlers. Use noindex or auth for real access control."
      ),
      h(2, "FAQ"),
      faq([
        {
          question: "Do I need a sitemap for a small site?",
          answer: "Yes — it helps search engines find pages that lack internal links.",
        },
        {
          question: "What's the sitemap size limit?",
          answer: "50,000 URLs and 50 MB per sitemap file; use sitemap indexes beyond that.",
        },
        {
          question: "Should I disallow everything in robots.txt?",
          answer: "Never — that hides your site from search engines. Block only specific paths.",
        },
        {
          question: "Are the generators free?",
          answer: "Yes — they output valid robots.txt and XML sitemaps instantly in your browser.",
        },
      ]),
      toolCta("sitemap-generator", "Generate your sitemap", "XML, image and video sitemaps with validation — free and instant."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "sip-calculator-how-much-to-invest",
    title: "SIP Calculator: How Much Should You Invest Monthly?",
    subtitle: "Turn monthly investments into a target corpus with real compound-growth math.",
    excerpt:
      "A practical guide to SIP planning: expected returns, step-ups, inflation, and how much to start with.",
    category: "Finance & Calculators",
    tags: ["sip", "mutual funds", "investing", "compound interest"],
    publishedDaysAgo: 1,
    updatedDaysAgo: 0,
    trending: true,
    readCount: 17480,
    content: [
      p(
        "A Systematic Investment Plan (SIP) is the most popular way to build wealth in India — small monthly amounts, compounding over decades. The only real question is: how much should you invest each month to hit your goal?"
      ),
      h(2, "Try the SIP calculator"),
      toolEmbed("sip-calculator"),
      h(2, "The math in plain English"),
      p(
        "A SIP grows through two forces: the money you add and the returns it earns. At 12% annual returns, a ₹10,000 monthly SIP for 20 years grows to roughly ₹1 crore — your contributions are only ₹24 lakh."
      ),
      stats([
        { value: "₹10K/mo", label: "for 20 yrs @ 12% ≈ ₹1 cr" },
        { value: "₹24L", label: "of that is your own money" },
        { value: "12%", label: "long-term equity assumption" },
      ]),
      h(2, "How to use the calculator"),
      steps([
        {
          title: "Set your monthly amount",
          text: "Start with what you can commit without stress — consistency beats size.",
        },
        {
          title: "Choose an expected return",
          text: "Use 10–12% for equity, 6–7% for debt, and a blend for balanced funds.",
        },
        {
          title: "Set the duration",
          text: "SIPs reward time — 10+ years dramatically improve outcomes.",
        },
        {
          title: "Add a step-up",
          text: "Increase your SIP 10% yearly to match income growth and accelerate the corpus.",
        },
      ]),
      h(2, "Scenario table"),
      table(
        "features",
        ["Monthly SIP", "Years", "@ 12%", "Total invested"],
        [
          ["₹5,000", "10", "₹11.6 lakh", "₹6 lakh"],
          ["₹10,000", "15", "₹50.4 lakh", "₹18 lakh"],
          ["₹15,000", "20", "₹1.5 crore", "₹36 lakh"],
        ]
      ),
      callout(
        "A reality check",
        "Returns vary with markets. Use 10–12% as a planning assumption, not a promise — and always review your asset allocation annually."
      ),
      alert(
        "warning",
        "Not investment advice",
        "This calculator and article are educational. Consult a SEBI-registered advisor for your specific situation."
      ),
      h(2, "FAQ"),
      faq([
        {
          question: "How much should my first SIP be?",
          answer: "Start with whatever you can automate — even ₹500–₹2,000/month builds the habit. Increase it with income growth.",
        },
        {
          question: "What return should I assume for a SIP?",
          answer: "10–12% is a common long-term planning assumption for Indian equity funds.",
        },
        {
          question: "What is a step-up SIP?",
          answer: "An SIP whose amount increases (e.g. 10% yearly) — it significantly boosts the final corpus.",
        },
        {
          question: "Is SIP better than a lump sum?",
          answer: "Neither is 'better' universally — SIPs smooth market timing risk; lump sums gain if markets rise. Most people benefit from SIPs.",
        },
      ]),
      toolCta("sip-calculator", "Calculate your SIP corpus", "Step-up, inflation adjustment and year-wise projections — free and instant."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "emi-vs-prepayment-real-cost-of-loan",
    title: "EMI vs Prepayment: What's the Real Cost of Your Loan?",
    subtitle: "Break down your EMI, see the interest you're really paying, and decide if prepaying makes sense.",
    excerpt:
      "Your EMI's interest component is front-loaded. Here's how to read an amortization table and decide when prepayment wins.",
    category: "Finance & Calculators",
    tags: ["emi", "loan", "prepayment", "amortization"],
    publishedDaysAgo: 6,
    updatedDaysAgo: 1,
    readCount: 10430,
    content: [
      p(
        "The EMI you pay every month hides an uncomfortable truth: in the early years, most of it is interest. Understanding that split is the key to smart prepayment decisions."
      ),
      h(2, "Try the EMI calculator"),
      toolEmbed("emi-calculator"),
      h(2, "Why interest is front-loaded"),
      p(
        "Interest is calculated on the outstanding balance, which is largest at the start. On a ₹50 lakh home loan at 8.5% for 20 years, you pay more than ₹53 lakh in interest alone — nearly as much as the loan itself."
      ),
      stats([
        { value: "₹50L", label: "loan at 8.5%, 20 yrs" },
        { value: "₹43.4K", label: "monthly EMI" },
        { value: "₹53L+", label: "total interest paid" },
      ]),
      h(2, "Should you prepay?"),
      prosCons(
        [
          "Saves the future interest on the prepaid amount.",
          "Shorter tenure means mental peace and lower risk.",
          "Partial prepayments compound your savings over time.",
        ],
        [
          "Locks up cash you might need for emergencies.",
          "Lost opportunity cost if investments outperform your rate.",
          "Some loans charge prepayment penalties (usually none for floating-rate home loans).",
        ]
      ),
      h(2, "A quick decision rule"),
      checklist([
        "If your loan rate is below your expected investment return → invest instead.",
        "If you have high-interest debt (credit cards, personal loans) → prepay that first.",
        "Keep 6 months of expenses liquid before any prepayment.",
        "Use the calculator's amortization table to see exactly how much each prepayment saves.",
      ]),
      h(2, "FAQ"),
      faq([
        {
          question: "What is an amortization table?",
          answer: "A month-by-month breakdown showing principal, interest and the remaining balance for every EMI.",
        },
        {
          question: "Does prepaying reduce my EMI or tenure?",
          answer: "You choose — banks usually let you reduce tenure (saves more interest) or lower the EMI (eases cash flow).",
        },
        {
          question: "Is there a penalty for prepaying a home loan?",
          answer: "Floating-rate home loans in India generally have no prepayment penalty; fixed-rate loans may.",
        },
        {
          question: "What's the processing fee in the calculator?",
          answer: "Enter it as a percentage — the calculator shows how much it adds to your effective cost.",
        },
      ]),
      toolCta("emi-calculator", "Calculate your EMI", "Amortization tables, prepayment scenarios and payment timelines — free."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "income-tax-india-old-vs-new-regime",
    title: "Income Tax India (FY 2025-26): Old vs New Regime",
    subtitle: "The slab-by-slab breakdown that makes choosing between regimes easy.",
    excerpt:
      "New regime or old? Here's how the slabs compare, who benefits from each, and how to estimate your tax in minutes.",
    category: "Finance & Calculators",
    tags: ["income tax", "india", "tax regime", "tax slabs"],
    publishedDaysAgo: 9,
    updatedDaysAgo: 1,
    readCount: 15670,
    content: [
      p(
        "Every year the same question appears: old regime or new? The answer depends on your income, deductions and how much you save. Here's the FY 2025-26 comparison you can actually use."
      ),
      h(2, "New regime slabs (FY 2025-26)"),
      table(
        "features",
        ["Income slab", "Rate"],
        [
          ["Up to ₹4,00,000", "Nil"],
          ["₹4–8 lakh", "5%"],
          ["₹8–12 lakh", "10%"],
          ["₹12–16 lakh", "15%"],
          ["₹16–20 lakh", "20%"],
          ["₹20–24 lakh", "25%"],
          ["Above ₹24 lakh", "30%"],
        ]
      ),
      h(2, "Who wins with which regime?"),
      checklist([
        "Low deductions (no HRA, 80C below ₹1.5L) → new regime is usually better.",
        "High deductions (80C, HRA, NPS, home loan) → old regime may win.",
        "Sallied employees: compare after the standard deduction in both.",
      ]),
      h(2, "Try the tax calculator"),
      toolEmbed("income-tax-calculator"),
      alert(
        "warning",
        "Tax laws change",
        "Slabs, rebates and deductions are revised in every Budget. Always verify current-year rules and consult a CA for personalized advice."
      ),
      h(2, "How to estimate your tax"),
      steps([
        {
          title: "Enter your income",
          text: "Gross salary or business income after exemptions.",
        },
        {
          title: "Add deductions",
          text: "80C, 80D, HRA, NPS and others — the calculator shows the regime where they matter.",
        },
        {
          title: "Compare regimes",
          text: "View the tax under both regimes side by side and pick the lower one.",
        },
        {
          title: "Check the cess",
          text: "A 4% education cess applies on the computed tax in both regimes.",
        },
      ]),
      h(2, "FAQ"),
      faq([
        {
          question: "Which regime is better for salaried employees?",
          answer:
            "Employees with few deductions usually pay less in the new regime; those maxing 80C, HRA and NPS often do better in the old one.",
        },
        {
          question: "Is the standard deduction available in the new regime?",
          answer: "Yes — the standard deduction is available in both regimes for salaried individuals.",
        },
        {
          question: "What is the 4% cess?",
          answer: "An education & health cess applied on the total tax computed — 4% in both regimes.",
        },
        {
          question: "Can I switch regimes every year?",
          answer: "Salaried employees can switch yearly; business owners face restrictions after opting out.",
        },
      ]),
      toolCta("income-tax-calculator", "Estimate your tax", "Both regimes, slab breakdowns and effective rates — free and private."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "fd-calculator-how-interest-grows",
    title: "Fixed Deposit Calculator: How Your Interest Actually Grows",
    subtitle: "Quarterly compounding, tenure choice and the FD interest table explained.",
    excerpt:
      "FDs look simple — deposit money, earn interest. But compounding frequency and tenure choice change your returns more than you'd think.",
    category: "Finance & Calculators",
    tags: ["fixed deposit", "fd", "interest", "banking"],
    publishedDaysAgo: 11,
    updatedDaysAgo: 2,
    readCount: 6820,
    content: [
      p(
        "A fixed deposit is the quiet achiever of personal finance: guaranteed returns, no market risk. The subtle part is how banks compound interest — quarterly, for most Indian banks."
      ),
      h(2, "Try the FD calculator"),
      toolEmbed("fd-calculator"),
      h(2, "Compounding frequency matters"),
      p(
        "₹1 lakh at 7% for 5 years with quarterly compounding earns ₹41,762 in interest. With simple interest you'd earn only ₹35,000. Small difference per year — large difference over time."
      ),
      stats([
        { value: "₹1L", label: "at 7% for 5 years" },
        { value: "₹41.8K", label: "interest (quarterly compounding)" },
        { value: "7%", label: "typical senior-citizen premium included" },
      ]),
      h(2, "Tenure sweet spots"),
      table(
        "features",
        ["Tenure", "Interest rate (indicative)", "Maturity on ₹1L"],
        [
          ["1 year", "6.5%", "₹1,06,680"],
          ["3 years", "7.0%", "₹1,23,290"],
          ["5 years", "7.0%", "₹1,41,762"],
        ]
      ),
      checklist([
        "Compare rates across banks and NBFCs (FD rates differ by up to 1%).",
        "Senior citizens usually get a +0.50% premium.",
        "Lock the tenure that matches your goal — premature withdrawals cost interest.",
        "Consider breaking a deposit only when the new rate beats the penalty.",
      ]),
      h(2, "FAQ"),
      faq([
        {
          question: "How often do banks compound FD interest?",
          answer: "Most Indian banks compound quarterly, but frequency varies — always check the FD terms.",
        },
        {
          question: "Is FD interest taxable?",
          answer: "Yes — interest is taxed at your slab rate; TDS is deducted above ₹40,000 (₹50,000 for seniors).",
        },
        {
          question: "What happens if I break an FD early?",
          answer: "Banks typically pay a lower rate (minus a penalty) for the elapsed period.",
        },
        {
          question: "Is the calculator free?",
          answer: "Yes — instant maturity projections with a growth chart, in your browser.",
        },
      ]),
      toolCta("fd-calculator", "Calculate your FD returns", "Compounding, tenure and maturity charts — free and private."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "youtube-thumbnail-download-and-design",
    title: "YouTube Thumbnails: Download, Design & Get More Clicks",
    subtitle: "Grab any thumbnail in HD and learn the design rules that lift CTR.",
    excerpt:
      "Thumbnails decide 90% of your clicks. Download any video's thumbnail in max resolution and learn the design system creators use.",
    category: "YouTube Creators",
    tags: ["youtube", "thumbnail", "ctr", "creator"],
    publishedDaysAgo: 3,
    updatedDaysAgo: 0,
    featured: true,
    readCount: 12940,
    content: [
      p(
        "Your thumbnail is a billboard competing against 10 others. The creators who win clicks follow a repeatable design system — and the first step for many is studying what works."
      ),
      h(2, "Download any thumbnail in HD"),
      p(
        "Paste a video URL and grab the thumbnail in every resolution — from the 120×90 default to the full 1280×720 HD version."
      ),
      toolEmbed("youtube-thumbnail-downloader"),
      h(2, "The thumbnail design system that works"),
      steps([
        {
          title: "One focal subject",
          text: "A face or product fills 60%+ of the frame — people stop on faces.",
        },
        {
          title: "3 colors max",
          text: "High-contrast pairs (red/white, blue/yellow) read at tiny sizes.",
        },
        {
          title: "Bold, few words",
          text: "3–5 words maximum. If it needs a sentence, cut it.",
        },
        {
          title: "Test at 120 px",
          text: "If it's clear at thumbnail size in search, it'll work everywhere.",
        },
      ]),
      h(2, "Tools to pair with this workflow"),
      relatedToolCard("remove-background"),
      relatedToolCard("youtube-title-generator"),
      checklist([
        "Check your CTR in YouTube Studio monthly.",
        "A/B test two thumbnails on every important video.",
        "Avoid clickbait that mismatches the video.",
      ]),
      h(2, "FAQ"),
      faq([
        {
          question: "How do I download a YouTube thumbnail?",
          answer:
            "Paste the video URL into the downloader — it fetches all available resolutions, including 1280×720 HD.",
        },
        {
          question: "What's the best thumbnail size?",
          answer: "1280 × 720 pixels, under 2 MB, with key elements inside the center-safe area.",
        },
        {
          question: "Can I use someone else's thumbnail?",
          answer: "Downloading is for study and fair use. Never re-upload another creator's artwork.",
        },
        {
          question: "Does the tool download videos?",
          answer: "No — it only fetches publicly available thumbnail images.",
        },
      ]),
      toolCta("youtube-thumbnail-downloader", "Download a thumbnail now", "Every resolution up to HD — instant, free, and only public images."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "how-to-write-youtube-titles-that-rank",
    title: "How to Write YouTube Titles That Rank & Get Clicks",
    subtitle: "Keywords, CTR psychology and the 60-character rule for titles that perform.",
    excerpt:
      "Your title does double duty: it tells the algorithm what your video is about and tells viewers why to click. Here's the system.",
    category: "YouTube Creators",
    tags: ["youtube", "titles", "seo", "creator"],
    publishedDaysAgo: 8,
    updatedDaysAgo: 1,
    trending: true,
    readCount: 11780,
    content: [
      p(
        "The best videos in the world underperform with weak titles. YouTube matches search queries to your title, then humans decide whether to click — so your title has two audiences."
      ),
      h(2, "The two jobs of a title"),
      list(false, [
        "Rank: include the phrase people actually search for.",
        "Click: promise a specific outcome and create curiosity.",
      ]),
      h(2, "Title formulas that work"),
      table(
        "features",
        ["Formula", "Example"],
        [
          ["[Topic]: [Specific outcome]", "Passport Photo Size: The 2026 Country Guide"],
          ["How to [do X] in [time/number]", "How to Remove Backgrounds in 30 Seconds"],
          ["[Number] [things] [audience]", "7 Formatting Rules Every Developer Needs"],
          ["[Mistake] — [better way]", "Stop Compressing PNGs — Do This Instead"],
        ]
      ),
      h(2, "Try the title generator"),
      toolEmbed("youtube-title-generator"),
      h(2, "The 60-character rule"),
      p(
        "YouTube truncates titles past ~60 characters on most surfaces. Put the keyword and the hook in the first 40 — the rest is bonus."
      ),
      alert(
        "info",
        "Front-load the keyword",
        "If your target phrase is 'remove background', start with it: 'Remove Background in 30 Seconds (No Photoshop)' beats 'The Ultimate Guide to Removing Image Backgrounds'."
      ),
      checklist([
        "Match your title to what the video actually delivers.",
        "Use numbers and power words: Free, Proven, 2026, Fastest.",
        "Never clickbait — mismatch kills retention.",
        "Check character count before publishing.",
      ]),
      h(2, "FAQ"),
      faq([
        {
          question: "How long should a YouTube title be?",
          answer: "Aim for under 60 characters — anything longer gets truncated in most surfaces.",
        },
        {
          question: "Do keywords in titles matter for ranking?",
          answer: "Yes — title keywords are a strong relevance signal, especially the first 40 characters.",
        },
        {
          question: "Should every title have a number?",
          answer: "Numbers work well for list-style content but aren't mandatory — match the format to the content.",
        },
        {
          question: "Can the generator help with SEO?",
          answer: "Yes — it scores each title for length, keyword placement and CTR potential.",
        },
      ]),
      toolCta("youtube-title-generator", "Generate winning titles", "12+ titles per keyword with SEO scores and CTR tips — free."),
      authorCard(),
      newsletter(),
    ],
  }),

  makePost({
    slug: "how-to-check-website-traffic-estimates",
    title: "How to Estimate Any Website's Traffic (Without Analytics)",
    subtitle: "Read the public signals that hint at a site's popularity — and why estimates are estimates.",
    excerpt:
      "Competitor research without a spy tool: domain age, indexation, content quality and the signals that correlate with traffic.",
    category: "Guides & How-Tos",
    tags: ["website traffic", "competitor research", "seo signals"],
    publishedDaysAgo: 15,
    updatedDaysAgo: 3,
    readCount: 7230,
    content: [
      p(
        "You can't see a competitor's analytics. But public signals — indexed pages, domain age, meta quality, headings, structured data — correlate strongly with traffic. This guide shows you how to read them."
      ),
      h(2, "Try the traffic checker"),
      toolEmbed("website-traffic-checker"),
      h(2, "The signals that matter"),
      table(
        "comparison",
        ["Signal", "What it hints at", "Weight"],
        [
          ["Indexed pages", "Content scale", "High"],
          ["Domain age", "Authority & trust", "Medium"],
          ["Meta & heading quality", "On-page SEO", "Medium"],
          ["Structured data", "Rich results eligibility", "Medium"],
          ["Sitemap / robots", "Crawl health", "Low"],
        ]
      ),
      h(2, "How to read a report"),
      steps([
        {
          title: "Normalize the domain",
          text: "Check both www and non-www, http and https — redirects hide the canonical version.",
        },
        {
          title: "Score the signals",
          text: "The checker weighs SEO, technical, performance and accessibility scores.",
        },
        {
          title: "Interpret with context",
          text: "A new domain with 10,000 indexed pages is growing fast; an old domain with 50 pages may be stale.",
        },
        {
          title: "Compare competitors",
          text: "Relative scores tell you more than absolute numbers.",
        },
      ]),
      alert(
        "warning",
        "Estimates are estimates",
        "Traffic figures are modeled from public signals — they are not official analytics and can differ significantly from reality."
      ),
      h(2, "FAQ"),
      faq([
        {
          question: "Can you check exact traffic?",
          answer:
            "No — only the site owner's analytics are exact. This tool produces estimates from public SEO signals.",
        },
        {
          question: "What is a confidence score?",
          answer: "How strongly the available signals agree — low confidence means the picture is unclear.",
        },
        {
          question: "Is the checker free?",
          answer: "Yes — enter any domain and get an instant estimated report with recommendations.",
        },
        {
          question: "How accurate are traffic estimates?",
          answer: "Useful for trends and competitor comparison, not for precise numbers — treat them as directional.",
        },
      ]),
      toolCta("website-traffic-checker", "Check a website's estimated traffic", "Public-signal scoring with recommendations — free and instant."),
      authorCard(),
      newsletter(),
    ],
  }),
];
