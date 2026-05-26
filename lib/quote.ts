import type { Area, TimeBlock, Platform, FlexarStation, GetGoPod, FlexarOpts, QuoteResult, QuoteOpts } from "./types";

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
  "bishan", "tampines", "bedok", "pasir-ris", "novena", "newton", "bugis",
]);

// Multiple stations per town for accurate nearest-station selection
export const FLEXAR_STATIONS: FlexarStation[] = [
  // Punggol
  { id: "fx-punggol-1",   name: "Waterway Point",          area: "punggol",    lat: 1.4053, lng: 103.9022 },
  { id: "fx-punggol-2",   name: "Punggol MRT",             area: "punggol",    lat: 1.4052, lng: 103.9021 },
  { id: "fx-punggol-3",   name: "Northshore Plaza",        area: "punggol",    lat: 1.4128, lng: 103.9086 },
  { id: "fx-punggol-4",   name: "Cove Drive",              area: "punggol",    lat: 1.4060, lng: 103.9103 },
  { id: "fx-punggol-5",   name: "Edgedale Plains",         area: "punggol",    lat: 1.3966, lng: 103.9059 },
  // Sengkang
  { id: "fx-sengkang-1",  name: "Compass One",             area: "sengkang",   lat: 1.3916, lng: 103.8952 },
  { id: "fx-sengkang-2",  name: "Sengkang West Ave",       area: "sengkang",   lat: 1.3857, lng: 103.8833 },
  { id: "fx-sengkang-3",  name: "Rivervale Plaza",         area: "sengkang",   lat: 1.3944, lng: 103.8998 },
  { id: "fx-sengkang-4",  name: "Anchorvale Link",         area: "sengkang",   lat: 1.3878, lng: 103.9025 },
  // Hougang
  { id: "fx-hougang-1",   name: "Hougang Mall",            area: "hougang",    lat: 1.3712, lng: 103.8926 },
  { id: "fx-hougang-2",   name: "Hougang Central",         area: "hougang",    lat: 1.3627, lng: 103.8933 },
  { id: "fx-hougang-3",   name: "Kovan MRT",               area: "hougang",    lat: 1.3598, lng: 103.8852 },
  { id: "fx-hougang-4",   name: "Hougang Ave 10",          area: "hougang",    lat: 1.3720, lng: 103.9004 },
  // Serangoon
  { id: "fx-serangoon-1", name: "NEX Serangoon",           area: "serangoon",  lat: 1.3504, lng: 103.8729 },
  { id: "fx-serangoon-2", name: "Serangoon Gardens",       area: "serangoon",  lat: 1.3571, lng: 103.8710 },
  { id: "fx-serangoon-3", name: "Lorong Chuan MRT",        area: "serangoon",  lat: 1.3507, lng: 103.8656 },
  // Ang Mo Kio
  { id: "fx-amk-1",       name: "AMK Hub",                 area: "ang-mo-kio", lat: 1.3700, lng: 103.8453 },
  { id: "fx-amk-2",       name: "Ang Mo Kio Ave 3",        area: "ang-mo-kio", lat: 1.3727, lng: 103.8479 },
  { id: "fx-amk-3",       name: "Ang Mo Kio Ave 6",        area: "ang-mo-kio", lat: 1.3680, lng: 103.8421 },
  { id: "fx-amk-4",       name: "Ang Mo Kio Ave 8",        area: "ang-mo-kio", lat: 1.3740, lng: 103.8418 },
  { id: "fx-amk-5",       name: "Teck Ghee Court",         area: "ang-mo-kio", lat: 1.3726, lng: 103.8374 },
  // Bishan
  { id: "fx-bishan-1",    name: "Junction 8",              area: "bishan",     lat: 1.3504, lng: 103.8487 },
  { id: "fx-bishan-2",    name: "Bishan St 13",            area: "bishan",     lat: 1.3571, lng: 103.8492 },
  { id: "fx-bishan-3",    name: "Bishan St 24",            area: "bishan",     lat: 1.3522, lng: 103.8420 },
  // Tampines
  { id: "fx-tampines-1",  name: "Tampines Hub",            area: "tampines",   lat: 1.3530, lng: 103.9436 },
  { id: "fx-tampines-2",  name: "Century Square",          area: "tampines",   lat: 1.3525, lng: 103.9461 },
  { id: "fx-tampines-3",  name: "Tampines West MRT",       area: "tampines",   lat: 1.3467, lng: 103.9384 },
  { id: "fx-tampines-4",  name: "Tampines North Ave",      area: "tampines",   lat: 1.3625, lng: 103.9371 },
  { id: "fx-tampines-5",  name: "Tampines Ave 5",          area: "tampines",   lat: 1.3570, lng: 103.9503 },
  // Bedok
  { id: "fx-bedok-1",     name: "Bedok Mall",              area: "bedok",      lat: 1.3240, lng: 103.9298 },
  { id: "fx-bedok-2",     name: "Bedok North MRT",         area: "bedok",      lat: 1.3294, lng: 103.9362 },
  { id: "fx-bedok-3",     name: "Tanah Merah MRT",         area: "bedok",      lat: 1.3271, lng: 103.9462 },
  { id: "fx-bedok-4",     name: "Kembangan MRT",           area: "bedok",      lat: 1.3201, lng: 103.9122 },
  // Pasir Ris
  { id: "fx-pasir-ris-1", name: "White Sands",             area: "pasir-ris",  lat: 1.3724, lng: 103.9494 },
  { id: "fx-pasir-ris-2", name: "Pasir Ris Dr 6",          area: "pasir-ris",  lat: 1.3779, lng: 103.9516 },
  { id: "fx-pasir-ris-3", name: "Pasir Ris Central Park",  area: "pasir-ris",  lat: 1.3730, lng: 103.9395 },
  // Novena
  { id: "fx-novena-1",    name: "Novena Sq",               area: "novena",     lat: 1.3198, lng: 103.8435 },
  { id: "fx-novena-2",    name: "Thomson Medical Centre",  area: "novena",     lat: 1.3235, lng: 103.8440 },
  { id: "fx-novena-3",    name: "United Square",           area: "novena",     lat: 1.3192, lng: 103.8441 },
  // Newton
  { id: "fx-newton-1",    name: "Newton MRT",              area: "newton",     lat: 1.3126, lng: 103.8382 },
  { id: "fx-newton-2",    name: "Newton Circus Hawker",    area: "newton",     lat: 1.3115, lng: 103.8374 },
  // Bugis
  { id: "fx-bugis-1",     name: "Bugis Junction",          area: "bugis",      lat: 1.2995, lng: 103.8555 },
  { id: "fx-bugis-2",     name: "Bugis+ (Iluma)",          area: "bugis",      lat: 1.2998, lng: 103.8567 },
  { id: "fx-bugis-3",     name: "Haji Lane",               area: "bugis",      lat: 1.3015, lng: 103.8571 },
];

