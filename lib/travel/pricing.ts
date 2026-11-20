// Fare estimates for ride-hailing and car-sharing in Singapore.
// These are SGliving estimates built from published fee components and typical observed fares;
// the price shown in each app at booking time is what you actually pay.

export interface TripContext {
  driveKm: number;      // road distance origin → destination
  driveMin: number;     // free-flow driving time
  hour: number;         // 0–23, Singapore time
  weekday: number;      // 0 = Sunday … 6 = Saturday
  originRegion: string;
  destRegion: string;
  stayHours: number;    // GetGo: time parked at the destination before driving back
}

export interface ProviderQuote {
  id: "grab" | "gojek" | "getgo" | "flexar";
  name: string;
  kind: "ride-hail" | "car-sharing";
  available: boolean;
  low: number;
  high: number;
  minutes: number;          // door-to-door, one way
  waitMinutes?: number;
  summary: string;
  breakdown: string[];
  note?: string;
}

const isWeekend = (d: number) => d === 0 || d === 6;

/** Road traffic multiplier on free-flow driving time. */
export function trafficFactor(hour: number, weekday: number): number {
  if (isWeekend(weekday)) return hour >= 11 && hour < 21 ? 1.15 : 1.05;
  if (hour >= 7 && hour < 10) return 1.4;
  if (hour >= 17 && hour < 20) return 1.45;
  if (hour >= 10 && hour < 17) return 1.15;
  return 1.05;
}

