import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { getBlogStorage } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const storageMode = getBlogStorage();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Media library</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Upload images to Supabase Storage and reuse them across posts.
        </p>
      </div>
      <MediaLibrary storageMode={storageMode} />
    </div>
  );
}
