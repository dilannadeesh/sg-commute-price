import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import { Breadcrumbs, JsonLd } from "@/components/lifestyle/Cards";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { PROVIDERS, getProvider } from "@/lib/travel/providers";
import { formatDate } from "@/lib/guides";

export const revalidate = 604800;
export const dynamicParams = false;

export function generateStaticParams() {
  return PROVIDERS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProvider(slug);
  if (!p) return {};
  return pageMeta({ path: `/travel/${slug}`, title: p.title, description: p.description });
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProvider(slug);
  if (!p) notFound();
  const url = `${SITE_URL}/travel/${slug}`;

  const org = {
    "@type": "Organization",
    name: p.name,
    ...(p.org.legalName ? { legalName: p.org.legalName } : {}),
    url: p.org.url,
    ...(p.org.foundingDate ? { foundingDate: p.org.foundingDate } : {}),
    ...(p.org.address ? { address: { "@type": "PostalAddress", streetAddress: p.org.address.replace(/, Singapore.*$/, ""), addressLocality: "Singapore", addressCountry: "SG" } } : {}),
    ...(p.org.sameAs ? { sameAs: p.org.sameAs } : {}),
    areaServed: { "@type": "Country", name: "Singapore" },
  };
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.h1,
    description: p.description,
    url,
    mainEntityOfPage: url,
    inLanguage: "en-SG",
    dateModified: p.updated,
    datePublished: p.updated,
    author: { "@type": "Organization", name: "SGliving Editorial Team", url: `${SITE_URL}/editorial-policy` },
    publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/apple-icon.png` } },
    about: org,
    citation: p.sources.map(s => s.url),
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Travelling in Singapore", item: `${SITE_URL}/travel` },
      { "@type": "ListItem", position: 3, name: p.h1, item: url },
    ],
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: p.faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const others = PROVIDERS.filter(o => o.slug !== p.slug);

  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={article} />
      <JsonLd data={crumbs} />
      <JsonLd data={faq} />
      <article className="lx-detail tp-guide">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Travelling in Singapore", href: "/travel" }, { label: p.h1 }]} />
        <header className="lx-detail-head">
          <span className="tp-kind" style={{ color: p.color }}>{p.kind} · Singapore</span>
          <h1 className="lx-detail-title">{p.h1}</h1>
          <p className="lx-detail-lede">{p.lede}</p>
          <p className="lx-muted">By the SGliving Editorial Team · Updated {formatDate(p.updated)}</p>
        </header>

        <dl className="lx-facts">
          {p.facts.map(f => (
            <div key={f.label} className="lx-fact"><dt className="lx-fact-label">{f.label}</dt><dd className="lx-fact-num tp-fact-val">{f.value}</dd></div>
          ))}
        </dl>

        <div className="tp-guide-cta">
          <span>How much would {p.name} cost for your trip?</span>
          <Link href="/travel" className="tp-go tp-go-inline">Compare with MRT, Grab, Gojek, GetGo &amp; Flexar →</Link>
        </div>

        {p.sections.map(s => (
          <section key={s.heading} className="lx-block">
            <h2>{s.heading}</h2>
            {s.paragraphs?.map(t => <p key={t.slice(0, 40)}>{t}</p>)}
            {s.list && <ul className="seo-list">{s.list.map(t => <li key={t}>{t}</li>)}</ul>}
          </section>
        ))}

        <section className="lx-block">
          <h2>{p.name}: pros and cons</h2>
          <div className="tp-proscons">
            <div><h3>👍 Good for</h3><ul className="seo-list">{p.pros.map(t => <li key={t}>{t}</li>)}</ul></div>
            <div><h3>👎 Watch out for</h3><ul className="seo-list">{p.cons.map(t => <li key={t}>{t}</li>)}</ul></div>
          </div>
        </section>

        <section className="lx-block">
          <h2>How to use {p.name}</h2>
          <ol className="seo-list tp-steps">{p.steps.map(t => <li key={t}>{t}</li>)}</ol>
        </section>

        <section className="lx-block">
          <h2>{p.name} FAQs</h2>
          <div className="seo-faq">
            {p.faqs.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="lx-block">
          <h2>Compare other ways to get around</h2>
          <nav className="seo-related" aria-label="Other providers">
            {others.map(o => <Link key={o.slug} href={`/travel/${o.slug}`} className="lx-chip">{o.h1}</Link>)}
            <Link href="/travel" className="lx-chip">Journey planner</Link>
            <Link href="/guides/grab-vs-gojek-vs-tada" className="lx-chip">Grab vs Gojek vs TADA</Link>
          </nav>
        </section>

        <section className="lx-block">
          <h2>Sources</h2>
          <ul className="seo-list tp-sources">
            {p.sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
          </ul>
          <p className="lx-muted">SGliving is independent and isn&apos;t affiliated with {p.name}. Prices and policies change — check the {p.name} app for live rates. See our <Link href="/editorial-policy">editorial policy</Link>.</p>
        </section>
      </article>
    </div>
  );
}
