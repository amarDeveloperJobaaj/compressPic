import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

// Brand colors (match app/globals.css)
const PRIMARY = "#2563EB";
const PRIMARY_DARK = "#1D4ED8";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "CompressPix — Free Online Image Tools";
  const truncated = title.length > 70 ? `${title.slice(0, 67)}…` : title;

  const response = new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 55%, #60A5FA 100%)`,
          padding: "64px 72px",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#FFFFFF",
              color: PRIMARY,
              fontSize: "32px",
              fontWeight: 800,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            CP
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.5px",
            }}
          >
            CompressPix
          </div>
        </div>

        {/* Page title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            fontSize: "64px",
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.15,
            letterSpacing: "-1px",
            maxWidth: "1000px",
            textWrap: "balance",
          }}
        >
          {truncated}
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "28px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <span>100% Browser-Based</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>No Uploads</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>Free & Unlimited</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );

  // Each ?title= is immutable and cacheable — the URL changes with the title,
  // so caching aggressively avoids regenerating the PNG on every request.
  response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800, immutable");
  return response;
}
