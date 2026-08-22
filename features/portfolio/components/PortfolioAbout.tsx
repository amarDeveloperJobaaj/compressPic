"use client";
import { ScrollReveal } from "./ScrollReveal";
import { Briefcase, Code2, Sparkles, Rocket, Wrench, Globe } from "lucide-react";

const highlights = [
  { icon: Briefcase, text: "Software Engineer at Jobaaj" },
  { icon: Code2, text: "Full-stack MERN development" },
  { icon: Sparkles, text: "AI/LLM integration & RAG" },
  { icon: Rocket, text: "Product development — VizoTool" },
  { icon: Wrench, text: "Developer tooling & APIs" },
  { icon: Globe, text: "40+ browser-based web tools" },
];

export function PortfolioAbout() {
  return (
    <section className="relative border-t border-[var(--pf-border)] bg-[var(--pf-bg)]">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.3fr_0.7fr] lg:gap-16">
          <ScrollReveal>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <span className="font-[var(--pf-mono)] text-[10px] tracking-[0.25em] text-[var(--pf-text-3)]">01 / ABOUT</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--pf-text)] sm:text-3xl">About</h2>
              <div className="mt-4 hidden h-px w-12 bg-[var(--pf-accent)]/40 lg:block" />
            </div>
          </ScrollReveal>

          <div className="space-y-6">
            <ScrollReveal delay={0.1}>
              <p className="text-lg leading-relaxed text-[var(--pf-text-2)] sm:text-xl">
                I&apos;m a <span className="font-semibold text-[var(--pf-text)]">Software Engineer</span> who builds products that solve real problems. I work across the full stack — from crafting responsive frontends to designing backend systems and integrating AI-powered features.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-lg leading-relaxed text-[var(--pf-text-2)]">
                My primary focus is the <span className="font-semibold text-[var(--pf-text)]">MERN ecosystem</span> — React, Next.js, Node.js, and MongoDB — along with <span className="font-semibold text-[var(--pf-text)]">AI/LLM integration</span> including RAG pipelines, embeddings, and AI agents.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <p className="text-lg leading-relaxed text-[var(--pf-text-2)]">
                I&apos;m the creator of <span className="font-semibold text-[var(--pf-text)]">VizoTool</span> — a growing ecosystem of 40+ practical, browser-based web tools for images, PDFs, developers, and SEO. Every tool processes data entirely in the browser.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {highlights.map((h) => (
                  <div key={h.text} className="flex items-center gap-3 rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface)] px-4 py-3 transition-colors hover:border-[var(--pf-accent)]/30">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--pf-accent)]/10 text-[var(--pf-accent)]">
                      <h.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-[var(--pf-text-2)]">{h.text}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
