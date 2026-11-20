import { renderOgImage } from "../../lib/og";

export const alt = "Singapore Electronics Deals — SGliving";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Electronics Deals",
    title: "Singapore electronics deals",
    subtitle: "Harvey Norman, Courts, Best Denki, Challenger & Gain City promotions.",
  });
}
