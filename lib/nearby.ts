import { haversineKm } from "./quote";
import type { WikiInfo } from "./wiki";

/** Places within `maxKm` of a point (straight-line), nearest first. Needs coordinates on both sides. */
export function nearest<T extends { wikiInfo: WikiInfo | null }>(from: WikiInfo | null, items: T[], maxKm = 2.5, n = 3) {
  if (from?.lat === undefined || from?.lon === undefined) return [];
  return items
    .filter(i => i.wikiInfo?.lat !== undefined && i.wikiInfo?.lon !== undefined)
    .map(i => ({ item: i, km: haversineKm(from.lat!, from.lon!, i.wikiInfo!.lat!, i.wikiInfo!.lon!) }))
    .filter(x => x.km > 0.05 && x.km <= maxKm)
    .sort((a, b) => a.km - b.km)
    .slice(0, n);
}

export const fmtKm = (km: number) => (km < 0.95 ? `${Math.round(km * 100) * 10} m` : `${km.toFixed(1)} km`);
