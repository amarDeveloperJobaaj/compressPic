"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Clipboard,
  Image as ImageIcon,
  Mail,
  Sparkles,
} from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Copy button + code block                                            */
/* ------------------------------------------------------------------ */

export function CopyButton({
  text,
  className,
  label,
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-primary/40 hover:text-primary",
        copied && "border-success/50 text-success",
        className
      )}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
      {copied ? "Copied" : (label ?? "Copy")}
    </button>
  );
}

export function CodeBlock({
  code,
  language,
  terminal = false,
}: {
  code: string;
  language?: string;
  terminal?: boolean;
}) {
  return (
    <div className="group/code my-6 overflow-hidden rounded-xl border border-border bg-[#0B1120] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </span>
          {terminal ? (
            <span className="ml-2 text-xs font-medium text-slate-400">Terminal</span>
          ) : (
            <span className="ml-2 text-xs font-medium uppercase tracking-wider text-slate-400">
              {language ?? "code"}
            </span>
          )}
        </div>
        <CopyButton text={code} className="border-white/10 bg-white/5 text-slate-300 hover:text-white" />
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-slate-200">
        {terminal ? (
          <code>
            {code.split("\n").map((line, i) => (
              <span key={i} className="block">
                <span className="mr-3 select-none text-emerald-400">$</span>
                {line || " "}
              </span>
            ))}
          </code>
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Accordion / FAQ                                                     */
/* ------------------------------------------------------------------ */

export function Accordion({
  items,
  icon = ChevronDown,
}: {
  items: { title: string; text: string }[];
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const Icon = icon;
  return (
    <div className="my-6 space-y-2.5">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-surface transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-text-primary transition-colors hover:bg-primary-light/40"
            >
              <span>{item.title}</span>
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                >
                  <div className="px-4 pb-4 text-sm leading-relaxed text-text-secondary">
                    {item.text}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Before / After slider                                               */
/* ------------------------------------------------------------------ */

export function BeforeAfterSlider({
  before,
  after,
  labelBefore = "Before",
  labelAfter = "After",
}: {
  before: string;
  after: string;
  labelBefore?: string;
  labelAfter?: string;
}) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative my-6 aspect-video w-full select-none overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
      {/* After (base layer) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={labelAfter} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      {/* Before (clipped) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={labelBefore} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      </div>

      {/* Divider handle */}
      <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)]" />
        <div className="absolute top-1/2 -ml-4 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-primary shadow-lg backdrop-blur">
          <ImageIcon className="h-4 w-4" />
        </div>
      </div>

      {/* Labels */}
      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
        {labelBefore}
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
        {labelAfter}
      </span>

      {/* Range input (invisible but interactive + keyboard accessible) */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare before and after"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Newsletter card                                                     */
/* ------------------------------------------------------------------ */

export function NewsletterForm() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "success">("idle");

  return (
    <div className="relative my-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-surface to-sky-500/10 p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> The Vizo Tool Newsletter
        </span>
        <h3 className="mt-3 text-xl font-bold text-text-primary">
          Guides like this, once a week. No spam.
        </h3>
        <p className="mt-1.5 max-w-md text-sm text-text-secondary">
          Join readers learning image tricks, dev workflows and SEO — practical, ad-free, unsubscribe anytime.
        </p>

        {state === "success" ? (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-success/40 bg-success-light/60 px-4 py-3 text-sm font-medium text-success">
            <Check className="h-4 w-4" /> You&apos;re on the list — see you in your inbox!
          </div>
        ) : (
          <form
            className="mt-5 flex max-w-md flex-col gap-2.5 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim() || !email.includes("@")) return;
              setState("success");
            }}
          >
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id={inputId}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-border bg-background/70 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              className="h-11 shrink-0 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-primary/40 active:translate-y-px"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
