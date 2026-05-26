"use client";

import { useState, useMemo, useEffect } from "react";
import { SG_AREAS, TIME_BLOCKS, FLEXAR_REGIONS_DEFAULT, quoteAll } from "@/lib/quote";
import type { Area, TimeBlock } from "@/lib/types";
import AreaPicker from "@/components/AreaPicker";
import TimePicker from "@/components/TimePicker";
import ResultRow from "@/components/ResultRow";
import Icon from "@/components/Icon";

const DEFAULT_ORIGIN_ID = "tiong-bahru";
const DEFAULT_DEST_ID   = "tampines";
const DEFAULT_TIME_ID   = "08-10";

function distKm(a: Area, b: Area) {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 10) / 10;
}

export default function Page() {
  const [origin, setOrigin] = useState<Area | null>(
    () => SG_AREAS.find(a => a.id === DEFAULT_ORIGIN_ID) ?? null
  );
  const [dest, setDest] = useState<Area | null>(
    () => SG_AREAS.find(a => a.id === DEFAULT_DEST_ID) ?? null
  );
  const [time, setTime] = useState<TimeBlock>(
    () => TIME_BLOCKS.find(t => t.id === DEFAULT_TIME_ID) ?? TIME_BLOCKS[4]
  );
  const [stopover, setStopover] = useState(1);

  // Sync from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromId = params.get("from");
    const toId   = params.get("to");
    const tId    = params.get("t");
    if (fromId) {
      const a = SG_AREAS.find(x => x.id === fromId);
      if (a) setOrigin(a);
    }
    if (toId) {
      const a = SG_AREAS.find(x => x.id === toId);
      if (a) setDest(a);
    }
    if (tId) {
      const t = TIME_BLOCKS.find(x => x.id === tId);
      if (t) setTime(t);
    }
  }, []);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (origin) params.set("from", origin.id);
    if (dest)   params.set("to",   dest.id);
    params.set("t", time.id);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [origin, dest, time]);

  const flexarOpts = useMemo(
    () => ({ servicedRegions: FLEXAR_REGIONS_DEFAULT }),
    []
  );

  const results = useMemo(
    () => quoteAll(origin, dest, time, { flexar: flexarOpts, getgoStopoverHours: stopover }),
    [origin, dest, time, flexarOpts, stopover]
  );

  const km = origin && dest ? distKm(origin, dest) : 0;
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
          <button className="cpc-nav-tab">Rentals</button>
          <button className="cpc-nav-tab">Experiences</button>
        </div>
        <button className="cpc-nav-cta">Get started</button>
      </nav>

      <div className="cpc-var-a">
        <header className="cpc-hero">
          <div className="cpc-hero-eyebrow">Convenience over pricing</div>
          <h1 className="cpc-hero-title">
            How much will your<br />commute really cost?
          </h1>
          <p className="cpc-hero-sub">
            Compare Grab, TADA, Gojek, Flexar, GetGo and public transport across Singapore — in real
            Singapore dollars, with peak-hour surge, Flexar station walks, and GetGo round-trip +
            stopover baked in.
          </p>
        </header>

        <div className="cpc-search-bar">
          <AreaPicker
            label="From"
            placeholder="Pick origin"
            value={origin}
            onChange={setOrigin}
            anchor="left"
          />
          <button className="cpc-swap" onClick={swap} aria-label="Swap">
            <Icon name="swap" size={18} />
          </button>
          <AreaPicker
            label="To"
            placeholder="Pick destination"
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
                      <div className="cpc-trip-area-name">{origin.name}</div>
                      <div className="cpc-trip-area-region">{origin.region}</div>
                    </div>
                  </div>
                  <div className="cpc-trip-route-line" />
                  <div className="cpc-trip-route-row">
                    <span className="cpc-trip-pin" style={{ background: "var(--color-primary)" }}>B</span>
                    <div>
                      <div className="cpc-trip-area-name">{dest.name}</div>
                      <div className="cpc-trip-area-region">{dest.region}</div>
                    </div>
                  </div>
                </div>
                <div className="cpc-trip-stats">
                  <div>
                    <div className="cpc-trip-stat">
                      {km}<span>km</span>
                    </div>
                    <div className="cpc-trip-lbl">Door to door</div>
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
                  {available.length} way{available.length !== 1 ? "s" : ""} to get from {origin.name} to {dest.name}
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
            Pick a different origin and destination to compare.
          </div>
        )}
      </div>
    </div>
  );
}
