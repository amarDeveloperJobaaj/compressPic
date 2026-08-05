import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { getBlogRepository } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

export default async function AdminEditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const repo = getBlogRepository();
  const [post, categories] = await Promise.all([
    repo.getPostById(id),
    repo.getCategories(),
  ]);
  if (!post) notFound();
  return <BlogEditor initial={post} categories={categories.map((c) => c.name)} />;
}
