import { ChevronDown } from "lucide-react";
import type { CategoryPageConfig } from "@/lib/category-pages";

/** FAQ accordion (native <details> — accessible, server-rendered, no JS needed). */
export function CategoryFaq({ category }: { category: CategoryPageConfig }) {
  return (
    <section className="border-t border-border bg-surface py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Everything you want to know about {category.label.toLowerCase()}.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl space-y-4">
          {category.faqs.map((faq) => (
            <details
              key={faq.question}
              className="group cursor-pointer rounded-xl border border-border bg-background transition-all hover:border-primary/40 hover:shadow-md"
            >
              <summary className="flex items-center justify-between px-6 py-4 text-sm font-medium text-text-primary">
                {faq.question}
                <ChevronDown className="ml-4 h-4 w-4 shrink-0 text-text-muted transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="border-t border-border px-6 py-4">
                <p className="text-sm leading-relaxed text-text-secondary">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
