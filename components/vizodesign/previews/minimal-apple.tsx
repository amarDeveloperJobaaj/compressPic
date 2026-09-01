"use client";

export default function MinimalApple() {
  return (
    <div className="h-full w-full overflow-hidden bg-white font-sans">
      {/* Minimal nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 px-12 py-4 backdrop-blur-xl">
        <div className="text-base font-semibold text-gray-900">Minimalist</div>
        <div className="flex items-center gap-10">
          <span className="text-[13px] text-gray-500 transition-colors hover:text-gray-900">Product</span>
          <span className="text-[13px] text-gray-500 transition-colors hover:text-gray-900">Features</span>
          <span className="text-[13px] text-gray-500 transition-colors hover:text-gray-900">Pricing</span>
          <span className="text-[13px] text-gray-500 transition-colors hover:text-gray-900">Company</span>
        </div>
        <button className="rounded-full bg-gray-900 px-5 py-2 text-[13px] font-medium text-white transition-all hover:bg-gray-800">
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center px-12 pb-24 pt-32 text-center">
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-[11px] text-gray-500">
          <span className="h-1 w-1 rounded-full bg-green-500" />
          Now available
        </div>
        <h1 className="max-w-2xl text-[52px] font-semibold leading-[1.1] tracking-tight text-gray-900">
          Less clutter.
          <br />
          More clarity.
        </h1>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-gray-500">
          A design system built on the belief that simplicity is the ultimate sophistication.
        </p>
        <div className="mt-8 flex gap-3">
          <button className="rounded-full bg-gray-900 px-7 py-3 text-[13px] font-medium text-white transition-all hover:bg-gray-800">
            Start building
          </button>
          <button className="rounded-full border border-gray-200 px-7 py-3 text-[13px] font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50">
            Learn more
          </button>
        </div>
      </section>

      {/* Thin divider */}
      <div className="mx-auto h-px w-full max-w-4xl bg-gray-100" />

      {/* Product showcase */}
      <section className="px-12 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="text-[32px] font-semibold tracking-tight text-gray-900">Thoughtfully crafted</h2>
            <p className="mt-3 text-[15px] text-gray-500">Every detail considered. Nothing left to chance.</p>
          </div>

          {/* Feature cards - minimal grid */}
          <div className="grid grid-cols-2 gap-px bg-gray-100">
            {[
              { title: "Precision", desc: "Pixel-perfect components built with mathematical accuracy.", num: "01" },
              { title: "Simplicity", desc: "Strip away the unnecessary until only the essential remains.", num: "02" },
              { title: "Consistency", desc: "Unified design language across every touchpoint.", num: "03" },
              { title: "Accessibility", desc: "Designed for everyone, without exception.", num: "04" },
            ].map((f) => (
              <div key={f.num} className="bg-white p-10 transition-colors hover:bg-gray-50">
                <div className="mb-4 text-[10px] font-medium text-gray-300">{f.num}</div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">{f.title}</h3>
                <p className="text-[13px] leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-12 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 text-[40px] leading-none text-gray-200">&ldquo;</div>
          <p className="text-[20px] leading-relaxed text-gray-700">
            The most elegant design system I&apos;ve ever used. It makes everything else feel overdesigned.
          </p>
          <div className="mt-8">
            <div className="text-[13px] font-medium text-gray-900">Sarah Chen</div>
            <div className="text-[12px] text-gray-400">Head of Design, Vercel</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-12 pb-32">
        <div className="mx-auto max-w-xl rounded-3xl bg-gray-50 px-16 py-20 text-center ring-1 ring-gray-100">
          <h2 className="text-[28px] font-semibold tracking-tight text-gray-900">
            Ready to simplify?
          </h2>
          <p className="mt-3 text-[14px] text-gray-500">Start building beautiful interfaces today.</p>
          <button className="mt-8 rounded-full bg-gray-900 px-8 py-3 text-[13px] font-medium text-white transition-all hover:bg-gray-800">
            Get started for free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-12 py-8">
        <div className="flex items-center justify-between text-[12px] text-gray-400">
          <span>© 2024 Minimalist</span>
          <div className="flex gap-6">
            <span className="transition-colors hover:text-gray-600">Privacy</span>
            <span className="transition-colors hover:text-gray-600">Terms</span>
            <span className="transition-colors hover:text-gray-600">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
