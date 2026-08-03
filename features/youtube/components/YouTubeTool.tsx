"use client";

import { ThumbnailDownloaderTool } from "./ThumbnailDownloaderTool";
import { TagsExtractorTool } from "./TagsExtractorTool";
import { TranscriptTool } from "./TranscriptTool";
import { TitleGeneratorTool } from "./TitleGeneratorTool";
import { DescriptionGeneratorTool } from "./DescriptionGeneratorTool";
import { VideoDownloaderTool } from "./VideoDownloaderTool";

/**
 * Client-side resolver for the YouTube Tools category.
 * The [slug] route only passes the slug; this picks the right tool component.
 */
export function YouTubeTool({ slug }: { slug: string }) {
  switch (slug) {
    case "youtube-thumbnail-downloader":
      return <ThumbnailDownloaderTool />;
    case "youtube-tags-extractor":
      return <TagsExtractorTool />;
    case "youtube-transcript":
      return <TranscriptTool />;
    case "youtube-title-generator":
      return <TitleGeneratorTool />;
    case "youtube-description-generator":
      return <DescriptionGeneratorTool />;
    case "youtube-video-downloader":
      return <VideoDownloaderTool />;
    default:
      return null;
  }
}
