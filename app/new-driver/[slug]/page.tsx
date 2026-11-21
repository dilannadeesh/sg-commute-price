import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import { Breadcrumbs, JsonLd } from "@/components/lifestyle/Cards";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { ARTICLES, BTT_CARD, getArticle } from "@/lib/newdriver/articles";
import { formatDate } from "@/lib/guides";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return pageMeta({ path: `/new-driver/${slug}`, title: a.title, description: a.description });
}

export default async function NewDriverArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const url = `${SITE_URL}/new-driver/${slug}`;
  const isHowTo = a.slug === "how-to-get-driving-licence-singapore";
  const steps = a.blocks.find(b => b.ordered && isHowTo)?.list ?? [];

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.h1,
    description: a.description,
    url,
    mainEntityOfPage: url,
    inLanguage: "en-SG",
    datePublished: a.updated,
    dateModified: a.updated,
    author: { "@type": "Organization", name: "SGliving Editorial Team", url: `${SITE_URL}/editorial-policy` },
    publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/apple-icon.png` } },
    about: { "@type": "Thing", name: "Driving in Singapore" },
    spatialCoverage: { "@type": "Country", name: "Singapore" },
    citation: a.sources.map(s => s.url),
  };
  const howTo = isHowTo ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to get a driving licence in Singapore",
    totalTime: "P4M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "SGD", minValue: 1700, maxValue: 3000 },
    step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
  } : null;
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "New driver in Singapore", item: `${SITE_URL}/new-driver` },
      { "@type": "ListItem", position: 3, name: a.card, item: url },
    ],
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: a.faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const others = ARTICLES.filter(o => o.slug !== a.slug);

  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={article} />
      {howTo && <JsonLd data={howTo} />}
      <JsonLd data={crumbs} />
      <JsonLd data={faq} />
      <article className="lx-detail nd-article">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "New driver", href: "/new-driver" }, { label: a.card }]} />
        <header className="lx-detail-head">
          <span className="nd-kicker">{a.emoji} New driver in Singapore</span>
          <h1 className="lx-detail-title">{a.h1}</h1>
          <p className="lx-detail-lede">{a.lede}</p>
          <p className="lx-muted">By the SGliving Editorial Team · Updated {formatDate(a.updated)}</p>
        </header>

        <dl className="lx-facts">
          {a.keyFacts.map(f => (
            <div key={f.label} className="lx-fact"><dt className="lx-fact-label">{f.label}</dt><dd className="lx-fact-num tp-fact-val">{f.value}</dd></div>
          ))}
        </dl>

        <Link href={BTT_CARD.href} className="nd-cta">
          <span>📝 Ready to test yourself? Take the free 50-question BTT mock exam</span><span aria-hidden>→</span>
        </Link>

        {a.blocks.map(b => (
          <section key={b.heading} className="lx-block">
            <h2>{b.heading}</h2>
            {b.paragraphs?.map(p => <p key={p.slice(0, 50)}>{p}</p>)}
            {b.list && (b.ordered
              ? <ol className="seo-list nd-steps">{b.list.map(t => <li key={t}>{t}</li>)}</ol>
              : <ul className="seo-list">{b.list.map(t => <li key={t}>{t}</li>)}</ul>)}
            {b.table && (
              <div className="nd-table-wrap">
                <table className="lx-table nd-table">
                  {b.table.caption && <caption>{b.table.caption}</caption>}
                  <thead><tr>{b.table.head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
                  <tbody>{b.table.rows.map(r => <tr key={r.join("|")}>{r.map((c, i) => i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>)}</tr>)}</tbody>
                </table>
              </div>
            )}
            {b.callout && <p className={`nd-callout nd-callout-${b.callout.tone}`}>{b.callout.tone === "warn" ? "⚠️ " : "ℹ️ "}{b.callout.text}</p>}
          </section>
        ))}

        <section className="lx-block">
          <h2>FAQs</h2>
          <div className="seo-faq">
            {a.faqs.map((f, i) => (
              <details key={f.q} open={i === 0}><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </section>

        <section className="lx-block">
          <h2>More for new drivers</h2>
          <nav className="seo-related" aria-label="More for new drivers">
            {others.map(o => <Link key={o.slug} href={`/new-driver/${o.slug}`} className="lx-chip">{o.card}</Link>)}
            <Link href={BTT_CARD.href} className="lx-chip">BTT mock exam</Link>
            <Link href="/coe" className="lx-chip">Latest COE prices</Link>
            <Link href="/travel/what-is-getgo" className="lx-chip">Car sharing for new drivers</Link>
          </nav>
        </section>

        <section className="lx-block">
          <h2>Sources</h2>
          <ul className="seo-list tp-sources">
            {a.sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
          </ul>
          <p className="lx-muted">Rules and fees change. Always check the <a href="https://www.police.gov.sg/Knowledge-Hub/Traffic" target="_blank" rel="noopener noreferrer">Traffic Police</a> website for the latest. See our <Link href="/editorial-policy">editorial policy</Link>.</p>
        </section>
      </article>
    </div>
  );
}
