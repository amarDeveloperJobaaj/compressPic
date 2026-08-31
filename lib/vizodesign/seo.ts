import type { Metadata } from "next";
import { buildMetadata, breadcrumbListSchema } from "@/lib/seo";
import type { Design, DesignCategory } from "./types";

export function buildDesignMetadata(design: Design): Metadata {
  const title = design.seo?.meta_title || `${design.name} — ${design.style_type} Web Design | VizoDesign`;
  const description = design.seo?.meta_description || design.short_description || design.description;

  return buildMetadata({
    title,
    description,
    path: `/vizodesign/${design.slug}`,
    keywords: [
      ...(design.seo?.keywords || []),
      design.style_type,
      design.theme,
      ...design.tags,
      "web design",
      "design system",
      "DESIGN.md",
      "AI coding",
    ],
  });
}

export function buildDesignJsonLd(design: Design) {
  return [
    breadcrumbListSchema([
      { name: "Home", url: "/" },
      { name: "VizoDesign", url: "/vizodesign" },
      { name: design.name },
    ]),
  ];
}

export function buildCategoryMetadata(category: DesignCategory): Metadata {
  return buildMetadata({
    title: `${category.name} Web Design Systems | VizoDesign`,
    description: category.description || `Browse ${category.name} web design systems with live previews and DESIGN.md instructions.`,
    path: `/vizodesign/category/${category.slug}`,
    keywords: [category.name, "web design", "design system", "DESIGN.md"],
  });
}

export function buildVizodesignIndexMetadata(): Metadata {
  return buildMetadata({
    title: "VizoDesign — Modern Web Design Systems with Live Previews",
    description: "Explore modern web design systems with live previews and production-ready DESIGN.md instructions for AI coding workflows.",
    path: "/vizodesign",
    keywords: ["web design", "design systems", "design library", "AI coding", "DESIGN.md"],
  });
}

export const VIZODESIGN_FAQS = [
  {
    question: "What is VizoDesign?",
    answer: "VizoDesign is a visual web-design library where you can browse modern website design systems, see live interactive previews, and copy production-ready DESIGN.md files for AI coding agents.",
  },
  {
    question: "What is a DESIGN.md file?",
    answer: "A DESIGN.md file contains structured design system instructions including colors, typography, spacing, component rules, and implementation guidelines. It's designed to be read by AI coding agents like Cursor, Claude Code, or Codex.",
  },
  {
    question: "Which AI coding agents can use DESIGN.md?",
    answer: "DESIGN.md works with any AI coding agent that reads markdown files, including Cursor, Claude Code, Codex, Freebuff, Gemini CLI, and others.",
  },
  {
    question: "Is VizoDesign free?",
    answer: "Yes, VizoDesign is completely free. You can browse all designs, view live previews, and copy DESIGN.md files without any cost.",
  },
  {
    question: "Are the design previews interactive?",
    answer: "Yes, VizoDesign renders live interactive preview components that you can interact with, including hover states, animations, and responsive behavior.",
  },
];
