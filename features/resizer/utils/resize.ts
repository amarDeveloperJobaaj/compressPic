/**
 * Load an image from a URL and return an HTMLImageElement.
 * Used by the resizer store for canvas-based crop operations.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from ${src}`));
    // Blob URLs are same-origin, so no crossOrigin needed
    img.src = src;
  });
}
