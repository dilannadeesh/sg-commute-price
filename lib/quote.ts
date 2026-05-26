import type { Area, TimeBlock, Platform, FlexarStation, FlexarOpts, QuoteResult, QuoteOpts } from "./types";

// Real Singapore coordinates — planning area centres near their main MRT/hub
export const SG_AREAS: Area[] = [
  { id: "orchard",      name: "Orchard",      region: "Central",    lat: 1.3048, lng: 103.8318 },
  { id: "marina",       name: "Marina Bay",   region: "Central",    lat: 1.2811, lng: 103.8607 },
  { id: "tiong-bahru",  name: "Tiong Bahru",  region: "Central",    lat: 1.2864, lng: 103.8270 },
  { id: "outram",       name: "Outram",       region: "Central",    lat: 1.2796, lng: 103.8362 },
  { id: "river-valley", name: "River Valley", region: "Central",    lat: 1.2934, lng: 103.8334 },
  { id: "novena",       name: "Novena",       region: "Central",    lat: 1.3202, lng: 103.8438 },
  { id: "newton",       name: "Newton",       region: "Central",    lat: 1.3128, lng: 103.8383 },
  { id: "bugis",        name: "Bugis",        region: "Central",    lat: 1.2995, lng: 103.8555 },
  { id: "chinatown",    name: "Chinatown",    region: "Central",    lat: 1.2828, lng: 103.8441 },
  { id: "tampines",     name: "Tampines",     region: "East",       lat: 1.3530, lng: 103.9436 },
  { id: "bedok",        name: "Bedok",        region: "East",       lat: 1.3240, lng: 103.9298 },
  { id: "katong",       name: "Katong",       region: "East",       lat: 1.3066, lng: 103.9013 },
  { id: "changi",       name: "Changi",       region: "East",       lat: 1.3644, lng: 103.9915 },
  { id: "pasir-ris",    name: "Pasir Ris",    region: "East",       lat: 1.3724, lng: 103.9494 },
  { id: "east-coast",   name: "East Coast",   region: "East",       lat: 1.3001, lng: 103.9141 },
  { id: "punggol",      name: "Punggol",      region: "North-East", lat: 1.4050, lng: 103.9020 },
  { id: "sengkang",     name: "Sengkang",     region: "North-East", lat: 1.3910, lng: 103.8950 },
  { id: "hougang",      name: "Hougang",      region: "North-East", lat: 1.3710, lng: 103.8925 },
  { id: "serangoon",    name: "Serangoon",    region: "North-East", lat: 1.3504, lng: 103.8729 },
  { id: "ang-mo-kio",   name: "Ang Mo Kio",   region: "North-East", lat: 1.3700, lng: 103.8453 },
  { id: "woodlands",    name: "Woodlands",    region: "North",      lat: 1.4382, lng: 103.7890 },
  { id: "yishun",       name: "Yishun",       region: "North",      lat: 1.4304, lng: 103.8354 },
  { id: "sembawang",    name: "Sembawang",    region: "North",      lat: 1.4491, lng: 103.8185 },
  { id: "bishan",       name: "Bishan",       region: "North",      lat: 1.3504, lng: 103.8487 },
  { id: "jurong-east",  name: "Jurong East",  region: "West",       lat: 1.3329, lng: 103.7436 },
  { id: "jurong-west",  name: "Jurong West",  region: "West",       lat: 1.3404, lng: 103.7090 },
  { id: "clementi",     name: "Clementi",     region: "West",       lat: 1.3162, lng: 103.7649 },
  { id: "bukit-batok",  name: "Bukit Batok",  region: "West",       lat: 1.3590, lng: 103.7500 },
  { id: "bukit-timah",  name: "Bukit Timah",  region: "West",       lat: 1.3294, lng: 103.7968 },
  { id: "queenstown",   name: "Queenstown",   region: "Central",    lat: 1.2942, lng: 103.7995 },
  { id: "sentosa",      name: "Sentosa",      region: "South",      lat: 1.2494, lng: 103.8303 },
  { id: "harbourfront", name: "Harbourfront", region: "South",      lat: 1.2654, lng: 103.8198 },
];

