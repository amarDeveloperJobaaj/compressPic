"use client";

import { cn } from "@/lib/utils";

export default function AiNebula() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#050510] font-sans">
      {/* Neural network dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at center, #06b6d4 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {/* Glow orbs */}
      <div className="absolute left-[20%] top-[15%] h-64 w-64 rounded-full bg-purple-600/10 blur-[100px]" />
      <div className="absolute right-[25%] top-[40%] h-80 w-80 rounded-full bg-cyan-600/10 blur-[120px]" />
      <div className="absolute bottom-[10%] left-[40%] h-48 w-48 rounded-full bg-blue-600/8 blur-[80px]" />

      {/* Grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between border-b border-white/5 px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10">
              <span className="text-sm text-cyan-400">◆</span>
            </div>
            <div className="absolute -inset-1 rounded-lg bg-cyan-500/10 blur-sm" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-white">NEBULA AI</span>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-xs text-white/40 transition-colors hover:text-cyan-400">Platform</span>
          <span className="text-xs text-white/40 transition-colors hover:text-cyan-400">Research</span>
          <span className="text-xs text-white/40 transition-colors hover:text-cyan-400">API</span>
          <button className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs text-cyan-400 transition-all hover:bg-cyan-500/20">
            Launch Console
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center px-8 pt-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
          <span className="text-[11px] text-cyan-400">v2.4 — Neural architecture upgrade</span>
        </div>

        <h1 className="mb-5 max-w-2xl text-4xl font-semibold tracking-tight text-white">
          Intelligence,{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            amplified
          </span>
        </h1>
        <p className="mb-10 max-w-lg text-sm leading-relaxed text-white/40">
          Next-generation AI infrastructure. Train, deploy, and scale models with unprecedented speed and precision.
        </p>
        <div className="flex gap-3">
          <button className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-2.5 text-xs font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/30">
            Start Building
          </button>
          <button className="rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-xs text-white/70 transition-all hover:bg-white/10">
            Read Docs
          </button>
        </div>
      </div>

      {/* Holographic cards */}
      <div className="relative z-10 mx-auto mt-16 grid max-w-4xl grid-cols-3 gap-4 px-8">
        {[
          { title: "Neural Engine", desc: "Custom silicon optimized for transformer architectures.", accent: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/20", icon: "⬡" },
          { title: "Auto Scaling", desc: "Dynamically allocate resources based on workload.", accent: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/20", icon: "◈" },
          { title: "Real-time API", desc: "Sub-100ms inference latency globally.", accent: "from-emerald-500/20 to-cyan-500/20", border: "border-emerald-500/20", icon: "◇" },
        ].map((card) => (
          <div
            key={card.title}
            className={cn(
              "group relative rounded-xl border bg-gradient-to-br p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]",
              card.border,
              card.accent
            )}
          >
            <div className="mb-3 text-lg text-cyan-400/60">{card.icon}</div>
            <h3 className="mb-1 text-sm font-medium text-white">{card.title}</h3>
            <p className="text-[11px] leading-relaxed text-white/40">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Terminal-like code block */}
      <div className="relative z-10 mx-auto mt-8 max-w-3xl rounded-xl border border-white/5 bg-white/[0.02] px-6 py-4 backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2 text-[10px] text-white/20">nebula.config.ts</span>
        </div>
        <pre className="font-mono text-[11px] leading-relaxed">
          <code>
            <span className="text-purple-400">const</span>{" "}
            <span className="text-cyan-300">model</span>{" "}
            <span className="text-white/40">=</span>{" "}
            <span className="text-purple-400">await</span>{" "}
            <span className="text-cyan-300">nebula</span>
            <span className="text-white/40">.</span>
            <span className="text-emerald-400">deploy</span>
            <span className="text-white/40">({"{"}</span>
            {"\n"}{"  "}
            <span className="text-white/60">name:</span>{" "}
            <span className="text-amber-300">&quot;gpt-neo-x-20b&quot;</span>
            <span className="text-white/40">,</span>
            {"\n"}{"  "}
            <span className="text-white/60">replicas:</span>{" "}
            <span className="text-cyan-300">4</span>
            <span className="text-white/40">,</span>
            {"\n"}{"  "}
            <span className="text-white/60">gpu:</span>{" "}
            <span className="text-amber-300">&quot;a100-80gb&quot;</span>
            <span className="text-white/40">,</span>
            {"\n"}{"  "}
            <span className="text-white/60">autoscale:</span>{" "}
            <span className="text-emerald-400">true</span>
            {"\n"}
            <span className="text-white/40">{"})"}</span>
          </code>
        </pre>
      </div>

      {/* Stats */}
      <div className="relative z-10 mx-auto mt-8 flex max-w-3xl justify-center gap-16 px-8">
        {[
          { value: "10B+", label: "Parameters" },
          { value: "47ms", label: "P95 Latency" },
          { value: "99.99%", label: "Uptime SLA" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-lg font-semibold text-white">{stat.value}</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-white/30">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
