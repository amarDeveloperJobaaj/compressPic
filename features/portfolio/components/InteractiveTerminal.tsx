"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ChevronRight, Sparkles, Ghost } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Command definitions                                                */
/* ------------------------------------------------------------------ */

const ASCII_LOGO = `
 ███╗   ██╗ ██████╗ ██╗   ██╗███████╗██╗  ██╗
 ████╗  ██║██╔═══██╗██║   ██║██╔════╝╚██╗██╔╝
 ██╔██╗ ██║██║   ██║██║   ██║█████╗   ╚███╔╝
 ██║╚██╗██║██║   ██║██║   ██║██╔══╝   ██╔██╗
 ██║ ╚████║╚██████╔╝╚██████╔╝███████╗██╔╝ ██╗
 ╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝`;

const COMMANDS: Record<string, () => string[]> = {
  help: () => [
    "╔══════════════════════════════════════════════════╗",
    "║           AVAILABLE COMMANDS                     ║",
    "╠══════════════════════════════════════════════════╣",
    "║ whoami    - Discover who I am                    ║",
    "║ joke      - Developer joke of the day            ║",
    "║ skills    - My tech superpowers                  ║",
    "║ fortune   - Random dev fortune                   ║",
    "║ matrix    - Enter the matrix                     ║",
    "║ coffee    - Fuel status                          ║",
    "║ hack      - Simulate a hack (fake!)              ║",
    "║ ls        - List cool things                     ║",
    "║ date      - Current timestamp                    ║",
    "║ theme     - Toggle light/dark                    ║",
    "║ ascii     - Show ASCII art                       ║",
    "║ quote     - Inspirational dev quote              ║",
    "║ vim       - Try to exit vim                      ║",
    "║ sudo      - Try it... dare you                   ║",
    "║ history   - Command history                      ║",
    "║ clear     - Clear the terminal                   ║",
    "║ easter    - *                                     ║",
    "╚══════════════════════════════════════════════════╝",
  ],
  whoami: () => [
    "amar-lodhi",
    "role: software-engineer",
    "location: Mathura, India",
    "status: shipping products",
    "vibe: building cool stuff",
  ],
  joke: () => {
    const jokes = [
      ["Why do programmers prefer dark mode?", "Because light attracts bugs."],
      ["Why was the JavaScript developer sad?", "Because he didn't Node how to Express himself."],
      ["A SQL query walks into a bar...", "It walks up to two tables and asks: 'Can I join you?'"],
      ["Why do Java developers wear glasses?", "Because they can't C#."],
      ["What's a programmer's favorite hangout place?", "Foo Bar."],
      ["Why do programmers hate nature?", "It has too many bugs and no debugging tools."],
      ["How many programmers does it take to change a light bulb?", "None -- that's a hardware problem."],
      ["Why did the developer go broke?", "Because he used up all his cache."],
      ["What do you call a group of 8 hobbits?", "A hobbyte."],
      ["Why was the React developer so calm?", "Because he knew how to handle his state."],
    ];
    const [q, a] = jokes[Math.floor(Math.random() * jokes.length)];
    return [q, a, "", "...I'll be here all week."];
  },
  skills: () => [
    "[FE]  FRONTEND  -> React, Next.js, TypeScript, Tailwind",
    "[BE]  BACKEND   -> Node.js, Express, REST APIs, PHP",
    "[DB]  DATABASE  -> MongoDB, MySQL, Supabase",
    "[AI]  AI/LLM    -> Gemini, OpenAI, RAG, Embeddings",
    "[TL]  TOOLS     -> Git, Linux, Docker basics",
    "",
    "proficiency: ████████████████████░░ 92%",
    "current streak: 365 days of coding",
  ],
  fortune: () => {
    const fortunes = [
      "A great PR shall be merged before lunch.",
      "The bug you seek is in the last console.log you deleted.",
      "Your code will compile on the first try today. Just kidding.",
      "A mysterious merge conflict awaits you on Monday.",
      "Today is a good day to refactor something.",
      "The best error message is the one that never shows up.",
      "You will receive a LGTM within the hour.",
      "Your next side project will go viral. Trust the process.",
      "The deploy will be smooth. Nothing will break. Believe.",
    ];
    return [">> " + fortunes[Math.floor(Math.random() * fortunes.length)]];
  },
  matrix: () => [
    "Wake up, Neo...",
    "The Matrix has you...",
    "Follow the white rabbit.",
    "",
    "01001000 01100101 01101100 01101100 01101111",
    "01010111 01101111 01110010 01101100 01100100",
    "",
    "...just kidding, this is a portfolio, not a movie.",
  ],
  coffee: () => [
    "FUEL STATUS:",
    "",
    "morning:              ████████████████░░ 85%",
    "afternoon:            ████████████░░░░░░ 60%",
    "after coding session: ██░░░░░░░░░░░░░░░░ 10%",
    "debugging at 3am:     ░░░░░░░░░░░░░░░░░░  0%",
    "",
    "Status: Refill recommended. Where's my espresso machine?",
  ],
  hack: () => [
    "[!] INITIATING HACK SEQUENCE...",
    "",
    "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░ 75%",
    "",
    "accessing mainframe...",
    "bypassing firewall...",
    "downloading more RAM... done!",
    "mining crypto... just kidding, that's illegal",
    "",
    "[OK] HACK COMPLETE!",
    "...it was a prank. Nothing happened.",
  ],
  ls: () => [
    "/portfolio/",
    "+-- brain.js          (still loading...)",
    "+-- coffee.config      (always empty)",
    "+-- motivation.md     (rewriting daily)",
    "+-- bugs/             (404: can't find, they find you)",
    "+-- ideas.txt         (999 lines, 0 shipped)",
    "+-- sleep.log         (last entry: 2019)",
    "+-- gaming-saves/     (PUBG, obviously)",
    "+-- screenshots/      (10k+ and counting)",
  ],
  date: () => [new Date().toString()],
  theme: () => {
    const root = document.querySelector(".portfolio-root");
    if (root) {
      root.classList.toggle("portfolio-light");
      root.classList.toggle("portfolio-dark");
    }
    return ["Theme toggled! Did you see the change?"];
  },
  ascii: () => ASCII_LOGO.split("\n"),
  quote: () => {
    const quotes = [
      '"First, solve the problem. Then, write the code." -- John Johnson',
      '"Any fool can write code that a computer can understand." -- Martin Fowler',
      '"Talk is cheap. Show me the code." -- Linus Torvalds',
      '"Programs must be written for people to read." -- Harold Abelson',
      '"The best code is no code at all." -- Jeff Atwood',
      '"Simplicity is the soul of efficiency." -- Austin Freeman',
      '"Code is like humor. When you have to explain it, it\'s bad." -- Cory House',
    ];
    return [">> " + quotes[Math.floor(Math.random() * quotes.length)]];
  },
  vim: () => [
    "Opening vim...",
    "",
    "Oh no. You're stuck now.",
    "Press i to enter insert mode... just kidding, there's no vim here.",
    "Type :q! to quit... wait, this isn't vim either.",
    "",
    "  Escape -> back to reality. You're welcome.",
  ],
  sudo: () => [
    "[!] Nice try, but you're not root here.",
    "",
    "sudo: This incident will be reported.",
    "sudo: to /dev/null, because nobody reads logs anyway.",
    "",
    "[!] Unauthorized access attempt logged at " + new Date().toISOString(),
  ],
  history: () => [
    "COMMAND HISTORY:",
    "  1  npm install motivation",
    "  2  git commit -m 'fixed everything'",
    "  3  git push --force (oops)",
    "  4  rm -rf node_modules && npm install",
    "  5  console.log('why is this not working')",
    "  6  git blame (it was me all along)",
    "  7  npm run build (pray)",
    "  8  curl https://api.coffee/v1/order",
  ],
  clear: () => ["__CLEAR__"],
  easter: () => [
    "* You found an easter egg!",
    "",
    "Try the Konami Code on this page:",
    "  UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A",
    "",
    "There's also a secret command: 'matrix'",
    "And another: 'vim' (don't worry, you won't get stuck)",
  ],
};

