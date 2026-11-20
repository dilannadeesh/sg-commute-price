import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Branded 1200×630 social share card used by every route's opengraph-image. */
export function renderOgImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
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
          background: "linear-gradient(135deg, #ff385c 0%, #e00b41 55%, #92174d 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#ffffff",
              color: "#ff385c",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            SG
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>SGliving</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 28, opacity: 0.85, textTransform: "uppercase", letterSpacing: 2 }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.08 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 30, opacity: 0.9, lineHeight: 1.3 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, opacity: 0.85 }}>sgliving.life · Updated every night · Free</div>
      </div>
    ),
    ogSize,
  );
}
