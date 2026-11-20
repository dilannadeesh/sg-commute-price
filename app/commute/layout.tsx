import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import SeoBlock from "@/components/seo/SeoBlock";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = pageMeta({
  path: "/commute",
  title: "Grab vs Gojek vs TADA vs MRT: Singapore Fare Checker",
  description: "Compare Singapore ride prices for your route — Grab, Gojek, TADA, Flexar, GetGo and MRT/bus side by side in SGD, with peak-hour surge included.",
});

/* ── Structured data ─────────────────────────────────────────────────────────── */

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SGliving Commute Price Comparison",
  url: `${SITE_URL}/commute`,
  description:
    "Compare Singapore commute prices across Grab, TADA, Gojek, Flexar car sharing, GetGo car rental and MRT/bus for any route.",
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  inLanguage: "en-SG",
  offers: { "@type": "Offer", price: "0", priceCurrency: "SGD" },
  publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Commute Prices", item: `${SITE_URL}/commute` },
  ],
};


export default function CommuteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
      <SeoBlock page="commute" />
    </>
  );
}
