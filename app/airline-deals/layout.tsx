import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = {
  title: "Singapore Airline Deals — Cheap Flights from Changi Airport 2025",
  description:
    "Best Singapore airline deals today — flash sales, cheap flights and promo fares from Changi Airport. Scoot, AirAsia, Jetstar, Singapore Airlines, Cathay Pacific and more. Singapore departures only, updated daily.",
  keywords: [
    "Singapore airline deals",
    "cheap flights from Singapore",
    "Singapore flight deals today",
    "Changi Airport flight deals",
    "Scoot promo Singapore",
    "AirAsia sale Singapore",
    "Jetstar sale Singapore",
    "Singapore Airlines promo fare",
    "cheap flights SIN",
    "Singapore to Bangkok cheap flight",
    "Singapore to Tokyo cheap flight",
    "Singapore to Bali cheap flight",
    "Singapore to Seoul cheap flight",
    "Singapore to Sydney cheap flight",
    "Singapore to London cheap flight",
    "Singapore to Melbourne cheap flight",
    "Singapore to Hong Kong cheap flight",
    "Singapore to Taipei cheap flight",
    "Singapore to Dubai cheap flight",
    "Singapore to Maldives cheap flight",
    "flight deals Singapore 2025",
    "SQ promo fare",
    "Scoot free seats",
    "Singapore budget airline deals",
    "best flight deals Singapore",
    "Singapore holiday deals",
    "cheap international flights Singapore",
    "SIN airport deals",
    "Changi departures deals",
    "budget flights Singapore 2025",
  ],
  openGraph: {
    type:   "website",
    locale: "en_SG",
    url:    `${SITE_URL}/airline-deals`,
    title:  "Singapore Airline Deals — Cheap Flights from Changi",
    description:
      "Daily cheap flight deals departing Singapore — Scoot, AirAsia, Jetstar, SIA and more. Flash sales & promo fares from Changi Airport.",
    siteName: "SGliving",
    images: [{ url: `${SITE_URL}/og-airline-deals.png`, width: 1200, height: 630, alt: "Singapore Airline Deals — SGliving" }],
  },
  twitter: {
    card:        "summary_large_image",
    site:        "@sgliving",
    title:       "Singapore Airline Deals | SGliving",
    description: "Daily cheap flights from Singapore — flash sales, promo fares and free seat offers from Changi Airport.",
    images:      [`${SITE_URL}/og-airline-deals.png`],
  },
  alternates: { canonical: `${SITE_URL}/airline-deals` },
  robots: { index: true, follow: true },
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Singapore Airline Deals",
  description: "Daily aggregation of cheap flight deals departing from Singapore Changi Airport. Scoot, AirAsia, Jetstar, Singapore Airlines and more.",
  url: `${SITE_URL}/airline-deals`,
  inLanguage: "en-SG",
  about: { "@type": "Thing", name: "Cheap Flights from Singapore" },
  publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Airline Deals", item: `${SITE_URL}/airline-deals` },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where do Singapore airline deals come from?",
      acceptedAnswer: { "@type": "Answer", text: "Deals are sourced from Singapore-based travel deal communities and airline announcement channels. Only flights departing from Singapore Changi Airport (SIN) are shown." },
    },
    {
      "@type": "Question",
      name: "Which airlines offer cheap flights from Singapore?",
      acceptedAnswer: { "@type": "Answer", text: "Budget carriers like Scoot, AirAsia and Jetstar frequently run promotions. Full-service airlines like Singapore Airlines, Cathay Pacific, Emirates and Malaysia Airlines also post promo fares." },
    },
    {
      "@type": "Question",
      name: "How often are Singapore flight deals updated?",
      acceptedAnswer: { "@type": "Answer", text: "Deals are refreshed every night and deals older than 30 days are automatically removed, so you always see current promotions." },
    },
  ],
};

export default function AirlineDealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
