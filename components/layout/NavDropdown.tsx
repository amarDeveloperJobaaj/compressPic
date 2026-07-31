"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavLinkItem {
  label: string;
  href: string;
}

interface NavDropdownProps {
  label: string;
  items: NavLinkItem[];
}

/**
 * Header dropdown for a group of links (e.g. "Image Tools" or "Convert").
 * Opens on hover (desktop) and on click (touch/keyboard), and closes on
 * outside pointer-down, Escape, or after navigating.
 */
export function NavDropdown({ label, items }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks whether hover (or an emulated hover from a tap) opened the menu, so
  // the click handler doesn't toggle-close a menu that hover just opened.
  const hoverOpenedRef = useRef(false);

  const open = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    hoverOpenedRef.current = true;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    // Small delay so moving the pointer from the button onto the panel
    // (which is inside the same container) doesn't close the dropdown.
    closeTimerRef.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  const handleClick = useCallback(() => {
    // On touch devices a tap fires an emulated mouseenter before click, so by
    // the time click runs the menu is already open — don't toggle it shut.
    // (Keyboard activation has no hover, so it toggles normally.)
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
          "flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          isOpen
            ? "bg-primary-light text-primary"
            : "text-text-secondary hover:bg-primary-light hover:text-primary"
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
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
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-50 mt-2 w-52 rounded-xl border border-border bg-surface p-1.5 shadow-xl shadow-black/10"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
