export function PortfolioFooter() {
  return (
    <footer className="border-t border-[var(--pf-border)] bg-[var(--pf-bg)]">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="text-sm font-bold tracking-tight text-[var(--pf-text)]">AMAR LODHI</p>
            <p className="font-[var(--pf-mono)] text-[10px] tracking-[0.2em] text-[var(--pf-text-3)]">SOFTWARE ENGINEER</p>
          </div>
          <p className="font-[var(--pf-mono)] text-[10px] tracking-wider text-[var(--pf-text-3)]">BUILT WITH REACT / NEXT.JS / NODE.JS / AI</p>
          <p className="font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-3)]">&copy; {new Date().getFullYear()} AMAR LODHI</p>
        </div>
        <div className="mt-8 text-center">
          <a href="/" className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-4 py-1.5 font-[var(--pf-mono)] text-[10px] tracking-wider text-[var(--pf-text-3)] transition-all hover:border-[var(--pf-accent)]/30 hover:text-[var(--pf-accent)]">
            &larr; BACK TO VIZOTOOL
          </a>
        </div>
      </div>
    </footer>
  );
}
