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
    default: "SGliving — Singapore Commute Prices, Food Deals & Journey Planner",
    template: "%s | SGliving",
  },
  description:
    "SGliving is your all-in-one Singapore lifestyle tool. Compare Grab, TADA, Gojek, Flexar car sharing, GetGo car rental and MRT/bus fares in seconds — then discover the best food deals, restaurant promos and 1-for-1 offers across Singapore. Free, updated daily.",
  keywords: [
    // Commute & journey planner
    "Singapore commute price",
    "Singapore journey planner",
    "Singapore transport price comparison",
    "cheapest way to travel Singapore",
    "Singapore taxi price",
    "Singapore taxi fare calculator",
    "how much is Grab in Singapore",
    "Grab price Singapore",
    "Gojek price Singapore",
    "TADA Singapore price",
    "Grab vs Gojek Singapore",
    "Grab vs TADA Singapore",
    "private hire car Singapore",
    "ride hailing Singapore comparison",
    "Singapore ride hailing price",
    // Public transport
    "Singapore MRT fare calculator",
    "Singapore bus fare",
    "Singapore public transport cost",
    "MRT price Singapore",
    // Car sharing
    "Flexar car sharing Singapore",
    "Flexar station Singapore",
    "GetGo car rental Singapore",
    "GetGo hourly rental Singapore",
    "car sharing Singapore",
    // Peak hour
    "Singapore peak hour surge pricing",
    "Grab surge pricing Singapore",
    // Food deals
    "Singapore food deals",
    "Singapore food deals today",
    "Singapore restaurant promotions",
    "1 for 1 Singapore food",
    "Singapore food promo code",
    "Singapore dining deals",
    "best food deals Singapore",
    "Singapore hawker deals",
    "Singapore bubble tea deals",
    // Brand
    "SGliving",
    "sgliving.life",
  ],
  authors:  [{ name: "SGliving", url: SITE_URL }],
  creator:  "SGliving",
  publisher: "SGliving",
  openGraph: {
    type:     "website",
    locale:   "en_SG",
    url:      SITE_URL,
    siteName: "SGliving",
    title:    "SGliving — Singapore Commute Prices, Food Deals & Journey Planner",
    description:
      "Compare Grab, TADA, Gojek, Flexar, GetGo and MRT fares in one click — plus daily Singapore food deals, promos and 1-for-1 restaurant offers. Free and updated every day.",
    images: [
      {
        url:    "/og-image.png",
        width:  1200,
        height: 630,
        alt:    "SGliving — Singapore Commute & Food Deals",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "SGliving — Singapore Commute Prices & Food Deals",
    description: "Compare Grab vs Gojek vs TADA vs MRT fares and find the best Singapore food deals — free, updated daily.",
    images:      ["/og-image.png"],
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
  alternates: { canonical: "/" },
  category: "travel",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SGliving",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  description: "Free Singapore lifestyle tools — commute price comparison, journey planner and daily food deals.",
  sameAs: ["https://t.me/sgfooddeals"],
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SGliving",
  url: SITE_URL,
  description:
    "Compare Singapore ride-hailing, car sharing and public transport costs. Plus daily food deals and restaurant promos.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  inLanguage: "en-SG",
  offers: { "@type": "Offer", price: "0", priceCurrency: "SGD" },
  featureList: [
    "Singapore commute price comparison — Grab, TADA, Gojek, Flexar, GetGo, MRT/bus",
    "Real-time peak-hour surge pricing",
    "Flexar station-to-station car sharing with walk time",
    "GetGo hourly car rental cost calculator",
    "GPS auto-detect current location as journey start",
    "Daily Singapore food deals and restaurant promotions",
    "1-for-1 offers and promo code listings from Telegram",
  ],
  keywords:
    "Singapore taxi price, Grab price, Gojek, TADA, Flexar, GetGo, MRT fare, commute comparison, food deals Singapore",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does Grab cost in Singapore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Grab in Singapore starts at around S$3.40 base fare, with S$0.85 per km and S$0.22 per minute. Peak-hour surge (8–10 am and 6–8 pm) can add 1.3× to 1.5× to the fare. Use SGliving to compare Grab against TADA, Gojek and public transport for your specific route.",
      },
    },
    {
      "@type": "Question",
      name: "What is the cheapest way to travel across Singapore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MRT and bus (public transport) is almost always cheapest, capped at S$2.49 per trip. For door-to-door travel, TADA and Gojek are typically cheaper than Grab outside peak hours. Flexar car sharing is cost-effective for Northeast Singapore routes. Compare all options free at SGliving.",
      },
    },
    {
      "@type": "Question",
      name: "What is Flexar car sharing in Singapore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Flexar is a station-to-station car sharing service operating in Northeast Singapore towns including Punggol, Sengkang, Hougang, Ang Mo Kio, Tampines and Bishan. You pick up a car at a nearby station and drop it at a station near your destination. SGliving shows the nearest Flexar station to your location and the walking time.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I find Singapore food deals today?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving's Food Deals page aggregates the latest Singapore restaurant promotions, 1-for-1 offers and discount codes from @sgfooddeals on Telegram — updated daily and searchable by cuisine or category.",
      },
    },
    {
      "@type": "Question",
      name: "How does GetGo car rental pricing work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GetGo charges by the hour with a base fee plus per-km and per-minute rates. It is a round-trip rental — you must return the car to the same pod you picked it up from. SGliving calculates the full round-trip cost including your stopover time at the destination.",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-SG">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
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
