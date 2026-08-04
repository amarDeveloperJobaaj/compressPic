"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, House, X } from "lucide-react";
import { TOOL_CATEGORIES } from "@/lib/tools";
import { CATEGORY_PAGE_BY_CATEGORY_ID } from "@/lib/category-pages";
import { getToolIcon } from "@/lib/tool-icons";
import { Logo } from "@/components/ui/Logo";
import { CONVERT_NAV_ITEMS } from "./NavDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const pageLinks = [
  { label: "Blog", href: "/blogs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Collapsible group of links inside the drawer. */
function NavGroup({
  title,
  count,
  defaultOpen = true,
  children,
}: {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-primary-light/60"
      >
        <span>{title}</span>
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary">
            {count}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-text-muted transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-0.5 py-1 pl-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Compact horizontal tile for a tool link. */
function ToolTile({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-lg border border-border/70 bg-background/60 px-3 py-2.5 text-sm font-medium leading-snug transition-colors",
        active
          ? "border-primary/40 bg-primary-light/60 text-primary"
          : "text-text-secondary hover:border-primary/30 hover:bg-primary-light/50 hover:text-primary"
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-primary" />}
      <span className="min-w-0 text-balance">{label}</span>
    </Link>
  );
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // SSR-safe "is client" check: false on the server and during hydration,
  // true after mount. We only portal once mounted — document.body doesn't
  // exist on the server, and the portal escapes the header's backdrop-filter
  // containing block (which would otherwise trap position:fixed inside the
  // 64px header).
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Lock body scroll while the drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Move focus to the close button on open (for screen readers)
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Close the drawer if the viewport grows to desktop width while open
  useEffect(() => {
    if (!isOpen) return;
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) onClose();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen, onClose]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-[60] flex w-[86%] max-w-sm flex-col border-l border-border bg-background shadow-2xl shadow-black/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-2 text-lg font-semibold text-text-primary"
              >
                <Logo size={32} withWordmark />
              </Link>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-light hover:text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation links">
              <Link
                href="/"
                onClick={onClose}
                className={cn(
                  "mb-2 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === "/"
                    ? "bg-primary-light text-primary"
                    : "text-text-secondary hover:bg-primary-light hover:text-primary"
                )}
              >
                <House className="h-4 w-4 shrink-0" />
                Home
              </Link>

              {TOOL_CATEGORIES.map((category) => {
                const categoryPage = CATEGORY_PAGE_BY_CATEGORY_ID[category.id];
                return (
                <NavGroup
                  key={category.id}
                  title={category.label}
                  count={
                    category.id === "image"
                      ? category.tools.length + CONVERT_NAV_ITEMS.length
                      : category.tools.length
                  }
                >
                  {/* Tools as a horizontal 2-column grid */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {category.tools.map((tool) => (
                      <ToolTile
                        key={tool.slug}
                        href={tool.href}
                        label={tool.name}
                        icon={getToolIcon(tool.slug)}
                        active={pathname === tool.href}
                        onClick={onClose}
                      />
                    ))}
                  </div>

                  {/* Convert section lives inside Image Tools */}
                  {category.id === "image" && (
                    <>
                      <p className="mt-3 mb-1 px-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                        Convert Formats
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {CONVERT_NAV_ITEMS.map((item) => (
                          <ToolTile
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            active={pathname === item.href}
                            onClick={onClose}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* View all category link */}
                  {categoryPage && (
                    <Link
                      href={`/${categoryPage}`}
                      onClick={onClose}
                      className="mt-2 inline-flex items-center gap-1 px-1 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
                    >
                      View all {category.label}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </NavGroup>
                );
              })}

              <div className="my-2 h-px bg-border" />

              {pageLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "mb-1 flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary-light text-primary"
                      : "text-text-secondary hover:bg-primary-light hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-xs text-text-muted">All tools are free</p>
              <ThemeToggle />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
