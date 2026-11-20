import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { Breadcrumbs, JsonLd } from "@/components/lifestyle/Cards";
import { GUIDES, formatDate } from "@/lib/guides";

export const metadata: Metadata = pageMeta({
  path: "/guides",
  title: "Singapore Guides: COE, Getting Around, Malls & Hotels",
  description: "Practical Singapore guides — how COE bidding works, Grab vs Gojek vs TADA prices, Changi Airport to the city, the biggest malls and where to stay near Marina Bay.",
});

export default function GuidesHub() {
  const list = {
    "@context": "https://schema.org", "@type": "ItemList", name: "SGliving guides",
    itemListElement: GUIDES.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/guides/${g.slug}`, name: g.title })),
  };
  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={list} />
      <div className="deals-page">
        <header className="deals-hero">
          <div className="cpc-hero-eyebrow">Practical, Singapore-specific, kept up to date</div>
          <h1 className="cpc-hero-title" style={{ fontSize: 32 }}>Singapore Guides</h1>
          <p className="cpc-hero-sub" style={{ maxWidth: 560, margin: "8px auto 0" }}>
            Straight answers on COEs, getting around, shopping and where to stay — built on official data where we can.
          </p>
        </header>
        <div className="deals-content">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
          <div className="deals-grid">
            {GUIDES.map(g => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="deal-card lx-card">
                <div className="lx-img"><div className="lx-img-fallback"><span>{g.emoji}</span></div></div>
                <div className="deal-card-body">
                  <span className="lx-pill lx-pill-soft" style={{ alignSelf: "flex-start" }}>{g.category}</span>
                  <h2 className="lx-card-title">{g.title}</h2>
                  <p className="lx-card-text">{g.description}</p>
                  <span className="t-caption-sm">Updated {formatDate(g.updated)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
