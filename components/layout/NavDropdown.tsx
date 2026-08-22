"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowRight,
  ChevronDown,
  FileImage,
  Globe,
  Image as ImageIcon,
  Info,
  Mail,
  Newspaper,
  Shapes,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { CONVERSION_PAIRS } from "@/features/converter/utils/pairs";
import { cn } from "@/lib/utils";

export interface NavLinkItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
}

export interface NavDropdownSection {
  title?: string;
  items: NavLinkItem[];
  /** Optional column override (defaults to a count-based grid). */
  columns?: number;
}

const FORMAT_ICONS: Record<string, LucideIcon> = {
  PNG: ImageIcon,
  JPG: FileImage,
  WEBP: Globe,
  AVIF: Sparkles,
  SVG: Shapes,
  HEIC: Smartphone,
};

/**
 * Every dedicated conversion page (from the registry) — shared by the desktop
 * "Image Tools → Convert" section and the mobile drawer so the links never
 * drift apart.
 */
/**
 * Secondary page links grouped under the "More" dropdown — shared by the
 * desktop header and the mobile drawer so they never drift apart.
 */
export const MORE_NAV_ITEMS: NavLinkItem[] = [
  {
    label: "Portfolio",
    href: "/portfolio",
    description: "Amar Lodhi — Software Engineer",
    icon: Sparkles,
  },
  {
    label: "Blog",
    href: "/blogs",
    description: "Tips, guides & product updates",
    icon: Newspaper,
  },
  {
    label: "About",
    href: "/about",
    description: "The story behind Vizo Tool",
    icon: Info,
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Get in touch with the team",
    icon: Mail,
  },
];

export const CONVERT_NAV_ITEMS: NavLinkItem[] = [
  {
    label: "Convert Any Format",
    href: "/convert",
    description: "JPG, PNG, WEBP, AVIF & more",
    icon: ArrowLeftRight,
    badge: "Free",
  },
  ...CONVERSION_PAIRS.map((pair) => ({
    label: `${pair.from.label} → ${pair.to.label}`,
    href: `/${pair.slug}`,
    description: `${pair.from.label} to ${pair.to.label} in your browser`,
    icon: FORMAT_ICONS[pair.to.label] ?? ArrowLeftRight,
  })),
];

interface NavDropdownProps {
  label: string;
  /** Sections rendered inside the panel (e.g. "Image Tools" + "Convert"). */
  sections: NavDropdownSection[];
  /** Align the panel to the right edge of the trigger (avoids viewport overflow). */
  align?: "left" | "right";
  /** Optional "View all" link rendered in the footer strip (internal linking). */
  footerLink?: { label: string; href: string };
  /** Small pill badge shown next to the trigger label (e.g. "Popular"). */
  badge?: string;
  /** Colorful animated glow on the trigger (used to spotlight AI Tools). */
  glow?: boolean;
}

/** Static column classes so Tailwind can see them at build time. */
const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

/** Column count for a horizontal grid based on the number of items. */
function gridCols(count: number, columns?: number): string {
  if (columns) return GRID_COLS[columns] ?? "grid-cols-2";
  if (count >= 9) return "grid-cols-3";
  if (count >= 5) return "grid-cols-2";
  return "grid-cols-1";
}

/** Panel width tuned to how many items it needs to hold horizontally. */
function panelWidth(count: number): string {
  if (count >= 9) return "w-[640px] max-w-[calc(100vw-1rem)]";
  if (count >= 5) return "w-[520px] max-w-[calc(100vw-1rem)]";
  return "w-72";
}

/**
 * Premium header mega-menu. Opens on hover (desktop) and on click
 * (touch/keyboard), closes on outside pointer-down, Escape, or navigation.
 * Items render in a horizontal multi-column grid (like Vercel/Linear menus)
 * instead of a long vertical list.
 */
export function NavDropdown({
  label,
  sections,
  align = "left",
  footerLink,
  badge,
  glow = false,
}: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverOpenedRef = useRef(false);

  const itemCount = sections.reduce((sum, s) => sum + s.items.length, 0);

  const open = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    hoverOpenedRef.current = true;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  const handleClick = useCallback(() => {
    if (hoverOpenedRef.current) {
      hoverOpenedRef.current = false;
      return;
    }
    setIsOpen((prev) => !prev);
  }, []);

  // Close on outside pointer-down or Escape while open
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Clear any pending close timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Keep the panel fully inside the viewport — wide mega-menus (e.g. Finance
  // Tools, last in the header) would otherwise spill past the right edge.
  useLayoutEffect(() => {
    if (!isOpen) return;
    const trigger = containerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;

    const position = () => {
      const rect = trigger.getBoundingClientRect();
      const width = panel.offsetWidth;
      const margin = 8;
      // Panel offset is relative to the containing block (containerRef), so
      // clamp the desired *viewport* position, then convert to container coords.
      let vpLeft = align === "right" ? rect.right - width : rect.left;
      vpLeft = Math.max(margin, Math.min(vpLeft, window.innerWidth - width - margin));
      panel.style.left = `${vpLeft - rect.left}px`;
      panel.style.right = "auto";
    };

    position();
    window.addEventListener("resize", position);
    // Note: inline styles are intentionally NOT reset on cleanup — the panel is
    // still mounted during the exit fade, and they get recomputed on every open.
    return () => window.removeEventListener("resize", position);
  }, [isOpen, align, itemCount]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={open}
      onMouseLeave={close}
    >
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "group flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
          glow
            ? "animate-[nav-ai-glow_3s_ease-in-out_infinite,nav-ai-bg_4s_linear_infinite] bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 bg-[length:200%_auto] text-white motion-reduce:animate-none"
            : isOpen
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "text-text-secondary hover:bg-primary-light/70 hover:text-primary",
          glow && isOpen ? "ring-2 ring-white/40" : null
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
        {badge && (
          <span className="rounded-full bg-white px-1.5 py-px text-[10px] font-bold text-violet-700">
            {badge}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={cn(
              "absolute top-full z-50 mt-3 overflow-hidden rounded-2xl border border-border/80 bg-surface/95 shadow-2xl shadow-black/10 backdrop-blur-xl",
              panelWidth(itemCount)
            )}
          >
            {/* Gradient hairline on top */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

            <div className="max-h-[min(70vh,34rem)] overflow-y-auto p-2.5">
              {sections.map((section) => (
                <div key={section.title ?? "section"} className="mb-1 last:mb-0">
                  {section.title && (
                    <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                      {section.title}
                    </p>
                  )}
                  <div className={cn("grid gap-1", gridCols(section.items.length, section.columns))}>
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-primary-light/70"
                      >
                        {item.icon && (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10 transition-all duration-200 group-hover/item:from-primary group-hover/item:to-sky-500 group-hover/item:text-white group-hover/item:ring-primary/20">
                            <item.icon className="h-4 w-4" />
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span className="shrink-0 rounded-full bg-success-light px-1.5 py-px text-[10px] font-semibold text-success">
                                {item.badge}
                              </span>
                            )}
                          </span>
                          {item.description && (
                            <span className="block truncate text-xs text-text-muted">
                              {item.description}
                            </span>
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer strip */}
            <div className="flex items-center justify-between gap-2 border-t border-border/60 bg-background/40 px-4 py-2">
              <span className="text-[11px] font-medium text-text-muted">
                100% free · No sign-up
              </span>
              {footerLink && (
                <Link
                  href={footerLink.href}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  {footerLink.label}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
