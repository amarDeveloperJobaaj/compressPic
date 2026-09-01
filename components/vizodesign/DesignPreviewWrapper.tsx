"use client";

import dynamic from "next/dynamic";

const DesignPreviewInner = dynamic(() => import("./DesignPreview"), { ssr: false });

interface DesignPreviewWrapperProps {
  slug: string;
  isFullscreen?: boolean;
  className?: string;
}

export default function DesignPreviewWrapper({ slug, isFullscreen, className }: DesignPreviewWrapperProps) {
  return <DesignPreviewInner slug={slug} isFullscreen={isFullscreen} className={className} />;
}
