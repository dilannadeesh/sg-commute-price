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
    default: "SG Commute Price — Compare Grab, TADA, Gojek, Flexar, GetGo & Public Transport",
    template: "%s | SG Commute Price",
  },
  description:
    "Free Singapore commute price calculator. Compare Grab, TADA, Gojek, Flexar, GetGo and MRT/bus fares in real-time — including peak-hour surge pricing, Flexar station walk times, and GetGo round-trip costs. Find the cheapest and fastest way to travel across Singapore.",
  keywords: [
    "Singapore taxi price",
    "Singapore ride hailing price",
    "Grab price Singapore",
    "Gojek price Singapore",
    "TADA price Singapore",
    "Grab vs Gojek Singapore",
    "Singapore public transport cost",
    "MRT bus fare calculator",
    "Singapore commute cost",
    "cheapest way to travel Singapore",
    "Flexar car sharing Singapore",
    "GetGo car rental Singapore",
    "Singapore peak hour surge pricing",
    "ride hailing comparison Singapore",
    "Singapore transport price comparison",
    "how much is Grab in Singapore",
    "Singapore taxi fare calculator",
    "private hire car price Singapore",
    "SG transport compare",
    "SGliving commute",
  ],
  authors: [{ name: "SGliving" }],
  creator: "SGliving",
  openGraph: {
    type: "website",
    locale: "en_SG",
    url: SITE_URL,
    siteName: "SG Commute Price",
    title: "SG Commute Price — Compare Grab, TADA, Gojek, Flexar, GetGo & Public Transport",
    description:
      "Free Singapore commute price calculator. Compare Grab, TADA, Gojek, Flexar, GetGo and MRT/bus fares including peak-hour surge, Flexar station walks, and GetGo round-trip costs.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SG Commute Price — Compare all Singapore transport options",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SG Commute Price — Compare Grab, TADA, Gojek & More",
    description:
      "Free Singapore commute price calculator with real surge pricing, Flexar walks, and GetGo round-trip costs.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SG Commute Price",
  url: SITE_URL,
  description:
    "Compare Singapore commute costs across Grab, TADA, Gojek, Flexar, GetGo and public transport with real-time surge pricing.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  inLanguage: "en-SG",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "SGD",
  },
  featureList: [
    "Compare Grab, TADA, Gojek ride-hail prices",
    "MRT and bus fare estimates",
    "Peak-hour surge pricing",
    "Flexar station-to-station car sharing",
    "GetGo hourly car rental",
    "Real-time GPS location detection",
  ],
  keywords:
    "Singapore taxi price, Grab price, Gojek price, TADA price, MRT fare, Singapore commute cost, ride hailing comparison",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-SG">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.variable}>
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C4SKPLHG5V"
          strategy="afterInteractive"
        />
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
