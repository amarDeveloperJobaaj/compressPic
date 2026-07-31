import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { breadcrumbListSchema } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Visual breadcrumb trail + BreadcrumbList JSON-LD. Server-safe, no hooks. */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const crumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...items];

  return (
    <div className="container-page py-6 sm:py-8">
      <JsonLd
        data={breadcrumbListSchema(
          crumbs.map((crumb) => ({ name: crumb.label, url: crumb.href }))
        )}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-text-muted">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                {isLast || !crumb.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={isLast ? "font-medium text-text-primary" : ""}
                  >
                    {index === 0 ? <Home className="mr-1 inline h-3.5 w-3.5" /> : null}
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="flex items-center transition-colors hover:text-primary"
                  >
                    {index === 0 ? <Home className="mr-1 inline h-3.5 w-3.5" /> : null}
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
