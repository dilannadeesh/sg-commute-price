import Link from "next/link";
import { MallCard, CoeTable, EventCard, SectionHead, Stars } from "./Cards";
import { loadBiggestMalls } from "@/lib/malls";
import { TIERS, HOTELS, tierAverage } from "@/lib/hotels";
import { getCoeResults, loadEvents } from "@/lib/automobile";
import { PROVIDERS } from "@/lib/travel/providers";
import { ARTICLES as ND_ARTICLES, BTT_CARD } from "@/lib/newdriver/articles";

const sgd = (n: number) => `S$${n.toLocaleString("en-SG")}`;

/** Server-rendered home sections for Shopping Malls, Hotels and Automobile (refreshed weekly). */
export default async function HomeSections() {
  const [malls, coe, events] = await Promise.all([loadBiggestMalls(3), getCoeResults(), loadEvents()]);
  return (
    <>
      <section className="home-section" id="travel">
        <div className="home-section-inner">
          <SectionHead title="Travelling in Singapore" emoji="🚇" href="/travel" sub="Best MRT & bus route and fare for any trip, compared with Grab, Gojek, GetGo and Flexar" />
          <Link href="/travel" className="tp-guide-cta" style={{ textDecoration: "none" }}>
            <span>Where are you going? Plan a trip from your current location →</span>
          </Link>
          <div className="tp-provider-grid" style={{ marginTop: 14 }}>
            {PROVIDERS.map(p => (
              <Link key={p.slug} href={`/travel/${p.slug}`} className="tp-provider-card" style={{ borderTopColor: p.color }}>
                <span className="tp-kind">{p.kind}</span>
                <strong>{p.h1}</strong>
                <span>{p.lede.split(". ")[0]}.</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" id="new-driver">
        <div className="home-section-inner">
          <SectionHead title="New driver in Singapore" emoji="🚘" href="/new-driver" sub="Latest rules, licence steps, a free BTT mock exam and practical test tips" />
          <div className="nd-cards">
            {[
              { href: `/new-driver/${ND_ARTICLES[0].slug}`, emoji: ND_ARTICLES[0].emoji, title: ND_ARTICLES[0].card, sub: ND_ARTICLES[0].cardSub },
              { href: `/new-driver/${ND_ARTICLES[1].slug}`, emoji: ND_ARTICLES[1].emoji, title: ND_ARTICLES[1].card, sub: ND_ARTICLES[1].cardSub },
              { href: BTT_CARD.href, emoji: BTT_CARD.emoji, title: BTT_CARD.card, sub: BTT_CARD.cardSub },
              { href: `/new-driver/${ND_ARTICLES[2].slug}`, emoji: ND_ARTICLES[2].emoji, title: ND_ARTICLES[2].card, sub: ND_ARTICLES[2].cardSub },
            ].map(c => (
              <Link key={c.href} href={c.href} className={"nd-card" + (c.href === BTT_CARD.href ? " is-hot" : "")}>
                <span className="nd-card-emoji" aria-hidden>{c.emoji}</span>
                <strong>{c.title}</strong>
                <span>{c.sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <section className="home-section" id="malls">
        <div className="home-section-inner">
          <SectionHead title="Biggest Shopping Malls" emoji="🛍️" href="/malls" sub="Singapore's three largest malls by number of stores" />
          <div className="deals-grid home-preview-grid">
            {malls.map(m => <MallCard key={m.slug} mall={m} />)}
          </div>
        </div>
      </section>

      <section className="home-section home-section-alt" id="hotels">
        <div className="home-section-inner">
          <SectionHead title="Hotels in Singapore" emoji="🏨" href="/hotels" sub="Average nightly prices from budget to 5-star" />
          <div className="lx-tier-grid lx-tier-grid-home">
            {[...TIERS].reverse().map(t => {
              const examples = HOTELS.filter(h => h.tier === t.id).slice(0, 2).map(h => h.name).join(", ");
              return (
                <Link key={t.id} href={`/hotels#${t.id}`} className="lx-tier-card">
                  <Stars n={t.stars} />
                  <span className="lx-tier-label">{t.label}</span>
                  <span className="lx-tier-avg">avg ~{sgd(tierAverage(t.id))}<small>/night</small></span>
                  <span className="lx-tier-eg">e.g. {examples}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-section" id="automobile">
        <div className="home-section-inner">
          <SectionHead title="Automobile" emoji="🚗" href="/automobile" sub="Latest COE results and upcoming car events" />
          <CoeTable coe={coe} compact />
          {events.upcoming.length > 0 && (
            <div className="deals-grid home-preview-grid" style={{ marginTop: 20 }}>
              {events.upcoming.slice(0, 3).map(e => <EventCard key={e.slug} event={e} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
