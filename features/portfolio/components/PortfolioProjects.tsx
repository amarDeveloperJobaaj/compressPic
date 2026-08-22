"use client";
import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import { ExternalLink, ArrowRight, Globe, Layers, Zap, Search, Bot, FileText, Code2, BrainCircuit, MessageSquare, TrendingUp, Terminal } from "lucide-react";

const projects = [
  { number: "01", name: "VIZOTOOL", tagline: "One product. A growing ecosystem of practical web tools.", description: "A real-world product containing 40+ free browser-based tools for images, PDFs, developers, and SEO. Every tool processes data entirely in the browser.", liveUrl: "https://www.vizotool.com/",
    roles: [{ label: "PRODUCT", icon: Layers }, { label: "ENGINEERING", icon: Code2 }, { label: "PERFORMANCE", icon: Zap }, { label: "SEO", icon: Search }],
    categories: [{ icon: Globe, label: "Image Tools", items: ["Compress", "Resize", "Convert", "Flip", "Watermark"] }, { icon: FileText, label: "PDF Tools", items: ["Image to PDF", "PDF to Image"] }, { icon: Code2, label: "Dev Tools", items: ["JSON", "Base64", "JWT", "SQL"] }, { icon: Search, label: "SEO Tools", items: ["Meta Tags", "Schema", "Sitemap"] }],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Supabase"], highlight: true },
  { number: "02", name: "AI MOCK INTERVIEW", tagline: "Personalized interview preparation powered by AI.", description: "An AI-driven mock interview system that generates personalized questions based on resume data, evaluates responses across 54 dimensions, and provides detailed feedback.",
    flow: [{ icon: Bot, label: "User" }, { icon: FileText, label: "Resume" }, { icon: BrainCircuit, label: "AI Interview" }, { icon: MessageSquare, label: "Analysis" }, { icon: TrendingUp, label: "Feedback" }],
    features: ["Resume-based personalized questions", "54-dimension evaluation", "Adaptive difficulty", "Voice + text input", "Scoring & reports"],
    techStack: ["Next.js", "React", "OpenAI / Gemini", "Supabase", "Web Speech API"] },
  { number: "03", name: "TERMINAL AI AGENT", tagline: "AI-assisted development through a terminal interface.", description: "An intelligent coding agent that understands file structures, generates code, and assists developers through a terminal-style interface.",
    isTerminal: true,
    features: ["AI-assisted code generation", "Project context understanding", "File system navigation", "Terminal workflow automation", "LLM-powered suggestions"],
    techStack: ["TypeScript", "Node.js", "LLM APIs", "File System APIs"] },
];

function TerminalPanel() {
  const lines = [
    { t: "output", text: "$ agent init --project vizotool" },
    { t: "success", text: "✓ Connected to project context" },
    { t: "output", text: "$ agent analyze ./src/features" },
    { t: "info", text: "→ Found 18 feature modules, 247 components" },
    { t: "output", text: '$ agent generate "add watermark tool"' },
    { t: "success", text: "✓ Generated: WatermarkTool.tsx" },
    { t: "success", text: "✓ Updated: tools.ts registry" },
    { t: "output", text: "$ agent test --coverage" },
    { t: "success", text: "✓ 24/24 tests passing (100%)" },
  ];
  return (
    <div className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface)] overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[var(--pf-border)] px-4 py-2.5">
        <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /></div>
        <span className="ml-2 font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-3)]">agent-terminal</span>
      </div>
      <div className="p-4 font-[var(--pf-mono)] text-xs leading-relaxed">
        {lines.map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-20px" }} transition={{ duration: 0.25, delay: i * 0.08 }}
            className={l.t === "success" ? "text-[#28c840]" : l.t === "info" ? "text-[var(--pf-accent)]" : "text-[var(--pf-text-2)]"}>
            {l.text}
          </motion.div>
        ))}
        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1 }} className="mt-2 inline-block h-4 w-2 bg-[var(--pf-accent)]" style={{ animation: "pf-cursor-blink 1s step-end infinite" }} />
      </div>
    </div>
  );
}

