"use client";

import { useMemo, useState } from "react";
import { Copy, Download, Info } from "lucide-react";
import { ToolPanel } from "@/features/devtools/components/ToolPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CodeOutput } from "@/features/devtools/components/CodeOutput";
import { copyToClipboard, downloadText } from "@/features/devtools/utils/download";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Schema type registry: fields + how the JSON-LD is assembled         */
/* ------------------------------------------------------------------ */

interface SchemaField {
  key: string;
  label: string;
  placeholder?: string;
  optional?: boolean;
}

interface SchemaTypeDef {
  id: string;
  label: string;
  description: string;
  fields: SchemaField[];
  build: (values: Record<string, string>) => Record<string, unknown>;
}

const SCHEMA_TYPES: SchemaTypeDef[] = [
  {
    id: "article",
    label: "Article",
    description: "News or blog article content — can power article rich results.",
    fields: [
      { key: "headline", label: "Headline" },
      { key: "description", label: "Description" },
      { key: "url", label: "Article URL" },
      { key: "image", label: "Image URL" },
      { key: "author", label: "Author name" },
      { key: "publisher", label: "Publisher name" },
      { key: "datePublished", label: "Published date (YYYY-MM-DD)" },
      { key: "dateModified", label: "Modified date (YYYY-MM-DD)", optional: true },
    ],
    build: (v) => ({
      "@type": "Article",
      headline: v.headline,
      description: v.description,
      image: v.image,
      author: { "@type": "Person", name: v.author },
      publisher: { "@type": "Organization", name: v.publisher },
      datePublished: v.datePublished,
      ...(v.dateModified ? { dateModified: v.dateModified } : {}),
      mainEntityOfPage: { "@type": "WebPage", "@id": v.url },
    }),
  },
  {
    id: "blogposting",
    label: "BlogPosting",
    description: "A blog post article — a subtype of Article.",
    fields: [
      { key: "headline", label: "Headline" },
      { key: "description", label: "Description" },
      { key: "url", label: "Post URL" },
      { key: "image", label: "Image URL" },
      { key: "author", label: "Author name" },
      { key: "datePublished", label: "Published date (YYYY-MM-DD)" },
      { key: "dateModified", label: "Modified date (YYYY-MM-DD)", optional: true },
    ],
    build: (v) => ({
      "@type": "BlogPosting",
      headline: v.headline,
      description: v.description,
      image: v.image,
      author: { "@type": "Person", name: v.author },
      datePublished: v.datePublished,
      ...(v.dateModified ? { dateModified: v.dateModified } : {}),
      mainEntityOfPage: { "@type": "WebPage", "@id": v.url },
    }),
  },
  {
    id: "faq",
    label: "FAQ",
    description: "FAQPage — question/answer pairs that can appear as FAQ rich results.",
    fields: [
      { key: "q1", label: "Question 1" },
      { key: "a1", label: "Answer 1" },
      { key: "q2", label: "Question 2", optional: true },
      { key: "a2", label: "Answer 2", optional: true },
      { key: "q3", label: "Question 3", optional: true },
      { key: "a3", label: "Answer 3", optional: true },
      { key: "q4", label: "Question 4", optional: true },
      { key: "a4", label: "Answer 4", optional: true },
    ],
    build: (v) => {
      const mainEntity = [
        [v.q1, v.a1],
        [v.q2, v.a2],
        [v.q3, v.a3],
        [v.q4, v.a4],
      ]
        .filter(([q, a]) => q && a)
        .map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        }));
      return { "@type": "FAQPage", mainEntity };
    },
  },
  {
    id: "breadcrumb",
    label: "Breadcrumb",
    description: "BreadcrumbList — shows a breadcrumb trail under your search result.",
    fields: [
      { key: "name1", label: "Item 1 name (e.g. Home)" },
      { key: "url1", label: "Item 1 URL" },
      { key: "name2", label: "Item 2 name", optional: true },
      { key: "url2", label: "Item 2 URL", optional: true },
      { key: "name3", label: "Item 3 name", optional: true },
      { key: "url3", label: "Item 3 URL", optional: true },
    ],
    build: (v) => {
      const items = [
        [v.name1, v.url1],
        [v.name2, v.url2],
        [v.name3, v.url3],
      ]
        .filter(([n, u]) => n && u)
        .map(([n, u], i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: n,
          item: u,
        }));
      return { "@type": "BreadcrumbList", itemListElement: items };
    },
  },
  {
    id: "organization",
    label: "Organization",
    description: "Business or organization info shown in knowledge panels and brand results.",
    fields: [
      { key: "name", label: "Organization name" },
      { key: "url", label: "Website URL" },
      { key: "logo", label: "Logo URL", optional: true },
      { key: "sameAs", label: "Social profile URL (Facebook, LinkedIn…)", optional: true },
      { key: "contactType", label: "Contact type (customer service…)", optional: true },
      { key: "telephone", label: "Phone", optional: true },
    ],
    build: (v) => ({
      "@type": "Organization",
      name: v.name,
      url: v.url,
      ...(v.logo ? { logo: v.logo } : {}),
      ...(v.sameAs ? { sameAs: v.sameAs.split(",").map((s) => s.trim()) } : {}),
      ...(v.telephone
        ? {
            contactPoint: {
              "@type": "ContactPoint",
              telephone: v.telephone,
              ...(v.contactType ? { contactType: v.contactType } : {}),
            },
          }
        : {}),
    }),
  },
  {
    id: "website",
    label: "Website",
    description: "WebSite schema for the whole site — often paired with SearchAction.",
    fields: [
      { key: "name", label: "Site name" },
      { key: "url", label: "Site URL" },
      { key: "searchUrl", label: "Search URL with {query} (e.g. /search?q={query})", optional: true },
    ],
    build: (v) => ({
      "@type": "WebSite",
      name: v.name,
      url: v.url,
      ...(v.searchUrl
        ? {
            potentialAction: {
              "@type": "SearchAction",
              target: { "@type": "EntryPoint", urlTemplate: `${v.url}${v.searchUrl}` },
              "query-input": "required name=query",
            },
          }
        : {}),
    }),
  },
  {
    id: "person",
    label: "Person",
    description: "Personal profile — useful for authors, speakers, and personal brands.",
    fields: [
      { key: "name", label: "Full name" },
      { key: "jobTitle", label: "Job title", optional: true },
      { key: "url", label: "Profile URL", optional: true },
      { key: "image", label: "Photo URL", optional: true },
      { key: "sameAs", label: "Social profile URLs (comma separated)", optional: true },
    ],
    build: (v) => ({
      "@type": "Person",
      name: v.name,
      ...(v.jobTitle ? { jobTitle: v.jobTitle } : {}),
      ...(v.url ? { url: v.url } : {}),
      ...(v.image ? { image: v.image } : {}),
      ...(v.sameAs ? { sameAs: v.sameAs.split(",").map((s) => s.trim()) } : {}),
    }),
  },
  {
    id: "product",
    label: "Product",
    description: "Product + Offer + AggregateRating — powers product rich results.",
    fields: [
      { key: "name", label: "Product name" },
      { key: "image", label: "Image URL" },
      { key: "description", label: "Description" },
      { key: "brand", label: "Brand name" },
      { key: "price", label: "Price (e.g. 29.99)" },
      { key: "currency", label: "Currency (e.g. USD)", optional: true },
      { key: "availability", label: "Availability (InStock / OutOfStock)", optional: true },
      { key: "rating", label: "Aggregate rating (1–5)", optional: true },
      { key: "ratingCount", label: "Rating count", optional: true },
    ],
    build: (v) => ({
      "@type": "Product",
      name: v.name,
      image: v.image,
      description: v.description,
      brand: { "@type": "Brand", name: v.brand },
      offers: {
        "@type": "Offer",
        price: v.price,
        priceCurrency: v.currency || "USD",
        ...(v.availability ? { availability: `https://schema.org/${v.availability}` } : {}),
      },
      ...(v.rating && v.ratingCount
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: v.rating,
              ratingCount: v.ratingCount,
            },
          }
        : {}),
    }),
  },
  {
    id: "review",
    label: "Review",
    description: "Review of a product, service, or business.",
    fields: [
      { key: "item", label: "Reviewed item name" },
      { key: "rating", label: "Rating (1–5)" },
      { key: "author", label: "Reviewer name" },
      { key: "datePublished", label: "Date (YYYY-MM-DD)" },
      { key: "body", label: "Review body", optional: true },
    ],
    build: (v) => ({
      "@type": "Review",
      itemReviewed: { "@type": "Thing", name: v.item },
      reviewRating: { "@type": "Rating", ratingValue: v.rating, bestRating: "5" },
      author: { "@type": "Person", name: v.author },
      datePublished: v.datePublished,
      ...(v.body ? { reviewBody: v.body } : {}),
    }),
  },
  {
    id: "howto",
    label: "HowTo",
    description: "Step-by-step instructions — can power HowTo rich results.",
    fields: [
      { key: "name", label: "HowTo title" },
      { key: "description", label: "Description" },
      { key: "step1", label: "Step 1" },
      { key: "step2", label: "Step 2", optional: true },
      { key: "step3", label: "Step 3", optional: true },
      { key: "step4", label: "Step 4", optional: true },
    ],
    build: (v) => ({
      "@type": "HowTo",
      name: v.name,
      description: v.description,
      step: [v.step1, v.step2, v.step3, v.step4]
        .filter(Boolean)
        .map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
    }),
  },
  {
    id: "event",
    label: "Event",
    description: "Upcoming event — can power event rich results and local search.",
    fields: [
      { key: "name", label: "Event name" },
      { key: "startDate", label: "Start date (YYYY-MM-DD)" },
      { key: "endDate", label: "End date", optional: true },
      { key: "location", label: "Venue / location name" },
      { key: "address", label: "Street address", optional: true },
      { key: "url", label: "Event URL", optional: true },
      { key: "image", label: "Image URL", optional: true },
      { key: "offers", label: "Price (e.g. 20 or Free)", optional: true },
    ],
    build: (v) => ({
      "@type": "Event",
      name: v.name,
      startDate: v.startDate,
      ...(v.endDate ? { endDate: v.endDate } : {}),
      ...(v.url ? { url: v.url } : {}),
      ...(v.image ? { image: v.image } : {}),
      location: {
        "@type": "Place",
        name: v.location,
        ...(v.address ? { address: { "@type": "PostalAddress", streetAddress: v.address } } : {}),
      },
      ...(v.offers
        ? {
            offers: {
              "@type": "Offer",
              price: v.offers === "Free" ? "0" : v.offers,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          }
        : {}),
    }),
  },
  {
    id: "recipe",
    label: "Recipe",
    description: "Recipe markup with ingredients and steps — powers recipe rich results.",
    fields: [
      { key: "name", label: "Recipe name" },
      { key: "image", label: "Image URL" },
      { key: "prepTime", label: "Prep time (PT10M format)" },
      { key: "cookTime", label: "Cook time (PT20M format)", optional: true },
      { key: "recipeYield", label: "Yield (e.g. 4 servings)", optional: true },
      { key: "ingredients", label: "Ingredients (comma separated)" },
      { key: "steps", label: "Steps (separated by |)", optional: true },
    ],
    build: (v) => ({
      "@type": "Recipe",
      name: v.name,
      image: v.image,
      prepTime: v.prepTime,
      ...(v.cookTime ? { cookTime: v.cookTime } : {}),
      ...(v.recipeYield ? { recipeYield: v.recipeYield } : {}),
      recipeIngredient: v.ingredients.split(",").map((s) => s.trim()),
      ...(v.steps
        ? { recipeInstructions: v.steps.split("|").map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s.trim() })) }
        : {}),
    }),
  },
  {
    id: "video",
    label: "Video",
    description: "VideoObject — helps your videos surface in Google video results.",
    fields: [
      { key: "name", label: "Video title" },
      { key: "description", label: "Description" },
      { key: "thumbnail", label: "Thumbnail URL" },
      { key: "uploadDate", label: "Upload date (YYYY-MM-DD)" },
      { key: "duration", label: "Duration (PT2M30S format)", optional: true },
      { key: "contentUrl", label: "Video file URL", optional: true },
      { key: "embedUrl", label: "Embed URL (youtube.com/embed/…)", optional: true },
    ],
    build: (v) => ({
      "@type": "VideoObject",
      name: v.name,
      description: v.description,
      thumbnailUrl: v.thumbnail,
      uploadDate: v.uploadDate,
      ...(v.duration ? { duration: v.duration } : {}),
      ...(v.contentUrl ? { contentUrl: v.contentUrl } : {}),
      ...(v.embedUrl ? { embedUrl: v.embedUrl } : {}),
    }),
  },
  {
    id: "localbusiness",
    label: "LocalBusiness",
    description: "Local business info — key for local SEO and map listings.",
    fields: [
      { key: "name", label: "Business name" },
      { key: "image", label: "Logo / image URL", optional: true },
      { key: "address", label: "Street address" },
      { key: "city", label: "City" },
      { key: "postalCode", label: "Postal code", optional: true },
      { key: "phone", label: "Phone", optional: true },
      { key: "hours", label: "Opening hours (e.g. Mo-Fr 09:00-17:00)", optional: true },
    ],
    build: (v) => ({
      "@type": "LocalBusiness",
      name: v.name,
      ...(v.image ? { image: v.image } : {}),
      address: {
        "@type": "PostalAddress",
        streetAddress: v.address,
        addressLocality: v.city,
        ...(v.postalCode ? { postalCode: v.postalCode } : {}),
      },
      ...(v.phone ? { telephone: v.phone } : {}),
      ...(v.hours ? { openingHours: v.hours } : {}),
    }),
  },
  {
    id: "softwareapp",
    label: "SoftwareApplication",
    description: "Software, app, or web tool — good for SaaS and utilities.",
    fields: [
      { key: "name", label: "App name" },
      { key: "description", label: "Description" },
      { key: "url", label: "App URL" },
      { key: "price", label: "Price (0 for free)" },
      { key: "category", label: "Category (e.g. WebApplication)", optional: true },
      { key: "rating", label: "Aggregate rating (1–5)", optional: true },
      { key: "ratingCount", label: "Rating count", optional: true },
    ],
    build: (v) => ({
      "@type": "SoftwareApplication",
      name: v.name,
      url: v.url,
      description: v.description,
      applicationCategory: v.category || "WebApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: v.price || "0", priceCurrency: "USD" },
      ...(v.rating && v.ratingCount
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: v.rating,
              ratingCount: v.ratingCount,
            },
          }
        : {}),
    }),
  },
];

