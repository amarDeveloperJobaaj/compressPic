import { AuthorsManager } from "@/components/admin/AuthorsManager";
import { getBlogRepository } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

export default async function AdminAuthorsPage() {
  const authors = await getBlogRepository().listAuthors();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Authors</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Manage writer profiles — avatar, bio and social links shown on posts.
        </p>
      </div>
      <AuthorsManager initial={authors} />
    </div>
  );
}
