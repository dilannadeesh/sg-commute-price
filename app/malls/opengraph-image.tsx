import { renderOgImage } from "../../lib/og";

export const alt = "Singapore Shopping Malls — SGliving";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Shopping Malls",
    title: "Shopping malls in Singapore",
    subtitle: "Every major mall by region — store counts and the nearest MRT.",
  });
}
