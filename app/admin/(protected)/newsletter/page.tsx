import { NewsletterManager } from "@/components/admin/NewsletterManager";
import { getBlogRepository } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const subscribers = await getBlogRepository().listNewsletterSubscribers();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Newsletter</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Subscribers who joined from the blog newsletter card.
        </p>
      </div>
      <NewsletterManager initial={subscribers} />
    </div>
  );
}
