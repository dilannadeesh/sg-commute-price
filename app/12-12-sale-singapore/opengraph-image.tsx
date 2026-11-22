import { renderOgImage } from "../../lib/og";

export const alt = "12.12 Sale Singapore 2026 — SGliving";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "12.12 Sale · Sat 12 Dec",
    title: "12.12 sale deals in Singapore",
    subtitle: "Electronics, groceries, food & flights, plus Shopee and Lazada tips, updated daily.",
  });
}
