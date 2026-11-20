import Link from "next/link";
import { SEO_CONTENT, type SeoPageKey } from "@/lib/seoContent";

/** Server-rendered guide + related links + visible FAQ (with matching FAQPage JSON-LD). */
export default function SeoBlock({ page }: { page: SeoPageKey }) {
  const c = SEO_CONTENT[page];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section className="seo-block" aria-labelledby={`seo-${page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="seo-block-inner">
        <h2 id={`seo-${page}`} className="seo-h2">{c.heading}</h2>
        {c.intro.map(p => <p key={p.slice(0, 32)} className="seo-p">{p}</p>)}

        {c.tips && (
          <>
            <h3 className="seo-h3">{c.tips.title}</h3>
            <ul className="seo-list">{c.tips.items.map(t => <li key={t}>{t}</li>)}</ul>
          </>
        )}

        <nav className="seo-related" aria-label="Related pages">
          {c.related.map(r => <Link key={r.href} href={r.href} className="lx-chip">{r.label}</Link>)}
        </nav>

        <h2 className="seo-h2">Frequently asked questions</h2>
        <div className="seo-faq">
          {c.faqs.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
