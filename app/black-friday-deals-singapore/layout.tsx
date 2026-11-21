import type { Metadata } from "next";
import { pageMeta, SITE_URL } from "@/lib/seo";

// Evergreen URL: keep it every year (only the year in the copy changes) so it builds authority.
export const metadata: Metadata = pageMeta({
  path: "/black-friday-deals-singapore",
  title: "Black Friday Deals Singapore 2026 (Updated Daily)",
  description:
    "Black Friday & Cyber Monday 2026 deals in Singapore on electronics, groceries, food and flights, collected from top retailers and updated daily.",
  socialTitle: "Black Friday Deals Singapore 2026 — SGliving",
});

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Black Friday Deals Singapore", item: `${SITE_URL}/black-friday-deals-singapore` },
  ],
};

export default function BlackFridayLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
