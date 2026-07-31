const HEIC_TYPES = ["image/heic", "image/heif"];

/**
 * Detect whether a file is a HEIC/HEIF image (iPhone photos).
 * Checks both the MIME type and the file extension, since some platforms
 * (Windows/Android) report an empty MIME type for HEIC files.
 */
export function isHeicFile(file: File): boolean {
  return HEIC_TYPES.includes(file.type) || /\.(heic|heif)$/i.test(file.name);
}

/**
 * Normalize a file's type for display: some platforms report an empty MIME
 * type for HEIC files, so fall back to "image/heic" when the extension matches.
 */
export function normalizeImageType(file: File): string {
  return file.type || (isHeicFile(file) ? "image/heic" : "");
}

/**
 * Decode a HEIC/HEIF file (e.g. from an iPhone) to a JPEG blob.
 * heic2any is loaded lazily so it never evaluates during SSR and only
 * loads for users who actually upload a HEIC file.
 */
export async function decodeHeicToJpeg(blob: Blob): Promise<Blob> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({
    blob,
    toType: "image/jpeg",
    quality: 0.92,
  });
  // Live Photos / multi-image HEICs return an array — take the first frame.
  return Array.isArray(result) ? result[0] : result;
}
