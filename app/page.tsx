"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ImageDown,
  Shield,
  Zap,
  Download,
  Crop,
  FlipHorizontal2,
  Repeat,
  Stamp,
  Smartphone,
  Wand2,
  IdCard,
  FileText,
  FileImage,
  PenLine,
  Share2,
  ChevronDown,
  Flame,
  Instagram,
  Twitter,
  Youtube,
  RectangleHorizontal,
  Image as ImageIcon,
  Globe,
  Sparkles as SparklesIcon,
  Braces,
  ShieldCheck,
  Binary,
  KeyRound,
  Hash,
  QrCode,
  Palette,
  Box,
  Fingerprint,
  Database,
  Tags,
  FileJson,
  Bot,
  Network,
  Link2,
  Search,
  TextCursorInput,
  ScanSearch,
  Heading,
  BarChart3,
  Code2,
  TrendingUp,
  Layers,
  Home,
  Percent,
  Landmark,
  LineChart,
  Target,
  Receipt,
  Sun,
  BadgePercent,
  Coins,
  CandlestickChart,
  Wallet,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { TOOL_CATEGORIES, type Tool } from "@/lib/tools";
import { Spotlight } from "@/components/ui/spotlight";
import { Sparkles } from "@/components/ui/sparkles";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { GridPattern } from "@/components/ui/grid-pattern";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { CardHoverEffect } from "@/components/ui/card-hover-effect";
import { Capsule, type CapsuleVariant } from "@/components/ui/capsule";
import { cn } from "@/lib/utils";

// Icon per tool slug, shown on the homepage tool cards. Add a key here when
// registering a new tool to give it a card icon (falls back to ImageDown).
const toolCardIcons: Record<string, LucideIcon> = {
  compress: Download,
  resize: Crop,
  flip: FlipHorizontal2,
  convert: Repeat,
  "watermark-image": Stamp,
  "remove-background": Wand2,
  "passport-photo-maker": IdCard,
  "image-to-pdf": FileText,
  "pdf-to-image": FileImage,
  "signature-resizer": PenLine,
  "social-media-resizer": Share2,
  // Developer Tools
  "json-formatter": Braces,
  "json-validator": ShieldCheck,
  "base64-encoder": Binary,
  "base64-decoder": Binary,
  "password-generator": KeyRound,
  "uuid-generator": Hash,
  "qr-code-generator": QrCode,
  "css-gradient-generator": Palette,
  "css-box-shadow-generator": Box,
  "jwt-decoder": Fingerprint,
  "sql-formatter": Database,
  // SEO Tools
  "meta-tag-generator": Tags,
  "schema-markup-generator": FileJson,
  "open-graph-generator": Share2,
  "robots-txt-generator": Bot,
  "sitemap-generator": Network,
  "utm-builder": Link2,
  "serp-preview": Search,
  "slug-generator": TextCursorInput,
  "meta-tag-analyzer": ScanSearch,
  "heading-checker": Heading,
  // Website Analysis Tools
  "website-traffic-checker": BarChart3,
  // Developer Playground
  "html-css-js-playground": Code2,
  "sql-playground": Database,
  // Finance Tools
  "sip-calculator": TrendingUp,
  "compound-interest-calculator": Layers,
  "emi-calculator": Home,
  "gst-calculator": Percent,
  "fd-calculator": Landmark,
  "cagr-calculator": LineChart,
  "roi-calculator": Target,
  "income-tax-calculator": Receipt,
  "retirement-calculator": Sun,
  "discount-calculator": BadgePercent,
  "profit-margin-calculator": Coins,
  "stock-average-calculator": CandlestickChart,
  "salary-calculator": Wallet,
  "inflation-calculator": TrendingDown,
};

// High-demand tools get a featured spotlight treatment on the homepage.
const FEATURED_SLUGS = new Set([
  "remove-background",
  "compress",
  "passport-photo-maker",
  "image-to-pdf",
]);

