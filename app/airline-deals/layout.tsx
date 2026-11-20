import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = pageMeta({
  path: "/airline-deals",
  title: "Cheap Flights from Singapore: Airline Deals Today",
  description: "Flash sales and promo fares from Singapore Changi — Scoot, Singapore Airlines, AirAsia, Jetstar and more, with prices in SGD. Updated nightly.",
});

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


export default function AirlineDealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