export const TIME_BLOCKS: TimeBlock[] = [
  { id: "00-02", label: "12 – 2 am",  short: "12am", surge: 1.20, surgeLabel: "Late-night"    },
  { id: "02-04", label: "2 – 4 am",   short: "2am",  surge: 1.15, surgeLabel: "Late-night"    },
  { id: "04-06", label: "4 – 6 am",   short: "4am",  surge: 1.00, surgeLabel: null            },
  { id: "06-08", label: "6 – 8 am",   short: "6am",  surge: 1.35, surgeLabel: "Morning peak"  },
  { id: "08-10", label: "8 – 10 am",  short: "8am",  surge: 1.50, surgeLabel: "Morning peak"  },
  { id: "10-12", label: "10 – 12 pm", short: "10am", surge: 1.05, surgeLabel: null            },
  { id: "12-14", label: "12 – 2 pm",  short: "12pm", surge: 1.10, surgeLabel: null            },
  { id: "14-16", label: "2 – 4 pm",   short: "2pm",  surge: 1.05, surgeLabel: null            },
  { id: "16-18", label: "4 – 6 pm",   short: "4pm",  surge: 1.30, surgeLabel: "Evening peak"  },
  { id: "18-20", label: "6 – 8 pm",   short: "6pm",  surge: 1.45, surgeLabel: "Evening peak"  },
  { id: "20-22", label: "8 – 10 pm",  short: "8pm",  surge: 1.10, surgeLabel: null            },
  { id: "22-24", label: "10 – 12 am", short: "10pm", surge: 1.15, surgeLabel: "Late-night"    },
];

export const FLEXAR_REGIONS_DEFAULT = ["Central", "East", "North-East", "North"];

export const FLEXAR_TOWNS = new Set([
  "punggol", "sengkang", "hougang", "serangoon", "ang-mo-kio",
  "bishan",
  "tampines", "bedok", "pasir-ris",
  "novena", "newton", "bugis",
]);

// Used as fallback walk time when origin/dest is a planning-area selection (not a specific address)
export const FLEXAR_WALK_MIN: Record<string, number> = {
  "punggol":    6,
  "sengkang":   7,
  "hougang":    8,
  "serangoon":  5,
  "ang-mo-kio": 6,
  "bishan":     5,
  "tampines":   7,
  "bedok":      9,
  "pasir-ris":  10,
  "novena":     5,
  "newton":     6,
  "bugis":      5,
};

export const FLEXAR_STATIONS_PER_TOWN: Record<string, number> = {
  "punggol":    12,
  "sengkang":   11,
  "hougang":    9,
  "serangoon":  6,
  "ang-mo-kio": 14,
  "bishan":     7,
  "tampines":   15,
  "bedok":      10,
  "pasir-ris":  6,
  "novena":     4,
  "newton":     3,
  "bugis":      3,
};

// Real-world station coordinates
export const FLEXAR_STATIONS: FlexarStation[] = [
  { id: "fx-punggol",    name: "Waterway Point",  area: "punggol",    lat: 1.4053, lng: 103.9022 },
  { id: "fx-sengkang",   name: "Compass One",     area: "sengkang",   lat: 1.3916, lng: 103.8952 },
  { id: "fx-hougang",    name: "Hougang Mall",    area: "hougang",    lat: 1.3712, lng: 103.8926 },
  { id: "fx-serangoon",  name: "NEX Serangoon",   area: "serangoon",  lat: 1.3504, lng: 103.8729 },
  { id: "fx-ang-mo-kio", name: "AMK Hub",         area: "ang-mo-kio", lat: 1.3700, lng: 103.8453 },
  { id: "fx-bishan",     name: "Junction 8",      area: "bishan",     lat: 1.3504, lng: 103.8487 },
  { id: "fx-tampines",   name: "Tampines Hub",    area: "tampines",   lat: 1.3530, lng: 103.9436 },
  { id: "fx-bedok",      name: "Bedok Mall",      area: "bedok",      lat: 1.3240, lng: 103.9298 },
  { id: "fx-pasir-ris",  name: "White Sands",     area: "pasir-ris",  lat: 1.3724, lng: 103.9494 },
  { id: "fx-novena",     name: "Novena Sq",       area: "novena",     lat: 1.3198, lng: 103.8435 },
  { id: "fx-newton",     name: "Newton MRT",      area: "newton",     lat: 1.3126, lng: 103.8382 },
  { id: "fx-bugis",      name: "Bugis Junction",  area: "bugis",      lat: 1.2995, lng: 103.8555 },
];

export const PLATFORMS: Platform[] = [
  { id: "grab",            name: "Grab",             kind: "hail",    color: "#00B14F", short: "Most-used in SG",    base: 3.40, perKm: 0.85, perMin: 0.22, surgeable: true,  speedKmh: 32, etaMin: 4 },
  { id: "tada",            name: "TADA",             kind: "hail",    color: "#FFB800", short: "Zero commission",    base: 3.20, perKm: 0.78, perMin: 0.20, surgeable: true,  speedKmh: 32, etaMin: 6 },
  { id: "gojek",           name: "Gojek",            kind: "hail",    color: "#0AAB1C", short: "Driver-friendly",    base: 3.30, perKm: 0.82, perMin: 0.21, surgeable: true,  speedKmh: 32, etaMin: 5 },
  { id: "flexar",          name: "Flexar",           kind: "share",   color: "#7A4DFF", short: "Station-to-station", base: 2.50, perKm: 0.55, perMin: 0.18, surgeable: false, speedKmh: 34, etaMin: 2 },
  { id: "publictransport", name: "Public transport", kind: "transit", color: "#1F6FEB", short: "MRT + bus",          base: 0.99, perKm: 0.12, perMin: 0,    surgeable: false, speedKmh: 22, etaMin: 0 },
  { id: "getgo",           name: "GetGo",            kind: "share",   color: "#FF7A00", short: "Hourly car rental",  base: 4.00, perKm: 0.45, perMin: 0.25, surgeable: false, speedKmh: 34, etaMin: 8 },
];

