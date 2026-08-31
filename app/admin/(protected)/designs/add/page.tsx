"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DESIGN_CATEGORIES } from "@/lib/vizodesign/seed";
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

export default function AddDesignPage() {
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [categoryId, setCategoryId] = useState(DESIGN_CATEGORIES[0]?.id ?? "");
  const [theme, setTheme] = useState<DesignTheme>("dark");
  const [styleType, setStyleType] = useState("");
  const [mood, setMood] = useState("");
  const [bestFor, setBestFor] = useState("");
  const [animationLevel, setAnimationLevel] = useState<DesignAnimationLevel>("minimal");
  const [has3d, setHas3d] = useState(false);
  const [technologies, setTechnologies] = useState("");
  const [frameworks, setFrameworks] = useState("");
  const [tags, setTags] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [featured, setFeatured] = useState(false);
  const [designMarkdown, setDesignMarkdown] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
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
    console.log("New design:", data);
    setTimeout(() => {
      setSaving(false);
      setNotice("Design saved (seed data only — connect Supabase for persistence).");
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
          <h1 className="text-xl font-bold text-text-primary">Add Design</h1>
          <p className="mt-0.5 text-sm text-text-muted">Create a new VizoDesign template.</p>
        </div>
      </div>

      {notice && (
        <div className="rounded-xl border border-success/40 bg-success-light/60 px-4 py-3 text-sm font-medium text-success">
          {notice}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
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

        {/* Classification */}
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

        {/* Tech & Tags */}
        <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <h2 className="text-sm font-bold text-text-primary">Technology & Tags</h2>
          <Input label="Technologies" value={technologies} onChange={(e) => setTechnologies(e.target.value)} placeholder="CSS backdrop-filter, CSS gradients (comma-separated)" />
          <Input label="Frameworks" value={frameworks} onChange={(e) => setFrameworks(e.target.value)} placeholder="React, Next.js, Tailwind CSS (comma-separated)" />
          <Input label="Tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="glassmorphism, aurora, SaaS (comma-separated)" />
        </section>

        {/* SEO */}
        <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <h2 className="text-sm font-bold text-text-primary">SEO</h2>
          <Input label="SEO Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Aurora Glass - Glassmorphism SaaS Design | VizoDesign" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">SEO Description</label>
            <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} placeholder="Meta description..." className={textareaClass} />
          </div>
        </section>

        {/* Publishing */}
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

        {/* Design Markdown */}
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

        {/* Actions */}
        <div className="flex items-center gap-3 pb-8">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Design
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
