"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Command definitions                                                */
/* ------------------------------------------------------------------ */

const COMMANDS: Record<string, () => string[]> = {
  help: () => [
    "Available commands:",
    "",
    "  whoami      About me",
    "  role        My current role",
    "  location    Where I'm based",
    "  skills      Tech stack",
    "  experience  Work history",
    "  projects    Things I've built",
    "  contact     How to reach me",
    "  education   Academic background",
    "  hobbies     What I do outside code",
    "  github      GitHub profile",
    "  clear       Clear terminal",
    "",
    "Type a command and press Enter...",
  ],
  whoami: () => [
    "amar-lodhi",
    "",
    "Software Engineer who builds products",
    "that solve real problems. I don't just",
    "write code — I ship things people use.",
  ],
  role: () => [
    "Software Engineer @ Jobaaj",
    "",
    "Full Stack Development",
    "AI / GenAI Integration",
    "Product Development",
    "Building VizoTool",
  ],
  location: () => [
    "Mathura, India",
    "IST (UTC +5:30)",
    "",
    "Open to remote opportunities",
    "worldwide.",
  ],
  skills: () => [
    "FRONTEND   React, Next.js, TypeScript, Tailwind",
    "BACKEND    Node.js, Express, REST APIs, PHP",
    "DATABASE   MongoDB, MySQL, Supabase",
    "AI/LLM     Gemini, OpenAI, RAG, Embeddings",
    "TOOLS      Git, Linux, Docker, CI/CD",
    "",
    "Proficiency: ████████████████████░░ 92%",
  ],
  experience: () => [
    "CURRENT",
    "  Software Engineer @ Jobaaj (Feb 2026 - Present)",
    "  - Full-stack development",
    "  - AI-powered interview systems",
    "  - Payment/credit systems",
    "",
    "PREVIOUS",
    "  Intern @ Arema Technology (Oct 2025 - Feb 2026)",
    "  - Client projects & production apps",
    "  - Legacy codebase modernization",
    "  - API integrations",
  ],
  projects: () => [
    "01  VizoTool",
    "     20+ web utilities — image, PDF,",
    "     developer, SEO tools. Live at",
    "     vizotool.com",
    "",
    "02  AI Mock Interview",
    "     Adaptive AI interview engine with",
    "     real-time speech, resume parsing,",
    "     and AI-generated feedback.",
    "",
    "03  Terminal AI Agent",
    "     AI-assisted coding terminal that",
    "     understands project context.",
  ],
  contact: () => [
    "Email    amarrajputdev@gmail.com",
    "GitHub   github.com/amarRajputDev",
    "LinkedIn linkedin.com/in/amarlodhi",
    "",
    "Available for:",
    "  - Software Engineering roles",
    "  - Full Stack Development",
    "  - AI / GenAI projects",
    "  - Product Development",
  ],
  education: () => [
    "BCA (Bachelor of Computer Applications)",
    "",
    "Focus: Software Engineering,",
    "Data Structures, Algorithms",
    "Web Development",
  ],
  hobbies: () => [
    "Building side projects (obviously)",
    "Exploring new AI/LLM capabilities",
    "Open source contributions",
    "Gaming (PUBG, obviously)",
    "Listening to lo-fi while coding",
    "Breaking things and figuring out why",
  ],
  github: () => [
    "github.com/amarRajputDev",
    "",
    "Public repos: VizoTool, AI tools,",
    "open source contributions.",
    "",
    "Check it out — the code speaks",
    "for itself.",
  ],
  clear: () => ["__CLEAR__"],
  sudo: () => ["Nice try, but you're not root here ;)"],
  ls: () => [
    "portfolio/",
    "├── about.md",
    "├── skills.json",
    "├── experience.log",
    "├── projects/",
    "│   ├── vizotool/",
    "│   ├── ai-interview/",
    "│   └── terminal-agent/",
    "└── contact.yaml",
  ],
  date: () => [new Date().toString()],
};

/* ------------------------------------------------------------------ */
/* HeroTerminal component                                             */
/* ------------------------------------------------------------------ */

interface HistoryEntry {
  type: "cmd" | "output";
  text: string;
}