/** Typical ride-hail demand multiplier by time of day. */
export function surgeFactor(hour: number, weekday: number): { factor: number; label: string | null } {
  const we = isWeekend(weekday);
  if (!we && hour >= 7 && hour < 10) return { factor: 1.35, label: "Morning peak" };
  if (!we && hour >= 17 && hour < 20) return { factor: 1.4, label: "Evening peak" };
  if ((weekday === 5 || weekday === 6) && hour >= 20) return { factor: 1.25, label: "Weekend night" };
  if (hour >= 0 && hour < 6) return { factor: 1.2, label: "Late night" };
  return { factor: 1.0, label: null };
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const range = (mid: number, spread = 0.1) => ({ low: Math.max(0, Math.floor(mid * (1 - spread))), high: Math.ceil(mid * (1 + spread)) });

/** Service area published by Flexar (pricing page): East, North-East and Central Singapore. */
export const FLEXAR_REGIONS = ["Central", "East", "North-East"];

export function quoteProviders(t: TripContext): ProviderQuote[] {
  const traffic = trafficFactor(t.hour, t.weekday);
  const driveMin = t.driveMin * traffic;
  const { factor: surge, label: surgeLabel } = surgeFactor(t.hour, t.weekday);
  const surgeText = surgeLabel ? `${surgeLabel} pricing (~×${surge.toFixed(2)})` : "Normal-demand pricing";

  // ── Grab (JustGrab) ─────────────────────────────────────────────
  const grabBase = 3.0, grabKm = 0.78, grabMin = 0.2, grabPlatform = 1.2;
  const grabMid = Math.max(9, (grabBase + t.driveKm * grabKm + driveMin * grabMin) * surge) + grabPlatform;
  const grab: ProviderQuote = {
    id: "grab", name: "Grab", kind: "ride-hail", available: true,
    ...range(grabMid), minutes: Math.round(driveMin + 5), waitMinutes: surge > 1.2 ? 8 : 5,
    summary: "JustGrab private-hire car, door to door",
    breakdown: [
      `${r2(t.driveKm)} km, about ${Math.round(driveMin)} min on the road`,
      surgeText,
      `Includes the S$${grabPlatform.toFixed(2)} platform fee`,
    ],
    note: "Grab shows a fixed upfront fare before you book; surcharges (fuel, ERP, airport, late-night) can apply.",
  };

  // ── Gojek (GoCar) ───────────────────────────────────────────────
  const gojekMid = Math.max(8.5, (2.9 + t.driveKm * 0.75 + driveMin * 0.19) * surge) + 0.9;
  const gojek: ProviderQuote = {
    id: "gojek", name: "Gojek", kind: "ride-hail", available: true,
    ...range(gojekMid), minutes: Math.round(driveMin + 6), waitMinutes: surge > 1.2 ? 9 : 6,
    summary: "GoCar private-hire car, door to door",
    breakdown: [
      `${r2(t.driveKm)} km, about ${Math.round(driveMin)} min on the road`,
      surgeText,
      "Includes an estimated platform fee",
    ],
    note: "Gojek also shows an upfront fare in the app; promo codes and GoClub perks can lower it.",
  };

  // ── GetGo (round trip, return the car to the same spot) ─────────
  const ggRate = getgoHourly(t.hour, t.weekday);
  const ggMinutes = 2 * driveMin + 10 + t.stayHours * 60;
  const ggBillHours = Math.ceil(ggMinutes / 15) / 4;
  const ggMileage = 2 * t.driveKm * 0.39;
  const ggMid = ggBillHours * ggRate.rate + ggMileage + 1.2;
  const getgo: ProviderQuote = {
    id: "getgo", name: "GetGo", kind: "car-sharing", available: true,
    ...range(ggMid, 0.15), minutes: Math.round(driveMin + 8),
    summary: `Round trip with ${t.stayHours} h at your destination — the car goes back to where you picked it up`,
    breakdown: [
      `${ggBillHours} h × ~S$${ggRate.rate.toFixed(2)}/h (${ggRate.label}, Standard car)`,
      `Mileage ${r2(2 * t.driveKm)} km × S$0.39/km = S$${ggMileage.toFixed(2)}`,
      "Petrol included; S$1.20 booking fee",
    ],
    note: "GetGo is A-to-A: you return the car where you started, so it suits round trips with a stop rather than one-way rides. ERP and parking are extra.",
  };

  // ── Flexar (one-way, station to station) ────────────────────────
  const fxCovered = FLEXAR_REGIONS.includes(t.originRegion) && FLEXAR_REGIONS.includes(t.destRegion);
  const fxPeak = !isWeekend(t.weekday) && ((t.hour >= 7 && t.hour < 10) || (t.hour >= 17 && t.hour < 20));
  const fxPerMin = fxPeak ? 0.64 : isWeekend(t.weekday) ? 0.55 : 0.48;
  const fxDriveMin = driveMin + 4; // parking at the drop-off station
  const fxMid = Math.max(0, fxDriveMin - 5) * fxPerMin;
  const flexar: ProviderQuote = {
    id: "flexar", name: "Flexar", kind: "car-sharing", available: fxCovered,
    ...range(fxMid, 0.15), minutes: Math.round(fxDriveMin + 10),
    summary: "Self-drive one way, from a Flexar station near you to one near your destination",
    breakdown: [
      `About ${Math.round(fxDriveMin)} min of driving × ~S$${fxPerMin.toFixed(2)}/min (${fxPeak ? "peak" : isWeekend(t.weekday) ? "weekend" : "off-peak"})`,
      "First 5 minutes free; fuel, charging and CDW included, no distance fee",
      "Add your walk to and from the stations",
    ],
    note: fxCovered
      ? "Flexar prices by the minute and the rate depends on when you start. Check the app for the nearest station and the live price."
      : "Flexar currently serves the East, North-East and Central regions, so one end of this trip is outside its service area.",
  };

  return [grab, gojek, getgo, flexar];
}

function getgoHourly(hour: number, weekday: number): { rate: number; label: string } {
  if (isWeekend(weekday)) return { rate: 9.5, label: "weekend" };
  if (hour >= 1 && hour < 7) return { rate: 3.0, label: "super off-peak" };
  if (hour >= 7 && hour < 17) return { rate: 5.0, label: "off-peak" };
  return { rate: 8.0, label: "peak" };
}
