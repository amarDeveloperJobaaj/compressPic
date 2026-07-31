import { howToSchema } from "@/lib/seo";
import type { HowToStep } from "@/lib/seo-content";
import { JsonLd } from "./JsonLd";

/** Numbered How-To steps section that also emits HowTo JSON-LD. */
export function HowToSection({
  heading,
  description,
  steps,
}: {
  heading: string;
  description: string;
  steps: HowToStep[];
}) {
  if (steps.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <JsonLd data={howToSchema({ name: heading, description, steps })} />
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-3 text-lg text-text-secondary">{description}</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-xl font-bold text-primary">
                {index + 1}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-text-primary">{step.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
