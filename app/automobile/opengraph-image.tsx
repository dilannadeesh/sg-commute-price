import { renderOgImage } from "../../lib/og";

export const alt = "Singapore Automobile — SGliving";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Automobile",
    title: "COE results & car events",
    subtitle: "Latest COE premiums plus Singapore motor shows, car fairs and F1.",
  });
}
