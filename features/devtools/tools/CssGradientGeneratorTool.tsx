"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ToolPanel } from "../components/ToolPanel";
import { CodeOutput } from "../components/CodeOutput";
import { Slider } from "../components/controls";
import { cn } from "@/lib/utils";

type GradientType = "linear" | "radial" | "conic";

interface Stop {
  id: number;
  color: string;
  position: number; // 0-100
}

let nextId = 1;

export function CssGradientGeneratorTool() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [shape, setShape] = useState<"circle" | "ellipse">("circle");
  const [stops, setStops] = useState<Stop[]>([
    { id: nextId++, color: "#2563EB", position: 0 },
    { id: nextId++, color: "#22C55E", position: 50 },
    { id: nextId++, color: "#F59E0B", position: 100 },
  ]);

  const css = useMemo(() => {
    const stopStr = stops
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");
    if (type === "linear") return `background: linear-gradient(${angle}deg, ${stopStr});`;
    if (type === "radial") return `background: radial-gradient(${shape}, ${stopStr});`;
    return `background: conic-gradient(from ${angle}deg, ${stopStr});`;
  }, [type, angle, shape, stops]);

  const updateStop = (id: number, patch: Partial<Stop>) =>
    setStops((s) => s.map((stop) => (stop.id === id ? { ...stop, ...patch } : stop)));

  const addStop = () => {
    if (stops.length >= 8) return;
    const mid = Math.round(stops.reduce((sum, s) => sum + s.position, 0) / stops.length);
    setStops((s) => [...s, { id: nextId++, color: "#8B5CF6", position: Math.max(0, Math.min(100, mid)) }]);
  };

  const removeStop = (id: number) => {
    if (stops.length <= 2) return;
    setStops((s) => s.filter((stop) => stop.id !== id));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls */}
      <ToolPanel title="Gradient Settings">
        {/* Type */}
        <div className="mb-5 flex flex-wrap gap-2">
          {(
            [
              { key: "linear", label: "Linear" },
              { key: "radial", label: "Radial" },
              { key: "conic", label: "Conic" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key)}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-medium transition-all active:scale-[0.97]",
                type === key
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-background text-text-secondary hover:border-primary/40 hover:text-primary"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {type === "linear" && <Slider label="Angle" value={angle} min={0} max={360} onChange={setAngle} suffix="°" />}
        {type === "conic" && <Slider label="Start angle" value={angle} min={0} max={360} onChange={setAngle} suffix="°" />}
        {type === "radial" && (
          <div className="mb-4 flex gap-2">
            {(["circle", "ellipse"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setShape(s)}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-all",
                  shape === s
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-background text-text-secondary"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Stops */}
        <div className="mt-6 border-t border-border pt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-text-primary">Color Stops</p>
            <button
              type="button"
              onClick={addStop}
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
              disabled={stops.length >= 8}
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
          <div className="space-y-3">
            {stops.map((stop) => (
              <div key={stop.id} className="flex items-center gap-3">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                  className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-border bg-background"
                  aria-label="Stop color"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(e) => updateStop(stop.id, { position: Number(e.target.value) })}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-primary"
                  aria-label="Stop position"
                />
                <span className="w-10 shrink-0 text-right font-mono text-xs text-text-muted">{stop.position}%</span>
                <button
                  type="button"
                  onClick={() => removeStop(stop.id)}
                  disabled={stops.length <= 2}
                  aria-label="Remove stop"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-error-light hover:text-error disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </ToolPanel>

      {/* Preview */}
      <ToolPanel title="Preview & CSS">
        <div
          className="flex h-56 items-center justify-center rounded-xl border border-border transition-all"
          style={{ background: css.replace("background: ", "").replace(";", "") }}
        >
          <span className="rounded-full bg-background/70 px-4 py-1.5 text-xs font-medium text-text-primary backdrop-blur">
            Live Preview
          </span>
        </div>
        <div className="mt-4">
          <CodeOutput
            text={css}
            title="CSS Code"
            filename="gradient.css"
            mime="text/css"
            previewClass="max-h-40"
            ariaLabel="Generated CSS"
          />
        </div>
      </ToolPanel>
    </div>
  );
}
