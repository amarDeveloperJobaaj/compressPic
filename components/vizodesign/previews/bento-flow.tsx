"use client";

export default function BentoFlow() {
  return (
    <div className="h-full w-full overflow-hidden bg-[#fafafa] p-8 font-sans">
      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900">
          Bento Flow
        </h1>
        <p className="text-base text-gray-500">
          Asymmetric grid layouts with purpose. Every card tells a story.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-4 grid-rows-[auto] gap-4">
        {/* Large hero card */}
        <div className="col-span-2 row-span-2 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 p-8 text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-violet-500/20">
          <div className="flex h-full flex-col justify-between">
            <div>
              <span className="mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                Featured
              </span>
              <h2 className="mt-4 text-2xl font-bold leading-tight">
                Ship products<br />your users love
              </h2>
              <p className="mt-3 max-w-xs text-sm text-white/70">
                Build, iterate, and launch with tools designed for modern teams.
              </p>
            </div>
            <button className="mt-6 w-fit rounded-2xl bg-white/20 px-6 py-2.5 text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/30">
              Get Started →
            </button>
          </div>
        </div>

        {/* Stats card */}
        <div className="col-span-1 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-lg hover:ring-gray-200">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-lg">
            📈
          </div>
          <div className="text-3xl font-bold text-gray-900">98.6%</div>
          <div className="mt-1 text-sm text-gray-500">Uptime this month</div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600">
            <span>↑</span> 0.2% from last month
          </div>
        </div>

        {/* Color palette card */}
        <div className="col-span-1 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-lg hover:ring-gray-200">
          <div className="mb-3 text-sm font-medium text-gray-700">Brand Colors</div>
          <div className="grid grid-cols-3 gap-2">
            {["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"].map((c) => (
              <div
                key={c}
                className="aspect-square rounded-xl transition-transform hover:scale-110"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Text card */}
        <div className="col-span-1 row-span-1 rounded-3xl bg-gray-900 p-6 text-white transition-all duration-300 hover:bg-gray-800">
          <h3 className="mb-2 text-sm font-semibold">Typography</h3>
          <p className="text-[11px] leading-relaxed text-gray-400">
            Clean, readable fonts with consistent sizing and weight hierarchy.
          </p>
          <div className="mt-4 space-y-2">
            <div className="h-2 w-full rounded-full bg-white/20" />
            <div className="h-2 w-4/5 rounded-full bg-white/15" />
            <div className="h-2 w-3/5 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Image placeholder */}
        <div className="col-span-1 rounded-3xl bg-gradient-to-br from-orange-100 to-rose-100 p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex h-full flex-col items-center justify-center">
            <div className="mb-3 text-4xl">🎨</div>
            <div className="text-sm font-semibold text-gray-700">Design Assets</div>
            <div className="text-xs text-gray-500">240+ Components</div>
          </div>
        </div>

        {/* Metrics card */}
        <div className="col-span-1 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-lg hover:ring-gray-200">
          <div className="mb-2 text-sm font-medium text-gray-700">Growth</div>
          <div className="flex items-end gap-1">
            {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
              <div
                key={i}
                className="w-3 rounded-full bg-gradient-to-t from-indigo-500 to-purple-400 transition-all duration-300 hover:opacity-80"
                style={{ height: `${h * 0.35}px` }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-gray-400">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Wide card */}
        <div className="col-span-2 rounded-3xl bg-gradient-to-r from-cyan-50 to-blue-50 p-6 ring-1 ring-cyan-100/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl">
              🚀
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Fast Deployment</h3>
              <p className="text-xs text-gray-500">Deploy to production in under 60 seconds with zero configuration.</p>
            </div>
            <button className="ml-auto rounded-xl bg-gray-900 px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800">
              Try it
            </button>
          </div>
        </div>

        {/* Quote card */}
        <div className="col-span-1 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 ring-1 ring-amber-100/50 transition-all duration-300 hover:shadow-lg">
          <div className="mb-2 text-2xl text-amber-400">&ldquo;</div>
          <p className="text-sm leading-relaxed text-gray-700 italic">
            The best design is the one you don&apos;t notice.
          </p>
          <div className="mt-3 text-[10px] font-medium text-gray-500">— Design Principle</div>
        </div>

        {/* Small icon card */}
        <div className="col-span-1 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 p-5 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/20">
          <div className="text-3xl">✨</div>
          <div className="mt-3 text-sm font-semibold">300+</div>
          <div className="text-xs text-white/70">Components</div>
        </div>
      </div>
    </div>
  );
}
