import { BlogsManager } from "@/components/admin/BlogsManager";

export const dynamic = "force-dynamic";

export default function AdminDraftsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Drafts</h1>
        <p className="mt-0.5 text-sm text-text-muted">Unpublished posts waiting for review.</p>
      </div>
      <BlogsManager initialStatus="draft" />
    </div>
  );
}
