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
  Youtube,
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
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { TOOL_CATEGORIES, type Tool } from "@/lib/tools";
import { CATEGORY_PAGES, getCategoryTools, CATEGORY_PAGE_BY_CATEGORY_ID } from "@/lib/category-pages";
import { CATEGORY_ICONS } from "@/components/category/CategoryIcon";
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
  "website-traffic-checker": BarChart3,
  // Developer Playground
  "html-css-js-playground": Code2,
  "sql-playground": Database,
  // AI Tools
  "ai-mock-interview": Bot,
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
  "compress",
  "json-formatter",
  "emi-calculator",
  "meta-tag-generator",
  "remove-background",
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
    description: "Every tool runs instantly in your browser — no waiting for uploads or server processing.",
  },
  {
    icon: Shield,
    title: "100% Private",
    description: "Your data never leaves your device. No uploads, no servers, no tracking.",
  },
  {
    icon: ImageDown,
    title: "Image Tools",
    description: "Compress, resize, crop, flip, convert, remove backgrounds and more — all in your browser.",
  },
  {
    icon: FileText,
    title: "PDF Tools",
    description: "Merge images into PDFs and extract PDF pages as high-resolution JPG or PNG images.",
  },
  {
    icon: Braces,
    title: "Developer Tools",
    description: "Format JSON, encode Base64, generate QR codes, decode JWTs and run live code playgrounds.",
  },
  {
    icon: Search,
    title: "SEO Tools",
    description: "Generate meta tags, schema markup, robots.txt, sitemaps and preview your SERP listings.",
  },
  {
    icon: TrendingUp,
    title: "Finance Calculators",
    description: "SIP, EMI, GST, tax, FD, retirement and 10+ more calculators with live charts and breakdowns.",
  },
  {
    icon: Smartphone,
    title: "Works on Any Device",
    description: "Fully responsive — desktop, tablet and mobile. No apps to install, just open and use.",
  },
];

