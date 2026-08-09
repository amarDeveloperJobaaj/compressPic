import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { getBlogRepository } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getBlogRepository().getCategories();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Categories</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Organise posts into topics. Categories power the blog listing and breadcrumbs.
        </p>
      </div>
      <CategoriesManager initial={categories} />
    </div>
  );
}
