import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { Breadcrumbs, JsonLd } from "@/components/lifestyle/Cards";
import { GUIDES, getGuide, formatDate } from "@/lib/guides";
import { CoeGuide, RideGuide, AirportGuide, MallsGuide, HotelsGuide } from "@/components/guides/GuideBodies";

export const revalidate = 604800; // guides that include live data (COE, malls) refresh weekly
export const dynamicParams = false;
export function generateStaticParams() { return GUIDES.map(g => ({ slug: g.slug })); }

const BODIES: Record<string, () => React.ReactNode | Promise<React.ReactNode>> = {
  "how-coe-bidding-works": CoeGuide,
  "grab-vs-gojek-vs-tada": RideGuide,
  "changi-airport-to-city": AirportGuide,
  "biggest-shopping-malls-singapore": MallsGuide,
  "hotels-near-marina-bay": HotelsGuide,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return pageMeta({ path: `/guides/${slug}`, title: g.seoTitle, description: g.description, socialTitle: g.title });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const Body = BODIES[slug];
  const others = GUIDES.filter(o => o.slug !== slug).slice(0, 4);
  const url = `${SITE_URL}/guides/${slug}`;
  const article = {
    "@context": "https://schema.org", "@type": "Article",
    headline: g.title, description: g.description, url, mainEntityOfPage: url, inLanguage: "en-SG",
    datePublished: `${g.published}T09:00:00+08:00`, dateModified: `${g.updated}T09:00:00+08:00`,
    author: { "@type": "Organization", name: "SGliving Editorial Team", url: `${SITE_URL}/editorial-policy` },
    publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
    image: `${SITE_URL}/opengraph-image`,
    about: { "@type": "Place", name: "Singapore" },
  };
  const crumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
      { "@type": "ListItem", position: 3, name: g.title, item: url },
    ],
  };
  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={article} />
      <JsonLd data={crumbs} />
      <article className="lx-detail guide">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: g.title }]} />
        <header className="lx-detail-head">
          <div className="lx-detail-eyebrow">{g.emoji} {g.category}</div>
          <h1 className="lx-detail-title">{g.title}</h1>
          <p className="guide-byline">
            By the <Link href="/editorial-policy">SGliving Editorial Team</Link> · Updated <time dateTime={g.updated}>{formatDate(g.updated)}</time>
          </p>
        </header>
        <div className="guide-body">{await Body()}</div>
        <section className="lx-block lx-more">
          <h2>More Singapore guides</h2>
          <nav className="seo-related" aria-label="More guides">
            {others.map(o => <Link key={o.slug} href={`/guides/${o.slug}`} className="lx-chip">{o.seoTitle}</Link>)}
          </nav>
        </section>
      </article>
    </div>
  );
}
