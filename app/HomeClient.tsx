"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import DealCard from "@/components/DealCard";
import AirlineDealCard from "@/components/AirlineDealCard";
import type { Deal, AirlineDeal } from "@/lib/types";

function SectionHeader({ title, emoji, href }: { title: string; emoji: string; href: string }) {
  return (
    <div className="home-section-header">
      <div className="home-section-title">
        <span className="home-section-emoji">{emoji}</span>
        <h2 className="home-section-heading">{title}</h2>
      </div>
      <Link href={href} className="home-see-all">
        See all →
      </Link>
    </div>
  );
}

export default function HomePage() {
  const [foodDeals, setFoodDeals]               = useState<Deal[]>([]);
  const [supermarketDeals, setSupermarketDeals] = useState<Deal[]>([]);
  const [electronicsDeals, setElectronicsDeals] = useState<Deal[]>([]);
  const [airlineDeals, setAirlineDeals]         = useState<AirlineDeal[]>([]);

  const [loadingStates, setLoadingStates] = useState({
    food: true, supermarket: true, electronics: true, airline: true,
  });

  useEffect(() => {
    Promise.allSettled([
      fetch("/api/deals").then(r => r.json()),
      fetch("/api/supermarket-deals").then(r => r.json()),
      fetch("/api/electronics-deals").then(r => r.json()),
      fetch("/api/airline-deals").then(r => r.json()),
    ]).then(([food, super_, elec, airline]) => {
      if (food.status === "fulfilled")    setFoodDeals((food.value.deals ?? []).slice(0, 3));
      if (super_.status === "fulfilled")  setSupermarketDeals((super_.value.deals ?? []).slice(0, 3));
      if (elec.status === "fulfilled")    setElectronicsDeals((elec.value.deals ?? []).slice(0, 3));
      if (airline.status === "fulfilled") setAirlineDeals((airline.value.deals ?? []).slice(0, 3));
      setLoadingStates({ food: false, supermarket: false, electronics: false, airline: false });
    });
  }, []);

  return (
    <div className="cpc-app">
      <NavBar />

      {/* Hero */}
      <div className="home-hero">
        <div className="home-hero-inner">
          <div className="cpc-hero-eyebrow">Singapore&apos;s best deals — updated nightly</div>
          <h1 className="cpc-hero-title">SGliving Deals</h1>
          <p className="cpc-hero-sub">
            Food, supermarket, electronics &amp; airline deals in Singapore —
            aggregated daily so you never miss a bargain.
          </p>

          {/* Category nav cards */}
          <div className="home-cat-grid">
            <Link href="/food-deals" className="home-cat-card home-cat-food">
              <span className="home-cat-emoji">🍔</span>
              <span className="home-cat-label">Food Deals</span>
              <span className="home-cat-sub">Restaurants &amp; promos</span>
            </Link>
            <Link href="/supermarket-deals" className="home-cat-card home-cat-super">
              <span className="home-cat-emoji">🛒</span>
              <span className="home-cat-label">Supermarket</span>
              <span className="home-cat-sub">FairPrice, Giant &amp; more</span>
            </Link>
            <Link href="/electronics-deals" className="home-cat-card home-cat-elec">
              <span className="home-cat-emoji">📱</span>
              <span className="home-cat-label">Electronics</span>
              <span className="home-cat-sub">Phones, laptops &amp; gadgets</span>
            </Link>
            <Link href="/airline-deals" className="home-cat-card home-cat-air">
              <span className="home-cat-emoji">✈️</span>
              <span className="home-cat-label">Airline Deals</span>
              <span className="home-cat-sub">Flights from Changi (SIN)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Food Deals section */}
      <section className="home-section">
        <div className="home-section-inner">
          <SectionHeader title="Food Deals" emoji="🍔" href="/food-deals" />
          {loadingStates.food ? (
            <div className="home-deals-loading">
              <div className="deals-spinner" /><p>Loading food deals…</p>
            </div>
          ) : foodDeals.length > 0 ? (
            <div className="deals-grid home-preview-grid">
              {foodDeals.map(deal => <DealCard key={deal.id} deal={deal} />)}
            </div>
          ) : (
            <p className="home-empty">No food deals right now — check back tonight!</p>
          )}
        </div>
      </section>

      {/* Supermarket section */}
      <section className="home-section home-section-alt">
        <div className="home-section-inner">
          <SectionHeader title="Supermarket Deals" emoji="🛒" href="/supermarket-deals" />
          {loadingStates.supermarket ? (
            <div className="home-deals-loading">
              <div className="deals-spinner" /><p>Loading supermarket deals…</p>
            </div>
          ) : supermarketDeals.length > 0 ? (
            <div className="deals-grid home-preview-grid">
              {supermarketDeals.map(deal => <DealCard key={deal.id} deal={deal} />)}
            </div>
          ) : (
            <p className="home-empty">No supermarket deals right now — check back tonight!</p>
          )}
        </div>
      </section>

      {/* Electronics section */}
      <section className="home-section">
        <div className="home-section-inner">
          <SectionHeader title="Electronics Deals" emoji="📱" href="/electronics-deals" />
          {loadingStates.electronics ? (
            <div className="home-deals-loading">
              <div className="deals-spinner" /><p>Loading electronics deals…</p>
            </div>
          ) : electronicsDeals.length > 0 ? (
            <div className="deals-grid home-preview-grid">
              {electronicsDeals.map(deal => <DealCard key={deal.id} deal={deal} />)}
            </div>
          ) : (
            <p className="home-empty">No electronics deals right now — check back tonight!</p>
          )}
        </div>
      </section>

      {/* Airline Deals section */}
      <section className="home-section home-section-alt">
        <div className="home-section-inner">
          <SectionHeader title="Airline Deals from Singapore" emoji="✈️" href="/airline-deals" />
          {loadingStates.airline ? (
            <div className="home-deals-loading">
              <div className="deals-spinner" /><p>Loading airline deals…</p>
            </div>
          ) : airlineDeals.length > 0 ? (
            <div className="deals-grid home-preview-grid">
              {airlineDeals.map(deal => <AirlineDealCard key={deal.id} deal={deal} />)}
            </div>
          ) : (
            <p className="home-empty">No airline deals right now — check back tonight!</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p className="home-footer-text">
          SGliving — Singapore&apos;s daily deals hub · Updated every night at midnight
        </p>
        <div className="home-footer-links">
          <Link href="/weekend" className="home-footer-link">Weekend Activities</Link>
          <Link href="/commute" className="home-footer-link">Commute Prices</Link>
        </div>
      </footer>
    </div>
  );
}
