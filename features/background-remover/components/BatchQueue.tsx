"use client";

import { motion } from "framer-motion";
import { Play, RefreshCw, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useBackgroundRemoverStore } from "@/store/background-remover-store";
import { formatFileSize } from "@/features/compressor/utils/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function BatchQueue() {
  const items = useBackgroundRemoverStore((s) => s.items);
  const activeIndex = useBackgroundRemoverStore((s) => s.activeIndex);
  const isProcessing = useBackgroundRemoverStore((s) => s.isProcessing);
  const setActiveIndex = useBackgroundRemoverStore((s) => s.setActiveIndex);
  const removeItem = useBackgroundRemoverStore((s) => s.removeItem);
  const reprocessItem = useBackgroundRemoverStore((s) => s.reprocessItem);
  const processQueue = useBackgroundRemoverStore((s) => s.processQueue);

  if (items.length === 0) return null;

  const hasQueued = items.some((it) => it.status === "queued" || it.status === "error");

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    removeItem(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIndex(index);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-text-primary">Batch Queue</p>
          <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-medium text-text-muted">
            {items.length} image{items.length > 1 ? "s" : ""}
          </span>
        </div>
        {hasQueued && (
          <Button onClick={processQueue} disabled={isProcessing} variant="secondary" size="sm">
            {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            Process All
          </Button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto p-4">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "group relative w-24 shrink-0 cursor-pointer rounded-xl border-2 p-1.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                  ? "border-primary bg-primary-light shadow-sm"
                  : "border-border bg-background hover:border-primary/50"
              )}
              aria-label={`Select ${item.name}`}
              aria-pressed={isActive}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.originalUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />

                {/* Status badge */}
                <div className="absolute right-1 top-1">
                  {item.status === "processing" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                  {item.status === "done" && <CheckCircle2 className="h-4 w-4 text-success" />}
                  {item.status === "error" && <AlertCircle className="h-4 w-4 text-error" />}
                  {item.status === "queued" && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-background/80 text-[8px] font-bold text-text-muted">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, index)}
                  className="absolute bottom-1 right-1 hidden h-5 w-5 items-center justify-center rounded-md bg-error/90 text-white group-hover:flex"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>

                {/* Retry on error */}
                {item.status === "error" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      reprocessItem(index);
                    }}
                    className="absolute bottom-1 left-1 hidden h-5 w-5 items-center justify-center rounded-md bg-primary text-white group-hover:flex"
                    aria-label="Retry"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                )}
              </div>
              <p className="mt-1 truncate px-0.5 text-[10px] text-text-muted">
                {formatFileSize(item.size)}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
