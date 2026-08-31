"use client";

import { cn } from "@/lib/utils";
import { previewRegistry } from "./previews";

interface DesignPreviewProps {
  slug: string;
  isFullscreen?: boolean;
  className?: string;
}

export default function DesignPreview({ slug, isFullscreen = false, className }: DesignPreviewProps) {
  const PreviewComponent = previewRegistry[slug];

  if (!PreviewComponent) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-gray-100",
        isFullscreen ? "h-full w-full" : "aspect-video h-full w-full rounded-xl",
        className
      )}>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-200 text-gray-400">
            ?
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Preview not found</div>
            <div className="mt-1 text-xs text-gray-400">
              No preview registered for &quot;{slug}&quot;
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white transition-all duration-500 ease-out",
        isFullscreen
          ? "h-full w-full"
          : "aspect-video w-full rounded-xl ring-1 ring-black/5",
        className
      )}
    >
      <div className="absolute inset-0">
        <PreviewComponent />
      </div>
    </div>
  );
}
