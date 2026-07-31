import { softwareApplicationSchema } from "@/lib/seo";
import { getConversionSeoContent } from "@/lib/seo-content";
import type { ConversionPair } from "@/features/converter/utils/pairs";
import { JsonLd } from "./JsonLd";
import { HowToSection } from "./HowToSection";
import { FaqSection } from "./FaqSection";
import { RelatedTools } from "./RelatedTools";

/**
 * Full SEO content block for a dedicated conversion page (e.g. /jpg-to-png):
 * intro, how-to, FAQ, related tools + SoftwareApplication JSON-LD.
 * Content is generated from the pair's from/to formats.
 */
export function ConversionSeoContent({ pair }: { pair: ConversionPair }) {
  const content = getConversionSeoContent(pair);
  const title = `${pair.from.label} to ${pair.to.label} Converter`;

  return (
    <>
      <JsonLd
        data={softwareApplicationSchema({
          name: title,
          description: pair.description,
          url: `/${pair.slug}`,
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

      <HowToSection
        heading={content.howTo.heading}
        description={content.howTo.description}
        steps={content.howTo.steps}
      />

      <FaqSection faqs={content.faqs} />

      <RelatedTools excludeSlug={pair.slug} />
    </>
  );
}
