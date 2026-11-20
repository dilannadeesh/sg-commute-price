import { WEEK } from "./wiki";

// Full COE bidding history (Jan 2010 → latest) from LTA's open data on data.gov.sg.
// Cached for a week and tagged "automobile" + "coe" so the weekly cron refreshes it.

export interface CoeCategoryInfo { slug: string; key: string; short: string; name: string; covers: string }

export const COE_CATS: CoeCategoryInfo[] = [
  { slug: "cat-a", key: "Category A", short: "Cat A", name: "COE Category A", covers: "Cars up to 1,600cc and 97kW (130bhp); electric cars up to 110kW" },
  { slug: "cat-b", key: "Category B", short: "Cat B", name: "COE Category B", covers: "Cars above 1,600cc or 97kW (130bhp); electric cars above 110kW" },
  { slug: "cat-c", key: "Category C", short: "Cat C", name: "COE Category C", covers: "Goods vehicles and buses" },
  { slug: "cat-d", key: "Category D", short: "Cat D", name: "COE Category D", covers: "Motorcycles" },
  { slug: "cat-e", key: "Category E", short: "Cat E", name: "COE Category E (Open)", covers: "Any vehicle except motorcycles" },
];
export const getCoeCat = (slug: string) => COE_CATS.find(c => c.slug === slug);

export interface CoePoint { month: string; bidding: number; label: string; premium: number; quota: number; bidsReceived: number; bidsSuccess: number }

interface Raw { month: string; bidding_no: string; vehicle_class: string; quota: string; bids_success: string; bids_received: string; premium: string }

const num = (s: string) => Number(String(s).replace(/,/g, "")) || 0;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const roundShort = (month: string, bidding: number) =>
  `${MONTHS[Number(month.slice(5, 7)) - 1]} ${month.slice(0, 4)} (${bidding === 1 ? "1st" : "2nd"})`;

export async function getCoeHistory(): Promise<Record<string, CoePoint[]> | null> {
  try {
    const url = "https://data.gov.sg/api/action/datastore_search?resource_id=d_69b3380ad7e51aff3a7dcc84eba52b8a&limit=3000";
    const res = await fetch(url, { next: { revalidate: WEEK, tags: ["automobile", "coe"] }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: { records?: Raw[] } };
    const rows = data.result?.records ?? [];
    if (rows.length < 50) return null;
    const out: Record<string, CoePoint[]> = {};
    for (const c of COE_CATS) out[c.key] = [];
    for (const r of rows) {
      const list = out[r.vehicle_class];
      const premium = num(r.premium);
      if (!list || !premium) continue;
      list.push({
        month: r.month, bidding: num(r.bidding_no), label: roundShort(r.month, num(r.bidding_no)),
        premium, quota: num(r.quota), bidsReceived: num(r.bids_received), bidsSuccess: num(r.bids_success),
      });
    }
    for (const k of Object.keys(out)) {
      out[k].sort((a, b) => (a.month === b.month ? a.bidding - b.bidding : a.month.localeCompare(b.month)));
    }
    return out;
  } catch (err) {
    console.error("[coe history]", err);
    return null;
  }
}

export interface YearStat { year: string; avg: number; high: number; low: number; rounds: number }

export function yearlyStats(points: CoePoint[]): YearStat[] {
  const by: Record<string, number[]> = {};
  for (const p of points) (by[p.month.slice(0, 4)] ??= []).push(p.premium);
  return Object.entries(by)
    .map(([year, v]) => ({ year, avg: Math.round(v.reduce((a, b) => a + b, 0) / v.length), high: Math.max(...v), low: Math.min(...v), rounds: v.length }))
    .sort((a, b) => b.year.localeCompare(a.year));
}

export function summary(points: CoePoint[]) {
  const latest = points[points.length - 1];
  const prev = points[points.length - 2];
  const last12m = points.slice(-24);
  const allTimeHigh = points.reduce((m, p) => (p.premium > m.premium ? p : m), points[0]);
  return {
    latest,
    change: prev ? latest.premium - prev.premium : 0,
    high12: Math.max(...last12m.map(p => p.premium)),
    low12: Math.min(...last12m.map(p => p.premium)),
    allTimeHigh,
  };
}