const faqs = [
  {
    question: "What is VizoTool?",
    answer:
      "VizoTool is a free all-in-one online tools platform. It provides 60+ browser-based tools across images, PDFs, developer utilities, SEO, finance calculators, YouTube creator tools and more — all in one place.",
  },
  {
    question: "Are VizoTool tools free to use?",
    answer:
      "Yes — every tool on VizoTool is completely free. No sign-ups, no hidden costs, no usage limits. Just open a tool and start using it.",
  },
  {
    question: "What types of online tools does VizoTool provide?",
    answer:
      "VizoTool offers tools across multiple categories: image editing (compress, resize, crop, convert, background removal), PDF conversion, developer tools (JSON formatter, Base64, QR codes, JWT decoder), SEO tools (meta tags, schema, sitemaps), finance calculators (SIP, EMI, tax), YouTube tools and more.",
  },
  {
    question: "Can I use VizoTool on mobile?",
    answer:
      "Yes — every tool is fully responsive and works perfectly on desktop, tablet and mobile browsers. No app installation needed.",
  },
  {
    question: "Do I need to install any software?",
    answer:
      "No. All tools run directly in your web browser. There's nothing to download, install or configure — just visit the site and use the tools you need.",
  },
  {
    question: "Is VizoTool only for image tools?",
    answer:
      "No. While VizoTool started with image tools, it now offers 60+ tools across images, PDFs, developer utilities, SEO, finance, YouTube and AI — making it a complete all-in-one tools platform.",
  },
  {
    question: "Is my data safe on VizoTool?",
    answer:
      "Yes. All processing happens locally in your browser. Your files and data never leave your device — there are no uploads to any server.",
  },
  {
    question: "How many tools does VizoTool have?",
    answer:
      "VizoTool currently offers 60+ free tools across 6 major categories: Image Tools, Developer Tools, SEO Tools, Finance Calculators, PDF Tools and YouTube Tools — with new tools added regularly.",
  },
  {
    question: "Can I use VizoTool for SEO?",
    answer:
      "Yes. VizoTool provides 11 free SEO tools including meta tag generator, schema markup generator, robots.txt generator, sitemap generator, SERP preview, UTM builder, slug generator, heading checker and website traffic checker.",
  },
  {
    question: "Does VizoTool have finance calculators?",
    answer:
      "Yes. VizoTool offers 14 finance calculators including SIP, compound interest, EMI, GST, FD, CAGR, ROI, income tax, retirement, salary and more — each with live charts and year-by-year breakdowns.",
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
              60+ Free Tools — No Sign-up Required
            </Capsule>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <TextGenerateEffect words="Free Online Tools" className="block text-text-primary" />
              <span className="mt-2 block bg-gradient-to-r from-primary via-sky-500 to-primary bg-clip-text text-transparent">
                <FlipWords
                  words={["for Everything", "for Images & PDFs", "for Developers", "for SEO & Finance"]}
                  duration={3200}
                />
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-text-secondary sm:text-xl">
              Use fast, free online tools for image editing, PDF conversion, development, SEO, finance and more — all in one place, all in your browser.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ShimmerButton href="/compress">
                <ImageDown className="h-4 w-4" />
                Explore All Tools
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ShimmerButton>

              <Link
                href="#categories"
                className="group inline-flex h-12 items-center gap-2 rounded-full border-2 border-primary/20 bg-surface px-7 text-sm font-semibold text-primary shadow-sm transition-all hover:border-primary hover:bg-primary-light/50 active:scale-[0.98]"
              >
                <LayoutGrid className="h-4 w-4" />
                Browse Categories
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

            {/* Link to the full category landing page for the active tab */}
            {(() => {
              const categoryPage = CATEGORY_PAGE_BY_CATEGORY_ID[activeCategory];
              const activeLabel =
                TOOL_CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "tools";
              return categoryPage ? (
                <div className="mt-8 text-center">
                  <Link
                    href={`/${categoryPage}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-light/40 px-6 py-2.5 text-sm font-semibold text-primary shadow-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
                  >
                    View all {activeLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ) : null;
            })()}
          </motion.div>
        </div>
      </section>

      {/* Browse by Category — one card per category landing page */}
      <section id="categories" className="content-visibility-auto border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <ToolSectionHeader
            icon={LayoutGrid}
            title="Explore Tools by Category"
            subtitle="From image editing to finance calculators — find the right tool for any task."
            eyebrow="60+ Tools Across 6 Categories"
            eyebrowVariant="violet"
          />

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_PAGES.map((category, index) => {
              const Icon = CATEGORY_ICONS[category.slug] ?? ImageDown;
              const toolCount = getCategoryTools(category).length;
              return (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "100px" }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
                >
                  <Link
                    href={`/${category.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                  >
                    {/* Hover glow */}
                    <span className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Icon beside content — side by side on every screen size */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                          <h3 className="text-lg font-semibold text-text-primary">
                            {category.label}
                          </h3>
                          <Capsule variant={category.accent as CapsuleVariant} sm>
                            {toolCount} tool{toolCount === 1 ? "" : "s"}
                          </Capsule>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-text-secondary line-clamp-2">
                          {category.heroDescription}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-1.5 border-t border-border/70 pt-4 text-sm font-semibold text-primary">
                      Explore all
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="content-visibility-auto border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <Capsule variant="primary" sm dot className="mb-4">
              Why VizoTool
            </Capsule>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              One Platform, Many Tools
            </h2>
            <p className="mt-3 text-lg text-text-secondary">
              Fast, free, browser-based tools for every task — no installs, no sign-ups.
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

      {/* Popular Tools — multi-category showcase */}
      <section className="content-visibility-auto py-16 sm:py-20">
        <div className="container-page">
          <ToolSectionHeader
            icon={Flame}
            title="Popular Free Online Tools"
            subtitle="Try the most-used tools across every category — all free and instant."
            eyebrow="Most Popular"
            eyebrowVariant="amber"
          />

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { slug: "compress", name: "Compress Images", desc: "Shrink JPG, PNG, WEBP to any target size", category: "Image Tools", href: "/compress", icon: Download },
              { slug: "json-formatter", name: "JSON Formatter", desc: "Beautify, minify and validate JSON instantly", category: "Developer Tools", href: "/json-formatter", icon: Braces },
              { slug: "emi-calculator", name: "EMI Calculator", desc: "Calculate loan EMI with amortization schedule", category: "Finance Tools", href: "/emi-calculator", icon: Home },
              { slug: "meta-tag-generator", name: "Meta Tag Generator", desc: "Create perfect SEO meta tags with SERP preview", category: "SEO Tools", href: "/meta-tag-generator", icon: Tags },
              { slug: "image-to-pdf", name: "Image to PDF", desc: "Merge JPG, PNG & HEIC into one PDF document", category: "PDF Tools", href: "/image-to-pdf", icon: FileText },
              { slug: "qr-code-generator", name: "QR Code Generator", desc: "Generate QR codes for URLs, WiFi & more", category: "Developer Tools", href: "/qr-code-generator", icon: QrCode },
              { slug: "remove-background", name: "Remove Background", desc: "AI background remover — transparent PNG output", category: "Image Tools", href: "/remove-background", icon: Wand2 },
              { slug: "youtube-thumbnail-downloader", name: "YouTube Thumbnails", desc: "Download thumbnails in every resolution", category: "YouTube Tools", href: "/youtube-thumbnail-downloader", icon: Youtube },
              { slug: "website-traffic-checker", name: "Traffic Checker", desc: "Estimate any website's monthly visitors", category: "SEO Tools", href: "/website-traffic-checker", icon: BarChart3 },
            ].map((tool) => (
              <Link
                key={tool.slug}
                href={tool.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary">{tool.name}</p>
                    <p className="mt-0.5 text-xs text-text-secondary line-clamp-1">{tool.desc}</p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <Capsule variant="sky" sm>{tool.category}</Capsule>
                  <ArrowRight className="h-4 w-4 text-text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <ShimmerButton href="/compress">
              <LayoutGrid className="h-4 w-4" />
              Explore All 60+ Tools
              <ArrowRight className="h-4 w-4" />
            </ShimmerButton>
          </div>
        </div>
      </section>

      {/* How It Works — Quick Overview */}
      <section className="content-visibility-auto border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <ToolSectionHeader
            icon={Zap}
            title="How VizoTool Works"
            subtitle="Every tool follows the same simple process — open, use, download."
            eyebrow="Quick & Easy"
            eyebrowVariant="teal"
          />
          <StepGrid steps={[
            { number: "01", title: "Pick a Tool", description: "Choose from 60+ tools across images, PDFs, developer, SEO, finance and YouTube categories." },
            { number: "02", title: "Use It Instantly", description: "Everything runs in your browser — no uploads, no sign-ups, no waiting for servers." },
            { number: "03", title: "Download or Copy", description: "Get your result instantly — download files, copy code, or save calculations." },
          ]} />
        </div>
      </section>

      {/* SEO Content — crawlable text explaining VizoTool */}
      <section className="content-visibility-auto py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Free Online Tools for Everyday Tasks
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-text-secondary">
              <p>
                VizoTool is a free all-in-one online tools platform that brings together 60+ browser-based tools for images, PDFs, developer utilities, SEO, finance and more. Whether you need to compress an image, format JSON, generate a QR code, calculate your EMI or create perfect meta tags — VizoTool has you covered.
              </p>
              <p>
                Every tool runs directly in your browser using modern web technologies. There are no uploads, no servers, and no sign-ups required. Your data stays on your device, making VizoTool a private and secure choice for everyday tasks.
              </p>
              <p>
                From image editing tools like compress, resize, crop, flip and convert to developer essentials like JSON formatter, Base64 encoder, password generator and live code playgrounds — from SEO tools like meta tag generator, schema markup and sitemap builder to finance calculators for SIP, EMI, GST, tax and retirement planning — VizoTool is your one-stop platform for fast, free and easy online tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="content-visibility-auto border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          {/* FAQPage structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              }),
            }}
          />
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
