import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/food-deals",
          "/supermarket-deals",
          "/electronics-deals",
          "/airline-deals",
          "/weekend",
          "/commute",
          "/sitemap.xml",
        ],
        disallow: [
          "/api/",
          "/_next/",
        ],
      },
      {
        // Let Google Image bot crawl deal card images via our proxy
        userAgent: "Googlebot-Image",
        allow: ["/api/telegram-image", "/api/destination-image"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
