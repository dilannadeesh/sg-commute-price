import { renderOgImage } from "../../lib/og";

export const alt = "Singapore Airline Deals — SGliving";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Airline Deals",
    title: "Cheap flights from Singapore",
    subtitle: "Flash sales & promo fares from Changi — Scoot, AirAsia, Jetstar, SIA.",
  });
}
