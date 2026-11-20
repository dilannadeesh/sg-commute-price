import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = pageMeta({
  path: "/electronics-deals",
  title: "Electronics Deals Singapore: Phones, TVs & Laptops",
  description: "Electronics sales in Singapore on phones, TVs, laptops and gaming from Harvey Norman, Courts, Best Denki and Challenger, collected nightly.",
});

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


export default function ElectronicsDealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
