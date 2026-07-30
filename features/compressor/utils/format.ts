/**
 * Format bytes to human-readable file size string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const base = 1024;
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));

  const value = bytes / Math.pow(base, unitIndex);

  if (unitIndex === 0) return `${value} B`;
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Format compression ratio as percentage.
 */
export function formatCompressionRatio(originalBytes: number, compressedBytes: number): string {
  if (originalBytes === 0) return "0%";
  const ratio = ((originalBytes - compressedBytes) / originalBytes) * 100;
  return `${ratio.toFixed(1)}%`;
}

/**
 * Convert KB to MB for browser-image-compression library.
 */
export function kbToMb(kb: number): number {
  return kb / 1024;
}

/**
 * Get human-readable file type from MIME type.
 */
export function getFileTypeLabel(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WEBP",
  };
  return map[mimeType] ?? mimeType.split("/")[1]?.toUpperCase() ?? "Unknown";
}
