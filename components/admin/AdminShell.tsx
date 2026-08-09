"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  FileText,
  FolderOpen,
  Hash,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Plus,
  Settings,
  FilePlus2,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const NAV_SECTIONS: { title: string; items: { href: string; label: string; Icon: React.ComponentType<{ className?: string }> }[] }[] = [
  {
    title: "Content",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
      { href: "/admin/blogs", label: "All Blogs", Icon: FileText },
      { href: "/admin/blogs/drafts", label: "Drafts", Icon: FilePlus2 },
      { href: "/admin/blogs/add", label: "New Post", Icon: Plus },
      { href: "/admin/categories", label: "Categories", Icon: FolderOpen },
      { href: "/admin/tags", label: "Tags", Icon: Hash },
      { href: "/admin/authors", label: "Authors", Icon: UserRound },
      { href: "/admin/media", label: "Media", Icon: ImageIcon },
    ],
  },
  {
    title: "Engagement",
    items: [
      { href: "/admin/comments", label: "Comments", Icon: MessageSquare },
      { href: "/admin/newsletter", label: "Newsletter", Icon: Mail },
    ],
  },
  {
    title: "System",
    items: [{ href: "/admin/settings", label: "Settings", Icon: Settings }],
  },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-4" aria-label="Admin navigation">
      {NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="mb-1 px-3.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            {section.title}
          </p>
          <div className="space-y-0.5">
            {section.items.map(({ href, label, Icon }) => {
              const active =
                pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "text-text-secondary hover:bg-primary-light/60 hover:text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      {/* Desktop sidebar */}
      <aside className="hidden border-r border-border bg-surface/60 lg:block">
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col p-4">
          <Link href="/admin/dashboard" className="mb-6 flex items-center gap-2 px-2">
            <Logo size={30} />
            <span className="text-sm font-bold text-text-primary">Vizo Tool Admin</span>
          </Link>
          <NavList />
          <div className="mt-auto space-y-1 border-t border-border pt-4">
            <Link
              href="/blogs"
              target="_blank"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light/60 hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" /> View site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-error-light/50 dark:text-rose-300"
            >
              <LogOut className="h-4 w-4" /> {loggingOut ? "Signing out…" : "Logout"}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="sticky top-16 z-40 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md lg:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Logo size={26} />
          <span className="text-sm font-bold text-text-primary">Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/blogs"
            target="_blank"
            aria-label="View site"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open admin menu"
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: mobileOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={cn(
          "fixed inset-y-0 left-0 z-[80] flex w-72 flex-col border-r border-border bg-background p-4 lg:hidden",
          !mobileOpen && "pointer-events-none invisible"
        )}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-bold text-text-primary">Vizo Tool Admin</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-primary-light"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <NavList onNavigate={() => setMobileOpen(false)} />
        <div className="mt-auto space-y-1 border-t border-border pt-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-error-light/50 dark:text-rose-300"
          >
            <LogOut className="h-4 w-4" /> {loggingOut ? "Signing out…" : "Logout"}
          </button>
        </div>
      </motion.aside>

      {/* Content */}
      <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
