import Link from "next/link";
import { ALL_TOOLS } from "@/lib/tools";

/**
 * "Related Tools" internal-linking section. Driven by the tools registry, so
 * new tools automatically appear here — no page is ever left isolated.
 */
export function RelatedTools({ excludeSlug }: { excludeSlug?: string }) {
  const related = ALL_TOOLS.filter((tool) => tool.slug !== excludeSlug);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Related Tools
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Try more free browser-based image tools.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.href}
              className="group rounded-xl border border-border bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
            >
              <p className="font-semibold text-text-primary transition-colors group-hover:text-primary">
                {tool.name}
              </p>
              <p className="mt-1 text-sm text-text-secondary">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
