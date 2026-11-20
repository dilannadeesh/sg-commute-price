import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";

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
    default: "SGliving: Singapore Deals Today, Malls, Hotels & COE",
    template: "%s | SGliving",
  },
  description:
    "Today's best Singapore deals — food 1-for-1s, supermarket promos, electronics sales and cheap flights from Changi — plus mall, hotel and COE guides.",
  authors:   [{ name: "SGliving", url: SITE_URL }],
  creator:   "SGliving",
  publisher: "SGliving",
  openGraph: {
    type:     "website",
    locale:   "en_SG",
    siteName: "SGliving",
  },
  twitter: { card: "summary_large_image" },
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
  category: "shopping",
  applicationName: "SGliving",
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
  // Search Console / Bing Webmaster verification — set these env vars in Vercel
  // (Project → Settings → Environment Variables) and redeploy; no code change needed.
  other: {
    "geo.region": "SG",
    "geo.placename": "Singapore",
    "geo.position": "1.3521;103.8198",
    ICBM: "1.3521, 103.8198",
    ...(ADSENSE_CLIENT ? { "google-adsense-account": ADSENSE_CLIENT } : {}),
  },
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
  areaServed: { "@type": "Country", name: "Singapore" },
  address: { "@type": "PostalAddress", addressCountry: "SG" },
  knowsAbout: ["Singapore deals", "Singapore shopping malls", "Singapore hotels", "COE prices", "Singapore public transport"],
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
      </head>
      <body className={inter.variable}>
        {children}
        <SiteFooter />

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
