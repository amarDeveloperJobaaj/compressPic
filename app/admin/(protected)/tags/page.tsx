import { TagsManager } from "@/components/admin/TagsManager";
import { getBlogRepository } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const tags = await getBlogRepository().listTagsAdmin();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Tags</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Lightweight topic labels — merge duplicates to keep your tag cloud clean.
        </p>
      </div>
      <TagsManager initial={tags} />
    </div>
  );
}
