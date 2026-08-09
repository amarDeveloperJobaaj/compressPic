import { Building2 } from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { Reveal } from "../motion/Reveal";

/**
 * Company preparation section (§19).
 *
 * Practice interviews inspired by commonly reported interview patterns and
 * role expectations. NO affiliation claim — the disclaimer is prominent.
 */

const COMPANIES = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Apple",
  "Adobe",
  "Netflix",
  "Oracle",
  "TCS",
  "Infosys",
  "Accenture",
];

export function CompanyShowcase() {
  return (
    <section className="border-t border-border bg-surface py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Capsule variant="violet" sm dot className="mb-4">
            Company Preparation
          </Capsule>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Practice for the companies you&apos;re targeting
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Practice interviews inspired by common interview patterns and roles.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-3">
          {COMPANIES.map((company, index) => (
            <Reveal key={company} delay={(index % 6) * 0.05}>
              <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-text-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
                <Building2 className="h-4 w-4 text-primary/60" />
                {company}
              </span>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-relaxed text-text-muted">
          Company names are trademarks of their respective owners. Vizo Tool is
          not affiliated with, endorsed by, or sponsored by any of these
          companies. Simulations are based on publicly reported interview
          patterns and role expectations only.
        </p>
      </div>
    </section>
  );
}
