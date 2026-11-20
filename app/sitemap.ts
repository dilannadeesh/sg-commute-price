import type { MetadataRoute } from "next";
import { MALLS } from "@/lib/malls";
import { HOTELS } from "@/lib/hotels";
import { EVENTS } from "@/lib/automobile";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/food-deals`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/supermarket-deals`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/electronics-deals`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/airline-deals`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/weekend`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/commute`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: `${SITE_URL}/malls`,      lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/hotels`,     lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/automobile`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/about`,      lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`,    lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...MALLS.map(m  => ({ url: `${SITE_URL}/malls/${m.slug}`,      lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...HOTELS.map(h => ({ url: `${SITE_URL}/hotels/${h.slug}`,     lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...EVENTS.map(e => ({ url: `${SITE_URL}/automobile/${e.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
