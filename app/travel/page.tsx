import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import SeoBlock from "@/components/seo/SeoBlock";
import { Breadcrumbs, JsonLd } from "@/components/lifestyle/Cards";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { PROVIDERS } from "@/lib/travel/providers";
import TravelPlanner from "./TravelPlanner";
import { OffersStrip } from "@/components/travel/Offers";
import { sgToday } from "@/lib/travel/offers";

export const revalidate = 86400;

export const metadata: Metadata = pageMeta({
  path: "/travel",
  title: "Travelling in Singapore: MRT Route & Grab, Gojek Fares",
  description: "Plan any trip in Singapore: search your start point or use your location, pick a destination and time, and compare the best MRT/bus route and fare with Grab, Gojek, GetGo and Flexar prices.",
});

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SGliving Travelling in Singapore planner",
  url: `${SITE_URL}/travel`,
  description: "Singapore journey planner comparing the best public transport route and fare with estimated Grab, Gojek, GetGo and Flexar prices.",
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  inLanguage: "en-SG",
  areaServed: { "@type": "Country", name: "Singapore" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "SGD" },
  publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL },
};

const crumbsJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Travelling in Singapore", item: `${SITE_URL}/travel` },
  ],
};

const listJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Transport providers in Singapore",
  itemListElement: PROVIDERS.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.h1, url: `${SITE_URL}/travel/${p.slug}` })),
};

export default function TravelPage() {
  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={appJsonLd} />
      <JsonLd data={crumbsJsonLd} />
      <JsonLd data={listJsonLd} />
      <main className="tp-page">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Travelling in Singapore" }]} />
        <header className="tp-hero">
          <h1>Travelling in Singapore</h1>
          <p>Find the best MRT and bus route for your trip with the exact fare, and see what Grab, Gojek, GetGo and Flexar would cost for the same journey.</p>
        </header>

        <TravelPlanner />

        <OffersStrip asOf={sgToday()} title="🎁 New-user deals: Grab, Gojek, GetGo & Flexar" />

        <section className="tp-providers" aria-labelledby="tp-providers-h">
          <h2 id="tp-providers-h">Know your options</h2>
          <div className="tp-provider-grid">
            {PROVIDERS.map(p => (
              <Link key={p.slug} href={`/travel/${p.slug}`} className="tp-provider-card" style={{ borderTopColor: p.color }}>
                <span className="tp-kind">{p.kind}</span>
                <strong>{p.h1}</strong>
                <span>{p.lede.split(". ")[0]}.</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SeoBlock page="travel" />
    </div>
  );
}
