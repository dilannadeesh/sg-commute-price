import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = {
  title: "Singapore Food Deals Today — Promos, 1-for-1 & Restaurant Offers",
  description:
    "Browse today's best Singapore food deals — 1-for-1 offers, restaurant promotions, discount codes and hawker specials. Sourced daily from @sgfooddeals. Search by cuisine, filter by category and click through to redeem. Free, no sign-up needed.",
  keywords: [
    "Singapore food deals today",
    "Singapore food promotions 2026",
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
    siteName: "SGliving",
    title:  "Singapore Food Deals Today — Promos, 1-for-1 & Restaurant Offers",
    description:
      "The freshest Singapore food promos, 1-for-1s and discount codes — aggregated daily from Telegram. Search, filter and click to redeem.",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Singapore Food Deals Today | SGliving",
    description: "Daily Singapore restaurant promos, 1-for-1 offers and promo codes — updated every day.",
  },
  alternates: { canonical: `${SITE_URL}/food-deals` },
  robots: { index: true, follow: true },
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

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Food Deals", item: `${SITE_URL}/food-deals` },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where do the Singapore food deals come from?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Deals are aggregated from @sgfooddeals on Telegram, a Singapore community channel that shares restaurant promotions, 1-for-1 offers and discount codes. SGliving collects them into one searchable page.",
      },
    },
    {
      "@type": "Question",
      name: "How often are food deals updated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Food Deals page refreshes automatically every night, so you always see the latest Singapore food promotions.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need an account to use the food deals?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. SGliving is free with no sign-up — search by cuisine, filter by category and click through to the original promotion to redeem it.",
      },
    },
  ],
};

export default function FoodDealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
