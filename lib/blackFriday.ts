import type { Deal, AirlineDeal } from "./types";

/** Black Friday 2026 key dates (Singapore time). Update the year + dates each November. */
export const BF_YEAR = 2026;
export const BF_DATES = {
  blackFriday: "2026-11-27",
  cyberMonday: "2026-11-30",
  twelveTwelve: "2026-12-12",
} as const;

const BF_PATTERN = /black\s*friday|cyber\s*monday|\bbfcm\b|#bf\b|#blackfriday|#cybermonday/i;

/** True when a deal post mentions Black Friday or Cyber Monday in its text, excerpt or tags. */
export function isBlackFridayDeal(d: { text?: string; excerpt?: string; tags?: string[] }): boolean {
  return BF_PATTERN.test(`${d.text ?? ""} ${d.excerpt ?? ""} ${(d.tags ?? []).join(" ")}`);
}

export type BfSectionKey = "electronics" | "supermarket" | "food" | "flights";

export interface BfSection<T> {
  key: BfSectionKey;
  title: string;
  sub: string;
  href: string;
  hrefLabel: string;
  /** Posts that mention Black Friday / Cyber Monday. */
  matched: T[];
  /** Latest posts from the category, shown only when nothing matched (clearly labelled). */
  fallback: T[];
}

export function buildSection<T extends Deal | AirlineDeal>(
  base: Omit<BfSection<T>, "matched" | "fallback">,
  deals: T[],
  fallbackCount = 6,
): BfSection<T> {
  const sorted = [...deals].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const matched = sorted.filter(isBlackFridayDeal);
  return { ...base, matched, fallback: matched.length ? [] : sorted.slice(0, fallbackCount) };
}

const DAY = 86_400_000;
const sgMidnight = (iso: string) => new Date(`${iso}T00:00:00+08:00`).getTime();

/** One-line status for the hero: countdown before, "on now" during, "ended" after. */
export function bfStatus(now = Date.now()): string {
  const bf = sgMidnight(BF_DATES.blackFriday);
  const cmEnd = sgMidnight(BF_DATES.cyberMonday) + DAY;
  if (now < bf) {
    const days = Math.ceil((bf - now) / DAY);
    return days === 1 ? "Black Friday is tomorrow, Fri 27 Nov" : `Black Friday is Fri 27 Nov: ${days} days to go`;
  }
  if (now < cmEnd) return "Black Friday weekend is on now, until Cyber Monday 30 Nov";
  return `Black Friday ${BF_YEAR} has ended. Next up: 12.12 on Sat 12 Dec`;
}
