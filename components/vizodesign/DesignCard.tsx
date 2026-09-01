"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { Design } from "@/lib/vizodesign/types";
import { DESIGN_CATEGORIES } from "@/lib/vizodesign/seed";
import dynamic from "next/dynamic";

const DesignPreview = dynamic(() => import("./DesignPreview"), { ssr: false });

interface DesignCardProps {
  design: Design;
  categoryName?: string;
}

const THEME_BADGES: Record<string, { label: string; className: string }> = {
  dark: { label: "Dark", className: "bg-gray-800 text-gray-200 border-gray-700" },
  light: { label: "Light", className: "bg-gray-100 text-gray-800 border-gray-200" },
  both: { label: "Dark / Light", className: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700" },
};

export function DesignCard({ design, categoryName }: DesignCardProps) {
  const [copied, setCopied] = useState(false);

  const category = categoryName ?? DESIGN_CATEGORIES.find((c) => c.id === design.category_id)?.name;
  const themeBadge = THEME_BADGES[design.theme];

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(design.design_markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  return (
    <Link href={`/vizodesign/${design.slug}`} className="group block">
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-xl hover:border-primary/30",
          "border-border bg-surface"
        )}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
          <div className="absolute inset-0">
            <DesignPreview slug={design.slug} />
          </div>
          {design.featured && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
              Featured
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
              {design.name}
            </h3>
            {themeBadge && (
              <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium", themeBadge.className)}>
                {themeBadge.label}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-text-secondary line-clamp-2">
            {design.short_description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {category && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {category}
              </span>
            )}
            {design.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-background px-2 py-0.5 text-[10px] font-medium text-text-muted border border-border">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Eye className="h-3.5 w-3.5" />
              View Design
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/30 hover:text-primary"
              aria-label={`Copy DESIGN.md for ${design.name}`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy DESIGN.md
                </>
              )}
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
