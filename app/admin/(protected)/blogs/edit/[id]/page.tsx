import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { getCategories, getPostById } from "@/lib/blog/service";

export const dynamic = "force-dynamic";

export default async function AdminEditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) notFound();
  return <BlogEditor initial={post} categories={getCategories().map((c) => c.name)} />;
}
