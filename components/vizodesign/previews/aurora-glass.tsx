"use client";

export default function AuroraGlass() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a1a] font-sans">
      {/* Aurora gradient background */}
      <div className="absolute inset-0">
        <div className="absolute -left-1/4 -top-1/4 h-[150%] w-[150%] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#7c3aed_0%,#3b82f6_25%,#06b6d4_50%,#3b82f6_75%,#7c3aed_100%)] opacity-30 blur-[120px]" />
        <div className="absolute -right-1/4 -bottom-1/4 h-[120%] w-[120%] animate-[spin_25s_linear_infinite_reverse] bg-[conic-gradient(from_180deg_at_50%_50%,#06b6d4_0%,#8b5cf6_33%,#2563eb_66%,#06b6d4_100%)] opacity-25 blur-[100px]" />
      </div>

      {/* Floating orbs */}
      <div className="absolute left-[10%] top-[20%] h-32 w-32 animate-[float_6s_ease-in-out_infinite] rounded-full bg-purple-500/20 blur-2xl" />
      <div className="absolute right-[15%] top-[30%] h-40 w-40 animate-[float_8s_ease-in-out_infinite_1s] rounded-full bg-cyan-500/20 blur-2xl" />
      <div className="absolute bottom-[25%] left-[30%] h-36 w-36 animate-[float_7s_ease-in-out_infinite_0.5s] rounded-full bg-blue-500/20 blur-2xl" />

      {/* Glass navigation */}
      <nav className="relative z-10 flex items-center justify-between border-b border-white/10 px-8 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
            <span className="text-sm font-bold text-white">V</span>
          </div>
          <span className="text-lg font-semibold text-white">VizoDesign</span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <span className="text-sm text-white/70 transition-colors hover:text-white">Features</span>
          <span className="text-sm text-white/70 transition-colors hover:text-white">Pricing</span>
          <span className="text-sm text-white/70 transition-colors hover:text-white">Docs</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all hover:bg-white/10">
            Sign in
          </button>
          <button className="rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero section */}
      <div className="relative z-10 flex flex-col items-center px-8 pt-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/80 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          Now in public beta
        </div>
        <h1 className="mb-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white">
          Build beautiful interfaces with{" "}
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            crystal clarity
          </span>
        </h1>
        <p className="mb-10 max-w-xl text-lg text-white/60">
          The modern design system that adapts to your workflow. Ship faster with glass-morphism components that look stunning.
        </p>
        <div className="flex gap-4">
          <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/10 hover:shadow-lg hover:shadow-white/5">
            Start Free Trial
          </button>
          <button className="rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30">
            Watch Demo
          </button>
        </div>
      </div>

      {/* Glass cards */}
      <div className="relative z-10 mx-auto mt-20 grid max-w-5xl grid-cols-3 gap-6 px-8">
        {[
          { title: "Lightning Fast", desc: "Optimized rendering pipeline with sub-millisecond response times.", icon: "⚡" },
          { title: "Dark Mode Ready", desc: "Every component ships with beautiful dark theme support.", icon: "🌙" },
          { title: "Fully Accessible", desc: "WCAG 2.1 compliant with screen reader and keyboard support.", icon: "♿" },
        ].map((card) => (
          <div
            key={card.title}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/10"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl backdrop-blur-sm transition-colors group-hover:bg-white/15">
              {card.icon}
            </div>
            <h3 className="mb-2 text-base font-semibold text-white">{card.title}</h3>
            <p className="text-sm leading-relaxed text-white/50">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div className="relative z-10 mx-auto mt-12 flex max-w-3xl items-center justify-center gap-12 rounded-2xl border border-white/10 bg-white/5 px-8 py-6 backdrop-blur-xl">
        {[
          { value: "10K+", label: "Developers" },
          { value: "99.9%", label: "Uptime" },
          { value: "50ms", label: "Avg Response" },
          { value: "4.9★", label: "Rating" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="mt-1 text-xs text-white/40">{stat.label}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
