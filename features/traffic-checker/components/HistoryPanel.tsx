"use client";

import { useState } from "react";
import { Clock, Star, Trash2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  domain: string;
  time: number;
  favorite: boolean;
}

interface HistoryPanelProps {
  items: HistoryItem[];
  onSelect: (domain: string) => void;
  onToggleFavorite: (domain: string) => void;
  onRemove: (domain: string) => void;
  onClear: () => void;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function HistoryPanel({
  items,
  onSelect,
  onToggleFavorite,
  onRemove,
  onClear,
}: HistoryPanelProps) {
  const [tab, setTab] = useState<"recent" | "favorites">("recent");
  const favorites = items.filter((item) => item.favorite);
  const visible = tab === "favorites" ? favorites : items;

  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-text-primary">Search History</h2>
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          {(["recent", "favorites"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                tab === t ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {t === "favorites" && <Star className={cn("h-3 w-3", tab === t ? "" : "fill-none")} />}
              <span className="capitalize">{t}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px]",
                  tab === t ? "bg-white/20" : "bg-border text-text-muted"
                )}
              >
                {t === "favorites" ? favorites.length : items.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-xs text-text-muted">Stored only in your browser.</p>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-error"
        >
          <Trash2 className="h-3 w-3" />
          Clear all
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-text-muted">
          {tab === "favorites" ? "No favorites yet — tap the star on a report." : "No searches yet."}
        </p>
      ) : (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {visible.map((item) => (
            <li
              key={item.domain}
              className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-background px-3 py-2.5"
            >
              <button
                type="button"
                onClick={() => onSelect(item.domain)}
                className="flex min-w-0 items-center gap-2 text-left"
                aria-label={`Re-analyze ${item.domain}`}
              >
                <TrendingUp className="h-4 w-4 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-text-primary">{item.domain}</span>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="h-3 w-3" />
                    {timeAgo(item.time)}
                  </span>
                </span>
              </button>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(item.domain)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:text-warning"
                  aria-label={item.favorite ? `Remove ${item.domain} from favorites` : `Add ${item.domain} to favorites`}
                >
                  <Star className={cn("h-3.5 w-3.5", item.favorite && "fill-warning text-warning")} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item.domain)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:text-error"
                  aria-label={`Remove ${item.domain} from history`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
