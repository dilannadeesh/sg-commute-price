import { ARTICLES as ND_ARTICLES } from "@/lib/newdriver/articles";
import { PROVIDERS } from "@/lib/travel/providers";
import type { MetadataRoute } from "next";
import { MALLS } from "@/lib/malls";
import { HOTELS } from "@/lib/hotels";
import { EVENTS } from "@/lib/automobile";
import { COE_CATS } from "@/lib/coe";
import { GUIDES } from "@/lib/guides";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

// Evergreen guides change when we edit them, not on every build — give Google a real date.
const GUIDES_UPDATED = new Date("2026-11-20");

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
    { url: `${SITE_URL}/new-driver`, lastModified: GUIDES_UPDATED, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/new-driver/btt-mock-test`, lastModified: GUIDES_UPDATED, changeFrequency: "monthly", priority: 0.85 },
    ...ND_ARTICLES.map(a => ({ url: `${SITE_URL}/new-driver/${a.slug}`, lastModified: new Date(a.updated), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/travel`,     lastModified: GUIDES_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    ...PROVIDERS.map(p => ({ url: `${SITE_URL}/travel/${p.slug}`, lastModified: new Date(p.updated), changeFrequency: "monthly" as const, priority: 0.75 })),
    { url: `${SITE_URL}/malls`,      lastModified: GUIDES_UPDATED, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/hotels`,     lastModified: GUIDES_UPDATED, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/automobile`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/coe`,        lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...COE_CATS.map(c => ({ url: `${SITE_URL}/coe/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/guides`,     lastModified: GUIDES_UPDATED, changeFrequency: "weekly", priority: 0.7 },
    ...GUIDES.map(g => ({ url: `${SITE_URL}/guides/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: "monthly" as const, priority: 0.75 })),
    { url: `${SITE_URL}/editorial-policy`, lastModified: GUIDES_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/about`,      lastModified: GUIDES_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`,    lastModified: GUIDES_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    ...MALLS.map(m  => ({ url: `${SITE_URL}/malls/${m.slug}`,      lastModified: GUIDES_UPDATED, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...HOTELS.map(h => ({ url: `${SITE_URL}/hotels/${h.slug}`,     lastModified: GUIDES_UPDATED, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...EVENTS.map(e => ({ url: `${SITE_URL}/automobile/${e.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
