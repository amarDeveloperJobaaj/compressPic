import {
  Code2,
  FileText,
  Image as ImageIcon,
  Search,
  TrendingUp,
  Youtube,
  type LucideIcon,
} from "lucide-react";

/** Per-category icon keyed by the category page slug (see lib/category-pages.ts). */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "image-tools": ImageIcon,
  "pdf-tools": FileText,
  "developer-tools": Code2,
  "seo-tools": Search,
  "finance-tools": TrendingUp,
  "youtube-tools": Youtube,
};
