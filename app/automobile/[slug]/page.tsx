import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import { pageMeta } from "@/lib/seo";

const clip = (s: string, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…");
import PlaceImage from "@/components/lifestyle/PlaceImage";
import { Breadcrumbs, JsonLd, MapEmbed, MrtBadge, EventCard } from "@/components/lifestyle/Cards";
import { EVENTS, getEvent, loadEvent, eventStatus, formatEventDates } from "@/lib/automobile";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";
export const revalidate = 604800;
export const dynamicParams = false;

export function generateStaticParams() {
  return EVENTS.map(e => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  const view = await loadEvent(event);
  const image = view.keyVisual ?? view.photos[0]?.imageUrl;
  const title = `${event.name}: Dates, Tickets & Venue`;
  const description = clip(`${event.name} — ${formatEventDates(event)} at ${event.venue}, Singapore. Admission: ${event.admission}. ${event.short}`);
  return pageMeta({
    path: `/automobile/${slug}`, title, description,
    ...(image ? { image: { url: image, alt: event.name } } : {}),
  });
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();
  const view = await loadEvent(event);
  const status = eventStatus(event);
  const hero = view.keyVisual ?? view.photos[0]?.imageUrl;
  const gallery = view.photos.filter(p => p.imageUrl !== hero);
  const venuePhoto = view.photos[0];
  const others = await Promise.all(EVENTS.filter(e => e.slug !== slug && eventStatus(e) !== "past").slice(0, 3).map(loadEvent));

  const priceNum = /free/i.test(event.admission) ? 0 : Number(event.admission.match(/S\$(\d+(?:\.\d+)?)/)?.[1] ?? NaN);
  const schema = event.datesTba ? null : {
    "@context": "https://schema.org", "@type": "Event", name: event.name, description: event.about.join(" "),
    startDate: `${event.start}T10:00:00+08:00`, endDate: `${event.end}T21:00:00+08:00`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place", name: event.venue,
      address: { "@type": "PostalAddress", streetAddress: event.address.replace(/, Singapore \d{6}$/, ""), postalCode: event.address.match(/\d{6}$/)?.[0], addressLocality: "Singapore", addressCountry: "SG" },
    },
    organizer: { "@type": "Organization", name: event.organiser, ...(event.officialUrl ? { url: event.officialUrl } : {}) },
    image: [hero ?? `${SITE_URL}/automobile/opengraph-image`],
    ...(Number.isFinite(priceNum) ? {
      offers: {
        "@type": "Offer", price: priceNum, priceCurrency: "SGD",
        availability: "https://schema.org/InStock",
        url: event.officialUrl ?? `${SITE_URL}/automobile/${slug}`,
      },
    } : {}),
    ...(event.officialUrl ? { url: event.officialUrl } : {}),
  };
  const crumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Automobile", item: `${SITE_URL}/automobile` },
      { "@type": "ListItem", position: 3, name: event.name, item: `${SITE_URL}/automobile/${slug}` },
    ],
  };

  return (
    <div className="cpc-app">
      <NavBar />
      {schema && <JsonLd data={schema} />}
      <JsonLd data={crumbs} />
      <article className="lx-detail">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Automobile", href: "/automobile" }, { label: event.name }]} />
        <div className="lx-detail-hero">
          <PlaceImage src={hero} alt={event.name} emoji={event.type === "Motorsport" ? "🏁" : "🚗"} className="lx-img-hero" eager />
          {hero && !view.keyVisual && view.photos[0] && (
            <a className="lx-credit" href={view.photos[0].pageUrl} target="_blank" rel="noopener noreferrer">Photo: {view.photos[0].title} — Wikipedia / Wikimedia Commons</a>
          )}
          {view.keyVisual && event.officialUrl && (
            <a className="lx-credit" href={event.officialUrl} target="_blank" rel="noopener noreferrer">Image: official event website</a>
          )}
        </div>

        <header className="lx-detail-head">
          <div className="lx-detail-eyebrow">
            {event.type}
            {status === "ongoing" && <span className="lx-pill lx-pill-live" style={{ marginLeft: 8 }}>Happening now</span>}
            {status === "past" && <span className="lx-pill lx-pill-muted" style={{ marginLeft: 8 }}>Ended</span>}
          </div>
          <h1 className="lx-detail-title">{event.name}</h1>
          <p className="lx-detail-lede">{event.short}</p>
          <div className="lx-facts">
            <div className="lx-fact"><span className="lx-fact-num">{formatEventDates(event)}</span><span className="lx-fact-label">dates</span></div>
            <div className="lx-fact"><span className="lx-fact-num">{event.admission}</span><span className="lx-fact-label">admission</span></div>
            <div className="lx-fact"><span className="lx-fact-num">{event.audience}</span><span className="lx-fact-label">who it&apos;s for</span></div>
          </div>
        </header>

        <div className="lx-detail-grid">
          <div className="lx-detail-main">
            <section className="lx-block">
              <h2>About the event</h2>
              {event.about.map(p => <p key={p.slice(0, 40)}>{p}</p>)}
              <ul className="lx-ticks">{event.highlights.map(h => <li key={h}>{h}</li>)}</ul>
            </section>

            {gallery.length > 0 && (
              <section className="lx-block">
                <h2>Photos</h2>
                <div className="lx-gallery">
                  {gallery.map(p => (
                    <figure key={p.pageUrl}>
                      <PlaceImage src={p.imageUrl} alt={p.title} emoji="📷" />
                      <figcaption><a href={p.pageUrl} target="_blank" rel="noopener noreferrer">{p.title}</a> · Wikimedia Commons</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            <section className="lx-block">
              <h2>How to get there</h2>
              <div className="lx-stations">
                {event.mrt.map(s => (
                  <div key={s.name} className="lx-station">
                    <div className="lx-station-name">🚇 {s.name} MRT <MrtBadge codes={s.codes} /></div>
                    <div className="lx-station-access">{s.access}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="lx-block">
              <h2>Sources</h2>
              <ul className="lx-sources">
                {event.sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label} ↗</a></li>)}
              </ul>
              <p className="lx-muted">Details can change — confirm with the organiser before you go.</p>
            </section>
          </div>

          <aside className="lx-detail-side">
            <div className="lx-side-card">
              <h3>Event details</h3>
              <dl className="lx-dl">
                <dt>When</dt><dd>{formatEventDates(event)}</dd>
                {event.hours && <><dt>Hours</dt><dd>{event.hours}</dd></>}
                <dt>Where</dt><dd>{event.venue}<br />{event.address}</dd>
                <dt>Admission</dt><dd>{event.admission}</dd>
                <dt>Organiser</dt><dd>{event.organiser}</dd>
              </dl>
              <MapEmbed lat={venuePhoto?.lat} lon={venuePhoto?.lon} query={`${event.venue}, ${event.address}`} title={event.venue} />
              {event.officialUrl && <a className="deal-card-cta" href={event.officialUrl} target="_blank" rel="noopener noreferrer">Official website ↗</a>}
            </div>
          </aside>
        </div>

        {others.length > 0 && (
          <section className="lx-block lx-more">
            <h2>More upcoming car events</h2>
            <div className="deals-grid">{others.map(e => <EventCard key={e.slug} event={e} />)}</div>
          </section>
        )}
      </article>
    </div>
  );
}
