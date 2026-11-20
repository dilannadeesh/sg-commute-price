"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface Place { name: string; address: string; lat: number; lng: number }
interface Leg { mode: "walk" | "bus" | "rail"; line?: string; lineName?: string; color?: string; from: string; to: string; stops?: number; minutes: number; km: number; detail?: string }
interface Transit { source: "onemap" | "estimate"; minutes: number; fare: number; km: number; transfers: number; walkMinutes: number; legs: Leg[]; notes: string[] }
interface Quote { id: string; name: string; kind: string; available: boolean; low: number; high: number; minutes: number; waitMinutes?: number; summary: string; breakdown: string[]; note?: string }
interface Plan { when: string; straightKm: number; road: { km: number; min: number; source: string }; transit: Transit; fareTable: string; providers: Quote[] }

const PROVIDER_PAGE: Record<string, string> = {
  grab: "/travel/what-is-grab", gojek: "/travel/what-is-gojek", getgo: "/travel/what-is-getgo", flexar: "/travel/what-is-flexar",
};
const PROVIDER_COLOR: Record<string, string> = { grab: "#00B14F", gojek: "#00880F", getgo: "#F26B21", flexar: "#5B3CC4" };

const sgNow = () => {
  const d = new Date(Date.now() + 8 * 3600_000);
  return d.toISOString().slice(0, 16);
};
const money = (n: number) => `S$${n.toFixed(2)}`;
const fmtMin = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`);
const inSG = (lat: number, lng: number) => lat > 1.15 && lat < 1.48 && lng > 103.59 && lng < 104.1;

function PlaceInput({ label, value, onPick, placeholder, extra }: {
  label: string; value: Place | null; onPick: (p: Place | null) => void; placeholder: string; extra?: React.ReactNode;
}) {
  const [q, setQ] = useState(value?.name ?? "");
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = label.toLowerCase().replace(/\W+/g, "-");

  useEffect(() => { setQ(value?.name ?? ""); }, [value]);

  const search = (text: string) => {
    setQ(text);
    onPick(null);
    if (timer.current) clearTimeout(timer.current);
    if (text.trim().length < 2) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/travel/search?q=${encodeURIComponent(text.trim())}`);
        const j = await r.json();
        setResults(j.results ?? []); setOpen(true); setActive(-1);
      } catch { setResults([]); }
    }, 250);
  };
  const pick = (p: Place) => { onPick(p); setQ(p.name); setOpen(false); setResults([]); };

  return (
    <div className="tp-field">
      <label htmlFor={id} className="tp-label">{label}</label>
      <div className="tp-input-wrap">
        <input
          id={id} className="tp-input" value={q} placeholder={placeholder} autoComplete="off"
          role="combobox" aria-expanded={open && results.length > 0} aria-controls={`${id}-list`}
          onChange={e => search(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={e => {
            if (!open || !results.length) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(results.length - 1, a + 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
            if (e.key === "Enter" && active >= 0) { e.preventDefault(); pick(results[active]); }
          }}
        />
        {extra}
      </div>
      {open && results.length > 0 && (
        <ul id={`${id}-list`} className="tp-suggest" role="listbox">
          {results.map((r, i) => (
            <li key={r.name + r.lat} role="option" aria-selected={i === active} className={i === active ? "is-active" : ""}
              onMouseDown={e => { e.preventDefault(); pick(r); }}>
              <span className="tp-suggest-name">{r.name}</span>
              <span className="tp-suggest-addr">{r.address}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LegRow({ leg }: { leg: Leg }) {
  const icon = leg.mode === "walk" ? "🚶" : leg.mode === "bus" ? "🚌" : "🚇";
  return (
    <li className={`tp-leg tp-leg-${leg.mode}`}>
      <span className="tp-leg-icon" aria-hidden>{icon}</span>
      <div className="tp-leg-body">
        {leg.mode === "rail" ? (
          <>
            <span className="tp-line-badge" style={{ background: leg.color ?? "#555" }}>{leg.line}</span>{" "}
            <strong>{leg.lineName}</strong>
            <div className="tp-leg-sub">{leg.from} → {leg.to} · {leg.stops} stop{leg.stops === 1 ? "" : "s"}</div>
          </>
        ) : leg.mode === "bus" ? (
          <>
            <strong>{leg.detail ?? "Bus"}</strong>
            <div className="tp-leg-sub">{leg.from} → {leg.to}</div>
          </>
        ) : (
          <>
            <strong>Walk</strong>{leg.km > 0 && <span className="tp-leg-sub"> · {leg.km < 1 ? `${Math.round(leg.km * 1000)} m` : `${leg.km} km`}</span>}
            <div className="tp-leg-sub">{leg.from} → {leg.to}</div>
          </>
        )}
      </div>
      <span className="tp-leg-min">{fmtMin(leg.minutes)}</span>
    </li>
  );
}

export default function TravelPlanner() {
  const [origin, setOrigin] = useState<Place | null>(null);
  const [dest, setDest] = useState<Place | null>(null);
  const [when, setWhen] = useState("");
  const [stay, setStay] = useState(1);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setWhen(sgNow()); }, []);

  const locate = useCallback(() => {
    if (!navigator.geolocation) { setError("Your browser doesn't support location."); return; }
    setLocating(true); setError(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocating(false);
        const { latitude: lat, longitude: lng } = pos.coords;
        if (!inSG(lat, lng)) { setError("Your current location doesn't look like it's in Singapore — search for a starting point instead."); return; }
        setOrigin({ name: "My current location", address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng });
      },
      () => { setLocating(false); setError("We couldn't get your location. Check location permission, or search for a starting point."); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  const run = useCallback(async () => {
    if (!origin || !dest) { setError("Choose a starting point and a destination from the suggestions."); return; }
    setLoading(true); setError(null);
    try {
      const qs = new URLSearchParams({
        from: `${origin.lat},${origin.lng}`, to: `${dest.lat},${dest.lng}`,
        fromName: origin.name, toName: dest.name, t: when || sgNow(), stay: String(stay),
      });
      const r = await fetch(`/api/travel/plan?${qs}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Something went wrong.");
      setPlan(j);
      setTimeout(() => document.getElementById("tp-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setLoading(false); }
  }, [origin, dest, when, stay]);

  // Re-quote GetGo when the stopover changes after a search
  useEffect(() => { if (plan) run(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [stay]);

  const avail = plan ? plan.providers.filter(p => p.available) : [];
  const cheapestId = plan ? [...avail].sort((a, b) => a.low - b.low)[0]?.id : null;
  const fastestRide = plan ? [...avail].sort((a, b) => a.minutes - b.minutes)[0] : null;
  const transitFastest = plan && fastestRide ? plan.transit.minutes <= fastestRide.minutes : false;

  return (
    <div className="tp">
      <form className="tp-form" onSubmit={e => { e.preventDefault(); run(); }}>
        <PlaceInput
          label="From" value={origin} onPick={setOrigin} placeholder="Address, postal code, MRT or place"
          extra={<button type="button" className="tp-locate" onClick={locate} disabled={locating} aria-label="Use my current location">{locating ? "Locating…" : "📍 Use my location"}</button>}
        />
        <button type="button" className="tp-swap" aria-label="Swap origin and destination" onClick={() => { const o = origin; setOrigin(dest); setDest(o); }}>⇅</button>
        <PlaceInput label="To" value={dest} onPick={setDest} placeholder="Where are you going?" />
        <div className="tp-row">
          <div className="tp-field">
            <label htmlFor="tp-when" className="tp-label">Leaving at</label>
            <input id="tp-when" type="datetime-local" className="tp-input" value={when} onChange={e => setWhen(e.target.value)} />
          </div>
          <button type="button" className="tp-now" onClick={() => setWhen(sgNow())}>Now</button>
        </div>
        <button type="submit" className="tp-go" disabled={loading}>{loading ? "Finding routes…" : "Compare routes & prices"}</button>
        {error && <p className="tp-error" role="alert">{error}</p>}
      </form>

      {plan && (
        <section id="tp-results" className="tp-results" aria-live="polite">
          <h2 className="tp-results-title">{origin?.name ?? "Origin"} → {dest?.name ?? "Destination"}</h2>
          <p className="tp-results-meta">Leaving {plan.when.replace(" ", " at ")} · {plan.road.km} km by road</p>

          <article className="tp-card tp-card-pt">
            <header className="tp-card-head">
              <div>
                <span className="tp-tag">{transitFastest ? "Best route · fastest" : "Best public transport route"}</span>
                <h3>🚇 MRT &amp; bus</h3>
              </div>
              <div className="tp-price">
                <strong>{plan.transit.fare === 0 ? "Free" : money(plan.transit.fare)}</strong>
                <span>{fmtMin(plan.transit.minutes)}</span>
              </div>
            </header>
            <p className="tp-card-sub">
              {plan.transit.transfers === 0 ? "No transfers" : `${plan.transit.transfers} transfer${plan.transit.transfers > 1 ? "s" : ""}`} · {plan.transit.walkMinutes} min walking · {plan.fareTable}
            </p>
            <ol className="tp-legs">{plan.transit.legs.map((l, i) => <LegRow key={i} leg={l} />)}</ol>
            <ul className="tp-notes">
              <li>{plan.transit.source === "onemap" ? "Live itinerary from OneMap (Singapore Land Authority)." : "Route estimated by SGliving from the MRT/LRT network; check bus numbers in a live app before you go."}</li>
              {plan.transit.notes.filter(n => !n.startsWith("Live itinerary")).map(n => <li key={n}>{n}</li>)}
            </ul>
          </article>

          <div className="tp-grid">
            {plan.providers.map(p => (
              <article key={p.id} className={"tp-card" + (p.available ? "" : " is-unavailable")} style={{ borderTopColor: PROVIDER_COLOR[p.id] }}>
                <header className="tp-card-head">
                  <div>
                    {p.available && p.id === cheapestId && <span className="tp-tag tp-tag-green">Cheapest ride</span>}
                    {p.available && fastestRide?.id === p.id && p.id !== cheapestId && <span className="tp-tag">Fastest ride</span>}
                    <h3>{p.name}</h3>
                    <span className="tp-kind">{p.kind === "ride-hail" ? "Ride-hailing" : "Car-sharing (self-drive)"}</span>
                  </div>
                  <div className="tp-price">
                    {p.available ? <strong>S${p.low}–{p.high}</strong> : <strong>Not available</strong>}
                    {p.available && <span>{fmtMin(p.minutes)}{p.waitMinutes ? ` + ~${p.waitMinutes} min wait` : ""}</span>}
                  </div>
                </header>
                <p className="tp-card-sub">{p.summary}</p>
                <ul className="tp-breakdown">{p.breakdown.map(b => <li key={b}>{b}</li>)}</ul>
                {p.id === "getgo" && (
                  <label className="tp-stay">Time at destination{" "}
                    <select value={stay} onChange={e => setStay(Number(e.target.value))}>
                      {[0, 0.5, 1, 2, 3, 4, 6, 8].map(h => <option key={h} value={h}>{h === 0 ? "None (drop and return)" : `${h} h`}</option>)}
                    </select>
                  </label>
                )}
                {p.note && <p className="tp-note">{p.note}</p>}
                <Link className="tp-more" href={PROVIDER_PAGE[p.id]}>What is {p.name}? →</Link>
              </article>
            ))}
          </div>
          <p className="tp-disclaimer">
            Ride-hailing and car-sharing prices are SGliving estimates from published fees and typical fares, shown as a range. The fare in each app at booking is the one you pay. Public transport fares are the official adult card fares.
          </p>
        </section>
      )}
    </div>
  );
}
