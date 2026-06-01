import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = {
  title: "Singapore Weekend Activities & Events — Things To Do This Weekend",
  description:
    "Discover the best Singapore weekend activities, events and deals — outdoor adventures, family activities, arts & culture, sports and more. Updated daily from @sgweekend. Free, no sign-up needed.",
  keywords: [
    "Singapore weekend activities",
    "things to do in Singapore this weekend",
    "Singapore weekend events 2025",
    "Singapore outdoor activities",
    "Singapore family activities weekend",
    "Singapore events this weekend",
    "free things to do Singapore",
    "Singapore kids activities weekend",
    "Singapore hiking trails",
    "Singapore beach activities",
    "Singapore museum free entry",
    "Singapore arts events",
    "Singapore sports activities",
    "Singapore weekend deals",
    "Singapore weekend promo",
    "sg weekend go",
    "sgweekend",
    "Singapore weekend guide",
    "what to do in Singapore weekend",
    "Singapore activities today",
  ],
  openGraph: {
    type:     "website",
    locale:   "en_SG",
    url:      `${SITE_URL}/weekend`,
    title:    "Singapore Weekend Activities & Events — SGliving",
    description:
      "The best Singapore weekend activities, events and deals — outdoor, family, arts, sports and more. Updated daily.",
    siteName: "SGliving",
    images: [{ url: `${SITE_URL}/og-weekend.png`, width: 1200, height: 630, alt: "Singapore Weekend Activities — SGliving" }],
  },
  twitter: {
    card:        "summary_large_image",
    site:        "@sgliving",
    title:       "Singapore Weekend Activities & Events | SGliving",
    description: "Discover the best things to do in Singapore this weekend — deals, events, outdoor and family activities.",
    images:      [`${SITE_URL}/og-weekend.png`],
  },
  alternates: { canonical: `${SITE_URL}/weekend` },
  robots: { index: true, follow: true },
};

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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where do Singapore weekend activity listings come from?",
      acceptedAnswer: { "@type": "Answer", text: "Listings are sourced from @sgweekend on Telegram — a community channel sharing Singapore weekend deals, events and activities. Only posts with a direct booking or info link are shown." },
    },
    {
      "@type": "Question",
      name: "How often are weekend activity listings updated?",
      acceptedAnswer: { "@type": "Answer", text: "Listings are refreshed automatically every night at 11:59 PM SGT and cover the past 2 months so you never miss a deal." },
    },
    {
      "@type": "Question",
      name: "What kinds of activities are listed?",
      acceptedAnswer: { "@type": "Answer", text: "Outdoor adventures, hiking trails, beach activities, family events, museum visits, arts & culture, sports sessions, and promotional deals for Singapore weekend activities." },
    },
  ],
};

export default function WeekendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
