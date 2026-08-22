"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Trophy,
  Code2,
  Rocket,
  Brain,
  Map,
  ChevronRight,
  RotateCcw,
  Zap,
  Heart,
  Flame,
  Target,
  Sparkles,
  Check,
  Volume2,
  VolumeX,
  Lightbulb,
  Waves,
  Building2,
  Globe,
  Wrench,
  BookOpen,
  Palette,
  Monitor,
  Bot,
  Handshake,
  GraduationCap,
  Hammer,
  Star,
  Play,
  CircleDot,
  Hexagon,
  Triangle,
  Diamond,
  Square,
  Circle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  Icon: LucideIcon;
  iconColor: string;
  description: string;
  funFact: string;
  choices: Choice[];
  xpReward: number;
  achievement?: Achievement;
}

interface Choice {
  text: string;
  result: string;
  Icon: LucideIcon;
  iconColor: string;
  xpBonus?: number;
  mood?: "nerd" | "cool" | "hustle" | "zen";
}

interface Achievement {
  name: string;
  Icon: LucideIcon;
  iconColor: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/* Game data — Amar's actual journey                                  */
/* ------------------------------------------------------------------ */

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "The Spark",
    subtitle: "Where it all began",
    year: "2019",
    Icon: Lightbulb,
    iconColor: "#fbbf24",
    description:
      "A curious mind discovers the world of code. The first 'Hello, World!' lights up the screen. Nothing will ever be the same.",
    funFact:
      'Did you know? Most successful developers started by breaking things and figuring out why they broke. "Hello, World!" is just the beginning.',
    choices: [
      {
        text: "Tinker with every line of code",
        result:
          "You changed the font color. Then the background. Then accidentally deleted half the file. Classic first day. You're hooked.",
        Icon: Wrench,
        iconColor: "#3b82f6",
        xpBonus: 10,
        mood: "nerd",
      },
      {
        text: "Read every tutorial you can find",
        result:
          "W3Schools, freeCodeCamp, YouTube — you consumed them all. Knowledge absorbed like a sponge. Your brain is 80% HTML tags now.",
        Icon: BookOpen,
        iconColor: "#8b5cf6",
        mood: "cool",
      },
    ],
    xpReward: 50,
    achievement: { name: "First Spark", Icon: Lightbulb, iconColor: "#fbbf24", description: "You wrote your first line of code!" },
  },
  {
    id: 2,
    title: "The Deep Dive",
    subtitle: "HTML, CSS & JavaScript — The Holy Trinity",
    year: "2020",
    Icon: Waves,
    iconColor: "#3b82f6",
    description:
      "Frontend opens up a universe of possibilities. Every div is a canvas, every animation is a brushstroke.",
    funFact:
      "Building your first website from scratch without a framework is like learning to drive manual before automatic — it teaches you everything.",
    choices: [
      {
        text: "Build a browser game first",
        result:
          "A flappy bird clone. Terrible UI. Zero scoring system. But it WORKS and it's yours. The best feeling in the world.",
        Icon: Gamepad2,
        iconColor: "#f59e0b",
        xpBonus: 15,
        mood: "hustle",
      },
      {
        text: "Make a personal portfolio site",
        result:
          "Over-designed. Under-functioning. 47 CSS animations on one page. But recruiters loved the effort. You learned CSS Grid that week.",
        Icon: Palette,
        iconColor: "#22c55e",
        mood: "zen",
      },
    ],
    xpReward: 75,
    achievement: { name: "Pixel Perfect", Icon: Palette, iconColor: "#8b5cf6", description: "Mastered the frontend trinity" },
  },
  {
    id: 3,
    title: "The Backend Awakening",
    subtitle: "Server-side is where the real power lives",
    year: "2021",
    Icon: Zap,
    iconColor: "#fbbf24",
    description:
      "The frontend was just the tip of the iceberg. Node.js, Express, databases — the backend is a whole new dimension.",
    funFact:
      "The moment you connect your first database and see real data flow from server to screen — that's the 'I am a real developer' moment.",
    choices: [
      {
        text: "Build a REST API from scratch",
        result:
          "CRUD operations flowing through Express. JWT auth keeping things secure. MongoDB collections growing. You feel like a backend wizard now.",
        Icon: Code2,
        iconColor: "#3b82f6",
        xpBonus: 20,
        mood: "nerd",
      },
      {
        text: "Jump straight into AI/ML",
        result:
          "TensorFlow confused you. PyTorch confused you more. But you persisted and built a simple sentiment analyzer. Not perfect, but magical.",
        Icon: Brain,
        iconColor: "#f59e0b",
        xpBonus: 25,
        mood: "hustle",
      },
    ],
    xpReward: 100,
    achievement: { name: "Full Stack Rising", Icon: Zap, iconColor: "#fbbf24", description: "Conquered the backend" },
  },
  {
    id: 4,
    title: "The Real World",
    subtitle: "Arema Technology — First professional gig",
    year: "2022-2024",
    Icon: Building2,
    iconColor: "#6366f1",
    description:
      "Theoretical knowledge meets real-world constraints. Deadlines. Clients. Production deployments. This is where growth happens.",
    funFact:
      "The gap between 'tutorial projects' and 'production code' is where most developers grow the most. Shipping real products is the ultimate teacher.",
    choices: [
      {
        text: "Take on every challenge thrown at you",
        result:
          "Legacy PHP codebases. Regex nightmares. API integrations that make you question reality. But every challenge made you stronger. You became the go-to person.",
        Icon: Flame,
        iconColor: "#f59e0b",
        xpBonus: 30,
        mood: "hustle",
      },
      {
        text: "Mentor junior developers",
        result:
          "Teaching others to code forced you to understand it better yourself. The best way to learn is to teach. You gained clarity AND helped others grow.",
        Icon: Handshake,
        iconColor: "#22c55e",
        xpBonus: 20,
        mood: "zen",
      },
    ],
    xpReward: 150,
    achievement: { name: "Industry Veteran", Icon: Building2, iconColor: "#6366f1", description: "Survived the real world of dev" },
  },
  {
    id: 5,
    title: "The Product Builder",
    subtitle: "Jobaaj — Full Stack + AI",
    year: "2026",
    Icon: Rocket,
    iconColor: "#f43f5e",
    description:
      "Software Engineer at Jobaaj. Building AI-powered products, full-stack systems, and the future of developer tools.",
    funFact:
      "Building VizoTool wasn't just a project — it was proof that you can build real products that real people use every day.",
    choices: [
      {
        text: "Ship VizoTool to production",
        result:
          "20+ tools. Image processing, PDF manipulation, developer utilities, SEO tools — all built with Next.js, all in production. Users are actually using it!",
        Icon: Target,
        iconColor: "#f43f5e",
        xpBonus: 40,
        mood: "hustle",
      },
      {
        text: "Build AI-powered interview system",
        result:
          "Adaptive AI interview engine. Resume parsing. Real-time speech. Per-answer evaluation. AI-generated reports. The future of interview prep.",
        Icon: Bot,
        iconColor: "#3b82f6",
        xpBonus: 40,
        mood: "nerd",
      },
    ],
    xpReward: 200,
    achievement: { name: "Product Engineer", Icon: Rocket, iconColor: "#f43f5e", description: "Built and shipped real products" },
  },
  {
    id: 6,
    title: "The Continuum",
    subtitle: "What's next?",
    year: "2026+",
    Icon: Globe,
    iconColor: "#14b8a6",
    description:
      "The journey never ends. New technologies, bigger challenges, more impactful products. The best engineers never stop building.",
    funFact:
      "The secret? There is no finish line. Every project teaches something new. Every bug teaches patience. Every feature teaches empathy for users.",
    choices: [
      {
        text: "Build the next big product",
        result:
          "Something the world hasn't seen yet. AI + Web + Developer Tools + Product Thinking. The ingredients are there. The vision is clear.",
        Icon: Hammer,
        iconColor: "#f59e0b",
        xpBonus: 50,
        mood: "hustle",
      },
      {
        text: "Open source & community",
        result:
          "Give back to the community that gave you everything. Build tools others can use. Write code that inspires. Leave the web better than you found it.",
        Icon: Heart,
        iconColor: "#ef4444",
        xpBonus: 30,
        mood: "zen",
      },
    ],
    xpReward: 250,
    achievement: { name: "Infinity", Icon: Globe, iconColor: "#14b8a6", description: "The journey never ends" },
  },
];

