import type { Json } from "@/lib/supabase/database.types";

export type DesignStatus = "draft" | "published" | "archived";
export type DesignTheme = "dark" | "light" | "both";
export type DesignAnimationLevel = "minimal" | "medium" | "high";

export interface DesignCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Design {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description: string;
  category_id: string | null;
  status: DesignStatus;
  featured: boolean;
  theme: DesignTheme;
  style_type: string;
  mood: string;
  best_for: string[];
  animation_level: DesignAnimationLevel;
  has_3d: boolean;
  responsive: boolean;
  accessibility_level: string;
  preview_type: string;
  preview_component: string | null;
  preview_image: string | null;
  thumbnail: string | null;
  design_system: DesignSystemData;
  design_markdown: string;
  ai_prompt: string;
  technologies: string[];
  frameworks: string[];
  tags: string[];
  seo: DesignSeo;
  view_count: number;
  copy_count: number;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DesignSeo {
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  og_image?: string;
  canonical?: string;
}

export interface DesignSystemData {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    surface?: string;
    border?: string;
    text?: string;
    muted?: string;
    accent?: string;
  };
  typography?: {
    fontFamily?: string;
    headingScale?: string;
    bodyScale?: string;
    fontWeights?: string;
    lineHeights?: string;
  };
  spacing?: Record<string, string>;
  borderRadius?: Record<string, string>;
  shadows?: Record<string, string>;
  gradients?: string[];
  components?: Record<string, string>;
}

export interface DesignEvent {
  id: string;
  design_id: string;
  event_type: string;
  visitor_id: string | null;
  metadata: Json;
  created_at: string;
}

export interface DesignFilters {
  category?: string;
  theme?: DesignTheme;
  style?: string;
  animation?: DesignAnimationLevel;
  has3d?: boolean;
  featured?: boolean;
  search?: string;
  sort?: "newest" | "popular" | "most_copied" | "featured" | "az";
}

export interface DesignListResult {
  items: Design[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DesignCategoryWithCount extends DesignCategory {
  design_count?: number;
}