export function HeroTerminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [bootLine, setBootLine] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const BOOT_LINES = [
    { text: "Initializing portfolio...", delay: 300 },
    { text: "Loading amar-lodhi profile...", delay: 600 },
    { text: "Connecting to skills database...", delay: 400 },
    { text: "Ready.", delay: 300 },
  ];

  const WELCOME_LINES: HistoryEntry[] = [
    { type: "output", text: "" },
    { type: "output", text: "Welcome! I'm Amar Lodhi — Software Engineer." },
    { type: "output", text: "Type commands to explore my profile:" },
    { type: "output", text: "" },
    { type: "output", text: "  whoami      About me" },
    { type: "output", text: "  skills      Tech stack" },
    { type: "output", text: "  experience  Work history" },
    { type: "output", text: "  projects    Things I've built" },
    { type: "output", text: "  contact     How to reach me" },
    { type: "output", text: "  help        All commands" },
    { type: "output", text: "" },
  ];

  // Boot sequence
  useEffect(() => {
    if (booted) return;
    let timeout: ReturnType<typeof setTimeout>;

    const runBoot = (lineIndex: number) => {
      if (lineIndex >= BOOT_LINES.length) {
        setHistory(WELCOME_LINES);
        setBooted(true);
        return;
      }
      setBootLine(lineIndex);
      timeout = setTimeout(() => runBoot(lineIndex + 1), BOOT_LINES[lineIndex].delay);
    };

    timeout = setTimeout(() => runBoot(0), 500);
    return () => clearTimeout(timeout);
  }, [booted]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, booted]);

  const execute = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      const newHistory: HistoryEntry[] = [...history, { type: "cmd", text: cmd }];

      if (!trimmed) {
        setHistory(newHistory);
        return;
      }

      if (trimmed === "clear") {
        setHistory([]);
        return;
      }

      const handler = COMMANDS[trimmed];
      if (handler) {
        const output = handler();
        const outputLines = output.map((t) => ({ type: "output" as const, text: t }));
        setHistory([...newHistory, ...outputLines]);
      } else {
        setHistory([
          ...newHistory,
          { type: "output", text: `bash: ${trimmed}: command not found` },
          { type: "output", text: "Type 'help' for available commands." },
        ]);
      }
    },
    [history]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      execute(input);
      setInput("");
    }
  };

  const focusInput = () => hiddenInputRef.current?.focus();

  return (
    <div
      className="overflow-hidden rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] shadow-2xl shadow-black/40"
      onClick={focusInput}
    >
      {/* Title bar — macOS style */}
      <div className="flex items-center gap-2 border-b border-[var(--pf-border)] bg-[var(--pf-surface)] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-3 flex items-center gap-2 text-[var(--pf-text-3)]">
          <Terminal className="h-3.5 w-3.5" />
          <span className="font-[var(--pf-mono)] text-[11px]">amar@portfolio ~ %</span>
        </div>
      </div>

      {/* Body */}
      <div
        ref={scrollRef}
        className="max-h-[380px] min-h-[340px] overflow-y-auto p-4 font-[var(--pf-mono)] text-[13px] leading-relaxed"
      >
        {/* Boot sequence */}
        {!booted && (
          <div className="space-y-1">
            {BOOT_LINES.slice(0, bootLine + 1).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <span className="text-[var(--pf-accent)]">
                  {i < bootLine ? "✓" : "▸"}
                </span>
                <span className="text-[var(--pf-text-2)]">{line.text}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Command history */}
        {booted && history.map((entry, i) => (
          <div key={i}>
            {entry.type === "cmd" ? (
              <div className="flex gap-2">
                <span className="select-none text-[var(--pf-accent)]">❯</span>
                <span className="text-[var(--pf-text)]">{entry.text}</span>
              </div>
            ) : (
              <span className="whitespace-pre text-[var(--pf-text-2)]">{entry.text}</span>
            )}
          </div>
        ))}

        {/* Input line — terminal-style thick block cursor */}
        {booted && (
          <div className="mt-1 flex items-center" onClick={focusInput}>
            <span className="select-none text-[var(--pf-accent)]">❯ </span>
            <span className="relative flex-1">
              {/* Visible rendered text + block cursor */}
              <span className="text-[var(--pf-text)]">{input}</span>
              <span
                className="inline-block h-[1.1em] w-[0.55em] align-middle bg-[var(--pf-accent)] ml-px"
                style={{ animation: "pf-cursor-blink 1s step-end infinite" }}
              />
              {/* Hidden native input for keyboard capture */}
              <input
                ref={hiddenInputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoFocus
                spellCheck={false}
                className="absolute inset-0 h-full w-full cursor-text bg-transparent opacity-0 outline-none"
                aria-label="Terminal input"
              />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
