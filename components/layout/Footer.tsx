import Link from "next/link";
import { TOOL_CATEGORIES } from "@/lib/tools";
import { CATEGORY_PAGES, CATEGORY_PAGE_BY_CATEGORY_ID } from "@/lib/category-pages";
import { Logo } from "@/components/ui/Logo";
import { CONVERSION_PAIRS } from "@/features/converter/utils/pairs";
import { ArrowRight } from "lucide-react";

const footerLinks = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blogs" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {/* All tool categories — SEO-friendly landing pages */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Browse by Category</h3>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {CATEGORY_PAGES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/${category.slug}`}
                    className="group inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-primary"
                  >
                    {category.label}
                    <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Brand */}
          <div>
            <Link href="/" className="group inline-flex items-center gap-2" aria-label="Vizo Tool — home">
              <Logo size={28} withWordmark />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
              40+ free browser-based tools for images, PDFs, developers &amp; SEO. No uploads, no
              servers &ndash; everything stays on your device.
            </p>
          </div>

          {/* Tool categories — horizontal wrapped links */}
          {TOOL_CATEGORIES.map((category) => {
            const categoryPage = CATEGORY_PAGE_BY_CATEGORY_ID[category.id];
            return (
            <div key={category.id}>
              <h3 className="text-sm font-semibold text-text-primary">
                {categoryPage ? (
                  <Link
                    href={`/${categoryPage}`}
                    className="transition-colors hover:text-primary"
                  >
                    {category.label}
                  </Link>
                ) : (
                  category.label
                )}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {category.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="text-sm text-text-secondary transition-colors hover:text-primary"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            );
          })}

          {/* Popular conversions */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Popular Converters</h3>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {CONVERSION_PAIRS.map((pair) => (
                <li key={pair.slug}>
                  <Link
                    href={`/${pair.slug}`}
                    className="text-sm text-text-secondary transition-colors hover:text-primary"
                  >
                    {pair.from.label} to {pair.to.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company / Legal */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-text-primary">{group.title}</h3>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Vizo Tool. All rights reserved. Built with privacy in mind.
          </p>
        </div>
      </div>
    </footer>
  );
}
