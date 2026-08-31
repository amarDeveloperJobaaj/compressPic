"use client";

export default function LuxuryBlack() {
  return (
    <div className="h-full w-full overflow-hidden bg-[#0a0a0a] font-serif">
      {/* Thin gold top accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />

      {/* Navigation */}
      <nav className="flex items-center justify-between px-12 py-5">
        <div className="flex items-center gap-2">
          <span className="text-lg tracking-[0.3em] text-[#C9A96E]">LUXE</span>
        </div>
        <div className="flex items-center gap-10">
          <span className="text-[11px] tracking-[0.15em] text-white/40 uppercase transition-colors hover:text-[#C9A96E]">Collection</span>
          <span className="text-[11px] tracking-[0.15em] text-white/40 uppercase transition-colors hover:text-[#C9A96E]">Atelier</span>
          <span className="text-[11px] tracking-[0.15em] text-white/40 uppercase transition-colors hover:text-[#C9A96E]">Heritage</span>
          <span className="text-[11px] tracking-[0.15em] text-white/40 uppercase transition-colors hover:text-[#C9A96E]">Journal</span>
        </div>
        <div className="text-[11px] tracking-[0.15em] text-white/30 uppercase">+1 800 LUXE</div>
      </nav>

      {/* Divider */}
      <div className="mx-12 h-px bg-white/5" />

      {/* Hero */}
      <section className="flex flex-col items-center px-12 pb-20 pt-28 text-center">
        <div className="mb-6 text-[10px] tracking-[0.4em] text-[#C9A96E]/60 uppercase">Established 2024</div>
        <h1 className="max-w-xl text-[44px] font-light leading-[1.15] tracking-wide text-white">
          The Art of
          <br />
          <span className="italic text-[#C9A96E]">Refined</span> Design
        </h1>
        <div className="my-8 h-px w-16 bg-[#C9A96E]/30" />
        <p className="max-w-md text-[13px] leading-[1.8] text-white/30 font-light">
          Where timeless elegance meets modern vision. Each piece is a testament to the enduring pursuit of perfection.
        </p>
        <button className="mt-10 border border-[#C9A96E]/30 px-10 py-3 text-[11px] tracking-[0.2em] text-[#C9A96E] uppercase transition-all hover:border-[#C9A96E]/60 hover:bg-[#C9A96E]/5">
          Explore Collection
        </button>
      </section>

      {/* Product showcase */}
      <section className="px-12 pb-20">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-px bg-white/5">
          {[
            { name: "The Meridian", price: "$2,400", desc: "Hand-crafted timepiece" },
            { name: "The Aurora", price: "$1,850", desc: "Bespoke leather goods" },
            { name: "The Solstice", price: "$3,200", desc: "Limited edition" },
          ].map((item) => (
            <div key={item.name} className="group bg-[#0a0a0a] p-8 transition-colors hover:bg-[#0f0f0f]">
              <div className="mb-6 aspect-[3/4] rounded-sm bg-white/[0.02] ring-1 ring-white/5 transition-all group-hover:ring-[#C9A96E]/20" />
              <div className="text-[10px] tracking-[0.2em] text-[#C9A96E]/50 uppercase">{item.desc}</div>
              <h3 className="mt-2 text-sm font-light tracking-wide text-white">{item.name}</h3>
              <div className="mt-2 text-[12px] text-white/30 font-light">{item.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-12 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 text-[10px] tracking-[0.4em] text-[#C9A96E]/40 uppercase">Our Philosophy</div>
          <h2 className="text-[28px] font-light italic tracking-wide text-white/90">
            &ldquo;True luxury is found in restraint&rdquo;
          </h2>
          <div className="mx-auto my-8 h-px w-12 bg-[#C9A96E]/20" />
          <p className="mx-auto max-w-lg text-[13px] leading-[1.9] text-white/25 font-light">
            We believe that every element must earn its place. Nothing is added for decoration alone. 
            Each line, each curve, each proportion is the result of deliberate consideration and 
            unwavering standards.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="px-12 py-16">
        <div className="mx-auto max-w-2xl rounded-sm border border-white/5 bg-white/[0.01] px-16 py-16 text-center">
          <div className="mb-3 text-[10px] tracking-[0.3em] text-[#C9A96E]/40 uppercase">Private Consultation</div>
          <h3 className="text-[20px] font-light tracking-wide text-white">Begin Your Journey</h3>
          <p className="mt-3 text-[12px] text-white/30 font-light">Schedule a personal appointment with our design concierge.</p>
          <button className="mt-8 border border-[#C9A96E]/30 px-8 py-2.5 text-[11px] tracking-[0.15em] text-[#C9A96E] uppercase transition-all hover:border-[#C9A96E]/60 hover:bg-[#C9A96E]/5">
            Request Appointment
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-12 pb-12">
        <div className="mx-auto h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="flex items-center justify-between pt-8">
          <div className="text-[10px] tracking-[0.3em] text-white/20 uppercase">© 2024 Luxe</div>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Shipping"].map((link) => (
              <span key={link} className="text-[10px] tracking-[0.15em] text-white/20 uppercase transition-colors hover:text-[#C9A96E]/60">
                {link}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
