import { renderOgImage } from "../../lib/og";

export const alt = "Singapore Food Deals — SGliving";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Food Deals",
    title: "Singapore food deals today",
    subtitle: "1-for-1 offers, restaurant promos and discount codes.",
  });
}
