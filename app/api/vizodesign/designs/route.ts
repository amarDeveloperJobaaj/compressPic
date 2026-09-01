import { NextResponse } from "next/server";
import { SEED_DESIGNS } from "@/lib/vizodesign/seed";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const category = searchParams.get("category") || "";
  const theme = searchParams.get("theme") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

  let results = SEED_DESIGNS.filter((d) => d.status === "published");

  if (q) {
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)) ||
        d.style_type.toLowerCase().includes(q)
    );
  }

  if (category) {
    results = results.filter((d) => {
      const seed = SEED_DESIGNS.find((s) => s.id === d.id);
      return seed?.category_id === category;
    });
  }

  if (theme) {
    results = results.filter((d) => d.theme === theme);
  }

  const items = results.slice(0, limit).map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    short_description: d.short_description,
    style_type: d.style_type,
    theme: d.theme,
    tags: d.tags,
    preview_component: d.preview_component,
    view_count: d.view_count,
    copy_count: d.copy_count,
  }));

  return NextResponse.json({ items, total: results.length });
}
