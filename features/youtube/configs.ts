/**
 * YouTube Tools configs — server-safe metadata for the dynamic [slug] route.
 * Only plain data lives here (no React, no client imports) so the route's
 * generateStaticParams / generateMetadata can consume it directly.
 */

export interface YouTubeToolConfig {
  slug: string;
  name: string;
  title: string;
  description: string;
  keywords: string[];
}

export const YOUTUBE_CONFIGS: Record<string, YouTubeToolConfig> = {
  "youtube-thumbnail-downloader": {
    slug: "youtube-thumbnail-downloader",
    name: "Thumbnail Downloader",
    title: "YouTube Thumbnail Downloader — Free & HD",
    description:
      "Download any YouTube video thumbnail in every available resolution — from default 120×90 up to full HD 1280×720. Paste a URL, preview all sizes, and download or copy the image URL instantly.",
    keywords: [
      "youtube thumbnail downloader",
      "download youtube thumbnail",
      "youtube thumbnail download",
      "get video thumbnail",
      "youtube thumbnail viewer",
    ],
  },
  "youtube-tags-extractor": {
    slug: "youtube-tags-extractor",
    name: "Tags Extractor",
    title: "YouTube Tags Extractor — Analyze & Suggest Tags",
    description:
      "Analyze your YouTube video tags — count, character budget, and duplicates — and generate smart keyword tag suggestions from your video title. Everything runs in your browser.",
    keywords: [
      "youtube tags extractor",
      "youtube tag generator",
      "video tags suggestions",
      "youtube seo tags",
      "tags for youtube videos",
    ],
  },
  "youtube-transcript": {
    slug: "youtube-transcript",
    name: "Transcript Extractor",
    title: "YouTube Transcript Extractor — Get Video Transcripts",
    description:
      "Extract the transcript of any YouTube video with captions enabled. View it with timestamps or as plain text, search, copy, and download as TXT or PDF — completely free.",
    keywords: [
      "youtube transcript",
      "youtube transcript extractor",
      "video to text",
      "youtube caption downloader",
      "transcript of youtube video",
    ],
  },
  "youtube-title-generator": {
    slug: "youtube-title-generator",
    name: "Title Generator",
    title: "YouTube Title Generator — Catchy, SEO-Scored Titles",
    description:
      "Generate 12+ catchy, click-worthy YouTube titles for any topic — each scored for SEO with character counts and CTR tips. Pick a category and tone, then copy your favorites instantly.",
    keywords: [
      "youtube title generator",
      "video title ideas",
      "youtube title ideas",
      "catchy video titles",
      "youtube seo title",
    ],
  },
  "youtube-description-generator": {
    slug: "youtube-description-generator",
    name: "Description Generator",
    title: "YouTube Description Generator — SEO-Ready Descriptions",
    description:
      "Write SEO-optimized YouTube descriptions in seconds — hooks, bullet points, keyword lines, call-to-actions, and hashtag suggestions. Copy or download as TXT, free and in your browser.",
    keywords: [
      "youtube description generator",
      "video description template",
      "youtube description ideas",
      "youtube seo description",
      "video description writer",
    ],
  },
  "youtube-video-downloader": {
    slug: "youtube-video-downloader",
    name: "Video Downloader",
    title: "YouTube Video Downloader — MP4, MP3 & M4A",
    description:
      "Save YouTube videos and audio in your choice of format and quality — MP4 360p to 1080p, MP3 and M4A audio — with video info, HD thumbnails, and transcript preview. Downloads activate automatically once the site's download service is configured.",
    keywords: [
      "youtube video downloader",
      "download youtube video",
      "youtube to mp4",
      "youtube to mp3",
      "save youtube video",
    ],
  },
};

export const YOUTUBE_SLUGS = Object.keys(YOUTUBE_CONFIGS);

export function getYouTubeConfig(slug: string): YouTubeToolConfig | undefined {
  return YOUTUBE_CONFIGS[slug];
}