const funPrompts: string[] = [];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export function InteractiveTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ type: "cmd" | "output"; text: string }[]>([
    { type: "output", text: "Welcome to Amar's Interactive Terminal!" },
    { type: "output", text: "Type 'help' to see available commands." },
    { type: "output", text: "" },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const execute = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newHistory = [...history, { type: "cmd" as const, text: cmd }];

    if (!trimmed) {
      setHistory(newHistory);
      return;
    }

    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

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
        { type: "output", text: "Type 'help' to see available commands." },
      ]);
    }
  }, [history]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      execute(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIdx = historyIdx < cmdHistory.length - 1 ? historyIdx + 1 : historyIdx;
        setHistoryIdx(newIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const newIdx = historyIdx - 1;
        setHistoryIdx(newIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
      } else {
        setHistoryIdx(-1);
        setInput("");
      }
    }
  };

  return (
    <section id="terminal" className="relative border-t border-[var(--pf-border)] bg-[var(--pf-bg)]">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
        {/* Header */}
        <div className="mb-12">
          <span className="font-[var(--pf-mono)] text-[10px] tracking-[0.25em] text-[var(--pf-text-3)]">INTERACT</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--pf-text)] sm:text-3xl">Interactive Terminal</h2>
          <p className="mt-3 max-w-lg text-[var(--pf-text-2)]">Type commands and have some fun. Try <code className="rounded bg-[var(--pf-surface)] px-1.5 py-0.5 font-[var(--pf-mono)] text-[var(--pf-accent)]">help</code> to start.</p>
        </div>

        {/* Terminal */}
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] shadow-2xl shadow-black/20">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-[var(--pf-border)] bg-[var(--pf-surface)] px-4 py-3">
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
            onClick={() => inputRef.current?.focus()}
            className="max-h-[400px] overflow-y-auto p-4 font-[var(--pf-mono)] text-sm leading-relaxed"
          >
            {history.map((entry, i) => (
              <div key={i} className={entry.type === "cmd" ? "text-[var(--pf-text)]" : "text-[var(--pf-text-2)]"}>
                {entry.type === "cmd" ? (
                  <span>
                    <span className="text-[var(--pf-accent)]">&gt; </span>
                    {entry.text}
                  </span>
                ) : (
                  <span className="whitespace-pre">{entry.text}</span>
                )}
              </div>
            ))}

            {/* Input line */}
            <div className="mt-1 flex items-center">
              <span className="text-[var(--pf-accent)]">&gt; </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoFocus
                spellCheck={false}
                className="flex-1 bg-transparent text-[var(--pf-text)] outline-none placeholder:text-[var(--pf-text-3)]"
                placeholder="type a command..."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
