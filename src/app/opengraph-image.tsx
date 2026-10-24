import { ImageResponse } from "next/og";

export const alt = "Gross-Bazaar: B2B inventory recovery and bulk sourcing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0d1b2a",
          color: "#f6f3ec",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="56" height="56" viewBox="0 0 32 32">
            <rect x="2.5" y="9.5" width="11" height="11" rx="1.5" fill="none" stroke="#f6f3ec" strokeWidth="2" />
            <rect x="18" y="11.5" width="11.5" height="11.5" rx="1.5" fill="#f6f3ec" />
            <rect x="13.5" y="4" width="6" height="6" rx="1" fill="#f0a93a" />
          </svg>
          <span style={{ fontSize: 40 }}>Gross-Bazaar</span>
        </div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
          Turn Unsold Inventory Into New Business Opportunities.
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a9b6c8", fontFamily: "sans-serif" }}>
          B2B inventory recovery · Bulk sourcing · India
        </div>
      </div>
    ),
    size,
  );
}
