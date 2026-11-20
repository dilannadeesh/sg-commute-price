import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { Breadcrumbs, CoeTable, JsonLd } from "@/components/lifestyle/Cards";
import { COE_CATS, getCoeHistory, yearlyStats } from "@/lib/coe";
import { getCoeResults } from "@/lib/automobile";

export const revalidate = 604800;

export const metadata: Metadata = pageMeta({
  path: "/coe",
  title: "COE Prices Singapore: Latest Results & History",
  description: "Latest COE results for Cat A to E plus every bidding round since 2010 — yearly averages, highs and lows, from LTA's official data. Updated after each bidding.",
});

const sgd = (n: number) => `S$${n.toLocaleString("en-SG")}`;

export default async function CoeHub() {
  const [latest, history] = await Promise.all([getCoeResults(), getCoeHistory()]);
  const years = history ? yearlyStats(history["Category A"]).slice(0, 8).map(y => y.year) : [];
  const avgFor = (key: string, year: string) => history ? yearlyStats(history[key]).find(s => s.year === year)?.avg : undefined;
  const crumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "COE prices", item: `${SITE_URL}/coe` },
    ],
  };
  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={crumbs} />
      <article className="lx-detail">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "COE prices" }]} />
        <header className="lx-detail-head">
          <div className="lx-detail-eyebrow">Official LTA data · updated after every bidding exercise</div>
          <h1 className="lx-detail-title">COE Prices in Singapore</h1>
          <p className="lx-detail-lede">
            The latest Certificate of Entitlement (COE) premiums for every category, how they compare with the last round,
            and the full price history since 2010.
          </p>
        </header>

        <CoeTable coe={latest} />

        <section className="lx-block">
          <h2>COE price history by category</h2>
          <div className="coe-cat-grid">
            {COE_CATS.map(c => (
              <Link key={c.slug} href={`/coe/${c.slug}`} className="lx-tier-card">
                <span className="lx-tier-label">{c.short} COE price history</span>
                <span className="lx-tier-eg">{c.covers}</span>
                <span className="home-see-all">Chart & every round →</span>
              </Link>
            ))}
          </div>
        </section>

        {history && years.length > 0 && (
          <section className="lx-block">
            <h2>Average COE premium by year</h2>
            <p className="lx-muted">Average of all bidding rounds in each year (S$).</p>
            <div className="coe-table-wrap">
              <table className="lx-table">
                <thead><tr><th>Year</th>{COE_CATS.map(c => <th key={c.slug}>{c.short}</th>)}</tr></thead>
                <tbody>
                  {years.map(y => (
                    <tr key={y}><td>{y}</td>{COE_CATS.map(c => { const v = avgFor(c.key, y); return <td key={c.slug}>{v ? sgd(v) : "–"}</td>; })}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="lx-block">
          <h2>How COE bidding works</h2>
          <p>Every vehicle registered in Singapore needs a COE, which gives the right to own it for 10 years. LTA releases a fixed quota for each category and holds two open bidding exercises a month. Bidding usually opens on a Monday at noon and closes on Wednesday at 4pm, when results are announced. Everyone who wins pays the same price — the lowest successful bid, called the quota premium.</p>
          <p>Read our <Link href="/guides/how-coe-bidding-works">plain-English guide to COE bidding</Link>, or see <Link href="/automobile">upcoming car events</Link> like the Singapore Motorshow.</p>
        </section>
      </article>
    </div>
  );
}
