"use client";

import { useState, useEffect, useMemo } from "react";
import NavBar from "@/components/NavBar";
import DealCard from "@/components/DealCard";
import type { Deal } from "@/lib/types";

const POPULAR_TAGS = [
  "#fairprice", "#ntuc", "#coldstorage", "#giant", "#shengsiong", "#donki",
  "#grocery", "#meat", "#seafood", "#vegetable", "#fruit", "#drinks",
  "#personalcare", "#household", "#frozen", "#dairy",
];

export const metadata = {
  title: "Supermarket Deals Singapore",
  description: "Best supermarket deals and grocery promotions in Singapore — NTUC FairPrice, Cold Storage, Giant, Sheng Siong and more. Updated daily.",
};

export default function SupermarketDealsPage() {
  const [deals, setDeals]           = useState<Deal[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [query, setQuery]           = useState("");
  const [activeTag, setActiveTag]   = useState<string | null>(null);
  const [updatedAt, setUpdatedAt]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/supermarket-deals")
      .then(r => r.json())
      .then(data => {
        setDeals(data.deals ?? []);
        setUpdatedAt(data.updatedAt ?? null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load supermarket deals. Please try again.");
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
          <div className="cpc-hero-eyebrow">Updated daily · Singapore supermarkets &amp; grocery stores</div>
          <h1 className="cpc-hero-title" style={{ fontSize: 32 }}>
            Singapore Supermarket Deals
          </h1>
          <p className="cpc-hero-sub" style={{ maxWidth: 540, margin: "8px auto 0" }}>
            The freshest promotions from NTUC FairPrice, Cold Storage, Giant, Sheng Siong,
            Don Don Donki and more — refreshed every night.
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
                placeholder="Search supermarkets, products, promo codes…"
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
              <p>Loading supermarket deals…</p>
            </div>
          )}

          {error && !loading && (
            <div className="deals-state">
              <p style={{ color: "var(--color-error)" }}>{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="deals-state">
              <div style={{ fontSize: 40 }}>🛒</div>
              <p style={{ color: "var(--color-muted)" }}>
                {query || activeTag ? "No deals match your search." : "No supermarket deals found yet — check back tonight!"}
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
                  {filtered.length} deal{filtered.length !== 1 ? "s" : ""}
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
