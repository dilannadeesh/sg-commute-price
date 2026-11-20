import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = pageMeta({
  path: "/food-deals",
  title: "Singapore Food Deals Today: 1-for-1 & Promo Codes",
  description: "Latest Singapore food deals, 1-for-1 offers and restaurant promo codes, updated nightly. Search by cuisine and tap through to the original promotion.",
});

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


export default function FoodDealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
