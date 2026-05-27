import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = {
  title: "Singapore Airline Deals — Cheap Flights from Singapore",
  description:
    "Find the best Singapore airline deals — cheap flights, flash sales and promo fares departing from Changi Airport. Scoot, AirAsia, Jetstar, Singapore Airlines, Cathay and more. Deals updated daily, only Singapore departure routes.",
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
    "flight deals Singapore 2025",
    "SQ promo fare",
    "Scoot free seats",
    "Singapore budget airline deals",
    "best flight deals Singapore",
  ],
  openGraph: {
    type:   "website",
    locale: "en_SG",
    url:    `${SITE_URL}/airline-deals`,
    title:  "Singapore Airline Deals — Cheap Flights from Changi",
    description:
      "Daily cheap flight deals departing from Singapore — Scoot, AirAsia, Jetstar, SIA and more. Updated every night.",
    images: [{ url: "/og-airline-deals.png", width: 1200, height: 630, alt: "Singapore Airline Deals — SGliving" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Singapore Airline Deals | SGliving",
    description: "Daily cheap flights from Singapore — flash sales, promo fares and free seat offers.",
    images:      ["/og-airline-deals.png"],
  },
  alternates: { canonical: "/airline-deals" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Singapore Airline Deals",
  description: "Daily aggregation of cheap flight deals departing from Singapore Changi Airport.",
  url: `${SITE_URL}/airline-deals`,
  inLanguage: "en-SG",
  about: { "@type": "Thing", name: "Cheap Flights from Singapore" },
  publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL },
};

export default function AirlineDealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
