"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { TOOL_CATEGORIES } from "@/lib/tools";
import { CATEGORY_PAGE_BY_CATEGORY_ID } from "@/lib/category-pages";
import { getToolIcon } from "@/lib/tool-icons";
import { Logo } from "@/components/ui/Logo";
import {
  NavDropdown,
  CONVERT_NAV_ITEMS,
  MORE_NAV_ITEMS,
  type NavDropdownSection,
} from "./NavDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { MobileDrawer } from "./MobileDrawer";
import { cn } from "@/lib/utils";

/** Build the dropdown sections for a category; Image Tools also embeds Convert. */
function buildSections(categoryId: string): NavDropdownSection[] {
  const category = TOOL_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return [];

  const toolsSection: NavDropdownSection = {
    items: category.tools.map((tool) => ({
      label: tool.name,
      href: tool.href,
      description: tool.description,
      icon: getToolIcon(tool.slug),
      badge: tool.badge === "New" ? undefined : tool.badge,
    })),
  };

  if (categoryId === "image") {
    return [
      toolsSection,
      { title: "Convert Formats", items: CONVERT_NAV_ITEMS, columns: 3 },
    ];
  }

  return [toolsSection];
}

/** Short nav label override (kept out of the tools registry to avoid bloating it). */
const NAV_LABELS: Record<string, string> = {
  youtube: "YouTube",
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Right-aligned categories sit near the viewport edge — anchor their panels right.
  const RIGHT_ALIGNED = new Set(["seo"]);

  // backdrop-blur is re-composited on every scroll frame, so keep the radius
  // modest (md) on the sticky header — visually close to lg but much cheaper.
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      {/* Premium gradient hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Vizo Tool — home">
          <span className="relative isolate inline-flex transition-transform duration-300 group-hover:scale-105">
            <span
              aria-hidden="true"
              className="absolute -inset-1 -z-10 rounded-2xl bg-primary/50 blur-lg"
            />
            <Logo size={36} />
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-text-primary sm:inline">
            Vizo
            <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
              Tool
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          <Link
            href="/"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              pathname === "/"
                ? "bg-primary-light text-primary"
                : "text-text-secondary hover:bg-primary-light/70 hover:text-primary"
            )}
          >
            Home
          </Link>

          {TOOL_CATEGORIES.filter((c) => c.id !== "ai").map((category) => {
            const categoryPage = CATEGORY_PAGE_BY_CATEGORY_ID[category.id];
            return (
              <NavDropdown
                key={category.id}
                label={NAV_LABELS[category.id] ?? category.label}
                sections={buildSections(category.id)}
                align={RIGHT_ALIGNED.has(category.id) ? "right" : "left"}
                footerLink={
                  categoryPage
                    ? { label: `View all ${category.label}`, href: `/${categoryPage}` }
                    : undefined
                }
                badge={category.id === "ai" ? "Popular" : undefined}
                glow={category.id === "ai"}
              />
            );
          })}

          <NavDropdown
            label="More"
            sections={[{ items: MORE_NAV_ITEMS }]}
            align="right"
          />
          <div className="ml-1">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <MobileDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
