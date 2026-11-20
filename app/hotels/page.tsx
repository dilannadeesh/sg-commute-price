import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import { pageMeta } from "@/lib/seo";
import { HotelCard, JsonLd, Breadcrumbs, Stars } from "@/components/lifestyle/Cards";
import { TIERS, loadAllHotels, tierAverage } from "@/lib/hotels";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";
export const revalidate = 604800;

export const metadata: Metadata = pageMeta({
  path: "/hotels",
  title: "Singapore Hotels by Price: Budget to 5-Star",
  description: "Typical nightly rates for Singapore hotels from budget capsules to Marina Bay Sands and Raffles, with the nearest MRT and how to get there.",
});

const sgd = (n: number) => `S$${n.toLocaleString("en-SG")}`;

export default async function HotelsPage() {
  const hotels = await loadAllHotels();
  const itemList = {
    "@context": "https://schema.org", "@type": "ItemList", name: "Hotels in Singapore",
    itemListElement: hotels.map((h, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/hotels/${h.slug}`, name: h.name })),
  };
  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={itemList} />
      <div className="deals-page">
        <header className="deals-hero">
          <div className="cpc-hero-eyebrow">Refreshed weekly · {hotels.length} hotels from budget to luxury</div>
          <h1 className="cpc-hero-title" style={{ fontSize: 32 }}>Singapore Hotels by Price</h1>
          <p className="cpc-hero-sub" style={{ maxWidth: 560, margin: "8px auto 0" }}>
            Typical nightly prices by category, plus the nearest MRT and how to get there.
          </p>
          <div className="lx-tier-grid">
            {[...TIERS].reverse().map(t => (
              <a key={t.id} href={`#${t.id}`} className="lx-tier-card">
                <Stars n={t.stars} />
                <span className="lx-tier-label">{t.label}</span>
                <span className="lx-tier-avg">avg ~{sgd(tierAverage(t.id))}<small>/night</small></span>
              </a>
            ))}
          </div>
        </header>
        <div className="deals-content">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Hotels" }]} />
          {TIERS.map(t => {
            const list = hotels.filter(h => h.tier === t.id).sort((a, b) => a.priceFrom - b.priceFrom);
            return (
              <section key={t.id} id={t.id} className="lx-region">
                <div className="lx-region-head">
                  <h2 className="lx-region-title">{t.label} {t.stars ? <Stars n={t.stars} /> : null}</h2>
                  <p className="lx-region-sub">{t.blurb} Average ~{sgd(tierAverage(t.id))} per night.</p>
                </div>
                <div className="deals-grid">{list.map(h => <HotelCard key={h.slug} hotel={h} />)}</div>
              </section>
            );
          })}
          <p className="lx-footnote">
            Prices are typical nightly rates for a standard double room before taxes, based on recent published rates — not live quotes.
            Rates swing a lot with dates and events (F1 weekend, big concerts), so always check the hotel or a booking site for your dates.
            Hotel photos are from Wikipedia / Wikimedia Commons where available.
          </p>
        </div>
      </div>
    </div>
  );
}