// Representative GetGo pod locations across Singapore (~60 pods)
export const GETGO_PODS: GetGoPod[] = [
  // Central
  { id: "gg-orchard",      name: "Orchard Gateway",       address: "277 Orchard Rd",                    lat: 1.3014, lng: 103.8394 },
  { id: "gg-novena",       name: "Velocity@Novena Sq",    address: "238 Thomson Rd",                    lat: 1.3197, lng: 103.8437 },
  { id: "gg-newton",       name: "Newton Food Centre",    address: "500 Clemenceau Ave N",               lat: 1.3117, lng: 103.8376 },
  { id: "gg-bugis",        name: "Bugis Junction",        address: "200 Victoria St",                   lat: 1.2995, lng: 103.8556 },
  { id: "gg-bishan",       name: "Bishan St 11",          address: "Blk 105 Bishan St 11",              lat: 1.3510, lng: 103.8480 },
  { id: "gg-tiong-bahru",  name: "Tiong Bahru Plaza",     address: "302 Tiong Bahru Rd",                lat: 1.2868, lng: 103.8271 },
  { id: "gg-queenstown",   name: "Queenstown MRT",        address: "Blk 53 Commonwealth Dr",           lat: 1.2942, lng: 103.7987 },
  { id: "gg-chinatown",    name: "Chinatown Point",       address: "133 New Bridge Rd",                 lat: 1.2843, lng: 103.8451 },
  { id: "gg-clementi",     name: "Clementi Mall",         address: "3155 Commonwealth Ave W",           lat: 1.3152, lng: 103.7644 },
  { id: "gg-harbourfront", name: "VivoCity",              address: "1 HarbourFront Walk",               lat: 1.2641, lng: 103.8226 },
  // East
  { id: "gg-tampines-1",   name: "Tampines Hub",          address: "1 Our Tampines Hub",                lat: 1.3521, lng: 103.9460 },
  { id: "gg-tampines-2",   name: "Tampines West MRT",     address: "Blk 824 Tampines St 81",            lat: 1.3467, lng: 103.9383 },
  { id: "gg-bedok-1",      name: "Bedok Mall",            address: "311 New Upper Changi Rd",           lat: 1.3240, lng: 103.9296 },
  { id: "gg-bedok-2",      name: "Bedok North MRT",       address: "Blk 203 Bedok North St 1",          lat: 1.3294, lng: 103.9360 },
  { id: "gg-pasir-ris-1",  name: "White Sands",           address: "1 Pasir Ris Central St 3",          lat: 1.3724, lng: 103.9493 },
  { id: "gg-pasir-ris-2",  name: "Pasir Ris Park",        address: "1 Pasir Ris Green",                 lat: 1.3815, lng: 103.9547 },
  { id: "gg-changi",       name: "Changi City Point",     address: "5 Changi Business Park",            lat: 1.3341, lng: 103.9635 },
  { id: "gg-katong",       name: "i12 Katong",            address: "112 East Coast Rd",                 lat: 1.3066, lng: 103.9010 },
  { id: "gg-east-coast",   name: "East Coast Park CP",    address: "East Coast Park Area G",            lat: 1.2990, lng: 103.9138 },
  // North-East
  { id: "gg-punggol-1",    name: "Waterway Point",        address: "83 Punggol Central",                lat: 1.4053, lng: 103.9022 },
  { id: "gg-punggol-2",    name: "Punggol Northshore",    address: "Blk 401B Northshore Dr",            lat: 1.4128, lng: 103.9086 },
  { id: "gg-sengkang-1",   name: "Compass One",           address: "1 Sengkang Square",                 lat: 1.3916, lng: 103.8951 },
  { id: "gg-sengkang-2",   name: "Rivervale Plaza",       address: "11 Rivervale Crescent",             lat: 1.3944, lng: 103.8997 },
  { id: "gg-hougang-1",    name: "Hougang Mall",          address: "90 Hougang Ave 10",                 lat: 1.3712, lng: 103.8927 },
  { id: "gg-hougang-2",    name: "Hougang Central",       address: "Blk 681 Hougang Ave 8",             lat: 1.3627, lng: 103.8932 },
  { id: "gg-serangoon-1",  name: "NEX Serangoon",         address: "23 Serangoon Central",              lat: 1.3504, lng: 103.8729 },
  { id: "gg-serangoon-2",  name: "Serangoon Gardens",     address: "Blk 62 Serangoon Garden Way",       lat: 1.3571, lng: 103.8710 },
  { id: "gg-amk-1",        name: "AMK Hub",               address: "53 Ang Mo Kio Ave 3",               lat: 1.3700, lng: 103.8453 },
  { id: "gg-amk-2",        name: "Ang Mo Kio Ave 8",      address: "Blk 710 Ang Mo Kio Ave 8",          lat: 1.3740, lng: 103.8418 },
  // North
  { id: "gg-woodlands-1",  name: "Causeway Point",        address: "1 Woodlands Square",                lat: 1.4362, lng: 103.7863 },
  { id: "gg-woodlands-2",  name: "Woodlands Civic Ctr",   address: "900 South Woodlands Dr",            lat: 1.4375, lng: 103.7865 },
  { id: "gg-yishun-1",     name: "Northpoint City",       address: "930 Yishun Ave 2",                  lat: 1.4295, lng: 103.8354 },
  { id: "gg-yishun-2",     name: "Yishun Ave 11",         address: "Blk 614 Yishun Ave 4",              lat: 1.4243, lng: 103.8327 },
  { id: "gg-sembawang",    name: "Sun Plaza",             address: "30 Sembawang Dr",                   lat: 1.4491, lng: 103.8185 },
  // West
  { id: "gg-jurong-east",  name: "Jurong East MRT",       address: "Blk 131 Jurong Gateway Rd",         lat: 1.3329, lng: 103.7436 },
  { id: "gg-jurong-west",  name: "Jurong West St 41",     address: "Blk 415 Jurong West St 41",         lat: 1.3404, lng: 103.7090 },
  { id: "gg-clementi-w",   name: "Clementi Ave 3",        address: "Blk 449 Clementi Ave 3",            lat: 1.3162, lng: 103.7649 },
  { id: "gg-bukit-batok",  name: "West Mall",             address: "1 Bukit Batok Central Link",        lat: 1.3490, lng: 103.7495 },
  { id: "gg-bukit-timah",  name: "Bukit Timah Plaza",     address: "1 Jalan Anak Bukit",                lat: 1.3300, lng: 103.7757 },
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

const DRIVING_DETOUR = 1.22;
const WALKING_DETOUR = 1.40;

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestArea(lat: number, lng: number): Area {
  return SG_AREAS.reduce((best, a) =>
    haversineKm(lat, lng, a.lat, a.lng) < haversineKm(lat, lng, best.lat, best.lng) ? a : best
  );
}

function nearestStationToPoint(
  lat: number, lng: number,
  areaId: string,
  allStations: FlexarStation[]
): FlexarStation | null {
  const area = allStations.filter(s => s.area === areaId);
  if (!area.length) return null;
  return area.reduce((best, s) =>
    haversineKm(lat, lng, s.lat, s.lng) < haversineKm(lat, lng, best.lat, best.lng) ? s : best
  );
}

function nearestPodToPoint(lat: number, lng: number, pods: GetGoPod[]): GetGoPod | null {
  if (!pods.length) return null;
  return pods.reduce((best, p) =>
    haversineKm(lat, lng, p.lat, p.lng) < haversineKm(lat, lng, best.lat, best.lng) ? p : best
  );
}

function computeWalk(
  fromLat: number, fromLng: number,
  toLat: number, toLng: number,
  walkSpeedKmh: number
): { km: number; min: number } {
  const km = Math.round(haversineKm(fromLat, fromLng, toLat, toLng) * WALKING_DETOUR * 1000) / 1000;
  const min = Math.max(1, Math.round((km / walkSpeedKmh) * 60));
  return { km, min };
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
  const allFlexarStations  = opts.flexarStations ?? FLEXAR_STATIONS;
  const allGetGoPods       = opts.getgoPods ?? GETGO_PODS;

  // ── Flexar ──────────────────────────────────────────────────────────────
  if (platform.id === "flexar") {
    if (!FLEXAR_TOWNS.has(origin.id) || !FLEXAR_TOWNS.has(dest.id)) return null;
    if (!flexarOpts.servicedRegions.includes(origin.region) ||
        !flexarOpts.servicedRegions.includes(dest.region)) return null;

    const pickup  = nearestStationToPoint(origin.lat, origin.lng, origin.id, allFlexarStations);
    const dropoff = nearestStationToPoint(dest.lat,   dest.lng,   dest.id,   allFlexarStations);
    if (!pickup || !dropoff || pickup.id === dropoff.id) return null;

    // Walk: user → pickup station
    const walkIn  = computeWalk(origin.lat, origin.lng, pickup.lat,  pickup.lng,  flexarOpts.walkSpeedKmh);
    // Walk: dropoff station → user destination
    const walkOut = computeWalk(dropoff.lat, dropoff.lng, dest.lat, dest.lng, flexarOpts.walkSpeedKmh);

    if (walkIn.km > flexarOpts.maxWalkKm || walkOut.km > flexarOpts.maxWalkKm) return null;

    const driveKm  = haversineKm(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng) * DRIVING_DETOUR;
    const driveMin = (driveKm / platform.speedKmh) * 60;
    const totalMin = walkIn.min + 1.5 + driveMin + walkOut.min;
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
        pickupStation:  pickup,
        dropoffStation: dropoff,
        walkInMin:  walkIn.min,
        walkInKm:   Math.round(walkIn.km * 1000),   // metres for display
        walkOutMin: walkOut.min,
        walkOutKm:  Math.round(walkOut.km * 1000),  // metres for display
        driveMin: Math.round(driveMin),
        originTown: origin.name,
        destTown:   dest.name,
      },
    };
  }

  // ── GetGo ───────────────────────────────────────────────────────────────
  if (platform.id === "getgo") {
    const oneWayKm    = haversineKm(origin.lat, origin.lng, dest.lat, dest.lng) * DRIVING_DETOUR;
    const oneWayMin   = (oneWayKm / platform.speedKmh) * 60;
    const stopoverMin = getgoStopoverHours * 60;
    const totalKm     = 2 * oneWayKm;
    const totalMin    = 2 * oneWayMin + stopoverMin;
    const price       = platform.base + totalKm * platform.perKm + totalMin * platform.perMin;

    const nearestPod   = nearestPodToPoint(origin.lat, origin.lng, allGetGoPods);
    const walkToPod    = nearestPod
      ? computeWalk(origin.lat, origin.lng, nearestPod.lat, nearestPod.lng, 4.5)
      : null;

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
        nearestPod:        nearestPod ?? undefined,
        walkToPickupKm:    walkToPod ? Math.round(walkToPod.km * 1000) : undefined,
        walkToPickupMin:   walkToPod?.min,
      },
    };
  }

  // ── Ride-hail + Public Transport ────────────────────────────────────────
  const km    = haversineKm(origin.lat, origin.lng, dest.lat, dest.lng) * DRIVING_DETOUR;
  const surge = timeBlock?.surge ?? 1.0;
  const price = priceFor(platform, km, surge);
  const mins  = travelMinutes(platform, km);
  const eta   = platform.etaMin + (timeBlock?.surge > 1.25 ? 3 : 0);
  return {
    platformId: platform.id,
    price:  Math.round(price * 100) / 100,
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
