import { softwareApplicationSchema } from "@/lib/seo";
import { TOOL_SEO_CONTENT } from "@/lib/seo-content";
import { getToolBySlug } from "@/lib/tools";
import { JsonLd } from "./JsonLd";
import { HowToSection } from "./HowToSection";
import { FaqSection } from "./FaqSection";
import { RelatedTools } from "./RelatedTools";

/**
 * Full SEO content block for a tool page: intro, benefits, features,
 * how-to, FAQ, related tools — plus SoftwareApplication JSON-LD.
 * Rendered by the route layout so the client tool page stays untouched.
 */
export function ToolSeoContent({ slug }: { slug: string }) {
  const tool = getToolBySlug(slug);
  const content = TOOL_SEO_CONTENT[slug];
  if (!tool || !content) return null;

  return (
    <>
      <JsonLd
        data={softwareApplicationSchema({
          name: tool.name,
          description: tool.description,
          url: tool.href,
        })}
      />

      {/* Intro */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {content.intro.heading}
            </h2>
            {content.intro.paragraphs.map((paragraph, index) => (
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
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Why Use {tool.name}?
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
            {content.benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-border bg-background p-6"
              >
                <h3 className="font-semibold text-text-primary">{benefit.title}</h3>
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
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Features
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
            {content.features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-surface p-6"
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

      <HowToSection
        heading={content.howTo.heading}
        description={content.howTo.description}
        steps={content.howTo.steps}
      />

      <FaqSection faqs={content.faqs} />

      <RelatedTools excludeSlug={slug} />
    </>
  );
}
