import { DesignCategoriesManager } from "@/components/admin/DesignCategoriesManager";

export const dynamic = "force-dynamic";

export default function AdminDesignCategoriesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Design Categories</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Organise designs into style categories. Categories power filtering and browsing.
        </p>
      </div>
      <DesignCategoriesManager />
    </div>
  );
}
