import { BlogsManager } from "@/components/admin/BlogsManager";

export const dynamic = "force-dynamic";

export default function AdminBlogsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">All blogs</h1>
        <p className="mt-0.5 text-sm text-text-muted">Search, publish, duplicate or delete posts.</p>
      </div>
      <BlogsManager />
    </div>
  );
}
