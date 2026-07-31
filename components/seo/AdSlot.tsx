/**
 * CLS-safe responsive ad slot. Renders nothing unless NEXT_PUBLIC_ENABLE_ADS
 * is set to "true", so adding ads later won't shift the layout or require
 * touching every page.
 */
export function AdSlot({ className = "" }: { className?: string }) {
  if (process.env.NEXT_PUBLIC_ENABLE_ADS !== "true") return null;

  return (
    <div
      className={`mx-auto w-full max-w-4xl ${className}`}
      style={{ minHeight: 100 }}
      aria-hidden="true"
      data-ad-slot="responsive"
    >
      {/* Reserved space — paste your AdSense snippet here when ready */}
    </div>
  );
}
