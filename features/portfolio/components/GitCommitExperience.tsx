"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import { GitBranch, GitCommit, Check, ArrowUpRight } from "lucide-react";

interface Commit {
  hash: string;
  date: string;
  author: string;
  message: string;
  description: string;
  tags: string[];
  stats: { files: number; additions: number; deletions: number };
}

const COMMITS: Commit[] = [
  {
    hash: "a3f7c2d",
    date: "2026",
    author: "amar-lodhi",
    message: "feat(jobaaj): Software Engineer",
    description: "Full-stack development, AI-powered systems, and product engineering at Jobaaj.",
    tags: ["current", "full-stack", "ai"],
    stats: { files: 48, additions: 3200, deletions: 180 },
  },
  {
    hash: "e9b1f4a",
    date: "2026",
    author: "amar-lodhi",
    message: "feat(vizotool): ship 20+ production tools",
    description: "Image processing, PDF manipulation, developer utilities, SEO tools — all built with Next.js.",
    tags: ["product", "next.js", "production"],
    stats: { files: 92, additions: 8500, deletions: 340 },
  },
  {
    hash: "b2d8e1c",
    date: "2026",
    author: "amar-lodhi",
    message: "feat(ai-interview): build adaptive interview engine",
    description: "Resume parsing, real-time speech, per-answer evaluation, AI-generated reports.",
    tags: ["ai", "speech", "evaluation"],
    stats: { files: 35, additions: 4200, deletions: 90 },
  },
  {
    hash: "x1z9m3k",
    date: "Feb 2026",
    author: "amar-lodhi",
    message: "feat(jobaaj): join as Software Engineer",
    description: "Joined Jobaaj after internship at Arema. New challenges, bigger products.",
    tags: ["new-job", "transition"],
    stats: { files: 15, additions: 900, deletions: 50 },
  },
  {
    hash: "f4a9c3e",
    date: "Oct 2025 - Feb 2026",
    author: "amar-lodhi",
    message: "feat(arema): intern — full stack developer",
    description: "Started as intern at Arema Technology. Client projects, production apps, legacy codebase modernization.",
    tags: ["intern", "arema", "php", "node.js"],
    stats: { files: 67, additions: 5100, deletions: 1200 },
  },
  {
    hash: "c1e5b7a",
    date: "2021",
    author: "amar-lodhi",
    message: "feat(learning): master full stack development",
    description: "MERN stack, REST APIs, databases, authentication, deployment workflows.",
    tags: ["learning", "mern", "backend"],
    stats: { files: 24, additions: 1800, deletions: 0 },
  },
  {
    hash: "d8f2a6b",
    date: "2019",
    author: "amar-lodhi",
    message: "init: first line of code",
    description: "The beginning. Hello, World! Everything starts here.",
    tags: ["origin", "hello-world"],
    stats: { files: 1, additions: 1, deletions: 0 },
  },
];

function CommitCard({ commit, index }: { commit: Commit; index: number }) {
  const isLatest = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative flex gap-4"
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
            isLatest
              ? "border-[var(--pf-accent)] bg-[var(--pf-accent)] text-white"
              : "border-[var(--pf-border)] bg-[var(--pf-surface)] text-[var(--pf-text-3)]"
          }`}
        >
          <GitCommit className="h-4 w-4" />
        </div>
        {index < COMMITS.length - 1 && (
          <div className="w-px flex-1 bg-[var(--pf-border)]" />
        )}
      </div>

      {/* Commit content */}
      <div className="mb-6 flex-1 rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4 transition-all group-hover:border-[var(--pf-accent)]/30 group-hover:shadow-lg group-hover:shadow-[var(--pf-accent)]/5 sm:p-5">
        {/* Commit header */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="font-[var(--pf-mono)] text-xs text-[var(--pf-accent)]">{commit.hash}</span>
          <span className="text-[var(--pf-text-3)]">·</span>
          <span className="font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-3)]">{commit.date}</span>
          {isLatest && (
            <span className="rounded-full bg-[var(--pf-accent)]/10 px-2 py-0.5 font-[var(--pf-mono)] text-[9px] text-[var(--pf-accent)]">
              HEAD
            </span>
          )}
        </div>

        {/* Commit message */}
        <p className="mb-2 font-[var(--pf-mono)] text-sm font-semibold text-[var(--pf-text)]">
          {commit.message}
        </p>

        {/* Description */}
        <p className="mb-3 text-sm leading-relaxed text-[var(--pf-text-2)]">
          {commit.description}
        </p>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {commit.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-[var(--pf-border)] bg-[var(--pf-bg)] px-2 py-0.5 font-[var(--pf-mono)] text-[9px] text-[var(--pf-text-3)]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-3)]">
          <span className="text-[var(--pf-accent)]">+{commit.stats.additions}</span>
          <span className="text-red-400/70">-{commit.stats.deletions}</span>
          <span>{commit.stats.files} files changed</span>
        </div>
      </div>
    </motion.div>
  );
}

export function GitCommitExperience() {
  return (
    <section className="relative border-t border-[var(--pf-border)]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
        <ScrollReveal>
          <span className="font-[var(--pf-mono)] text-[10px] tracking-[0.25em] text-[var(--pf-text-3)]">
            03 / EXPERIENCE
          </span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--pf-text)] sm:text-3xl">
            Git Commit History
          </h2>
          <p className="mt-2 max-w-md text-sm text-[var(--pf-text-2)]">
            My career, told as code. Each commit represents a chapter.
          </p>
        </ScrollReveal>

        {/* Git log header */}
        <div className="mt-8 mb-6 flex items-center gap-2 rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface)] px-4 py-2.5">
          <GitBranch className="h-4 w-4 text-[var(--pf-accent)]" />
          <span className="font-[var(--pf-mono)] text-xs text-[var(--pf-text-2)]">
            main · {COMMITS.length} commits
          </span>
          <Check className="ml-auto h-3.5 w-3.5 text-green-500" />
          <span className="font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-3)]">
            365 days of coding
          </span>
        </div>

        {/* Commit list */}
        <div className="relative">
          {COMMITS.map((commit, i) => (
            <CommitCard key={commit.hash} commit={commit} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
