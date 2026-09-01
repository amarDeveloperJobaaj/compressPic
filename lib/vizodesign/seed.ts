import type {
  DesignCategory,
  Design,
} from "@/lib/vizodesign/types";

// ---------------------------------------------------------------------------
// Design Categories
// ---------------------------------------------------------------------------

export const DESIGN_CATEGORIES: DesignCategory[] = [
  {
    id: "cat-01",
    name: "Modern SaaS",
    slug: "modern-saas",
    description: "Contemporary software-as-a-service interfaces with clean lines and conversion-focused layouts.",
    sort_order: 1,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-02",
    name: "Dark Premium",
    slug: "dark-premium",
    description: "High-end dark themes that convey sophistication and professionalism.",
    sort_order: 2,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-03",
    name: "Glassmorphism",
    slug: "glassmorphism",
    description: "Frosted glass effects with translucent panels, blur filters, and layered depth.",
    sort_order: 3,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-04",
    name: "AI / Futuristic",
    slug: "ai-futuristic",
    description: "Forward-looking designs for artificial intelligence products and research platforms.",
    sort_order: 4,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-05",
    name: "Bento",
    slug: "bento",
    description: "Asymmetric card-based layouts inspired by Japanese bento boxes and Apple's design language.",
    sort_order: 5,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-06",
    name: "Minimal",
    slug: "minimal",
    description: "Stripped-back designs that embrace whitespace and typographic clarity.",
    sort_order: 6,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-07",
    name: "Neo-Brutalism",
    slug: "neo-brutalism",
    description: "Raw, bold interfaces with thick borders, stark contrasts, and intentionally unpolished aesthetics.",
    sort_order: 7,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-08",
    name: "Editorial",
    slug: "editorial",
    description: "Magazine-inspired layouts with strong typographic hierarchy and content-first design.",
    sort_order: 8,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-09",
    name: "Luxury",
    slug: "luxury",
    description: "Opulent, refined designs for high-end brands with rich materials and elegant details.",
    sort_order: 9,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-10",
    name: "Startup",
    slug: "startup",
    description: "Energetic, growth-oriented designs for emerging companies and product launches.",
    sort_order: 10,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-11",
    name: "Dashboard",
    slug: "dashboard",
    description: "Data-dense interfaces for analytics, admin panels, and operational tools.",
    sort_order: 11,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-12",
    name: "E-commerce",
    slug: "e-commerce",
    description: "Conversion-optimized storefronts and product-focused shopping experiences.",
    sort_order: 12,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-13",
    name: "3D / Interactive",
    slug: "3d-interactive",
    description: "Immersive interfaces with three-dimensional transforms, parallax, and interactive elements.",
    sort_order: 13,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-14",
    name: "Gradient",
    slug: "gradient",
    description: "Vibrant gradient-heavy designs with mesh fills and bold color transitions.",
    sort_order: 14,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-15",
    name: "Corporate",
    slug: "corporate",
    description: "Professional, trustworthy designs for established businesses and enterprise products.",
    sort_order: 15,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-16",
    name: "Developer Tools",
    slug: "developer-tools",
    description: "Code-centric interfaces built for engineers with terminal aesthetics and dense information layouts.",
    sort_order: 16,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-17",
    name: "Creative Portfolio",
    slug: "creative-portfolio",
    description: "Expressive, art-directed showcases for designers, studios, and creative professionals.",
    sort_order: 17,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "cat-18",
    name: "Landing Pages",
    slug: "landing-pages",
    description: "High-converting single-page layouts with clear calls to action and narrative flow.",
    sort_order: 18,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findCategory(slug: string): string {
  const cat = DESIGN_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) throw new Error(`Category not found: ${slug}`);
  return cat.id;
}

// ---------------------------------------------------------------------------
// Seed Designs
// ---------------------------------------------------------------------------

export const SEED_DESIGNS: Design[] = [
  // -----------------------------------------------------------------------
  // 1. Aurora Glass
  // -----------------------------------------------------------------------
  {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "aurora-glass",
    name: "Aurora Glass",
    description:
      "A glassmorphism SaaS design featuring aurora borealis gradients, frosted glass panels, floating orbs, and semi-transparent navigation. The layered translucency creates depth while maintaining readability across all breakpoints.",
    short_description:
      "Glassmorphism SaaS design with aurora borealis gradients and frosted glass panels.",
    category_id: findCategory("glassmorphism"),
    status: "published",
    featured: true,
    theme: "dark",
    style_type: "glassmorphism",
    mood: "premium",
    best_for: ["SaaS", "AI startups"],
    animation_level: "medium",
    has_3d: false,
    responsive: true,
    accessibility_level: "wcag-aware",
    preview_type: "component",
    preview_component: "aurora-glass",
    preview_image: null,
    thumbnail: null,
    design_system: {
      colors: {
        primary: "#7c3aed",
        secondary: "#06b6d4",
        background: "#0f0b1a",
        surface: "rgba(255,255,255,0.06)",
        border: "rgba(255,255,255,0.12)",
        text: "#f0eaff",
        muted: "#9ca3af",
        accent: "#22d3ee",
      },
      typography: {
        fontFamily: "'Inter', system-ui, sans-serif",
        headingScale: "clamp(2rem, 5vw, 3.5rem)",
        bodyScale: "1rem",
        fontWeights: "400,500,600,700",
        lineHeights: "1.5,1.25,1.1",
      },
      spacing: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem" },
      borderRadius: { sm: "8px", md: "12px", lg: "20px", xl: "28px", full: "9999px" },
      shadows: {
        glass: "0 8px 32px rgba(0,0,0,0.3)",
        glow: "0 0 40px rgba(124,58,237,0.3)",
        orb: "0 0 80px rgba(34,211,238,0.25)",
      },
      gradients: [
        "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
        "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.4))",
        "radial-gradient(circle at 30% 20%, #7c3aed 0%, transparent 50%)",
      ],
      components: {
        navbar: "glass",
        hero: "gradient-overlay",
        card: "glass-panel",
        button: "gradient-solid",
        input: "glass-input",
      },
    },
    design_markdown: `# Aurora Glass

## Design Philosophy

Aurora Glass draws its soul from the natural phenomenon of the aurora borealis — shimmering curtains of light dancing across an arctic sky. The design philosophy centers on **translucent layering**: every surface reveals a hint of what lies beneath, creating a sense of infinite depth without sacrificing clarity.

The core belief is that digital interfaces can feel organic. By combining frosted-glass effects with ethereal gradients, Aurora Glass transforms the cold precision of SaaS software into something that feels alive, breathing, and inherently premium.

## Design Goals

- Create an immediately striking visual identity that differentiates from flat SaaS templates
- Maintain WCAG AA contrast ratios despite translucent surfaces
- Deliver a consistent experience from 320px mobile to 2560px ultrawide
- Ensure glass effects degrade gracefully on low-power devices
- Establish a mood of trust, innovation, and technological sophistication

## Visual Language

The visual language is built on three pillars:

1. **Translucency** — Every major surface uses \`backdrop-filter: blur()\` with semi-transparent backgrounds
2. **Aurora Gradients** — Organic, flowing gradients in purple, blue, and cyan that reference the northern lights
3. **Floating Depth** — Elements float at different z-levels, casting soft glows rather than hard shadows

Backgrounds are deep, almost-black purples (\`#0f0b1a\`) that allow the aurora palette to glow. Foreground elements use glass panels with 6-10% white opacity, creating visible but non-distracting surfaces.

## Color System

| Token           | Value                      | Usage                        |
|-----------------|----------------------------|------------------------------|
| background      | \`#0f0b1a\`                | Page background              |
| surface-glass   | \`rgba(255,255,255,0.06)\` | Card and panel backgrounds   |
| primary         | \`#7c3aed\`                | CTA buttons, active states   |
| secondary       | \`#06b6d4\`                | Secondary actions, accents   |
| accent          | \`#22d3ee\`                | Highlights, badges           |
| text-primary    | \`#f0eaff\`                | Headings, body text          |
| text-muted      | \`#9ca3af\`                | Secondary text               |
| border          | \`rgba(255,255,255,0.12)\` | Panel borders, dividers      |
| glow-purple     | \`rgba(124,58,237,0.3)\`   | Purple glow effects          |
| glow-cyan       | \`rgba(34,211,238,0.25)\`  | Cyan glow effects            |

## Typography

- **Primary Font:** Inter (Google Fonts)
- **Monospace:** JetBrains Mono (for code blocks)
- **Heading Scale:** \`clamp(2rem, 5vw, 3.5rem)\` for H1, stepping down 60% per level
- **Body Size:** 16px base, 1.5 line-height
- **Font Weights:** 400 (body), 500 (labels), 600 (subheadings), 700 (headings)
- **Letter Spacing:** -0.02em for headings, normal for body

## Spacing System

Base unit: 4px

| Token | Value  | Usage                    |
|-------|--------|--------------------------|
| xs    | 4px    | Icon padding             |
| sm    | 8px    | Tight gaps               |
| md    | 16px   | Standard component gaps  |
| lg    | 24px   | Section padding          |
| xl    | 32px   | Card padding             |
| 2xl   | 48px   | Section spacing          |
| 3xl   | 64px   | Hero spacing             |

## Border Radius

| Token | Value | Usage                    |
|-------|-------|--------------------------|
| sm    | 8px   | Inputs, small elements   |
| md    | 12px  | Cards, panels            |
| lg    | 20px  | Hero sections, modals    |
| xl    | 28px  | Feature cards            |
| full  | 9999px| Avatars, badges          |

## Shadows

\`\`\`css
.glass-shadow {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.purple-glow {
  box-shadow: 0 0 40px rgba(124, 58, 237, 0.3);
}
.cyan-glow {
  box-shadow: 0 0 80px rgba(34, 211, 238, 0.25);
}
\`\`\`

## Gradients

\`\`\`css
.aurora-gradient {
  background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
}
.glass-gradient {
  background: linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.4));
}
.orb-gradient {
  background: radial-gradient(circle at 30% 20%, #7c3aed 0%, transparent 50%);
}
\`\`\`

## Layout

- **Container:** max-width 1200px, centered, padding 0 24px
- **Grid:** CSS Grid with auto-fill, minmax(320px, 1fr)
- **Section Spacing:** 80px vertical between major sections
- **Breakpoints:**
  - Mobile: < 640px (single column, stacked nav)
  - Tablet: 640px–1024px (two-column grid)
  - Desktop: > 1024px (full layout, sidebar optional)

## Components

### Navbar
- Glass panel with \`backdrop-filter: blur(16px)\`
- Semi-transparent background \`rgba(15,11,26,0.7)\`
- Fixed position with z-index 50
- Logo left, nav links center, CTA button right

### Hero
- Full viewport height with aurora gradient overlay
- Floating decorative orbs positioned absolutely
- Headline in gradient text (\`background-clip: text\`)
- CTA button with aurora gradient fill

### Buttons
- Primary: aurora gradient fill, white text, 12px radius
- Secondary: glass panel with border, purple text
- Hover: scale(1.02), glow intensifies

### Cards
- Glass panels with blur(12px) backdrop
- Semi-transparent border
- Subtle purple glow on hover
- 20px border radius

### Forms
- Glass inputs with transparent backgrounds
- Border turns purple on focus
- Floating labels with smooth transitions

### Footer
- Dark background with subtle gradient border-top
- Multi-column layout with glass card links

## Animation

- **Duration:** 200ms standard, 400ms for page transitions
- **Easing:** \`cubic-bezier(0.4, 0, 0.2, 1)\` for standard, \`cubic-bezier(0.34, 1.56, 0.64, 1)\` for bouncy
- **Hover Effects:** scale(1.02), glow intensification, border color shift
- **Entrance:** Fade-up with 20ms stagger per element
- **Transitions:** \`transform 200ms ease, box-shadow 300ms ease, opacity 200ms ease\`

## Responsive Rules

- **Mobile (< 640px):** Single column, hamburger menu, reduced blur for performance, stacked cards
- **Tablet (640px–1024px):** Two-column grid, condensed navigation, 50% opacity on decorative orbs
- **Desktop (> 1024px):** Full grid, floating orbs at full opacity, sidebar navigation available
- **Ultrawide (> 1536px):** Max-width container with additional horizontal padding

## Accessibility

- All glass panels maintain minimum 4.5:1 contrast ratio against text
- Focus-visible outlines use 2px solid \`#7c3aed\` with 2px offset
- Reduced motion: disables orb animations, keeps static gradients
- Screen reader text for decorative elements uses \`aria-hidden="true"\`
- Skip navigation link at top of page

## Performance

- \`backdrop-filter\` uses \`will-change: backdrop-filter\` for GPU acceleration
- Decorative orbs use CSS animations, not JavaScript
- Gradients are CSS-only, no image assets
- Font loading uses \`font-display: swap\`
- Images use \`loading="lazy"\` and modern formats

## Implementation Rules

1. All glass surfaces must use CSS custom properties for colors to enable theming
2. Orb animations must be paused when out of viewport using Intersection Observer
3. \`prefers-reduced-motion\` must disable all floating animations
4. Never use \`backdrop-filter\` on elements that overlap text directly
5. Test contrast ratios with both dark and light aurora gradient backgrounds
6. Use semantic HTML: \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\``,
    ai_prompt: "A glassmorphism SaaS design with aurora borealis gradients, frosted glass panels, floating orbs, semi-transparent navigation, and a purple-blue-cyan color palette on a dark background.",
    technologies: ["CSS backdrop-filter", "CSS gradients", "Intersection Observer"],
    frameworks: ["React", "Next.js", "Tailwind CSS"],
    tags: ["glassmorphism", "aurora", "SaaS", "dark-theme", "premium", "translucent"],
    seo: {
      meta_title: "Aurora Glass - Glassmorphism SaaS Design | VizoDesign",
      meta_description: "Frosted glass SaaS design with aurora borealis gradients, floating orbs, and semi-transparent panels. Perfect for AI startups and premium products.",
      keywords: ["glassmorphism", "aurora", "SaaS design", "frosted glass", "dark theme", "AI startup"],
    },
    view_count: 4283,
    copy_count: 312,
    sort_order: 0,
    published_at: "2025-01-15T00:00:00Z",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
    deleted_at: null,
  },

  // -----------------------------------------------------------------------
  // 2. Midnight SaaS
  // -----------------------------------------------------------------------
  {
    id: "00000000-0000-0000-0000-000000000002",
    slug: "midnight-saas",
    name: "Midnight SaaS",
    description:
      "A dark professional SaaS theme built on deep navy backgrounds with electric blue accents. The design prioritizes clarity and data density while maintaining a refined, corporate-appropriate aesthetic.",
    short_description:
      "Dark professional SaaS with deep navy backgrounds and electric blue accents.",
    category_id: findCategory("dark-premium"),
    status: "published",
    featured: true,
    theme: "dark",
    style_type: "dark-premium",
    mood: "professional",
    best_for: ["B2B SaaS", "dashboards"],
    animation_level: "minimal",
    has_3d: false,
    responsive: true,
    accessibility_level: "wcag-aware",
    preview_type: "component",
    preview_component: "midnight-saas",
    preview_image: null,
    thumbnail: null,
    design_system: {
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        background: "#0a1628",
        surface: "#111d33",
        border: "#1e2d4a",
        text: "#e2e8f0",
        muted: "#64748b",
        accent: "#38bdf8",
      },
      typography: {
        fontFamily: "'Inter', system-ui, sans-serif",
        headingScale: "clamp(1.75rem, 4vw, 3rem)",
        bodyScale: "1rem",
        fontWeights: "400,500,600,700",
        lineHeights: "1.6,1.3,1.15",
      },
      spacing: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem" },
      borderRadius: { sm: "6px", md: "8px", lg: "12px", xl: "16px", full: "9999px" },
      shadows: {
        card: "0 4px 24px rgba(0,0,0,0.4)",
        elevated: "0 8px 40px rgba(0,0,0,0.5)",
        glow: "0 0 20px rgba(59,130,246,0.15)",
      },
      gradients: [
        "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        "linear-gradient(180deg, #0a1628 0%, #111d33 100%)",
      ],
      components: {
        navbar: "solid-dark",
        hero: "split-layout",
        card: "elevated-surface",
        button: "filled-blue",
        input: "dark-input",
      },
    },
    design_markdown: `# Midnight SaaS

## Design Philosophy

Midnight SaaS is rooted in **clarity through contrast**. In a landscape of noisy dashboards and cluttered B2B tools, this design proves that restraint is a superpower. Every pixel serves a purpose; every color choice is deliberate.

The philosophy borrows from Bloomberg Terminal and Linear's design language: information density is not the enemy of beauty. When executed with precision, data-heavy interfaces can feel calm, authoritative, and effortlessly professional.

## Design Goals

- Present complex information hierarchically without overwhelming users
- Achieve WCAG AAA contrast on all text elements
- Support data-dense layouts without sacrificing breathing room
- Maintain performance above 95 Lighthouse score
- Convey trust and reliability for enterprise buyers

## Visual Language

Midnight SaaS communicates through **structured darkness**. The deep navy background (\`#0a1628\`) creates a void in which information floats as elevated surfaces. The electric blue accent (\`#3b82f6\`) acts as a guiding light — it appears only where user attention is needed.

Surfaces are solid, not translucent. Depth is communicated through subtle elevation changes and border treatments rather than blur effects. This creates a predictable, scannable interface.

## Color System

| Token           | Value     | Usage                       |
|-----------------|-----------|-----------------------------|
| background      | \`#0a1628\` | Page background             |
| surface         | \`#111d33\` | Card backgrounds            |
| surface-elevated| \`#162240\` | Hover states, active items  |
| primary         | \`#3b82f6\` | CTAs, links, active states  |
| primary-hover   | \`#2563eb\` | Button hover                |
| secondary       | \`#64748b\` | Muted text, secondary info  |
| accent          | \`#38bdf8\` | Notifications, badges       |
| text            | \`#e2e8f0\` | Primary text                |
| text-muted      | \`#64748b\` | Secondary text              |
| border          | \`#1e2d4a\` | Panel borders               |
| success         | \`#22c55e\` | Positive states             |
| warning         | \`#f59e0b\` | Caution states              |
| error           | \`#ef4444\` | Error states                |

## Typography

- **Primary Font:** Inter
- **Heading Scale:** \`clamp(1.75rem, 4vw, 3rem)\` for H1, 75% per level
- **Body Size:** 15px, line-height 1.6
- **Font Weights:** 400 (body), 500 (labels), 600 (subheadings), 700 (headings)
- **Tabular Numbers:** Enabled for data displays and metrics

## Spacing System

Base unit: 4px

| Token | Value  | Usage                    |
|-------|--------|--------------------------|
| xs    | 4px    | Inline icon gaps         |
| sm    | 8px    | Tight element spacing    |
| md    | 16px   | Component internals      |
| lg    | 24px   | Card padding             |
| xl    | 32px   | Section gaps             |
| 2xl   | 48px   | Major sections           |
| 3xl   | 64px   | Hero area                |

## Border Radius

| Token | Value | Usage                    |
|-------|-------|--------------------------|
| sm    | 6px   | Inputs, small buttons    |
| md    | 8px   | Cards, panels            |
| lg    | 12px  | Modals, dropdowns        |
| xl    | 16px  | Feature sections         |
| full  | 9999px| Avatars, pills           |

## Shadows

\`\`\`css
.card-shadow {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}
.elevated-shadow {
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
}
.blue-glow {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
}
\`\`\`

## Gradients

\`\`\`css
.primary-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}
.bg-gradient {
  background: linear-gradient(180deg, #0a1628 0%, #111d33 100%);
}
\`\`\`

## Layout

- **Container:** max-width 1280px, centered
- **Sidebar:** 260px fixed, collapsible on tablet
- **Content Area:** fluid, padding 32px
- **Grid:** CSS Grid, 12-column on desktop, auto-fill on mobile
- **Breakpoints:**
  - Mobile: < 640px (single column, bottom nav)
  - Tablet: 640px–1024px (sidebar collapsed)
  - Desktop: > 1024px (full sidebar + content)

## Components

### Navbar
- Solid dark background \`#111d33\`
- 56px height, fixed top
- Logo left, search center, profile right
- Bottom border \`#1e2d4a\`

### Hero
- Split layout: content left, illustration/preview right
- Headline bold 700 weight
- Subtitle in muted color
- Two CTAs: filled primary, ghost secondary

### Buttons
- Primary: \`#3b82f6\` fill, white text, 8px radius
- Secondary: transparent with \`#1e2d4a\` border
- Ghost: text-only, background on hover
- Size: 40px height standard, 48px large

### Cards
- \`#111d33\` background
- 1px \`#1e2d4a\` border
- 24px padding
- Hover: border color shifts to \`#3b82f6\`

### Data Tables
- Zebra striping with alternating \`#111d33\` and \`#0f1a2e\`
- Sticky headers
- Sortable columns with subtle indicators

### Footer
- Three-column layout
- Muted text, no background distinction from page

## Animation

- **Duration:** 150ms for interactions, 300ms for page transitions
- **Easing:** \`ease-out\` for enter, \`ease-in\` for exit
- **Hover Effects:** Border color transition, subtle background shift
- **Entrance:** None — content-first, no distracting load animations
- **Transitions:** \`background-color 150ms ease, border-color 150ms ease\`

## Responsive Rules

- **Mobile (< 640px):** Bottom tab navigation, stacked cards, full-width inputs, 16px padding
- **Tablet (640px–1024px):** Collapsible sidebar, two-column grid, 24px padding
- **Desktop (> 1024px):** Fixed sidebar, 12-column grid, 32px padding
- **Data tables:** Horizontal scroll on mobile, full on desktop

## Accessibility

- All text meets WCAG AAA (7:1 contrast minimum)
- Focus indicators: 2px blue outline with 2px offset
- Screen reader announcements for dynamic content via aria-live
- Keyboard navigation follows logical tab order
- Data charts include text alternatives

## Performance

- No backdrop-filter — all surfaces are solid for performance
- CSS-only animations, no JavaScript-driven motion
- System font stack fallback for fast initial paint
- Images optimized with next/image, WebP format
- Critical CSS inlined for above-the-fold content

## Implementation Rules

1. Never use opacity below 0.9 for text — maintain contrast at all costs
2. All interactive elements must have visible focus states
3. Use CSS custom properties for all colors to support future theming
4. Sidebar state (open/closed) must persist in localStorage
5. Table sorting must be accessible via keyboard
6. Test with Windows High Contrast Mode`,
    ai_prompt: "A dark professional SaaS design with deep navy backgrounds, electric blue accents, clean typography, sidebar navigation, and a data-dense but clean layout for B2B applications.",
    technologies: ["CSS Grid", "CSS Custom Properties", "localStorage"],
    frameworks: ["React", "Next.js", "Tailwind CSS"],
    tags: ["dark-theme", "SaaS", "B2B", "dashboard", "professional", "navy"],
    seo: {
      meta_title: "Midnight SaaS - Dark Professional SaaS Design | VizoDesign",
      meta_description: "Dark professional SaaS theme with deep navy backgrounds, electric blue accents, and clean typography. Built for B2B applications and dashboards.",
      keywords: ["dark SaaS", "professional design", "B2B", "dashboard", "navy theme", "electric blue"],
    },
    view_count: 5621,
    copy_count: 487,
    sort_order: 1,
    published_at: "2025-01-15T00:00:00Z",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
    deleted_at: null,
  },

  // -----------------------------------------------------------------------
  // 3. Bento Flow
  // -----------------------------------------------------------------------
  {
    id: "00000000-0000-0000-0000-000000000003",
    slug: "bento-flow",
    name: "Bento Flow",
    description:
      "A bento grid layout inspired by Apple's design language with rounded cards, asymmetric grids, and card-based navigation. The warm neutral palette with orange accents creates an inviting, approachable experience.",
    short_description:
      "Bento grid layout with Apple-inspired spacing and asymmetric card grids.",
    category_id: findCategory("bento"),
    status: "published",
    featured: true,
    theme: "both",
    style_type: "bento",
    mood: "clean",
    best_for: ["Landing pages", "feature showcases"],
    animation_level: "medium",
    has_3d: false,
    responsive: true,
    accessibility_level: "wcag-aware",
    preview_type: "component",
    preview_component: "bento-flow",
    preview_image: null,
    thumbnail: null,
    design_system: {
      colors: {
        primary: "#f97316",
        secondary: "#78716c",
        background: "#fafaf9",
        surface: "#ffffff",
        border: "#e7e5e4",
        text: "#1c1917",
        muted: "#a8a29e",
        accent: "#ea580c",
      },
      typography: {
        fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif",
        headingScale: "clamp(2rem, 5vw, 4rem)",
        bodyScale: "1rem",
        fontWeights: "400,500,600,700",
        lineHeights: "1.5,1.2,1.1",
      },
      spacing: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem" },
      borderRadius: { sm: "12px", md: "16px", lg: "24px", xl: "32px", full: "9999px" },
      shadows: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        elevated: "0 4px 24px rgba(0,0,0,0.08)",
        hover: "0 8px 32px rgba(0,0,0,0.1)",
      },
      gradients: [
        "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
      ],
      components: {
        navbar: "minimal-clean",
        hero: "bento-grid",
        card: "bento-card",
        button: "rounded-pill",
        input: "rounded-input",
      },
    },
    design_markdown: `# Bento Flow

## Design Philosophy

Bento Flow embraces the **asymmetric harmony** of Japanese bento box composition. Each card is a self-contained thought, yet together they form a cohesive visual narrative. The design rejects rigid 12-column grids in favor of organic, purposeful arrangements where size communicates importance.

Inspired by Apple's WWDC presentations and product pages, Bento Flow treats each section as a distinct "dish" — some large and detailed, others compact and focused — arranged on a shared tray with consistent spacing and generous padding.

## Design Goals

- Communicate feature hierarchy through card size and placement
- Create a playful yet professional first impression
- Ensure the grid adapts gracefully from 1-column mobile to multi-column desktop
- Maintain visual balance despite asymmetric layouts
- Make every card feel like a curated, intentional composition

## Visual Language

The visual language is **warm minimalism**. Backgrounds are near-white warm neutrals (\`#fafaf9\`), cards are pure white with subtle shadows, and the orange accent (\`#f97316\`) injects energy without aggression.

Cards have generous padding (24-32px) and large border-radius (16-24px), creating a friendly, approachable feel. Typography is clean with tight heading line-heights for impact.

## Color System

| Token           | Value     | Usage                       |
|-----------------|-----------|-----------------------------|
| background      | \`#fafaf9\` | Page background             |
| surface         | \`#ffffff\` | Card backgrounds            |
| primary         | \`#f97316\` | CTAs, highlights            |
| primary-hover   | \`#ea580c\` | Button hover                |
| secondary       | \`#78716c\` | Secondary text              |
| accent          | \`#fed7aa\` | Accent backgrounds          |
| text            | \`#1c1917\` | Headings, body              |
| text-muted      | \`#a8a29e\` | Captions, metadata          |
| border          | \`#e7e5e4\` | Card borders, dividers      |
| surface-warm    | \`#fef3c7\` | Highlighted cards           |

## Typography

- **Primary Font:** SF Pro Display (system), Inter (web)
- **Heading Scale:** \`clamp(2rem, 5vw, 4rem)\` for hero, 60% per level
- **Body Size:** 16px, line-height 1.5
- **Font Weights:** 400 (body), 500 (labels), 600 (subheadings), 700 (headings)
- **Letter Spacing:** -0.03em for large headings

## Spacing System

Base unit: 4px

| Token | Value  | Usage                    |
|-------|--------|--------------------------|
| xs    | 4px    | Inline gaps              |
| sm    | 8px    | Tight spacing            |
| md    | 16px   | Card internal gaps       |
| lg    | 24px   | Card padding             |
| xl    | 32px   | Grid gap                 |
| 2xl   | 48px   | Section spacing          |
| 3xl   | 64px   | Hero padding             |

## Border Radius

| Token | Value | Usage                    |
|-------|-------|--------------------------|
| sm    | 12px  | Inputs, small cards      |
| md    | 16px  | Standard cards           |
| lg    | 24px  | Feature cards            |
| xl    | 32px  | Hero sections            |
| full  | 9999px| Buttons, badges          |

## Shadows

\`\`\`css
.card-shadow {
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
}
.elevated-shadow {
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}
.hover-shadow {
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}
\`\`\`

## Gradients

\`\`\`css
.cta-gradient {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}
.warm-gradient {
  background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
}
\`\`\`

## Layout

- **Container:** max-width 1200px, centered, 24px padding
- **Grid:** CSS Grid with \`grid-template-areas\` for named placement
- **Card Gap:** 16px (mobile), 20px (tablet), 24px (desktop)
- **Section Spacing:** 80px between major sections
- **Breakpoints:**
  - Mobile: < 640px (single column, stacked cards)
  - Tablet: 640px–1024px (two-column bento)
  - Desktop: > 1024px (full bento grid)

### Bento Grid Template (Desktop)

\`\`\`css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
.card-large { grid-column: span 2; grid-row: span 2; }
.card-medium { grid-column: span 2; }
.card-small { grid-column: span 1; }
\`\`\`

## Components

### Navbar
- White background with subtle bottom border
- 64px height, centered logo
- Nav links with hover underline animation
- CTA button with orange gradient

### Hero
- Large bento grid with featured card spanning 2x2
- Animated entrance for cards (staggered fade-up)
- Headline in gradient text for emphasis

### Buttons
- Primary: orange gradient, white text, full border-radius
- Secondary: white with orange border
- Hover: slight elevation increase, shadow deepens

### Cards
- White background, 16px radius
- 24px internal padding
- Hover: translate(-2px), shadow deepens
- Content: icon + title + description

### Feature Grid
- Asymmetric layout with large + small cards
- Large cards contain illustrations
- Small cards contain metrics or icons

### Footer
- Warm gray background
- Multi-column link grid
- Social icons row

## Animation

- **Duration:** 250ms standard, 500ms for entrances
- **Easing:** \`cubic-bezier(0.4, 0, 0.2, 1)\` standard, \`cubic-bezier(0.34, 1.56, 0.64, 1)\` bouncy
- **Hover Effects:** translate(-2px), shadow transition, scale(1.01)
- **Entrance:** Staggered fade-up, 80ms delay between cards
- **Scroll:** Parallax on hero, fade-in on sections

## Responsive Rules

- **Mobile (< 640px):** Single column, all cards full-width, 16px gap
- **Tablet (640px–1024px):** Two columns, large cards span full width
- **Desktop (> 1024px):** Four columns, full bento layout with named areas
- **Card content:** Truncate at 3 lines on small cards, full on large

## Accessibility

- Focus-visible: 2px solid \`#f97316\` with 2px offset
- Reduced motion: disable entrance animations, keep hover transitions
- Cards are focusable with keyboard
- Semantic heading hierarchy within each card
- Color contrast minimum 4.5:1 for all text

## Performance

- CSS Grid layout, no JavaScript for grid management
- Images use \`loading="lazy"\` and aspect-ratio containers
- Font loading with \`font-display: swap\`
- Hover effects use CSS transforms (GPU-accelerated)
- No layout shift from card entrance animations (use \`transform\`)

## Implementation Rules

1. Named grid areas must be defined for desktop, with fallback to auto-fill
2. Card heights must use \`aspect-ratio\` or \`min-content\` — never fixed px
3. Orange accent must never appear on orange backgrounds
4. All cards must be keyboard-focusable
5. Test bento layout at every 100px viewport width increment
6. Large cards must reflow to full-width below 640px`,
    ai_prompt: "A bento grid layout with Apple-inspired spacing, rounded cards, asymmetric grids, warm neutrals, and orange accents. Card-based navigation for feature showcases.",
    technologies: ["CSS Grid", "CSS Grid Template Areas", "Intersection Observer"],
    frameworks: ["React", "Next.js", "Tailwind CSS"],
    tags: ["bento", "grid-layout", "Apple-inspired", "landing-page", "card-based", "warm"],
    seo: {
      meta_title: "Bento Flow - Bento Grid Layout Design | VizoDesign",
      meta_description: "Apple-inspired bento grid layout with asymmetric cards, warm neutrals, and orange accents. Perfect for landing pages and feature showcases.",
      keywords: ["bento grid", "Apple design", "card layout", "landing page", "asymmetric grid", "feature showcase"],
    },
    view_count: 3847,
    copy_count: 291,
    sort_order: 2,
    published_at: "2025-01-15T00:00:00Z",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
    deleted_at: null,
  },

  // -----------------------------------------------------------------------
  // 4. Neo Brutalist
  // -----------------------------------------------------------------------
  {
    id: "00000000-0000-0000-0000-000000000004",
    slug: "neo-brutalist",
    name: "Neo Brutalist",
    description:
      "A raw brutalist design with thick black borders, stark white backgrounds, monospace fonts, and exposed grid structure. Intentionally unpolished aesthetics that rebel against conventional UI design.",
    short_description:
      "Raw brutalist design with thick black borders, monospace fonts, and exposed structure.",
    category_id: findCategory("neo-brutalism"),
    status: "published",
    featured: true,
    theme: "light",
    style_type: "neo-brutalism",
    mood: "bold",
    best_for: ["Creative agencies", "dev tools"],
    animation_level: "minimal",
    has_3d: false,
    responsive: true,
    accessibility_level: "wcag-aware",
    preview_type: "component",
    preview_component: "neo-brutalist",
    preview_image: null,
    thumbnail: null,
    design_system: {
      colors: {
        primary: "#000000",
        secondary: "#dc2626",
        background: "#ffffff",
        surface: "#ffffff",
        border: "#000000",
        text: "#000000",
        muted: "#525252",
        accent: "#dc2626",
      },
      typography: {
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        headingScale: "clamp(2rem, 5vw, 3.5rem)",
        bodyScale: "1rem",
        fontWeights: "400,700",
        lineHeights: "1.5,1.25,1.1",
      },
      spacing: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem" },
      borderRadius: { sm: "0px", md: "0px", lg: "0px", xl: "0px", full: "0px" },
      shadows: {
        brutal: "4px 4px 0px 0px #000000",
        elevated: "6px 6px 0px 0px #000000",
        hover: "8px 8px 0px 0px #000000",
      },
      gradients: [],
      components: {
        navbar: "brutalist-bar",
        hero: "brutalist-hero",
        card: "brutalist-card",
        button: "brutalist-button",
        input: "brutalist-input",
      },
    },
    design_markdown: `# Neo Brutalist

## Design Philosophy

Neo Brutalist rejects the polished, rounded, gradient-soaked aesthetic that dominates modern web design. Instead, it embraces **raw honesty** — thick borders, stark contrasts, exposed structure, and zero ornamentation.

The philosophy is simple: if the structure is the design, there's nothing to hide. Every element wears its purpose on its sleeve. Buttons look like buttons. Cards look like boxes. Navigation looks like a menu. There's no ambiguity, no metaphor, no skeuomorphism — just function made visible.

## Design Goals

- Create an instantly recognizable, memorable visual identity
- Achieve maximum readability through stark contrast
- Celebrate structure rather than concealing it
- Prove that "ugly" can be beautiful when executed with intention
- Make interfaces that feel handmade, human, and anti-corporate

## Visual Language

The visual language is **unapologetically raw**. Every element has a 2-3px solid black border. Shadows are hard-offset with no blur (\`4px 4px 0px #000\`). Border-radius is universally zero. Typography is monospace, reinforcing the technical, DIY aesthetic.

Backgrounds are stark white. Color appears only as accent — primarily red (\`#dc2626\`) for emphasis. The overall effect is reminiscent of printed zines, construction signage, and early computer interfaces.

## Color System

| Token           | Value     | Usage                       |
|-----------------|-----------|-----------------------------|
| background      | \`#ffffff\` | Page background             |
| surface         | \`#ffffff\` | Card backgrounds            |
| primary         | \`#000000\` | Text, borders, icons        |
| secondary       | \`#dc2626\` | Accents, emphasis           |
| text            | \`#000000\` | All text                    |
| text-muted      | \`#525252\` | Secondary text              |
| border          | \`#000000\` | All borders                 |
| accent-red      | \`#dc2626\` | CTAs, badges, alerts        |
| surface-alt     | \`#f5f5f5\` | Alternating sections        |

## Typography

- **Primary Font:** JetBrains Mono
- **Fallback:** Courier New, monospace
- **Heading Scale:** \`clamp(2rem, 5vw, 3.5rem)\` for H1
- **Body Size:** 15px, line-height 1.5
- **Font Weights:** 400 (body), 700 (headings, emphasis)
- **Uppercase:** Used for labels and navigation items
- **Letter Spacing:** 0.05em for uppercase text

## Spacing System

Base unit: 4px

| Token | Value  | Usage                    |
|-------|--------|--------------------------|
| xs    | 4px    | Tight inline gaps        |
| sm    | 8px    | Component internals      |
| md    | 16px   | Card padding             |
| lg    | 24px   | Section padding          |
| xl    | 32px   | Major spacing            |
| 2xl   | 48px   | Section gaps             |
| 3xl   | 64px   | Hero spacing             |

## Border Radius

**Universal: 0px** — No rounded corners anywhere. Every element is a sharp rectangle.

## Shadows

\`\`\`css
.brutal-shadow {
  box-shadow: 4px 4px 0px 0px #000000;
}
.brutal-elevated {
  box-shadow: 6px 6px 0px 0px #000000;
}
.brutal-hover {
  box-shadow: 8px 8px 0px 0px #000000;
}
\`\`\`

On hover, elements shift up-left by 2px and shadow grows — creating a physical "lifting" effect.

## Gradients

None. Gradients are antithetical to the brutalist aesthetic. All color is flat and solid.

## Layout

- **Container:** max-width 960px, centered, 16px padding
- **Grid:** CSS Grid with visible grid lines (border on grid items)
- **Section Spacing:** 0 — sections separated by borders, not whitespace
- **Breakpoints:**
  - Mobile: < 640px (single column, full borders)
  - Tablet: 640px–1024px (two columns)
  - Desktop: > 1024px (three columns)

## Components

### Navbar
- Solid black bar, white text
- 56px height, fixed top
- Logo left, links center-right
- All links uppercase, letter-spacing 0.05em
- Bottom border 3px solid black

### Hero
- Full-width black background
- White text, maximum size
- Red accent line or block
- CTA: white button with black border and offset shadow

### Buttons
- White background, black border (3px)
- Black offset shadow (4px)
- Hover: shadow grows to 8px, button translates -2px
- Active: shadow becomes 0px, button translates 4px (pressed)
- Red variant: red background, white text

### Cards
- White background, 3px black border
- 4px black offset shadow
- 16px internal padding
- Title in bold monospace
- Hover: shadow grows, card lifts

### Forms
- Inputs: white background, 3px black border, no radius
- Focus: red border instead of black
- Labels: uppercase, letter-spacing 0.05em
- Error states: red background on input

### Footer
- Black background, white text
- 3px top border
- Uppercase links

## Animation

- **Duration:** 100ms for interactions
- **Easing:** \`linear\` — no easing curves, everything is mechanical
- **Hover Effects:** Translate -2px, shadow grows from 4px to 8px
- **Active Effects:** Translate 4px, shadow becomes 0 (pressed feel)
- **Entrance:** None — content appears immediately
- **Transitions:** \`transform 100ms linear, box-shadow 100ms linear\`

## Responsive Rules

- **Mobile (< 640px):** Single column, full-width cards, 16px padding, hamburger menu
- **Tablet (640px–1024px):** Two columns, border on every grid cell
- **Desktop (> 1024px):** Three columns, maximum visual density
- **Touch devices:** Shadow effects reduced to 2px for tap targets

## Accessibility

- Black on white exceeds WCAG AAA (21:1 contrast)
- Focus indicators: 3px red outline with 4px offset
- All interactive elements have minimum 44px touch targets
- Screen reader: explicit labels on all icon-only buttons
- Reduced motion: disables translate animations, keeps static shadows

## Performance

- Zero image dependencies — all visuals are CSS
- No JavaScript for visual effects
- System monospace font for zero font-loading time
- Hard shadows are GPU-friendly
- Minimal CSS — total stylesheet under 5KB

## Implementation Rules

1. Never use border-radius — zero tolerance for curves
2. All shadows must be hard-offset, zero blur
3. Text must be black on white or white on black — no exceptions
4. Every interactive element must have visible hover AND active states
5. Grid borders must be visible — the structure IS the design
6. Use \`transform: translate()\` for hover effects, never margin`,
    ai_prompt: "A neo-brutalist design with thick black borders, stark white backgrounds, monospace fonts, exposed grid structure, hard offset shadows, and intentional rawness.",
    technologies: ["CSS Transforms", "CSS Grid", "Hard Box Shadows"],
    frameworks: ["React", "Next.js"],
    tags: ["brutalism", "neo-brutalism", "monospace", "raw", "anti-design", "bold"],
    seo: {
      meta_title: "Neo Brutalist - Raw Brutalist Web Design | VizoDesign",
      meta_description: "Neo-brutalist design with thick black borders, monospace fonts, hard shadows, and exposed grid. For creative agencies and dev tools.",
      keywords: ["neo-brutalism", "brutalist web design", "monospace", "raw design", "creative agency"],
    },
    view_count: 2956,
    copy_count: 198,
    sort_order: 3,
    published_at: "2025-01-15T00:00:00Z",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
    deleted_at: null,
  },

  // -----------------------------------------------------------------------
  // 5. Minimal Apple
  // -----------------------------------------------------------------------
  {
    id: "00000000-0000-0000-0000-000000000005",
    slug: "minimal-apple",
    name: "Minimal Apple",
    description:
      "An ultra-clean minimal design with generous whitespace, thin typography, subtle animations, and centered layouts. Every element is distilled to its essence, creating a serene and focused experience.",
    short_description:
      "Ultra-clean minimal design with generous whitespace and thin typography.",
    category_id: findCategory("minimal"),
    status: "published",
    featured: false,
    theme: "light",
    style_type: "minimal",
    mood: "elegant",
    best_for: ["Product pages", "portfolios"],
    animation_level: "minimal",
    has_3d: false,
    responsive: true,
    accessibility_level: "wcag-aware",
    preview_type: "component",
    preview_component: "minimal-apple",
    preview_image: null,
    thumbnail: null,
    design_system: {
      colors: {
        primary: "#000000",
        secondary: "#6b7280",
        background: "#ffffff",
        surface: "#ffffff",
        border: "#f3f4f6",
        text: "#111827",
        muted: "#9ca3af",
        accent: "#000000",
      },
      typography: {
        fontFamily: "'SF Pro Text', 'Inter', system-ui, sans-serif",
        headingScale: "clamp(2.5rem, 6vw, 5rem)",
        bodyScale: "1rem",
        fontWeights: "300,400,500,600",
        lineHeights: "1.6,1.2,1.05",
      },
      spacing: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "2rem", xl: "3rem", "2xl": "5rem", "3xl": "8rem" },
      borderRadius: { sm: "4px", md: "8px", lg: "12px", xl: "16px", full: "9999px" },
      shadows: {
        subtle: "0 1px 2px rgba(0,0,0,0.04)",
        card: "0 2px 8px rgba(0,0,0,0.04)",
        elevated: "0 8px 32px rgba(0,0,0,0.06)",
      },
      gradients: [],
      components: {
        navbar: "minimal-transparent",
        hero: "centered-text",
        card: "borderless",
        button: "minimal-outline",
        input: "underline-only",
      },
    },
    design_markdown: `# Minimal Apple

## Design Philosophy

Minimal Apple is an exercise in **radical reduction**. The design asks one question at every decision point: "Can this be removed?" If the answer is yes, it's removed. What remains is essential — pure signal with zero noise.

The philosophy draws from Dieter Rams' ten principles of good design, particularly "less, but better." Every element earns its place through function, not decoration. White space is not empty — it's the most important design element, creating rhythm, hierarchy, and breathing room.

## Design Goals

- Achieve maximum impact through minimum means
- Let content speak without competing visual noise
- Create a sense of calm, focused sophistication
- Ensure instant comprehension of page structure
- Make typography the primary design element

## Visual Language

The visual language is **monochrome serenity**. The palette is strictly black, white, and gray. No color appears anywhere — not even as accent. This constraint forces excellence in typography, spacing, and proportion.

Backgrounds are pure white. Text is near-black. The only visual variation comes from font weight, size, and the generous orchestration of white space. Borders are nearly invisible (\`#f3f4f6\`), appearing only when structural separation is necessary.

## Color System

| Token           | Value     | Usage                       |
|-----------------|-----------|-----------------------------|
| background      | \`#ffffff\` | Page background             |
| surface         | \`#ffffff\` | Card backgrounds            |
| primary         | \`#000000\` | Headings, CTAs              |
| secondary       | \`#6b7280\` | Secondary text              |
| text            | \`#111827\` | Body text                   |
| text-muted      | \`#9ca3af\` | Captions, metadata          |
| border          | \`#f3f4f6\` | Subtle dividers             |

## Typography

- **Primary Font:** SF Pro Text (system), Inter (web)
- **Heading Scale:** \`clamp(2.5rem, 6vw, 5rem)\` for H1 — very large, very thin
- **Body Size:** 17px, line-height 1.6 — optimized for reading comfort
- **Font Weights:** 300 (headings — thin/light), 400 (body), 500 (labels), 600 (emphasis)
- **Line Heights:** Headings at 1.05 for tight, elegant stacking
- **Letter Spacing:** -0.04em for large headings, normal for body

## Spacing System

Base unit: 4px — but sections use multiples of 8px

| Token | Value  | Usage                    |
|-------|--------|--------------------------|
| xs    | 4px    | Micro gaps               |
| sm    | 8px    | Tight spacing            |
| md    | 16px   | Component padding        |
| lg    | 32px   | Card padding             |
| xl    | 48px   | Section padding          |
| 2xl   | 80px   | Major sections           |
| 3xl   | 128px  | Hero sections            |

## Border Radius

| Token | Value | Usage                    |
|-------|-------|--------------------------|
| sm    | 4px   | Inputs                   |
| md    | 8px   | Small cards              |
| lg    | 12px  | Images                   |
| xl    | 16px  | Modal containers         |
| full  | 9999px| Avatars                  |

## Shadows

\`\`\`css
.subtle-shadow {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.card-shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.elevated-shadow {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}
\`\`\`

Shadows are intentionally imperceptible at first glance. They exist only to create subtle depth cues.

## Gradients

None. Gradients introduce visual complexity that contradicts the minimal philosophy.

## Layout

- **Container:** max-width 720px for text content, 1080px for media
- **Grid:** Single column for text, optional 2-column for galleries
- **Section Spacing:** 128px between major sections
- **Breakpoints:**
  - Mobile: < 640px (full-width, 20px padding)
  - Tablet: 640px–1024px (centered, 40px padding)
  - Desktop: > 1024px (centered, 64px padding)

## Components

### Navbar
- Transparent background, blends with page
- 72px height, centered logo
- Links: small, uppercase, letter-spacing 0.1em
- Sticky with subtle backdrop blur on scroll

### Hero
- Centered text layout, max-width 640px
- H1 in 300 weight, massive size
- Subtitle in muted color, 17px
- Single CTA: text link with underline, no button

### Buttons
- Primary: black background, white text, 100px border-radius
- Secondary: transparent with thin black border
- Hover: opacity 0.8
- Size: 48px height, generous horizontal padding

### Cards
- No borders, no shadows by default
- Content-focused with generous internal whitespace
- Hover: subtle shadow appears
- Images: full-bleed within card, 12px radius

### Forms
- Underline-only inputs (no background, no border)
- Focus: underline turns black
- Labels float above on focus
- Minimal validation — inline, subtle

### Footer
- Simple text, centered
- Single-column, generous top padding
- Links in muted color

## Animation

- **Duration:** 400ms standard
- **Easing:** \`cubic-bezier(0.25, 0.1, 0.25, 1)\` — smooth, Apple-like
- **Hover Effects:** Opacity change only (0.8), no movement
- **Entrance:** Fade-in only, 400ms, no translation
- **Scroll:** Fade-in sections as they enter viewport
- **Transitions:** \`opacity 400ms ease\`

## Responsive Rules

- **Mobile (< 640px):** Single column, reduced heading size, 20px padding
- **Tablet (640px–1024px):** Centered content, 40px padding
- **Desktop (> 1024px):** Max-width containers, 64px padding
- **Typography:** Fluid scaling with clamp() — no breakpoints needed

## Accessibility

- Black on white: 21:1 contrast ratio (WCAG AAA)
- Focus indicators: 2px black outline with 4px offset
- All images have descriptive alt text
- Semantic HTML throughout
- Reduced motion: fade-in becomes instant

## Performance

- Zero JavaScript for visual effects
- System font stack for zero font-loading
- No images in default state — typography-driven
- Minimal CSS — under 4KB total
- Perfect Lighthouse score target

## Implementation Rules

1. Never use more than 2 font weights per page
2. White space must be deliberate — measured in multiples of 8px
3. No decorative elements — every pixel must serve function
4. Typography must be beautiful at every viewport size
5. Test in grayscale — if it doesn't work without color, it doesn't work
6. Never add shadow, border, or decoration "just because"`,
    ai_prompt: "An ultra-clean minimal design with generous whitespace, thin typography, subtle animations, centered layouts, and a strict monochrome palette.",
    technologies: ["CSS clamp()", "Intersection Observer", "CSS Transitions"],
    frameworks: ["React", "Next.js"],
    tags: ["minimal", "clean", "monochrome", "Apple-inspired", "typography", "elegant"],
    seo: {
      meta_title: "Minimal Apple - Ultra-Clean Minimal Design | VizoDesign",
      meta_description: "Ultra-clean minimal design with generous whitespace, thin typography, and monochrome palette. Perfect for product pages and portfolios.",
      keywords: ["minimal design", "clean UI", "monochrome", "whitespace", "Apple design", "product page"],
    },
    view_count: 6234,
    copy_count: 543,
    sort_order: 4,
    published_at: "2025-01-15T00:00:00Z",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
    deleted_at: null,
  },

  // -----------------------------------------------------------------------
  // 6. AI Nebula
  // -----------------------------------------------------------------------
  {
    id: "00000000-0000-0000-0000-000000000006",
    slug: "ai-nebula",
    name: "AI Nebula",
    description:
      "A futuristic AI design with deep space backgrounds, neural network patterns, glowing accents, and holographic elements. Built for products at the frontier of artificial intelligence and machine learning.",
    short_description:
      "Futuristic AI design with deep space backgrounds and holographic elements.",
    category_id: findCategory("ai-futuristic"),
    status: "published",
    featured: false,
    theme: "dark",
    style_type: "ai-futuristic",
    mood: "innovative",
    best_for: ["AI products", "research platforms"],
    animation_level: "high",
    has_3d: true,
    responsive: true,
    accessibility_level: "wcag-aware",
    preview_type: "component",
    preview_component: "ai-nebula",
    preview_image: null,
    thumbnail: null,
    design_system: {
      colors: {
        primary: "#a855f7",
        secondary: "#06b6d4",
        background: "#030014",
        surface: "rgba(255,255,255,0.04)",
        border: "rgba(255,255,255,0.08)",
        text: "#e9d5ff",
        muted: "#7c3aed",
        accent: "#f0abfc",
      },
      typography: {
        fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
        headingScale: "clamp(2rem, 5vw, 3.5rem)",
        bodyScale: "1rem",
        fontWeights: "400,500,600,700",
        lineHeights: "1.5,1.25,1.1",
      },
      spacing: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem" },
      borderRadius: { sm: "8px", md: "12px", lg: "16px", xl: "24px", full: "9999px" },
      shadows: {
        glow: "0 0 60px rgba(168,85,247,0.3)",
        cyan: "0 0 40px rgba(6,182,212,0.25)",
        holographic: "0 0 80px rgba(240,171,252,0.2)",
      },
      gradients: [
        "linear-gradient(135deg, #a855f7 0%, #06b6d4 50%, #f0abfc 100%)",
        "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.2) 0%, transparent 70%)",
        "conic-gradient(from 180deg, #a855f7, #06b6d4, #f0abfc, #a855f7)",
      ],
      components: {
        navbar: "glass-futuristic",
        hero: "particle-bg",
        card: "holographic-border",
        button: "glow-fill",
        input: "neon-border",
      },
    },
    design_markdown: `# AI Nebula

## Design Philosophy

AI Nebula channels the **mystery and promise of artificial intelligence**. The design visualizes the infinite complexity of neural networks through deep space metaphors — vast dark backgrounds punctuated by luminous nodes of information, connected by flowing gradients that evoke data in motion.

The core belief is that AI products should feel like stepping into the future, not another SaaS dashboard. Every interaction should feel slightly magical, as if the interface itself is intelligent.

## Design Goals

- Create an immersive, futuristic atmosphere that differentiates AI products
- Balance visual spectacle with usability and readability
- Use animation to suggest intelligence and responsiveness
- Maintain performance despite rich visual effects
- Support both technical and non-technical audiences

## Visual Language

The visual language is **cosmic intelligence**. Backgrounds are near-black with deep purple undertones (\`#030014\`), suggesting the vastness of space or the depth of a neural network. Information floats as luminous panels with holographic borders.

Purple (\`#a855f7\`) represents AI cognition, cyan (\`#06b6d4\`) represents data flow, and pink (\`#f0abfc\`) represents human-AI interaction. These colors glow, pulse, and flow across the interface.

## Color System

| Token           | Value     | Usage                       |
|-----------------|-----------|-----------------------------|
| background      | \`#030014\` | Deep space background       |
| surface         | \`rgba(255,255,255,0.04)\` | Panel backgrounds    |
| primary         | \`#a855f7\` | AI/cognition elements       |
| secondary       | \`#06b6d4\` | Data flow, secondary CTAs   |
| accent          | \`#f0abfc\` | Highlights, interactions    |
| text            | \`#e9d5ff\` | Primary text                |
| text-muted      | \`#7c3aed\` | Secondary text              |
| border          | \`rgba(255,255,255,0.08)\` | Panel borders       |
| neon-purple     | \`#c084fc\` | Glowing accents             |
| neon-cyan       | \`#22d3ee\` | Data visualization          |

## Typography

- **Primary Font:** Space Grotesk (geometric, futuristic)
- **Mono Font:** JetBrains Mono (for code/data)
- **Heading Scale:** \`clamp(2rem, 5vw, 3.5rem)\`
- **Body Size:** 16px, line-height 1.5
- **Font Weights:** 400 (body), 500 (labels), 600 (subheadings), 700 (headings)
- **Special:** Gradient text for hero headings via \`background-clip: text\`

## Spacing System

Base unit: 4px

| Token | Value  | Usage                    |
|-------|--------|--------------------------|
| xs    | 4px    | Micro gaps               |
| sm    | 8px    | Tight spacing            |
| md    | 16px   | Component padding        |
| lg    | 24px   | Card padding             |
| xl    | 32px   | Section padding          |
| 2xl   | 48px   | Major sections           |
| 3xl   | 64px   | Hero area                |

## Border Radius

| Token | Value | Usage                    |
|-------|-------|--------------------------|
| sm    | 8px   | Inputs                   |
| md    | 12px  | Cards                    |
| lg    | 16px  | Feature panels           |
| xl    | 24px  | Hero containers          |
| full  | 9999px| Avatars, badges          |

## Shadows

\`\`\`css
.purple-glow {
  box-shadow: 0 0 60px rgba(168, 85, 247, 0.3);
}
.cyan-glow {
  box-shadow: 0 0 40px rgba(6, 182, 212, 0.25);
}
.holographic-glow {
  box-shadow: 0 0 80px rgba(240, 171, 252, 0.2);
}
\`\`\`

## Gradients

\`\`\`css
.ai-gradient {
  background: linear-gradient(135deg, #a855f7 0%, #06b6d4 50%, #f0abfc 100%);
}
.nebula-gradient {
  background: radial-gradient(circle at 50% 50%, rgba(168,85,247,0.2) 0%, transparent 70%);
}
.holographic {
  background: conic-gradient(from 180deg, #a855f7, #06b6d4, #f0abfc, #a855f7);
}
.gradient-text {
  background: linear-gradient(135deg, #a855f7, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
\`\`\`

## Layout

- **Container:** max-width 1200px, centered
- **Grid:** CSS Grid with named areas
- **Section Spacing:** 96px between major sections
- **Breakpoints:**
  - Mobile: < 640px (single column)
  - Tablet: 640px–1024px (two columns)
  - Desktop: > 1024px (full layout with sidebar)

## Components

### Navbar
- Glass panel with \`backdrop-filter: blur(20px)\`
- Semi-transparent \`rgba(3,0,20,0.8)\` background
- Logo with gradient text
- Links with hover glow effect

### Hero
- Full viewport with animated particle background
- Gradient text headline
- Holographic CTA button
- Neural network SVG pattern overlay

### Buttons
- Primary: purple-to-cyan gradient fill
- Secondary: glass with holographic border
- Hover: glow intensifies, scale(1.02)
- Active: glow pulse animation

### Cards
- Glass panels with holographic border on hover
- Subtle inner glow
- Content: icon with gradient background + text
- Hover: border becomes animated gradient

### Data Visualization
- Glowing chart lines with gradient fills
- Animated data points
- Pulsing connection lines

### Footer
- Deep space background
- Gradient divider line
- Social icons with individual glow colors

## Animation

- **Duration:** 300ms standard, 600ms for complex transitions
- **Easing:** \`cubic-bezier(0.4, 0, 0.2, 1)\`
- **Hover Effects:** Glow intensification, border gradient animation
- **Entrance:** Particle convergence, elements fade from glow
- **Continuous:** Subtle floating, pulsing glows, particle drift
- **Transitions:** \`transform 300ms ease, box-shadow 400ms ease, border-color 400ms ease\`

## Responsive Rules

- **Mobile (< 640px):** Reduced particle count, simplified gradients, 16px padding
- **Tablet (640px–1024px):** Moderate visual effects, two-column layout
- **Desktop (> 1024px):** Full particle system, holographic effects, sidebar
- **Performance:** Particle count scales with device capability

## Accessibility

- All text maintains 4.5:1 contrast against dark backgrounds
- Focus indicators use solid purple outline
- Reduced motion: disables particles and floating, keeps gradients static
- Screen reader: all decorative elements marked \`aria-hidden\`
- Keyboard navigation follows logical reading order

## Performance

- Particle system uses Canvas API, not DOM elements
- \`will-change\` on animated elements for GPU acceleration
- Gradients are CSS-only
- \`prefers-reduced-motion\` disables all continuous animations
- Particles pause when tab is not visible

## Implementation Rules

1. Particle background must use Canvas, never DOM-based particles
2. All glowing effects must use \`will-change: box-shadow\`
3. Holographic borders must use \`conic-gradient\` with \`border-image\`
4. Test performance on mid-range devices — 60fps minimum
5. Gradient text must include solid fallback for unsupported browsers
6. Never let animation block user interaction`,
    ai_prompt: "A futuristic AI design with deep space backgrounds, neural network patterns, glowing purple and cyan accents, holographic elements, and particle animations.",
    technologies: ["Canvas API", "CSS backdrop-filter", "CSS Conic Gradients", "Intersection Observer"],
    frameworks: ["React", "Next.js", "Tailwind CSS"],
    tags: ["AI", "futuristic", "holographic", "dark-theme", "neural-network", "space"],
    seo: {
      meta_title: "AI Nebula - Futuristic AI Design | VizoDesign",
      meta_description: "Futuristic AI design with deep space backgrounds, holographic elements, glowing accents, and particle animations. Built for AI products and research.",
      keywords: ["AI design", "futuristic UI", "holographic", "neural network", "machine learning", "deep space"],
    },
    view_count: 3412,
    copy_count: 267,
    sort_order: 5,
    published_at: "2025-01-15T00:00:00Z",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
    deleted_at: null,
  },

  // -----------------------------------------------------------------------
  // 7. Luxury Black
  // -----------------------------------------------------------------------
  {
    id: "00000000-0000-0000-0000-000000000007",
    slug: "luxury-black",
    name: "Luxury Black",
    description:
      "A premium luxury design with jet black backgrounds, gold and champagne accents, serif typography, and elegant spacing. Conveys exclusivity, refinement, and timeless sophistication.",
    short_description:
      "Premium luxury with jet black backgrounds, gold accents, and serif typography.",
    category_id: findCategory("luxury"),
    status: "published",
    featured: false,
    theme: "dark",
    style_type: "luxury",
    mood: "elegant",
    best_for: ["High-end products", "agencies"],
    animation_level: "minimal",
    has_3d: false,
    responsive: true,
    accessibility_level: "wcag-aware",
    preview_type: "component",
    preview_component: "luxury-black",
    preview_image: null,
    thumbnail: null,
    design_system: {
      colors: {
        primary: "#d4a574",
        secondary: "#1a1a1a",
        background: "#0a0a0a",
        surface: "#141414",
        border: "#262626",
        text: "#f5f0eb",
        muted: "#737373",
        accent: "#c9a96e",
      },
      typography: {
        fontFamily: "'Playfair Display', 'Georgia', serif",
        headingScale: "clamp(2rem, 5vw, 3.5rem)",
        bodyScale: "1rem",
        fontWeights: "400,500,600,700",
        lineHeights: "1.5,1.3,1.1",
      },
      spacing: { xs: "0.5rem", sm: "1rem", md: "1.5rem", lg: "2rem", xl: "3rem", "2xl": "4rem", "3xl": "6rem" },
      borderRadius: { sm: "2px", md: "4px", lg: "8px", xl: "12px", full: "9999px" },
      shadows: {
        card: "0 4px 32px rgba(0,0,0,0.5)",
        gold: "0 0 40px rgba(201,169,110,0.15)",
        elevated: "0 16px 64px rgba(0,0,0,0.6)",
      },
      gradients: [
        "linear-gradient(135deg, #d4a574 0%, #c9a96e 50%, #b8956a 100%)",
        "linear-gradient(180deg, #0a0a0a 0%, #141414 100%)",
      ],
      components: {
        navbar: "luxury-transparent",
        hero: "full-image-overlay",
        card: "elevated-dark",
        button: "gold-gradient",
        input: "luxury-input",
      },
    },
    design_markdown: `# Luxury Black

## Design Philosophy

Luxury Black is built on the principle that **true luxury whispers**. In a world of noise, the most exclusive thing is restraint. Every element is deliberately sparse, every material rich, every detail considered.

The design borrows from haute couture, fine jewelry, and premium automotive brands. Black is not a color choice — it's a statement of exclusivity. Gold is not decoration — it's a seal of quality. The typography doesn't just inform — it commands respect.

## Design Goals

- Convey instant exclusivity and premium positioning
- Create emotional desire through material richness
- Maintain readability despite dark, moody aesthetic
- Support luxury e-commerce and portfolio use cases
- Ensure the design feels timeless, not trendy

## Visual Language

The visual language is **black-tie elegance**. Backgrounds are jet black (\`#0a0a0a\`), surfaces are near-black (\`#141414\`), and the only color is gold/champagne (\`#d4a574\`). Typography is serif — Playfair Display for headings — evoking tradition and authority.

Spacing is exceptionally generous. Elements breathe with 60-80% more whitespace than typical designs. This scarcity of elements on a page signals exclusivity — as if each element is too important to share space with others.

## Color System

| Token           | Value     | Usage                       |
|-----------------|-----------|-----------------------------|
| background      | \`#0a0a0a\` | Page background             |
| surface         | \`#141414\` | Card/panel backgrounds      |
| primary         | \`#d4a574\` | Gold accent, CTAs           |
| primary-hover   | \`#c9a96e\` | Hover states                |
| secondary       | \`#1a1a1a\` | Elevated surfaces           |
| text            | \`#f5f0eb\` | Primary text (warm white)   |
| text-muted      | \`#737373\` | Secondary text              |
| border          | \`#262626\` | Subtle borders              |
| gold-light      | \`#e8d5b7\` | Highlighted gold            |
| gold-dark       | \`#b8956a\` | Deep gold                   |

## Typography

- **Primary Font:** Playfair Display (serif)
- **Body Font:** Inter (sans-serif, for readability)
- **Heading Scale:** \`clamp(2rem, 5vw, 3.5rem)\` — large, commanding
- **Body Size:** 16px, line-height 1.6
- **Font Weights:** 400 (body), 500 (labels), 600 (subheadings), 700 (headings)
- **Letter Spacing:** 0.08em for uppercase elements
- **Special:** Gold gradient text for key headings

## Spacing System

Base unit: 8px — generous spacing throughout

| Token | Value  | Usage                    |
|-------|--------|--------------------------|
| xs    | 8px    | Micro gaps               |
| sm    | 16px   | Tight spacing            |
| md    | 24px   | Component padding        |
| lg    | 32px   | Card padding             |
| xl    | 48px   | Section padding          |
| 2xl   | 64px   | Major sections           |
| 3xl   | 96px   | Hero spacing             |

## Border Radius

| Token | Value | Usage                    |
|-------|-------|--------------------------|
| sm    | 2px   | Inputs, small elements   |
| md    | 4px   | Cards                    |
| lg    | 8px   | Feature sections         |
| xl    | 12px  | Hero containers          |
| full  | 9999px| Avatars                  |

## Shadows

\`\`\`css
.card-shadow {
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.5);
}
.gold-glow {
  box-shadow: 0 0 40px rgba(201, 169, 110, 0.15);
}
.elevated-shadow {
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.6);
}
\`\`\`

## Gradients

\`\`\`css
.gold-gradient {
  background: linear-gradient(135deg, #d4a574 0%, #c9a96e 50%, #b8956a 100%);
}
.gold-text {
  background: linear-gradient(135deg, #d4a574, #c9a96e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.bg-gradient {
  background: linear-gradient(180deg, #0a0a0a 0%, #141414 100%);
}
\`\`\`

## Layout

- **Container:** max-width 1080px, centered
- **Grid:** Single or two-column, very generous spacing
- **Section Spacing:** 96px between major sections
- **Breakpoints:**
  - Mobile: < 640px (single column, 20px padding)
  - Tablet: 640px–1024px (two columns, 40px padding)
  - Desktop: > 1024px (centered, 64px padding)

## Components

### Navbar
- Transparent, 80px height
- Logo: gold text, serif font
- Links: uppercase, letter-spacing 0.1em, thin weight
- Gold underline on hover

### Hero
- Full-screen with dark overlay on background image
- Large serif headline, white text
- Gold accent line above headline
- Single CTA: gold gradient button

### Buttons
- Primary: gold gradient, dark text, 2px radius
- Secondary: transparent with gold border
- Hover: opacity shift, subtle glow
- Size: 52px height, generous padding

### Cards
- Dark surface (\`#141414\`)
- Thin gold border on hover
- 32px internal padding
- Minimal content — image + title + price

### Forms
- Dark inputs with thin bottom border
- Gold border on focus
- Serif labels, uppercase
- Minimal validation styling

### Footer
- Black background, gold divider
- Serif typography
- Social icons in gold

## Animation

- **Duration:** 500ms standard
- **Easing:** \`cubic-bezier(0.25, 0.1, 0.25, 1)\` — smooth, unhurried
- **Hover Effects:** Opacity change (0.9), subtle gold glow
- **Entrance:** Slow fade-in, 800ms
- **Scroll:** Parallax on hero images
- **Transitions:** \`opacity 500ms ease, box-shadow 600ms ease\`

## Responsive Rules

- **Mobile (< 640px):** Single column, reduced heading size, 20px padding
- **Tablet (640px–1024px):** Two columns, 40px padding
- **Desktop (> 1024px):** Full luxury experience, generous whitespace
- **Typography:** Heading size scales down gracefully on mobile

## Accessibility

- Warm white on black: 15.4:1 contrast ratio (WCAG AAA)
- Focus indicators: gold outline, 2px with 4px offset
- All images have descriptive alt text
- Reduced motion: disables parallax and fade-in
- Screen reader: decorative elements marked \`aria-hidden\`

## Performance

- No backdrop-filter — all surfaces are solid
- Minimal JavaScript — CSS transitions only
- Font loading: Playfair Display with \`font-display: swap\`
- Images optimized with \`loading="lazy"\`
- Dark backgrounds reduce OLED power consumption

## Implementation Rules

1. Gold accent must never exceed 15% of any visual area
2. Typography must use serif for headings, sans-serif for body
3. Spacing must be generous — when in doubt, add more space
4. Never use more than 2 font families
5. All transitions must be smooth — no snappy or bouncy easing
6. Test in warm lighting — the design should feel inviting, not cold`,
    ai_prompt: "A premium luxury design with jet black backgrounds, gold and champagne accents, serif typography, elegant spacing, and a refined, exclusive aesthetic.",
    technologies: ["CSS Gradients", "CSS Custom Properties", "Intersection Observer"],
    frameworks: ["React", "Next.js"],
    tags: ["luxury", "premium", "gold", "serif", "elegant", "dark-theme", "high-end"],
    seo: {
      meta_title: "Luxury Black - Premium Luxury Design | VizoDesign",
      meta_description: "Premium luxury design with jet black backgrounds, gold accents, and serif typography. For high-end products and exclusive agencies.",
      keywords: ["luxury design", "premium UI", "gold accent", "serif typography", "high-end", "exclusive"],
    },
    view_count: 4156,
    copy_count: 378,
    sort_order: 6,
    published_at: "2025-01-15T00:00:00Z",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
    deleted_at: null,
  },

  // -----------------------------------------------------------------------
  // 8. Gradient Orbit
  // -----------------------------------------------------------------------
  {
    id: "00000000-0000-0000-0000-000000000008",
    slug: "gradient-orbit",
    name: "Gradient Orbit",
    description:
      "A bold gradient-heavy design with mesh gradients, vibrant color transitions, rounded shapes, and playful animations. Every surface is alive with color, creating an energetic and optimistic experience.",
    short_description:
      "Bold gradient-heavy design with mesh gradients and vibrant color transitions.",
    category_id: findCategory("gradient"),
    status: "published",
    featured: false,
    theme: "both",
    style_type: "gradient",
    mood: "playful",
    best_for: ["Creative products", "startups"],
    animation_level: "high",
    has_3d: false,
    responsive: true,
    accessibility_level: "wcag-aware",
    preview_type: "component",
    preview_component: "gradient-orbit",
    preview_image: null,
    thumbnail: null,
    design_system: {
      colors: {
        primary: "#6366f1",
        secondary: "#ec4899",
        background: "#0f0720",
        surface: "rgba(255,255,255,0.06)",
        border: "rgba(255,255,255,0.1)",
        text: "#faf5ff",
        muted: "#a78bfa",
        accent: "#f59e0b",
      },
      typography: {
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
        headingScale: "clamp(2rem, 5vw, 3.5rem)",
        bodyScale: "1rem",
        fontWeights: "400,500,600,700",
        lineHeights: "1.5,1.25,1.1",
      },
      spacing: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem" },
      borderRadius: { sm: "12px", md: "16px", lg: "24px", xl: "32px", full: "9999px" },
      shadows: {
        glow: "0 0 60px rgba(99,102,241,0.3)",
        pink: "0 0 40px rgba(236,72,153,0.25)",
        warm: "0 0 50px rgba(245,158,11,0.2)",
      },
      gradients: [
        "linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)",
        "radial-gradient(circle at 20% 80%, #6366f1 0%, transparent 50%)",
        "radial-gradient(circle at 80% 20%, #ec4899 0%, transparent 50%)",
        "conic-gradient(from 45deg, #6366f1, #ec4899, #f59e0b, #6366f1)",
      ],
      components: {
        navbar: "gradient-glass",
        hero: "mesh-gradient-bg",
        card: "gradient-border",
        button: "rainbow-gradient",
        input: "gradient-border-input",
      },
    },
    design_markdown: `# Gradient Orbit

## Design Philosophy

Gradient Orbit believes that **color is emotion**. In a digital landscape of muted grays and safe neutrals, this design unapologetically celebrates the full spectrum. Every surface is a canvas for color, every interaction an opportunity for delight.

The design philosophy draws from Instagram's gradient rebrand and Stripe's bold color usage: gradients aren't decoration — they're identity. The mesh gradient backgrounds create depth and movement, making static pages feel alive.

## Design Goals

- Create an instantly joyful, optimistic first impression
- Use color strategically to guide attention and convey hierarchy
- Maintain readability despite vibrant backgrounds
- Build a flexible system that supports multiple color themes
- Ensure animations enhance rather than distract

## Visual Language

The visual language is **chromatic energy**. Deep purple-black backgrounds (\`#0f0720\`) serve as the canvas for exploding gradients in indigo, pink, and amber. Mesh gradients create organic, flowing color fields that shift and blend.

Every interactive element has a gradient treatment — buttons, borders, even card edges. The effect is a cohesive, immersive color experience that feels like stepping into a living painting.

## Color System

| Token           | Value     | Usage                       |
|-----------------|-----------|-----------------------------|
| background      | \`#0f0720\` | Deep purple-black           |
| surface         | \`rgba(255,255,255,0.06)\` | Glass panels          |
| primary         | \`#6366f1\` | Indigo — primary actions    |
| secondary       | \`#ec4899\` | Pink — secondary actions    |
| accent          | \`#f59e0b\` | Amber — highlights          |
| text            | \`#faf5ff\` | Primary text                |
| text-muted      | \`#a78bfa\` | Secondary text              |
| border          | \`rgba(255,255,255,0.1)\` | Panel borders       |

## Typography

- **Primary Font:** Outfit (geometric, modern)
- **Heading Scale:** \`clamp(2rem, 5vw, 3.5rem)\`
- **Body Size:** 16px, line-height 1.5
- **Font Weights:** 400 (body), 500 (labels), 600 (subheadings), 700 (headings)
- **Special:** Gradient text for hero headings

## Spacing System

Base unit: 4px

| Token | Value  | Usage                    |
|-------|--------|--------------------------|
| xs    | 4px    | Micro gaps               |
| sm    | 8px    | Tight spacing            |
| md    | 16px   | Component padding        |
| lg    | 24px   | Card padding             |
| xl    | 32px   | Section padding          |
| 2xl   | 48px   | Major sections           |
| 3xl   | 64px   | Hero area                |

## Border Radius

| Token | Value | Usage                    |
|-------|-------|--------------------------|
| sm    | 12px  | Inputs                   |
| md    | 16px  | Cards                    |
| lg    | 24px  | Feature panels           |
| xl    | 32px  | Hero containers          |
| full  | 9999px| Pills, avatars           |

## Shadows

\`\`\`css
.purple-glow {
  box-shadow: 0 0 60px rgba(99, 102, 241, 0.3);
}
.pink-glow {
  box-shadow: 0 0 40px rgba(236, 72, 153, 0.25);
}
.amber-glow {
  box-shadow: 0 0 50px rgba(245, 158, 11, 0.2);
}
\`\`\`

## Gradients

\`\`\`css
.rainbow-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%);
}
.mesh-1 {
  background:
    radial-gradient(circle at 20% 80%, #6366f1 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, #ec4899 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, #f59e0b 0%, transparent 50%);
}
.mesh-2 {
  background: conic-gradient(from 45deg, #6366f1, #ec4899, #f59e0b, #6366f1);
}
.gradient-border {
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, #6366f1, #ec4899, #f59e0b);
  border-radius: inherit;
  z-index: -1;
}
.gradient-text {
  background: linear-gradient(135deg, #6366f1, #ec4899, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
\`\`\`

## Layout

- **Container:** max-width 1200px, centered
- **Grid:** CSS Grid with flexible columns
- **Section Spacing:** 80px between major sections
- **Breakpoints:**
  - Mobile: < 640px (single column, 16px padding)
  - Tablet: 640px–1024px (two columns, 24px padding)
  - Desktop: > 1024px (full layout, 32px padding)

## Components

### Navbar
- Glass panel with mesh gradient behind
- Semi-transparent background
- Logo with gradient text
- Links with hover gradient underline

### Hero
- Full-screen mesh gradient background
- Animated gradient orbs floating
- Large gradient text headline
- CTA: rainbow gradient button

### Buttons
- Primary: rainbow gradient fill, white text
- Secondary: glass with gradient border
- Hover: gradient shifts, glow intensifies
- Active: gradient rotates

### Cards
- Glass panels with gradient border on hover
- Internal glow matching card's accent color
- Hover: border becomes animated gradient
- Content with gradient icons

### Forms
- Inputs with gradient border
- Focus: gradient border animates
- Labels with gradient accent

### Footer
- Deep purple background
- Gradient divider
- Social icons with individual gradient colors

## Animation

- **Duration:** 300ms standard, 600ms for complex
- **Easing:** \`cubic-bezier(0.4, 0, 0.2, 1)\`
- **Hover Effects:** Gradient rotation, glow intensification
- **Entrance:** Elements fade in with gradient sweep
- **Continuous:** Slow gradient rotation on backgrounds, floating orbs
- **Transitions:** \`transform 300ms ease, box-shadow 400ms ease, border-color 400ms ease\`

## Responsive Rules

- **Mobile (< 640px):** Simplified gradients, reduced orb count, 16px padding
- **Tablet (640px–1024px):** Moderate visual effects
- **Desktop (> 1024px):** Full mesh gradients, animated orbs
- **Reduced motion:** Static gradients, no floating animations

## Accessibility

- All text maintains 4.5:1 contrast against gradient backgrounds
- Focus indicators: solid white outline with 2px offset
- Reduced motion: all animations disabled, gradients become static
- Screen reader: decorative gradients marked \`aria-hidden\`
- High contrast mode: all gradients become solid colors

## Performance

- Mesh gradients use CSS only, no image assets
- Animated orbs use CSS animations, not JavaScript
- \`will-change\` on animated elements
- \`prefers-reduced-motion\` disables all animation
- Gradient borders use \`border-image\` or pseudo-elements

## Implementation Rules

1. Gradient borders must use pseudo-element technique for border-radius support
2. All gradient text must include solid color fallback
3. Animated gradients must use \`@keyframes\`, never JavaScript
4. Test contrast at every gradient stop — worst-case must pass AA
5. Mesh gradients must not exceed 3 radial-gradient layers for performance
6. Never animate gradients faster than 10s per cycle`,
    ai_prompt: "A bold gradient-heavy design with mesh gradients, vibrant indigo-pink-amber transitions, rounded shapes, glass panels, playful floating orbs, and gradient text.",
    technologies: ["CSS Mesh Gradients", "CSS Animations", "Pseudo-element Borders"],
    frameworks: ["React", "Next.js", "Tailwind CSS"],
    tags: ["gradient", "mesh-gradient", "colorful", "playful", "startup", "creative"],
    seo: {
      meta_title: "Gradient Orbit - Bold Gradient Design | VizoDesign",
      meta_description: "Bold gradient-heavy design with mesh gradients, vibrant color transitions, and playful animations. Perfect for creative products and startups.",
      keywords: ["gradient design", "mesh gradient", "colorful UI", "playful design", "startup", "creative"],
    },
    view_count: 3089,
    copy_count: 234,
    sort_order: 7,
    published_at: "2025-01-15T00:00:00Z",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
    deleted_at: null,
  },

  // -----------------------------------------------------------------------
  // 9. Developer Dark
  // -----------------------------------------------------------------------
  {
    id: "00000000-0000-0000-0000-000000000009",
    slug: "developer-dark",
    name: "Developer Dark",
    description:
      "A code-focused dark theme with monospace elements, terminal aesthetics, syntax-highlighting colors, and compact layouts. Built for developers who live in the terminal and expect their tools to keep up.",
    short_description:
      "Code-focused dark theme with terminal aesthetics and syntax-highlighting colors.",
    category_id: findCategory("developer-tools"),
    status: "published",
    featured: false,
    theme: "dark",
    style_type: "developer-tools",
    mood: "technical",
    best_for: ["Dev tools", "documentation"],
    animation_level: "minimal",
    has_3d: false,
    responsive: true,
    accessibility_level: "wcag-aware",
    preview_type: "component",
    preview_component: "developer-dark",
    preview_image: null,
    thumbnail: null,
    design_system: {
      colors: {
        primary: "#22c55e",
        secondary: "#3b82f6",
        background: "#0d1117",
        surface: "#161b22",
        border: "#30363d",
        text: "#e6edf3",
        muted: "#7d8590",
        accent: "#f0883e",
      },
      typography: {
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        headingScale: "clamp(1.5rem, 3vw, 2.5rem)",
        bodyScale: "0.875rem",
        fontWeights: "400,500,700",
        lineHeights: "1.6,1.4,1.2",
      },
      spacing: { xs: "0.125rem", sm: "0.25rem", md: "0.5rem", lg: "1rem", xl: "1.5rem", "2xl": "2rem", "3xl": "3rem" },
      borderRadius: { sm: "4px", md: "6px", lg: "8px", xl: "12px", full: "9999px" },
      shadows: {
        card: "0 2px 8px rgba(0,0,0,0.3)",
        elevated: "0 4px 16px rgba(0,0,0,0.4)",
        terminal: "inset 0 1px 0 rgba(255,255,255,0.03)",
      },
      gradients: [
        "linear-gradient(180deg, #0d1117 0%, #161b22 100%)",
        "linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)",
      ],
      components: {
        navbar: "terminal-bar",
        hero: "code-preview",
        card: "surface-card",
        button: "terminal-button",
        input: "code-input",
      },
    },
    design_markdown: `# Developer Dark

## Design Philosophy

Developer Dark is designed **by developers, for developers**. The philosophy is uncompromising utility: every design decision optimizes for information density, scanability, and long-session comfort.

The design assumes its users are technically sophisticated, visually literate, and impatient with anything that wastes their time. No decorative elements. No marketing fluff. Just clean, dense, perfectly organized information that developers can consume at terminal speed.

## Design Goals

- Maximize information density without sacrificing readability
- Use syntax-highlighting color conventions developers already know
- Support long reading sessions with carefully tuned contrast
- Work at both 13px and 16px base font sizes
- Feel like a natural extension of the developer's terminal

## Visual Language

The visual language is **terminal-native**. Backgrounds match GitHub's dark theme (\`#0d1117\`), surfaces are slightly elevated (\`#161b22\`), and the color palette borrows directly from popular syntax highlighters: green for strings, blue for keywords, orange for warnings.

Monospace is not just for code — it's the primary typeface for everything. This creates a cohesive, "everything is code" aesthetic that developers find natural and comfortable.

## Color System

| Token           | Value     | Usage                       |
|-----------------|-----------|-----------------------------|
| background      | \`#0d1117\` | Page/terminal background    |
| surface         | \`#161b22\` | Card/panel backgrounds      |
| primary         | \`#22c55e\` | Success, strings, primary   |
| secondary       | \`#3b82f6\` | Links, keywords, info       |
| accent          | \`#f0883e\` | Warnings, alerts            |
| text            | \`#e6edf3\` | Primary text                |
| text-muted      | \`#7d8590\` | Comments, secondary         |
| border          | \`#30363d\` | Borders, dividers           |
| syntax-red      | \`#f85149\` | Errors, deletions           |
| syntax-purple   | \`#d2a8ff\` | Functions, decorators       |
| syntax-cyan     | \`#79c0ff\` | Types, constants            |
| syntax-yellow   | \`#e3b341\` | Numbers, constants         |

## Typography

- **Primary Font:** JetBrains Mono
- **Fallback:** Fira Code, Consolas, monospace
- **Heading Scale:** \`clamp(1.5rem, 3vw, 2.5rem)\` — smaller than typical, dense
- **Body Size:** 14px (0.875rem), line-height 1.6
- **Font Weights:** 400 (body), 500 (labels), 700 (headings)
- **Ligatures:** Enabled for supported fonts (\`font-variant-ligatures: contextual\`)

## Spacing System

Base unit: 4px — compact spacing for density

| Token | Value  | Usage                    |
|-------|--------|--------------------------|
| xs    | 2px    | Inline micro gaps        |
| sm    | 4px    | Tight spacing            |
| md    | 8px    | Component padding        |
| lg    | 16px   | Card padding             |
| xl    | 24px   | Section padding          |
| 2xl   | 32px   | Major sections           |
| 3xl   | 48px   | Hero area                |

## Border Radius

| Token | Value | Usage                    |
|-------|-------|--------------------------|
| sm    | 4px   | Inputs, code blocks      |
| md    | 6px   | Cards                    |
| lg    | 8px   | Modals                   |
| xl    | 12px  | Feature panels           |
| full  | 9999px| Badges, pills            |

## Shadows

\`\`\`css
.card-shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.elevated-shadow {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
.terminal-inset {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}
\`\`\`

## Gradients

\`\`\`css
.bg-gradient {
  background: linear-gradient(180deg, #0d1117 0%, #161b22 100%);
}
.code-gradient {
  background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%);
}
\`\`\`

Gradients are minimal — used only for occasional emphasis, never for large surfaces.

## Layout

- **Container:** max-width 1280px, centered
- **Sidebar:** 280px fixed, collapsible
- **Content:** fluid with max-width 800px for readability
- **Code Blocks:** full-width, overflow-x scroll
- **Breakpoints:**
  - Mobile: < 640px (single column, bottom nav)
  - Tablet: 640px–1024px (collapsed sidebar)
  - Desktop: > 1024px (full sidebar + content)

## Components

### Navbar
- Solid dark background \`#161b22\`
- 48px height, compact
- Logo + search bar + user menu
- Terminal-style status indicators

### Hero
- Split: content left, code preview right
- Code preview with syntax highlighting
- Copy button on code blocks
- Terminal prompt style for headings

### Buttons
- Primary: green (\`#22c55e\`) fill, dark text
- Secondary: dark with \`#30363d\` border
- Ghost: text-only with hover background
- Size: 32px height compact, 40px standard

### Cards
- \`#161b22\` background
- 1px \`#30363d\` border
- 16px padding
- Terminal-style header with colored dots

### Code Blocks
- \`#0d1117\` background
- Syntax highlighting with 12+ colors
- Line numbers in muted color
- Copy button in top-right

### Forms
- Dark inputs with \`#30363d\` border
- Focus: green border
- Monospace text
- Inline validation with syntax colors

### Footer
- Dark background, minimal
- Link grid, monospace text
- Status indicators

## Animation

- **Duration:** 100ms for interactions
- **Easing:** \`linear\` — mechanical, precise
- **Hover Effects:** Background color shift, border color change
- **Entrance:** None — content appears immediately
- **Terminal Cursor:** Blinking cursor animation for focus states
- **Transitions:** \`background-color 100ms linear, border-color 100ms linear\`

## Responsive Rules

- **Mobile (< 640px):** Single column, bottom tab nav, code blocks scroll horizontally
- **Tablet (640px–1024px):** Collapsible sidebar, two-column where appropriate
- **Desktop (> 1024px):** Full sidebar, dense multi-column layouts
- **Code blocks:** Always scroll horizontally, never wrap

## Accessibility

- Green on dark: 5.2:1 contrast (WCAG AA)
- Focus indicators: 2px green outline
- All code blocks have language labels
- Screen reader: line numbers hidden, code content accessible
- Keyboard: full navigation without mouse

## Performance

- Zero image dependencies
- Monospace font loads from system stack
- No JavaScript for visual effects
- CSS-only syntax highlighting for static content
- Minimal CSS — dense but efficient

## Implementation Rules

1. Always use monospace font — no exceptions
2. Color palette must match syntax highlighting conventions
3. Spacing must be compact — developers prefer density
4. Code blocks must support horizontal scroll, never wrap
5. All interactive elements must work with keyboard only
6. Test at 13px base font size — many developers prefer smaller text`,
    ai_prompt: "A code-focused dark theme with monospace typography, terminal aesthetics, syntax-highlighting colors, compact layouts, and developer-friendly density.",
    technologies: ["CSS Grid", "CSS Custom Properties", "Syntax Highlighting"],
    frameworks: ["React", "Next.js"],
    tags: ["developer", "terminal", "monospace", "dark-theme", "code", "documentation"],
    seo: {
      meta_title: "Developer Dark - Code-Focused Dark Theme | VizoDesign",
      meta_description: "Code-focused dark theme with terminal aesthetics, syntax-highlighting colors, and compact layouts. Built for developer tools and documentation.",
      keywords: ["developer theme", "dark mode", "terminal UI", "code documentation", "monospace", "syntax highlighting"],
    },
    view_count: 2847,
    copy_count: 189,
    sort_order: 8,
    published_at: "2025-01-15T00:00:00Z",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
    deleted_at: null,
  },

  // -----------------------------------------------------------------------
  // 10. 3D Future
  // -----------------------------------------------------------------------
  {
    id: "00000000-0000-0000-0000-000000000010",
    slug: "3d-future",
    name: "3D Future",
    description:
      "A 3D interactive design with perspective transforms, depth layers, floating elements, and modern geometric shapes. Creates an immersive experience that pushes the boundaries of web design.",
    short_description:
      "3D interactive design with perspective transforms and floating elements.",
    category_id: findCategory("3d-interactive"),
    status: "published",
    featured: false,
    theme: "dark",
    style_type: "3d-interactive",
    mood: "innovative",
    best_for: ["Tech products", "innovation"],
    animation_level: "high",
    has_3d: true,
    responsive: true,
    accessibility_level: "wcag-aware",
    preview_type: "component",
    preview_component: "3d-future",
    preview_image: null,
    thumbnail: null,
    design_system: {
      colors: {
        primary: "#06b6d4",
        secondary: "#8b5cf6",
        background: "#0a0e1a",
        surface: "rgba(255,255,255,0.05)",
        border: "rgba(255,255,255,0.1)",
        text: "#e0f2fe",
        muted: "#64748b",
        accent: "#14b8a6",
      },
      typography: {
        fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
        headingScale: "clamp(2rem, 5vw, 3.5rem)",
        bodyScale: "1rem",
        fontWeights: "400,500,600,700",
        lineHeights: "1.5,1.25,1.1",
      },
      spacing: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem" },
      borderRadius: { sm: "8px", md: "12px", lg: "16px", xl: "24px", full: "9999px" },
      shadows: {
        card: "0 8px 32px rgba(0,0,0,0.4)",
        elevated: "0 16px 48px rgba(0,0,0,0.5)",
        "3d": "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(6,182,212,0.15)",
      },
      gradients: [
        "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #14b8a6 100%)",
        "radial-gradient(circle at 30% 70%, rgba(6,182,212,0.15) 0%, transparent 50%)",
        "radial-gradient(circle at 70% 30%, rgba(139,92,246,0.15) 0%, transparent 50%)",
      ],
      components: {
        navbar: "glass-3d",
        hero: "perspective-container",
        card: "3d-tilt",
        button: "depth-button",
        input: "glass-3d-input",
      },
    },
    design_markdown: `# 3D Future

## Design Philosophy

3D Future challenges the flat paradigm of web design by introducing **spatial depth** as a first-class design element. The philosophy is that digital interfaces should feel like physical spaces — objects have weight, layers have distance, and interactions feel tangible.

Drawing from motion design, game UI, and AR/VR interfaces, this design uses CSS 3D transforms to create genuine depth. Elements don't just sit on a page — they float, tilt, and respond to user input as if they exist in three-dimensional space.

## Design Goals

- Create a sense of physical depth that differentiates from flat competitors
- Use 3D transforms to enhance, not distract from, content
- Maintain usability despite complex visual treatments
- Support both mouse and touch interaction for 3D effects
- Ensure graceful degradation when 3D is not supported

## Visual Language

The visual language is **spatial technology**. Dark blue-black backgrounds (\`#0a0e1a\`) create a void in which elements float at various depths. Teal (\`#06b6d4\`) represents primary interaction, purple (\`#8b5cf6\`) represents depth and layering.

Cards and panels use \`perspective\` and \`transform: rotateX/Y()\` to create genuine 3D tilt effects on hover. Layered shadows at multiple depths reinforce the spatial illusion.

## Color System

| Token           | Value     | Usage                       |
|-----------------|-----------|-----------------------------|
| background      | \`#0a0e1a\` | Deep space background       |
| surface         | \`rgba(255,255,255,0.05)\` | Floating panels      |
| primary         | \`#06b6d4\` | Teal — primary actions      |
| secondary       | \`#8b5cf6\` | Purple — depth indicators   |
| accent          | \`#14b8a6\` | Teal-green — highlights     |
| text            | \`#e0f2fe\` | Primary text                |
| text-muted      | \`#64748b\` | Secondary text              |
| border          | \`rgba(255,255,255,0.1)\` | Panel edges          |

## Typography

- **Primary Font:** Space Grotesk (geometric, tech-forward)
- **Heading Scale:** \`clamp(2rem, 5vw, 3.5rem)\`
- **Body Size:** 16px, line-height 1.5
- **Font Weights:** 400 (body), 500 (labels), 600 (subheadings), 700 (headings)
- **Special:** Text shadows for depth on headings

## Spacing System

Base unit: 4px

| Token | Value  | Usage                    |
|-------|--------|--------------------------|
| xs    | 4px    | Micro gaps               |
| sm    | 8px    | Tight spacing            |
| md    | 16px   | Component padding        |
| lg    | 24px   | Card padding             |
| xl    | 32px   | Section padding          |
| 2xl   | 48px   | Major sections           |
| 3xl   | 64px   | Hero area                |

## Border Radius

| Token | Value | Usage                    |
|-------|-------|--------------------------|
| sm    | 8px   | Inputs                   |
| md    | 12px  | Cards                    |
| lg    | 16px  | Feature panels           |
| xl    | 24px  | Hero containers          |
| full  | 9999px| Avatars, badges          |

## Shadows

\`\`\`css
.card-shadow {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
.elevated-shadow {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}
.shadow-3d {
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(6, 182, 212, 0.15);
}
\`\`\`

## Gradients

\`\`\`css
.depth-gradient {
  background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #14b8a6 100%);
}
.glow-teal {
  background: radial-gradient(circle at 30% 70%, rgba(6,182,212,0.15) 0%, transparent 50%);
}
.glow-purple {
  background: radial-gradient(circle at 70% 30%, rgba(139,92,246,0.15) 0%, transparent 50%);
}
\`\`\`

## Layout

- **Container:** max-width 1200px, centered
- **Perspective Container:** \`perspective: 1200px\` on main wrapper
- **Grid:** CSS Grid with transform-style: preserve-3d on parent
- **Section Spacing:** 96px between major sections
- **Breakpoints:**
  - Mobile: < 640px (reduced 3D, single column)
  - Tablet: 640px–1024px (moderate 3D, two columns)
  - Desktop: > 1024px (full 3D experience)

## 3D System

\`\`\`css
.perspective-container {
  perspective: 1200px;
  transform-style: preserve-3d;
}
.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-3d:hover {
  transform: rotateX(-5deg) rotateY(5deg) translateZ(20px);
}
.float-layer-1 { transform: translateZ(0px); }
.float-layer-2 { transform: translateZ(40px); }
.float-layer-3 { transform: translateZ(80px); }
\`\`\`

## Components

### Navbar
- Glass panel with 3D tilt on scroll
- Floating above content with translateZ
- Logo with depth shadow
- Links with hover tilt effect

### Hero
- Full viewport with layered depth
- Background layer: gradient + particles
- Mid layer: floating geometric shapes
- Fore layer: content with 3D tilt
- Mouse-tracking parallax on all layers

### Buttons
- Primary: teal gradient, 3D depth shadow
- Hover: lifts with translateZ(10px)
- Active: presses with translateZ(-5px)
- 3D rotation on hover

### Cards
- 3D tilt on hover (rotateX/Y based on mouse position)
- Multi-layer shadow for depth
- Glass surface with blur
- Content floats at different Z-levels

### Forms
- Glass inputs with depth shadow
- Focus: lifts slightly
- Labels float above

### Footer
- Deep background with floating elements
- Multi-layer depth

## Animation

- **Duration:** 400ms for 3D transforms, 200ms for standard
- **Easing:** \`cubic-bezier(0.4, 0, 0.2, 1)\` for smooth 3D
- **Hover Effects:** 3D tilt, translateZ lift, shadow expansion
- **Entrance:** Elements fly in from depth (translateZ)
- **Continuous:** Gentle floating animation on decorative elements
- **Mouse Tracking:** Real-time 3D rotation based on cursor position
- **Transitions:** \`transform 400ms ease, box-shadow 300ms ease\`

## Responsive Rules

- **Mobile (< 640px):** 3D effects reduced to 30%, single column, touch-friendly targets
- **Tablet (640px–1024px):** 3D effects at 70%, two columns
- **Desktop (> 1024px):** Full 3D experience with mouse tracking
- **Reduced motion:** All 3D transforms disabled, flat layout

## Accessibility

- Focus indicators: solid teal outline, 2px with 4px offset
- Reduced motion: \`prefers-reduced-motion\` disables all 3D transforms
- Screen reader: 33D effects marked \`aria-hidden\`
- Keyboard: all elements navigable without 3D interaction
- Touch: tap replaces hover for 3D effects on mobile

## Performance

- 3D transforms use GPU acceleration (\`will-change: transform\`)
- \`transform-style: preserve-3d\` only on necessary containers
- Mouse tracking throttled to 60fps
- Reduced 3D complexity on mobile devices
- \`prefers-reduced-motion\` checked before initializing 3D

## Implementation Rules

1. All 3D containers must have \`transform-style: preserve-3d\`
2. Perspective must be set on parent, not child elements
3. Mouse tracking must be throttled to requestAnimationFrame
4. Mobile must gracefully reduce 3D intensity
5. Never use 3D transforms on text — only on containers
6. Test with \`prefers-reduced-motion: reduce\` — must work flat`,
    ai_prompt: "A 3D interactive design with CSS perspective transforms, depth layers, floating elements, mouse-tracking tilt effects, and modern geometric shapes on a dark background.",
    technologies: ["CSS 3D Transforms", "CSS perspective", "Mouse Tracking", "requestAnimationFrame"],
    frameworks: ["React", "Next.js", "Tailwind CSS"],
    tags: ["3D", "interactive", "perspective", "depth", "parallax", "dark-theme", "futuristic"],
    seo: {
      meta_title: "3D Future - 3D Interactive Design | VizoDesign",
      meta_description: "3D interactive design with perspective transforms, depth layers, floating elements, and mouse-tracking tilt effects. For tech products and innovation.",
      keywords: ["3D design", "interactive UI", "CSS transforms", "perspective", "depth", "parallax"],
    },
    view_count: 2534,
    copy_count: 176,
    sort_order: 9,
    published_at: "2025-01-15T00:00:00Z",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
    deleted_at: null,
  },
];

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function getSeedDesignBySlug(slug: string): (typeof SEED_DESIGNS)[number] | undefined {
  return SEED_DESIGNS.find((d) => d.slug === slug);
}

export function getSeedDesignsByCategory(categorySlug: string): typeof SEED_DESIGNS {
  return SEED_DESIGNS.filter((d) => {
    const cat = DESIGN_CATEGORIES.find((c) => c.slug === categorySlug);
    return cat && d.category_id === cat.id;
  });
}
