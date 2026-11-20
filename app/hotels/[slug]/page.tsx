import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import { pageMeta } from "@/lib/seo";

const clip = (s: string, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…");
import PlaceImage from "@/components/lifestyle/PlaceImage";
import { Breadcrumbs, JsonLd, MapEmbed, HotelCard, MrtBadge, Stars } from "@/components/lifestyle/Cards";
import { HOTELS, TIERS, getHotel, loadHotel, tierAverage } from "@/lib/hotels";
import { loadAllMalls } from "@/lib/malls";
import { nearest, fmtKm } from "@/lib/nearby";
import { formatDate } from "@/lib/guides";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";
export const revalidate = 604800;
export const dynamicParams = false;

const sgd = (n: number) => `S$${n.toLocaleString("en-SG")}`;

export function generateStaticParams() {
  return HOTELS.map(h => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hotel = getHotel(slug);
  if (!hotel) return {};
  const view = await loadHotel(hotel);
  const tier = TIERS.find(t => t.id === hotel.tier)!;
  const title = `${hotel.name}: Room Rates & How to Get There`;
  const description = clip(`${hotel.name}, ${tier.label.replace(/s$/, "").toLowerCase()} in ${hotel.area}, Singapore — typical ${sgd(hotel.priceFrom)}–${sgd(hotel.priceTo)} a night. Nearest MRT: ${hotel.mrt[0].name}. ${hotel.short}`);
  return pageMeta({
    path: `/hotels/${slug}`, title, description,
    ...(view.wikiInfo?.imageUrl ? { image: { url: view.wikiInfo.imageUrl, alt: `${hotel.name}, Singapore` } } : {}),
  });
}

export default async function HotelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hotel = getHotel(slug);
  if (!hotel) notFound();
  const view = await loadHotel(hotel);
  const tier = TIERS.find(t => t.id === hotel.tier)!;
  const nearMalls = hotel.multiLocation ? [] : nearest(view.wikiInfo, await loadAllMalls());
  const similar = await Promise.all(HOTELS.filter(h => h.tier === hotel.tier && h.slug !== slug).slice(0, 3).map(loadHotel));

  const schema = {
    "@context": "https://schema.org", "@type": "Hotel", name: hotel.name, description: hotel.about,
    url: `${SITE_URL}/hotels/${slug}`,
    priceRange: `${sgd(hotel.priceFrom)}–${sgd(hotel.priceTo)} per night (typical)`,
    ...(tier.stars ? { starRating: { "@type": "Rating", ratingValue: tier.stars } } : {}),
    ...(hotel.address ? { address: { "@type": "PostalAddress", streetAddress: hotel.address.replace(/, Singapore \d{6}$/, ""), postalCode: hotel.address.match(/\d{6}$/)?.[0], addressLocality: "Singapore", addressCountry: "SG" } } : { address: { "@type": "PostalAddress", addressLocality: "Singapore", addressCountry: "SG" } }),
    ...(view.wikiInfo?.imageUrl ? { image: view.wikiInfo.imageUrl } : {}),
    ...(view.roomCount ? { numberOfRooms: view.roomCount } : {}),
    amenityFeature: hotel.amenities.map(a => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
  };
  const crumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Hotels", item: `${SITE_URL}/hotels` },
      { "@type": "ListItem", position: 3, name: hotel.name, item: `${SITE_URL}/hotels/${slug}` },
    ],
  };
  const avg = tierAverage(hotel.tier);
  const mid = (hotel.priceFrom + hotel.priceTo) / 2;

  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={schema} />
      <JsonLd data={crumbs} />
      <article className="lx-detail">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Hotels", href: "/hotels" }, { label: hotel.name }]} />
        <div className="lx-detail-hero">
          <PlaceImage src={view.wikiInfo?.imageUrl} alt={hotel.name} emoji="🏨" className="lx-img-hero" eager />
          {view.wikiInfo?.imageUrl && (
            <a className="lx-credit" href={view.wikiInfo.pageUrl} target="_blank" rel="noopener noreferrer">Photo: Wikipedia / Wikimedia Commons</a>
          )}
        </div>

        <header className="lx-detail-head">
          <div className="lx-detail-eyebrow"><Stars n={tier.stars} /> {tier.label.replace(/s$/, "")} · {hotel.area}</div>
          <h1 className="lx-detail-title">{hotel.name}</h1>
          <p className="lx-detail-lede">{hotel.short}</p>
          <div className="lx-facts">
            <div className="lx-fact"><span className="lx-fact-num">{sgd(hotel.priceFrom)}–{sgd(hotel.priceTo)}</span><span className="lx-fact-label">typical per night</span></div>
            <div className="lx-fact"><span className="lx-fact-num">{hotel.mrt[0].name}</span><span className="lx-fact-label">nearest MRT</span></div>
            {view.roomCount ? <div className="lx-fact"><span className="lx-fact-num">{view.roomCount.toLocaleString()}</span><span className="lx-fact-label">rooms</span></div> : null}
          </div>
        </header>

        <div className="lx-detail-grid">
          <div className="lx-detail-main">
            <section className="lx-block">
              <h2>About the hotel</h2>
              <p>{hotel.about}</p>
              <ul className="lx-ticks">{hotel.amenities.map(a => <li key={a}>{a}</li>)}</ul>
            </section>

            <section className="lx-block">
              <h2>Average room prices</h2>
              <p className="lx-muted">
                Typical nightly &ldquo;from&rdquo; rates before taxes. {mid > avg ? "Above" : mid < avg ? "Below" : "In line with"} the {tier.label.toLowerCase()} average of about {sgd(avg)}.
              </p>
              <table className="lx-table">
                <thead><tr><th>Room type</th><th>Typical from / night</th></tr></thead>
                <tbody>{hotel.roomTypes.map(r => <tr key={r.name}><td>{r.name}</td><td>{sgd(r.from)}</td></tr>)}</tbody>
              </table>
              <p className="lx-muted">Estimates only — prices change daily and spike around events. Check the hotel or a booking site for your dates.</p>
            </section>

            <section className="lx-block">
              <h2>How to get to {hotel.name}</h2>
              <div className="lx-stations">
                {hotel.mrt.map(s => (
                  <div key={s.name} className="lx-station">
                    <div className="lx-station-name">🚇 {s.name}{s.codes ? " MRT" : ""} <MrtBadge codes={s.codes} /></div>
                    <div className="lx-station-access">{s.access}</div>
                  </div>
                ))}
              </div>
              <ol className="lx-steps">{hotel.access.map(a => <li key={a}>{a}</li>)}</ol>
              <p className="lx-muted">Taking a taxi from the airport? <Link href="/commute">Compare Grab, Gojek & TADA prices →</Link></p>
            </section>
          </div>

          <aside className="lx-detail-side">
            <div className="lx-side-card">
              <h3>Location</h3>
              <p>{hotel.address ?? `${hotel.area}, Singapore`}</p>
              {!hotel.multiLocation && <MapEmbed lat={view.wikiInfo?.lat} lon={view.wikiInfo?.lon} query={`${hotel.name}, ${hotel.address ?? "Singapore"}`} title={hotel.name} />}
              {hotel.multiLocation && (
                <a className="deal-card-cta" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + " Singapore")}`} target="_blank" rel="noopener noreferrer">See all branches on Google Maps ↗</a>
              )}
              {hotel.website && <a className="deal-card-cta" href={hotel.website} target="_blank" rel="noopener noreferrer">Official website ↗</a>}
            </div>
          </aside>
        </div>

        {nearMalls.length > 0 && (
          <section className="lx-block">
            <h2>Shopping malls near {hotel.name}</h2>
            <ul className="nearby-list">
              {nearMalls.map(({ item: m, km }) => (
                <li key={m.slug}>
                  <Link href={`/malls/${m.slug}`}>{m.name}</Link>
                  <span>{m.storeCount}+ stores · {fmtKm(km)} away · {m.mrt[0].name} MRT</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="lx-footnote">Rates last reviewed {formatDate("2026-11-20")} by the <Link href="/editorial-policy">SGliving Editorial Team</Link>. Typical rates are estimates — check live prices before booking.</p>

        {similar.length > 0 && (
          <section className="lx-block lx-more">
            <h2>Other {tier.label.toLowerCase()}</h2>
            <div className="deals-grid">{similar.map(h => <HotelCard key={h.slug} hotel={h} />)}</div>
          </section>
        )}
      </article>
    </div>
  );
}
