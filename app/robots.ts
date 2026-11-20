import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

// Note: /_next/ must stay crawlable — every page renders client-side, and
// Googlebot needs the JS/CSS chunks under /_next/static to render content.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      {
        // Let Google Image bot crawl deal card images via our proxy
        userAgent: "Googlebot-Image",
        allow: ["/", "/api/telegram-image", "/api/destination-image"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