/** Map a tool's badge text to a capsule color. */
function badgeVariant(tool: Tool): CapsuleVariant {
  switch (tool.badge) {
    case "-85%":
      return "success";
    case "AI":
      return "purple";
    case "Free":
      return "success";
    case "1-click":
      return "teal";
    case "20+ presets":
      return "violet";
    case "New":
      return "sky";
    default:
      return tool.badgeTone === "success" ? "success" : "primary";
  }
}

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Compress and resize images in milliseconds. All processing happens instantly in your browser.",
  },
  {
    icon: Shield,
    title: "100% Private",
    description: "Your images never leave your device. No uploads, no servers, no tracking.",
  },
  {
    icon: Crop,
    title: "Crop & Resize",
    description: "Crop to passport, document, or social media sizes. Over 20 preset ratios to choose from.",
  },
  {
    icon: FlipHorizontal2,
    title: "Flip & Rotate",
    description: "Mirror images horizontally or vertically and rotate 90° at a time — perfect for fixing orientation.",
  },
  {
    icon: Repeat,
    title: "Format Converter",
    description: "Change any image to PNG, JPEG, or WEBP instantly — perfect for compatibility across devices and apps.",
  },
  {
    icon: Download,
    title: "Free & Unlimited",
    description: "No sign-ups, no limits, no hidden costs. Compress, crop, resize, flip, and convert as much as you want.",
  },
  {
    icon: Smartphone,
    title: "Works on Any Device",
    description: "Fully responsive and works perfectly on desktop, tablet, and mobile — no apps to install.",
  },
  {
    icon: ImageDown,
    title: "PNG, JPEG, WEBP & AVIF",
    description: "Export in your preferred format with adjustable quality — including AVIF and HEIC support.",
  },
];

const compressSteps = [
  {
    number: "01",
    title: "Upload Image",
    description: "Drag & drop, click to upload, or paste an image from your clipboard.",
  },
  {
    number: "02",
    title: "Choose Size",
    description: "Select a target size — 50KB, 100KB, 200KB, or enter a custom value.",
  },
  {
    number: "03",
    title: "Download",
    description: "Your compressed image is ready instantly. Download it with one click.",
  },
];

const resizeSteps = [
  {
    number: "01",
    title: "Upload Image",
    description: "Drag & drop, click to upload, or paste an image from your clipboard.",
  },
  {
    number: "02",
    title: "Choose a Preset",
    description: "Pick from passport, document, social media sizes, or set a custom aspect ratio.",
  },
  {
    number: "03",
    title: "Crop & Download",
    description: "Fine-tune your crop area, adjust output quality, and download in PNG, JPEG, or WEBP.",
  },
];

const flipSteps = [
  {
    number: "01",
    title: "Upload Image",
    description: "Drag & drop, click to upload, or paste an image from your clipboard.",
  },
  {
    number: "02",
    title: "Flip or Rotate",
    description: "Mirror horizontally or vertically, or rotate 90° left and right.",
  },
  {
    number: "03",
    title: "Download",
    description: "Save as PNG, JPEG, or WEBP with adjustable quality in one click.",
  },
];

const convertSteps = [
  {
    number: "01",
    title: "Upload Image",
    description: "Drag & drop, click to upload, or paste an image from your clipboard.",
  },
  {
    number: "02",
    title: "Pick a Format",
    description: "Choose PNG, JPEG, WEBP, or AVIF and fine-tune the quality slider.",
  },
  {
    number: "03",
    title: "Download",
    description: "Your converted image is ready instantly — download it with one click.",
  },
];

const presetBadges: { label: string; variant: CapsuleVariant; icon: LucideIcon }[] = [
  { label: "Passport (2×2)", variant: "violet", icon: IdCard },
  { label: "A4 Document", variant: "primary", icon: FileText },
  { label: "Instagram Square", variant: "fuchsia", icon: Instagram },
  { label: "Twitter Header", variant: "sky", icon: Twitter },
  { label: "YouTube Thumbnail", variant: "rose", icon: Youtube },
  { label: "16:9 Widescreen", variant: "amber", icon: RectangleHorizontal },
];

const formatBadges: { label: string; variant: CapsuleVariant; icon: LucideIcon }[] = [
  { label: "PNG — Lossless & transparent", variant: "success", icon: ImageIcon },
  { label: "JPEG — Small & universal", variant: "primary", icon: FileImage },
  { label: "WEBP — Modern & efficient", variant: "purple", icon: Globe },
  { label: "AVIF — Next-gen & tiny", variant: "sky", icon: SparklesIcon },
  { label: "HEIC — iPhone photos", variant: "rose", icon: Smartphone },
];