const MOOD_LABELS: Record<string, { label: string; color: string; Icon: LucideIcon }> = {
  nerd: { label: "NERD MODE", color: "#3b82f6", Icon: Brain },
  cool: { label: "COOL MODE", color: "#8b5cf6", Icon: Sparkles },
  hustle: { label: "HUSTLE MODE", color: "#f59e0b", Icon: Flame },
  zen: { label: "ZEN MODE", color: "#22c55e", Icon: Heart },
};

/* ------------------------------------------------------------------ */
/* Sound effects (Web Audio API)                                      */
/* ------------------------------------------------------------------ */

function playTone(freq: number, duration = 0.1, vol = 0.08) {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    /* silent fail */
  }
}

function playClick() {
  playTone(800, 0.05, 0.06);
  setTimeout(() => playTone(1200, 0.04, 0.04), 50);
}

function playSuccess() {
  [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.15, 0.06), i * 100));
}

function playAchievement() {
  [440, 554, 659, 880, 1108].forEach((f, i) => setTimeout(() => playTone(f, 0.2, 0.07), i * 80));
}

/* ------------------------------------------------------------------ */
/* Pixel Map — adventure map visualization                            */
/* ------------------------------------------------------------------ */

function AdventureMap({
  currentChapter,
  totalChapters,
  visitedChapters,
}: {
  currentChapter: number;
  totalChapters: number;
  visitedChapters: Set<number>;
}) {
  return (
    <div className="relative flex items-center justify-between px-2 sm:px-4">
      {/* Connection line */}
      <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-[var(--pf-border)]" />
      <div
        className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-[var(--pf-accent)] to-[var(--pf-warm)] transition-all duration-700"
        style={{ width: `${((currentChapter - 1) / (totalChapters - 1)) * 100}%` }}
      />

      {Array.from({ length: totalChapters }, (_, i) => {
        const ch = i + 1;
        const isVisited = visitedChapters.has(ch);
        const isCurrent = ch === currentChapter;
        const ChIcon = CHAPTERS[i].Icon;
        const iconColor = CHAPTERS[i].iconColor;

        return (
          <div key={ch} className="relative z-10 flex flex-col items-center gap-1">
            <motion.div
              animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 sm:h-10 sm:w-10 ${
                isCurrent
                  ? "border-[var(--pf-accent)] bg-[var(--pf-accent)] text-white shadow-lg shadow-[var(--pf-accent)]/30"
                  : isVisited
                  ? "border-[var(--pf-accent)]/50 bg-[var(--pf-accent)]/10"
                  : "border-[var(--pf-border)] bg-[var(--pf-surface)] text-[var(--pf-text-3)]"
              }`}
            >
              {isVisited && !isCurrent ? (
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-[var(--pf-accent)]" />
              ) : (
                <ChIcon
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  style={{ color: isCurrent ? "#fff" : iconColor }}
                />
              )}
            </motion.div>
            <span className="hidden text-[8px] font-[var(--pf-mono)] tracking-wider text-[var(--pf-text-3)] sm:block">
              {ch}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter Card — the main game content                               */
/* ------------------------------------------------------------------ */

function ChapterCard({
  chapter,
  onChoice,
  choiceIndex,
}: {
  chapter: Chapter;
  onChoice: (index: number) => void;
  choiceIndex: number | null;
}) {
  const chosen = choiceIndex !== null ? chapter.choices[choiceIndex] : null;
  const mood = chosen?.mood ? MOOD_LABELS[chosen.mood] : null;
  const ChapterIcon = chapter.Icon;

  return (
    <motion.div
      key={chapter.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Chapter header */}
      <div className="mb-6 flex items-start gap-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] shadow-lg"
          style={{ color: chapter.iconColor }}
        >
          <ChapterIcon className="h-6 w-6" />
        </motion.div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-[var(--pf-mono)] text-[10px] tracking-[0.2em] text-[var(--pf-text-3)]">
              CHAPTER {chapter.id}
            </span>
            <span className="font-[var(--pf-mono)] text-[10px] text-[var(--pf-warm)]">{chapter.year}</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[var(--pf-text)] sm:text-2xl">{chapter.title}</h3>
          <p className="text-sm text-[var(--pf-text-2)]">{chapter.subtitle}</p>
        </div>
      </div>

      {/* Story text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-5"
      >
        <p className="text-sm leading-relaxed text-[var(--pf-text-2)] sm:text-base">{chapter.description}</p>

        {/* Fun fact */}
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[var(--pf-warm)]/20 bg-[var(--pf-warm)]/5 p-3">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pf-warm)]" />
          <p className="text-xs leading-relaxed text-[var(--pf-text-3)] italic">{chapter.funFact}</p>
        </div>
      </motion.div>

      {/* Choices or Result */}
      <AnimatePresence mode="wait">
        {!chosen ? (
          <motion.div
            key="choices"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <p className="font-[var(--pf-mono)] text-[10px] tracking-[0.2em] text-[var(--pf-text-3)]">
              CHOOSE YOUR PATH:
            </p>
            {chapter.choices.map((choice, i) => {
              const ChoiceIcon = choice.Icon;
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    playClick();
                    onChoice(i);
                  }}
                  className="group flex w-full items-center gap-3 rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4 text-left transition-all hover:border-[var(--pf-accent)]/30 hover:bg-[var(--pf-accent)]/5"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--pf-border)] bg-[var(--pf-bg)]"
                    style={{ color: choice.iconColor }}
                  >
                    <ChoiceIcon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm text-[var(--pf-text-2)] group-hover:text-[var(--pf-text)]">
                    {choice.text}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[var(--pf-text-3)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--pf-accent)]" />
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[var(--pf-accent)]/20 bg-[var(--pf-accent)]/5 p-5"
          >
            {mood && (
              <div className="mb-3 flex items-center gap-2">
                <mood.Icon className="h-4 w-4" style={{ color: mood.color }} />
                <span
                  className="font-[var(--pf-mono)] text-[10px] tracking-wider"
                  style={{ color: mood.color }}
                >
                  {mood.label} ACTIVATED
                </span>
                {chosen.xpBonus && (
                  <span className="ml-auto rounded-full bg-[var(--pf-accent)]/10 px-2 py-0.5 font-[var(--pf-mono)] text-[10px] text-[var(--pf-accent)]">
                    +{chosen.xpBonus} BONUS XP
                  </span>
                )}
              </div>
            )}
            <p className="text-sm leading-relaxed text-[var(--pf-text-2)] sm:text-base">{chosen.result}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement badge */}
      {chosen && chapter.achievement && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="mt-5 flex items-center gap-3 rounded-xl border border-[var(--pf-warm)]/30 bg-gradient-to-r from-[var(--pf-warm)]/10 to-[var(--pf-accent)]/10 p-4"
        >
          <Trophy className="h-5 w-5 shrink-0 text-[var(--pf-warm)]" />
          <div>
            <p className="text-xs font-bold text-[var(--pf-text)]">Achievement Unlocked!</p>
            <p className="font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-3)]">
              {chapter.achievement.name} — {chapter.achievement.description}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* XP Bar                                                             */
/* ------------------------------------------------------------------ */

function XPBar({ xp, maxXp, level }: { xp: number; maxXp: number; level: number }) {
  const pct = Math.min((xp / maxXp) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-3 py-1">
        <Zap className="h-3 w-3 text-[var(--pf-warm)]" />
        <span className="font-[var(--pf-mono)] text-[10px] font-bold text-[var(--pf-warm)]">LVL {level}</span>
      </div>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[var(--pf-border)]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--pf-accent)] to-[var(--pf-warm)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-3)]">
        {xp}/{maxXp} XP
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stats Panel                                                        */
/* ------------------------------------------------------------------ */

function StatsPanel({
  choices,
  totalXp,
  achievements,
}: {
  choices: number[];
  totalXp: number;
  achievements: Achievement[];
}) {
  const moods = choices.map((c, i) => CHAPTERS[i]?.choices[c]?.mood).filter(Boolean);
  const moodCounts = moods.reduce(
    (acc, m) => {
      if (m) acc[m] = (acc[m] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface)] p-3 text-center">
        <p className="font-[var(--pf-mono)] text-lg font-bold text-[var(--pf-accent)]">{totalXp}</p>
        <p className="font-[var(--pf-mono)] text-[9px] tracking-wider text-[var(--pf-text-3)]">TOTAL XP</p>
      </div>
      <div className="rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface)] p-3 text-center">
        <p className="font-[var(--pf-mono)] text-lg font-bold text-[var(--pf-warm)]">{achievements.length}</p>
        <p className="font-[var(--pf-mono)] text-[9px] tracking-wider text-[var(--pf-text-3)]">BADGES</p>
      </div>
      <div className="rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface)] p-3 text-center">
        <p className="font-[var(--pf-mono)] text-lg font-bold text-[var(--pf-text-2)]">{choices.length}</p>
        <p className="font-[var(--pf-mono)] text-[9px] tracking-wider text-[var(--pf-text-3)]">CHAPTERS</p>
      </div>
      <div className="rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface)] p-3 text-center">
        <div className="flex justify-center">
          {dominantMood ? (
            (() => {
              const MoodIcon = MOOD_LABELS[dominantMood[0]]?.Icon;
              return MoodIcon ? (
                <MoodIcon className="h-5 w-5" style={{ color: MOOD_LABELS[dominantMood[0]].color }} />
              ) : (
                <span className="text-lg text-[var(--pf-text-2)]">-</span>
              );
            })()
          ) : (
            <span className="text-lg text-[var(--pf-text-2)]">-</span>
          )}
        </div>
        <p className="font-[var(--pf-mono)] text-[9px] tracking-wider text-[var(--pf-text-3)]">
          {dominantMood ? MOOD_LABELS[dominantMood[0]]?.label : "TBD"}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Completion Screen                                                  */
/* ------------------------------------------------------------------ */

function CompletionScreen({
  choices,
  totalXp,
  achievements,
  onRestart,
}: {
  choices: number[];
  totalXp: number;
  achievements: Achievement[];
  onRestart: () => void;
}) {
  const maxLevelXp = 100;
  const level = Math.floor(totalXp / maxLevelXp) + 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="mb-6 flex justify-center"
      >
        <div className="rounded-2xl border border-[var(--pf-accent)]/30 bg-[var(--pf-accent)]/10 p-5">
          <Gamepad2 className="h-10 w-10 text-[var(--pf-accent)]" />
        </div>
      </motion.div>

      <h3 className="mb-2 text-2xl font-bold tracking-tight text-[var(--pf-text)] sm:text-3xl">Journey Complete!</h3>
      <p className="mb-8 text-sm text-[var(--pf-text-2)]">You explored Amar&apos;s full developer journey</p>

      {/* Stats */}
      <div className="mx-auto max-w-md">
        <XPBar xp={totalXp} maxXp={maxLevelXp * level} level={level} />
      </div>

      <div className="my-6">
        <StatsPanel choices={choices} totalXp={totalXp} achievements={achievements} />
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 font-[var(--pf-mono)] text-[10px] tracking-[0.2em] text-[var(--pf-text-3)]">
            ALL ACHIEVEMENTS
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {achievements.map((a, i) => {
              const AchIcon = a.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2 rounded-full border border-[var(--pf-warm)]/20 bg-[var(--pf-warm)]/5 px-3 py-1.5"
                >
                  <AchIcon className="h-3.5 w-3.5" style={{ color: a.iconColor }} />
                  <span className="font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-2)]">{a.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Character summary */}
      <div className="mx-auto mb-8 max-w-md rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-5 text-left">
        <p className="mb-2 font-[var(--pf-mono)] text-[10px] tracking-[0.2em] text-[var(--pf-text-3)]">
          YOUR DEVELOPER PROFILE
        </p>
        <div className="space-y-2 font-[var(--pf-mono)] text-xs text-[var(--pf-text-2)]">
          <p>
            $ cat /etc/developer.conf
          </p>
          <div className="mt-2 space-y-1 rounded-lg bg-[var(--pf-bg)] p-3">
            <p>name: <span className="text-[var(--pf-accent)]">amar-lodhi</span></p>
            <p>role: <span className="text-[var(--pf-accent)]">full-stack + ai engineer</span></p>
            <p>level: <span className="text-[var(--pf-warm)]">{level}</span></p>
            <p>xp: <span className="text-[var(--pf-warm)]">{totalXp}</span></p>
            <p>badges: <span className="text-[var(--pf-accent)]">{achievements.length}/{CHAPTERS.length}</span></p>
            <p>status: <span className="text-[#22c55e]">building products</span></p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            playClick();
            onRestart();
          }}
          className="flex items-center gap-2 rounded-full border border-[var(--pf-accent)]/30 bg-[var(--pf-accent)]/10 px-6 py-2.5 font-[var(--pf-mono)] text-xs tracking-wider text-[var(--pf-accent)] transition-colors hover:bg-[var(--pf-accent)]/20"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          PLAY AGAIN
        </motion.button>
        <motion.a
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          href="#contact"
          className="flex items-center gap-2 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-6 py-2.5 font-[var(--pf-mono)] text-xs tracking-wider text-[var(--pf-text-3)] transition-colors hover:border-[var(--pf-accent)]/30 hover:text-[var(--pf-accent)]"
        >
          SAY HELLO <Sparkles className="h-3 w-3" />
        </motion.a>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Main JourneyGame component                                         */
/* ------------------------------------------------------------------ */

export function JourneyGame() {
  const [started, setStarted] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [choices, setChoices] = useState<number[]>([]);
  const [visitedChapters, setVisitedChapters] = useState<Set<number>>(new Set([1]));
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [completed, setCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const chapter = CHAPTERS[currentChapter - 1];
  const choiceIndex = choices[currentChapter - 1] ?? null;
  const maxLevelXp = 100;
  const level = Math.floor(totalXp / maxLevelXp) + 1;

  const handleChoice = useCallback(
    (index: number) => {
      const newChoices = [...choices];
      newChoices[currentChapter - 1] = index;
      setChoices(newChoices);

      const ch = CHAPTERS[currentChapter - 1];
      const choice = ch.choices[index];
      const xpGain = ch.xpReward + (choice.xpBonus || 0);
      setTotalXp((prev) => prev + xpGain);

      if (ch.achievement && !achievements.find((a) => a.name === ch.achievement!.name)) {
        setAchievements((prev) => [...prev, ch.achievement!]);
        if (soundOn) playAchievement();
      } else {
        if (soundOn) playSuccess();
      }
    },
    [choices, currentChapter, achievements, soundOn]
  );

  const handleNext = useCallback(() => {
    if (currentChapter < CHAPTERS.length) {
      const next = currentChapter + 1;
      setCurrentChapter(next);
      setVisitedChapters((prev) => new Set([...prev, next]));
      if (soundOn) playClick();
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setCompleted(true);
      if (soundOn) playSuccess();
    }
  }, [currentChapter, soundOn]);

  const handleRestart = useCallback(() => {
    setStarted(false);
    setCurrentChapter(1);
    setChoices([]);
    setVisitedChapters(new Set([1]));
    setAchievements([]);
    setTotalXp(0);
    setCompleted(false);
  }, []);

  const isChoiceMade = choiceIndex !== null;
  const isLastChapter = currentChapter === CHAPTERS.length;

  return (
    <section className="relative border-t border-[var(--pf-border)]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-12" ref={containerRef}>
        {/* Section header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="font-[var(--pf-mono)] text-[10px] tracking-[0.25em] text-[var(--pf-text-3)]">
              06 / PLAY
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--pf-text)] sm:text-3xl">
              The Journey Game
            </h2>
            <p className="mt-2 max-w-md text-sm text-[var(--pf-text-2)]">
              Explore my developer journey through choices, achievements, and fun moments.
              Every path tells a story.
            </p>
          </div>
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="hidden rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface)] p-2 text-[var(--pf-text-3)] transition-colors hover:text-[var(--pf-accent)] sm:block"
            aria-label={soundOn ? "Mute sound effects" : "Enable sound effects"}
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>

        {/* Game container */}
        <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)]/50 p-4 shadow-2xl sm:p-8">
          {!started ? (
            /* Start screen */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center sm:py-12"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mb-6 flex justify-center"
              >
                <div className="rounded-2xl border border-[var(--pf-accent)]/20 bg-[var(--pf-accent)]/10 p-5">
                  <Gamepad2 className="h-10 w-10 text-[var(--pf-accent)] sm:h-12 sm:w-12" />
                </div>
              </motion.div>
              <h3 className="mb-2 text-xl font-bold tracking-tight text-[var(--pf-text)] sm:text-2xl">
                Developer Quest: Amar&apos;s Journey
              </h3>
              <p className="mx-auto mb-2 max-w-sm text-sm text-[var(--pf-text-2)]">
                A mini-game about my path from first &quot;Hello, World!&quot; to building real products.
              </p>
              <p className="mx-auto mb-8 max-w-sm text-xs text-[var(--pf-text-3)]">
                Make choices. Earn XP. Unlock achievements. Discover the story.
              </p>

              {/* XP preview */}
              <div className="mx-auto mb-8 max-w-xs">
                <XPBar xp={0} maxXp={maxLevelXp} level={1} />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playClick();
                  setStarted(true);
                  window.dispatchEvent(new CustomEvent("game-started"));
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--pf-accent)] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--pf-accent)]/20 transition-colors hover:bg-[var(--pf-accent)]/90"
              >
                <Play className="h-4 w-4" />
                START JOURNEY
              </motion.button>

              {/* Controls hint */}
              <div className="mt-8 flex items-center justify-center gap-4 text-[var(--pf-text-3)]">
                <span className="flex items-center gap-1 font-[var(--pf-mono)] text-[9px]">
                  <Target className="h-3 w-3" /> CHOOSE PATHS
                </span>
                <span className="flex items-center gap-1 font-[var(--pf-mono)] text-[9px]">
                  <Trophy className="h-3 w-3" /> EARN BADGES
                </span>
                <span className="flex items-center gap-1 font-[var(--pf-mono)] text-[9px]">
                  <Map className="h-3 w-3" /> EXPLORE
                </span>
              </div>
            </motion.div>
          ) : completed ? (
            /* Completion screen */
            <CompletionScreen
              choices={choices}
              totalXp={totalXp}
              achievements={achievements}
              onRestart={handleRestart}
            />
          ) : (
            /* Game play */
            <div>
              {/* Progress bar */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <XPBar xp={totalXp} maxXp={maxLevelXp * level} level={level} />
                </div>
                <AdventureMap
                  currentChapter={currentChapter}
                  totalChapters={CHAPTERS.length}
                  visitedChapters={visitedChapters}
                />
              </div>

              {/* Chapter content */}
              <ChapterCard chapter={chapter} onChoice={handleChoice} choiceIndex={choiceIndex} />

              {/* Next button */}
              <AnimatePresence>
                {isChoiceMade && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex justify-end"
                  >
                    <motion.button
                      whileHover={{ scale: 1.03, x: 3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                      className="flex items-center gap-2 rounded-full bg-[var(--pf-accent)] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[var(--pf-accent)]/20 transition-colors hover:bg-[var(--pf-accent)]/90"
                    >
                      {isLastChapter ? "VIEW RESULTS" : "NEXT CHAPTER"}
                      {isLastChapter ? <Trophy className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
