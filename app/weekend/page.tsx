"use client";

import { useState, useEffect, useMemo } from "react";
import NavBar from "@/components/NavBar";
import DealCard from "@/components/DealCard";
import type { Deal } from "@/lib/types";

const POPULAR_TAGS = [
  "#outdoor", "#indoor", "#family", "#kids", "#free",
  "#hiking", "#beach", "#museum", "#arts", "#sports",
  "#events", "#promo",
];

export default function WeekendPage() {
  const [deals, setDeals]         = useState<Deal[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [query, setQuery]         = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/weekend")
      .then(r => r.json())
      .then(data => {
        setDeals(data.deals ?? []);
        setUpdatedAt(data.updatedAt ?? null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load weekend listings. Please try again.");
        setLoading(false);
      });
  }, []);

  const availableTags = useMemo(() => {
    const counts: Record<string, number> = {};
    deals.forEach(d => d.tags.filter(t => t !== "#deals").forEach(t => {
      counts[t] = (counts[t] ?? 0) + 1;
    }));
    return POPULAR_TAGS.filter(t => counts[t]);
  }, [deals]);

  const filtered = useMemo(() => {
    let list = deals;
    if (activeTag) list = list.filter(d => d.tags.includes(activeTag));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(d =>
        d.text.toLowerCase().includes(q) ||
        d.tags.some(t => t.includes(q))
      );
    }
    return list;
  }, [deals, activeTag, query]);

  return (
    <div className="cpc-app">
      <NavBar />

      <div className="deals-page">
        <header className="deals-hero">
          <div className="cpc-hero-eyebrow">Updated daily · sourced from @sgweekend</div>
          <h1 className="cpc-hero-title" style={{ fontSize: 32 }}>
            Singapore Weekend Activities
          </h1>
          <p className="cpc-hero-sub" style={{ maxWidth: 540, margin: "8px auto 0" }}>
            The best things to do in Singapore this weekend — outdoor adventures,
            family events, arts & culture, sports and deals. Only posts tagged
            <strong> #deals</strong> with a direct link.
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
                placeholder="Search activities, events, places…"
                className="deals-search-input"
              />
              {query && (
                <button className="deals-search-clear" onClick={() => setQuery("")} aria-label="Clear">✕</button>
              )}
            </div>
          </div>

          {/* Tag filters */}
          {availableTags.length > 0 && (
            <div className="deals-tags-row">
              <button
                className={"deals-filter-chip" + (activeTag === null ? " is-active" : "")}
                onClick={() => setActiveTag(null)}
              >
                All
              </button>
              {availableTags.map(tag => (
                <button
                  key={tag}
                  className={"deals-filter-chip" + (activeTag === tag ? " is-active" : "")}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </header>

        <div className="deals-content">
          {loading && (
            <div className="deals-state">
              <div className="deals-spinner" />
              <p>Loading weekend activities…</p>
            </div>
          )}

          {error && !loading && (
            <div className="deals-state">
              <p style={{ color: "var(--color-error)" }}>{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="deals-state">
              <div style={{ fontSize: 40 }}>🌤️</div>
              <p style={{ color: "var(--color-muted)" }}>
                {query || activeTag ? "No activities match your search." : "No weekend listings found yet — check back soon!"}
              </p>
              {(query || activeTag) && (
                <button className="deal-card-cta" onClick={() => { setQuery(""); setActiveTag(null); }}>
                  Clear filters
                </button>
              )}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="deals-meta-row">
                <span className="t-caption-sm">
                  {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
                  {activeTag ? ` tagged ${activeTag}` : ""}
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
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
