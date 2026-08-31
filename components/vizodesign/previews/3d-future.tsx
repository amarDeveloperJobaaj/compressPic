"use client";

import { cn } from "@/lib/utils";

export default function ThreeDFuture() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a0f] font-sans" style={{ perspective: "1200px" }}>
      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(120,119,198,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(120,119,198,0.4) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }} />

      {/* Ambient light */}
      <div className="absolute right-[10%] top-[10%] h-80 w-80 rounded-full bg-indigo-600/8 blur-[120px]" />
      <div className="absolute bottom-[10%] left-[15%] h-64 w-64 rounded-full bg-cyan-600/6 blur-[100px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10" style={{ transform: "rotateX(10deg) rotateY(-10deg)" }}>
              <span className="text-sm text-indigo-400">▲</span>
            </div>
          </div>
          <span className="text-sm font-semibold tracking-wide text-white">Prism</span>
        </div>
        <div className="flex items-center gap-8">
          {["Product", "Docs", "Pricing"].map((item) => (
            <span key={item} className="text-xs text-white/40 transition-colors hover:text-white">{item}</span>
          ))}
          <button className="rounded-lg bg-indigo-500 px-4 py-1.5 text-xs font-medium text-white transition-all hover:bg-indigo-400">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center px-8 pt-20 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] text-white/60">
          <span className="h-1 w-1 rounded-full bg-indigo-400" />
          Shipping v2.0
        </div>
        <h1 className="mb-5 max-w-2xl text-4xl font-bold tracking-tight text-white">
          Interfaces with{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            real depth
          </span>
        </h1>
        <p className="mb-8 max-w-md text-sm text-white/40">
          CSS-powered 3D transforms, perspective layers, and floating effects. No WebGL required.
        </p>
        <div className="flex gap-3">
          <button className="rounded-lg bg-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/30">
            Explore Docs
          </button>
          <button className="rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-white/60 transition-all hover:bg-white/10">
            Live Demo
          </button>
        </div>
      </section>

      {/* 3D Floating cards */}
      <section className="relative z-10 mx-auto mt-16 grid max-w-4xl grid-cols-3 gap-6 px-8" style={{ perspective: "1000px" }}>
        {[
          { title: "Depth Layers", desc: "Create visual hierarchy with CSS z-index and transforms.", rotate: "rotateX(5deg) rotateY(-5deg)", color: "from-indigo-500/20 to-violet-500/20", border: "border-indigo-500/20" },
          { title: "Float Effect", desc: "Cards that hover above the surface with realistic shadows.", rotate: "rotateX(0deg) rotateY(0deg)", color: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/20" },
          { title: "Parallax Scroll", desc: "Multi-speed scrolling for immersive depth perception.", rotate: "rotateX(5deg) rotateY(5deg)", color: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/20" },
        ].map((card) => (
          <div
            key={card.title}
            className={cn(
              "group rounded-2xl border bg-gradient-to-br p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl",
              card.border,
              card.color
            )}
            style={{ transform: card.rotate, transformStyle: "preserve-3d" }}
          >
            <div className="mb-3 h-8 w-8 rounded-lg bg-white/5" style={{ transform: "translateZ(20px)" }} />
            <h3 className="mb-1 text-sm font-semibold text-white" style={{ transform: "translateZ(15px)" }}>{card.title}</h3>
            <p className="text-[11px] leading-relaxed text-white/40" style={{ transform: "translateZ(10px)" }}>{card.desc}</p>
          </div>
        ))}
      </section>

      {/* Geometric shapes */}
      <section className="relative z-10 mx-auto mt-12 max-w-4xl px-8">
        <div className="flex items-center justify-center gap-8">
          <div className="h-16 w-16 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 transition-transform hover:rotate-12" style={{ transform: "rotateX(20deg) rotateY(20deg)" }} />
          <div className="h-20 w-20 rounded-full border border-cyan-500/20 bg-cyan-500/10 transition-transform hover:scale-110" style={{ transform: "rotateX(15deg)" }} />
          <div className="h-14 w-14 border-2 border-violet-500/20 bg-violet-500/10 transition-transform hover:-rotate-12" style={{ transform: "rotateY(30deg)", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
          <div className="h-16 w-16 rounded-lg border border-purple-500/20 bg-purple-500/10 transition-transform hover:rotate-45" style={{ transform: "rotateX(25deg) rotateY(-15deg)" }} />
          <div className="h-12 w-12 rounded-full border border-pink-500/20 bg-pink-500/10 transition-transform hover:scale-125" />
        </div>
      </section>

      {/* Feature grid */}
      <section className="relative z-10 mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 px-8 pb-24">
        {[
          { icon: "◆", title: "CSS Transforms", desc: "Native 3D without JavaScript overhead." },
          { icon: "◈", title: "Performance", desc: "GPU-accelerated rendering at 60fps." },
          { icon: "◇", title: "Responsive", desc: "Adapts depth based on viewport." },
          { icon: "⬡", title: "Accessible", desc: "Respects prefers-reduced-motion." },
        ].map((f) => (
          <div key={f.title} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.04]">
            <span className="mt-0.5 text-indigo-400/60">{f.icon}</span>
            <div>
              <h3 className="text-xs font-semibold text-white">{f.title}</h3>
              <p className="mt-0.5 text-[11px] text-white/30">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
