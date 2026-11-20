import { NextResponse } from "next/server";
import { estimateTransit, haversineKm, nearestStationName, type TransitPlan } from "@/lib/travel/rail";
import { oneMapTransit } from "@/lib/travel/onemap";
import { adultCardFare, FARE_EFFECTIVE } from "@/lib/travel/fares";
import { quoteProviders } from "@/lib/travel/pricing";
import { findNearestArea } from "@/lib/quote";

const inSingapore = (lat: number, lng: number) => lat > 1.15 && lat < 1.48 && lng > 103.59 && lng < 104.1;

function parsePoint(v: string | null) {
  if (!v) return null;
  const [lat, lng] = v.split(",").map(Number);
  return Number.isFinite(lat) && Number.isFinite(lng) && inSingapore(lat, lng) ? { lat, lng } : null;
}

/** Singapore local time from "YYYY-MM-DDTHH:MM" (no zone), falling back to now. */
function parseSgTime(v: string | null) {
  const m = v?.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  let y: number, mo: number, d: number, h: number, mi: number;
  if (m) { [y, mo, d, h, mi] = m.slice(1).map(Number); }
  else {
    const now = new Date(Date.now() + 8 * 3600_000);
    y = now.getUTCFullYear(); mo = now.getUTCMonth() + 1; d = now.getUTCDate(); h = now.getUTCHours(); mi = now.getUTCMinutes();
  }
  const weekday = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
  const p = (n: number) => String(n).padStart(2, "0");
  return { hour: h, weekday, dateMDY: `${p(mo)}-${p(d)}-${y}`, timeHMS: `${p(h)}:${p(mi)}:00`, label: `${y}-${p(mo)}-${p(d)} ${p(h)}:${p(mi)}` };
}

async function drive(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${a.lng.toFixed(5)},${a.lat.toFixed(5)};${b.lng.toFixed(5)},${b.lat.toFixed(5)}?overview=false`;
    const res = await fetch(url, { headers: { "User-Agent": "SGliving travel planner (https://sgliving.life)" }, next: { revalidate: 86400 }, signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const j = await res.json() as { routes?: { distance: number; duration: number }[] };
      const r = j.routes?.[0];
      if (r && r.distance > 0) return { km: r.distance / 1000, min: r.duration / 60, source: "osrm" as const };
    }
  } catch { /* fall through */ }
  const km = haversineKm(a.lat, a.lng, b.lat, b.lng) * 1.3;
  return { km, min: (km / 38) * 60 + 3, source: "estimate" as const };
}

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const a = parsePoint(sp.get("from")), b = parsePoint(sp.get("to"));
  if (!a || !b) return NextResponse.json({ error: "Pick an origin and a destination in Singapore." }, { status: 400 });
  const fromName = (sp.get("fromName") || nearestStationName(a.lat, a.lng) && `Near ${nearestStationName(a.lat, a.lng)}` || "Origin").slice(0, 80);
  const toName = (sp.get("toName") || "Destination").slice(0, 80);
  const stay = Math.min(12, Math.max(0, Number(sp.get("stay") ?? 1) || 0));
  const t = parseSgTime(sp.get("t"));

  const from = { ...a, name: fromName }, to = { ...b, name: toName };
  const [live, road] = await Promise.all([oneMapTransit(from, to, t.dateMDY, t.timeHMS), drive(a, b)]);
  let transit: TransitPlan = live ?? estimateTransit(from, to, t.hour);
  if (live && !Number.isFinite(live.fare)) transit = { ...live, fare: adultCardFare(live.km) };

  const providers = quoteProviders({
    driveKm: road.km, driveMin: road.min, hour: t.hour, weekday: t.weekday,
    originRegion: findNearestArea(a.lat, a.lng).region, destRegion: findNearestArea(b.lat, b.lng).region,
    stayHours: stay,
  });

  return NextResponse.json({
    when: t.label,
    straightKm: Math.round(haversineKm(a.lat, a.lng, b.lat, b.lng) * 10) / 10,
    road: { km: Math.round(road.km * 10) / 10, min: Math.round(road.min), source: road.source },
    transit,
    fareTable: `Adult card fare, effective ${FARE_EFFECTIVE}`,
    providers,
  }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
