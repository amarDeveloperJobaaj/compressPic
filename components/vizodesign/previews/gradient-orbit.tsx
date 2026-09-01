"use client";

import { cn } from "@/lib/utils";

export default function GradientOrbit() {
  return (
    <div className="h-full w-full overflow-hidden bg-[#0f0f1a] font-sans">
      {/* Mesh gradient backgrounds */}
      <div className="absolute left-0 top-0 h-[600px] w-full overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/30 blur-[120px]" />
        <div className="absolute left-1/3 top-10 h-80 w-80 rounded-full bg-pink-500/25 blur-[100px]" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[80px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500">
            <span className="text-xs font-bold text-white">O</span>
          </div>
          <span className="text-sm font-bold text-white">Orbit</span>
        </div>
        <div className="flex items-center gap-8">
          {["Features", "Pricing", "Blog"].map((item) => (
            <span key={item} className="text-sm text-white/50 transition-colors hover:text-white">{item}</span>
          ))}
        </div>
        <button className="rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30">
          Sign Up
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center px-8 pt-24 text-center">
        <h1 className="mb-5 max-w-2xl text-5xl font-bold leading-tight text-white">
          Design with{" "}
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            vibrant energy
          </span>
        </h1>
        <p className="mb-10 max-w-md text-base text-white/50">
          Bold gradients, playful layouts, and designs that demand attention.
        </p>
        <div className="flex gap-4">
          <button className="rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-2xl hover:shadow-purple-500/30">
            Get Started Free
          </button>
          <button className="rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm text-white/70 backdrop-blur-sm transition-all hover:bg-white/10">
            See Examples
          </button>
        </div>
      </section>

      {/* Gradient cards */}
      <section className="relative z-10 mx-auto mt-20 grid max-w-4xl grid-cols-3 gap-5 px-8">
        {[
          {
            title: "Gradient Builder",
            desc: "Create stunning multi-stop gradients with real-time preview.",
            gradient: "from-pink-500 via-purple-500 to-indigo-500",
          },
          {
            title: "Color Harmony",
            desc: "AI-powered palette generation from any base color.",
            gradient: "from-amber-500 via-orange-500 to-pink-500",
          },
          {
            title: "Motion Presets",
            desc: "Spring, elastic, and bouncy animation curves ready to use.",
            gradient: "from-emerald-500 via-cyan-500 to-blue-500",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
          >
            <div className={cn("mb-4 h-1 w-12 rounded-full bg-gradient-to-r", card.gradient)} />
            <h3 className="mb-2 text-base font-semibold text-white">{card.title}</h3>
            <p className="text-sm leading-relaxed text-white/40">{card.desc}</p>
          </div>
        ))}
      </section>

      {/* Color showcase */}
      <section className="relative z-10 mx-auto mt-12 max-w-4xl px-8">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div className="mb-6 text-sm font-semibold text-white">Color Palette</div>
          <div className="grid grid-cols-6 gap-3">
            {[
              "from-rose-500 to-pink-500",
              "from-orange-500 to-amber-500",
              "from-emerald-500 to-teal-500",
              "from-cyan-500 to-blue-500",
              "from-violet-500 to-purple-500",
              "from-fuchsia-500 to-pink-500",
            ].map((g, i) => (
              <div key={i} className="group cursor-pointer">
                <div className={cn("aspect-square rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110", g)} />
                <div className="mt-2 text-center text-[10px] text-white/30">
                  {["Rose", "Amber", "Emerald", "Cyan", "Violet", "Fuchsia"][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto mt-16 max-w-2xl px-8 pb-24 text-center">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 px-16 py-16 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white">Ready to create something bold?</h2>
          <p className="mt-3 text-sm text-white/40">Start building with gradients today.</p>
          <button className="mt-8 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-purple-500/25">
            Start Building
          </button>
        </div>
      </section>
    </div>
  );
}