export const FLEXAR_DEFAULTS: Required<FlexarOpts> = {
  walkSpeedKmh: 4.5,
  maxWalkKm: 1.5,
  servicedRegions: FLEXAR_REGIONS_DEFAULT,
};

// Road network is ~22% longer than straight-line in Singapore
const DRIVING_DETOUR = 1.22;
// Pedestrian paths have more detours
const WALKING_DETOUR = 1.40;

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Returns the nearest SG planning area to a given lat/lng. */
export function findNearestArea(lat: number, lng: number): Area {
  return SG_AREAS.reduce((best, a) => {
    const dBest = haversineKm(lat, lng, best.lat, best.lng);
    const dA    = haversineKm(lat, lng, a.lat, a.lng);
    return dA < dBest ? a : best;
  });
}

function nearestStation(area: Area, opts: Required<FlexarOpts> = FLEXAR_DEFAULTS) {
  if (!FLEXAR_TOWNS.has(area.id)) return null;
  if (!opts.servicedRegions.includes(area.region)) return null;
  // Each Flexar town has one named station
  return FLEXAR_STATIONS.find(s => s.area === area.id) ?? null;
}

function walkMinutes(
  userLat: number, userLng: number,
  station: FlexarStation,
  areaId: string,
  isAddress: boolean,
  walkSpeedKmh: number,
  maxWalkKm: number
): number | null {
  if (isAddress) {
    const km = haversineKm(userLat, userLng, station.lat, station.lng) * WALKING_DETOUR;
    if (km > maxWalkKm) return null; // too far to walk
    return Math.max(3, Math.round((km / walkSpeedKmh) * 60));
  }
  // Planning-area selection: use design data
  return FLEXAR_WALK_MIN[areaId] ?? 7;
}

function priceFor(platform: Platform, km: number, surge: number): number {
  const minutes = (km / platform.speedKmh) * 60;
  let price = platform.base + km * platform.perKm + minutes * platform.perMin;
  if (platform.surgeable) price *= surge;
  if (platform.id === "publictransport") price = Math.min(price, 2.49);
  return price;
}

function travelMinutes(platform: Platform, km: number): number {
  let minutes = (km / platform.speedKmh) * 60;
  if (platform.id === "publictransport") {
    minutes += 8 + Math.floor(km / 6) * 4;
  }
  return Math.max(3, minutes);
}

function transfersFor(km: number): number {
  if (km < 4) return 0;
  if (km < 10) return 1;
  if (km < 18) return 2;
  return 3;
}

