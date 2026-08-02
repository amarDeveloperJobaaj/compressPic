import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

// Brand colors (match app/globals.css)
const PRIMARY = "#2563EB";
const PRIMARY_DARK = "#1D4ED8";
const VIOLET = "#7C3AED";
const SKY = "#0EA5E9";

/** The Vizo Tool "V" mark rendered inline (ImageResponse supports SVG). */
function BrandMark() {
  return (
    <div
      style={{
        display: "flex",
        width: "56px",
        height: "56px",
        borderRadius: "14px",
        background: `linear-gradient(135deg, ${PRIMARY} 0%, ${VIOLET} 55%, ${SKY} 100%)`,
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 24px rgba(37, 99, 235, 0.35)",
      }}
    >
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
        <path
          d="M15.5 31 L24 17 L32.5 31"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M24 8.5 l1.7 2.3 -1.7 2.3 -1.7 -2.3 Z" fill="#FDE047" />
      </svg>
    </div>
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Vizo Tool — Free Online Image Tools";
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
          <BrandMark />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.5px",
              }}
            >
              Vizo Tool
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.8)",
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
              }}
            >
              Free Online Tools
            </div>
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
