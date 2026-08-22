export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portfolio-root portfolio-dark pf-noise relative min-h-screen" style={{ color: "var(--pf-text)", background: "var(--pf-bg)" }}>
      {children}
    </div>
  );
}
