/**
 * YouTube Tools registry — 5 creator tools.
 * Kept server-safe (no React/lucide imports) so sitemap.ts can consume it.
 * These entries are merged into lib/tools.ts TOOL_CATEGORIES.
 */
import type { Tool, ToolCategory } from "./tools";

export const YOUTUBE_TOOLS: Tool[] = [
  {
    slug: "youtube-thumbnail-downloader",
    name: "Thumbnail Downloader",
    href: "/youtube-thumbnail-downloader",
    description: "Download YouTube thumbnails in all available resolutions",
    tagline: "YouTube Thumbnail Downloader",
    stat: "Default → Max HD · Copy URL",
    badge: "New",
    badgeTone: "primary",
  },
  {
    slug: "youtube-tags-extractor",
    name: "Tags Extractor",
    href: "/youtube-tags-extractor",
    description: "Analyze video tags & get smart tag suggestions",
    tagline: "YouTube Tags Extractor",
    stat: "Tag count · Char budget · Suggestions",
    badge: "New",
    badgeTone: "primary",
  },
  {
    slug: "youtube-transcript",
    name: "Transcript Extractor",
    href: "/youtube-transcript",
    description: "Get the transcript of any YouTube video with timestamps",
    tagline: "YouTube Transcript Extractor",
    stat: "Timestamp view · Search · TXT/PDF",
    badge: "New",
    badgeTone: "primary",
  },
  {
    slug: "youtube-title-generator",
    name: "Title Generator",
    href: "/youtube-title-generator",
    description: "Generate catchy, SEO-scored YouTube titles instantly",
    tagline: "YouTube Title Generator",
    stat: "10+ titles · SEO score · CTR tips",
    badge: "New",
    badgeTone: "primary",
  },
  {
    slug: "youtube-description-generator",
    name: "Description Generator",
    href: "/youtube-description-generator",
    description: "Write SEO-ready video descriptions with hashtags",
    tagline: "YouTube Description Generator",
    stat: "Hooks · Bullets · Hashtags · CTA",
    badge: "New",
    badgeTone: "primary",
  },
  {
    slug: "youtube-video-downloader",
    name: "Video Downloader",
    href: "/youtube-video-downloader",
    description: "Save videos & audio — MP4, MP3, M4A with quality options",
    tagline: "YouTube Video Downloader",
    stat: "MP4 · MP3 · M4A · HD thumbnails",
    badge: "New",
    badgeTone: "primary",
  },
];

export const YOUTUBE_CATEGORY: ToolCategory = {
  id: "youtube",
  label: "YouTube Tools",
  tools: YOUTUBE_TOOLS,
};
