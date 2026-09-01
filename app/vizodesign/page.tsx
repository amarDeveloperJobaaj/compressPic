import Link from "next/link";
import { ArrowRight, Sparkles, Layers } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { SEED_DESIGNS, DESIGN_CATEGORIES } from "@/lib/vizodesign/seed";
import { DesignCard } from "@/components/vizodesign/DesignCard";

export default function VizoDesignPage() {
  const designs = SEED_DESIGNS.filter((d) => d.status === "published");

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative container-page py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              VIZODESIGN
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Find a design. Copy the rules. Build it with AI.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
              Explore modern web design systems with live previews and production-ready
              DESIGN.md instructions built for AI coding workflows.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#designs"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
              >
                Explore Designs
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 bg-transparent px-6 py-3 text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary-light/50"
              >
                <Layers className="h-4 w-4" />
                Browse Categories
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="container-page py-12">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {DESIGN_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/vizodesign/category/${cat.slug}`}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-primary/40 hover:text-primary"
            >
              {cat.name}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      <section id="designs" className="container-page pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary">All Designs</h2>
          <p className="mt-1 text-sm text-text-muted">
            {designs.length} design system{designs.length === 1 ? "" : "s"} available
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
