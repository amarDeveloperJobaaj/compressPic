import { Check, Image as ImageIcon, ShieldCheck, Zap } from "lucide-react";
import type { CategoryPageConfig } from "@/lib/category-pages";
import { getCategoryTools } from "@/lib/category-pages";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Spotlight } from "@/components/ui/spotlight";
import { Capsule, type CapsuleVariant } from "@/components/ui/capsule";
import { CATEGORY_ICONS } from "./CategoryIcon";

export function CategoryHero({ category }: { category: CategoryPageConfig }) {
  const tools = getCategoryTools(category);
  const Icon = CATEGORY_ICONS[category.slug] ?? ImageIcon;

  const stats = [
    { label: "Free tools", value: String(tools.length) },
    { label: "Uploads", value: "0" },
    { label: "Sign-up needed", value: "None" },
    { label: "Runs in", value: "Browser" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Animated background layers (same pattern as the homepage) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/40 via-background to-background" />
        <BackgroundBeams />
        <GridPattern className="text-primary" />
      </div>
      <Spotlight
        id="category-hero-spotlight"
        className="-top-40 left-0 md:-top-24 md:left-1/4"
        fill="var(--color-primary)"
      />

      <div className="container-page relative py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <Capsule variant={category.accent as CapsuleVariant} dot glow>
            {category.heroBadge}
          </Capsule>

          <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg sm:h-16 sm:w-16">
            <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>

          <h1 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl">
            {category.h1}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-text-secondary">
            {category.heroDescription}
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-text-muted">
            {stats.map((stat) => (
              <span key={stat.label} className="flex items-center gap-1.5">
                <span className="font-semibold text-text-primary">{stat.value}</span>
                {stat.label}
              </span>
            ))}
          </div>

          {/* Trust pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <Capsule variant="success" icon={Check} sm>
              100% Private
            </Capsule>
            <Capsule variant="primary" icon={Zap} sm>
              Instant Results
            </Capsule>
            <Capsule variant="violet" icon={ShieldCheck} sm>
              No Uploads
            </Capsule>
          </div>
        </div>
      </div>
    </section>
  );
}
