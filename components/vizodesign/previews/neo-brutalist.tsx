"use client";

import { cn } from "@/lib/utils";

export default function NeoBrutalist() {
  return (
    <div className="h-full w-full overflow-hidden bg-white font-mono">
      {/* Grid lines */}
      <div className="pointer-events-none absolute inset-0 z-0" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 79px, #e5e5e5 79px, #e5e5e5 80px), repeating-linear-gradient(90deg, transparent, transparent 79px, #e5e5e5 79px, #e5e5e5 80px)",
      }} />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b-[3px] border-black">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-[3px] border-black bg-yellow-300 text-sm font-bold">
                NB
              </div>
              <span className="text-lg font-bold uppercase tracking-wider">NeoBrutalist</span>
            </div>
            <nav className="flex gap-0">
              {["Work", "About", "Contact"].map((item, i) => (
                <span
                  key={item}
                  className={cn(
                    "border-[3px] border-black px-5 py-2 text-sm font-bold uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                    i > 0 && "-ml-[3px]",
                    item === "Work" ? "bg-black text-white" : "bg-white text-black"
                  )}
                >
                  {item}
                </span>
              ))}
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="border-b-[3px] border-black px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 inline-block border-[3px] border-black bg-yellow-300 px-3 py-1 text-xs font-bold uppercase">
              Design Studio
            </div>
            <h1 className="text-6xl font-black uppercase leading-[0.9] tracking-tight">
              We make
              <br />
              <span className="inline-block bg-black px-4 py-2 text-white">digital</span> things
            </h1>
            <p className="mt-6 max-w-md border-l-[3px] border-black pl-4 text-sm text-gray-600">
              No fancy gradients. No subtle shadows. Just raw, honest design that speaks for itself. Based in Brooklyn.
            </p>
            <button className="mt-8 border-[3px] border-black bg-black px-8 py-3 text-sm font-bold uppercase text-white transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-800">
              View Projects →
            </button>
          </div>
        </section>

        {/* Grid cards */}
        <div className="grid grid-cols-3">
          {[
            { num: "01", title: "Brand Identity", desc: "Logo systems, color palettes, and guidelines that actually work.", bg: "bg-pink-200" },
            { num: "02", title: "Web Design", desc: "Responsive interfaces with intentional grid systems.", bg: "bg-blue-200" },
            { num: "03", title: "Motion Design", desc: "Micro-interactions that make interfaces feel alive.", bg: "bg-green-200" },
          ].map((card, i) => (
            <div
              key={card.num}
              className={cn(
                "group border-b-[3px] border-black p-6 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
                card.bg,
                i < 2 && "border-r-[3px]"
              )}
            >
              <div className="mb-3 text-xs font-bold text-gray-500">{card.num}</div>
              <h3 className="mb-2 text-xl font-black uppercase">{card.title}</h3>
              <p className="text-sm text-gray-700">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 border-t-[3px] border-black">
          {[
            { value: "127", label: "Projects" },
            { value: "48", label: "Clients" },
            { value: "12", label: "Awards" },
            { value: "∞", label: "Caffeine" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "border-b-[3px] border-black px-6 py-8 text-center transition-all hover:bg-yellow-100",
                i < 3 && "border-r-[3px]"
              )}
            >
              <div className="text-4xl font-black">{stat.value}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="border-t-[3px] border-black bg-black px-6 py-6 text-center">
          <p className="text-sm font-bold uppercase text-white">
            © 2024 NeoBrutalist Studio — No rights reserved. Steal our designs.
          </p>
        </footer>
      </div>
    </div>
  );
}
