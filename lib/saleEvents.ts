import type { Deal, AirlineDeal } from "./types";
import type { SeoPageKey } from "./seoContent";

/**
 * Seasonal sale hubs (Black Friday, 12.12, …). Each event gets an evergreen URL that is
 * reused every year — update `year`, `dates` and the copy each season, never the path.
 */
export type SaleKey = "blackfriday" | "twelvetwelve";
export type SaleSectionKey = "electronics" | "supermarket" | "food" | "flights";

export interface SaleEvent {
  key: SaleKey;
  path: string;
  year: number;
  /** Short name used in headings, e.g. "Black Friday". */
  name: string;
  h1: string;
  intro: string;
  /** Matches posts that belong to this sale. */
  pattern: RegExp;
  keyDates: { label: string; date: string }[];
  /** Event window in Singapore time (inclusive dates, YYYY-MM-DD). */
  start: string;
  end: string;
  /** Status lines for before / during / after the event. */
  status: { before: (days: number) => string; during: string; after: string };
  sections: Record<SaleSectionKey, string>;
  seo: SeoPageKey;
  breadcrumb: string;
  /** Other sale hub to cross-link from the hero. */
  sibling?: { href: string; label: string };
}

export const SALE_EVENTS: Record<SaleKey, SaleEvent> = {
  blackfriday: {
    key: "blackfriday",
    path: "/black-friday-deals-singapore",
    year: 2026,
    name: "Black Friday",
    h1: "Black Friday Deals Singapore 2026",
    intro:
      "Every Black Friday and Cyber Monday promotion we can find in Singapore, in one list: electronics, supermarkets, food and flights. Collected from public deal channels and refreshed every night.",
    pattern: /black\s*friday|cyber\s*monday|\bbfcm\b|#bf\b|#blackfriday|#cybermonday/i,
    keyDates: [
      { label: "Black Friday", date: "Fri 27 Nov 2026" },
      { label: "Cyber Monday", date: "Mon 30 Nov 2026" },
      { label: "12.12 sale", date: "Sat 12 Dec 2026" },
    ],
    start: "2026-11-27",
    end: "2026-11-30",
    status: {
      before: d => (d === 1 ? "Black Friday is tomorrow, Fri 27 Nov" : `Black Friday is Fri 27 Nov: ${d} days to go`),
      during: "Black Friday weekend is on now, until Cyber Monday 30 Nov",
      after: "Black Friday 2026 has ended. Next up: 12.12 on Sat 12 Dec",
    },
    sections: {
      electronics: "Phones, laptops, TVs, gaming and appliances from Courts, Harvey Norman, Challenger, Best Denki, Gain City and more.",
      supermarket: "Promotions from NTUC FairPrice, Cold Storage, Giant, Sheng Siong, Don Don Donki and online grocers.",
      food: "Restaurant promos, 1-for-1s and delivery-app codes running over the Black Friday weekend.",
      flights: "Flash sales and promo fares from Changi for the year-end school holidays and 2027 trips.",
    },
    seo: "blackfriday",
    breadcrumb: "Black Friday Deals",
    sibling: { href: "/12-12-sale-singapore", label: "12.12 sale deals →" },
  },

  twelvetwelve: {
    key: "twelvetwelve",
    path: "/12-12-sale-singapore",
    year: 2026,
    name: "12.12",
    h1: "12.12 Sale Singapore 2026",
    intro:
      "The best 12.12 promotions in Singapore, in one list: electronics, supermarkets, food and flights, plus tips for Shopee and Lazada's biggest year-end sale. Collected from public deal channels and refreshed every night.",
    // "12.12" but not prices like S$12.12 or dates like 12.12.2026's neighbours; also 1212 / double 12.
    pattern: /(?<![\d$.])12\.12(?![\d])|#1212\b|\b1212\s*sale|double\s*12|twelve\s*twelve/i,
    keyDates: [
      { label: "12.12 sale", date: "Sat 12 Dec 2026" },
      { label: "Christmas", date: "Fri 25 Dec 2026" },
      { label: "Boxing Day", date: "Sat 26 Dec 2026" },
    ],
    start: "2026-12-12",
    end: "2026-12-12",
    status: {
      before: d => (d === 1 ? "12.12 is tomorrow, Sat 12 Dec" : `12.12 is Sat 12 Dec: ${d} days to go`),
      during: "12.12 is today. Most flash deals run until midnight",
      after: "12.12 2026 has ended. Next up: Christmas and Boxing Day sales",
    },
    sections: {
      electronics: "Phones, laptops, TVs and appliances on 12.12, from electronics chains and official brand stores on Shopee and Lazada.",
      supermarket: "12.12 grocery promotions from FairPrice, Cold Storage, Sheng Siong, Don Don Donki and online grocers.",
      food: "Restaurant promos, 1-for-1s and delivery-app codes running on 12.12.",
      flights: "12.12 flash sales and promo fares from Changi for holidays in 2027.",
    },
    seo: "twelvetwelve",
    breadcrumb: "12.12 Sale",
    sibling: { href: "/black-friday-deals-singapore", label: "Black Friday deals →" },
  },
};

export function matchesSale(ev: SaleEvent, d: { text?: string; excerpt?: string; tags?: string[] }): boolean {
  return ev.pattern.test(`${d.text ?? ""} ${d.excerpt ?? ""} ${(d.tags ?? []).join(" ")}`);
}

export interface SaleSection<T> {
  key: SaleSectionKey;
  title: string;
  sub: string;
  href: string;
  hrefLabel: string;
  /** Posts that mention this sale. */
  matched: T[];
  /** Latest posts from the category, shown only when nothing matched (clearly labelled). */
  fallback: T[];
}

const SECTION_META: Record<SaleSectionKey, { title: (n: string) => string; href: string; hrefLabel: string }> = {
  electronics: { title: n => `${n} electronics deals`, href: "/electronics-deals", hrefLabel: "All electronics deals" },
  supermarket: { title: n => `${n} supermarket & grocery deals`, href: "/supermarket-deals", hrefLabel: "All supermarket deals" },
  food:        { title: n => `${n} food & dining deals`, href: "/food-deals", hrefLabel: "All food deals" },
  flights:     { title: n => `${n} flight deals from Singapore`, href: "/airline-deals", hrefLabel: "All airline deals" },
};

export function buildSection<T extends Deal | AirlineDeal>(
  ev: SaleEvent, key: SaleSectionKey, deals: T[], fallbackCount = 6,
): SaleSection<T> {
  const m = SECTION_META[key];
  const sorted = [...deals].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const matched = sorted.filter(d => matchesSale(ev, d));
  return {
    key, title: m.title(ev.name), sub: ev.sections[key], href: m.href, hrefLabel: m.hrefLabel,
    matched, fallback: matched.length ? [] : sorted.slice(0, fallbackCount),
  };
}

const DAY = 86_400_000;
const sgMidnight = (iso: string) => new Date(`${iso}T00:00:00+08:00`).getTime();

/** One-line hero status: countdown before, "on now" during, "ended" after (Singapore time). */
export function saleStatus(ev: SaleEvent, now = Date.now()): string {
  const start = sgMidnight(ev.start);
  const end = sgMidnight(ev.end) + DAY;
  if (now < start) return ev.status.before(Math.ceil((start - now) / DAY));
  if (now < end) return ev.status.during;
  return ev.status.after;
}
