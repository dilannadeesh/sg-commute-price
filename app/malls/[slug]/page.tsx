import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import { pageMeta } from "@/lib/seo";

const clip = (s: string, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…");
import PlaceImage from "@/components/lifestyle/PlaceImage";
import { Breadcrumbs, JsonLd, MapEmbed, MallCard, MrtBadge } from "@/components/lifestyle/Cards";
import { MALLS, getMall, loadMall, estimateMix } from "@/lib/malls";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";
export const revalidate = 604800;
export const dynamicParams = false;

export function generateStaticParams() {
  return MALLS.map(m => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mall = getMall(slug);
  if (!mall) return {};
  const view = await loadMall(mall);
  const title = `${mall.name}: Shops, MRT & Directions`;
  const description = clip(`${mall.name} in ${mall.area}, Singapore: ${view.storeCount}+ stores, nearest MRT ${mall.mrt[0].name} (${mall.mrt[0].codes}). ${mall.short}`);
  return pageMeta({
    path: `/malls/${slug}`, title, description,
    ...(view.wikiInfo?.imageUrl ? { image: { url: view.wikiInfo.imageUrl, alt: `${mall.name}, Singapore` } } : {}),
  });
}

export default async function MallPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mall = getMall(slug);
  if (!mall) notFound();
  const view = await loadMall(mall);
  const mix = estimateMix(mall, view.storeCount);
  const maxMix = Math.max(...mix.map(m => m.count));
  const nearby = await Promise.all(
    MALLS.filter(m => m.region === mall.region && m.slug !== mall.slug).slice(0, 3).map(loadMall),
  );

  const schema = {
    "@context": "https://schema.org", "@type": "ShoppingCenter", name: mall.name, description: mall.about,
    url: `${SITE_URL}/malls/${slug}`,
    address: { "@type": "PostalAddress", streetAddress: mall.address.replace(/, Singapore \d{6}$/, ""), postalCode: mall.address.match(/\d{6}$/)?.[0], addressLocality: "Singapore", addressCountry: "SG" },
    ...(view.wikiInfo?.imageUrl ? { image: view.wikiInfo.imageUrl } : {}),
    ...(view.wikiInfo?.lat ? { geo: { "@type": "GeoCoordinates", latitude: view.wikiInfo.lat, longitude: view.wikiInfo.lon } } : {}),
    ...(mall.website ? { sameAs: [mall.website] } : {}),
  };
  const crumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shopping Malls", item: `${SITE_URL}/malls` },
      { "@type": "ListItem", position: 3, name: mall.name, item: `${SITE_URL}/malls/${slug}` },
    ],
  };

  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={schema} />
      <JsonLd data={crumbs} />
      <article className="lx-detail">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shopping Malls", href: "/malls" }, { label: mall.name }]} />
        <div className="lx-detail-hero">
          <PlaceImage src={view.wikiInfo?.imageUrl} alt={`${mall.name} in ${mall.area}, Singapore`} emoji="🛍️" className="lx-img-hero" eager />
          {view.wikiInfo?.imageUrl && (
            <a className="lx-credit" href={view.wikiInfo.pageUrl} target="_blank" rel="noopener noreferrer">Photo: Wikipedia / Wikimedia Commons</a>
          )}
        </div>

        <header className="lx-detail-head">
          <div className="lx-detail-eyebrow">{mall.region} Singapore · {mall.area}</div>
          <h1 className="lx-detail-title">{mall.name}</h1>
          <p className="lx-detail-lede">{mall.short}</p>
          <div className="lx-facts">
            <div className="lx-fact"><span className="lx-fact-num">{view.storeCount}+</span><span className="lx-fact-label">stores{view.storeCountSource === "estimate" ? " (approx.)" : ""}</span></div>
            <div className="lx-fact"><span className="lx-fact-num">{mall.mrt[0].name}</span><span className="lx-fact-label">nearest MRT</span></div>
            <div className="lx-fact"><span className="lx-fact-num">{mall.region}</span><span className="lx-fact-label">region</span></div>
          </div>
        </header>

        <div className="lx-detail-grid">
          <div className="lx-detail-main">
            <section className="lx-block">
              <h2>About {mall.name}</h2>
              <p>{mall.about}</p>
              <ul className="lx-ticks">{mall.highlights.map(h => <li key={h}>{h}</li>)}</ul>
            </section>

            <section className="lx-block">
              <h2>Shops by category</h2>
              <p className="lx-muted">Estimated breakdown of about {view.storeCount} stores, based on this mall&apos;s typical tenant mix.</p>
              <div className="lx-bars">
                {mix.map(m => (
                  <div key={m.category} className="lx-bar-row">
                    <span className="lx-bar-label">{m.category}</span>
                    <span className="lx-bar-track"><span className="lx-bar-fill" style={{ width: `${(m.count / maxMix) * 100}%` }} /></span>
                    <span className="lx-bar-num">~{m.count}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="lx-block">
              <h2>How to get there by public transport</h2>
              <div className="lx-stations">
                {mall.mrt.map(s => (
                  <div key={s.name} className="lx-station">
                    <div className="lx-station-name">🚇 {s.name} MRT <MrtBadge codes={s.codes} /></div>
                    <div className="lx-station-access">{s.access}</div>
                  </div>
                ))}
              </div>
              <ol className="lx-steps">{mall.directions.map(d => <li key={d}>{d}</li>)}</ol>
              <p className="lx-muted">Comparing a ride instead? <Link href="/commute">Check Grab, Gojek & TADA prices →</Link></p>
            </section>
          </div>

          <aside className="lx-detail-side">
            <div className="lx-side-card">
              <h3>Location</h3>
              <p>{mall.address}</p>
              <MapEmbed lat={view.wikiInfo?.lat} lon={view.wikiInfo?.lon} query={`${mall.name}, ${mall.address}`} title={mall.name} />
              <p className="lx-muted">Typical mall hours are 10am–10pm; individual stores and restaurants vary.</p>
              {mall.website && <a className="deal-card-cta" href={mall.website} target="_blank" rel="noopener noreferrer">Official website ↗</a>}
            </div>
          </aside>
        </div>

        {nearby.length > 0 && (
          <section className="lx-block lx-more">
            <h2>More malls in {mall.region} Singapore</h2>
            <div className="deals-grid">{nearby.map(m => <MallCard key={m.slug} mall={m} />)}</div>
          </section>
        )}
      </article>
    </div>
  );
}
