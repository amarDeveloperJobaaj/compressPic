import { BlogEditor } from "@/components/admin/BlogEditor";
import { getBlogRepository } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

export default async function AdminAddBlogPage() {
  const categories = await getBlogRepository().getCategories();
  return <BlogEditor categories={categories.map((c) => c.name)} />;
}
