import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import { CoeTable, EventCard, JsonLd, Breadcrumbs } from "@/components/lifestyle/Cards";
import { getCoeResults, loadEvents, formatEventDates } from "@/lib/automobile";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";
export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Singapore Automobile — Latest COE Results & Upcoming Car Events",
  description:
    "Latest COE bidding results for Categories A to E with change from the previous round, plus upcoming Singapore car events: Singapore Motorshow, car fairs, F1 Singapore Grand Prix and more.",
  alternates: { canonical: `${SITE_URL}/automobile` },
  openGraph: {
    type: "website", locale: "en_SG", url: `${SITE_URL}/automobile`, siteName: "SGliving",
    title: "Latest COE Results & Singapore Car Events",
    description: "COE premiums for every category and what's coming up in Singapore's motoring calendar.",
  },
  twitter: { card: "summary_large_image", title: "COE Results & Car Events | SGliving" },
};

const sgd = (n: number) => `S$${n.toLocaleString("en-SG")}`;

export default async function AutomobilePage() {
  const [coe, events] = await Promise.all([getCoeResults(), loadEvents()]);
  const eventList = {
    "@context": "https://schema.org", "@type": "ItemList", name: "Upcoming automotive events in Singapore",
    itemListElement: events.upcoming.map((e, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/automobile/${e.slug}`, name: e.name })),
  };
  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={eventList} />
      <div className="deals-page">
        <header className="deals-hero">
          <div className="cpc-hero-eyebrow">COE from LTA · events refreshed weekly</div>
          <h1 className="cpc-hero-title" style={{ fontSize: 32 }}>Singapore automobile</h1>
          <p className="cpc-hero-sub" style={{ maxWidth: 560, margin: "8px auto 0" }}>
            The latest COE premiums and every car show, fair and race worth knowing about.
          </p>
        </header>
        <div className="deals-content">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Automobile" }]} />

          <section className="lx-region" id="coe">
            <CoeTable coe={coe} />
            {coe.history.length > 2 && (
              <details className="lx-history">
                <summary>Previous rounds (Cat A / Cat B / Cat E)</summary>
                <table className="lx-table">
                  <thead><tr><th>Round</th><th>Cat A</th><th>Cat B</th><th>Cat E</th></tr></thead>
                  <tbody>
                    {coe.history.map(r => {
                      const p = (c: string) => r.rows.find(x => x.category === c)?.premium;
                      return <tr key={r.label}><td>{r.label}</td><td>{p("Category A") ? sgd(p("Category A")!) : "–"}</td><td>{p("Category B") ? sgd(p("Category B")!) : "–"}</td><td>{p("Category E") ? sgd(p("Category E")!) : "–"}</td></tr>;
                    })}
                  </tbody>
                </table>
              </details>
            )}
            <p className="lx-footnote">COE bidding runs twice a month and results are released on Wednesdays at 4pm. This page refreshes weekly from LTA&apos;s open data on data.gov.sg.</p>
          </section>

          <section className="lx-region" id="events">
            <div className="lx-region-head">
              <h2 className="lx-region-title">Upcoming car events</h2>
              <p className="lx-region-sub">Motor shows, car fairs, trade shows and motorsport in Singapore.</p>
            </div>
            <div className="deals-grid">{events.upcoming.map(e => <EventCard key={e.slug} event={e} />)}</div>
          </section>

          {events.past.length > 0 && (
            <section className="lx-region" id="past">
              <div className="lx-region-head">
                <h2 className="lx-region-title">Recently ended</h2>
                <p className="lx-region-sub">{events.past.map(e => `${e.name} (${formatEventDates(e)})`).join(" · ")}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
