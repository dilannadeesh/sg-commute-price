import Link from "next/link";
import NavBar from "@/components/NavBar";
import DealCard from "@/components/DealCard";
import AirlineDealCard from "@/components/AirlineDealCard";
import SeoBlock from "@/components/seo/SeoBlock";
import { SITE_URL } from "@/lib/seo";
import { getElectronicsDeals, getSupermarketDeals, getFoodDeals, getAirlineDeals } from "@/lib/dealsData";
import { buildSection, bfStatus, BF_YEAR, type BfSection, type BfSectionKey } from "@/lib/blackFriday";
import type { Deal, AirlineDeal } from "@/lib/types";

// Deals are server-rendered so Google sees them in the HTML. The nightly cron refreshes the
// deal caches (tags); the 6-hour revalidate keeps the countdown line current.
export const revalidate = 21600;

const PATH = "/black-friday-deals-singapore";

const KEY_DATES = [
  { label: "Black Friday", date: "Fri 27 Nov 2026" },
  { label: "Cyber Monday", date: "Mon 30 Nov 2026" },
  { label: "12.12 sale", date: "Sat 12 Dec 2026" },
];

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Singapore" });
}

export default async function BlackFridayPage() {
  const [electronics, supermarket, food, airline] = await Promise.all([
    getElectronicsDeals(), getSupermarketDeals(), getFoodDeals(), getAirlineDeals(),
  ]);

  const sections = {
    electronics: buildSection<Deal>({
      key: "electronics", title: "Black Friday electronics deals",
      sub: "Phones, laptops, TVs, gaming and appliances from Courts, Harvey Norman, Challenger, Best Denki, Gain City and more.",
      href: "/electronics-deals", hrefLabel: "All electronics deals",
    }, electronics.deals),
    supermarket: buildSection<Deal>({
      key: "supermarket", title: "Black Friday supermarket & grocery deals",
      sub: "Promotions from NTUC FairPrice, Cold Storage, Giant, Sheng Siong, Don Don Donki and online grocers.",
      href: "/supermarket-deals", hrefLabel: "All supermarket deals",
    }, supermarket.deals),
    food: buildSection<Deal>({
      key: "food", title: "Black Friday food & dining deals",
      sub: "Restaurant promos, 1-for-1s and delivery-app codes running over the Black Friday weekend.",
      href: "/food-deals", hrefLabel: "All food deals",
    }, food.deals),
    flights: buildSection<AirlineDeal>({
      key: "flights", title: "Black Friday flight deals from Singapore",
      sub: "Flash sales and promo fares from Changi for the year-end school holidays and 2027 trips.",
      href: "/airline-deals", hrefLabel: "All airline deals",
    }, airline.deals),
  };
  const order: BfSectionKey[] = ["electronics", "supermarket", "food", "flights"];

  const totalMatched = order.reduce((n, k) => n + sections[k].matched.length, 0);
  const updatedAt = [electronics, supermarket, food, airline]
    .map(p => p.updatedAt).filter(Boolean).sort().at(-1) ?? new Date().toISOString();

  // CollectionPage + ItemList of the Black Friday posts (outbound links to the original promotions).
  const matchedAll = order.flatMap(k => sections[k].matched as (Deal | AirlineDeal)[]).slice(0, 30);
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Black Friday Deals Singapore ${BF_YEAR}`,
    description: `Black Friday and Cyber Monday ${BF_YEAR} promotions in Singapore across electronics, supermarkets, food and flights, collected daily.`,
    url: `${SITE_URL}${PATH}`,
    inLanguage: "en-SG",
    dateModified: updatedAt,
    about: { "@type": "Thing", name: "Black Friday sales in Singapore" },
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
            <Link href="/">SGliving</Link><span className="lx-crumb-sep">›</span><span>Black Friday Deals</span>
          </nav>
          <div className="cpc-hero-eyebrow">{bfStatus()}</div>
          <h1 className="cpc-hero-title" style={{ fontSize: 32 }}>
            Black Friday Deals Singapore {BF_YEAR}
          </h1>
          <p className="cpc-hero-sub" style={{ maxWidth: 600, margin: "8px auto 0" }}>
            Every Black Friday and Cyber Monday promotion we can find in Singapore, in one list: electronics,
            supermarkets, food and flights. Collected from public deal channels and refreshed every night.
          </p>

          <ul className="bf-dates" aria-label="Key sale dates">
            {KEY_DATES.map(d => (
              <li key={d.label}><strong>{d.label}</strong><span>{d.date}</span></li>
            ))}
          </ul>

          <nav className="deals-tags-row" aria-label="Jump to a category">
            {order.map(k => (
              <a key={k} href={`#${k}`} className="deals-filter-chip">
                {sections[k].title.replace("Black Friday ", "").replace(" from Singapore", "")}
                {sections[k].matched.length ? ` (${sections[k].matched.length})` : ""}
              </a>
            ))}
          </nav>
        </header>

        <div className="deals-content">
          <div className="deals-meta-row">
            <span className="t-caption-sm">
              {totalMatched > 0
                ? `${totalMatched} Black Friday & Cyber Monday deal${totalMatched === 1 ? "" : "s"} found`
                : "No Black Friday posts yet. Showing the latest deals in each category"}
            </span>
            <span className="t-caption-sm">Updated {fmt(updatedAt)}</span>
          </div>

          {order.map(k => <Section key={k} section={sections[k]} />)}
        </div>
      </div>

      <SeoBlock page="blackfriday" />
    </div>
  );
}

function Section({ section }: { section: BfSection<Deal> | BfSection<AirlineDeal> }) {
  const { key, title, sub, href, hrefLabel, matched, fallback } = section;
  const list = (matched.length ? matched : fallback) as (Deal | AirlineDeal)[];
  const category = key === "flights" ? undefined : key;
  return (
    <section id={key} className="bf-section" aria-labelledby={`bf-${key}`}>
      <div className="lx-region-head">
        <h2 id={`bf-${key}`} className="lx-region-title">{title}</h2>
        <p className="lx-region-sub">
          {matched.length
            ? sub
            : "No Black Friday posts in this category yet. These are the latest deals, and this list updates nightly."}
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
