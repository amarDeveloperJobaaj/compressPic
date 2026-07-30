import Link from "next/link";
import { ImageDown } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Compress", href: "/compress" },
      { label: "Resize", href: "/resize" },
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
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-text-primary">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <ImageDown className="h-3.5 w-3.5 text-white" />
              </div>
              CompressPix
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
              Compress your images directly in the browser. No uploads, no servers &ndash; just fast,
              private compression.
            </p>
          </div>

          {/* Link Groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-text-primary">{group.title}</h3>
              <ul className="mt-3 flex flex-col gap-2">
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
            &copy; {new Date().getFullYear()} CompressPix. All rights reserved. Built with privacy in mind.
          </p>
        </div>
      </div>
    </footer>
  );
}
