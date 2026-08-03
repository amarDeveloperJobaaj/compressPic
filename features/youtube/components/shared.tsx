"use client";

import { useCallback, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  Copy,
  Info,
  Link2,
  Share2,
  Sparkles,
  Star,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { copyToClipboard } from "../utils/url";
import {
  clearHistory,
  pushHistory,
  removeHistoryEntry,
  toggleFavorite,
  type HistoryEntry,
} from "../utils/history";

/* ------------------------------------------------------------------ */
/* CopyButton                                                         */
/* ------------------------------------------------------------------ */

export function CopyButton({
  text,
  label = "Copy",
  className,
  size = "sm",
  variant = "secondary",
}: {
  text: string;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "icon";
  variant?: "primary" | "secondary" | "outline" | "ghost";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }, [text]);

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className}
      aria-label={label}
    >
      {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied!" : label}
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/* ShareButton (native share with copy-URL fallback)                  */
/* ------------------------------------------------------------------ */

export function ShareButton({ title, className }: { title?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const data = { title: title ?? document.title, url };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // User cancelled or share unavailable — fall back to copying the link.
      }
    }
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }, [title]);

  return (
    <Button type="button" variant="secondary" size="sm" onClick={handleShare} className={className}>
      {copied ? <Check className="h-4 w-4 text-success" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Link copied!" : "Share"}
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/* NoteCard (info / warning / success)                                */
/* ------------------------------------------------------------------ */

export function NoteCard({
  tone = "info",
  children,
}: {
  tone?: "info" | "warning" | "success";
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed",
        tone === "info" && "border-primary/20 bg-primary-light/40 text-text-secondary",
        tone === "warning" && "border-amber-500/30 bg-amber-500/10 text-text-secondary",
        tone === "success" && "border-success/30 bg-success-light/40 text-text-secondary"
      )}
    >
      <Info
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0",
          tone === "warning" ? "text-amber-500" : tone === "success" ? "text-success" : "text-primary"
        )}
        aria-hidden="true"
      />
      <div>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SectionCard (glassy panel with optional header)                    */
/* ------------------------------------------------------------------ */

export function SectionCard({
  icon: Icon,
  title,
  description,
  actions,
  children,
  className,
}: {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "rounded-2xl border border-border bg-surface/80 p-6 shadow-xl shadow-black/5 backdrop-blur-xl",
        className
      )}
    >
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {Icon && (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light">
                <Icon className="h-5 w-5 text-primary" />
              </span>
            )}
            <div>
              {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
              {description && <p className="mt-0.5 text-sm text-text-secondary">{description}</p>}
            </div>
          </div>
          {actions}
        </div>
      )}
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StatPill (small result chip)                                       */
/* ------------------------------------------------------------------ */

export function StatPill({ label, value, tone = "default" }: { label: string; value: ReactNode; tone?: "default" | "primary" }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3",
        tone === "primary"
          ? "border-primary/30 bg-primary-light/50"
          : "border-border bg-background/60"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      <p className={cn("mt-1 text-xl font-bold", tone === "primary" ? "text-primary" : "text-text-primary")}>
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EmptyState                                                         */
/* ------------------------------------------------------------------ */

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light">
        <Icon className="h-7 w-7 text-primary" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-text-secondary">{description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* UrlForm (video URL input with paste + examples)                    */
/* ------------------------------------------------------------------ */

export function UrlForm({
  value,
  onChange,
  onSubmit,
  placeholder = "Paste a YouTube URL… e.g. https://youtube.com/watch?v=…",
  submitLabel,
  loading,
  examples,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  submitLabel: string;
  loading?: boolean;
  examples?: string[];
  error?: string | null;
}) {
  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-label="YouTube video URL"
            className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>
        <Button type="submit" size="lg" disabled={loading || !value.trim()} className="sm:w-auto">
          {loading ? "Working…" : submitLabel}
        </Button>
      </form>

      {examples && examples.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-muted">Try:</span>
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => onChange(example)}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
            >
              {example}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HistoryPanel (controlled — recent searches with favorites)         */
/* ------------------------------------------------------------------ */

export function HistoryPanel<T>({
  storageKey,
  entries,
  onEntriesChange,
  onLoad,
}: {
  /** localStorage key used when clearing history. */
  storageKey: string;
  /** Controlled list of entries (owned by the tool so it can push new ones). */
  entries: HistoryEntry<T>[];
  onEntriesChange: (next: HistoryEntry<T>[]) => void;
  onLoad: (data: T) => void;
}) {
  const handleLoad = useCallback(
    (entry: HistoryEntry<T>) => {
      onLoad(entry.data);
      onEntriesChange(pushHistory(storageKey, entry));
    },
    [onLoad, storageKey, onEntriesChange]
  );

  if (entries.length === 0) return null;

  return (
    <SectionCard icon={Clock} title="Recent" description="Click an item to load it again.">
      <ul className="space-y-2">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="group flex items-center gap-2 rounded-xl border border-border bg-background/60 p-2 pl-4"
          >
            <button
              type="button"
              onClick={() => handleLoad(entry)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-text-muted" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-text-primary group-hover:text-primary">
                  {entry.label}
                </span>
                {entry.sublabel && (
                  <span className="block truncate text-xs text-text-muted">{entry.sublabel}</span>
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onEntriesChange(toggleFavorite<T>(storageKey, entry.id))}
              aria-label={entry.favorite ? "Remove from favorites" : "Add to favorites"}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                entry.favorite
                  ? "text-amber-500"
                  : "text-text-muted hover:bg-primary-light hover:text-amber-500"
              )}
            >
              <Star className={cn("h-4 w-4", entry.favorite && "fill-amber-500")} />
            </button>
            <button
              type="button"
              onClick={() => onEntriesChange(removeHistoryEntry<T>(storageKey, entry.id))}
              aria-label="Remove from history"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-error/10 hover:text-error"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            clearHistory(storageKey);
            onEntriesChange([]);
          }}
        >
          Clear history
        </Button>
      </div>
    </SectionCard>
  );
}
