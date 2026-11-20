// OneMap (Singapore Land Authority) helpers.
// - Address search works without a token.
// - Public transport routing needs a free OneMap account: set ONEMAP_EMAIL + ONEMAP_PASSWORD
//   (or a pre-generated ONEMAP_TOKEN) in the environment to enable live bus + train itineraries.

import type { TransitLeg, TransitPlan } from "./rail";
import { LINES } from "./rail";

const BASE = "https://www.onemap.gov.sg";

export interface Place { name: string; address: string; lat: number; lng: number; postal?: string }

const titleCase = (s: string) =>
  s.toLowerCase().replace(/\b([a-z])/g, c => c.toUpperCase()).replace(/\bMrt\b/g, "MRT").replace(/\bLrt\b/g, "LRT").replace(/\(([a-z]{2}\d+)\)/gi, m => m.toUpperCase());

export async function searchPlaces(q: string): Promise<Place[]> {
  const url = `${BASE}/api/common/elastic/search?searchVal=${encodeURIComponent(q)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
  const res = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(6000) });
  if (!res.ok) return [];
  const json = await res.json() as { results?: Record<string, string>[] };
  const seen = new Set<string>();
  const out: Place[] = [];
  for (const r of json.results ?? []) {
    const lat = Number(r.LATITUDE), lng = Number(r.LONGITUDE);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    const name = titleCase(r.SEARCHVAL ?? r.BUILDING ?? r.ADDRESS ?? "");
    const key = name + "|" + (r.POSTAL ?? "");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ name, address: titleCase(r.ADDRESS ?? "").replace(/Singapore (\d{6})$/, "Singapore $1"), lat, lng, postal: r.POSTAL && r.POSTAL !== "NIL" ? r.POSTAL : undefined });
    if (out.length >= 8) break;
  }
  return out;
}

let tokenCache: { token: string; exp: number } | null = null;

async function getToken(): Promise<string | null> {
  if (process.env.ONEMAP_TOKEN) return process.env.ONEMAP_TOKEN;
  const email = process.env.ONEMAP_EMAIL, password = process.env.ONEMAP_PASSWORD;
  if (!email || !password) return null;
  if (tokenCache && tokenCache.exp > Date.now() + 60_000) return tokenCache.token;
  try {
    const res = await fetch(`${BASE}/api/auth/post/getToken`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), cache: "no-store", signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const j = await res.json() as { access_token?: string; expiry_timestamp?: string | number };
    if (!j.access_token) return null;
    const exp = Number(j.expiry_timestamp) * 1000 || Date.now() + 2 * 86400_000;
    tokenCache = { token: j.access_token, exp };
    return j.access_token;
  } catch { return null; }
}

export const hasOneMapRouting = () => !!(process.env.ONEMAP_TOKEN || (process.env.ONEMAP_EMAIL && process.env.ONEMAP_PASSWORD));

interface OmLeg {
  mode?: string; route?: string; routeShortName?: string; routeLongName?: string; routeId?: string;
  distance?: number; duration?: number; from?: { name?: string }; to?: { name?: string };
  intermediateStops?: unknown[];
}
interface OmItinerary { duration?: number; walkTime?: number; transfers?: number; fare?: string | number; legs?: OmLeg[] }

const clean = (s?: string) => s ? titleCase(s.replace(/\s+/g, " ").trim()) : "";

/** Live public transport itinerary from OneMap, or null if not configured / unavailable. */
export async function oneMapTransit(
  from: { lat: number; lng: number; name: string },
  to: { lat: number; lng: number; name: string },
  dateMDY: string, timeHMS: string,
): Promise<TransitPlan | null> {
  const token = await getToken();
  if (!token) return null;
  const url = `${BASE}/api/public/routingsvc/route?start=${from.lat}%2C${from.lng}&end=${to.lat}%2C${to.lng}` +
    `&routeType=pt&date=${dateMDY}&time=${encodeURIComponent(timeHMS)}&mode=TRANSIT&maxWalkDistance=1000&numItineraries=3`;
  try {
    const res = await fetch(url, { headers: { Authorization: token }, next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const j = await res.json() as { plan?: { itineraries?: OmItinerary[] } };
    const its = j.plan?.itineraries ?? [];
    if (!its.length) return null;
    const it = [...its].sort((a, b) => (a.duration ?? 1e9) - (b.duration ?? 1e9))[0];
    const legs: TransitLeg[] = (it.legs ?? []).map(l => {
      const minutes = Math.max(1, Math.round((l.duration ?? 0) / 60));
      const km = Math.round(((l.distance ?? 0) / 1000) * 100) / 100;
      const fromName = clean(l.from?.name) || from.name;
      const toName = clean(l.to?.name) || to.name;
      const mode = (l.mode ?? "").toUpperCase();
      if (mode === "WALK") return { mode: "walk" as const, from: fromName === "Origin" ? from.name : fromName, to: toName === "Destination" ? to.name : toName, minutes, km };
      if (mode === "BUS") return { mode: "bus" as const, from: fromName, to: toName, minutes, km, stops: (l.intermediateStops?.length ?? 0) + 1, detail: `Bus ${l.routeShortName || l.route || ""}`.trim() };
      const code = (l.route || l.routeShortName || "").toUpperCase().slice(0, 2);
      const meta: { name: string; color: string } | undefined = LINES[code];
      return { mode: "rail" as const, line: code, lineName: meta?.name ?? clean(l.routeLongName) ?? "Train", color: meta?.color, from: fromName, to: toName, minutes, km, stops: (l.intermediateStops?.length ?? 0) + 1 };
    });
    const totalKm = legs.filter(l => l.mode !== "walk").reduce((s, l) => s + l.km, 0);
    const fare = Number(it.fare);
    return {
      source: "onemap",
      minutes: Math.round((it.duration ?? 0) / 60),
      fare: Number.isFinite(fare) && fare > 0 ? fare : NaN,
      km: Math.round(totalKm * 10) / 10,
      transfers: it.transfers ?? Math.max(0, legs.filter(l => l.mode !== "walk").length - 1),
      walkMinutes: Math.round((it.walkTime ?? 0) / 60),
      legs,
      notes: ["Live itinerary from OneMap (Singapore Land Authority). Timings follow scheduled services."],
    };
  } catch { return null; }
}
