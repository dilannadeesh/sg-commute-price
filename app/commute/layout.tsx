import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = {
  title: "Singapore Commute Price Comparison — Grab vs Gojek vs TADA vs MRT",
  description:
    "Compare Singapore commute prices for your route — Grab, TADA, Gojek, Flexar car sharing, GetGo car rental and MRT/bus side by side, in Singapore dollars with peak-hour surge included. Free and instant.",
  keywords: [
    "Singapore commute price",
    "Singapore commute cost calculator",
    "Grab price Singapore",
    "Gojek price Singapore",
    "TADA price Singapore",
    "Grab vs Gojek Singapore",
    "Grab vs TADA",
    "cheapest ride Singapore",
    "Singapore taxi fare calculator",
    "Singapore MRT fare calculator",
    "Flexar car sharing price",
    "GetGo car rental price",
    "Singapore journey planner",
  ],
  openGraph: {
    type:     "website",
    locale:   "en_SG",
    url:      `${SITE_URL}/commute`,
    siteName: "SGliving",
    title:    "Singapore Commute Price Comparison — Grab vs Gojek vs TADA vs MRT",
    description:
      "Find the cheapest way to get around Singapore — compare Grab, TADA, Gojek, Flexar, GetGo and MRT/bus prices for your route.",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Singapore Commute Price Comparison | SGliving",
    description: "Grab vs Gojek vs TADA vs MRT — compare Singapore ride prices for your route, surge included.",
  },
  alternates: { canonical: `${SITE_URL}/commute` },
  robots: { index: true, follow: true },
};

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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which ride-hailing app is cheapest in Singapore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your route and the time of day — surge pricing changes which app is cheapest. SGliving's commute comparison estimates Grab, TADA and Gojek fares side by side for your exact trip, alongside MRT/bus, so you can pick the cheapest option.",
      },
    },
    {
      "@type": "Question",
      name: "Does the comparison include peak-hour surge pricing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Estimates factor in peak-hour surge for ride-hailing apps, so morning and evening rush-hour fares reflect what you are likely to pay.",
      },
    },
    {
      "@type": "Question",
      name: "Can I compare car sharing and car rental too?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The comparison includes Flexar car sharing (with walking time to the nearest station) and GetGo car rental (with round-trip cost), next to ride-hailing and public transport.",
      },
    },
  ],
};

export default function CommuteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
