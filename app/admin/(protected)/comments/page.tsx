import { CommentsManager } from "@/components/admin/CommentsManager";
import { getBlogRepository } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  const comments = await getBlogRepository().listAllComments();
  const pending = comments.filter((c) => c.status === "pending").length;
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Comments</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          {pending > 0 ? `${pending} comment${pending === 1 ? "" : "s"} awaiting moderation.` : "Moderate comments across all posts."}
        </p>
      </div>
      <CommentsManager initial={comments} />
    </div>
  );
}
