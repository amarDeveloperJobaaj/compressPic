"use client";

import { Check, Loader2, Save, X } from "lucide-react";
import { useState, useTransition } from "react";
import { saveSettingsAction } from "@/lib/blog/actions";
import { cn } from "@/lib/utils";

const inputClass =
  "h-10 w-full rounded-xl border border-border bg-background/60 px-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const FIELDS = [
  { key: "site.name", label: "Site name", type: "text", hint: "Shown in the header, footer and page titles." },
  { key: "site.description", label: "Site description", type: "textarea", hint: "Default meta description for the homepage." },
  { key: "site.default_og_image", label: "Default OG image", type: "text", hint: "Used when a page has no explicit social image." },
  { key: "contact.email", label: "Contact email", type: "email", hint: "Shown on the contact page and privacy notices." },
  { key: "site.social.twitter", label: "Twitter / X URL", type: "text", hint: "Social link in the footer." },
  { key: "site.social.youtube", label: "YouTube URL", type: "text", hint: "Social link in the footer." },
  { key: "analytics.gtag_id", label: "Google Analytics ID", type: "text", hint: "e.g. G-XXXXXXXXXX (loading script is future-ready)." },
  { key: "analytics.clarity_id", label: "Microsoft Clarity ID", type: "text", hint: "e.g. abc123 (loading script is future-ready)." },
] as const;

export function SettingsEditor({ initial }: { initial: Record<string, unknown> }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      FIELDS.map((f) => [f.key, String(initial[f.key] ?? (f.type === "textarea" ? "" : ""))])
    )
  );
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "blog.newsletter_enabled": Boolean(initial["blog.newsletter_enabled"] ?? true),
    "blog.comments_enabled": Boolean(initial["blog.comments_enabled"] ?? true),
  });
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState("");

  const save = () => {
    setNotice("");
    startTransition(async () => {
      for (const [key, value] of Object.entries(values)) {
        const res = await saveSettingsAction({ key, value: value.trim() || null });
        if (!res.ok) return;
      }
      for (const [key, value] of Object.entries(toggles)) {
        const res = await saveSettingsAction({ key, value });
        if (!res.ok) return;
      }
      setNotice("Settings saved.");
      setTimeout(() => setNotice(""), 2500);
    });
  };

  return (
    <div className="space-y-4">
      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-success/40 bg-success-light/60 px-4 py-3 text-sm font-medium text-success">
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4" /> {notice}
          </span>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3.5 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="text-sm font-bold text-text-primary">Site & SEO defaults</h2>
          {FIELDS.slice(0, 5).map((f) => (
            <Field key={f.key} field={f} value={values[f.key] ?? ""} onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))} />
          ))}
        </div>

        <div className="space-y-3.5 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="text-sm font-bold text-text-primary">Analytics & integrations</h2>
          {FIELDS.slice(5).map((f) => (
            <Field key={f.key} field={f} value={values[f.key] ?? ""} onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))} />
          ))}
          <div className="space-y-2 pt-1">
            {Object.entries(toggles).map(([key, value]) => (
              <button
                key={key}
                type="button"
                role="switch"
                aria-checked={value}
                onClick={() => setToggles((t) => ({ ...t, [key]: !value }))}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-background/50 px-3.5 py-2.5"
              >
                <span className="text-sm font-medium capitalize text-text-primary">
                  {key.replace("blog.", "").replace("_", " ")}
                </span>
                <span className={cn("relative h-5 w-9 rounded-full transition-colors", value ? "bg-primary" : "bg-border")}>
                  <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all", value ? "left-[18px]" : "left-0.5")} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save settings
      </button>
    </div>
  );
}

function Field({
  field,
  value,
  onChange,
}: {
  field: (typeof FIELDS)[number];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-text-primary">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full resize-y rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      ) : (
        <input
          type={field.type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
      {field.hint && <p className="mt-1 text-[11px] text-text-muted">{field.hint}</p>}
    </label>
  );
}
