"use client";

import { useEffect, useState, useRef } from "react";
import { PortfolioHero } from "@/features/portfolio/components/PortfolioHero";
import { PortfolioAbout } from "@/features/portfolio/components/PortfolioAbout";
import { PortfolioStack } from "@/features/portfolio/components/PortfolioStack";
import { GitCommitExperience } from "@/features/portfolio/components/GitCommitExperience";
import { PortfolioProjects } from "@/features/portfolio/components/PortfolioProjects";
import { PortfolioPhilosophy } from "@/features/portfolio/components/PortfolioPhilosophy";
import { PortfolioContact } from "@/features/portfolio/components/PortfolioContact";
import { PortfolioFooter } from "@/features/portfolio/components/PortfolioFooter";
import { CustomCursor } from "@/features/portfolio/components/CustomCursor";
import { PortfolioThemeToggle } from "@/features/portfolio/components/PortfolioThemeToggle";
import { InteractiveTerminal } from "@/features/portfolio/components/InteractiveTerminal";
import { ClickSparkle } from "@/features/portfolio/components/ClickSparkle";
import { KonamiEgg } from "@/features/portfolio/components/KonamiEgg";
import { LiveCodingActivity, MusicPlayer, StatusBadges } from "@/features/portfolio/components/FunWidgets";
import { JourneyGame } from "@/features/portfolio/components/JourneyGame";
import { KeyboardShortcuts } from "@/features/portfolio/components/KeyboardShortcuts";
import { CommandPalette } from "@/features/portfolio/components/CommandPalette";
import { AchievementSystem } from "@/features/portfolio/components/AchievementSystem";

/** Side section indicator — desktop only, highlights the currently visible section */
function SectionIndicator() {
  const sections = [
    { id: "hero", label: "00", full: "HERO" },
    { id: "about", label: "01", full: "ABOUT" },
    { id: "stack", label: "02", full: "STACK" },
    { id: "experience", label: "03", full: "EXPERIENCE" },
    { id: "projects", label: "04", full: "PROJECTS" },
    { id: "philosophy", label: "05", full: "THINK" },
    { id: "play", label: "06", full: "PLAY" },
    { id: "contact", label: "07", full: "CONTACT" },
  ];
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const sectionEls = sections
      .map((s) => {
        const el = document.getElementById(s.id);
        return el ? { id: s.id, el } : null;
      })
      .filter(Boolean) as { id: string; el: HTMLElement }[];

    if (sectionEls.length === 0) return;

    // Use scroll-based detection for reliable highlighting
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestId = "hero";
      let closestDist = Infinity;

      for (const { id, el } of sectionEls) {
        const rect = el.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const dist = Math.abs(sectionCenter - viewportCenter);

        if (dist < closestDist) {
          closestDist = dist;
          closestId = id;
        }
      }

      setActive(closestId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 xl:flex" aria-label="Section navigation">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="group flex items-center gap-2"
          aria-label={s.full}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(s.id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span
            className={`block h-px transition-all duration-300 ${
              active === s.id
                ? "w-6 bg-[var(--pf-accent)]"
                : "w-3 bg-[var(--pf-text-3)] group-hover:w-5 group-hover:bg-[var(--pf-accent)]/60"
            }`}
          />
          <span
            className={`font-[var(--pf-mono)] text-[9px] tracking-wider transition-colors duration-300 ${
              active === s.id
                ? "text-[var(--pf-accent)]"
                : "text-[var(--pf-text-3)] group-hover:text-[var(--pf-text-2)]"
            }`}
          >
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  );
}

function FunWidgetsSection() {
  return (
    <section className="relative border-t border-[var(--pf-border)] bg-[var(--pf-surface)]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mb-8">
          <span className="font-[var(--pf-mono)] text-[10px] tracking-[0.25em] text-[var(--pf-text-3)]">FUN STUFF</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--pf-text)] sm:text-3xl">Developer Vibes</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MusicPlayer />
          <StatusBadges />
          <LiveCodingActivity />
        </div>
      </div>
    </section>
  );
}

export function PortfolioPageClient() {
  return (
    <div className="relative">
      <CustomCursor />
      <ClickSparkle />
      <KonamiEgg />
      <SectionIndicator />
      <KeyboardShortcuts />
      <CommandPalette />
      <AchievementSystem />

      {/* Top nav */}
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-[var(--pf-border)]/50 bg-[var(--pf-bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
          <a href="/" className="font-[var(--pf-mono)] text-xs tracking-[0.15em] text-[var(--pf-text-3)] transition-colors hover:text-[var(--pf-accent)]">VIZOTOOL</a>
          <div className="hidden items-center gap-6 sm:flex">
            {[{ label: "About", href: "#about" }, { label: "Stack", href: "#stack" }, { label: "Projects", href: "#projects" }, { label: "Contact", href: "#contact" }, { label: "Play", href: "#play" }].map((l) => (
              <a key={l.href} href={l.href} className="font-[var(--pf-mono)] text-[10px] tracking-[0.15em] text-[var(--pf-text-3)] transition-colors hover:text-[var(--pf-accent)]">{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <PortfolioThemeToggle />
            <a href="/" className="rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-4 py-1.5 font-[var(--pf-mono)] text-[10px] tracking-wider text-[var(--pf-text-3)] transition-all hover:border-[var(--pf-accent)]/30 hover:text-[var(--pf-accent)]">&larr; VIZOTOOL</a>
          </div>
        </div>
      </nav>

      {/* Sections */}
      <div className="pt-14">
        <div id="hero"><PortfolioHero /></div>
        <div id="about"><PortfolioAbout /></div>
        <div id="stack"><PortfolioStack /></div>
        <div id="experience"><GitCommitExperience /></div>
        <div id="projects"><PortfolioProjects /></div>
        <div id="philosophy"><PortfolioPhilosophy /></div>
        <div id="play"><JourneyGame /></div>
        <div id="contact"><PortfolioContact /></div>
        <InteractiveTerminal />
        <FunWidgetsSection />
        <PortfolioFooter />
      </div>
    </div>
  );
}
