import { renderOgImage } from "../../lib/og";

export const alt = "Singapore Hotels — SGliving";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Hotels",
    title: "Singapore hotels by price",
    subtitle: "Budget, 3-star, 4-star and 5-star — typical nightly rates and MRT access.",
  });
}