export function PortfolioProjects() {
  return (
    <section className="relative border-t border-[var(--pf-border)] bg-[var(--pf-surface)]">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
        <ScrollReveal>
          <div className="mb-16">
            <span className="font-[var(--pf-mono)] text-[10px] tracking-[0.25em] text-[var(--pf-text-3)]">04 / PROJECTS</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--pf-text)] sm:text-3xl">Featured Projects</h2>
            <p className="mt-3 max-w-lg text-[var(--pf-text-2)]">Case studies from products I&apos;ve built and shipped.</p>
          </div>
        </ScrollReveal>

        <div className="space-y-16">
          {projects.map((p, idx) => (
            <ScrollReveal key={p.name} delay={idx * 0.1}>
              <div className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 lg:p-10 ${p.highlight ? "border-[var(--pf-accent)]/20 bg-gradient-to-br from-[var(--pf-surface)] via-[var(--pf-bg)] to-[var(--pf-surface)]" : "border-[var(--pf-border)] bg-[var(--pf-bg)]"}`}>
                {p.highlight && <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-[var(--pf-accent)]/[0.06] blur-[80px]" />}

                <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="font-[var(--pf-mono)] text-xs text-[var(--pf-text-3)]">PROJECT {p.number}</span>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-[var(--pf-text)] sm:text-3xl">{p.name}</h3>
                    <p className="mt-2 max-w-xl text-[var(--pf-text-2)]">{p.tagline}</p>
                  </div>
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-4 py-2 text-xs font-medium text-[var(--pf-text-2)] transition-all hover:border-[var(--pf-accent)]/40 hover:text-[var(--pf-text)]">
                      <ExternalLink className="h-3.5 w-3.5" />Live Demo
                    </a>
                  )}
                </div>

                <p className="relative z-10 mt-6 max-w-2xl text-sm leading-relaxed text-[var(--pf-text-2)]">{p.description}</p>

                {p.roles && (
                  <div className="relative z-10 mt-6 flex flex-wrap gap-2">
                    {p.roles.map((r) => (
                      <span key={r.label} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-3 py-1.5 font-[var(--pf-mono)] text-[10px] tracking-wider text-[var(--pf-text-3)]">
                        <r.icon className="h-3 w-3 text-[var(--pf-accent)]" />{r.label}
                      </span>
                    ))}
                  </div>
                )}

                {p.isTerminal && <div className="relative z-10 mt-8"><TerminalPanel /></div>}

                <div className="relative z-10 mt-8 grid gap-6 sm:grid-cols-2">
                  {p.categories && (
                    <div className="space-y-3">
                      <h4 className="font-[var(--pf-mono)] text-[10px] tracking-[0.2em] text-[var(--pf-text-3)]">FEATURES</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {p.categories.map((c) => { const C = c.icon; return (
                          <div key={c.label} className="rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface)] p-3">
                            <div className="flex items-center gap-2"><C className="h-3.5 w-3.5 text-[var(--pf-accent)]" /><span className="text-xs font-medium text-[var(--pf-text)]">{c.label}</span></div>
                            <p className="mt-1.5 font-[var(--pf-mono)] text-[10px] leading-relaxed text-[var(--pf-text-3)]">{c.items.join(" · ")}</p>
                          </div>
                        );})}
                      </div>
                    </div>
                  )}
                  {p.features && !p.categories && (
                    <div className="space-y-3">
                      <h4 className="font-[var(--pf-mono)] text-[10px] tracking-[0.2em] text-[var(--pf-text-3)]">CAPABILITIES</h4>
                      <ul className="space-y-2">
                        {p.features.map((f) => (<li key={f} className="flex items-center gap-2 text-sm text-[var(--pf-text-2)]"><span className="h-1 w-1 shrink-0 rounded-full bg-[var(--pf-accent)]" />{f}</li>))}
                      </ul>
                    </div>
                  )}
                  <div className="space-y-3">
                    <h4 className="font-[var(--pf-mono)] text-[10px] tracking-[0.2em] text-[var(--pf-text-3)]">TECH STACK</h4>
                    <div className="flex flex-wrap gap-2">
                      {p.techStack.map((t) => (<span key={t} className="rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-3 py-1 font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-3)] transition-colors hover:border-[var(--pf-accent)]/30 hover:text-[var(--pf-accent)]">{t}</span>))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
