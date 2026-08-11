import { Check } from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Pricing placeholder (§23). Visual only — no payment implementation.
 * One honest tier is live (Free); the rest are shown as coming-soon previews.
 */

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to start practicing today.",
    features: ["Unlimited basic interviews", "Resume-based questions", "AI score report", "Text answers"],
    cta: "Start Free Interview",
    href: "/ai-mock-interview/setup",
    highlight: true,
  },
  {
    name: "Pro",
    price: "—",
    period: "coming soon",
    description: "For serious preparation with deeper analytics.",
    features: ["Everything in Free", "Advanced voice interviews", "Company-pattern packs", "Progress dashboard"],
    cta: "Get notified",
    href: "/ai-mock-interview",
    highlight: false,
  },
  {
    name: "Teams",
    price: "—",
    period: "coming soon",
    description: "For colleges and career programs.",
    features: ["Everything in Pro", "Candidate management", "Group analytics", "Priority support"],
    cta: "Contact us",
    href: "/ai-mock-interview",
    highlight: false,
  },
];

export function PricingPreview() {
  return (
    <section className="border-t border-border bg-surface py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Capsule variant="amber" sm dot className="mb-4">
            Pricing
          </Capsule>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Start free. Upgrade when you&apos;re ready.
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            AI interview practice is free today. Paid plans are shown as a
            preview and are not available yet.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlight
                  ? "relative flex flex-col rounded-2xl border-2 border-primary bg-background p-6 shadow-2xl shadow-primary/15"
                  : "flex flex-col rounded-2xl border border-border bg-background p-6 opacity-80"
              }
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-base font-semibold text-text-primary">{plan.name}</h3>
              <p className="mt-3 text-3xl font-bold text-text-primary">
                {plan.price}
                <span className="text-sm font-medium text-text-muted"> / {plan.period}</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">{plan.description}</p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-text-secondary">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button asChild variant={plan.highlight ? "primary" : "secondary"} size="sm" className="mt-6 w-full">
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-text-muted">
          Pricing preview — plans, features, and prices may change before launch.
          No payment is collected today.
        </p>
      </div>
    </section>
  );
}