function buildJsonLd(typeDef: SchemaTypeDef, values: Record<string, string>): string {
  const data = typeDef.build(values);
  return JSON.stringify({ "@context": "https://schema.org", ...data }, null, 2);
}

export function SchemaMarkupGeneratorTool() {
  const [selectedId, setSelectedId] = useState("article");
  const [values, setValues] = useState<Record<string, string>>({});

  const typeDef = useMemo(
    () => SCHEMA_TYPES.find((t) => t.id === selectedId) ?? SCHEMA_TYPES[0],
    [selectedId]
  );

  const json = useMemo(() => {
    try {
      return buildJsonLd(typeDef, values);
    } catch {
      return "{}";
    }
  }, [typeDef, values]);

  const scriptTag = useMemo(
    () => `<script type="application/ld+json">\n${json}\n</script>`,
    [json]
  );

  const switchType = (id: string) => {
    setSelectedId(id);
    setValues({});
  };

  const setValue = (key: string, value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const validateJson = useMemo(() => {
    try {
      JSON.parse(json);
      return true;
    } catch {
      return false;
    }
  }, [json]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Schema type picker + form — min-w-0 lets the panel shrink on mobile */}
      <div className="min-w-0 space-y-6">
        <ToolPanel title="Schema Type" description="Choose the schema that matches your content.">
          <div className="flex flex-wrap gap-2">
            {SCHEMA_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => switchType(t.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97]",
                  selectedId === t.id
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-background text-text-secondary hover:border-primary/40 hover:text-primary"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary-light/30 px-4 py-3 text-sm text-text-secondary">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {typeDef.description}
          </p>
        </ToolPanel>

        <ToolPanel title={`${typeDef.label} Fields`} description="Fill in the details — required fields are marked.">
          <div className="space-y-4">
            {typeDef.fields.map((field) => (
              <Input
                key={field.key}
                label={`${field.label}${field.optional ? " (optional)" : ""}`}
                value={values[field.key] ?? ""}
                onChange={(e) => setValue(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            ))}
          </div>
        </ToolPanel>
      </div>

      {/* Output */}
      <ToolPanel
        title="JSON-LD Output"
        description="Valid structured data — ready to paste into your page <head>."
        actions={
          <>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                validateJson ? "bg-success-light text-success" : "bg-error-light text-error"
              )}
            >
              {validateJson ? "Valid JSON" : "Invalid JSON"}
            </span>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(scriptTag)}>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadText(`${typeDef.id}.json`, json, "application/json")}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </>
        }
      >
        <CodeOutput
          text={json}
          title={`${typeDef.label} JSON-LD`}
          filename={`${typeDef.id}.json`}
          mime="application/json"
          previewClass="max-h-[480px]"
        />
        <p className="mt-3 text-xs text-text-muted">
          Paste the <code className="rounded bg-surface px-1.5 py-0.5 font-mono">&lt;script type=&quot;application/ld+json&quot;&gt;</code> block
          into your page <code className="rounded bg-surface px-1.5 py-0.5 font-mono">&lt;head&gt;</code>, then verify it with Google&apos;s Rich Results Test.
        </p>
      </ToolPanel>
    </div>
  );
}