function quote(
  platform: Platform,
  origin: Area,
  dest: Area,
  timeBlock: TimeBlock,
  opts: QuoteOpts = {}
): Omit<QuoteResult, "platform" | "isCheapest" | "isFastest" | "isBestValue" | "valueScore"> | null {
  const flexarOpts: Required<FlexarOpts> = { ...FLEXAR_DEFAULTS, ...(opts.flexar || {}) };
  const getgoStopoverHours = opts.getgoStopoverHours ?? 1;

  if (platform.id === "flexar") {
    if (!FLEXAR_TOWNS.has(origin.id) || !FLEXAR_TOWNS.has(dest.id)) return null;

    const pickupStation  = nearestStation(origin, flexarOpts);
    const dropoffStation = nearestStation(dest,   flexarOpts);
    if (!pickupStation || !dropoffStation || pickupStation.id === dropoffStation.id) return null;

    const walkIn = walkMinutes(
      origin.lat, origin.lng, pickupStation, origin.id,
      !!origin.address, flexarOpts.walkSpeedKmh, flexarOpts.maxWalkKm
    );
    const walkOut = walkMinutes(
      dest.lat, dest.lng, dropoffStation, dest.id,
      !!dest.address, flexarOpts.walkSpeedKmh, flexarOpts.maxWalkKm
    );
    if (walkIn === null || walkOut === null) return null; // address too far from station

    const driveKm  = haversineKm(pickupStation.lat, pickupStation.lng, dropoffStation.lat, dropoffStation.lng) * DRIVING_DETOUR;
    const driveMin = (driveKm / platform.speedKmh) * 60;
    const totalMin = walkIn + 1.5 + driveMin + walkOut;
    const price    = platform.base + driveKm * platform.perKm + driveMin * platform.perMin;

    return {
      platformId: platform.id,
      price: Math.round(price * 100) / 100,
      minutes: Math.round(totalMin),
      eta: platform.etaMin,
      surge: 1.0,
      surgeLabel: null,
      transfers: null,
      km: Math.round(driveKm * 10) / 10,
      flexar: {
        pickupStation,
        dropoffStation,
        walkInMin:  walkIn,
        walkOutMin: walkOut,
        driveMin: Math.round(driveMin),
        originStationCount: FLEXAR_STATIONS_PER_TOWN[origin.id] ?? 1,
        destStationCount:   FLEXAR_STATIONS_PER_TOWN[dest.id]   ?? 1,
        originTown: origin.name,
        destTown:   dest.name,
      },
    };
  }

  if (platform.id === "getgo") {
    const oneWayKm   = haversineKm(origin.lat, origin.lng, dest.lat, dest.lng) * DRIVING_DETOUR;
    const oneWayMin  = (oneWayKm / platform.speedKmh) * 60;
    const stopoverMin = getgoStopoverHours * 60;
    const totalMin   = 2 * oneWayMin + stopoverMin;
    const totalKm    = 2 * oneWayKm;
    const price      = platform.base + totalKm * platform.perKm + totalMin * platform.perMin;
    return {
      platformId: platform.id,
      price: Math.round(price * 100) / 100,
      minutes: Math.round(totalMin),
      eta: platform.etaMin,
      surge: 1.0,
      surgeLabel: null,
      transfers: null,
      km: Math.round(totalKm * 10) / 10,
      getgo: {
        oneWayKm:   Math.round(oneWayKm * 10) / 10,
        oneWayMin:  Math.round(oneWayMin),
        stopoverMin,
        stopoverHours: getgoStopoverHours,
      },
    };
  }

  const km    = haversineKm(origin.lat, origin.lng, dest.lat, dest.lng) * DRIVING_DETOUR;
  const surge = timeBlock?.surge ?? 1.0;
  const price = priceFor(platform, km, surge);
  const mins  = travelMinutes(platform, km);
  const eta   = platform.etaMin + (timeBlock?.surge > 1.25 ? 3 : 0);
  return {
    platformId: platform.id,
    price: Math.round(price * 100) / 100,
    minutes: Math.round(mins),
    eta,
    surge: platform.surgeable ? surge : 1.0,
    surgeLabel: platform.surgeable ? (timeBlock?.surgeLabel ?? null) : null,
    transfers: platform.id === "publictransport" ? transfersFor(km) : null,
    km: Math.round(km * 10) / 10,
  };
}

function valueScore(q: Pick<QuoteResult, "unavailable" | "price" | "minutes" | "getgo">): number {
  if (q.unavailable) return Infinity;
  const commuteMin = q.getgo ? q.minutes - q.getgo.stopoverMin : q.minutes;
  return q.price + commuteMin * 0.18;
}

export function quoteAll(
  origin: Area | null,
  dest: Area | null,
  timeBlock: TimeBlock,
  opts: QuoteOpts = {}
): QuoteResult[] {
  if (!origin || !dest || origin.id === dest.id) return [];

  const all = PLATFORMS
    .map(p => {
      const q = quote(p, origin, dest, timeBlock, opts);
      return q ? { ...q, platform: p } : null;
    })
    .filter((q): q is Omit<QuoteResult, "isCheapest" | "isFastest" | "isBestValue" | "valueScore"> => q !== null);

  const available  = all.filter(q => !q.unavailable);
  const cheapest   = available.length ? [...available].sort((a, b) => a.price - b.price)[0] : null;
  const commuteMin = (q: typeof all[0]) => q.getgo ? q.minutes - q.getgo.stopoverMin : q.minutes;
  const fastest    = available.length ? [...available].sort((a, b) => commuteMin(a) - commuteMin(b))[0] : null;
  const best       = available.length ? [...available].sort((a, b) => valueScore(a) - valueScore(b))[0] : null;

  return all
    .map(q => ({
      ...q,
      isCheapest:  !!(cheapest && q.platformId === cheapest.platformId  && !q.unavailable),
      isFastest:   !!(fastest  && q.platformId === fastest.platformId   && !q.unavailable),
      isBestValue: !!(best     && q.platformId === best.platformId      && !q.unavailable),
      valueScore:  valueScore(q),
    }))
    .sort((a, b) => {
      if (a.unavailable && !b.unavailable) return 1;
      if (!a.unavailable && b.unavailable) return -1;
      return a.valueScore - b.valueScore;
    });
}
