"use client";

import { Suspense, useRef, useCallback, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { Code2, Terminal, Sparkles, Layers, GitBranch, ArrowRight } from "lucide-react";
import { HeroTerminal } from "./HeroTerminal";
import { CodeRain } from "./CodeRain";

const HeroScene = dynamic(() => import("./HeroScene").then(m => ({ default: m.HeroScene })), { ssr: false });

/* ------------------------------------------------------------------ */
/* Client-only mount guard — avoids hydration mismatch from            */
/* framer-motion initial/animate producing different SSR vs CSR styles */
/* ------------------------------------------------------------------ */

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

/* ------------------------------------------------------------------ */
/* Main Hero                                                          */
/* ------------------------------------------------------------------ */

export function PortfolioHero() {
  const tags = [
    { icon: Code2, label: "ENGINEERING" },
    { icon: Layers, label: "FULL STACK" },
    { icon: Sparkles, label: "AI / GENAI" },
    { icon: GitBranch, label: "PRODUCT" },
  ];

  /* ---- Mouse parallax ---- */
  const sectionRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) / (r.width / 2));
    my.set((e.clientY - r.top - r.height / 2) / (r.height / 2));
  }, [mx, my]);

  const springCfg = { stiffness: 50, damping: 18, mass: 0.4 };

  const s3dX = useSpring(mx, springCfg);
  const s3dY = useSpring(my, springCfg);

  const titleX = useSpring(useTransform(mx, (v) => v * 18), springCfg);
  const titleY = useSpring(useTransform(my, (v) => v * 10), springCfg);

  const midX = useSpring(useTransform(mx, (v) => v * 12), springCfg);
  const midY = useSpring(useTransform(my, (v) => v * 6), springCfg);

  const btnX = useSpring(useTransform(mx, (v) => v * 6), springCfg);
  const btnY = useSpring(useTransform(my, (v) => v * 4), springCfg);

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Code Rain background */}
      <CodeRain />

      {/* Background grid */}
      <div className="pf-grid pointer-events-none absolute inset-0 opacity-[0.03]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--pf-surface)]/40 to-[var(--pf-bg)]" />

      {/* 3D Scene */}
      <ClientOnly>
        <motion.div
          style={{ x: s3dX, y: s3dY }}
          className="pointer-events-none absolute -right-[15%] inset-y-[-4%] left-[15%] opacity-90"
        >
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </motion.div>
      </ClientOnly>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12">
        <div className="grid w-full gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-16">
          {/* Left */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ x: midX, y: midY }}
              className="mb-6 flex items-center gap-2"
            >
              <span className="inline-block h-px w-8 bg-[var(--pf-accent)]" />
              <span className="font-[var(--pf-mono)] text-xs tracking-[0.2em] text-[var(--pf-accent)]">PORTFOLIO</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ x: titleX, y: titleY }}
              className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="block text-[var(--pf-text)]">AMAR</span>
              <span className="block text-[var(--pf-text)]">LODHI</span>
            </motion.h1>

            {/* Role */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ x: midX, y: midY }}
              className="mt-3 font-[var(--pf-mono)] text-sm tracking-[0.15em] text-[var(--pf-accent)] sm:text-base"
            >
              SOFTWARE ENGINEER
            </motion.p>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              style={{ x: midX, y: midY }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--pf-text-2)] sm:text-xl"
            >
              Building products where{" "}
              <span className="font-semibold text-[var(--pf-text)]">software meets intelligence.</span>
            </motion.p>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{ x: midX, y: midY }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {tags.map((tag, i) => (
                <motion.span
                  key={tag.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + i * 0.08 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-3 py-1.5 font-[var(--pf-mono)] text-[10px] tracking-widest text-[var(--pf-text-2)] sm:text-xs"
                >
                  <tag.icon className="h-3 w-3 text-[var(--pf-accent)]" />
                  {tag.label}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{ x: btnX, y: btnY }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a href="#projects" className="pf-magnetic group inline-flex items-center gap-2 rounded-full bg-[var(--pf-accent)] px-6 py-3 text-sm font-semibold text-[var(--pf-bg)] shadow-lg shadow-[var(--pf-accent)]/20 transition-all hover:shadow-xl hover:shadow-[var(--pf-accent)]/30 hover:brightness-110 active:scale-[0.98]">
                View Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#contact" className="pf-magnetic inline-flex items-center gap-2 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-6 py-3 text-sm font-semibold text-[var(--pf-text)] transition-all hover:border-[var(--pf-accent)]/40 hover:bg-[var(--pf-surface-2)] active:scale-[0.98]">
                <Terminal className="h-4 w-4 text-[var(--pf-accent)]" />
                Get in Touch
              </a>
            </motion.div>
          </div>

          {/* Right — Terminal */}
          <ClientOnly>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ x: btnX, y: btnY }}
              className="space-y-6"
            >
              <HeroTerminal />
            </motion.div>
          </ClientOnly>
        </div>
      </div>

      {/* Scroll indicator */}
      <ClientOnly>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3"
          >
            <span className="font-[var(--pf-mono)] text-xs tracking-[0.3em] text-[var(--pf-text-3)]">SCROLL</span>
            <div className="relative h-10 w-6 rounded-full border-2 border-[var(--pf-accent)]/40">
              <motion.div
                animate={{ y: [2, 12, 2] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-[var(--pf-accent)]"
              />
            </div>
            <div className="h-12 w-px bg-gradient-to-b from-[var(--pf-accent)]/50 to-transparent" />
          </motion.div>
        </motion.div>
      </ClientOnly>
    </section>
  );
}