const faqs = [
  {
    question: "How does Vizo Tool work?",
    answer:
      "Vizo Tool uses advanced browser-based image processing technology. Your images are processed entirely within your browser using the Canvas API — nothing is ever uploaded to any server.",
  },
  {
    question: "What is the Resize & Crop tool?",
    answer:
      "The Resize & Crop tool lets you crop your images to any shape or size. Choose from over 20 prebuilt ratios including passport photo sizes (2×2), document formats (A4, Letter), social media dimensions (Instagram, Twitter, Facebook, YouTube), and common aspect ratios (16:9, 4:3, 1:1). You can also set a custom ratio and fine-tune the crop area by dragging.",
  },
  {
    question: "What is the Format Converter tool?",
    answer:
      "The Format Converter lets you change any image to PNG, JPEG, WEBP, or AVIF. It also accepts HEIC files from iPhones, so you can convert those straight to JPG or PNG. Perfect when a website or app only accepts a specific format — convert it instantly in your browser.",
  },
  {
    question: "What is the Flip & Rotate tool?",
    answer:
      "The Flip & Rotate tool lets you mirror an image horizontally or vertically and rotate it 90° at a time. It's perfect for fixing mirrored selfies, sideways photos, or any image that needs a quick orientation change — all in your browser.",
  },
  {
    question: "What output formats are supported for cropping?",
    answer:
      "You can download your cropped image as PNG (lossless), JPEG, or WEBP. For JPEG and WEBP, you can also adjust the quality slider to balance file size and image quality.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely. All image processing happens locally on your device. Your images never leave your computer, ensuring complete privacy and security.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "We support JPG, JPEG, PNG, WEBP, AVIF, and HEIC (iPhone) formats. You can compress to any target size from 1KB upwards, or convert between formats.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "There's no artificial limit, but very large images may take a moment to process since everything runs in your browser. For best results, keep images under 50MB.",
  },
  {
    question: "Is Vizo Tool really free?",
    answer:
      "Yes! Vizo Tool is completely free with no hidden costs, no sign-ups, and no usage limits. We believe image compression should be accessible to everyone.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes! Vizo Tool is fully responsive and works perfectly on desktop, tablet, and mobile devices.",
  },
];

interface Step {
  number: string;
  title: string;
  description: string;
}

