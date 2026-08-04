import { BlogEditor } from "@/components/admin/BlogEditor";
import { getCategories } from "@/lib/blog/service";

export default function AdminAddBlogPage() {
  return <BlogEditor categories={getCategories().map((c) => c.name)} />;
}
