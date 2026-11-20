import { renderOgImage } from "../../lib/og";

export const alt = "Singapore Supermarket Deals — SGliving";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Supermarket Deals",
    title: "Singapore supermarket deals",
    subtitle: "NTUC FairPrice, Cold Storage, Giant, Sheng Siong, Don Don Donki & more.",
  });
}
