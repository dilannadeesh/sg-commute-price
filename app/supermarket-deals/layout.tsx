import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = pageMeta({
  path: "/supermarket-deals",
  title: "Supermarket Promotions in Singapore This Week",
  description: "This week’s supermarket promotions from NTUC FairPrice, Cold Storage, Giant, Sheng Siong and Don Don Donki — groceries, meat and household deals.",
});

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


export default function SupermarketDealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
