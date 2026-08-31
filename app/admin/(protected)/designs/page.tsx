import { DesignsManager } from "@/components/admin/DesignsManager";

export const dynamic = "force-dynamic";

export default function AdminDesignsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Designs</h1>
        <p className="mt-0.5 text-sm text-text-muted">Manage VizoDesign templates, categories, and publishing status.</p>
      </div>
      <DesignsManager />
    </div>
  );
}
