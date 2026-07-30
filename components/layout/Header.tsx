"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Compress", href: "/compress" },
  { label: "Resize", href: "/resize" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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
          {navLinks.map((link) => (
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
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 320 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
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
