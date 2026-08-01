"use client";

import { useMemo, useState } from "react";
import { ToolPanel } from "../components/ToolPanel";
import { CodeOutput } from "../components/CodeOutput";
import { Slider, Toggle } from "../components/controls";
import { cn } from "@/lib/utils";

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function CssBoxShadowGeneratorTool() {
  const [x, setX] = useState(4);
  const [y, setY] = useState(6);
  const [blur, setBlur] = useState(12);
  const [spread, setSpread] = useState(-2);
  const [opacity, setOpacity] = useState(0.3);
  const [color, setColor] = useState("#111827");
  const [inset, setInset] = useState(false);

  const css = useMemo(() => {
    const rgba = hexToRgba(color, opacity);
    return `box-shadow: ${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${rgba};`;
  }, [x, y, blur, spread, opacity, color, inset]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls */}
      <ToolPanel title="Shadow Settings">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Slider label="X offset" value={x} min={-60} max={60} onChange={setX} suffix=" px" />
            <Slider label="Y offset" value={y} min={-60} max={60} onChange={setY} suffix=" px" />
            <Slider label="Blur" value={blur} min={0} max={100} onChange={setBlur} suffix=" px" />
            <Slider label="Spread" value={spread} min={-50} max={50} onChange={setSpread} suffix=" px" />
          </div>
          <Slider
            label="Opacity"
            value={Math.round(opacity * 100)}
            min={0}
            max={100}
            onChange={(v) => setOpacity(v / 100)}
            suffix="%"
          />
          <div>
            <span className="mb-1.5 block text-sm font-medium text-text-primary">Color</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-24 cursor-pointer rounded-lg border border-border bg-background"
              aria-label="Shadow color"
            />
          </div>
          <div className="border-t border-border pt-4">
            <Toggle label="Inset shadow" checked={inset} onChange={setInset} />
          </div>
        </div>
      </ToolPanel>

      {/* Preview */}
      <ToolPanel title="Preview & CSS">
        <div className="rounded-xl border border-border bg-background p-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-text-muted">Light surface</span>
              <div
                className={cn("h-28 w-28 rounded-2xl bg-white transition-all")}
                style={{ boxShadow: css.replace("box-shadow: ", "").replace(";", "") }}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-text-muted">Dark surface</span>
              <div
                className="h-28 w-28 rounded-2xl bg-[#121B2E] transition-all"
                style={{ boxShadow: css.replace("box-shadow: ", "").replace(";", "") }}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <CodeOutput
            text={css}
            title="CSS Code"
            filename="box-shadow.css"
            mime="text/css"
            previewClass="max-h-40"
            ariaLabel="Generated CSS"
          />
        </div>
      </ToolPanel>
    </div>
  );
}
