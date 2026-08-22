"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Theme-adaptive syntax colors — uses CSS variables                   */
/* ------------------------------------------------------------------ */

const C = {
  // Terminal UI — theme-adaptive
  promptUser: "var(--pf-accent)",
  promptSymbol: "var(--pf-accent)",
  command: "var(--pf-text)",

  // Syntax highlighting — theme-adaptive
  keyword: "var(--pf-accent)",
  string: "var(--pf-warm)",
  function: "var(--pf-accent)",
  success: "#22c55e",
  info: "var(--pf-text-2)",
  comment: "var(--pf-text-3)",
  warning: "var(--pf-warm)",
  error: "#ef4444",
  text: "var(--pf-text)",
  dim: "var(--pf-text-3)",
};

/* ------------------------------------------------------------------ */
/* Command definitions                                                */
/* ------------------------------------------------------------------ */

interface OutputLine {
  text: string;
  color: string;
}

const COMMANDS: Record<string, () => OutputLine[]> = {
  help: () => [
    { text: "Available commands:", color: C.keyword },
    { text: "", color: C.dim },
    { text: "  whoami      About me", color: C.text },
    { text: "  role        My current role", color: C.text },
    { text: "  location    Where I'm based", color: C.text },
    { text: "  skills      Tech stack", color: C.text },
    { text: "  experience  Work history", color: C.text },
    { text: "  projects    Things I've built", color: C.text },
    { text: "  contact     How to reach me", color: C.text },
    { text: "  education   Academic background", color: C.text },
    { text: "  hobbies     What I do outside code", color: C.text },
    { text: "  github      GitHub profile", color: C.text },
    { text: "  clear       Clear terminal", color: C.text },
    { text: "", color: C.dim },
    { text: "// Type a command and press Enter", color: C.comment },
  ],

  whoami: () => [
    { text: "amar-lodhi", color: C.string },
    { text: "", color: C.dim },
    { text: "Software Engineer who builds products", color: C.text },
    { text: "that solve real problems.", color: C.text },
    { text: "// I don't just write code — I ship things.", color: C.comment },
  ],

  role: () => [
    { text: "Software Engineer", color: C.string },
    { text: "@", color: C.dim },
    { text: "Jobaaj", color: C.keyword },
    { text: "", color: C.dim },
    { text: "  Full Stack Development", color: C.text },
    { text: "  AI / GenAI Integration", color: C.text },
    { text: "  Product Development", color: C.text },
    { text: "  Building VizoTool", color: C.string },
  ],

  location: () => [
    { text: "Mathura, India", color: C.text },
    { text: "IST (UTC +5:30)", color: C.info },
    { text: "", color: C.dim },
    { text: "// Open to remote opportunities worldwide", color: C.comment },
  ],

  skills: () => [
    { text: "FRONTEND", color: C.keyword },
    { text: "  React, Next.js, TypeScript, Tailwind", color: C.text },
    { text: "BACKEND ", color: C.keyword },
    { text: "  Node.js, Express, REST APIs, PHP", color: C.text },
    { text: "DATABASE", color: C.keyword },
    { text: "  MongoDB, MySQL, Supabase", color: C.text },
    { text: "AI/LLM  ", color: C.keyword },
    { text: "  Gemini, OpenAI, RAG, Embeddings", color: C.text },
    { text: "TOOLS   ", color: C.keyword },
    { text: "  Git, Linux, Docker, CI/CD", color: C.text },
    { text: "", color: C.dim },
    { text: "proficiency: ", color: C.dim },
    { text: "████████████████████░░ 92%", color: C.success },
  ],

  experience: () => [
    { text: "// CURRENT", color: C.comment },
    { text: "Software Engineer", color: C.string },
    { text: "@", color: C.dim },
    { text: "Jobaaj", color: C.keyword },
    { text: "(Feb 2026 - Present)", color: C.info },
    { text: "  • Full-stack development", color: C.dim },
    { text: "  • AI-powered interview systems", color: C.dim },
    { text: "  • Payment/credit systems", color: C.dim },
    { text: "", color: C.dim },
    { text: "// PREVIOUS", color: C.comment },
    { text: "Intern", color: C.string },
    { text: "@", color: C.dim },
    { text: "Arema Technology", color: C.keyword },
    { text: "(Oct 2025 - Feb 2026)", color: C.info },
    { text: "  • Client projects & production apps", color: C.dim },
    { text: "  • Legacy codebase modernization", color: C.dim },
  ],

  projects: () => [
    { text: "01", color: C.keyword },
    { text: "VizoTool", color: C.string },
    { text: "    20+ web utilities — image, PDF,", color: C.dim },
    { text: "    developer, SEO tools. vizotool.com", color: C.text },
    { text: "", color: C.dim },
    { text: "02", color: C.keyword },
    { text: "AI Mock Interview", color: C.string },
    { text: "    Adaptive AI engine with real-time", color: C.dim },
    { text: "    speech, resume parsing, AI feedback.", color: C.text },
    { text: "", color: C.dim },
    { text: "03", color: C.keyword },
    { text: "Terminal AI Agent", color: C.string },
    { text: "    AI-assisted coding terminal that", color: C.dim },
    { text: "    understands project context.", color: C.text },
  ],

  contact: () => [
    { text: "email", color: C.keyword },
    { text: "  amarrajputdev@gmail.com", color: C.text },
    { text: "github", color: C.keyword },
    { text: "  github.com/amarRajputDev", color: C.text },
    { text: "linkedin", color: C.keyword },
    { text: "  linkedin.com/in/amarlodhi", color: C.text },
    { text: "", color: C.dim },
    { text: "// Available for:", color: C.comment },
    { text: "  • Software Engineering roles", color: C.string },
    { text: "  • Full Stack Development", color: C.string },
    { text: "  • AI / GenAI projects", color: C.string },
    { text: "  • Product Development", color: C.string },
  ],

  education: () => [
    { text: "BCA", color: C.string },
    { text: "(Bachelor of Computer Applications)", color: C.text },
    { text: "", color: C.dim },
    { text: "// Focus:", color: C.comment },
    { text: "Software Engineering,", color: C.text },
    { text: "Data Structures, Algorithms", color: C.text },
    { text: "Web Development", color: C.text },
  ],

  hobbies: () => [
    { text: "building", color: C.function },
    { text: "side projects (obviously)", color: C.text },
    { text: "exploring", color: C.function },
    { text: "new AI/LLM capabilities", color: C.text },
    { text: "contributing", color: C.function },
    { text: "to open source", color: C.text },
    { text: "gaming", color: C.function },
    { text: "(PUBG, obviously)", color: C.text },
    { text: "listening", color: C.function },
    { text: "to lo-fi while coding", color: C.text },
  ],

  github: () => [
    { text: "github.com/amarRajputDev", color: C.text },
    { text: "", color: C.dim },
    { text: "// Public repos:", color: C.comment },
    { text: "VizoTool,", color: C.string },
    { text: "AI tools,", color: C.string },
    { text: "open source contributions.", color: C.string },
    { text: "", color: C.dim },
    { text: "// The code speaks for itself.", color: C.comment },
  ],

  clear: () => [{ text: "__CLEAR__", color: C.dim }],

  sudo: () => [
    { text: "[!] Nice try, but you're not root here ;)", color: C.error },
  ],

  ls: () => [
    { text: "portfolio/", color: C.keyword },
    { text: "├── about.md", color: C.text },
    { text: "├── skills.json", color: C.text },
    { text: "├── experience.log", color: C.text },
    { text: "├── projects/", color: C.keyword },
    { text: "│   ├── vizotool/", color: C.string },
    { text: "│   ├── ai-interview/", color: C.string },
    { text: "│   └── terminal-agent/", color: C.string },
    { text: "└── contact.yaml", color: C.text },
  ],

  date: () => [
    { text: new Date().toString(), color: C.text },
  ],
};

