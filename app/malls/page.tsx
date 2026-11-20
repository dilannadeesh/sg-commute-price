import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import { pageMeta } from "@/lib/seo";
import { MallCard, JsonLd, Breadcrumbs } from "@/components/lifestyle/Cards";
import { REGIONS, loadAllMalls } from "@/lib/malls";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";
export const revalidate = 604800; // weekly — also forced by /api/malls/refresh

export const metadata: Metadata = pageMeta({
  path: "/malls",
  title: "Shopping Malls in Singapore by Region & MRT",
  description: "25 Singapore shopping malls by region — Orchard, Marina Bay, Jurong, Tampines and more — with store counts and the nearest MRT station for each.",
});

export default async function MallsPage() {
  const malls = await loadAllMalls();
  const itemList = {
    "@context": "https://schema.org", "@type": "ItemList", name: "Shopping malls in Singapore",
    itemListElement: malls.map((m, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/malls/${m.slug}`, name: m.name })),
  };
  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={itemList} />
      <div className="deals-page">
        <header className="deals-hero">
          <div className="cpc-hero-eyebrow">Refreshed weekly · {malls.length} malls across Singapore</div>
          <h1 className="cpc-hero-title" style={{ fontSize: 32 }}>Shopping malls in Singapore</h1>
          <p className="cpc-hero-sub" style={{ maxWidth: 560, margin: "8px auto 0" }}>
            Find malls by region, see roughly how many shops each has, and which MRT station gets you there.
          </p>
          <nav className="lx-chips" aria-label="Jump to region">
            {REGIONS.map(r => <a key={r.id} href={`#${r.id.toLowerCase()}`} className="lx-chip">{r.id}</a>)}
          </nav>
        </header>
        <div className="deals-content">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shopping Malls" }]} />
          {REGIONS.map(region => {
            const list = malls.filter(m => m.region === region.id).sort((a, b) => b.storeCount - a.storeCount);
            return (
              <section key={region.id} id={region.id.toLowerCase()} className="lx-region">
                <div className="lx-region-head">
                  <h2 className="lx-region-title">{region.id} Singapore</h2>
                  <p className="lx-region-sub">{region.blurb} · {list.length} malls</p>
                </div>
                <div className="deals-grid">
                  {list.map(m => <MallCard key={m.slug} mall={m} />)}
                </div>
              </section>
            );
          })}
          <p className="lx-footnote">
            Store counts are approximate and include retail, dining and services. Where Wikipedia lists an official count, we use it; it&apos;s re-checked every week.
            Mall photos are from Wikipedia / Wikimedia Commons.
          </p>
        </div>
      </div>
    </div>
  );
}
