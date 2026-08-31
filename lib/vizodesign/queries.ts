import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";
import type {
  Design,
  DesignCategory,
  DesignFilters,
  DesignListResult,
} from "./types";

function getClient() {
  return createPublicClient();
}

function getAdminClient() {
  return createAdminClient();
}

export async function getPublishedDesigns(
  filters: DesignFilters = {},
  page = 1,
  pageSize = 24
): Promise<DesignListResult> {
  const supabase = getClient();
  let query = supabase
    .from("designs")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .is("deleted_at", null);

  if (filters.category) {
    const { data: cat } = await supabase
      .from("design_categories")
      .select("id")
      .eq("slug", filters.category)
      .single();
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  if (filters.theme) {
    query = query.eq("theme", filters.theme);
  }

  if (filters.style) {
    query = query.eq("style_type", filters.style);
  }

  if (filters.animation) {
    query = query.eq("animation_level", filters.animation);
  }

  if (filters.has3d !== undefined) {
    query = query.eq("has_3d", filters.has3d);
  }

  if (filters.featured) {
    query = query.eq("featured", true);
  }

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  switch (filters.sort) {
    case "popular":
      query = query.order("view_count", { ascending: false });
      break;
    case "most_copied":
      query = query.order("copy_count", { ascending: false });
      break;
    case "featured":
      query = query.order("featured", { ascending: false }).order("sort_order", { ascending: true });
      break;
    case "az":
      query = query.order("name", { ascending: true });
      break;
    case "newest":
    default:
      query = query.order("published_at", { ascending: false });
      break;
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Failed to fetch designs:", error);
    return { items: [], total: 0, page, pageSize, totalPages: 0 };
  }

  return {
    items: (data ?? []) as Design[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getDesignBySlug(slug: string): Promise<Design | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("designs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single();

  if (error || !data) return null;
  return data as Design;
}

export async function getDesignBySlugAdmin(slug: string): Promise<Design | null> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("designs")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error || !data) return null;
  return data as Design;
}

export async function getDesignCategories(): Promise<DesignCategory[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("design_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch design categories:", error);
    return [];
  }

  return (data ?? []) as DesignCategory[];
}

export async function getDesignCategoryBySlug(slug: string): Promise<DesignCategory | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("design_categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as DesignCategory;
}

export async function getRelatedDesigns(
  designId: string,
  categoryId: string | null,
  tags: string[],
  limit = 4
): Promise<Design[]> {
  const supabase = getClient();
  let query = supabase
    .from("designs")
    .select("*")
    .eq("status", "published")
    .is("deleted_at", null)
    .neq("id", designId);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  query = query.limit(limit);

  const { data, error } = await query;

  if (error) return [];
  return (data ?? []) as Design[];
}

export async function getFeaturedDesigns(limit = 6): Promise<Design[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("designs")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as Design[];
}

export async function trackDesignEvent(
  designId: string,
  eventType: string,
  visitorId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const supabase = getAdminClient();
  await supabase.from("design_events").insert({
    design_id: designId,
    event_type: eventType,
    visitor_id: visitorId ?? null,
    metadata: (metadata ?? {}) as Json,
  });
}

export async function incrementDesignView(designId: string): Promise<void> {
  const supabase = getAdminClient();
  await supabase.rpc("increment_design_view" as never, { p_design_id: designId } as never).single();
}

export async function incrementDesignCopy(designId: string): Promise<void> {
  const supabase = getAdminClient();
  await supabase
    .from("designs")
    .update({ copy_count: undefined } as never)
    .eq("id", designId);
}
