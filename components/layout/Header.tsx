"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ImageDown, Menu } from "lucide-react";
import { TOOL_CATEGORIES } from "@/lib/tools";
import { getToolIcon } from "@/lib/tool-icons";
import { NavDropdown, CONVERT_NAV_ITEMS, type NavDropdownSection } from "./NavDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { MobileDrawer } from "./MobileDrawer";
import { cn } from "@/lib/utils";

const pageLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

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
  analysis: "Analysis",
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Right-aligned categories sit near the viewport edge — anchor their panels right.
  const RIGHT_ALIGNED = new Set(["seo", "analysis"]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
      {/* Premium gradient hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative isolate flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-sky-500 shadow-lg shadow-primary/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/50">
            <span className="absolute inset-0 -z-10 animate-glow-pulse rounded-xl bg-primary/60 blur-md" />
            <ImageDown className="relative h-5 w-5 text-white" />
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-text-primary sm:inline">
            Compress
            <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
              Pix
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

          {TOOL_CATEGORIES.map((category) => (
            <NavDropdown
              key={category.id}
              label={NAV_LABELS[category.id] ?? category.label}
              sections={buildSections(category.id)}
              align={RIGHT_ALIGNED.has(category.id) ? "right" : "left"}
            />
          ))}

          {pageLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                pathname === link.href
                  ? "bg-primary-light text-primary"
                  : "text-text-secondary hover:bg-primary-light/70 hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
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
