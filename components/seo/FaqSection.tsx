import { faqPageSchema } from "@/lib/seo";
import type { Faq } from "@/lib/seo-content";
import { JsonLd } from "./JsonLd";

/** FAQ accordion section that also emits FAQPage JSON-LD. */
export function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface py-16 sm:py-20">
      <div className="container-page">
        <JsonLd data={faqPageSchema(faqs)} />
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group cursor-pointer rounded-xl border border-border bg-background transition-all hover:border-text-muted"
            >
              <summary className="flex items-center justify-between px-6 py-4 text-sm font-medium text-text-primary">
                {faq.question}
                <span className="ml-4 shrink-0 text-text-muted transition-transform group-open:rotate-180">
                  ▼
                </span>
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