/* ------------------------------------------------------------------ */
/* HeroTerminal component                                             */
/* ------------------------------------------------------------------ */

interface HistoryEntry {
  type: "cmd" | "output";
  text: string;
  color: string;
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
    { type: "output", text: "", color: C.dim },
    { type: "output", text: "Welcome! I'm Amar Lodhi.", color: C.string },
    { type: "output", text: "Type commands to explore my profile:", color: C.text },
    { type: "output", text: "", color: C.dim },
    { type: "output", text: "  whoami      About me", color: C.text },
    { type: "output", text: "  skills      Tech stack", color: C.text },
    { type: "output", text: "  experience  Work history", color: C.text },
    { type: "output", text: "  projects    Things I've built", color: C.text },
    { type: "output", text: "  contact     How to reach me", color: C.text },
    { type: "output", text: "  help        All commands", color: C.text },
    { type: "output", text: "", color: C.dim },
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
      const newHistory: HistoryEntry[] = [
        ...history,
        { type: "cmd", text: cmd, color: C.command },
      ];

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
        const outputLines = output.map((t) => ({
          type: "output" as const,
          text: t.text,
          color: t.color,
        }));
        setHistory([...newHistory, ...outputLines]);
      } else {
        setHistory([
          ...newHistory,
          { type: "output", text: `bash: ${trimmed}: command not found`, color: C.error },
          { type: "output", text: "Type 'help' for available commands.", color: C.dim },
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
      className="overflow-hidden rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] shadow-2xl shadow-black/10"
      onClick={focusInput}
    >
      {/* Title bar — macOS style */}
      <div className="flex items-center gap-2 border-b border-[var(--pf-border)] bg-[var(--pf-bg)] px-4 py-2.5">
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
        className="max-h-[380px] min-h-[340px] overflow-y-auto bg-[var(--pf-surface)] p-4 font-[var(--pf-mono)] text-[13px] leading-relaxed"
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
                <span style={{ color: i < bootLine ? C.success : C.keyword }}>
                  {i < bootLine ? "✓" : "▸"}
                </span>
                <span style={{ color: C.text }}>{line.text}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Command history — syntax-highlighted output */}
        {booted && history.map((entry, i) => (
          <div key={i}>
            {entry.type === "cmd" ? (
              <div className="flex">
                <span className="select-none" style={{ color: C.promptUser }}>amar</span>
                <span className="select-none" style={{ color: C.dim }}>@</span>
                <span className="select-none" style={{ color: C.promptUser }}>portfolio</span>
                <span className="select-none" style={{ color: C.dim }}>:</span>
                <span className="select-none" style={{ color: C.promptSymbol }}>~</span>
                <span className="select-none" style={{ color: C.promptSymbol }}>$ </span>
                <span style={{ color: C.command }}>{entry.text}</span>
              </div>
            ) : (
              <span className="whitespace-pre" style={{ color: entry.color }}>{entry.text}</span>
            )}
          </div>
        ))}

        {/* Input line — terminal-style thick block cursor */}
        {booted && (
          <div className="mt-1 flex items-center" onClick={focusInput}>
            <span className="select-none" style={{ color: C.promptUser }}>amar</span>
            <span className="select-none" style={{ color: C.dim }}>@</span>
            <span className="select-none" style={{ color: C.promptUser }}>portfolio</span>
            <span className="select-none" style={{ color: C.dim }}>:</span>
            <span className="select-none" style={{ color: C.promptSymbol }}>~</span>
            <span className="select-none" style={{ color: C.promptSymbol }}>$ </span>
            <span className="relative flex-1">
              <span style={{ color: C.command }}>{input}</span>
              <span
                className="inline-block h-[1.1em] w-[0.55em] align-middle ml-px"
                style={{ backgroundColor: "var(--pf-text)", animation: "pf-cursor-blink 1s step-end infinite" }}
              />
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
