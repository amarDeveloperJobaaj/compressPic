"use client";

import { motion } from "framer-motion";
import { Brush, Eraser, MousePointer2, Undo2, Redo2, RotateCcw, Feather, Wand2, Grip, Circle } from "lucide-react";
import { useBackgroundRemoverStore } from "@/store/background-remover-store";
import { Slider } from "./Slider";
import { cn } from "@/lib/utils";

export function EdgePanel() {
  const edge = useBackgroundRemoverStore((s) => s.edge);
  const setEdge = useBackgroundRemoverStore((s) => s.setEdge);
  const applyEdgeOp = useBackgroundRemoverStore((s) => s.applyEdgeOp);
  const undoMask = useBackgroundRemoverStore((s) => s.undoMask);
  const redoMask = useBackgroundRemoverStore((s) => s.redoMask);
  const resetMask = useBackgroundRemoverStore((s) => s.resetMask);
  const items = useBackgroundRemoverStore((s) => s.items);
  const activeIndex = useBackgroundRemoverStore((s) => s.activeIndex);

  const item = activeIndex >= 0 ? items[activeIndex] : undefined;
  const hasMask = item?.mask != null;
  const canUndo = (item?.maskHistory.length ?? 0) > 0;
  const canRedo = (item?.maskFuture.length ?? 0) > 0;

  const setBrush = (mode: "restore" | "erase" | null) => setEdge({ brushMode: mode });

  const ops = [
    {
      id: "smooth" as const,
      label: "Smooth",
      desc: "Softens jagged edges",
      icon: Grip,
    },
    {
      id: "feather" as const,
      label: "Feather",
      desc: "Gentle soft edge",
      icon: Feather,
    },
    {
      id: "hair" as const,
      label: "Hair Refine",
      desc: "Keep wispy hair detail",
      icon: Wand2,
    },
    {
      id: "cleanup" as const,
      label: "Cleanup",
      desc: "Remove leftover fringe",
      icon: Circle,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Auto edge ops */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Auto Refine
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ops.map((op) => (
            <button
              key={op.id}
              type="button"
              disabled={!hasMask}
              onClick={() => applyEdgeOp(op.id)}
              className="flex flex-col items-start gap-1 rounded-xl border border-border bg-background p-3 text-left transition-all hover:border-primary/50 hover:bg-primary-light/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <op.icon className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-text-primary">{op.label}</span>
              <span className="text-[10px] leading-tight text-text-muted">{op.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual brush */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Manual Brush
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            disabled={!hasMask}
            onClick={() => setBrush(null)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[10px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40",
              edge.brushMode === null
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-border bg-background text-text-secondary hover:border-primary/50 hover:text-primary"
            )}
          >
            <MousePointer2 className="h-4 w-4" />
            None
          </button>
          <button
            type="button"
            disabled={!hasMask}
            onClick={() => setBrush("restore")}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[10px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40",
              edge.brushMode === "restore"
                ? "border-success bg-success text-white shadow-sm"
                : "border-border bg-background text-text-secondary hover:border-success/50 hover:text-success"
            )}
          >
            <Brush className="h-4 w-4" />
            Restore
          </button>
          <button
            type="button"
            disabled={!hasMask}
            onClick={() => setBrush("erase")}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[10px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40",
              edge.brushMode === "erase"
                ? "border-error bg-error text-white shadow-sm"
                : "border-border bg-background text-text-secondary hover:border-error/50 hover:text-error"
            )}
          >
            <Eraser className="h-4 w-4" />
            Erase
          </button>
        </div>

        {edge.brushMode && (
          <div className="mt-4 space-y-4 rounded-xl border border-border bg-background p-4">
            <Slider
              label="Brush Size"
              value={edge.brushSize}
              min={8}
              max={160}
              step={1}
              onChange={(v) => setEdge({ brushSize: v })}
              format={(v) => `${v}px`}
            />
            <Slider
              label="Hardness"
              value={Math.round(edge.brushHardness * 100)}
              min={0}
              max={100}
              step={1}
              onChange={(v) => setEdge({ brushHardness: v / 100 })}
              format={(v) => `${v}%`}
            />
            <p className="text-[10px] leading-relaxed text-text-muted">
              {edge.brushMode === "restore"
                ? "Paint over erased areas to bring the subject back."
                : "Paint over unwanted areas to erase them."}{" "}
              Paint directly on the preview.
            </p>
          </div>
        )}
      </div>

      {/* History */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          disabled={!canUndo}
          onClick={undoMask}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-2 py-2.5 text-xs font-medium text-text-secondary transition-all hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Undo
        </button>
        <button
          type="button"
          disabled={!canRedo}
          onClick={redoMask}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-2 py-2.5 text-xs font-medium text-text-secondary transition-all hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Redo2 className="h-3.5 w-3.5" />
          Redo
        </button>
        <button
          type="button"
          disabled={!hasMask}
          onClick={resetMask}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-2 py-2.5 text-xs font-medium text-text-secondary transition-all hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </motion.div>
  );
}
