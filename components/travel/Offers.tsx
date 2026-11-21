"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { activeOffers, firstRideSaving, fmtUntil, sgToday, OFFERS_CHECKED, type Offer, type ProviderId } from "@/lib/travel/offers";

const NAMES: Record<ProviderId, string> = { grab: "Grab", gojek: "Gojek", getgo: "GetGo", flexar: "Flexar" };
const PAGES: Record<ProviderId, string> = {
  grab: "/travel/what-is-grab", gojek: "/travel/what-is-gojek", getgo: "/travel/what-is-getgo", flexar: "/travel/what-is-flexar",
};
const COLORS: Record<ProviderId, string> = { grab: "#00B14F", gojek: "#00880F", getgo: "#F26B21", flexar: "#5B3CC4" };

/** Re-checks expiry in the browser so an offer disappears the day after it ends, even on cached pages. */
function useToday(asOf?: string) {
  const [today, setToday] = useState(asOf ?? sgToday());
  useEffect(() => { setToday(sgToday()); }, []);
  return today;
}

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="offer-code"
      onClick={() => {
        navigator.clipboard?.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => {});
      }}
      aria-label={`Copy promo code ${code}`}
    >
      <span className="offer-code-text">{code}</span>
      <span className="offer-code-btn">{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

function OfferLine({ o, showDetail }: { o: Offer; showDetail: boolean }) {
  return (
    <div className="offer-line">
      <div className="offer-line-main">
        <strong>{o.headline}</strong>
        {o.code ? <CopyCode code={o.code} /> : <span className="offer-auto">{o.codeLabel ?? "No code needed"}</span>}
      </div>
      {showDetail && <p className="offer-detail">{o.detail} {o.howTo}</p>}
      <p className="offer-meta">
        {o.validUntil ? `Until ${fmtUntil(o.validUntil)}` : "Ongoing"} ·{" "}
        <a href={o.source.url} target="_blank" rel="noopener noreferrer">Terms</a>
      </p>
    </div>
  );
}

/** Highlighted first-timer nudge inside a provider result card. */
export function OfferNudge({ provider, low, high, asOf }: { provider: ProviderId; low?: number; high?: number; asOf?: string }) {
  const today = useToday(asOf);
  const offers = activeOffers(provider, today);
  if (!offers.length) return null;
  const saving = low !== undefined ? firstRideSaving(provider, low, today) : 0;
  const savingHigh = high !== undefined ? firstRideSaving(provider, high, today) : saving;
  return (
    <div className="offer-nudge" style={{ ["--offer-color" as string]: COLORS[provider] }}>
      <span className="offer-badge">🎁 New to {NAMES[provider]}?</span>
      {saving > 0 && low !== undefined && high !== undefined && (() => {
        const lo = Math.max(0, Math.floor(low - saving)), hi = Math.max(0, Math.ceil(high - savingHigh));
        return hi === 0
          ? <p className="offer-price">Your first trip could be <strong>free</strong> with the welcome offer</p>
          : <p className="offer-price">First trip from <strong>S${lo}–{hi}</strong> with the welcome offer</p>;
      })()}
      {offers.map(o => <OfferLine key={o.headline} o={o} showDetail={false} />)}
    </div>
  );
}

/** Strip of all current first-timer deals, for the travel page and provider guides. */
export function OffersStrip({ asOf, only, title = "🎁 First-time rider deals" }: { asOf?: string; only?: ProviderId; title?: string }) {
  const today = useToday(asOf);
  const providers: ProviderId[] = only ? [only] : ["grab", "gojek", "getgo", "flexar"];
  const groups = providers.map(p => ({ p, offers: activeOffers(p, today) })).filter(g => g.offers.length);
  if (!groups.length) return null;
  return (
    <section className="offers-strip" aria-label="New user offers">
      <h2 className="offers-title">{title}</h2>
      <p className="offers-sub">Trying a new app? These welcome offers can cut your first trip — checked {fmtUntil(OFFERS_CHECKED)}, expired deals hide automatically.</p>
      <div className={only ? "offers-grid offers-grid-one" : "offers-grid"}>
        {groups.map(({ p, offers }) => (
          <div key={p} className="offer-card" style={{ ["--offer-color" as string]: COLORS[p] }}>
            <div className="offer-card-head">
              <span className="offer-card-name">{NAMES[p]}</span>
              {!only && <Link href={PAGES[p]} className="offer-card-link">What is {NAMES[p]}?</Link>}
            </div>
            {offers.map(o => <OfferLine key={o.headline} o={o} showDetail />)}
          </div>
        ))}
      </div>
      <p className="offers-note">Offers are set by each provider and can change or run out early. SGliving isn&apos;t paid for these and doesn&apos;t use referral links.</p>
    </section>
  );
}
