import Link from "next/link";
import NavBar from "@/components/NavBar";
import DealCard from "@/components/DealCard";
import AirlineDealCard from "@/components/AirlineDealCard";
import SeoBlock from "@/components/seo/SeoBlock";
import { SITE_URL } from "@/lib/seo";
import { getElectronicsDeals, getSupermarketDeals, getFoodDeals, getAirlineDeals } from "@/lib/dealsData";
import { SALE_EVENTS, buildSection, saleStatus, type SaleKey, type SaleSection, type SaleSectionKey } from "@/lib/saleEvents";
import type { Deal, AirlineDeal } from "@/lib/types";

const ORDER: SaleSectionKey[] = ["electronics", "supermarket", "food", "flights"];

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Singapore" });
}

/** Server-rendered seasonal sale hub (Black Friday, 12.12, …) so Google sees every deal in the HTML. */
export default async function SaleEventPage({ eventKey }: { eventKey: SaleKey }) {
  const ev = SALE_EVENTS[eventKey];
  const [electronics, supermarket, food, airline] = await Promise.all([
    getElectronicsDeals(), getSupermarketDeals(), getFoodDeals(), getAirlineDeals(),
  ]);

  const sections: Record<SaleSectionKey, SaleSection<Deal> | SaleSection<AirlineDeal>> = {
    electronics: buildSection<Deal>(ev, "electronics", electronics.deals),
    supermarket: buildSection<Deal>(ev, "supermarket", supermarket.deals),
    food:        buildSection<Deal>(ev, "food", food.deals),
    flights:     buildSection<AirlineDeal>(ev, "flights", airline.deals),
  };

  const totalMatched = ORDER.reduce((n, k) => n + sections[k].matched.length, 0);
  const updatedAt = [electronics, supermarket, food, airline]
    .map(p => p.updatedAt).filter(Boolean).sort().at(-1) ?? new Date().toISOString();

  // CollectionPage + ItemList of the matched posts (outbound links to the original promotions).
  const matchedAll = ORDER.flatMap(k => sections[k].matched as (Deal | AirlineDeal)[]).slice(0, 30);
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: ev.h1,
    description: `${ev.name} ${ev.year} promotions in Singapore across electronics, supermarkets, food and flights, collected daily.`,
    url: `${SITE_URL}${ev.path}`,
    inLanguage: "en-SG",
    dateModified: updatedAt,
    about: { "@type": "Thing", name: `${ev.name} sales in Singapore` },
    publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL },
    ...(matchedAll.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: matchedAll.length,
            itemListElement: matchedAll.map((d, i) => ({
              "@type": "ListItem", position: i + 1, name: d.excerpt.slice(0, 110), url: d.moreInfoUrl,
            })),
          },
        }
      : {}),
  };

  return (
    <div className="cpc-app">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <NavBar />

      <div className="deals-page">
        <header className="deals-hero">
          <nav className="lx-crumbs bf-crumbs" aria-label="Breadcrumb">
            <Link href="/">SGliving</Link><span className="lx-crumb-sep">›</span><span>{ev.breadcrumb}</span>
          </nav>
          <div className="cpc-hero-eyebrow">{saleStatus(ev)}</div>
          <h1 className="cpc-hero-title" style={{ fontSize: 32 }}>{ev.h1}</h1>
          <p className="cpc-hero-sub" style={{ maxWidth: 600, margin: "8px auto 0" }}>{ev.intro}</p>

          <ul className="bf-dates" aria-label="Key sale dates">
            {ev.keyDates.map(d => (
              <li key={d.label}><strong>{d.label}</strong><span>{d.date}</span></li>
            ))}
          </ul>

          <nav className="deals-tags-row" aria-label="Jump to a category">
            {ORDER.map(k => (
              <a key={k} href={`#${k}`} className="deals-filter-chip">
                {sections[k].title.replace(`${ev.name} `, "").replace(" from Singapore", "")}
                {sections[k].matched.length ? ` (${sections[k].matched.length})` : ""}
              </a>
            ))}
            {ev.sibling && <Link href={ev.sibling.href} className="deals-filter-chip">{ev.sibling.label}</Link>}
          </nav>
        </header>

        <div className="deals-content">
          <div className="deals-meta-row">
            <span className="t-caption-sm">
              {totalMatched > 0
                ? `${totalMatched} ${ev.name} deal${totalMatched === 1 ? "" : "s"} found`
                : `No ${ev.name} posts yet. Showing the latest deals in each category`}
            </span>
            <span className="t-caption-sm">Updated {fmt(updatedAt)}</span>
          </div>

          {ORDER.map(k => <Section key={k} saleName={ev.name} section={sections[k]} />)}
        </div>
      </div>

      <SeoBlock page={ev.seo} />
    </div>
  );
}

function Section({ saleName, section }: { saleName: string; section: SaleSection<Deal> | SaleSection<AirlineDeal> }) {
  const { key, title, sub, href, hrefLabel, matched, fallback } = section;
  const list = (matched.length ? matched : fallback) as (Deal | AirlineDeal)[];
  const category = key === "flights" ? undefined : key;
  return (
    <section id={key} className="bf-section" aria-labelledby={`sale-${key}`}>
      <div className="lx-region-head">
        <h2 id={`sale-${key}`} className="lx-region-title">{title}</h2>
        <p className="lx-region-sub">
          {matched.length
            ? sub
            : `No ${saleName} posts in this category yet. These are the latest deals, and this list updates nightly.`}
        </p>
      </div>
      {list.length > 0 ? (
        <div className="deals-grid">
          {list.map(d =>
            key === "flights"
              ? <AirlineDealCard key={d.id} deal={d as AirlineDeal} />
              : <DealCard key={d.id} deal={d as Deal} category={category} />,
          )}
        </div>
      ) : (
        <p className="lx-region-sub">No deals right now. Check back tonight.</p>
      )}
      <p className="bf-more"><Link href={href}>{hrefLabel} →</Link></p>
    </section>
  );
}
