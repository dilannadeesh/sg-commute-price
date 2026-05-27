"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { SG_AREAS, TIME_BLOCKS, FLEXAR_REGIONS_DEFAULT, quoteAll, findNearestArea, haversineKm } from "@/lib/quote";
import type { Area, TimeBlock } from "@/lib/types";
import AreaPicker from "@/components/AreaPicker";
import TimePicker from "@/components/TimePicker";
import ResultRow from "@/components/ResultRow";
import Icon from "@/components/Icon";

const DEFAULT_DEST_ID  = "tampines";
const DEFAULT_TIME_ID  = "08-10";

export default function Page() {
  const [origin, setOrigin] = useState<Area | null>(null);
  const [dest, setDest] = useState<Area | null>(
    () => SG_AREAS.find(a => a.id === DEFAULT_DEST_ID) ?? null
  );
  const [time, setTime] = useState<TimeBlock>(
    () => TIME_BLOCKS.find(t => t.id === DEFAULT_TIME_ID) ?? TIME_BLOCKS[4]
  );
  const [stopover, setStopover] = useState(1);
  const [locating, setLocating] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const nearest = findNearestArea(lat, lng);
        setOrigin({
          id:      nearest.id,
          name:    `Near ${nearest.name}`,
          region:  nearest.region,
          lat,
          lng,
          address: `Current location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        });
        setLocating(false);
      },
      () => {
        // Permission denied or unavailable — fall back to default
        setOrigin(SG_AREAS.find(a => a.id === "tiong-bahru") ?? null);
        setLocating(false);
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
    );
  }, []);

  // On mount: read URL params for dest/time, then request location for From
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toId = params.get("to");
    const tId  = params.get("t");

    if (toId) {
      const a = SG_AREAS.find(x => x.id === toId);
      if (a) setDest(a);
    }
    if (tId) {
      const t = TIME_BLOCKS.find(x => x.id === tId);
      if (t) setTime(t);
    }

    requestLocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync dest and time to URL (From excluded — it's always geolocation)
  useEffect(() => {
    const params = new URLSearchParams();
    if (dest && !dest.address) params.set("to", dest.id);
    params.set("t", time.id);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, [dest, time]);

  const flexarOpts = useMemo(
    () => ({ servicedRegions: FLEXAR_REGIONS_DEFAULT }),
    []
  );

  const results = useMemo(
    () => quoteAll(origin, dest, time, { flexar: flexarOpts, getgoStopoverHours: stopover }),
    [origin, dest, time, flexarOpts, stopover]
  );

  const km = origin && dest
    ? Math.round(haversineKm(origin.lat, origin.lng, dest.lat, dest.lng) * 1.22 * 10) / 10
    : 0;
  const bestAvail  = results.find(r => !r.unavailable);
  const worstAvail = [...results].filter(r => !r.unavailable).pop();
  const available  = results.filter(r => !r.unavailable);

  function swap() {
    const tmp = origin;
    setOrigin(dest);
    setDest(tmp);
  }

  return (
    <div className="cpc-app">
      <nav className="cpc-nav">
        <div style={{ font: "700 18px var(--font-sans)", color: "var(--color-ink)", letterSpacing: "-0.3px" }}>
          SGliving
        </div>
        <div className="cpc-nav-tabs">
          <button className="cpc-nav-tab is-active">Commute</button>
        </div>
      </nav>

      <div className="cpc-var-a">
        <header className="cpc-hero">
          <div className="cpc-hero-eyebrow">Convenience over pricing</div>
          <h1 className="cpc-hero-title">
            How much will your<br />commute really cost?
          </h1>
          <p className="cpc-hero-sub">
            Compare Grab, TADA, Gojek, Flexar, GetGo and public transport across Singapore — in real
            Singapore dollars, with peak-hour surge, Flexar station walks, and GetGo round-trip + stopover baked in.
          </p>
        </header>

        <div className="cpc-search-bar">
          <AreaPicker
            label="From"
            placeholder="Allow location or pick area"
            value={origin}
            onChange={setOrigin}
            anchor="left"
            locating={locating}
            onLocate={requestLocation}
          />
          <button
            type="button"
            className="cpc-locate-btn"
            onClick={requestLocation}
            disabled={locating}
            title="Use my current location"
            aria-label="Use my current location"
          >
            <Icon name="locate" size={18} />
          </button>
          <button className="cpc-swap" onClick={swap} aria-label="Swap">
            <Icon name="swap" size={18} />
          </button>
          <AreaPicker
            label="To"
            placeholder="Pick destination or search address"
            value={dest}
            onChange={setDest}
            anchor="left"
          />
          <div className="cpc-search-divider" />
          <TimePicker label="Leaving" value={time} onChange={setTime} />
        </div>

        {origin && dest && origin.id !== dest.id ? (
          <div className="cpc-results-grid">
            <aside className="cpc-side">
              <div className="cpc-trip-summary cpc-trip-summary-stacked">
                <div className="cpc-trip-route">
                  <div className="cpc-trip-route-row">
                    <span className="cpc-trip-pin" style={{ background: "var(--color-ink)" }}>A</span>
                    <div>
                      <div className="cpc-trip-area-name" style={{ wordBreak: "break-word" }}>
                        {origin.name}
                      </div>
                      <div className="cpc-trip-area-region">{origin.region}</div>
                    </div>
                  </div>
                  <div className="cpc-trip-route-line" />
                  <div className="cpc-trip-route-row">
                    <span className="cpc-trip-pin" style={{ background: "var(--color-primary)" }}>B</span>
                    <div>
                      <div className="cpc-trip-area-name" style={{ wordBreak: "break-word" }}>
                        {dest.name}
                      </div>
                      <div className="cpc-trip-area-region">{dest.region}</div>
                    </div>
                  </div>
                </div>
                <div className="cpc-trip-stats">
                  <div>
                    <div className="cpc-trip-stat">{km}<span>km</span></div>
                    <div className="cpc-trip-lbl">By road</div>
                  </div>
                  <div>
                    <div className="cpc-trip-stat">{time.short}</div>
                    <div className="cpc-trip-lbl">{time.surgeLabel || "Off-peak"}</div>
                  </div>
                </div>
              </div>

              {bestAvail && (
                <div className="cpc-best-callout">
                  <div className="cpc-best-eyebrow">Best value pick</div>
                  <div className="cpc-best-name">{bestAvail.platform.name}</div>
                  <div className="cpc-best-price">
                    <span>S$</span>{bestAvail.price.toFixed(2)}
                  </div>
                  <div className="cpc-best-note">
                    {bestAvail.minutes} min
                    {worstAvail && worstAvail !== bestAvail
                      ? ` · saves S$${(worstAvail.price - bestAvail.price).toFixed(2)} vs the priciest`
                      : ""}
                  </div>
                </div>
              )}
            </aside>

            <main>
              <div className="cpc-results-head">
                <h2 className="t-display-md" style={{ margin: 0 }}>
                  {available.length} way{available.length !== 1 ? "s" : ""} to get from{" "}
                  {origin.address ? "your location" : origin.name} to{" "}
                  {dest.address ? "destination" : dest.name}
                </h2>
                <div className="t-body-sm t-muted">Sorted by best value · price + time</div>
              </div>
              <p className="cpc-disclaimer">
                Prices are estimates, not 100% accurate — based on historical data collected from each platform.
              </p>
              <div className="cpc-rows">
                {results.map(q => (
                  <ResultRow
                    key={q.platformId}
                    q={q}
                    origin={origin}
                    dest={dest}
                    onGetgoStopoverChange={setStopover}
                  />
                ))}
              </div>
            </main>
          </div>
        ) : (
          <div className="cpc-empty">
            {!origin && !locating
              ? "Allow location access or pick an origin area to compare."
              : locating
              ? "Detecting your location…"
              : origin && dest && origin.id === dest.id
              ? "Origin and destination are the same area — try a different combination."
              : "Pick a destination to compare options."}
          </div>
        )}
      </div>
    </div>
  );
}
