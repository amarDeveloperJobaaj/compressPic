import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Database,
  FileText,
  FilePlus2,
  Flame,
  FolderOpen,
  Pencil,
  Star,
  TrendingUp,
} from "lucide-react";
import { Capsule } from "@/components/ui/capsule";
import { getBlogStats, getLatestPosts } from "@/lib/blog/service";
import { ADMIN_CONFIG } from "@/lib/admin/config";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  Icon,
  tone,
}: {
  label: string;
  value: string | number;
  Icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-text-primary">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const stats = getBlogStats();
  const recent = getLatestPosts().slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-surface to-sky-500/10 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
          Welcome back, {ADMIN_CONFIG.username} 👋
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-text-secondary">
          Manage the Vizo Tool blog — write posts, embed live tools, and publish to the world.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link
            href="/admin/blogs/add"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
          >
            <FilePlus2 className="h-4 w-4" /> Create blog
          </Link>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Pencil className="h-4 w-4" /> Edit blog
          </Link>
          <Link
            href="/blogs"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
          >
            View site <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total blogs" value={stats.total} Icon={FileText} tone="bg-primary-light text-primary" />
        <StatCard label="Published" value={stats.published} Icon={TrendingUp} tone="bg-success-light text-success" />
        <StatCard label="Drafts" value={stats.drafts} Icon={FilePlus2} tone="bg-amber-500/15 text-amber-600" />
        <StatCard label="Trending" value={stats.trending} Icon={Flame} tone="bg-rose-500/15 text-rose-500" />
        <StatCard label="Featured" value={stats.featured} Icon={Star} tone="bg-violet-500/15 text-violet-500" />
        <StatCard label="Total reads" value={stats.totalReads.toLocaleString()} Icon={BarChart3} tone="bg-sky-500/15 text-sky-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Recent blogs */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-bold text-text-primary">Recent blogs</h2>
            <Link href="/admin/blogs" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recent.map((post) => (
              <li key={post.id} className="flex items-center gap-3 px-5 py-3.5">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    post.status === "published" ? "bg-success" : "bg-warning"
                  }`}
                  title={post.status}
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/blogs/edit/${post.id}`}
                    className="block truncate text-sm font-medium text-text-primary hover:text-primary"
                  >
                    {post.title}
                  </Link>
                  <p className="truncate text-xs text-text-muted">
                    {post.category} · {post.readTime} ·{" "}
                    {new Date(post.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                {post.featured && <Capsule variant="amber" sm glow={false}>Featured</Capsule>}
                {post.trending && <Capsule variant="rose" sm glow={false}>Trending</Capsule>}
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  aria-label={`Preview ${post.title}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Side cards */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="text-sm font-bold text-text-primary">Categories</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
              <FolderOpen className="h-3.5 w-3.5" /> {stats.categories} active categories
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Image Editing", "Developer Tools", "SEO", "Finance", "YouTube", "Guides"].map((c) => (
                <span key={c} className="rounded-full bg-primary-light/60 px-2.5 py-1 text-[11px] font-medium text-primary">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Analytics placeholder */}
          <div className="rounded-2xl border border-dashed border-border bg-surface/60 p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <BarChart3 className="h-4 w-4 text-primary" /> Analytics
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              Real read counts, top posts and traffic charts will appear here once the analytics
              integration is connected.
            </p>
            <div className="mt-4 flex h-24 items-end gap-1.5" aria-hidden="true">
              {[35, 55, 40, 70, 50, 85, 65, 90, 60, 75].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-primary/30 to-primary/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Future Supabase status */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <Database className="h-4 w-4 text-success" /> Data layer
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              Currently running on the in-memory dummy repository. Supabase-ready — swapping the
              data layer requires zero UI changes (see docs/supabase-migration.md).
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-warning-light px-2.5 py-1 text-[11px] font-semibold text-warning">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Dummy data (local memory)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
