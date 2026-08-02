"use client";

import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  Atom,
  BarChart3,
  Bot,
  Braces,
  BrainCircuit,
  Briefcase,
  ChevronDown,
  Clock,
  Coffee,
  Code2,
  Database,
  Eye,
  FileCode2,
  FileText,
  Flame,
  FolderKanban,
  Gamepad2,
  Globe,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  Mail,
  MessageSquare,
  Network,
  Rocket,
  Search,
  Server,
  Sparkles,
  Table2,
  Target,
  Triangle,
  Wand2,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Sparkles as SparklesCanvas } from "@/components/ui/sparkles";
import { FlipWords } from "@/components/ui/flip-words";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Capsule, type CapsuleVariant } from "@/components/ui/capsule";
import { cn } from "@/lib/utils";
import { faqPageSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

/* ------------------------------------------------------------------ */
/* Data                                                               */
/* ------------------------------------------------------------------ */

const roles = ["Software Engineer", "Product Builder", "AI Explorer", "Problem Solver"];

const funFacts = [
  { emoji: "🎮", title: "PUBG Mobile Player", text: "Ranked grinds & squad wipes in my free time." },
  { emoji: "🌙", title: "Night Owl Coder", text: "My best code happens after 1 AM." },
  { emoji: "☕", title: "Turning Coffee into Code", text: "The brew-to-bug-fix pipeline never stops." },
  { emoji: "🚀", title: "Loves Shipping", text: "Ideas that ship beat ideas that wait." },
  { emoji: "🤖", title: "Exploring AI Every Day", text: "RAG, LLMs, and whatever the AI world throws next." },
  { emoji: "⚡", title: "Performance Obsessed", text: "If a page takes a second, I'm already annoyed." },
  { emoji: "🎯", title: "Loves Solving Problems", text: "Real problems, real people, real fixes." },
];

const whyBuilt = [
  {
    icon: X,
    title: "Too Many Ads",
    text: "Every other tool site buries the actual tool under popups, banners, and trackers.",
  },
  {
    icon: Zap,
    title: "Too Slow",
    text: "Upload → wait → server queue → wait. Simple tasks took longer than they should.",
  },
  {
    icon: Sparkles,
    title: "Clunky UX",
    text: "Complicated flows, forced sign-ups, and watermarks on your own files.",
  },
];

// Tech stack groups: category → skills with icon + level
const techStack: { title: string; icon: LucideIcon; skills: { name: string; icon: LucideIcon; level: number }[] }[] = [
  {
    title: "Frontend",
    icon: Code2,
    skills: [
      { name: "HTML & CSS", icon: FileCode2, level: 92 },
      { name: "JavaScript", icon: Braces, level: 90 },
      { name: "React", icon: Atom, level: 86 },
      { name: "Next.js", icon: Triangle, level: 88 },
    ],
  },
  {
    title: "Backend",
    icon: Server,
    skills: [
      { name: "Node.js", icon: Server, level: 84 },
      { name: "Express.js", icon: Workflow, level: 84 },
      { name: "REST APIs", icon: Network, level: 88 },
      { name: "PHP", icon: FileCode2, level: 70 },
    ],
  },
  {
    title: "Database",
    icon: Database,
    skills: [
      { name: "MongoDB", icon: Database, level: 82 },
      { name: "SQL", icon: Table2, level: 80 },
    ],
  },
  {
    title: "AI & Tools",
    icon: BrainCircuit,
    skills: [
      { name: "RAG & LLMs", icon: BrainCircuit, level: 78 },
      { name: "AI Integrations", icon: Sparkles, level: 80 },
      { name: "Performance & SEO", icon: BarChart3, level: 86 },
    ],
  },
];

const building = [
  { icon: ImageIcon, title: "Image Tools", text: "Compress, resize, watermark & more", href: "/compress" },
  { icon: Code2, title: "Developer Tools", text: "JSON, Base64, JWT, SQL & QR", href: "/json-formatter" },
  { icon: Search, title: "SEO Tools", text: "Meta tags, schema, SERP preview", href: "/meta-tag-generator" },
  { icon: FileText, title: "PDF Tools", text: "Image ⇄ PDF in your browser", href: "/image-to-pdf" },
  { icon: Bot, title: "AI Tools", text: "Background removal & beyond", href: "/remove-background" },
  { icon: BarChart3, title: "Website Analysis", text: "Traffic & SEO estimators", href: "/website-traffic-checker" },
  { icon: Rocket, title: "Future SaaS Products", text: "Ideas in the oven — stay tuned", href: "/contact" },
];

const timeline = [
  {
    icon: GraduationCap,
    title: "Started Coding",
    text: "What began as a college subject became a passion the moment my first lines of code came to life.",
  },
  {
    icon: Globe,
    title: "First Website",
    text: "I shipped my first website and got completely hooked on building for the web.",
  },
  {
    icon: FolderKanban,
    title: "College Projects",
    text: "Countless hours learning, building, breaking things, fixing them, and learning again.",
  },
  {
    icon: Briefcase,
    title: "Professional Engineer",
    text: "Turned the passion into a profession — building real products for real users.",
  },
  {
    icon: Layers,
    title: "Building This Platform",
    text: "One fast, clean, ad-free home for every tool people need — no jumping between websites.",
  },
  {
    icon: Rocket,
    title: "Future AI Products",
    text: "Next up: AI-powered tools and SaaS that save people real time.",
  },
];

const stats = [
  { label: "Projects Built", value: 30, suffix: "+", icon: Rocket },
  { label: "Technologies Learned", value: 15, suffix: "+", icon: Code2 },
  { label: "Hours of Coding", value: 5000, suffix: "+", icon: Clock },
  { label: "Cups of Coffee", value: 1200, suffix: "+", icon: Coffee },
  { label: "Tools on the Platform", value: 40, suffix: "+", icon: Layers },
];

const faqs = [
  {
    question: "Who is Amar Lodhi?",
    answer:
      "Amar Lodhi is a 22-year-old software engineer from Mathura, Uttar Pradesh, India — the city of Lord Krishna. He builds CompressPix and is passionate about creating fast, useful, browser-based tools.",
  },
  {
    question: "How did Amar start coding?",
    answer:
      "Amar's coding journey began in college, where programming was just another subject at first. After writing his first few lines of code and seeing them come to life, curiosity quickly turned into a lifelong passion.",
  },
  {
    question: "What does Amar work on professionally?",
    answer:
      "Amar works as a Software Engineer building modern, user-friendly web applications. He focuses on React, Next.js, Node.js, and increasingly on AI-powered features.",
  },
  {
    question: "What technology stack does Amar use?",
    answer:
      "His stack spans HTML, CSS, JavaScript, React, Next.js, Node.js, Express.js, MongoDB, SQL, PHP, RAG pipelines, REST APIs, and AI integrations — with a strong focus on performance and SEO.",
  },
  {
    question: "Why did Amar build CompressPix?",
    answer:
      "Amar was frustrated by existing tool websites full of ads, slow interfaces, and forced sign-ups. He decided to build one fast, clean, private platform where every tool works in the browser with no uploads.",
  },
  {
    question: "Is CompressPix really free?",
    answer:
      "Yes. CompressPix is completely free with no sign-ups, no watermarks, and no hidden costs. The mission is simple: build tools that save people time, not waste it.",
  },
  {
    question: "Are my files private on CompressPix?",
    answer:
      "Absolutely. Every tool processes files entirely in your browser — nothing is ever uploaded to a server. Your images, PDFs, and data never leave your device.",
  },
  {
    question: "What kinds of tools are on CompressPix?",
    answer:
      "CompressPix currently offers 40+ free tools across image editing, PDF conversion, developer utilities, SEO tools, website analysis, and even code playgrounds — all in one place.",
  },
  {
    question: "Does Amar work alone?",
    answer:
      "CompressPix is founder-led and built independently, but the vision is community-driven — feedback from users directly shapes what gets built next.",
  },
  {
    question: "What are Amar's future plans?",
    answer:
      "Amar plans to grow CompressPix into a full toolkit platform, add more AI-powered tools, and launch SaaS products — always with the same principle: save people time.",
  },
  {
    question: "What is Amar's favorite game?",
    answer: "PUBG Mobile. It's his go-to way to unwind, squad up with friends, and clear his head after long coding sessions.",
  },
  {
    question: "How can I get in touch with Amar?",
    answer:
      "Head over to the Contact page and send a message. Amar loves hearing from users, collaborators, and anyone with an idea worth building.",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Animated number that counts up when scrolled into view. */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

function SectionHeader({
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl text-center"
    >
      {eyebrow && (
        <Capsule variant={eyebrowVariant} sm dot className="mb-4">
          {eyebrow}
        </Capsule>
      )}
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-500 text-white shadow-md shadow-primary/25">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">{title}</h2>
      <p className="mt-3 text-lg text-text-secondary">{subtitle}</p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Infinite float animations are nice on desktop but drain battery/CPU on
  // small screens — disable them under 640px. SSR-safe via useSyncExternalStore.
  const isMobile = useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(max-width: 639px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 639px)").matches,
    () => false
  );
  const floatAnim = isMobile ? undefined : { y: [0, -7, 0] as number[] };
  const floatChipAnim = isMobile ? undefined : { y: [0, -6, 0] as number[] };

  return (
    <>
      {/* FAQ structured data */}
      <JsonLd data={faqPageSchema(faqs)} />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-light/40 via-background to-background" />
          <BackgroundBeams />
          <GridPattern className="text-primary" />
        </div>
        <Spotlight id="about-spotlight" className="-top-32 left-0 md:-top-20 md:left-1/4" fill="var(--color-primary)" />
        <SparklesCanvas className="opacity-70" particleColor="#3B82F6" speed={0.4} particleDensity={40} />

        <div className="container-page relative flex min-h-[70vh] flex-col items-center justify-center py-16 text-center sm:py-20">
          {/* Meta chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-wrap items-center justify-center gap-2 text-xs text-text-muted"
          >
            <Capsule variant="sky" sm interactive={false}>📍 Mathura, India</Capsule>
            <Capsule variant="violet" sm interactive={false}>🎂 22 years old</Capsule>
            <Capsule variant="primary" sm interactive={false}>💼 Software Engineer</Capsule>
            <Capsule variant="teal" sm interactive={false}>☕ 4 min read</Capsule>
            <Capsule variant="purple" sm interactive={false}>📅 Updated Aug 2026</Capsule>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
          >
            <span className="block text-text-primary">Hi 👋 I&apos;m Amar.</span>
            <span className="mt-3 block bg-gradient-to-r from-primary via-sky-500 to-primary bg-clip-text text-3xl text-transparent sm:text-4xl md:text-5xl">
              <FlipWords words={roles} duration={2800} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-text-secondary"
          >
            A Software Engineer who loves turning ideas into products people actually use — and
            building them all in the browser.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <ShimmerButton href="/compress">
              <Rocket className="h-4 w-4" />
              Explore the Tools
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ShimmerButton>
            <Link
              href="/contact"
              className="group inline-flex h-12 items-center gap-2 rounded-full border-2 border-primary/20 bg-surface px-7 text-sm font-semibold text-primary shadow-sm transition-all hover:border-primary hover:bg-primary-light/50 active:scale-[0.98]"
            >
              <MessageSquare className="h-4 w-4" />
              Let&apos;s Talk
            </Link>
          </motion.div>

          {/* Profile section: monogram avatar + floating badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="relative mx-auto mt-12 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32"
          >
            {/* Glow ring */}
            <span className="absolute inset-0 animate-glow-pulse rounded-full bg-primary/40 blur-2xl" />
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-sky-500 to-primary p-px shadow-xl shadow-primary/30">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-background">
                <span className="bg-gradient-to-br from-primary to-sky-500 bg-clip-text text-6xl font-bold text-transparent sm:text-7xl">
                  A
                </span>
              </span>
            </span>
            {/* Floating badges around the avatar */}
            {[
              { emoji: "🏏", pos: "-left-2 top-2", delay: 0.4 },
              { emoji: "💻", pos: "-right-3 top-6", delay: 1.2 },
              { emoji: "🌆", pos: "-left-4 bottom-4", delay: 2 },
              { emoji: "🎯", pos: "-right-4 bottom-0", delay: 0.8 },
            ].map((badge) => (
              <motion.span
                key={badge.pos}
                animate={floatAnim}
                transition={{ duration: 3.2, repeat: Infinity, delay: badge.delay, ease: "easeInOut" }}
                className={cn(
                  "absolute flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-lg shadow-lg",
                  badge.pos
                )}
              >
                {badge.emoji}
              </motion.span>
            ))}
          </motion.div>

          {/* Floating personality chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 w-full max-w-2xl"
          >
            <div className="relative flex flex-wrap items-center justify-center gap-3">
              {[
                { emoji: "🎮", label: "PUBG Mobile", delay: 0 },
                { emoji: "🤖", label: "AI Explorer", delay: 0.6 },
                { emoji: "⚡", label: "Performance Freak", delay: 1.2 },
                { emoji: "🚀", label: "Ships Fast", delay: 1.8 },
              ].map((chip) => (
                <motion.span
                  key={chip.label}
                  animate={floatChipAnim}
                  transition={{ duration: 3, repeat: Infinity, delay: chip.delay, ease: "easeInOut" }}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary shadow-sm"
                >
                  <span className="text-base">{chip.emoji}</span>
                  {chip.label}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ QUOTE BANNER ============ */}
      <section className="relative overflow-hidden border-y border-border bg-surface py-14">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 via-transparent to-sky-500/5" />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="container-page text-center"
        >
          <p className="mx-auto max-w-3xl text-balance text-2xl font-semibold leading-snug text-text-primary sm:text-3xl">
            &ldquo;I don&apos;t just write code...
            <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
              {" "}I build experiences.
            </span>
            &rdquo;
          </p>
        </motion.div>
      </section>

      {/* ============ MY STORY ============ */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            icon={GraduationCap}
            title="My Story"
            subtitle="From a college subject to a passion that became a profession."
            eyebrow="The journey"
            eyebrowVariant="violet"
          />
          <div className="mx-auto mt-10 max-w-3xl space-y-6">
            {[
              "My coding journey started back in college. At first, it was just another subject in the syllabus. But after writing my first few lines of code and seeing them come to life, something clicked. What began as curiosity quickly turned into a passion.",
              "Since then, I've spent countless hours learning, building, breaking things, fixing them, and learning again. Every project taught me something new — not just about programming, but about solving real-world problems.",
              "Today, I work as a Software Engineer, but I still carry the same excitement I had when I built my very first project. I enjoy creating fast, modern, and user-friendly applications that people actually find useful.",
            ].map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-lg leading-relaxed text-text-secondary"
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY I BUILT THIS ============ */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            icon={Flame}
            title="Why I Built This Platform"
            subtitle="Frustration turned into a mission."
            eyebrow="The origin"
            eyebrowVariant="amber"
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-3">
            {whyBuilt.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-error/40 hover:shadow-xl hover:shadow-error/10"
              >
                <span className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-error/10 blur-2xl" />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error-light text-error transition-transform duration-300 group-hover:scale-110">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-8 max-w-4xl rounded-2xl bg-gradient-to-r from-primary via-sky-500 to-primary p-px shadow-lg shadow-primary/20"
          >
            <div className="rounded-2xl bg-background px-6 py-6 text-center">
              <p className="text-balance text-lg font-semibold text-text-primary sm:text-xl">
                So I decided to build it myself — one platform with fast, clean, ad-free tools that
                work 100% in the browser. <span className="text-primary">No uploads. No sign-ups. No waste.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ TECH STACK ============ */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            icon={Code2}
            title="My Tech Stack"
            subtitle="The tools I reach for when turning ideas into reality."
            eyebrow="Stack"
            eyebrowVariant="teal"
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((group, gi) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: gi * 0.1 }}
                className="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-sky-500/10 text-primary ring-1 ring-primary/10">
                    <group.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-text-primary">{group.title}</h3>
                </div>
                <ul className="mt-5 space-y-4">
                  {group.skills.map((skill) => (
                    <li key={skill.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-text-secondary">
                          <skill.icon className="h-3.5 w-3.5 text-primary" />
                          {skill.name}
                        </span>
                        <span className="text-xs font-medium text-text-muted">{skill.level}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-primary-light/50">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + gi * 0.1, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-sky-500"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHAT I'M BUILDING ============ */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            icon={Rocket}
            title="What I'm Currently Building"
            subtitle="A growing toolkit platform — new tools ship all the time."
            eyebrow="In progress"
            eyebrowVariant="sky"
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {building.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={item.href}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-sky-500 group-hover:text-white">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-primary">{item.title}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{item.text}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 self-center text-text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FUN FACTS ============ */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            icon={Gamepad2}
            title="Fun Facts"
            subtitle="The person behind the code."
            eyebrow="Beyond code"
            eyebrowVariant="fuchsia"
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {funFacts.map((fact, i) => (
              <motion.div
                key={fact.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                <span className="text-4xl">{fact.emoji}</span>
                <h3 className="mt-3 font-semibold text-text-primary">{fact.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{fact.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TIMELINE ============ */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            icon={Globe}
            title="The Journey So Far"
            subtitle="From first line of code to a growing platform."
            eyebrow="Timeline"
            eyebrowVariant="purple"
          />
          <div className="relative mx-auto mt-12 max-w-2xl">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/60 via-primary/30 to-transparent sm:left-1/2 sm:-translate-x-1/2" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={cn(
                    "relative flex flex-col gap-2 pl-12 sm:w-1/2 sm:pl-0",
                    i % 2 === 0
                      ? "sm:pr-10 sm:text-right"
                      : "sm:ml-auto sm:pl-10"
                  )}
                >
                  {/* Node */}
                  <span
                    className={cn(
                      "absolute left-4 top-1 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-white shadow-lg shadow-primary/30 ring-4 ring-surface",
                      i % 2 === 0 ? "sm:left-auto sm:-right-4 sm:translate-x-0" : "sm:-left-4 sm:translate-x-0"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                  </span>
                  <div className="rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
                    <h3 className="font-semibold text-text-primary">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ MISSION & VISION ============ */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-sky-500 to-primary p-px shadow-lg shadow-primary/20"
            >
              <div className="h-full rounded-2xl bg-background p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary transition-transform duration-300 group-hover:scale-110">
                  <Target className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-text-primary">Mission</h2>
                <p className="mt-3 text-lg leading-relaxed text-text-secondary">
                  Build tools that <span className="font-semibold text-text-primary">save people time</span>,
                  not waste it.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-sky-500 to-primary p-px shadow-lg shadow-primary/20"
            >
              <div className="h-full rounded-2xl bg-background p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary transition-transform duration-300 group-hover:scale-110">
                  <Eye className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-text-primary">Vision</h2>
                <p className="mt-3 text-lg leading-relaxed text-text-secondary">
                  One platform where anyone can edit images, convert files, generate code, improve SEO,
                  and use AI — <span className="font-semibold text-text-primary">without installing a thing</span>.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            icon={BarChart3}
            title="By the Numbers"
            subtitle="A few fun counters from the journey so far."
            eyebrow="Stats"
            eyebrowVariant="success"
          />
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group rounded-2xl border border-border bg-background p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary transition-transform duration-300 group-hover:scale-110">
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-3xl font-bold text-transparent">
                  <Counter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs font-medium text-text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            icon={MessageSquare}
            title="Frequently Asked Questions"
            subtitle="Everything you might want to know."
            eyebrow="FAQ"
            eyebrowVariant="sky"
          />
          <div className="mx-auto mt-10 max-w-2xl space-y-3">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className={cn(
                    "overflow-hidden rounded-xl border transition-all duration-300",
                    open ? "border-primary/40 bg-surface shadow-md" : "border-border bg-background hover:border-primary/30"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-text-primary"
                  >
                    {faq.question}
                    <ChevronDown
                      className={cn(
                        "ml-4 h-4 w-4 shrink-0 text-text-muted transition-transform duration-300",
                        open && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="border-t border-border px-6 py-4">
                          <p className="text-sm leading-relaxed text-text-secondary">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden border-t border-border bg-surface py-16 sm:py-20">
        <div className="absolute inset-0 -z-10">
          <BackgroundBeams />
          <GridPattern className="text-primary opacity-60" />
        </div>
        <div className="container-page text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl"
          >
            <Capsule variant="amber" dot className="mb-6">
              Open to ideas & collabs
            </Capsule>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              Let&apos;s Build Something{" "}
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                Amazing
              </span>{" "}
              Together.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
              Got an idea, feedback, or just want to say hi? My inbox is always open.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ShimmerButton href="/contact">
                <Mail className="h-4 w-4" />
                Get in Touch
                <ArrowRight className="h-4 w-4" />
              </ShimmerButton>
              <Link
                href="/"
                className="group inline-flex h-12 items-center gap-2 rounded-full border-2 border-primary/20 bg-background px-7 text-sm font-semibold text-primary shadow-sm transition-all hover:border-primary hover:bg-primary-light/50 active:scale-[0.98]"
              >
                <Wand2 className="h-4 w-4" />
                Browse All Tools
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
