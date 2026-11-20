import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SGliving — Singapore Deals Hub",
    short_name: "SGliving",
    description:
      "Singapore's daily deals hub — food, supermarket, electronics and airline deals, plus commute price comparison.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff385c",
    lang: "en-SG",
    categories: ["shopping", "lifestyle", "travel"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
