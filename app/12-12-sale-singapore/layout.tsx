import type { Metadata } from "next";
import { pageMeta, SITE_URL } from "@/lib/seo";

// Evergreen URL: keep it every year (only the year in the copy changes) so it builds authority.
export const metadata: Metadata = pageMeta({
  path: "/12-12-sale-singapore",
  title: "12.12 Sale Singapore 2026 (Updated Daily)",
  description:
    "12.12 sale 2026 deals in Singapore on electronics, groceries, food and flights, plus Shopee and Lazada tips. Collected and updated daily.",
  socialTitle: "12.12 Sale Singapore 2026 — SGliving",
});

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "12.12 Sale Singapore", item: `${SITE_URL}/12-12-sale-singapore` },
  ],
};

export default function TwelveTwelveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
