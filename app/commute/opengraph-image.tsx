import { renderOgImage } from "../../lib/og";

export const alt = "Singapore Commute Price Comparison — SGliving";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Commute",
    title: "Compare Singapore commute prices",
    subtitle: "Grab vs Gojek vs TADA vs MRT/bus — find the cheapest ride for your route.",
  });
}
