import { renderOgImage } from "../lib/og";

export const alt = "SGliving — Singapore Daily Deals Hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Singapore Deals Hub",
    title: "Today’s best deals in Singapore",
    subtitle: "Food, supermarket, electronics & cheap flights from Changi — all in one place.",
  });
}
