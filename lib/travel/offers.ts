// First-time user offers shown as nudges on the travel planner and provider pages.
// Each offer hides itself after `validUntil` (Singapore time), so stale promos never show.
// Checked on 21 Nov 2026 — update this list when providers launch new welcome deals.

export type ProviderId = "grab" | "gojek" | "getgo" | "flexar";

export interface Offer {
  provider: ProviderId;
  headline: string;            // short nudge, e.g. "10% off your first ride"
  detail: string;              // conditions in plain words
  code?: string;               // promo code to copy; omitted when auto-applied
  codeLabel?: string;          // shown instead of "No code needed" when the user must bring their own code
  howTo: string;
  validUntil?: string;         // YYYY-MM-DD, last valid day (SGT); omitted = ongoing
  discount?: { kind: "percent"; pct: number; cap: number } | { kind: "fixed"; amount: number };
  source: { label: string; url: string };
}

export const OFFERS_CHECKED = "2026-11-21";

export const OFFERS: Offer[] = [
  {
    provider: "grab",
    headline: "10% off your first Grab ride",
    detail: "New users only, capped at S$2. Not valid on Saver/Hitch or metered taxis.",
    code: "NEWUSER",
    howTo: "Add the code under Offers in the Grab app before you book.",
    validUntil: "2026-11-30",
    discount: { kind: "percent", pct: 10, cap: 2 },
    source: { label: "SingSaver — Grab promo codes", url: "https://www.singsaver.com.sg/credit-card/blog/grab-food-promo-codes" },
  },
  {
    provider: "gojek",
    headline: "S$4 off your first Gojek ride",
    detail: "For new Gojek customers. No code needed — the voucher applies automatically to your first ride.",
    howTo: "Sign up in the Gojek app and book; the voucher is applied at checkout.",
    discount: { kind: "fixed", amount: 4 },
    source: { label: "Gojek Singapore — promo guide", url: "https://www.gojek.com/sg/blog/gojek-promo-codes-gocar-ridehailing-app-discount-singapore" },
  },
  {
    provider: "gojek",
    headline: "Plus S$8 in ride vouchers (4 × S$2)",
    detail: "For new users or riders who haven't used Gojek for a while.",
    code: "TRYGOJEK",
    howTo: "Redeem the code in the Gojek app to add the vouchers.",
    source: { label: "SGDTips — Gojek promo codes", url: "https://sgdtips.com/gojek-promo-codes/" },
  },
  {
    provider: "getgo",
    headline: "S$16 off your first GetGo drive",
    detail: "New users, first booking only. Covers time and mileage charges. Monday–Friday, excluding eves of and public holidays.",
    code: "LIFEGG16",
    howTo: "In the GetGo app tap Promo, add the code, then select it under payment when you book.",
    validUntil: "2026-12-31",
    discount: { kind: "fixed", amount: 16 },
    source: { label: "GetGo — Save up to $16 on family outings", url: "https://www.getgo.sg/getdeals/save-up-to-16-on-every-family-outing-with-getgo" },
  },
  {
    provider: "flexar",
    headline: "Up to S$100 in welcome vouchers",
    detail: "Accounts created in November get S$25 on sign-up, then S$15 vouchers every 5 days. Unused vouchers lapse on 30 Nov; vouchers cover rental charges only.",
    howTo: "Download Flexar, sign up and verify your account — no code needed.",
    validUntil: "2026-11-30",
    discount: { kind: "fixed", amount: 25 },
    source: { label: "Flexar — Promotions and vouchers", url: "https://www.flexar.com.sg/flexar/promotions-and-vouchers" },
  },
  {
    provider: "flexar",
    headline: "Referred? Get S$50 (5 × S$10)",
    codeLabel: "Use a friend's referral code",
    detail: "Sign up with a friend's referral code. Vouchers arrive after your first paid rental.",
    howTo: "Ask a Flexar user for their referral code and enter it when you sign up.",
    validUntil: "2026-11-30",
    source: { label: "Flexar — Promotions and vouchers", url: "https://www.flexar.com.sg/flexar/promotions-and-vouchers" },
  },
];

/** Today's date in Singapore as YYYY-MM-DD. */
export const sgToday = () => new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);

export const activeOffers = (provider?: ProviderId, today = sgToday()) =>
  OFFERS.filter(o => (!provider || o.provider === provider) && (!o.validUntil || o.validUntil >= today));

/** Saving on a fare of `price` from the provider's best active first-ride discount. */
export function firstRideSaving(provider: ProviderId, price: number, today = sgToday()): number {
  let best = 0;
  for (const o of activeOffers(provider, today)) {
    if (!o.discount) continue;
    const s = o.discount.kind === "percent" ? Math.min(o.discount.cap, (price * o.discount.pct) / 100) : Math.min(price, o.discount.amount);
    best = Math.max(best, s);
  }
  return Math.round(best * 100) / 100;
}

export const fmtUntil = (iso: string) =>
  new Date(iso + "T00:00:00+08:00").toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Singapore" });
