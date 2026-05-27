import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = {
  title: "Singapore Food Deals Today — Promos, 1-for-1 & Restaurant Offers",
  description:
    "Browse today's best Singapore food deals — 1-for-1 offers, restaurant promotions, discount codes and hawker specials. Sourced daily from @sgfooddeals. Search by cuisine, filter by category and click through to redeem. Free, no sign-up needed.",
  keywords: [
    "Singapore food deals today",
    "Singapore food promotions 2025",
    "1 for 1 Singapore food",
    "Singapore restaurant deals",
    "Singapore food promo code",
    "Singapore dining offers",
    "best food deals Singapore",
    "Singapore bubble tea deals",
    "Singapore hawker promotions",
    "Singapore coffee deals",
    "Singapore pizza deals",
    "Singapore burger deals",
    "Singapore ramen deals",
    "Singapore sushi deals",
    "grab food promo Singapore",
    "foodpanda voucher Singapore",
    "Singapore food delivery deals",
    "sgfooddeals",
    "Singapore food telegram",
    "free food Singapore",
  ],
  openGraph: {
    type:   "website",
    locale: "en_SG",
    url:    `${SITE_URL}/food-deals`,
    title:  "Singapore Food Deals Today — Promos, 1-for-1 & Restaurant Offers",
    description:
      "The freshest Singapore food promos, 1-for-1s and discount codes — aggregated daily from Telegram. Search, filter and click to redeem.",
    images: [{ url: "/og-food-deals.png", width: 1200, height: 630, alt: "Singapore Food Deals — SGliving" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Singapore Food Deals Today | SGliving",
    description: "Daily Singapore restaurant promos, 1-for-1 offers and promo codes — updated every day.",
    images:      ["/og-food-deals.png"],
  },
  alternates: { canonical: "/food-deals" },
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Singapore Food Deals Today",
  description:
    "Daily aggregation of Singapore restaurant promotions, 1-for-1 offers and discount codes sourced from @sgfooddeals on Telegram.",
  url: `${SITE_URL}/food-deals`,
  inLanguage: "en-SG",
  about: {
    "@type": "Thing",
    name: "Singapore Food Promotions",
  },
  publisher: {
    "@type": "Organization",
    name: "SGliving",
    url: SITE_URL,
  },
};

export default function FoodDealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      {children}
    </>
  );
}
