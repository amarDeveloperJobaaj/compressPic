import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Clock,
  Database,
  Eye,
  FileText,
  FilePlus2,
  Flame,
  FolderOpen,
  Hash,
  Mail,
  MessageSquare,
  Trash2,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { Capsule } from "@/components/ui/capsule";
import { ADMIN_CONFIG } from "@/lib/admin/config";
import { getBlogRepository } from "@/lib/blog/repository";

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
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-text-primary">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const repo = getBlogRepository();
  const [stats, recent, popular] = await Promise.all([
    repo.getBlogStats(),
    repo.listAdminPosts({ page: 1, pageSize: 6 }),
    repo.listAdminPosts({ page: 1, pageSize: 5 }),
  ]);

  const popularSorted = [...popular.items].sort((a, b) => b.readCount - a.readCount);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-surface to-sky-500/10 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-sky-500/15 blur-3xl" />
        <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
          Welcome back, {ADMIN_CONFIG.username} 👋
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-text-secondary">
          Manage the Vizo Tool blog — write posts, embed live tools, moderate comments and publish to the world.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link
            href="/admin/blogs/add"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
          >
            <FilePlus2 className="h-4 w-4" /> Create blog
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
          >
            <FolderOpen className="h-4 w-4" /> Categories
          </Link>
          <Link
            href="/admin/comments"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
          >
            <MessageSquare className="h-4 w-4" /> Comments
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
        <StatCard label="Scheduled" value={stats.scheduled} Icon={Clock} tone="bg-sky-500/15 text-sky-600" />
        <StatCard label="Total reads" value={stats.totalReads.toLocaleString()} Icon={Eye} tone="bg-violet-500/15 text-violet-600" />
        <StatCard label="Trash" value={stats.trashed ?? 0} Icon={Trash2} tone="bg-rose-500/15 text-rose-500" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Categories" value={stats.categories} Icon={FolderOpen} tone="bg-primary-light text-primary" />
        <StatCard label="Tags" value={stats.tags ?? 0} Icon={Hash} tone="bg-sky-500/15 text-sky-600" />
        <StatCard label="Authors" value={stats.authors ?? 0} Icon={UserRound} tone="bg-teal-500/15 text-teal-600" />
        <StatCard label="Comments" value={stats.comments ?? 0} Icon={MessageSquare} tone="bg-amber-500/15 text-amber-600" />
        <StatCard label="Subscribers" value={stats.subscribers ?? 0} Icon={Mail} tone="bg-rose-500/15 text-rose-500" />
        <StatCard label="Views" value={(stats.views ?? 0).toLocaleString()} Icon={BarChart3} tone="bg-fuchsia-500/15 text-fuchsia-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Recent blogs */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-bold text-text-primary">Recent blogs</h2>
            <Link href="/admin/blogs" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recent.items.map((post) => (
              <li key={post.id} className="flex items-center gap-3 px-5 py-3.5">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    post.status === "published"
                      ? "bg-success"
                      : post.status === "scheduled"
                        ? "bg-sky-500"
                        : "bg-warning"
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
                {post.pinned && <Capsule variant="purple" sm glow={false}>Pinned</Capsule>}
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

        <div className="space-y-6">
          {/* Popular blogs */}
          <div className="rounded-2xl border border-border bg-surface shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-text-primary">
                <Flame className="h-4 w-4 text-rose-500" /> Most read
              </h2>
            </div>
            <ul className="divide-y divide-border">
              {popularSorted.map((post, i) => (
                <li key={post.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="w-5 text-center text-sm font-bold text-text-muted">{i + 1}</span>
                  <Link
                    href={`/admin/blogs/edit/${post.id}`}
                    className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary hover:text-primary"
                  >
                    {post.title}
                  </Link>
                  <span className="shrink-0 text-xs font-semibold text-text-muted">
                    {post.readCount.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Moderation queue */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <MessageSquare className="h-4 w-4 text-primary" /> Moderation queue
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              {stats.pendingComments && stats.pendingComments > 0
                ? `${stats.pendingComments} comment${stats.pendingComments === 1 ? "" : "s"} waiting for approval.`
                : "No pending comments — all clear."}
            </p>
            <Link
              href="/admin/comments"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
            >
              Review comments <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Data layer status */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <Database className="h-4 w-4 text-success" /> Data layer
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              All admin mutations run through the repository. Add Supabase credentials and set{" "}
              <code className="font-mono text-[10px]">BLOG_STORAGE=supabase</code> to go live — zero UI changes.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-warning-light px-2.5 py-1 text-[11px] font-semibold text-warning">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Supabase-ready (memory active)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
