"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageDown, Menu, X } from "lucide-react";
import { TOOL_CATEGORIES } from "@/lib/tools";
import { CONVERSION_PAIRS } from "@/features/converter/utils/pairs";
import { NavDropdown, type NavLinkItem } from "./NavDropdown";
import { ThemeToggle } from "./ThemeToggle";

const pageLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// "Convert" dropdown items — every dedicated conversion page (from the registry)
const convertItems: NavLinkItem[] = [
  { label: "Convert Any Format", href: "/convert" },
  ...CONVERSION_PAIRS.map((pair) => ({
    label: `${pair.from.label} → ${pair.to.label}`,
    href: `/${pair.slug}`,
  })),
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <ImageDown className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:inline">CompressPix</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
          >
            Home
          </Link>

          {/* One dropdown per tool category (Image Tools today, Developer Tools later) */}
          {TOOL_CATEGORIES.map((category) => (
            <NavDropdown
              key={category.id}
              label={category.label}
              items={category.tools.map((tool) => ({
                label: tool.name,
                href: tool.href,
              }))}
            />
          ))}

          {/* Convert dropdown — all dedicated conversion pages */}
          <NavDropdown label="Convert" items={convertItems} />

          {pageLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-light hover:text-primary md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Mobile Theme Toggle */}
        <div className="flex md:hidden">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
              >
                Home
              </Link>

              {TOOL_CATEGORIES.map((category) => (
                <div key={category.id}>
                  <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    {category.label}
                  </p>
                  {category.tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={tool.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-lg py-3 pl-8 pr-4 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              ))}

              {/* Convert section — all dedicated conversion pages */}
              <div>
                <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Convert
                </p>
                {convertItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg py-3 pl-8 pr-4 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {pageLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
