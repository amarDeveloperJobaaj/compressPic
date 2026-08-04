import Link from "next/link";
import { ArrowRight, BookOpen, Check, Lightbulb, Sparkles, X } from "lucide-react";
import type { CategoryPageConfig } from "@/lib/category-pages";
import { CATEGORY_PAGES, getCategoryTools } from "@/lib/category-pages";
import { Capsule } from "@/components/ui/capsule";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageSchema, howToSchema } from "@/lib/seo";

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Capsule variant="primary" sm dot className="mb-4">
        {eyebrow}
      </Capsule>
      <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-lg text-text-secondary">{subtitle}</p>}
    </div>
  );
}

/** Educational content sections for a category landing page. */
export function CategorySeoContent({ category }: { category: CategoryPageConfig }) {
  const otherCategories = CATEGORY_PAGES.filter((c) => c.slug !== category.slug);

  return (
    <>
      {/* JSON-LD: HowTo + FAQ derived from the config (programmatic SEO) */}
      <JsonLd
        data={howToSchema({
          name: `How to use ${category.label}`,
          description: category.heroDescription,
          steps: category.howTo.map((step) => ({
            name: step.title,
            text: step.description,
          })),
        })}
      />
      <JsonLd data={faqPageSchema(category.faqs)} />

      {/* Intro */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
              <span>By Vizo Tool</span>
              <span aria-hidden="true">·</span>
              <span>Last updated August 2026</span>
              <span aria-hidden="true">·</span>
              <span>{Math.max(3, Math.round(category.intro.join(" ").split(" ").length / 200))} min read</span>
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {category.label}: Everything in One Place
            </h2>
            {category.intro.map((paragraph, index) => (
              <p key={index} className="mt-4 text-lg leading-relaxed text-text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why choose"
            title={`Why Use ${category.label}?`}
            subtitle="Free, private and built for real workflows."
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
            {category.benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group rounded-xl border border-border bg-background p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              >
                <h3 className="flex items-center gap-2 font-semibold text-text-primary">
                  <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${category.gradient}`} />
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Features"
            title="What’s Inside"
            subtitle="Every tool ships with the essentials and then some."
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
            {category.features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              >
                <h3 className="font-semibold text-text-primary">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="How to use"
            title={`How to Use ${category.label}`}
            subtitle="A simple, repeatable workflow."
          />
          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {category.howTo.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-xl border border-border bg-background p-5 transition-all duration-300 hover:border-primary/40"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} text-sm font-bold text-white shadow-md`}
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-text-primary">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases + best practices */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-text-primary">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Common Use Cases
              </h2>
              <ul className="mt-5 space-y-3">
                {category.useCases.map((useCase) => (
                  <li key={useCase} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-light text-success">
                      <Check className="h-3 w-3" />
                    </span>
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-text-primary">
                <Sparkles className="h-5 w-5 text-sky-500" />
                Best Practices
              </h2>
              <ul className="mt-5 space-y-3">
                {category.bestPractices.map((practice) => (
                  <li key={practice} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                      <Check className="h-3 w-3" />
                    </span>
                    {practice}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Common mistakes */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Avoid these"
            title="Common Mistakes to Avoid"
            subtitle="Small habits that save you time and frustration."
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.commonMistakes.map((mistake) => (
              <div
                key={mistake}
                className="rounded-xl border border-rose-400/30 bg-rose-500/5 p-5 transition-all duration-300 hover:border-rose-400/60 hover:shadow-lg hover:shadow-rose-500/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-500">
                  <X className="h-4 w-4" />
                </span>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{mistake}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related categories */}

      <section className="border-t border-border py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Explore more"
            title="Related Tool Categories"
            subtitle="More free tools, right around the corner."
          />
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
            {otherCategories.map((other) => {
              return (
                <Link
                  key={other.slug}
                  href={`/${other.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-primary/40 hover:bg-primary-light/50 hover:text-primary"
                >
                  <BookOpen className="h-4 w-4 text-primary" />
                  {other.label}
                  <span className="text-xs text-text-muted">
                    ({getCategoryTools(other).length})
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
