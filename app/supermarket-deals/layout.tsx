import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = {
  title: "Singapore Supermarket Deals Today — NTUC, Cold Storage, Giant & More",
  description:
    "Browse today's best Singapore supermarket promotions — NTUC FairPrice, Cold Storage, Giant, Sheng Siong, Don Don Donki and Guardian. Weekly sales, member discounts, bundle deals and grocery offers. Updated daily, free, no sign-up needed.",
  keywords: [
    "Singapore supermarket deals today",
    "NTUC FairPrice promotions",
    "NTUC FairPrice weekly sale",
    "Cold Storage Singapore deals",
    "Giant supermarket Singapore promotions",
    "Sheng Siong promotions",
    "Don Don Donki Singapore deals",
    "Guardian Singapore promotions",
    "Singapore grocery deals",
    "supermarket promotions Singapore 2026",
    "supermarket sale Singapore this week",
    "Singapore supermarket weekly deals",
    "FairPrice member discount",
    "Singapore meat deals",
    "Singapore seafood promo",
    "Singapore grocery offers",
    "household essentials deals Singapore",
    "personal care deals Singapore",
    "Singapore frozen food deals",
    "supermarket voucher Singapore",
    "NTUC linkpoints promo",
    "Cold Storage fresh deals",
  ],
  openGraph: {
    type:     "website",
    locale:   "en_SG",
    url:      `${SITE_URL}/supermarket-deals`,
    siteName: "SGliving",
    title:    "Singapore Supermarket Deals Today — NTUC, Cold Storage, Giant & More",
    description:
      "Daily Singapore supermarket promotions — NTUC FairPrice, Cold Storage, Giant, Sheng Siong, Don Don Donki and Guardian. Updated every night.",
    images: [
      {
        url:    `${SITE_URL}/og-supermarket-deals.png`,
        width:  1200,
        height: 630,
        alt:    "Singapore Supermarket Deals — SGliving",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Singapore Supermarket Deals Today | SGliving",
    description: "Daily Singapore supermarket promotions — NTUC FairPrice, Cold Storage, Giant, Sheng Siong & more. Updated nightly.",
    images:      [`${SITE_URL}/og-supermarket-deals.png`],
  },
  alternates: { canonical: `${SITE_URL}/supermarket-deals` },
  robots: { index: true, follow: true },
};

/* ── Structured data ─────────────────────────────────────────────────────────── */

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Singapore Supermarket Deals Today",
  description:
    "Daily aggregation of Singapore supermarket promotions from NTUC FairPrice, Cold Storage, Giant, Sheng Siong, Don Don Donki and Guardian.",
  url: `${SITE_URL}/supermarket-deals`,
  inLanguage: "en-SG",
  about: { "@type": "Thing", name: "Singapore Supermarket Promotions" },
  publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Supermarket Deals", item: `${SITE_URL}/supermarket-deals` },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which Singapore supermarkets have the best deals?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NTUC FairPrice typically has the widest member promotions and LinkPoints deals. Cold Storage and Giant run competitive weekly specials on fresh produce and household items. Sheng Siong offers strong value on everyday groceries. Don Don Donki has frequent flash sales on Japanese and Asian imported goods. SGliving aggregates all these deals in one place so you never miss a promo.",
      },
    },
    {
      "@type": "Question",
      name: "How often are Singapore supermarket deals updated on SGliving?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Supermarket deal listings are refreshed every night automatically. New promotions from NTUC FairPrice, Cold Storage, Giant, Sheng Siong and Don Don Donki are added daily, and expired offers are removed.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I find NTUC FairPrice promotions online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving's Supermarket Deals page aggregates the latest NTUC FairPrice weekly sales, member discounts and bundle deals alongside promotions from all major Singapore supermarkets — completely free and updated nightly.",
      },
    },
  ],
};

export default function SupermarketDealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
