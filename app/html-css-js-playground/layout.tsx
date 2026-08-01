import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolSeoContent } from "@/components/seo/ToolSeoContent";
import { AdSlot } from "@/components/seo/AdSlot";

export const metadata: Metadata = buildMetadata({
  title: "HTML/CSS/JS Playground — CodePen-Style Editor Online Free",
  description:
    "Write HTML, CSS, and JavaScript in a VS Code-powered Monaco editor with live preview and console. Start from 9 templates, export ZIP — 100% free and private.",
  path: "/html-css-js-playground",
  keywords: ["html css js playground", "online code editor", "html playground", "css playground", "javascript playground", "codepen alternative"],
});

export default function HtmlCssJsPlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Developer Tools" },
          { label: "HTML/CSS/JS Playground", href: "/html-css-js-playground" },
        ]}
      />
      {children}
      <AdSlot />
      <ToolSeoContent slug="html-css-js-playground" />
    </>
  );
}
