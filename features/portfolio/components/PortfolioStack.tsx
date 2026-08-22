"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import { Atom, Triangle, Braces, FileCode2, Server, Workflow, Network, Database, Table2, BrainCircuit, Sparkles, Terminal, Globe, GitBranch } from "lucide-react";

interface TechItem { name: string; icon: typeof Atom; detail: string; }
interface TechCategory { id: string; label: string; items: TechItem[]; }

const categories: TechCategory[] = [
  { id: "frontend", label: "FRONTEND", items: [
    { name: "React", icon: Atom, detail: "Component-driven interfaces" },
    { name: "Next.js", icon: Triangle, detail: "Full-stack React framework" },
    { name: "JavaScript", icon: Braces, detail: "Core language of the web" },
    { name: "TypeScript", icon: FileCode2, detail: "Type-safe development" },
    { name: "HTML / CSS", icon: Globe, detail: "Semantic markup & layouts" },
    { name: "Tailwind CSS", icon: Atom, detail: "Utility-first styling" },
  ]},
  { id: "backend", label: "BACKEND", items: [
    { name: "Node.js", icon: Server, detail: "Backend services & APIs" },
    { name: "Express.js", icon: Workflow, detail: "HTTP middleware & routing" },
    { name: "REST APIs", icon: Network, detail: "API design & integration" },
    { name: "PHP", icon: FileCode2, detail: "Server-side scripting" },
    { name: "Auth", icon: GitBranch, detail: "Session management" },
  ]},
  { id: "database", label: "DATABASE", items: [
    { name: "MongoDB", icon: Database, detail: "Document-based NoSQL" },
    { name: "MySQL", icon: Table2, detail: "Relational data modeling" },
    { name: "Supabase", icon: Database, detail: "Postgres + realtime" },
  ]},
  { id: "ai", label: "AI", items: [
    { name: "Gemini API", icon: Sparkles, detail: "Google's multimodal LLM" },
    { name: "LLM APIs", icon: BrainCircuit, detail: "OpenAI, Claude, Gemini" },
    { name: "RAG", icon: BrainCircuit, detail: "Retrieval-augmented generation" },
    { name: "Embeddings", icon: Globe, detail: "Vector search" },
    { name: "AI Agents", icon: Terminal, detail: "Autonomous task loops" },
  ]},
  { id: "tools", label: "TOOLS", items: [
    { name: "Git / GitHub", icon: GitBranch, detail: "Version control" },
    { name: "Linux", icon: Terminal, detail: "Server & CLI" },
    { name: "API Integrations", icon: Network, detail: "Third-party wiring" },
  ]},
];

export function PortfolioStack() {
  const [active, setActive] = useState("frontend");
  const [hovered, setHovered] = useState<string | null>(null);
  const cat = categories.find((c) => c.id === active)!;

  return (
    <section className="relative border-t border-[var(--pf-border)] bg-[var(--pf-surface)]">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
        <ScrollReveal>
          <div className="mb-12">
            <span className="font-[var(--pf-mono)] text-[10px] tracking-[0.25em] text-[var(--pf-text-3)]">02 / STACK</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--pf-text)] sm:text-3xl">Engineering Stack</h2>
            <p className="mt-3 max-w-lg text-[var(--pf-text-2)]">Technologies I reach for when turning ideas into products.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c.id} onClick={() => { setActive(c.id); setHovered(null); }}
                className={`rounded-full border px-4 py-2 font-[var(--pf-mono)] text-xs tracking-wider transition-all duration-200 ${active === c.id ? "border-[var(--pf-accent)] bg-[var(--pf-accent)]/10 text-[var(--pf-accent)]" : "border-[var(--pf-border)] bg-[var(--pf-surface)] text-[var(--pf-text-3)] hover:border-[var(--pf-accent)]/30 hover:text-[var(--pf-text-2)]"}`}>
                {c.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {cat.items.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                onMouseEnter={() => setHovered(item.name)} onMouseLeave={() => setHovered(null)}
                className="group relative overflow-hidden rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg)] p-4 transition-all duration-300 hover:border-[var(--pf-accent)]/30 hover:shadow-lg hover:shadow-[var(--pf-accent)]/5">
                <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[var(--pf-accent)]/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--pf-accent)]/10 text-[var(--pf-accent)] transition-all duration-300 group-hover:scale-110">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-[var(--pf-text)]">{item.name}</span>
                </div>
                <AnimatePresence>
                  {hovered === item.name && (
                    <motion.p initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 12 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden text-xs leading-relaxed text-[var(--pf-text-2)]">{item.detail}</motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
