import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = pageMeta({
  path: "/weekend",
  title: "Things to Do in Singapore This Weekend",
  description: "Weekend events, activities and deals in Singapore — nature trails, beaches, family days out, arts and sports. Updated nightly so you can plan ahead.",
});

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Singapore Weekend Activities & Events",
  description:
    "Daily aggregation of Singapore weekend activities, events and deals sourced from @sgweekend on Telegram.",
  url: `${SITE_URL}/weekend`,
  inLanguage: "en-SG",
  about: { "@type": "Thing", name: "Singapore Weekend Activities" },
  publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Weekend Activities", item: `${SITE_URL}/weekend` },
  ],
};


export default function WeekendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
