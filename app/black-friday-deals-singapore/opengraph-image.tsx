import { renderOgImage } from "../../lib/og";

export const alt = "Black Friday Deals Singapore 2026 — SGliving";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Black Friday 2026 · 27 Nov",
    title: "Black Friday deals in Singapore",
    subtitle: "Electronics, groceries, food & flights, plus Cyber Monday deals, updated daily.",
  });
}
