"use client";

import { useState, useEffect, useMemo } from "react";
import NavBar from "@/components/NavBar";
import DealCard from "@/components/DealCard";
import type { Deal } from "@/lib/types";

const POPULAR_TAGS = [
  "#apple", "#samsung", "#sony", "#lg", "#asus", "#lenovo",
  "#iphone", "#laptop", "#tv", "#headphones", "#gaming", "#ps5",
  "#tablet", "#camera", "#dyson", "#tech",
];

const POPULAR_STORES = [
  "Harvey Norman", "Courts", "Best Denki", "Challenger", "Gain City",
];

export const metadata = {
  title: "Electronics Deals Singapore",
  description: "Best electronics and gadget deals in Singapore — phones, laptops, TVs, headphones and more. Updated daily from Harvey Norman, Courts, Best Denki, Challenger and more.",
};

export default function ElectronicsDealsPage() {
  const [deals, setDeals]           = useState<Deal[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [query, setQuery]           = useState("");
  const [activeTag, setActiveTag]   = useState<string | null>(null);
  const [storeFilter, setStoreFilter] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/electronics-deals")
      .then(r => r.json())
      .then(data => {
        setDeals(data.deals ?? []);
        setUpdatedAt(data.updatedAt ?? null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load electronics deals. Please try again.");
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

  const availableStores = useMemo(() =>
    POPULAR_STORES.filter(store =>
      deals.some(d => d.text.toLowerCase().includes(store.toLowerCase()))
    ), [deals]);

  const filtered = useMemo(() => {
    let list = deals;
    if (activeTag)   list = list.filter(d => d.tags.includes(activeTag));
    if (storeFilter) list = list.filter(d => d.text.toLowerCase().includes(storeFilter.toLowerCase()));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(d =>
        d.text.toLowerCase().includes(q) ||
        d.tags.some(t => t.includes(q))
      );
    }
    return list;
  }, [deals, activeTag, storeFilter, query]);

  function clearFilters() {
    setQuery("");
    setActiveTag(null);
    setStoreFilter(null);
  }

  const hasFilters = !!(query || activeTag || storeFilter);

  return (
    <div className="cpc-app">
      <NavBar />

      <div className="deals-page">
        <header className="deals-hero">
          <div className="cpc-hero-eyebrow">Updated daily · Singapore electronics &amp; gadget deals</div>
          <h1 className="cpc-hero-title" style={{ fontSize: 32 }}>
            Singapore Electronics Deals
          </h1>
          <p className="cpc-hero-sub" style={{ maxWidth: 540, margin: "8px auto 0" }}>
            The latest phones, laptops, TVs, headphones and gadget sales across
            Harvey Norman, Courts, Best Denki, Challenger, Gain City and more — refreshed every night.
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
                placeholder="Search brand, product type, store…"
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

          {/* Store filters */}
          {availableStores.length > 0 && (
            <div className="deals-tags-row" style={{ marginTop: 8 }}>
              <span className="deals-filter-label">Store:</span>
              <button
                className={"deals-filter-chip" + (!storeFilter ? " is-active" : "")}
                onClick={() => setStoreFilter(null)}
              >
                All
              </button>
              {availableStores.map(store => (
                <button
                  key={store}
                  className={"deals-filter-chip" + (storeFilter === store ? " is-active" : "")}
                  onClick={() => setStoreFilter(storeFilter === store ? null : store)}
                >
                  {store}
                </button>
              ))}
            </div>
          )}
        </header>

        <div className="deals-content">
          {loading && (
            <div className="deals-state">
              <div className="deals-spinner" />
              <p>Loading electronics deals…</p>
            </div>
          )}

          {error && !loading && (
            <div className="deals-state">
              <p style={{ color: "var(--color-error)" }}>{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="deals-state">
              <div style={{ fontSize: 40 }}>📱</div>
              <p style={{ color: "var(--color-muted)" }}>
                {hasFilters ? "No deals match your search." : "No electronics deals found yet — check back tonight!"}
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
                  {activeTag ? ` tagged ${activeTag}` : ""}
                  {storeFilter ? ` · ${storeFilter}` : ""}
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