/** Gradient number tiles with connector line + hover pop, inside soft cards. */
function StepGrid({ steps }: { steps: Step[] }) {
  return (
    <div className="mt-10 grid gap-6 sm:gap-8 md:grid-cols-3">
      {steps.map((step, index) => (
        <motion.div
          key={step.number}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100px" }}
          transition={{ duration: 0.4, delay: index * 0.15 }}
          className="group relative"
        >
          {index < steps.length - 1 && (
            <span className="absolute left-[calc(50%+3.5rem)] top-16 hidden h-px w-[calc(100%-7rem)] bg-gradient-to-r from-primary/40 via-primary/20 to-transparent md:block" />
          )}
          <div className="flex h-full flex-col items-center rounded-2xl border border-border bg-surface/60 p-6 text-center shadow-sm backdrop-blur transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10 sm:p-8">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sky-500 text-xl font-bold text-white shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
              {step.number}
              <span className="absolute inset-0 -z-10 animate-glow-pulse rounded-2xl bg-primary/40 blur-md" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-text-primary sm:mt-6 sm:text-xl">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:mt-3">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/** Centered eyebrow capsule + icon tile + title + subtitle section header. */
function ToolSectionHeader({
  icon: Icon,
  title,
  subtitle,
  eyebrow,
  eyebrowVariant = "primary",
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  eyebrow?: string;
  eyebrowVariant?: CapsuleVariant;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <Capsule variant={eyebrowVariant} sm dot className="mb-4">
          {eyebrow}
        </Capsule>
      )}
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-500 text-white shadow-md shadow-primary/25">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-lg text-text-secondary">{subtitle}</p>
    </div>
  );
}

/** Sort tools so featured (high-demand) ones come first. */
function sortTools(tools: Tool[]): Tool[] {
  return [...tools].sort(
    (a, b) => Number(FEATURED_SLUGS.has(b.slug)) - Number(FEATURED_SLUGS.has(a.slug))
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState(TOOL_CATEGORIES[0].id);
  const activeTools = sortTools(
    TOOL_CATEGORIES.find((c) => c.id === activeCategory)?.tools ?? []
  );

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background layers */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-light/40 via-background to-background" />
          <BackgroundBeams />
          <GridPattern className="text-primary" />
        </div>
        <Spotlight
          id="hero-spotlight"
          className="-top-40 left-0 md:-top-24 md:left-1/4"
          fill="var(--color-primary)"
        />
        <Sparkles
          className="opacity-70"
          particleColor="#3B82F6"
          speed={0.45}
          particleDensity={45}
        />

        <div className="container-page relative flex min-h-[60vh] flex-col items-center justify-center py-10 text-center sm:min-h-[70vh] sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <Capsule variant="success" dot className="mb-6">
              100% Browser-Based — No Uploads
            </Capsule>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <TextGenerateEffect words="Edit Images" className="block text-text-primary" />
              <span className="mt-2 block bg-gradient-to-r from-primary via-sky-500 to-primary bg-clip-text text-transparent">
                <FlipWords
                  words={["Instantly & Free", "100% Privately", "In Your Browser", "On Any Device"]}
                  duration={3200}
                />
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-text-secondary sm:text-xl">
              Compress, resize, and crop your images to perfection — all directly in your browser.
              Your images never leave your device.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ShimmerButton href="/compress">
                <ImageDown className="h-4 w-4" />
                Compress Images
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ShimmerButton>

              <Link
                href="/remove-background"
                className="group inline-flex h-12 items-center gap-2 rounded-full border-2 border-primary/20 bg-surface px-7 text-sm font-semibold text-primary shadow-sm transition-all hover:border-primary hover:bg-primary-light/50 active:scale-[0.98]"
              >
                <Wand2 className="h-4 w-4" />
                Remove Background
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Tool cards — category tabs driven by the tools registry; featured tools get a spotlight */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="mt-14 w-full"
          >
            {/* Category tabs — horizontally scrollable on mobile, centered wrap on desktop */}
            <div
              role="tablist"
              aria-label="Browse tools by category"
              className="mx-auto mb-8 flex w-full max-w-7xl flex-wrap justify-center gap-2 sm:flex-wrap md:flex-wrap lg:flex-wrap max-sm:flex-nowrap max-sm:justify-start max-sm:overflow-x-auto max-sm:pb-2 max-sm:[-ms-overflow-style:none] max-sm:[scrollbar-width:none] [&::-webkit-scrollbar]:max-sm:hidden"
            >
              {TOOL_CATEGORIES.map((category) => {
                const active = category.id === activeCategory;
                return (
                  <button
                    key={category.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                      active
                        ? "border-primary bg-primary text-white shadow-lg shadow-primary/25"
                        : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:bg-primary-light/70 hover:text-primary"
                    )}
                  >
                    {category.label}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-px text-[11px] font-semibold",
                        active
                          ? "bg-white/20 text-white"
                          : "bg-primary-light text-primary"
                      )}
                    >
                      {category.tools.length}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <BentoGrid>
                  {activeTools.map((tool) => {
                    const Icon = toolCardIcons[tool.slug] ?? ImageDown;
                    const featured = FEATURED_SLUGS.has(tool.slug);

                    const card = (
                      <Link href={tool.href} className="flex h-full flex-col p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-4">
                            <div
                              className={cn(
                                "flex shrink-0 items-center justify-center transition-all duration-300",
                                featured
                                  ? "h-14 w-14 rounded-2xl bg-gradient-to-br from-primary via-fuchsia-500 to-sky-500 text-white shadow-lg shadow-primary/30"
                                  : "h-12 w-12 rounded-xl bg-primary-light group-hover:bg-primary"
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-6 w-6",
                                  featured
                                    ? "text-white"
                                    : "text-primary transition-colors duration-300 group-hover:text-white"
                                )}
                              />
                            </div>
                            <div className="min-w-0 text-left">
                              <p className="text-sm font-semibold text-text-primary">{tool.tagline}</p>
                              <p className="mt-0.5 text-xs text-text-muted">{tool.description}</p>
                            </div>
                          </div>
                          {featured && (
                            <Capsule variant="amber" icon={Flame} sm className="shrink-0">
                              Popular
                            </Capsule>
                          )}
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-2 rounded-xl bg-background p-3">
                          <span className="text-xs text-text-secondary">{tool.stat}</span>
                          <Capsule variant={badgeVariant(tool)} sm>
                            {tool.badge}
                          </Capsule>
                        </div>
                      </Link>
                    );

                    return featured ? (
                      <div
                        key={tool.slug}
                        className="rounded-2xl bg-gradient-to-br from-primary via-fuchsia-500 to-sky-500 p-px shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 sm:col-span-2 lg:col-span-2"
                      >
                        <BentoGridItem className="h-full border-transparent hover:border-transparent">
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 animate-glow-pulse rounded-full bg-fuchsia-500/25 blur-3xl"
                          />
                          {card}
                        </BentoGridItem>
                      </div>
                    ) : (
                      <BentoGridItem key={tool.slug} className="h-full">
                        {card}
                      </BentoGridItem>
                    );
                  })}
                </BentoGrid>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="content-visibility-auto border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <Capsule variant="primary" sm dot className="mb-4">
              Why Vizo Tool
            </Capsule>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Everything You Need, Nothing You Don&apos;t
            </h2>
            <p className="mt-3 text-lg text-text-secondary">
              Fast, private, browser-based image tools that just work.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            // rootMargin fires the reveal slightly BEFORE the section enters the
            // viewport, so content-visibility:auto can't delay it (keeps cards
            // from ever staying stuck at opacity 0 on slow browsers).
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.5 }}
            className="mt-10"
          >
            <CardHoverEffect
              items={features.map((feature) => ({
                icon: <feature.icon className="h-5 w-5" />,
                title: feature.title,
                description: feature.description,
              }))}
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works — Compress */}
      <section className="content-visibility-auto py-16 sm:py-20">
        <div className="container-page">
          <ToolSectionHeader
            icon={Download}
            title="Compress Images"
            subtitle="Three simple steps to reduce your file sizes."
            eyebrow="How it works"
          />
          <StepGrid steps={compressSteps} />
          <div className="mt-10 text-center">
            <ShimmerButton href="/compress">
              <ImageDown className="h-4 w-4" />
              Start Compressing
              <ArrowRight className="h-4 w-4" />
            </ShimmerButton>
          </div>
        </div>
      </section>

      {/* How It Works — Resize */}
      <section className="content-visibility-auto border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <ToolSectionHeader
            icon={Crop}
            title="Resize & Crop Images"
            subtitle="Choose from prebuilt sizes or create your own custom dimensions."
            eyebrow="Prebuilt sizes"
            eyebrowVariant="violet"
          />
          <StepGrid steps={resizeSteps} />

          {/* Preset capsules */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mx-auto mt-10 max-w-2xl text-center"
          >
            <p className="mb-4 text-sm font-medium text-text-secondary">
              Prebuilt sizes for every need
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {presetBadges.map((badge) => (
                <Capsule key={badge.label} variant={badge.variant} icon={badge.icon}>
                  {badge.label}
                </Capsule>
              ))}
            </div>
          </motion.div>

          <div className="mt-10 text-center">
            <ShimmerButton href="/resize">
              <Crop className="h-4 w-4" />
              Start Resizing
              <ArrowRight className="h-4 w-4" />
            </ShimmerButton>
          </div>
        </div>
      </section>

      {/* How It Works — Flip */}
      <section className="content-visibility-auto py-16 sm:py-20">
        <div className="container-page">
          <ToolSectionHeader
            icon={FlipHorizontal2}
            title="Flip & Rotate Images"
            subtitle="Fix mirrored selfies or sideways photos in one click."
            eyebrow="Quick fixes"
            eyebrowVariant="teal"
          />
          <StepGrid steps={flipSteps} />
          <div className="mt-10 text-center">
            <ShimmerButton href="/flip">
              <FlipHorizontal2 className="h-4 w-4" />
              Start Flipping
              <ArrowRight className="h-4 w-4" />
            </ShimmerButton>
          </div>
        </div>
      </section>

      {/* How It Works — Convert */}
      <section className="content-visibility-auto border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <ToolSectionHeader
            icon={Repeat}
            title="Convert Image Formats"
            subtitle="Switch to the right format for any platform in one click."
            eyebrow="Formats"
            eyebrowVariant="fuchsia"
          />
          <StepGrid steps={convertSteps} />

          {/* Format capsule marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="relative mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          >
            {/* marquee is frozen below 640px too, so drop will-change there */}
            <div className="flex w-max animate-marquee will-change-transform max-sm:will-change-auto gap-3 hover:[animation-play-state:paused]">
              {[...formatBadges, ...formatBadges].map((badge, i) => (
                <Capsule
                  key={`${badge.label}-${i}`}
                  variant={badge.variant}
                  icon={badge.icon}
                  interactive={false}
                >
                  {badge.label}
                </Capsule>
              ))}
            </div>
          </motion.div>

          <div className="mt-10 text-center">
            <ShimmerButton href="/convert">
              <Repeat className="h-4 w-4" />
              Start Converting
              <ArrowRight className="h-4 w-4" />
            </ShimmerButton>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="content-visibility-auto border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-lg text-text-secondary">
              Got questions? We&apos;ve got answers.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl space-y-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "100px" }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group cursor-pointer rounded-xl border border-border bg-background transition-all hover:border-primary/40 hover:shadow-md"
              >
                <summary className="flex items-center justify-between px-6 py-4 text-sm font-medium text-text-primary">
                  {faq.question}
                  <ChevronDown className="ml-4 h-4 w-4 shrink-0 text-text-muted transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="border-t border-border px-6 py-4">
                  <p className="text-sm leading-relaxed text-text-secondary">{faq.answer}</p>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
