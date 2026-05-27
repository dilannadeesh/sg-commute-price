"use client";

import { useState, useEffect, useMemo } from "react";
import NavBar from "@/components/NavBar";
import AirlineDealCard from "@/components/AirlineDealCard";
import type { AirlineDeal } from "@/lib/types";

const POPULAR_DESTINATIONS = [
  "Bangkok", "Bali", "Tokyo", "Osaka", "Seoul",
  "Kuala Lumpur", "Hong Kong", "Taipei", "Sydney",
  "Melbourne", "London", "Dubai", "Maldives", "Phuket",
];

const POPULAR_AIRLINES = [
  "Scoot", "AirAsia", "Jetstar", "Singapore Airlines",
  "Cathay Pacific", "Malaysia Airlines", "Emirates", "Qantas",
];

export default function AirlineDealsPage() {
  const [deals, setDeals]         = useState<AirlineDeal[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [query, setQuery]         = useState("");
  const [destFilter, setDestFilter]     = useState<string | null>(null);
  const [airlineFilter, setAirlineFilter] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/airline-deals")
      .then(r => r.json())
      .then(data => {
        setDeals(data.deals ?? []);
        setUpdatedAt(data.updatedAt ?? null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load airline deals. Please try again.");
        setLoading(false);
      });
  }, []);

  // Destinations and airlines present in current data
  const availableDestinations = useMemo(() =>
    POPULAR_DESTINATIONS.filter(d =>
      deals.some(deal => deal.destination?.toLowerCase() === d.toLowerCase())
    ), [deals]);

  const availableAirlines = useMemo(() =>
    POPULAR_AIRLINES.filter(a =>
      deals.some(deal => deal.airline?.toLowerCase() === a.toLowerCase())
    ), [deals]);

  const filtered = useMemo(() => {
    let list = deals;
    if (destFilter)    list = list.filter(d => d.destination?.toLowerCase() === destFilter.toLowerCase());
    if (airlineFilter) list = list.filter(d => d.airline?.toLowerCase() === airlineFilter.toLowerCase());
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(d =>
        d.text.toLowerCase().includes(q) ||
        d.destination?.toLowerCase().includes(q) ||
        d.airline?.toLowerCase().includes(q) ||
        d.price?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [deals, destFilter, airlineFilter, query]);

  function clearFilters() {
    setQuery("");
    setDestFilter(null);
    setAirlineFilter(null);
  }

  const hasFilters = !!(query || destFilter || airlineFilter);

  return (
    <div className="cpc-app">
      <NavBar />

      <div className="deals-page">
        <header className="deals-hero">
          <div className="cpc-hero-eyebrow">Singapore departures only · updated nightly</div>
          <h1 className="cpc-hero-title" style={{ fontSize: 32 }}>
            Singapore Airline Deals
          </h1>
          <p className="cpc-hero-sub" style={{ maxWidth: 540, margin: "8px auto 0" }}>
            Flash sales, promo fares and cheap flights from Changi Airport —
            Scoot, AirAsia, Jetstar, SIA and more. Updated every night, removed after 30 days.
          </p>

          {/* Search */}
          <div className="deals-search-wrap">
            <div className="deals-search-bar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
              </svg>
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search destination, airline or price…"
                className="deals-search-input"
              />
              {query && (
                <button className="deals-search-clear" onClick={() => setQuery("")} aria-label="Clear">✕</button>
              )}
            </div>
          </div>

          {/* Destination filters */}
          {availableDestinations.length > 0 && (
            <div className="deals-tags-row">
              <span className="deals-filter-label">Destination:</span>
              <button
                className={"deals-filter-chip" + (!destFilter ? " is-active" : "")}
                onClick={() => setDestFilter(null)}
              >
                All
              </button>
              {availableDestinations.map(dest => (
                <button
                  key={dest}
                  className={"deals-filter-chip" + (destFilter === dest ? " is-active" : "")}
                  onClick={() => setDestFilter(destFilter === dest ? null : dest)}
                >
                  {dest}
                </button>
              ))}
            </div>
          )}

          {/* Airline filters */}
          {availableAirlines.length > 0 && (
            <div className="deals-tags-row" style={{ marginTop: 8 }}>
              <span className="deals-filter-label">Airline:</span>
              <button
                className={"deals-filter-chip" + (!airlineFilter ? " is-active" : "")}
                onClick={() => setAirlineFilter(null)}
              >
                All
              </button>
              {availableAirlines.map(airline => (
                <button
                  key={airline}
                  className={"deals-filter-chip" + (airlineFilter === airline ? " is-active" : "")}
                  onClick={() => setAirlineFilter(airlineFilter === airline ? null : airline)}
                >
                  {airline}
                </button>
              ))}
            </div>
          )}
        </header>

        <div className="deals-content">
          {loading && (
            <div className="deals-state">
              <div className="deals-spinner" />
              <p>Loading airline deals…</p>
            </div>
          )}

          {error && !loading && (
            <div className="deals-state">
              <p style={{ color: "var(--color-error)" }}>{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="deals-state">
              <div style={{ fontSize: 40 }}>✈️</div>
              <p style={{ color: "var(--color-muted)" }}>
                {hasFilters ? "No deals match your search." : "No airline deals found yet — check back tonight!"}
              </p>
              {hasFilters && (
                <button className="deal-card-cta" onClick={clearFilters}>Clear filters</button>
              )}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="deals-meta-row">
                <span className="t-caption-sm">
                  {filtered.length} deal{filtered.length !== 1 ? "s" : ""}
                  {destFilter ? ` to ${destFilter}` : ""}
                  {airlineFilter ? ` · ${airlineFilter}` : ""}
                  {query ? ` matching "${query}"` : ""}
                </span>
                {updatedAt && (
                  <span className="t-caption-sm">
                    Updated {new Date(updatedAt).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                )}
              </div>
              <div className="deals-grid">
                {filtered.map(deal => (
                  <AirlineDealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
