// Adult card fares for basic bus and MRT/LRT journeys, effective 27 December 2025.
// Source: Public Transport Council via data.gov.sg (Fares for Trunk Bus Services, adult card fare per ride).
// Fares are distance-based across the whole journey (up to 5 transfers), so one fare covers bus + train legs.

export const FARE_EFFECTIVE = "27 December 2025";

// [upper bound in km, fare in cents]
const ADULT_CARD_FARE: [number, number][] = [
  [3.2, 128], [4.2, 138], [5.2, 149], [6.2, 159], [7.2, 168], [8.2, 175], [9.2, 182], [10.2, 186],
  [11.2, 190], [12.2, 194], [13.2, 198], [14.2, 202], [15.2, 207], [16.2, 211], [17.2, 215], [18.2, 220],
  [19.2, 224], [20.2, 227], [21.2, 230], [22.2, 233], [23.2, 236], [24.2, 238], [25.2, 240], [26.2, 242],
  [27.2, 243], [28.2, 244], [29.2, 245], [30.2, 246], [31.2, 247], [32.2, 248], [33.2, 249], [34.2, 250],
  [35.2, 251], [36.2, 252], [37.2, 253], [38.2, 254], [39.2, 255], [40.2, 256],
];
const OVER_MAX = 257;

/** Adult card fare in S$ for a journey of `km` (bus + train combined). */
export function adultCardFare(km: number): number {
  const d = Math.round(km * 10) / 10;
  for (const [max, cents] of ADULT_CARD_FARE) if (d <= max) return cents / 100;
  return OVER_MAX / 100;
}
