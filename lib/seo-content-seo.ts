import type { ToolSeoContent } from "@/lib/seo-content";

/**
 * SEO content for the SEO Tools category (10 tools).
 * Mirrors the structure of TOOL_SEO_CONTENT / DEV_TOOL_SEO_CONTENT so
 * ToolSeoContent.tsx renders intro, benefits, features, how-to, and
 * FAQ JSON-LD for every page without any new components.
 */
export const SEO_TOOL_SEO_CONTENT: Record<string, ToolSeoContent> = {
  "meta-tag-generator": {
    meta: { readTime: "5 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "Live SERP preview",
      "SEO score & suggestions",
      "Open Graph + Twitter Cards",
      "Copy-ready HTML",
    ],
    intro: {
      heading: "Meta Tag Generator — Perfect SEO Tags in Seconds",
      paragraphs: [
        "Write complete, search-optimized meta tags without memorizing HTML. The Meta Tag Generator produces a full <head> block — title, meta description, keywords, canonical, robots, Open Graph, and Twitter Cards — with a live Google-style SERP preview and a real-time SEO score as you type.",
        "Every tag is generated with best-practice defaults and validation tips, so you can paste the output straight into WordPress, Shopify, Next.js, or any CMS. No sign-up, no uploads — everything runs in your browser.",
      ],
    },
    benefits: [
      {
        title: "Complete Head Block",
        description: "Title, description, canonical, robots, viewport, author, theme color, Apple meta, OG, and Twitter tags in one place.",
      },
      {
        title: "Live SERP Preview",
        description: "See exactly how Google renders your title and description with a pixel-accurate preview as you type.",
      },
      {
        title: "SEO Score & Tips",
        description: "Instant feedback on title length, description length, and missing critical tags with actionable suggestions.",
      },
      {
        title: "100% Private",
        description: "Everything is generated locally in your browser — nothing you type is ever sent to a server.",
      },
    ],
    features: [
      {
        title: "Core Meta Tags",
        description: "Title, description, keywords, canonical URL, robots directives, viewport, charset, author, and language.",
      },
      {
        title: "Open Graph Tags",
        description: "og:title, og:description, og:image, og:url, og:type, og:site_name — essential for Facebook, LinkedIn, and WhatsApp sharing.",
      },
      {
        title: "Twitter Cards",
        description: "twitter:card, twitter:title, twitter:description, and twitter:image for rich X/Twitter link previews.",
      },
      {
        title: "Apple & PWA Meta",
        description: "theme-color, apple-mobile-web-app-capable, apple-mobile-web-app-status-bar-style, and manifest link.",
      },
      {
        title: "Live SEO Score",
        description: "A 0–100 score that updates on every keystroke, with warnings for lengths outside Google's display limits.",
      },
      {
        title: "Copy & Download",
        description: "Copy the complete head HTML with one click or download it as a .html file ready to paste.",
      },
    ],
    howTo: {
      heading: "How to Generate Meta Tags",
      description: "Create a complete, SEO-ready meta tag block in four simple steps.",
      steps: [
        {
          name: "Fill in your details",
          text: "Enter your page title, description, URL, and optional fields like keywords, author, and social share image.",
        },
        {
          name: "Watch the SERP preview",
          text: "The live Google preview updates as you type so you can tune your title and description for search results.",
        },
        {
          name: "Review the SEO score",
          text: "Check the score and suggested fixes — keep your title under 60 characters and description under 160 for best results.",
        },
        {
          name: "Copy or download",
          text: "Copy the generated HTML and paste it into your CMS <head>, or download it as a file.",
        },
      ],
    },
    faqs: [
      {
        question: "What is a meta tag generator?",
        answer:
          "A meta tag generator creates the HTML tags that describe a webpage to search engines and social platforms — title, meta description, canonical, Open Graph, and more — so you don't have to write the HTML by hand.",
      },
      {
        question: "Why are meta tags important for SEO?",
        answer:
          "Meta tags tell search engines what your page is about. A well-written title and meta description improve click-through rate from search results and help Google understand and rank your content.",
      },
      {
        question: "How long should a meta title be?",
        answer:
          "Keep titles under 60 characters (around 50–60) so Google displays them without truncation. On mobile, titles may be cut off around 55 characters, so shorter is safer.",
      },
      {
        question: "How long should a meta description be?",
        answer:
          "Aim for 150–160 characters. Google typically displays about 155 characters, and longer descriptions get cut off with an ellipsis.",
      },
      {
        question: "What are Open Graph tags?",
        answer:
          "Open Graph tags (og:title, og:image, og:description, etc.) control how your page appears when shared on Facebook, LinkedIn, WhatsApp, and other platforms.",
      },
      {
        question: "Do I need Twitter Cards if I have Open Graph?",
        answer:
          "Twitter Cards are separate but similar. Most platforms now read Open Graph, but adding twitter:card and twitter:title ensures X/Twitter shows a rich preview too.",
      },
      {
        question: "Is the meta tag generator free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Are the tags I type uploaded to a server?",
        answer:
          "No. Everything is generated locally in your browser — your titles, URLs, and descriptions never leave your device.",
      },
      {
        question: "What is a canonical URL?",
        answer:
          "The canonical tag tells search engines the preferred version of a page when duplicate content exists, preventing duplicate-content ranking issues.",
      },
      {
        question: "Where do I paste the generated meta tags?",
        answer:
          "Paste them inside the <head> section of your HTML. In WordPress use an SEO plugin or theme header option; in Shopify use theme.liquid; in Next.js add them to your metadata export.",
      },
      {
        question: "What is the robots meta tag?",
        answer:
          "The robots meta tag tells search engines whether to index a page and follow its links, e.g. index,follow or noindex,nofollow.",
      },
      {
        question: "Does the generator include JSON-LD structured data?",
        answer:
          "This generator focuses on head meta tags. For JSON-LD schema markup (Article, FAQ, Product, etc.), use our Schema Markup Generator.",
      },
      {
        question: "What is theme-color used for?",
        answer:
          "theme-color sets the color of the browser UI (address bar, tab) on mobile — it's a small polish that makes your site feel more branded.",
      },
      {
        question: "Can I use the same tags for a blog post and a product page?",
        answer:
          "Yes — the generator works for any page type. Change og:type (article vs website) and your canonical URL to match each page.",
      },
      {
        question: "Does the tool work on mobile?",
        answer:
          "Yes, the Meta Tag Generator is fully responsive and works on desktop, tablet, and mobile browsers.",
      },
    ],
  },

  "schema-markup-generator": {
    meta: { readTime: "6 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "15+ schema types",
      "Valid JSON-LD output",
      "Built-in JSON validator",
      "Field explanations",
    ],
    intro: {
      heading: "Schema Markup Generator — Valid JSON-LD in One Click",
      paragraphs: [
        "Add structured data to your pages without writing JSON by hand. The Schema Markup Generator covers 15+ schema.org types — Article, BlogPosting, FAQPage, BreadcrumbList, Organization, Product, Review, HowTo, Event, Recipe, VideoObject, LocalBusiness, Person, WebSite, and SoftwareApplication — with a simple form for each.",
        "Every output is valid JSON-LD that you can paste into your page <head> or Google Tag Manager. A built-in JSON validator catches errors before you publish, and each field explains what it does so you fill the right values.",
      ],
    },
    benefits: [
      {
        title: "15+ Schema Types",
        description: "Article, FAQ, Product, Review, HowTo, Event, Recipe, LocalBusiness, and more — all schema.org compliant.",
      },
      {
        title: "Valid JSON-LD Every Time",
        description: "The generator outputs correctly structured JSON-LD, and the validator double-checks it before you copy.",
      },
      {
        title: "Rich Results Ready",
        description: "Correct markup is what earns FAQ, Recipe, Product, and Review rich results in Google search.",
      },
      {
        title: "Field Explanations",
        description: "Every input explains its purpose, so you never guess what author.name or offers.price should be.",
      },
    ],
    features: [
      {
        title: "Content Schemas",
        description: "Article, BlogPosting, NewsArticle, Recipe, VideoObject, and HowTo for content-rich pages.",
      },
      {
        title: "Business Schemas",
        description: "Organization, LocalBusiness, Person, and WebSite for branding and local SEO.",
      },
      {
        title: "Commerce Schemas",
        description: "Product, Offer, and Review for e-commerce pages that can win product rich results.",
      },
      {
        title: "Navigation Schemas",
        description: "BreadcrumbList and FAQPage for breadcrumb trails and FAQ rich results.",
      },
      {
        title: "JSON Validation",
        description: "The generated markup is validated on the fly — malformed JSON is flagged before you copy.",
      },
      {
        title: "Copy & Download",
        description: "Copy the JSON-LD script tag or the raw JSON, or download it as a .json file.",
      },
    ],
    howTo: {
      heading: "How to Generate Schema Markup",
      description: "Create valid JSON-LD structured data in three simple steps.",
      steps: [
        {
          name: "Pick a schema type",
          text: "Choose the schema that matches your content — Article, FAQ, Product, LocalBusiness, and 12 more.",
        },
        {
          name: "Fill in the fields",
          text: "Complete the form. Each field shows a short explanation so you enter the right values.",
        },
        {
          name: "Copy the JSON-LD",
          text: "Copy the generated script and paste it into your page <head> or submit it via Google's Rich Results Test.",
        },
      ],
    },
    faqs: [
      {
        question: "What is schema markup?",
        answer:
          "Schema markup is structured data added to a webpage that helps search engines understand the content — and in many cases enables rich results like star ratings, FAQs, recipes, and breadcrumbs.",
      },
      {
        question: "What is JSON-LD?",
        answer:
          "JSON-LD (JavaScript Object Notation for Linked Data) is Google's recommended format for structured data — a script block in the page head that describes entities like articles, products, and FAQs.",
      },
      {
        question: "Which schema type should I use?",
        answer:
          "Use Article/BlogPosting for articles, FAQPage for FAQ sections, Product + Offer for products, HowTo for step-by-step guides, LocalBusiness for physical businesses, and Organization/WebSite on every site.",
      },
      {
        question: "Does schema markup improve rankings?",
        answer:
          "Schema doesn't directly boost rankings, but it can earn rich results (stars, FAQs, product info) that dramatically increase click-through rate from search results.",
      },
      {
        question: "How do I test my schema markup?",
        answer:
          "Paste your page URL or markup into Google's Rich Results Test (search.google.com/test/rich-results) and the Schema Markup Validator to confirm it parses correctly.",
      },
      {
        question: "Is the schema generator free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Where do I paste the JSON-LD?",
        answer:
          "Paste it inside a <script type=\"application/ld+json\"> block in your page <head>. In WordPress use a header plugin, in Next.js add it to your layout, or inject it via Google Tag Manager.",
      },
      {
        question: "Does the generator support FAQ schema?",
        answer:
          "Yes — FAQPage is included. It lets you add question/answer pairs that can appear as an expandable FAQ in Google search results.",
      },
      {
        question: "What is BreadcrumbList schema?",
        answer:
          "BreadcrumbList marks up your breadcrumb trail so Google can show breadcrumbs under your search result, improving how users navigate your site.",
      },
      {
        question: "Can I use multiple schema types on one page?",
        answer:
          "Yes — you can include several JSON-LD blocks on a page (e.g. Article + BreadcrumbList + FAQPage). Generate each one separately and combine the scripts.",
      },
      {
        question: "Is Product schema the same as a rich snippet?",
        answer:
          "Product schema provides structured product info (price, availability, rating) that can power product rich results and merchant listings in search.",
      },
      {
        question: "Do my fields need to be 100% accurate?",
        answer:
          "Yes — Google penalizes structured data that misrepresents content (like hiding reviews). Only mark up data that's visible on the page.",
      },
      {
        question: "What's the difference between Microdata, RDFa, and JSON-LD?",
        answer:
          "They're three syntaxes for the same schema.org vocabulary. Google recommends JSON-LD because it's easy to add and doesn't wrap your HTML.",
      },
      {
        question: "Does the generator validate the JSON?",
        answer:
          "Yes, the JSON is validated automatically — syntax errors are highlighted before you copy the output.",
      },
      {
        question: "Can schema markup be added via Google Tag Manager?",
        answer:
          "Yes — paste the JSON-LD into a Custom HTML tag in GTM and trigger it on the relevant pages without touching your theme files.",
      },
    ],
  },

  "open-graph-generator": {
    meta: { readTime: "5 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "Facebook / LinkedIn / X previews",
      "OG image with aspect guidance",
      "Twitter Card support",
      "Copy-ready meta tags",
    ],
    intro: {
      heading: "Open Graph Generator — Preview Social Shares Before You Publish",
      paragraphs: [
        "The Open Graph Generator builds the meta tags that control how your links look when shared on Facebook, LinkedIn, WhatsApp, and X (Twitter) — with live previews of each platform as you type.",
        "Fill in your title, description, image, and URL, choose the share type, and instantly see a pixel-accurate Facebook post card, LinkedIn card, and Twitter summary card. Copy the complete OG + Twitter meta block and drop it into your page head.",
      ],
    },
    benefits: [
      {
        title: "Live Platform Previews",
        description: "See exactly how your link appears on Facebook, LinkedIn, and X before you publish a single tag.",
      },
      {
        title: "OG + Twitter in One",
        description: "Generate both Open Graph and Twitter Card tags together — no platform is left with a bare link.",
      },
      {
        title: "Image Guidance Built In",
        description: "The tool flags image sizes that fall outside Facebook's recommended 1200×630 so your shares look sharp.",
      },
      {
        title: "Copy-Ready HTML",
        description: "Output is a complete meta block you can paste straight into your CMS or template.",
      },
    ],
    features: [
      {
        title: "Core OG Fields",
        description: "og:title, og:description, og:image, og:url, og:type, and og:site_name.",
      },
      {
        title: "Facebook Preview",
        description: "A realistic Facebook post-card preview with your image, title, description, and domain.",
      },
      {
        title: "LinkedIn Preview",
        description: "A LinkedIn-style share card preview so B2B shares look professional.",
      },
      {
        title: "Twitter Card Preview",
        description: "Summary and summary_large_image card previews with twitter:image and twitter:description.",
      },
      {
        title: "Image Size Checker",
        description: "Detects images below 1200×630 and warns you before your shares render blurry or cropped.",
      },
      {
        title: "Copy & Download",
        description: "Copy the full OG + Twitter meta block or download it as an HTML snippet.",
      },
    ],
    howTo: {
      heading: "How to Generate Open Graph Tags",
      description: "Create social-ready share cards in three simple steps.",
      steps: [
        {
          name: "Enter your page details",
          text: "Add the title, description, image URL, page URL, and site name. Optionally add a Twitter card image.",
        },
        {
          name: "Check the previews",
          text: "Watch the Facebook, LinkedIn, and X previews update live. Tune the title and description to read well on each platform.",
        },
        {
          name: "Copy the tags",
          text: "Copy the generated Open Graph and Twitter meta tags and paste them into your page <head>.",
        },
      ],
    },
    faqs: [
      {
        question: "What are Open Graph tags?",
        answer:
          "Open Graph tags are meta tags that tell social platforms how to display your page when shared — the title, description, and image that appear in the link card.",
      },
      {
        question: "Why do my shared links show the wrong image?",
        answer:
          "That happens when og:image is missing or points to a small image. Use a 1200×630 image and Facebook's Sharing Debugger to refresh the cache.",
      },
      {
        question: "What is the recommended Open Graph image size?",
        answer:
          "1200×630 pixels is Facebook's recommended ratio (1.91:1). Twitter uses the same image for summary_large_image cards.",
      },
      {
        question: "Do Twitter Cards need separate tags?",
        answer:
          "X reads Open Graph tags as fallback, but adding twitter:card, twitter:title, twitter:description, and twitter:image gives you full control over X previews.",
      },
      {
        question: "Why is my og:image not updating after I changed it?",
        answer:
          "Platforms cache shared links. Use Facebook's Sharing Debugger, LinkedIn Post Inspector, or X Card Validator to force a re-scrape.",
      },
      {
        question: "What is og:type?",
        answer:
          "og:type describes the content type — website, article, product, video. Use article for blog posts and website for general pages.",
      },
      {
        question: "Is the Open Graph generator free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Do Open Graph tags help SEO rankings?",
        answer:
          "Not directly for rankings, but rich, accurate share previews increase click-through and social engagement, which signal quality to search engines.",
      },
      {
        question: "Where do I add Open Graph tags?",
        answer:
          "In the <head> of your page. Most SEO plugins (Yoast, Rank Math) add them automatically, but this generator is perfect for custom sites and apps.",
      },
      {
        question: "What is og:url?",
        answer:
          "og:url declares the canonical URL for the shared page so all shares point to one consistent link — use it to prevent duplicate sharing confusion.",
      },
      {
        question: "Can I generate tags for a product page?",
        answer:
          "Yes — set og:type to product and include the product name in og:title. Many platforms show product-specific styling.",
      },
      {
        question: "Does the tool support video and audio?",
        answer:
          "og:type supports video and music values, and you can point og:image at a video thumbnail for share cards.",
      },
      {
        question: "Why does WhatsApp sometimes show no image?",
        answer:
          "WhatsApp caches aggressively and requires a valid absolute og:image URL with proper file extension (PNG/JPG). Check the image URL is publicly accessible.",
      },
      {
        question: "Can I preview mobile shares?",
        answer:
          "The generator shows desktop-style cards for Facebook, LinkedIn, and X. Mobile apps use the same tags, so the previews are accurate on phones too.",
      },
      {
        question: "Does the generator validate my image URL?",
        answer:
          "It checks the image URL format and warns about non-absolute or missing URLs — for full validation use Facebook's Sharing Debugger.",
      },
    ],
  },

  "robots-txt-generator": {
    meta: { readTime: "4 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "Allow & Disallow rules",
      "Sitemap + Host directives",
      "Crawl-delay support",
      "Syntax validation",
    ],
    intro: {
      heading: "Robots.txt Generator — Control How Search Engines Crawl Your Site",
      paragraphs: [
        "Create a clean, standards-compliant robots.txt in seconds. Add allow and disallow rules per user-agent, point crawlers at your sitemap, set a host and crawl delay, and download a file ready to drop into your site root.",
        "The generator validates the syntax as you build, so you never accidentally block your entire site. It's the fastest way to control what Google and other bots can crawl — right in your browser.",
      ],
    },
    benefits: [
      {
        title: "Visual Rule Builder",
        description: "Add and reorder allow/disallow rules without remembering robots.txt syntax.",
      },
      {
        title: "Sitemap & Host Directives",
        description: "Automatically add Sitemap: and Host: lines to help crawlers discover your content.",
      },
      {
        title: "Crawl-Delay Support",
        description: "Set a crawl delay for bots that respect it, like Bing and Yandex.",
      },
      {
        title: "Syntax Validation",
        description: "Real-time checks warn you about malformed rules before you publish.",
      },
    ],
    features: [
      {
        title: "Multiple User-Agents",
        description: "Separate rule sets for Googlebot, Bingbot, and * (all bots) with independent allow/disallow rules.",
      },
      {
        title: "Allow & Disallow",
        description: "Add precise path rules — disallow /admin/, allow /public/, and everything in between.",
      },
      {
        title: "Sitemap Directive",
        description: "One click adds your sitemap URL so search engines find it from the root file.",
      },
      {
        title: "Host & Crawl Delay",
        description: "Optional Host: and Crawl-delay: lines for complete control over crawling behavior.",
      },
      {
        title: "Live Syntax Check",
        description: "Invalid paths or duplicate groups are flagged immediately with a validation summary.",
      },
      {
        title: "Copy & Download",
        description: "Copy the file with one click or download robots.txt ready to upload to your site root.",
      },
    ],
    howTo: {
      heading: "How to Generate a Robots.txt",
      description: "Build a crawler-friendly robots.txt in three quick steps.",
      steps: [
        {
          name: "Add user agents",
          text: "Create rule groups for Googlebot, Bingbot, or * — or just use the default group for all bots.",
        },
        {
          name: "Set allow & disallow rules",
          text: "Add paths you want to block (like /admin or /cart) and paths you want to explicitly allow.",
        },
        {
          name: "Add sitemap & download",
          text: "Enter your sitemap URL, review the live preview, and copy or download the file to your site root.",
        },
      ],
    },
    faqs: [
      {
        question: "What is a robots.txt file?",
        answer:
          "robots.txt is a plain-text file in your site root that tells search engine crawlers which URLs they may or may not crawl.",
      },
      {
        question: "Where do I put my robots.txt file?",
        answer:
          "Upload it to the root of your domain, e.g. https://yoursite.com/robots.txt. Next.js serves it automatically from app/robots.ts.",
      },
      {
        question: "Does robots.txt block indexing?",
        answer:
          "No — robots.txt only controls crawling, not indexing. To remove a page from search results entirely, use a noindex meta tag or header.",
      },
      {
        question: "What does Disallow: / mean?",
        answer:
          "Disallow: / tells all bots not to crawl any part of the site. Only use it if you truly want to block crawling site-wide.",
      },
      {
        question: "Do I need to list Googlebot separately?",
        answer:
          "The * group covers all bots. Add a Googlebot group only when you need behavior specific to Google, like different crawl rules or no crawl delay.",
      },
      {
        question: "What is a Sitemap: line?",
        answer:
          "A Sitemap: line points crawlers to your XML sitemap location. It's the standard way to submit sitemaps in robots.txt.",
      },
      {
        question: "What is Crawl-delay?",
        answer:
          "Crawl-delay tells a bot how many seconds to wait between requests. Googlebot ignores it, but Bing and Yandex respect it.",
      },
      {
        question: "Is the robots.txt generator free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Can I have rules for multiple bots?",
        answer:
          "Yes — create separate user-agent groups (Googlebot, Bingbot, etc.) each with their own allow and disallow rules.",
      },
      {
        question: "What happens if I make a syntax error?",
        answer:
          "Crawlers ignore malformed rules, which can leave pages accidentally exposed or blocked. The generator validates syntax as you type to prevent this.",
      },
      {
        question: "Does robots.txt affect SEO?",
        answer:
          "Indirectly — blocking important pages wastes crawl budget, while accidentally exposing private pages can hurt you. A correct file keeps crawling efficient.",
      },
      {
        question: "Should I disallow /wp-admin or /admin?",
        answer:
          "Many sites disallow admin and backend paths to keep crawlers out. Just make sure the paths you block don't include resources your pages need.",
      },
      {
        question: "Can robots.txt have comments?",
        answer:
          "Yes — lines starting with # are comments. Use them to document why each rule exists.",
      },
      {
        question: "How do I test my robots.txt?",
        answer:
          "Use Google Search Console's robots.txt tester or the URL Inspection tool to see which rules apply to a specific URL.",
      },
      {
        question: "Does the tool support a Host directive?",
        answer:
          "Yes — the optional Host: line (used mainly by Yandex) declares your preferred domain, and the generator adds it if you enable it.",
      },
    ],
  },

  "sitemap-generator": {
    meta: { readTime: "5 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "XML sitemap builder",
      "Image / video entries",
      "lastmod & priority control",
      "Built-in XML validation",
    ],
    intro: {
      heading: "Sitemap Generator — Create XML Sitemaps in Seconds",
      paragraphs: [
        "The Sitemap Generator builds a valid XML sitemap from a simple list of URLs. Paste your links, optionally add lastmod dates, change frequency, priority, and image or video entries, then download a ready-to-submit sitemap.xml.",
        "A built-in XML validator checks the output before you save it, so Google won't reject your file. Perfect for small sites, new launches, or fixing an outdated sitemap — everything runs in your browser.",
      ],
    },
    benefits: [
      {
        title: "Valid XML Every Time",
        description: "The output is validated against XML rules, so your sitemap parses cleanly in Google Search Console.",
      },
      {
        title: "Image & Video Entries",
        description: "Add image and video extensions to your URLs for richer indexing of visual content.",
      },
      {
        title: "Metadata Control",
        description: "Set lastmod, change frequency, and priority per URL or apply sensible defaults to all.",
      },
      {
        title: "100% Private",
        description: "Your URLs are processed locally — nothing is uploaded or stored anywhere.",
      },
    ],
    features: [
      {
        title: "URL List Input",
        description: "Paste one URL per line, with optional lastmod, changefreq, and priority columns.",
      },
      {
        title: "Smart Defaults",
        description: "If no metadata is given, the generator applies today's date, monthly frequency, and 0.8 priority.",
      },
      {
        title: "Image Sitemap Extension",
        description: "Attach image URLs with titles and captions to each page for image search indexing.",
      },
      {
        title: "Video Sitemap Extension",
        description: "Add video thumbnails, titles, descriptions, and durations for video content.",
      },
      {
        title: "XML Validation",
        description: "The document is validated before download — unescaped characters are fixed automatically.",
      },
      {
        title: "Copy & Download",
        description: "Copy the sitemap XML or download sitemap.xml ready to upload to your site root.",
      },
    ],
    howTo: {
      heading: "How to Generate a Sitemap",
      description: "Create a search-ready XML sitemap in three simple steps.",
      steps: [
        {
          name: "Paste your URLs",
          text: "Enter one URL per line. Optionally add lastmod, changefreq, and priority separated by spaces or commas.",
        },
        {
          name: "Add images or videos",
          text: "Enable image or video extensions and attach media URLs to pages that need richer indexing.",
        },
        {
          name: "Download & submit",
          text: "Copy or download the sitemap, upload it to your site root, and submit it in Google Search Console.",
        },
      ],
    },
    faqs: [
      {
        question: "What is an XML sitemap?",
        answer:
          "An XML sitemap lists the important URLs of a website so search engines can discover and crawl them more efficiently.",
      },
      {
        question: "Do I need a sitemap?",
        answer:
          "Small sites may be fine without one, but sitemaps help large sites, new sites with few backlinks, and sites with rich media get pages discovered faster.",
      },
      {
        question: "How many URLs can a sitemap have?",
        answer:
          "A single sitemap can hold up to 50,000 URLs and 50 MB. For more URLs, split into multiple sitemaps and use a sitemap index file.",
      },
      {
        question: "What is lastmod?",
        answer:
          "lastmod tells search engines when a page was last modified, which can prompt re-crawling. Use ISO 8601 format (YYYY-MM-DD).",
      },
      {
        question: "What is change frequency?",
        answer:
          "changefreq hints how often a page changes (always, hourly, daily, weekly, monthly, yearly, never). Google largely ignores it, but it costs nothing to include.",
      },
      {
        question: "What is priority?",
        answer:
          "Priority (0.0–1.0) is a relative hint of a page's importance within your site. It doesn't override Google's judgment but signals which pages matter most.",
      },
      {
        question: "How do I submit my sitemap to Google?",
        answer:
          "Verify your site in Google Search Console, go to Sitemaps, and submit your sitemap.xml URL. Bing accepts the same file via Bing Webmaster Tools.",
      },
      {
        question: "What is an image sitemap?",
        answer:
          "An image sitemap extends a regular sitemap with <image:image> entries (image URL, title, caption) so Google can discover and index your images.",
      },
      {
        question: "What is a video sitemap?",
        answer:
          "A video sitemap adds <video:video> entries with thumbnail, title, description, and duration so video content can surface in Google video results.",
      },
      {
        question: "Is the sitemap generator free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Are my URLs uploaded to a server?",
        answer:
          "No. The sitemap is generated locally in your browser — your URLs never leave your device.",
      },
      {
        question: "Should I include noindex pages in the sitemap?",
        answer:
          "No — sitemaps should only list indexable, canonical URLs. Including noindex pages can confuse crawlers and waste crawl budget.",
      },
      {
        question: "What does the XML validator do?",
        answer:
          "It checks that the output is well-formed XML, escaping special characters like & and < in URLs so Google doesn't reject the file.",
      },
      {
        question: "Where do I upload the sitemap file?",
        answer:
          "Upload it to your site root (https://yoursite.com/sitemap.xml). Next.js generates one automatically from app/sitemap.ts.",
      },
      {
        question: "Does the generator support sitemap index files?",
        answer:
          "For more than 50,000 URLs, generate multiple sitemaps and wrap them in a sitemap index file — the tool helps you build each sitemap individually.",
      },
    ],
  },

  "utm-builder": {
    meta: { readTime: "4 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "Source · Medium · Campaign",
      "Live URL preview",
      "QR code for every link",
      "Campaign history (local)",
    ],
    intro: {
      heading: "UTM Builder — Trackable Campaign URLs Made Simple",
      paragraphs: [
        "The UTM Builder adds Google Analytics campaign parameters (utm_source, utm_medium, utm_campaign, utm_term, utm_content) to any URL — correctly encoded and ready to paste into ads, emails, and social posts.",
        "You get a live URL preview as you type, a QR code for every campaign link, and a local history of your recent campaigns so you can reuse them across channels. Everything stays in your browser.",
      ],
    },
    benefits: [
      {
        title: "Consistent Campaign Tracking",
        description: "Standard utm_source, utm_medium, utm_campaign, utm_term, and utm_content parameters, encoded correctly.",
      },
      {
        title: "QR Code Built In",
        description: "Generate a scannable QR code for every campaign URL — perfect for posters, presentations, and offline materials.",
      },
      {
        title: "Campaign History",
        description: "Recent campaigns are saved locally so you can copy an old link or repeat a campaign in one click.",
      },
      {
        title: "Live URL Preview",
        description: "See the full final URL update in real time as you type each parameter.",
      },
    ],
    features: [
      {
        title: "All Five UTM Parameters",
        description: "Source, medium, campaign, term, and content — with optional fields left out of the URL when empty.",
      },
      {
        title: "Automatic Encoding",
        description: "Spaces and special characters are URL-encoded automatically so tracking survives any platform.",
      },
      {
        title: "QR Code Download",
        description: "Download the campaign QR code as a PNG to print on posters, cards, or presentation slides.",
      },
      {
        title: "History Panel",
        description: "Your last 12 campaigns are stored locally with a timestamp — clear them anytime.",
      },
      {
        title: "One-Click Copy",
        description: "Copy the full campaign URL or just the parameters for reuse in other tools.",
      },
      {
        title: "Share-Ready",
        description: "Works with any destination — landing pages, app links, Google Ads final URLs, and email CTAs.",
      },
    ],
    howTo: {
      heading: "How to Build a UTM URL",
      description: "Create a trackable campaign link in three simple steps.",
      steps: [
        {
          name: "Paste your base URL",
          text: "Enter the landing page or destination URL you want to track.",
        },
        {
          name: "Fill in campaign details",
          text: "Add source (e.g. facebook, newsletter), medium (cpc, email), campaign name, and optional term and content.",
        },
        {
          name: "Copy or scan",
          text: "Copy the final URL for your campaign, or download the QR code for offline materials.",
        },
      ],
    },
    faqs: [
      {
        question: "What is a UTM parameter?",
        answer:
          "UTM parameters are tags added to a URL that tell Google Analytics where traffic came from — the source, medium, campaign, term, and content of a specific link.",
      },
      {
        question: "What does utm_source mean?",
        answer:
          "utm_source identifies the platform sending traffic, like facebook, google, newsletter, or partner-site.",
      },
      {
        question: "What does utm_medium mean?",
        answer:
          "utm_medium describes the channel type — cpc (paid), email, social, referral, or organic.",
      },
      {
        question: "What does utm_campaign mean?",
        answer:
          "utm_campaign names the specific campaign, promotion, or product launch, e.g. spring-sale-2026.",
      },
      {
        question: "What are utm_term and utm_content?",
        answer:
          "utm_term tracks paid keywords, and utm_content distinguishes similar links in the same campaign — like two versions of an ad.",
      },
      {
        question: "Do UTM parameters hurt my SEO?",
        answer:
          "No, but they create separate URLs that can split analytics data. Add a canonical tag on your landing page to keep SEO signals consolidated.",
      },
      {
        question: "Should I use UTM tags on internal links?",
        answer:
          "No — UTM tags are for external campaigns. Internal links with UTMs pollute analytics and can confuse attribution.",
      },
      {
        question: "Is the UTM builder free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Is my campaign data stored anywhere?",
        answer:
          "History is saved only in your browser's local storage so you can reuse links — nothing is sent to any server.",
      },
      {
        question: "Can I build a UTM for a QR code?",
        answer:
          "Yes — the builder generates a downloadable QR code for the final campaign URL, ideal for offline materials.",
      },
      {
        question: "What is a good UTM naming convention?",
        answer:
          "Use lowercase, consistent values like source=facebook, medium=paid, campaign=summer-sale — consistency makes analytics reporting much easier.",
      },
      {
        question: "How do UTM links show up in Google Analytics?",
        answer:
          "In GA4, sessions with UTM parameters appear in Acquisition reports under the matching source/medium/campaign, letting you compare channel performance.",
      },
      {
        question: "Can I use the same URL with different campaigns?",
        answer:
          "Yes — add different campaign parameters to the same destination URL to track each promotion separately.",
      },
      {
        question: "Does the builder handle existing query strings?",
        answer:
          "Yes — if your base URL already has query parameters, the UTM parameters are appended correctly with &.",
      },
      {
        question: "Can I remove the history?",
        answer:
          "Yes — the history panel has a clear button that removes all locally stored campaigns.",
      },
    ],
  },

  "serp-preview": {
    meta: { readTime: "4 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "Desktop + mobile preview",
      "Pixel-accurate truncation",
      "Title & description scores",
      "Keyword highlight",
    ],
    intro: {
      heading: "SERP Preview — See Your Result Before Google Does",
      paragraphs: [
        "The SERP Preview tool shows exactly how your page will appear in Google search results — on desktop and mobile — with pixel-accurate title and description truncation, character counts, and a keyword-highlighted preview.",
        "A built-in title and description scoring system warns you when your snippet will be cut off, suggests ideal lengths, and highlights your target keyword so you can optimize before you publish.",
      ],
    },
    benefits: [
      {
        title: "Pixel-Accurate Truncation",
        description: "See precisely where Google cuts your title and description on desktop and mobile — no more guessing.",
      },
      {
        title: "Title & Description Scores",
        description: "Instant A/B-style feedback on length, keyword placement, and readability with concrete suggestions.",
      },
      {
        title: "Keyword Highlighting",
        description: "Your target keyword is highlighted in the preview so you can verify it appears naturally in title and description.",
      },
      {
        title: "CTR Optimization Tips",
        description: "Get actionable suggestions — like front-loading keywords and adding numbers — to improve click-through rate.",
      },
    ],
    features: [
      {
        title: "Desktop Preview",
        description: "A faithful desktop Google result — favicon, breadcrumb URL, blue title, and grey description.",
      },
      {
        title: "Mobile Preview",
        description: "A mobile-width result card showing where text truncates on small screens.",
      },
      {
        title: "Character & Pixel Counts",
        description: "Live counts of title and description length with pixel-width tracking as you type.",
      },
      {
        title: "Truncation Warnings",
        description: "Amber warnings the moment your title exceeds 60 characters or your description passes 160.",
      },
      {
        title: "Keyword Highlight",
        description: "Type your target keyword and see every occurrence highlighted in both previews.",
      },
      {
        title: "Score & Suggestions",
        description: "A 0–100 score plus checklist-style tips for title, description, and overall snippet quality.",
      },
    ],
    howTo: {
      heading: "How to Preview Your SERP Snippet",
      description: "Optimize your search result in three simple steps.",
      steps: [
        {
          name: "Enter title & description",
          text: "Paste your current meta title and description into the fields.",
        },
        {
          name: "Add your keyword & URL",
          text: "Enter your target keyword and page URL — the keyword is highlighted across the previews.",
        },
        {
          name: "Review the scores",
          text: "Check the desktop and mobile previews, read the suggestions, and tweak until your snippet scores green.",
        },
      ],
    },
    faqs: [
      {
        question: "What is a SERP preview?",
        answer:
          "A SERP (Search Engine Results Page) preview shows how your page's title and description will look in Google results, including where text gets truncated.",
      },
      {
        question: "Why does my title get cut off in Google?",
        answer:
          "Google truncates titles that exceed roughly 60 characters (fewer on mobile) or titles that are too long for the display width — the preview shows you exactly where.",
      },
      {
        question: "What is the ideal title length?",
        answer:
          "Around 50–60 characters is the sweet spot — long enough for a keyword-rich title, short enough to avoid truncation on desktop and mobile.",
      },
      {
        question: "What is the ideal description length?",
        answer:
          "About 150–160 characters. Longer descriptions are truncated, and the most important information should appear in the first 120 characters.",
      },
      {
        question: "What is a title score?",
        answer:
          "The title score rates length, keyword presence, and clarity — helping you write titles that rank and get clicks.",
      },
      {
        question: "Does a better snippet improve CTR?",
        answer:
          "Yes — a clear, keyword-matched title and description can dramatically increase click-through rate, which is why Google shows them in the first place.",
      },
      {
        question: "Is the SERP preview free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Does Google always show my meta description?",
        answer:
          "No — Google may rewrite or generate a description if yours doesn't match the query. The preview shows your intended snippet, which still influences what Google picks.",
      },
      {
        question: "How does mobile truncation differ?",
        answer:
          "Mobile viewports are narrower, so titles and descriptions truncate earlier. The mobile preview shows this so you can optimize for phones, which drive most searches.",
      },
      {
        question: "What is keyword highlighting for?",
        answer:
          "It shows where your target keyword appears in the snippet, so you can ensure it's present in the title and early in the description.",
      },
      {
        question: "What is a breadcrumb URL in the preview?",
        answer:
          "Google often replaces your raw URL with a breadcrumb (Home › Category › Page). You can enter a breadcrumb path to preview how it appears.",
      },
      {
        question: "Can I preview branded vs non-branded titles?",
        answer:
          "Yes — swap between versions in the title field and compare how the score and preview change for each variant.",
      },
      {
        question: "What makes a high-scoring snippet?",
        answer:
          "A title under 60 characters with the keyword near the front, a 150–160 character description with a clear value proposition, and correct breadcrumb structure.",
      },
      {
        question: "Does the tool check for emoji and special characters?",
        answer:
          "The preview renders emoji and special characters as Google would, so you can see whether symbols help or hurt readability.",
      },
      {
        question: "Can I preview local business results?",
        answer:
          "The core preview covers standard blue links. Local packs and rich results are separate features best tested with Google's own tools.",
      },
    ],
  },

  "slug-generator": {
    meta: { readTime: "4 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "SEO-friendly URL slugs",
      "Unicode & transliteration",
      "Stop-word removal",
      "Custom separators",
    ],
    intro: {
      heading: "Slug Generator — Clean, SEO-Friendly URLs in One Click",
      paragraphs: [
        "The Slug Generator turns any headline or phrase into a clean, lowercase, hyphen-separated URL slug. Type or paste a title and watch the slug update live — with options to remove stop words, replace symbols, transliterate Unicode, and choose your separator.",
        "Whether you're writing a blog post in WordPress, a page in Next.js, or a product URL, a well-formed slug is one of the easiest SEO wins you can make. Everything runs in your browser.",
      ],
    },
    benefits: [
      {
        title: "Readable, Keyword-Rich Slugs",
        description: "Clean slugs with your key terms visible to both users and search engines.",
      },
      {
        title: "Stop-Word Removal",
        description: "Optionally strip words like a, an, the, of, and for a shorter, punchier URL.",
      },
      {
        title: "Unicode Support",
        description: "Accented characters and non-Latin text are transliterated to safe ASCII automatically.",
      },
      {
        title: "Instant Live Preview",
        description: "The slug updates on every keystroke with a full example URL beneath it.",
      },
    ],
    features: [
      {
        title: "Auto Slugs",
        description: "Paste a headline and the slug is generated instantly — no button presses needed.",
      },
      {
        title: "Custom Separator",
        description: "Choose hyphen (-), underscore (_), dot (.), or a custom separator.",
      },
      {
        title: "Stop-Word Filter",
        description: "Remove common stop words to create shorter, more memorable URLs.",
      },
      {
        title: "Unicode Transliteration",
        description: "é → e, ñ → n, ü → u — accented characters become safe ASCII automatically.",
      },
      {
        title: "Symbol Replacement",
        description: "&, %, +, and other symbols are replaced or removed consistently.",
      },
      {
        title: "Copy & Download",
        description: "Copy the slug, or copy the full example URL, in one click.",
      },
    ],
    howTo: {
      heading: "How to Generate a Slug",
      description: "Create a clean URL slug in three simple steps.",
      steps: [
        {
          name: "Type or paste your title",
          text: "Enter your headline, product name, or phrase in the input box.",
        },
        {
          name: "Tune the options",
          text: "Toggle stop-word removal, choose a separator, and enable Unicode transliteration as needed.",
        },
        {
          name: "Copy the slug",
          text: "Copy the generated slug and use it in your CMS or routing configuration.",
        },
      ],
    },
    faqs: [
      {
        question: "What is a URL slug?",
        answer:
          "A slug is the part of a URL that identifies a page in a readable way — for example, /slug-generator is the slug of this page.",
      },
      {
        question: "Why are slugs important for SEO?",
        answer:
          "Search engines and users read slugs to understand page content. Short, descriptive slugs with your target keyword can improve relevance and click-through.",
      },
      {
        question: "What makes a good slug?",
        answer:
          "Lowercase, hyphen-separated, 3–5 words, containing the primary keyword, and omitting stop words like a, the, and of.",
      },
      {
        question: "Should slugs use hyphens or underscores?",
        answer:
          "Hyphens. Google treats hyphens as word separators, while underscores are treated as part of a single word.",
      },
      {
        question: "Should I change a slug after publishing?",
        answer:
          "Avoid it — changing a slug changes the URL and can break links. If you must change it, add a 301 redirect from the old URL.",
      },
      {
        question: "Is the slug generator free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Does the generator support non-English text?",
        answer:
          "Yes — accented characters and common Unicode scripts are transliterated to ASCII where possible, so your slugs stay URL-safe.",
      },
      {
        question: "What are stop words?",
        answer:
          "Stop words are common filler words like a, an, the, of, and for that add little meaning. Removing them shortens slugs without losing meaning.",
      },
      {
        question: "How long should a slug be?",
        answer:
          "Aim for 3–5 words (under 60 characters). Long slugs get truncated in search results and look messy when shared.",
      },
      {
        question: "Can I use numbers and dates in slugs?",
        answer:
          "Yes, though dates (like /2026/08/01/) can make URLs look dated. Numbers are fine when they're meaningful, like product versions.",
      },
      {
        question: "Do slugs need to match my title exactly?",
        answer:
          "No — the slug should capture the essence of the title with your keyword, shortened and cleaned. It doesn't need to be identical.",
      },
      {
        question: "What characters are allowed in slugs?",
        answer:
          "Lowercase letters, numbers, and hyphens are the standard. The generator removes everything else automatically.",
      },
      {
        question: "Can I use a custom separator?",
        answer:
          "Yes — switch between hyphen, underscore, dot, or any custom separator you prefer.",
      },
      {
        question: "Does the tool work with product names?",
        answer:
          "Yes — paste a product name and get a clean slug like /apple-iphone-16-pro for your product URL.",
      },
      {
        question: "Where is the generated slug used?",
        answer:
          "In your CMS (WordPress, Shopify), framework (Next.js, Astro), or any routing config — paste it as the page's URL slug.",
      },
    ],
  },

  "meta-tag-analyzer": {
    meta: { readTime: "5 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "URL or HTML source input",
      "Title, OG & Twitter audit",
      "Structured data detection",
      "0–100 SEO score",
    ],
    intro: {
      heading: "Meta Tag Analyzer — Audit Any Page's SEO in Seconds",
      paragraphs: [
        "The Meta Tag Analyzer inspects a page's head — title, meta description, canonical, robots, Open Graph, Twitter Cards, viewport, charset, and JSON-LD structured data — and tells you what's missing, duplicated, or wrong.",
        "Paste a URL and fetch the page, or paste raw HTML source directly. You'll get a clear 0–100 SEO score, a list of missing and duplicate tags, and prioritized improvement suggestions. Everything is analyzed in your browser.",
      ],
    },
    benefits: [
      {
        title: "Instant SEO Health Check",
        description: "A 0–100 score breaks down your page's on-page SEO into one clear number.",
      },
      {
        title: "Missing & Duplicate Detection",
        description: "Finds absent title, description, canonical, OG tags — and duplicate tags that confuse crawlers.",
      },
      {
        title: "Structured Data Scan",
        description: "Detects JSON-LD and microdata blocks and reports which schema types are present.",
      },
      {
        title: "Actionable Suggestions",
        description: "Each issue comes with a concrete fix — not just a red flag.",
      },
    ],
    features: [
      {
        title: "URL or HTML Input",
        description: "Analyze a live URL (fetched through a public CORS proxy) or paste raw HTML for offline pages.",
      },
      {
        title: "Title & Description Audit",
        description: "Checks presence, length, and keyword placement with warnings for truncation risk.",
      },
      {
        title: "Canonical & Robots Check",
        description: "Verifies canonical consistency and flags noindex directives that might be blocking indexing.",
      },
      {
        title: "Open Graph & Twitter Audit",
        description: "Reports each og:/twitter: tag and marks missing ones that hurt social shares.",
      },
      {
        title: "Structured Data Detection",
        description: "Lists all JSON-LD and microdata schema types found on the page.",
      },
      {
        title: "SEO Score & Report",
        description: "A weighted score with a full checklist of passed and failed checks.",
      },
    ],
    howTo: {
      heading: "How to Analyze Meta Tags",
      description: "Audit any page's SEO head in three simple steps.",
      steps: [
        {
          name: "Enter a URL or HTML",
          text: "Paste a page URL to fetch it, or paste raw HTML source directly into the analyzer.",
        },
        {
          name: "Run the analysis",
          text: "Click Analyze and the tool inspects title, description, canonical, OG, Twitter, and structured data.",
        },
        {
          name: "Review the report",
          text: "Read the score, the missing/duplicate tag list, and the prioritized suggestions — then fix and re-run.",
        },
      ],
    },
    faqs: [
      {
        question: "What is a meta tag analyzer?",
        answer:
          "A meta tag analyzer reads a page's head tags and reports which SEO tags are present, missing, or duplicated — with a health score and improvement tips.",
      },
      {
        question: "What does the SEO score mean?",
        answer:
          "The score (0–100) weighs critical tags like title, description, canonical, and OG tags — 90+ is great, under 60 means important tags are missing.",
      },
      {
        question: "How do I analyze a page I don't own?",
        answer:
          "Paste the URL and the tool fetches it through a public CORS proxy, or paste the HTML source you can view with View Source in your browser.",
      },
      {
        question: "Why can't the tool fetch some URLs?",
        answer:
          "Sites with strict CORS policies or bot protection may block proxy fetches. Paste the HTML source directly instead — it always works.",
      },
      {
        question: "What are duplicate meta tags?",
        answer:
          "Duplicate tags appear when a page outputs the same tag twice (e.g. two meta descriptions). Duplicates confuse crawlers and can cause the wrong one to be used.",
      },
      {
        question: "What is a canonical URL and why does it matter?",
        answer:
          "A canonical tag declares the preferred URL of a page, preventing duplicate-content issues. Missing canonicals can split ranking signals across similar URLs.",
      },
      {
        question: "Is the meta tag analyzer free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Does the analyzer check structured data?",
        answer:
          "Yes — it detects JSON-LD and microdata blocks and reports the schema types found (Article, FAQ, Product, etc.).",
      },
      {
        question: "Can I analyze a local file or draft page?",
        answer:
          "Yes — export your page's HTML or paste the source into the analyzer to check it before it goes live.",
      },
      {
        question: "What is viewport and why is it checked?",
        answer:
          "The viewport meta tag controls responsive scaling on mobile. It's not an SEO ranking factor, but its absence breaks mobile usability, which Google penalizes.",
      },
      {
        question: "What does a missing robots tag mean?",
        answer:
          "It usually means the page defaults to index,follow — which is fine. The analyzer flags a robots tag only when it contains restrictive directives like noindex.",
      },
      {
        question: "Are the pages I analyze stored anywhere?",
        answer:
          "No — analysis happens entirely in your browser. Nothing you paste or fetch is ever uploaded or stored.",
      },
      {
        question: "What's the difference between OG and Twitter tags?",
        answer:
          "OG tags control Facebook/LinkedIn/WhatsApp previews; Twitter tags control X. The analyzer checks both and flags missing ones.",
      },
      {
        question: "How often should I audit my pages?",
        answer:
          "After every significant redesign or content update, and quarterly as a routine check. Automated site crawlers are better for hundreds of pages.",
      },
      {
        question: "Does the analyzer work on mobile?",
        answer:
          "Yes, it's fully responsive and works on desktop, tablet, and mobile browsers.",
      },
    ],
  },

  "heading-checker": {
    meta: { readTime: "5 min read", updated: "August 2026", author: "CompressPix" },
    highlights: [
      "H1–H6 hierarchy audit",
      "Duplicate & missing detection",
      "Visual heading tree",
      "Accessibility suggestions",
    ],
    intro: {
      heading: "Heading Checker — Fix Your H1–H6 Structure in Seconds",
      paragraphs: [
        "The Heading Checker audits a page's heading structure — H1 through H6 — and reports hierarchy issues, duplicate headings, missing H1s, and skipped levels that hurt both SEO and accessibility.",
        "Paste a URL or raw HTML and get a visual heading tree, a checklist of problems, and concrete fixes. Proper heading structure helps screen readers navigate your page and helps search engines understand your content — everything runs in your browser.",
      ],
    },
    benefits: [
      {
        title: "Visual Heading Tree",
        description: "See your entire H1–H6 structure as an indented tree that's easy to scan and understand.",
      },
      {
        title: "Duplicate & Missing Detection",
        description: "Flags multiple H1s, duplicate headings, and pages with no H1 — the most common SEO mistakes.",
      },
      {
        title: "Accessibility Insights",
        description: "Skipped heading levels are called out, since they confuse screen reader users navigating the page.",
      },
      {
        title: "Actionable Fixes",
        description: "Every issue includes a clear suggestion so you can correct your structure quickly.",
      },
    ],
    features: [
      {
        title: "H1–H6 Extraction",
        description: "Extracts every heading with its exact text, level, and order from the page.",
      },
      {
        title: "Hierarchy Validation",
        description: "Detects skipped levels (H1 → H3) and out-of-order headings automatically.",
      },
      {
        title: "Duplicate Heading Check",
        description: "Finds identical headings used more than once, which dilutes topic clarity.",
      },
      {
        title: "Missing H1 Detection",
        description: "Warns when a page has no H1 — or has more than one H1.",
      },
      {
        title: "Heading Tree View",
        description: "A collapsible visual tree of your heading structure with per-heading counts.",
      },
      {
        title: "URL or HTML Input",
        description: "Analyze a live URL via CORS proxy, or paste raw HTML for pages you can't fetch.",
      },
    ],
    howTo: {
      heading: "How to Check Heading Structure",
      description: "Audit a page's headings in three simple steps.",
      steps: [
        {
          name: "Enter a URL or HTML",
          text: "Paste the page URL to fetch it, or paste raw HTML source for a local or draft page.",
        },
        {
          name: "Run the checker",
          text: "Click Check Headings and the tool extracts and validates the full H1–H6 structure.",
        },
        {
          name: "Fix the issues",
          text: "Review the tree and suggestions — add a missing H1, remove duplicates, and un-skip levels.",
        },
      ],
    },
    faqs: [
      {
        question: "What is heading structure in SEO?",
        answer:
          "Heading structure is the H1–H6 outline of a page. It organizes content for users and signals topic hierarchy to search engines.",
      },
      {
        question: "How many H1 tags should a page have?",
        answer:
          "Exactly one H1 per page is the safest, clearest practice — it defines the page's main topic. Multiple H1s dilute that signal.",
      },
      {
        question: "What happens if I skip heading levels?",
        answer:
          "Skipping from H2 to H4 (skipping H3) confuses screen readers and can make your content hierarchy harder for search engines to parse.",
      },
      {
        question: "Are duplicate headings bad for SEO?",
        answer:
          "They're a quality signal problem — identical headings suggest duplicate or thin content and waste the semantic value of your outline.",
      },
      {
        question: "What is the difference between H1 and the title tag?",
        answer:
          "The title tag appears in search results and browser tabs; the H1 is the visible main heading on the page. They should be similar but can differ slightly.",
      },
      {
        question: "How do headings help accessibility?",
        answer:
          "Screen reader users navigate pages by heading list. A logical H1–H6 order lets them jump between sections — skipped levels break that flow.",
      },
      {
        question: "Is the heading checker free?",
        answer:
          "Yes, it's completely free with no sign-ups, no watermarks, and no usage limits.",
      },
      {
        question: "Can I check a page I don't own?",
        answer:
          "Yes — paste the URL and the tool fetches it through a CORS proxy, or paste the HTML source directly.",
      },
      {
        question: "Why can't the tool fetch some URLs?",
        answer:
          "Strict CORS policies or bot protection can block proxy fetches — in that case, paste the page's HTML source instead.",
      },
      {
        question: "What does the heading tree show?",
        answer:
          "The tree lists every heading in order, indented by level, with the heading text and its tag (H1, H2, etc.) — making hierarchy problems obvious.",
      },
      {
        question: "Do headings affect rich results?",
        answer:
          "Not directly, but clear headings help Google understand page structure, which supports accurate indexing and featured snippet selection.",
      },
      {
        question: "How should I use H2 and H3 correctly?",
        answer:
          "Use H2 for main sections, H3 for subsections within an H2, and H4+ for deeper nesting — never skip a level when moving deeper.",
      },
      {
        question: "Are the pages I check stored anywhere?",
        answer:
          "No — the analysis runs entirely in your browser. Nothing you fetch or paste is stored or uploaded.",
      },
      {
        question: "Can I check headings in a CMS draft?",
        answer:
          "Yes — paste the rendered HTML from your CMS editor's code view to check a draft before publishing.",
      },
      {
        question: "Does the checker work on mobile?",
        answer:
          "Yes, it's fully responsive and works on desktop, tablet, and mobile browsers.",
      },
    ],
  },
};
