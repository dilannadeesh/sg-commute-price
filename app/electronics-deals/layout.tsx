import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = {
  title: "Singapore Electronics Deals Today — Harvey Norman, Courts, Best Denki & More",
  description:
    "Find the best Singapore electronics deals today — phones, laptops, TVs, headphones and gadgets on sale at Harvey Norman, Courts, Best Denki, Challenger and Gain City. Updated nightly. Free, no sign-up needed.",
  keywords: [
    "Singapore electronics deals today",
    "Harvey Norman Singapore promotions",
    "Courts Singapore sale",
    "Best Denki Singapore deals",
    "Challenger Singapore promotions",
    "Gain City Singapore deals",
    "Singapore phone deals today",
    "Singapore laptop deals",
    "Singapore TV deals",
    "Singapore headphones deals",
    "iPhone sale Singapore",
    "Samsung TV sale Singapore",
    "Sony Singapore deals",
    "Apple deals Singapore",
    "Singapore tech deals 2026",
    "gaming laptop Singapore sale",
    "PS5 Singapore deals",
    "Nintendo Switch deals Singapore",
    "Dyson Singapore sale",
    "Singapore electronics promotion",
    "tablet deals Singapore",
    "camera deals Singapore",
    "Singapore gadget deals",
    "Best Denki weekly sale Singapore",
    "Harvey Norman weekend sale Singapore",
    "Challenger tech promo Singapore",
    "Gain City electronics deals",
    "Singapore gadget promotion",
  ],
  openGraph: {
    type:     "website",
    locale:   "en_SG",
    url:      `${SITE_URL}/electronics-deals`,
    siteName: "SGliving",
    title:    "Singapore Electronics Deals Today — Harvey Norman, Courts, Best Denki & More",
    description:
      "Latest Singapore electronics promotions — phones, laptops, TVs, headphones and gaming gear from Harvey Norman, Courts, Best Denki, Challenger and Gain City. Updated nightly.",
    images: [
      {
        url:    `${SITE_URL}/og-electronics-deals.png`,
        width:  1200,
        height: 630,
        alt:    "Singapore Electronics Deals — SGliving",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Singapore Electronics Deals Today | SGliving",
    description: "Daily tech and gadget deals from Harvey Norman, Courts, Best Denki, Challenger and Gain City. Updated every night.",
    images:      [`${SITE_URL}/og-electronics-deals.png`],
  },
  alternates: { canonical: `${SITE_URL}/electronics-deals` },
  robots: { index: true, follow: true },
};

/* ── Structured data ─────────────────────────────────────────────────────────── */

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Singapore Electronics Deals Today",
  description:
    "Daily aggregation of Singapore electronics promotions from Harvey Norman, Courts, Best Denki, Challenger and Gain City — phones, laptops, TVs, headphones and gaming gear.",
  url: `${SITE_URL}/electronics-deals`,
  inLanguage: "en-SG",
  about: { "@type": "Thing", name: "Singapore Electronics Promotions" },
  publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Electronics Deals", item: `${SITE_URL}/electronics-deals` },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where can I find electronics deals in Singapore today?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving's Electronics Deals page aggregates daily promotions from Harvey Norman, Courts, Best Denki, Challenger and Gain City — all in one place. Deals are updated nightly so you always see the latest phone, laptop, TV and gadget sales across Singapore.",
      },
    },
    {
      "@type": "Question",
      name: "Which Singapore electronics store has the best deals?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Harvey Norman and Courts regularly run weekend sales with large discounts on TVs and appliances. Best Denki and Challenger are strong for audio, laptops and mobile devices. Gain City is competitive on home appliances and car accessories. SGliving shows deals from all of them so you can compare and find the best price.",
      },
    },
    {
      "@type": "Question",
      name: "How can I find the cheapest iPhone or Samsung price in Singapore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving's Electronics Deals page tracks current iPhone and Samsung promotions across Harvey Norman, Courts, Best Denki, Challenger and Gain City. Filter by the #iphone or #samsung tag to see the latest deals from all stores at once.",
      },
    },
  ],
};

export default function ElectronicsDealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
