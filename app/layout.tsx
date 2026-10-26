import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SGliving — Singapore Deals Hub: Food, Supermarket, Electronics & Flights",
    template: "%s | SGliving",
  },
  description:
    "SGliving is Singapore's daily deals hub. Browse today's best food deals, supermarket promotions, electronics sales and cheap flights from Changi — all in one place. NTUC FairPrice, Cold Storage, Harvey Norman, Scoot, SIA and more. Free, updated every night.",
  keywords: [
    // Deals hub — primary
    "Singapore deals today",
    "Singapore deals hub",
    "Singapore promotions today",
    "best deals in Singapore",
    "Singapore daily deals",
    "Singapore deals website",
    // Food deals
    "Singapore food deals today",
    "Singapore restaurant promotions",
    "1 for 1 Singapore food",
    "Singapore food promo code",
    "Singapore dining deals",
    "best food deals Singapore",
    "Singapore hawker deals",
    "Singapore bubble tea deals",
    "Singapore coffee deals",
    // Supermarket deals
    "Singapore supermarket deals today",
    "NTUC FairPrice promotions",
    "Cold Storage Singapore deals",
    "Giant supermarket Singapore promotions",
    "Sheng Siong promotions",
    "Don Don Donki Singapore deals",
    "Singapore grocery deals",
    "supermarket sale Singapore this week",
    // Electronics deals
    "Singapore electronics deals today",
    "Harvey Norman Singapore promotions",
    "Courts Singapore sale",
    "Best Denki Singapore deals",
    "Challenger Singapore promotions",
    "iPhone sale Singapore",
    "Samsung TV sale Singapore",
    "Singapore laptop deals",
    "Singapore tech deals",
    // Airline deals
    "Singapore airline deals",
    "cheap flights from Singapore",
    "Singapore flight deals today",
    "Changi Airport flight deals",
    "Scoot promo Singapore",
    "AirAsia sale Singapore",
    "Jetstar sale Singapore",
    "cheap flights SIN",
    // Commute
    "Singapore commute price",
    "Grab price Singapore",
    "Gojek price Singapore",
    "Singapore MRT fare calculator",
    "Grab vs Gojek Singapore",
    // Brand
    "SGliving",
    "sgliving.life",
  ],
  authors:   [{ name: "SGliving", url: SITE_URL }],
  creator:   "SGliving",
  publisher: "SGliving",
  openGraph: {
    type:     "website",
    locale:   "en_SG",
    url:      SITE_URL,
    siteName: "SGliving",
    title:    "SGliving — Singapore Deals Hub: Food, Supermarket, Electronics & Flights",
    description:
      "Singapore's daily deals hub — food promos, supermarket sales, electronics discounts and cheap flights from Changi, all aggregated and updated every night. Free.",
    images: [
      {
        url:    `${SITE_URL}/og-image.png`,
        width:  1200,
        height: 630,
        alt:    "SGliving — Singapore Daily Deals Hub",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "SGliving — Singapore Deals Hub",
    description: "Food deals, supermarket promos, electronics sales and cheap flights from Singapore — aggregated daily. Free.",
    images:      [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
  alternates: { canonical: SITE_URL },
  category: "shopping",
  verification: {
    // Add Google Search Console verification token here when available:
    // google: "your-verification-token",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SGliving",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/og-image.png`,
    width: 1200,
    height: 630,
  },
  description:
    "SGliving is Singapore's daily deals hub — food promotions, supermarket sales, electronics deals and cheap flights from Changi, aggregated every night. Free.",
  sameAs: [
    "https://t.me/sgfooddeals",
    "https://t.me/sgairlinedeals",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SGliving",
  url: SITE_URL,
  description:
    "Singapore's daily deals hub — food, supermarket, electronics and airline deals, updated every night.",
  inLanguage: "en-SG",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/food-deals?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SGliving",
  url: SITE_URL,
  description:
    "Singapore's daily deals hub — food deals, supermarket promotions, electronics sales and cheap flights, plus commute price comparison.",
  applicationCategory: "ShoppingApplication",
  operatingSystem: "Web",
  inLanguage: "en-SG",
  offers: { "@type": "Offer", price: "0", priceCurrency: "SGD" },
  featureList: [
    "Daily Singapore food deals and restaurant promotions — 1-for-1 offers, promo codes",
    "Singapore supermarket deals — NTUC FairPrice, Cold Storage, Giant, Sheng Siong, Don Don Donki",
    "Singapore electronics deals — Harvey Norman, Courts, Best Denki, Challenger, Gain City",
    "Singapore airline deals — cheap flights from Changi, Scoot, AirAsia, Jetstar, SIA",
    "Singapore commute price comparison — Grab, TADA, Gojek, Flexar, GetGo, MRT/bus",
    "Deals updated nightly via automated aggregation",
    "Search and filter by category, store, tag or keyword",
  ],
  keywords:
    "Singapore deals, Singapore food deals, supermarket deals Singapore, electronics deals Singapore, cheap flights Singapore, Grab price Singapore",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is SGliving?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving is a free Singapore deals hub that aggregates daily food deals, supermarket promotions, electronics sales and cheap flights from Changi Airport — all updated automatically every night. You can also compare commute prices across Grab, TADA, Gojek, Flexar, GetGo and public transport.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I find the best deals in Singapore today?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving aggregates Singapore deals across four categories: Food Deals (restaurant promos, 1-for-1s), Supermarket Deals (NTUC FairPrice, Cold Storage, Giant, Sheng Siong), Electronics Deals (Harvey Norman, Courts, Best Denki) and Airline Deals (cheap flights from Changi). Everything is updated nightly and completely free.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I find Singapore food deals today?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving's Food Deals page aggregates the latest Singapore restaurant promotions, 1-for-1 offers and discount codes — updated daily and searchable by cuisine or category.",
      },
    },
    {
      "@type": "Question",
      name: "Which supermarkets have promotions in Singapore this week?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving's Supermarket Deals page tracks weekly sales and promotions from NTUC FairPrice, Cold Storage, Giant, Sheng Siong, Don Don Donki and Guardian — updated every night.",
      },
    },
    {
      "@type": "Question",
      name: "How can I find cheap flights from Singapore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving's Airline Deals page shows current flash sales and promo fares departing from Singapore Changi Airport — Scoot, AirAsia, Jetstar, Singapore Airlines and more, updated daily.",
      },
    },
    {
      "@type": "Question",
      name: "How much does Grab cost in Singapore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Grab in Singapore starts at around S$3.40 base fare, with S$0.85 per km and S$0.22 per minute. Peak-hour surge can add 1.3× to 1.5× to the fare. Use SGliving's commute comparison to compare Grab against TADA, Gojek and public transport for your route.",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-SG">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </head>
      <body className={inter.variable}>
        {children}

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-C4SKPLHG5V" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C4SKPLHG5V');
          `}
        </Script>
      </body>
    </html>
  );
}
