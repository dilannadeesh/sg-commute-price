import { renderOgImage } from "../../lib/og";

export const alt = "Singapore Weekend Activities — SGliving";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Weekend",
    title: "Things to do in Singapore this weekend",
    subtitle: "Events, outdoor activities, family days out and weekend deals.",
  });
}
