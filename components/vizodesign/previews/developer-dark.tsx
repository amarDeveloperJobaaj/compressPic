"use client";

import { cn } from "@/lib/utils";

export default function DeveloperDark() {
  return (
    <div className="flex h-full w-full overflow-hidden bg-[#0d1117] font-mono">
      {/* Sidebar */}
      <aside className="flex w-48 flex-col border-r border-white/5 bg-[#0d1117]">
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
          <span className="text-xs text-green-400">❯</span>
          <span className="text-[11px] font-semibold text-white">devterm</span>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <div className="mb-3">
            <div className="mb-1 px-2 text-[9px] uppercase tracking-wider text-slate-600">Files</div>
            {["index.ts", "config.ts", "utils.ts", "types.ts"].map((f) => (
              <div key={f} className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px] text-slate-400 hover:bg-white/5 hover:text-white">
                <span className="text-slate-600">▸</span> {f}
              </div>
            ))}
          </div>
          <div>
            <div className="mb-1 px-2 text-[9px] uppercase tracking-wider text-slate-600">Components</div>
            {["Button.tsx", "Card.tsx", "Modal.tsx"].map((f) => (
              <div key={f} className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px] text-slate-400 hover:bg-white/5 hover:text-white">
                <span className="text-blue-400">▸</span> {f}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main editor area */}
      <main className="flex flex-1 flex-col">
        {/* Tab bar */}
        <div className="flex items-center border-b border-white/5 bg-[#0d1117]">
          {[
            { name: "index.ts", active: true },
            { name: "config.ts", active: false },
            { name: "terminal", active: false },
          ].map((tab) => (
            <div
              key={tab.name}
              className={cn(
                "flex items-center gap-1.5 border-r border-white/5 px-4 py-2 text-[11px]",
                tab.active ? "bg-[#161b22] text-white" : "text-slate-500 hover:bg-white/[0.02]"
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", tab.active ? "bg-green-400" : "bg-slate-600")} />
              {tab.name}
            </div>
          ))}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Code editor */}
          <div className="flex-1 overflow-auto p-4">
            <pre className="text-[11px] leading-[1.7]">
              <code>
                {[
                  { num: 1, parts: [
                    { text: "import ", cls: "text-purple-400" },
                    { text: "{ useState }", cls: "text-cyan-300" },
                    { text: " from ", cls: "text-purple-400" },
                    { text: "\"react\"", cls: "text-amber-300" },
                  ]},
                  { num: 2, parts: [] },
                  { num: 3, parts: [
                    { text: "interface ", cls: "text-purple-400" },
                    { text: "Config ", cls: "text-cyan-300" },
                    { text: "{", cls: "text-white/40" },
                  ]},
                  { num: 4, parts: [
                    { text: "  port", cls: "text-blue-300" },
                    { text: ": ", cls: "text-white/40" },
                    { text: "number", cls: "text-emerald-400" },
                    { text: ";", cls: "text-white/40" },
                  ]},
                  { num: 5, parts: [
                    { text: "  host", cls: "text-blue-300" },
                    { text: ": ", cls: "text-white/40" },
                    { text: "string", cls: "text-emerald-400" },
                    { text: ";", cls: "text-white/40" },
                  ]},
                  { num: 6, parts: [
                    { text: "  debug", cls: "text-blue-300" },
                    { text: ": ", cls: "text-white/40" },
                    { text: "boolean", cls: "text-emerald-400" },
                    { text: ";", cls: "text-white/40" },
                  ]},
                  { num: 7, parts: [
                    { text: "}", cls: "text-white/40" },
                  ]},
                  { num: 8, parts: [] },
                  { num: 9, parts: [
                    { text: "const ", cls: "text-purple-400" },
                    { text: "config", cls: "text-cyan-300" },
                    { text: ": ", cls: "text-white/40" },
                    { text: "Config", cls: "text-cyan-300" },
                    { text: " = {", cls: "text-white/40" },
                  ]},
                  { num: 10, parts: [
                    { text: "  port", cls: "text-blue-300" },
                    { text: ": ", cls: "text-white/40" },
                    { text: "3000", cls: "text-amber-300" },
                    { text: ",", cls: "text-white/40" },
                  ]},
                  { num: 11, parts: [
                    { text: "  host", cls: "text-blue-300" },
                    { text: ": ", cls: "text-white/40" },
                    { text: "\"localhost\"", cls: "text-amber-300" },
                    { text: ",", cls: "text-white/40" },
                  ]},
                  { num: 12, parts: [
                    { text: "  debug", cls: "text-blue-300" },
                    { text: ": ", cls: "text-white/40" },
                    { text: "true", cls: "text-emerald-400" },
                    { text: ",", cls: "text-white/40" },
                  ]},
                  { num: 13, parts: [
                    { text: "};", cls: "text-white/40" },
                  ]},
                  { num: 14, parts: [] },
                  { num: 15, parts: [
                    { text: "export ", cls: "text-purple-400" },
                    { text: "default ", cls: "text-purple-400" },
                    { text: "config", cls: "text-cyan-300" },
                    { text: ";", cls: "text-white/40" },
                  ]},
                ].map((line) => (
                  <div key={line.num} className="flex hover:bg-white/[0.02]">
                    <span className="mr-4 w-6 select-none text-right text-slate-600">{line.num}</span>
                    <span>
                      {line.parts.map((p, i) => (
                        <span key={i} className={p.cls}>{p.text}</span>
                      ))}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>

          {/* Terminal panel */}
          <div className="w-72 border-l border-white/5 bg-[#0d1117]">
            <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
              <span className="text-[10px] text-slate-500">TERMINAL</span>
              <span className="text-[10px] text-slate-600">zsh</span>
            </div>
            <div className="p-3 text-[11px] leading-relaxed">
              <div className="text-slate-500">$ npm run dev</div>
              <div className="mt-1 text-slate-600">&gt; devterm@1.0.0 dev</div>
              <div className="text-slate-600">&gt; next dev --port 3000</div>
              <div className="mt-2 text-slate-500">  ▲ Next.js 14.2.0</div>
              <div className="text-slate-500">  - Local: http://localhost:3000</div>
              <div className="mt-2 text-green-400">  ✓ Ready in 1.2s</div>
              <div className="mt-3 text-slate-500">$ <span className="animate-pulse">▌</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
