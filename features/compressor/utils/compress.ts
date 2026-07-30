import imageCompression from "browser-image-compression";

export interface CompressOptions {
  file: File;
  targetSizeKB: number;
  onProgress?: (progress: number) => void;
}

/**
 * Compress an image to approximately the target file size.
 * Uses the library's built-in quality adjustment algorithm (not manual binary search)
 * for faster and more reliable results.
 */
export async function compressImage({
  file,
  targetSizeKB,
  onProgress,
}: CompressOptions): Promise<File> {
  const targetSizeMB = targetSizeKB / 1024;

  const options = {
    maxSizeMB: targetSizeMB,
    maxWidthOrHeight: 2048,
    useWebWorker: false,
    maxIteration: 10,
    fileType: file.type,
    onProgress: (progressValue: number) => {
      // browser-image-compression reports progress as 0-1
      onProgress?.(Math.round(Math.min(progressValue * 100, 99)));
    },
  };

  const compressedFile = await imageCompression(file, options);
  return compressedFile;
}

/**
 * Generate a download URL for a compressed blob.
 */
export function getDownloadUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * Revoke a previously created download URL.
 */
export function revokeDownloadUrl(url: string): void {
  URL.revokeObjectURL(url);
}
