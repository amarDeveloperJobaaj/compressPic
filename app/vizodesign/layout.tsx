import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "VizoDesign — Modern Web Design Systems with Live Previews",
  description: "Explore modern web design systems with live previews and production-ready DESIGN.md instructions for AI coding workflows.",
  path: "/vizodesign",
  keywords: ["web design", "design systems", "design library", "AI coding", "DESIGN.md"],
});

export default function VizoDesignLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
