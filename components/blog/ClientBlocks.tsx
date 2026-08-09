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
import { useId, useEffect, useState } from "react";
import { subscribeNewsletterAction } from "@/lib/blog/actions";
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

/* ------------------------------------------------------------------ */
/* Tabs block                                                          */
/* ------------------------------------------------------------------ */

export function TabsBlock({ tabs }: { tabs: { title: string; text: string }[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div role="tablist" aria-label="Tabbed content" className="flex flex-wrap border-b border-border bg-background/60">
        {tabs.map((tab, i) => {
          const isActive = active === i;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${i}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative px-4 py-2.5 text-sm font-semibold transition-colors",
                isActive
                  ? "text-primary"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {tab.title}
              {isActive && (
                <motion.span
                  layoutId={`tab-underline-${tabs.length}`}
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>
      <div
        key={active}
        role="tabpanel"
        id={`tabpanel-${active}`}
        className="p-5 text-sm leading-relaxed text-text-secondary"
      >
        {tabs[active]?.text}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mermaid diagram block (lazy-loaded, code-split)                     */
/* ------------------------------------------------------------------ */

function hashCode(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

export function MermaidBlock({ code }: { code: string }) {
  // Per-instance nonce keeps ids unique even when the same diagram appears twice.
  const [nonce] = useState(() => Math.random().toString(36).slice(2, 8));
  const id = `mermaid-${nonce}-${hashCode(code)}`;
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Lazy import keeps mermaid (~1 MB) out of the initial bundle.
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false });
        const { svg: rendered } = await mermaid.render(id, code);
        if (!cancelled) {
          setSvg(rendered);
          setError("");
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not render diagram");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return (
      <div className="my-6 rounded-xl border border-error/40 bg-error-light/50 p-4">
        <p className="text-sm font-semibold text-error">Diagram could not be rendered</p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-background/70 p-3 font-mono text-xs text-text-secondary">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border bg-surface p-5">
      {svg ? (
        <div
          className="flex justify-center"
          aria-label="Mermaid diagram"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-text-muted">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Rendering diagram…
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Newsletter card                                                     */
/* ------------------------------------------------------------------ */

export function NewsletterForm() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
            <Check className="h-4 w-4" /> {message || "You're on the list — see you in your inbox!"}
          </div>
        ) : (
          <form
            className="mt-5 flex max-w-md flex-col gap-2.5 sm:flex-row"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email.trim() || !email.includes("@") || submitting) return;
              setSubmitting(true);
              setState("idle");
              const res = await subscribeNewsletterAction({ email: email.trim(), source: "blog" });
              setSubmitting(false);
              if (res.ok) {
                setState("success");
                setMessage(res.data.message);
              } else {
                setState("error");
                setMessage(res.error);
              }
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
              disabled={submitting}
              className="h-11 shrink-0 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-primary/40 active:translate-y-px disabled:opacity-60"
            >
              {submitting ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}
        {state === "error" && (
          <p className="mt-3 text-sm font-medium text-rose-600 dark:text-rose-300" role="alert">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
