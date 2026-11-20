import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import CoeChart from "@/components/coe/CoeChart";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { Breadcrumbs, JsonLd } from "@/components/lifestyle/Cards";
import { COE_CATS, getCoeCat, getCoeHistory, summary, yearlyStats } from "@/lib/coe";

export const revalidate = 604800;
export const dynamicParams = false;
export function generateStaticParams() { return COE_CATS.map(c => ({ cat: c.slug })); }

const sgd = (n: number) => `S$${n.toLocaleString("en-SG")}`;

export async function generateMetadata({ params }: { params: Promise<{ cat: string }> }): Promise<Metadata> {
  const { cat } = await params;
  const c = getCoeCat(cat);
  if (!c) return {};
  const history = await getCoeHistory();
  const s = history ? summary(history[c.key]) : null;
  return pageMeta({
    path: `/coe/${cat}`,
    title: `${c.short} COE Price Today & History`,
    description: s
      ? `${c.short} COE closed at ${sgd(s.latest.premium)} in ${s.latest.label}. See every ${c.short} bidding result since 2010, yearly averages, highs and lows — official LTA data.`
      : `Latest ${c.short} COE price and every bidding result since 2010, with yearly averages, highs and lows — official LTA data.`,
  });
}

export default async function CoeCategoryPage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params;
  const c = getCoeCat(cat);
  if (!c) notFound();
  const history = await getCoeHistory();
  const points = history?.[c.key] ?? [];
  const s = points.length > 1 ? summary(points) : null;
  const years = yearlyStats(points);
  const recent = [...points].reverse().slice(0, 24);
  const others = COE_CATS.filter(o => o.slug !== c.slug);

  const dataset = {
    "@context": "https://schema.org", "@type": "Dataset",
    name: `${c.name} premium history (Singapore)`,
    description: `Quota premium, quota, bids received and successful bids for ${c.name} (${c.covers}) in every COE bidding exercise since 2010.`,
    url: `${SITE_URL}/coe/${c.slug}`,
    keywords: ["COE", "Singapore", c.short, "quota premium", "LTA"],
    spatialCoverage: { "@type": "Place", name: "Singapore" },
    ...(points.length ? { temporalCoverage: `${points[0].month}/${points[points.length - 1].month}` } : {}),
    isBasedOn: "https://data.gov.sg/datasets/d_69b3380ad7e51aff3a7dcc84eba52b8a/view",
    creator: { "@type": "Organization", name: "Land Transport Authority (LTA)" },
    publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL },
    license: "https://data.gov.sg/open-data-licence",
  };
  const crumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "COE prices", item: `${SITE_URL}/coe` },
      { "@type": "ListItem", position: 3, name: `${c.short} COE`, item: `${SITE_URL}/coe/${c.slug}` },
    ],
  };

  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={dataset} />
      <JsonLd data={crumbs} />
      <article className="lx-detail">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "COE prices", href: "/coe" }, { label: `${c.short} COE` }]} />
        <header className="lx-detail-head">
          <div className="lx-detail-eyebrow">{c.covers}</div>
          <h1 className="lx-detail-title">{c.short} COE Price: Latest Result &amp; History</h1>
          {s ? (
            <p className="lx-detail-lede">
              {c.short} COE closed at <strong>{sgd(s.latest.premium)}</strong> in the {s.latest.label} bidding exercise,{" "}
              {s.change === 0 ? "unchanged from" : s.change > 0 ? `up ${sgd(s.change)} from` : `down ${sgd(-s.change)} from`} the previous round.
            </p>
          ) : (
            <p className="lx-detail-lede">The full price history is temporarily unavailable — see the <Link href="/coe">latest COE results</Link>.</p>
          )}
          {s && (
            <div className="lx-facts">
              <div className="lx-fact"><span className="lx-fact-num">{sgd(s.latest.premium)}</span><span className="lx-fact-label">latest premium</span></div>
              <div className="lx-fact"><span className="lx-fact-num">{sgd(s.low12)} – {sgd(s.high12)}</span><span className="lx-fact-label">range, last 12 months</span></div>
              <div className="lx-fact"><span className="lx-fact-num">{sgd(s.allTimeHigh.premium)}</span><span className="lx-fact-label">highest since 2010 ({s.allTimeHigh.label})</span></div>
              <div className="lx-fact"><span className="lx-fact-num">{s.latest.quota.toLocaleString()}</span><span className="lx-fact-label">quota this round</span></div>
            </div>
          )}
        </header>

        {points.length > 1 && <CoeChart points={points} title={`${c.short} COE premium`} />}

        {recent.length > 0 && (
          <section className="lx-block">
            <h2>Recent {c.short} bidding results</h2>
            <div className="coe-table-wrap">
              <table className="lx-table">
                <thead><tr><th>Bidding round</th><th>Quota</th><th>Bids received</th><th>Premium</th><th>Change</th></tr></thead>
                <tbody>
                  {recent.map((p, i) => {
                    const prev = recent[i + 1];
                    const ch = prev ? p.premium - prev.premium : null;
                    return (
                      <tr key={`${p.month}-${p.bidding}`}>
                        <td>{p.label}</td><td>{p.quota.toLocaleString()}</td><td>{p.bidsReceived.toLocaleString()}</td>
                        <td><strong>{sgd(p.premium)}</strong></td>
                        <td className={ch === null ? "" : ch > 0 ? "coe-up" : ch < 0 ? "coe-down" : ""}>{ch === null ? "–" : `${ch > 0 ? "+" : ch < 0 ? "−" : ""}${sgd(Math.abs(ch))}`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {years.length > 0 && (
          <section className="lx-block">
            <h2>{c.short} COE price by year</h2>
            <div className="coe-table-wrap">
              <table className="lx-table">
                <thead><tr><th>Year</th><th>Average</th><th>Lowest</th><th>Highest</th><th>Rounds</th></tr></thead>
                <tbody>{years.map(y => <tr key={y.year}><td>{y.year}</td><td>{sgd(y.avg)}</td><td>{sgd(y.low)}</td><td>{sgd(y.high)}</td><td>{y.rounds}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        )}

        <section className="lx-block">
          <h2>What {c.short} covers</h2>
          <p>{c.name}: {c.covers}. The quota premium is the lowest successful bid in each exercise — every successful bidder in the category pays that same amount. A COE lasts 10 years from registration.</p>
          <p>New to COEs? Read <Link href="/guides/how-coe-bidding-works">how COE bidding works</Link>.</p>
          <nav className="seo-related" aria-label="Other COE categories">
            {others.map(o => <Link key={o.slug} href={`/coe/${o.slug}`} className="lx-chip">{o.short} COE price</Link>)}
            <Link href="/automobile" className="lx-chip">Car events</Link>
          </nav>
        </section>
        <p className="lx-footnote">Source: Land Transport Authority, COE Bidding Results / Prices, via data.gov.sg (Singapore Open Data Licence). Refreshed weekly.</p>
      </article>
    </div>
  );
}
