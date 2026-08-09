import { Capsule, type CapsuleVariant } from "@/components/ui/capsule";

const SKILLS = [
  "React",
  "Node.js",
  "MongoDB",
  "System Design",
  "DSA",
  "SQL",
  "DevOps",
  "Behavioral",
  "HR Round",
  "Leadership",
  "Debugging",
  "REST APIs",
];

const VARIANTS: CapsuleVariant[] = ["primary", "violet", "success", "teal", "sky", "fuchsia", "amber"];

/** Infinite marquee of interview topics — pauses on hover. */
export function SkillsMarquee() {
  const items = SKILLS.map((label, i) => ({
    label,
    variant: VARIANTS[i % VARIANTS.length],
  }));

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-border bg-surface/60 py-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <div className="flex w-max animate-marquee gap-3 will-change-transform hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, i) => (
          <Capsule key={`${item.label}-${i}`} variant={item.variant} interactive={false}>
            {item.label}
          </Capsule>
        ))}
      </div>
    </div>
  );
}
