import type { Area, TimeBlock, Platform, FlexarStation, FlexarOpts, QuoteResult, QuoteOpts } from "./types";

export const SG_AREAS: Area[] = [
  { id: "orchard",      name: "Orchard",      region: "Central",    x: 0,    y: 0    },
  { id: "marina",       name: "Marina Bay",   region: "Central",    x: 1.8,  y: 1.2  },
  { id: "tiong-bahru",  name: "Tiong Bahru",  region: "Central",    x: -1.5, y: 1.5  },
  { id: "outram",       name: "Outram",       region: "Central",    x: -0.5, y: 1.6  },
  { id: "river-valley", name: "River Valley", region: "Central",    x: -0.6, y: 0.4  },
  { id: "novena",       name: "Novena",       region: "Central",    x: 0.4,  y: -1.6 },
  { id: "newton",       name: "Newton",       region: "Central",    x: 0.1,  y: -0.8 },
  { id: "bugis",        name: "Bugis",        region: "Central",    x: 1.6,  y: 0.5  },
  { id: "chinatown",    name: "Chinatown",    region: "Central",    x: 0.4,  y: 1.4  },
  { id: "tampines",     name: "Tampines",     region: "East",       x: 12,   y: -1.4 },
  { id: "bedok",        name: "Bedok",        region: "East",       x: 9,    y: 0.6  },
  { id: "katong",       name: "Katong",       region: "East",       x: 6.5,  y: 1.8  },
  { id: "changi",       name: "Changi",       region: "East",       x: 15,   y: -0.6 },
  { id: "pasir-ris",    name: "Pasir Ris",    region: "East",       x: 13.5, y: -3.2 },
  { id: "east-coast",   name: "East Coast",   region: "East",       x: 7.5,  y: 2.4  },
  { id: "punggol",      name: "Punggol",      region: "North-East", x: 11,   y: -8   },
  { id: "sengkang",     name: "Sengkang",     region: "North-East", x: 9.5,  y: -7.5 },
  { id: "hougang",      name: "Hougang",      region: "North-East", x: 7.5,  y: -5   },
  { id: "serangoon",    name: "Serangoon",    region: "North-East", x: 5.5,  y: -4   },
  { id: "ang-mo-kio",   name: "Ang Mo Kio",   region: "North-East", x: 3,    y: -5   },
  { id: "woodlands",    name: "Woodlands",    region: "North",      x: -2,   y: -10  },
  { id: "yishun",       name: "Yishun",       region: "North",      x: 3.2,  y: -8.4 },
  { id: "sembawang",    name: "Sembawang",    region: "North",      x: 0.5,  y: -10  },
  { id: "bishan",       name: "Bishan",       region: "North",      x: 1.7,  y: -3.5 },
  { id: "jurong-east",  name: "Jurong East",  region: "West",       x: -8,   y: -2   },
  { id: "jurong-west",  name: "Jurong West",  region: "West",       x: -11,  y: -2.4 },
  { id: "clementi",     name: "Clementi",     region: "West",       x: -5,   y: 0.4  },
  { id: "bukit-batok",  name: "Bukit Batok",  region: "West",       x: -6,   y: -3.4 },
  { id: "bukit-timah",  name: "Bukit Timah",  region: "West",       x: -3,   y: -2.4 },
  { id: "queenstown",   name: "Queenstown",   region: "Central",    x: -3.2, y: 1    },
  { id: "sentosa",      name: "Sentosa",      region: "South",      x: 0.6,  y: 3.4  },
  { id: "harbourfront", name: "Harbourfront", region: "South",      x: -0.4, y: 2.6  },
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

export const FLEXAR_STATIONS: FlexarStation[] = [
  { id: "fx-punggol",    name: "Waterway Point",  area: "punggol",    x: 11,   y: -7.9 },
  { id: "fx-sengkang",   name: "Compass One",     area: "sengkang",   x: 9.5,  y: -7.4 },
  { id: "fx-hougang",    name: "Hougang Mall",    area: "hougang",    x: 7.4,  y: -5   },
  { id: "fx-serangoon",  name: "NEX Serangoon",   area: "serangoon",  x: 5.5,  y: -4   },
  { id: "fx-ang-mo-kio", name: "AMK Hub",         area: "ang-mo-kio", x: 3,    y: -5   },
  { id: "fx-bishan",     name: "Junction 8",      area: "bishan",     x: 1.7,  y: -3.5 },
  { id: "fx-tampines",   name: "Tampines Hub",    area: "tampines",   x: 12,   y: -1.3 },
  { id: "fx-bedok",      name: "Bedok Mall",      area: "bedok",      x: 9.1,  y: 0.5  },
  { id: "fx-pasir-ris",  name: "White Sands",     area: "pasir-ris",  x: 13.4, y: -3.1 },
  { id: "fx-novena",     name: "Novena Sq",       area: "novena",     x: 0.3,  y: -1.5 },
  { id: "fx-newton",     name: "Newton MRT",      area: "newton",     x: 0.2,  y: -0.7 },
  { id: "fx-bugis",      name: "Bugis Junction",  area: "bugis",      x: 1.6,  y: 0.4  },
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

function distanceKm(a: { x: number; y: number } | null, b: { x: number; y: number } | null): number {
  if (!a || !b) return 0;
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function nearestStation(area: Area, opts: Required<FlexarOpts> = FLEXAR_DEFAULTS) {
  if (!area) return null;
  if (!FLEXAR_TOWNS.has(area.id)) return null;
  if (!opts.servicedRegions.includes(area.region)) return null;
  const station = FLEXAR_STATIONS.find(s => s.area === area.id);
  if (!station) return null;
  const walkMin = FLEXAR_WALK_MIN[area.id] ?? 7;
  return { station, walkMin };
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
    const a = nearestStation(origin, flexarOpts);
    const b = nearestStation(dest, flexarOpts);
    if (!a || !b || a.station.id === b.station.id) return null;
    const driveKm    = distanceKm(a.station, b.station);
    const walkInMin  = a.walkMin;
    const walkOutMin = b.walkMin;
    const driveMin   = (driveKm / platform.speedKmh) * 60;
    const unlockMin  = 1.5;
    const totalMin   = walkInMin + unlockMin + driveMin + walkOutMin;
    const price      = platform.base + driveKm * platform.perKm + driveMin * platform.perMin;
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
        pickupStation: a.station,
        dropoffStation: b.station,
        walkInMin,
        walkOutMin,
        driveMin: Math.round(driveMin),
        originStationCount: FLEXAR_STATIONS_PER_TOWN[origin.id] ?? 1,
        destStationCount:   FLEXAR_STATIONS_PER_TOWN[dest.id]   ?? 1,
        originTown: origin.name,
        destTown: dest.name,
      },
    };
  }

  if (platform.id === "getgo") {
    const oneWayKm   = distanceKm(origin, dest);
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
        oneWayKm: Math.round(oneWayKm * 10) / 10,
        oneWayMin: Math.round(oneWayMin),
        stopoverMin,
        stopoverHours: getgoStopoverHours,
      },
    };
  }

  const km    = distanceKm(origin, dest);
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

  const available = all.filter(q => !q.unavailable);
  const cheapest  = available.length ? [...available].sort((a, b) => a.price - b.price)[0] : null;
  const commuteMin = (q: typeof all[0]) => q.getgo ? q.minutes - q.getgo.stopoverMin : q.minutes;
  const fastest   = available.length ? [...available].sort((a, b) => commuteMin(a) - commuteMin(b))[0] : null;
  const best      = available.length ? [...available].sort((a, b) => valueScore(a) - valueScore(b))[0] : null;

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
