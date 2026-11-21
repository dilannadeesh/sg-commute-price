import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import SeoBlock from "@/components/seo/SeoBlock";
import { Breadcrumbs, JsonLd } from "@/components/lifestyle/Cards";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { ARTICLES, BTT_CARD } from "@/lib/newdriver/articles";

export const metadata: Metadata = pageMeta({
  path: "/new-driver",
  title: "New Driver in Singapore: Rules, Licence Steps & Free BTT Test",
  description: "Everything new drivers in Singapore need: the latest 2026–2027 driving rules, how to get your licence and what it costs, a free BTT mock exam and tips to pass the practical test.",
});

const CARDS = [
  { href: `/new-driver/${ARTICLES[0].slug}`, emoji: ARTICLES[0].emoji, title: ARTICLES[0].card, sub: ARTICLES[0].cardSub },
  { href: `/new-driver/${ARTICLES[1].slug}`, emoji: ARTICLES[1].emoji, title: ARTICLES[1].card, sub: ARTICLES[1].cardSub },
  { href: BTT_CARD.href, emoji: BTT_CARD.emoji, title: BTT_CARD.card, sub: BTT_CARD.cardSub },
  { href: `/new-driver/${ARTICLES[2].slug}`, emoji: ARTICLES[2].emoji, title: ARTICLES[2].card, sub: ARTICLES[2].cardSub },
];

const ROADMAP = [
  ["Enrol & eyesight test", "Driving school or private instructor"],
  ["Pass the BTT", "50 questions · pass at 45 · S$7.20"],
  ["Get your PDL", "S$25 · valid 2 years"],
  ["Practical lessons", "With L plates and an instructor"],
  ["Pass the FTT", "50 questions · pass at 45"],
  ["Pass the TP test", "S$40 · fail at 20 points or 1 IF"],
  ["Licence + P plates", "S$50 · P plates for 1 year"],
];

export default function NewDriverHub() {
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "New driver in Singapore guides",
    itemListElement: CARDS.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.title, url: `${SITE_URL}${c.href}` })),
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "New driver in Singapore", item: `${SITE_URL}/new-driver` },
    ],
  };
  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={list} />
      <JsonLd data={crumbs} />
      <main className="nd-page">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "New driver in Singapore" }]} />
        <header className="nd-hero">
          <span className="nd-kicker">🚘 Learner &amp; P-plate drivers</span>
          <h1>New driver in Singapore</h1>
          <p>From your first theory test to your first year on P plates: the rules that changed in 2026, the path to your licence, a free BTT practice exam and how to pass the practical test.</p>
        </header>

        <div className="nd-cards">
          {CARDS.map(c => (
            <Link key={c.href} href={c.href} className={"nd-card" + (c.href === BTT_CARD.href ? " is-hot" : "")}>
              <span className="nd-card-emoji" aria-hidden>{c.emoji}</span>
              <strong>{c.title}</strong>
              <span>{c.sub}</span>
              <span className="nd-card-go">{c.href === BTT_CARD.href ? "Start the test →" : "Read guide →"}</span>
            </Link>
          ))}
        </div>

        <section className="nd-roadmap" aria-labelledby="nd-roadmap-h">
          <h2 id="nd-roadmap-h">Your road to a Singapore licence</h2>
          <ol>
            {ROADMAP.map(([t, s], i) => (
              <li key={t}><span className="nd-step-num">{i + 1}</span><strong>{t}</strong><span>{s}</span></li>
            ))}
          </ol>
          <p className="lx-muted">Fees are Traffic Police fees for tests booked from 13 March 2026. <Link href="/new-driver/how-to-get-driving-licence-singapore">Full steps and costs →</Link></p>
        </section>
      </main>
      <SeoBlock page="newdriver" />
    </div>
  );
}
