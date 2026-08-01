"use client";

import { Code2 } from "lucide-react";
import dynamic from "next/dynamic";
import { PageTransition } from "@/components/shared/PageTransition";
import { ToolHero } from "@/features/devtools/components/ToolHero";

// Monaco is heavy (~several MB) — load it only when the playground is needed.
const HtmlCssJsPlaygroundTool = dynamic(
  () =>
    import("@/features/playground/tools/html/HtmlCssJsPlaygroundTool").then((m) => ({
      default: m.HtmlCssJsPlaygroundTool,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-text-muted">Loading Monaco editor…</p>
        </div>
      </div>
    ),
  }
);

export default function HtmlCssJsPlaygroundPage() {
  return (
    <PageTransition>
      <div className="container-page py-10 sm:py-16">
        <ToolHero
          icon={Code2}
          title="HTML/CSS/JS Playground"
          description="Write HTML, CSS, and JavaScript in a VS Code-powered editor with a live preview and console. Start from a template or blank — everything stays in your browser."
        />
        <div className="mx-auto mt-10 max-w-6xl">
          <HtmlCssJsPlaygroundTool />
        </div>
      </div>
    </PageTransition>
  );
}
