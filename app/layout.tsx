import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

// Google AdSense — set NEXT_PUBLIC_ADSENSE_CLIENT (e.g. "ca-pub-1234567890123456") in Vercel
// and redeploy. Until it's set, no ad code, verification tag or ads.txt line is served.
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || undefined;

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
  },
  twitter: {
    card:        "summary_large_image",
    title:       "SGliving — Singapore Deals Hub",
    description: "Food deals, supermarket promos, electronics sales and cheap flights from Singapore — aggregated daily. Free.",
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
  applicationName: "SGliving",
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
  // Search Console / Bing Webmaster verification — set these env vars in Vercel
  // (Project → Settings → Environment Variables) and redeploy; no code change needed.
  ...(ADSENSE_CLIENT ? { other: { "google-adsense-account": ADSENSE_CLIENT } } : {}),
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#ff385c",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SGliving",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
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
  publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL },
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


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-SG">
      <head>
        {ADSENSE_CLIENT && (
          // Plain <script> (not next/script) so AdSense finds an unmodified tag in <head>
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
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
