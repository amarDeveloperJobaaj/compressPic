"use client";
import { ScrollReveal } from "./ScrollReveal";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, ArrowRight } from "lucide-react";

const availability = ["Software Engineering", "Full Stack Development", "AI / GenAI", "Product Development"];
const socials = [
  { icon: Mail, label: "Email", href: "mailto:amarrajputdev@gmail.com", handle: "amarrajputdev@gmail.com" },
  { icon: Github, label: "GitHub", href: "https://github.com/amarRajputDev", handle: "@amarRajputDev" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/amarlodhi", handle: "in/amarlodhi" },
];

export function PortfolioContact() {
  return (
    <section className="relative border-t border-[var(--pf-border)] bg-[var(--pf-surface)]">
      <div className="pf-grid pointer-events-none absolute inset-0 opacity-[0.02]" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
        <ScrollReveal>
          <span className="font-[var(--pf-mono)] text-[10px] tracking-[0.25em] text-[var(--pf-text-3)]">07 / CONTACT</span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[var(--pf-text)] sm:text-4xl md:text-5xl lg:text-6xl">
            Let&apos;s build something <span className="text-[var(--pf-accent)]">useful.</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="mt-8">
            <p className="mb-3 font-[var(--pf-mono)] text-xs tracking-wider text-[var(--pf-text-3)]">AVAILABLE FOR</p>
            <div className="flex flex-wrap gap-2">
              {availability.map((a) => (<span key={a} className="rounded-full border border-[var(--pf-border)] bg-[var(--pf-bg)] px-4 py-2 text-sm text-[var(--pf-text-2)] transition-colors hover:border-[var(--pf-accent)]/30 hover:text-[var(--pf-text)]">{a}</span>))}
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {socials.map((s, i) => { const Icon = s.icon; return (
              <motion.a key={s.label} href={s.href} target={s.label !== "Email" ? "_blank" : undefined} rel={s.label !== "Email" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                className="group flex items-center gap-4 rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg)] p-5 transition-all duration-300 hover:border-[var(--pf-accent)]/30 hover:shadow-lg hover:shadow-[var(--pf-accent)]/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--pf-accent)]/10 text-[var(--pf-accent)] transition-all duration-300 group-hover:bg-[var(--pf-accent)]/20 group-hover:scale-110"><Icon className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[var(--pf-text)]">{s.label}</p><p className="mt-0.5 truncate font-[var(--pf-mono)] text-xs text-[var(--pf-text-3)]">{s.handle}</p></div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--pf-text-3)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--pf-accent)]" />
              </motion.a>
            );})}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
