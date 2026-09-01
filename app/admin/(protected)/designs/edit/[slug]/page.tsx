"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEED_DESIGNS, DESIGN_CATEGORIES } from "@/lib/vizodesign/seed";
import type { DesignTheme, DesignAnimationLevel } from "@/lib/vizodesign/types";
import { cn } from "@/lib/utils";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const textareaClass =
  "w-full resize-y rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const selectClass =
  "h-10 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function getInitial(design: typeof SEED_DESIGNS[number] | undefined) {
  if (!design) return null;
  return {
    name: design.name,
    slug: design.slug,
    description: design.description,
    shortDescription: design.short_description,
    categoryId: design.category_id ?? DESIGN_CATEGORIES[0]?.id ?? "",
    theme: design.theme as DesignTheme,
    styleType: design.style_type,
    mood: design.mood,
    bestFor: design.best_for.join(", "),
    animationLevel: design.animation_level as DesignAnimationLevel,
    has3d: design.has_3d,
    technologies: design.technologies.join(", "),
    frameworks: design.frameworks.join(", "),
    tags: design.tags.join(", "),
    seoTitle: (design.seo as Record<string, string>).meta_title ?? "",
    seoDescription: (design.seo as Record<string, string>).meta_description ?? "",
    status: design.status === "archived" ? "draft" : design.status,
    featured: design.featured,
    designMarkdown: design.design_markdown,
    aiPrompt: design.ai_prompt,
  };
}

export default function EditDesignPage() {
  const params = useParams<{ slug: string }>();
  const foundDesign = SEED_DESIGNS.find((d) => d.slug === params.slug);
  const initial = getInitial(foundDesign);

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [theme, setTheme] = useState<DesignTheme>(initial?.theme ?? "dark");
  const [styleType, setStyleType] = useState(initial?.styleType ?? "");
  const [mood, setMood] = useState(initial?.mood ?? "");
  const [bestFor, setBestFor] = useState(initial?.bestFor ?? "");
  const [animationLevel, setAnimationLevel] = useState<DesignAnimationLevel>(initial?.animationLevel ?? "minimal");
  const [has3d, setHas3d] = useState(initial?.has3d ?? false);
  const [technologies, setTechnologies] = useState(initial?.technologies ?? "");
  const [frameworks, setFrameworks] = useState(initial?.frameworks ?? "");
  const [tags, setTags] = useState(initial?.tags ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [designMarkdown, setDesignMarkdown] = useState(initial?.designMarkdown ?? "");
  const [aiPrompt, setAiPrompt] = useState(initial?.aiPrompt ?? "");

  if (!foundDesign || !initial) {
    return (
      <div className="space-y-4">
        <Link href="/admin/designs" className="text-sm text-primary hover:underline">← Back to designs</Link>
        <div className="rounded-2xl border border-border bg-surface p-16 text-center">
          <p className="font-semibold text-text-primary">Design not found</p>
          <p className="mt-1 text-sm text-text-muted">The design &quot;{params.slug}&quot; does not exist in seed data.</p>
        </div>
      </div>
    );
  }

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === foundDesign.slug) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      id: foundDesign.id,
      name,
      slug,
      description,
      short_description: shortDescription,
      category_id: categoryId,
      theme,
      style_type: styleType,
      mood,
      best_for: bestFor.split(",").map((s) => s.trim()).filter(Boolean),
      animation_level: animationLevel,
      has_3d: has3d,
      technologies: technologies.split(",").map((s) => s.trim()).filter(Boolean),
      frameworks: frameworks.split(",").map((s) => s.trim()).filter(Boolean),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      seo: { meta_title: seoTitle, meta_description: seoDescription },
      status,
      featured,
      design_markdown: designMarkdown,
      ai_prompt: aiPrompt,
    };
    console.log("Updated design:", data);
    setTimeout(() => {
      setSaving(false);
      setNotice("Design updated (seed data only — connect Supabase for persistence).");
    }, 500);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/designs"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Edit Design</h1>
          <p className="mt-0.5 text-sm text-text-muted">Editing &ldquo;{foundDesign.name}&rdquo;</p>
        </div>
      </div>

      {notice && (
        <div className="rounded-xl border border-success/40 bg-success-light/60 px-4 py-3 text-sm font-medium text-success">
          {notice}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <h2 className="text-sm font-bold text-text-primary">Basic Information</h2>
          <Input label="Name *" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Aurora Glass" required />
          <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="aurora-glass" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Full design description..." className={textareaClass} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Short Description</label>
            <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} placeholder="One-liner summary..." className={textareaClass} />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <h2 className="text-sm font-bold text-text-primary">Classification</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={selectClass}>
                {DESIGN_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Theme</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value as DesignTheme)} className={selectClass}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="both">Both</option>
              </select>
            </div>
            <Input label="Style Type" value={styleType} onChange={(e) => setStyleType(e.target.value)} placeholder="glassmorphism" />
            <Input label="Mood" value={mood} onChange={(e) => setMood(e.target.value)} placeholder="premium" />
            <Input label="Best For" value={bestFor} onChange={(e) => setBestFor(e.target.value)} placeholder="SaaS, AI startups (comma-separated)" />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Animation Level</label>
              <select value={animationLevel} onChange={(e) => setAnimationLevel(e.target.value as DesignAnimationLevel)} className={selectClass}>
                <option value="minimal">Minimal</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <input type="checkbox" checked={has3d} onChange={(e) => setHas3d(e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
            Has 3D elements
          </label>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <h2 className="text-sm font-bold text-text-primary">Technology & Tags</h2>
          <Input label="Technologies" value={technologies} onChange={(e) => setTechnologies(e.target.value)} placeholder="CSS backdrop-filter, CSS gradients (comma-separated)" />
          <Input label="Frameworks" value={frameworks} onChange={(e) => setFrameworks(e.target.value)} placeholder="React, Next.js, Tailwind CSS (comma-separated)" />
          <Input label="Tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="glassmorphism, aurora, SaaS (comma-separated)" />
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <h2 className="text-sm font-bold text-text-primary">SEO</h2>
          <Input label="SEO Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Aurora Glass - Glassmorphism SaaS Design | VizoDesign" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">SEO Description</label>
            <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} placeholder="Meta description..." className={textareaClass} />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <h2 className="text-sm font-bold text-text-primary">Publishing</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className={selectClass}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <label className="flex items-end gap-2 pb-0.5 text-sm font-medium text-text-primary">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
              Featured
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <h2 className="text-sm font-bold text-text-primary">Design Markdown</h2>
          <div>
            <textarea value={designMarkdown} onChange={(e) => setDesignMarkdown(e.target.value)} rows={12} placeholder="# Design Name&#10;&#10;## Design Philosophy&#10;..." className={cn(textareaClass, "font-mono text-xs")} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">AI Prompt</label>
            <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} rows={3} placeholder="Describe the design for AI generation..." className={textareaClass} />
          </div>
        </section>

        <div className="flex items-center gap-3 pb-8">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
          <Link
            href="/admin/designs"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-4 text-sm font-semibold text-text-secondary hover:border-primary/40 hover:text-primary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
