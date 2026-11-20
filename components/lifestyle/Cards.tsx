import Link from "next/link";
import PlaceImage from "./PlaceImage";
import type { MallView } from "@/lib/malls";
import type { HotelView } from "@/lib/hotels";
import { TIERS } from "@/lib/hotels";
import { formatEventDates, eventStatus, type EventView, COE_CATEGORIES, type CoeResult } from "@/lib/automobile";

const sgd = (n: number) => `S$${n.toLocaleString("en-SG")}`;

export function MrtBadge({ codes }: { codes: string }) {
  if (!codes) return null;
  return <span className="lx-mrt-code">{codes}</span>;
}

export function MallCard({ mall }: { mall: MallView }) {
  const station = mall.mrt[0];
  return (
    <Link href={`/malls/${mall.slug}`} className="deal-card lx-card">
      <PlaceImage src={mall.wikiInfo?.thumbUrl} alt={`${mall.name}, ${mall.area}`} emoji="🛍️" />
      <div className="deal-card-body">
        <div className="lx-card-top">
          <h3 className="lx-card-title">{mall.name}</h3>
          <span className="lx-pill">{mall.storeCount}+ stores</span>
        </div>
        <p className="lx-card-text">{mall.short}</p>
        <div className="lx-card-meta">
          <span aria-hidden>🚇</span>
          <span><strong>{station.name}</strong> <MrtBadge codes={station.codes} /> · {station.access}</span>
        </div>
      </div>
    </Link>
  );
}

export function Stars({ n }: { n: number }) {
  if (!n) return <span className="lx-stars lx-stars-budget">Budget</span>;
  return <span className="lx-stars" aria-label={`${n} star`}>{"★".repeat(n)}</span>;
}

export function HotelCard({ hotel }: { hotel: HotelView }) {
  const tier = TIERS.find(t => t.id === hotel.tier)!;
  const station = hotel.mrt[0];
  return (
    <Link href={`/hotels/${hotel.slug}`} className="deal-card lx-card">
      <PlaceImage src={hotel.wikiInfo?.thumbUrl} alt={hotel.name} emoji="🏨" />
      <div className="deal-card-body">
        <div className="lx-card-top">
          <h3 className="lx-card-title">{hotel.name}</h3>
          <Stars n={tier.stars} />
        </div>
        <p className="lx-card-text">{hotel.short}</p>
        <div className="lx-price-row">
          <span className="lx-price">{sgd(hotel.priceFrom)}–{sgd(hotel.priceTo)}</span>
          <span className="lx-price-note">typical / night</span>
        </div>
        <div className="lx-card-meta">
          <span aria-hidden>📍</span>
          <span>{hotel.area}{station.codes ? <> · <strong>{station.name}</strong> <MrtBadge codes={station.codes} /></> : null}</span>
        </div>
      </div>
    </Link>
  );
}

export function EventCard({ event }: { event: EventView }) {
  const status = eventStatus(event);
  const img = event.keyVisual ?? event.photos[0]?.thumbUrl;
  return (
    <Link href={`/automobile/${event.slug}`} className="deal-card lx-card">
      <PlaceImage src={img} alt={event.name} emoji={event.type === "Motorsport" ? "🏁" : "🚗"} />
      <div className="deal-card-body">
        <div className="lx-card-top">
          <span className="lx-pill lx-pill-soft">{event.type}</span>
          {status === "ongoing" && <span className="lx-pill lx-pill-live">Happening now</span>}
          {status === "past" && <span className="lx-pill lx-pill-muted">Ended</span>}
        </div>
        <h3 className="lx-card-title">{event.name}</h3>
        <div className="lx-event-date">📅 {formatEventDates(event)}</div>
        <p className="lx-card-text">{event.short}</p>
        <div className="lx-card-meta">
          <span aria-hidden>📍</span><span>{event.venue}</span>
        </div>
        <div className="lx-card-meta">
          <span aria-hidden>🎟️</span><span>{event.admission}</span>
        </div>
      </div>
    </Link>
  );
}

export function CoeTable({ coe, compact = false }: { coe: CoeResult; compact?: boolean }) {
  const rows = compact ? coe.latest.rows.filter(r => ["Category A", "Category B", "Category E"].includes(r.category)) : coe.latest.rows;
  return (
    <div className="lx-coe">
      <div className="lx-coe-head">
        <div>
          <div className="lx-coe-label">Latest COE results</div>
          <div className="lx-coe-round">{coe.latest.label}</div>
        </div>
        <a className="lx-coe-src" href="https://data.gov.sg/datasets/d_69b3380ad7e51aff3a7dcc84eba52b8a/view" target="_blank" rel="noopener noreferrer">
          Source: LTA via data.gov.sg
        </a>
      </div>
      <div className={`lx-coe-grid${compact ? " is-compact" : ""}`}>
        {rows.map(r => (
          <div key={r.category} className="lx-coe-cell">
            <div className="lx-coe-cat">{r.category.replace("Category ", "Cat ")}</div>
            <div className="lx-coe-desc">{COE_CATEGORIES[r.category] ?? ""}</div>
            <div className="lx-coe-premium">{sgd(r.premium)}</div>
            {r.change !== null && (
              <div className={`lx-coe-change ${r.change > 0 ? "is-up" : r.change < 0 ? "is-down" : ""}`}>
                {r.change > 0 ? "▲" : r.change < 0 ? "▼" : "■"} {sgd(Math.abs(r.change))} vs previous round
              </div>
            )}
            {!compact && (
              <div className="lx-coe-bids">
                Quota {r.quota.toLocaleString()} · Bids {r.bidsReceived.toLocaleString()} · Successful {r.bidsSuccess.toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="lx-crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={it.label}>
          {it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
          {i < items.length - 1 && <span className="lx-crumb-sep">›</span>}
        </span>
      ))}
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function MapEmbed({ lat, lon, query, title }: { lat?: number; lon?: number; query: string; title: string }) {
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  return (
    <div className="lx-map">
      {lat !== undefined && lon !== undefined ? (
        <iframe
          title={`Map of ${title}`}
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.006}%2C${lat - 0.004}%2C${lon + 0.006}%2C${lat + 0.004}&layer=mapnik&marker=${lat}%2C${lon}`}
        />
      ) : null}
      <a className="deal-card-cta lx-map-link" href={gmaps} target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>
    </div>
  );
}

export function SectionHead({ title, emoji, href, sub }: { title: string; emoji: string; href: string; sub?: string }) {
  return (
    <div className="home-section-header">
      <div>
        <div className="home-section-title">
          <span className="home-section-emoji">{emoji}</span>
          <h2 className="home-section-heading">{title}</h2>
        </div>
        {sub && <p className="lx-section-sub">{sub}</p>}
      </div>
      <Link href={href} className="home-see-all">See all →</Link>
    </div>
  );
}
