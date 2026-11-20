import Link from "next/link";
import { MallCard, CoeTable, EventCard, SectionHead, Stars } from "./Cards";
import { loadBiggestMalls } from "@/lib/malls";
import { TIERS, HOTELS, tierAverage } from "@/lib/hotels";
import { getCoeResults, loadEvents } from "@/lib/automobile";

const sgd = (n: number) => `S$${n.toLocaleString("en-SG")}`;

/** Server-rendered home sections for Shopping Malls, Hotels and Automobile (refreshed weekly). */
export default async function HomeSections() {
  const [malls, coe, events] = await Promise.all([loadBiggestMalls(3), getCoeResults(), loadEvents()]);
  return (
    <>
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
