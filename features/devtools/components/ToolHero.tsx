"use client";

import type { LucideIcon } from "lucide-react";

interface ToolHeroProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Consistent page header for every developer tool (icon tile + H1 + subtitle). */
export function ToolHero({ icon: Icon, title, description }: ToolHeroProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-lg text-text-secondary">{description}</p>
    </div>
  );
}
