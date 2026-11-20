import { WEEK, getOgImage, getWikiInfo, type WikiInfo } from "./wiki";
import type { Station } from "./malls";

/* ── COE results (LTA via data.gov.sg) ─────────────────────────────────────── */

export const COE_CATEGORIES: Record<string, string> = {
  "Category A": "Cars ≤1600cc & ≤130bhp (EVs ≤110kW)",
  "Category B": "Cars >1600cc or >130bhp (EVs >110kW)",
  "Category C": "Goods vehicles & buses",
  "Category D": "Motorcycles",
  "Category E": "Open — all except motorcycles",
};

export interface CoeRow { category: string; quota: number; bidsSuccess: number; bidsReceived: number; premium: number; change: number | null }
export interface CoeRound { month: string; bidding: number; label: string; rows: CoeRow[] }
export interface CoeResult { latest: CoeRound; previous: CoeRound | null; source: "data.gov.sg" | "fallback"; history: CoeRound[] }

interface RawCoe { month: string; bidding_no: string; vehicle_class: string; quota: string; bids_success: string; bids_received: string; premium: string }

const num = (s: string) => Number(String(s).replace(/,/g, "")) || 0;
function roundLabel(month: string, bidding: number) {
  const d = new Date(`${month}-01T00:00:00Z`);
  const m = d.toLocaleString("en-SG", { month: "long", year: "numeric", timeZone: "UTC" });
  return `${m} — ${bidding === 1 ? "1st" : "2nd"} bidding`;
}

function toRounds(records: RawCoe[]): CoeRound[] {
  const map = new Map<string, CoeRound>();
  for (const r of records) {
    const key = `${r.month}#${r.bidding_no}`;
    if (!map.has(key)) map.set(key, { month: r.month, bidding: num(r.bidding_no), label: roundLabel(r.month, num(r.bidding_no)), rows: [] });
    map.get(key)!.rows.push({
      category: r.vehicle_class, quota: num(r.quota), bidsSuccess: num(r.bids_success),
      bidsReceived: num(r.bids_received), premium: num(r.premium), change: null,
    });
  }
  const rounds = [...map.values()].sort((a, b) => (a.month === b.month ? b.bidding - a.bidding : b.month.localeCompare(a.month)));
  rounds.forEach(r => r.rows.sort((a, b) => a.category.localeCompare(b.category)));
  // Change vs previous round
  for (let i = 0; i < rounds.length - 1; i++) {
    for (const row of rounds[i].rows) {
      const prev = rounds[i + 1].rows.find(p => p.category === row.category);
      row.change = prev ? row.premium - prev.premium : null;
    }
  }
  return rounds;
}

// Last confirmed result (LTA, 18 Nov 2026) — only shown if data.gov.sg is unreachable.
const FALLBACK: RawCoe[] = [
  ["Category A", "1193", "1130", "1464", "130100"], ["Category B", "951", "951", "1066", "125600"],
  ["Category C", "314", "314", "504", "91790"], ["Category D", "506", "499", "635", "10489"],
  ["Category E", "266", "225", "466", "136000"],
].map(([vehicle_class, quota, bids_success, bids_received, premium]) => ({ month: "2026-11", bidding_no: "2", vehicle_class, quota, bids_success, bids_received, premium }))
.concat([
  ["Category A", "1189", "1189", "2018", "139001"], ["Category B", "959", "959", "1161", "132334"],
  ["Category C", "315", "310", "451", "92000"], ["Category D", "509", "500", "584", "10689"],
  ["Category E", "287", "282", "506", "135998"],
].map(([vehicle_class, quota, bids_success, bids_received, premium]) => ({ month: "2026-11", bidding_no: "1", vehicle_class, quota, bids_success, bids_received, premium })));

export async function getCoeResults(): Promise<CoeResult> {
  try {
    const url = "https://data.gov.sg/api/action/datastore_search?resource_id=d_69b3380ad7e51aff3a7dcc84eba52b8a&sort=month%20desc&limit=60";
    const res = await fetch(url, { next: { revalidate: WEEK, tags: ["automobile", "coe"] }, signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`data.gov.sg ${res.status}`);
    const data = (await res.json()) as { result?: { records?: RawCoe[] } };
    const records = data.result?.records ?? [];
    const rounds = toRounds(records).filter(r => r.rows.length >= 4);
    if (!rounds.length) throw new Error("no COE rows");
    return { latest: rounds[0], previous: rounds[1] ?? null, history: rounds.slice(0, 12), source: "data.gov.sg" };
  } catch (err) {
    console.error("[coe] falling back:", err);
    const rounds = toRounds(FALLBACK);
    return { latest: rounds[0], previous: rounds[1] ?? null, history: rounds, source: "fallback" };
  }
}

/* ── Automotive events ─────────────────────────────────────────────────────── */

export interface AutoEvent {
  slug: string;
  name: string;
  type: "Motor show" | "Car fair" | "Motorsport" | "Trade show";
  start: string;           // YYYY-MM-DD
  end: string;             // YYYY-MM-DD
  datesTba?: string;       // shown instead of dates when not yet announced
  venue: string;
  address: string;
  hours?: string;
  admission: string;
  audience: string;
  organiser: string;
  short: string;
  about: string[];
  highlights: string[];
  mrt: Station[];
  officialUrl?: string;
  /** Official page whose og:image is pulled weekly as the event's key visual. */
  imageFrom?: string;
  /** Wikipedia titles for extra photos (venue, circuit). */
  gallery: string[];
  sources: { label: string; url: string }[];
}

export const EVENTS: AutoEvent[] = [
  {
    slug: "sgcarmart-carnival-december-2026",
    name: "Sgcarmart CARnival (December 2026)",
    type: "Car fair",
    start: "2026-12-05", end: "2026-12-06",
    venue: "Singapore EXPO, Hall 4", address: "1 Expo Drive, Singapore 486150",
    admission: "Free", audience: "Public — families welcome", organiser: "sgcarmart",
    short: "Free weekend car fair at Singapore EXPO with new and used cars, event deals and family fun.",
    about: [
      "Sgcarmart's CARnival returns to Singapore EXPO Hall 4 for a weekend of car shopping. Participating new-car brands and used-car dealers bring their line-ups under one roof so you can compare models up close and talk to sellers directly.",
      "Expect event-only deals and packages, plus activities for families. Admission is free.",
    ],
    highlights: ["New and used cars under one roof", "Event deals from brands and dealers", "Family activities", "Free admission"],
    mrt: [{ name: "Expo", codes: "CG1 / DT35", access: "About 3 minutes' walk to the halls" }],
    officialUrl: "https://www.sgcarmart.com",
    gallery: ["Singapore Expo"],
    sources: [{ label: "Singapore EXPO events", url: "https://www.singaporeexpo.com.sg/what-s-on/events-expo/the-car-expo-2026" }],
  },
  {
    slug: "singapore-motorshow-2027",
    name: "Singapore Motorshow 2027",
    type: "Motor show",
    start: "2027-01-07", end: "2027-01-10",
    venue: "Suntec Singapore Convention & Exhibition Centre", address: "1 Raffles Boulevard, Singapore 039593",
    admission: "S$10 (general public)", audience: "Public", organiser: "Motor Traders Association of Singapore (MTA) with Mediacorp",
    short: "The 20th Singapore Motorshow — 38 brands across four levels of Suntec, with launches and show deals.",
    about: [
      "Singapore's annual new-car show marks its 20th edition over four days at Suntec. 38 automotive brands spread across Levels 6, 4 and 3 and the Level 1 Atrium of the Convention Centre, covering around 21,000 sqm.",
      "The show spans luxury, performance, hybrid and electric models, with new model launches, brand activities, exclusive show promotions and appearances by Mediacorp personalities. The Motorshow lucky draw returns with an electric car as a prize.",
      "Brands announced include Audi, BMW, BYD, Honda, Kia, Mazda, Mercedes-Benz, Subaru, Tesla and Toyota, joined by newer names such as Arcfox, Leapmotor and Yangwang. The show is supported by the Japan Automobile Manufacturers Association (JAMA), with AIG as official partner.",
    ],
    highlights: ["20th edition", "38 brands on four levels", "New launches & show-only deals", "Lucky draw for an electric car"],
    mrt: [
      { name: "Promenade", codes: "CC4 / DT15", access: "About 5 minutes' walk via Suntec City" },
      { name: "Esplanade", codes: "CC3", access: "About 5 minutes via CityLink underground" },
      { name: "City Hall", codes: "EW13 / NS25", access: "About 10 minutes via CityLink Mall, sheltered" },
    ],
    officialUrl: "https://www.motorshow.com.sg",
    imageFrom: "https://www.motorshow.com.sg",
    gallery: ["Suntec Singapore Convention and Exhibition Centre", "Suntec City"],
    sources: [
      { label: "OneShift", url: "https://www.oneshift.com/articles/news/singapore-motorshow-2027-returns-to-suntec-this-january/" },
      { label: "Alvinology", url: "https://alvinology.com/2026/10/17/singapore-motorshow-2027-returns-for-20th-edition-with-38-automotive-brands-and-electric-car-lucky-draw/" },
    ],
  },
  {
    slug: "tyrexpo-asia-automrotive-2027",
    name: "TyreXpo Asia & AutoMROtive 2027",
    type: "Trade show",
    start: "2027-03-17", end: "2027-03-19",
    venue: "Sands Expo & Convention Centre, Marina Bay Sands", address: "10 Bayfront Avenue, Singapore 018956",
    admission: "Trade visitors (registration required)", audience: "Trade professionals only", organiser: "Informa Markets",
    short: "Co-located trade fairs for tyres, auto repair, maintenance and workshop tech at Marina Bay Sands.",
    about: [
      "TyreXpo Asia returns to Singapore alongside AutoMROtive, a new show for automotive maintenance, repair and operations. Displays cover tyre technology, automotive repair solutions, workshop equipment, diagnostics, fleet maintenance and EV and hybrid servicing.",
      "Organisers expect around 7,000 attendees from more than 90 countries. This is a trade event — it is not open to the general public.",
    ],
    highlights: ["Tyre technology", "Workshop equipment & diagnostics", "EV and hybrid servicing", "Visitors from 90+ countries"],
    mrt: [{ name: "Bayfront", codes: "CE1 / DT16", access: "Direct underground link to Marina Bay Sands" }],
    gallery: ["Marina Bay Sands"],
    sources: [{ label: "Tyrepress", url: "https://www.tyrepress.com/2026/08/tyrexpo-asia-slated-for-2027-return-to-singapore-beside-automrotive/" }],
  },
  {
    slug: "the-car-expo-2027",
    name: "The Car Expo (first half of 2027)",
    type: "Car fair",
    start: "2027-05-01", end: "2027-05-31",
    datesTba: "Expected around May 2027 — dates to be announced",
    venue: "Singapore EXPO, Halls 4 & 5", address: "1 Expo Drive, Singapore 486150",
    hours: "10am – 9pm (2026 editions)", admission: "Free (2026 editions)", audience: "Public", organiser: "SPH Media",
    short: "Singapore's large twice-yearly car fair for new cars, pre-owned cars and accessories.",
    about: [
      "The Car Expo is a twice-yearly motoring show hosted by SPH Media at Singapore EXPO, bringing brand-new cars, pre-owned cars and motoring accessories under one roof. In 2026 it ran on 9–10 May and again in late October, with free admission.",
      "The first 2027 edition has not been announced yet. We'll update this page when dates are confirmed — the page refreshes every week.",
    ],
    highlights: ["New & pre-owned cars", "Financing and insurance packages", "Motoring accessories", "Free admission"],
    mrt: [{ name: "Expo", codes: "CG1 / DT35", access: "About 3 minutes' walk to the halls" }],
    gallery: ["Singapore Expo"],
    sources: [{ label: "Stomp — The Car Expo returns in May (2026)", url: "https://www.stomp.sg/lifestyle/car-expo-returns-may-sph-media-host" }],
  },
  {
    slug: "innotrans-asia-2027",
    name: "InnoTrans Asia 2027",
    type: "Trade show",
    start: "2027-09-07", end: "2027-09-09",
    venue: "Singapore EXPO", address: "1 Expo Drive, Singapore 486150",
    admission: "Trade visitors (registration required)", audience: "Trade professionals only", organiser: "Messe Berlin Asia Pacific",
    short: "The first Asian edition of InnoTrans — a trade fair for transport technology.",
    about: [
      "InnoTrans Asia is the new Asian edition of InnoTrans, Messe Berlin's international transport technology fair. The inaugural Singapore event brings together industry leaders, suppliers and decision-makers from across Asia and beyond.",
      "It is a professional trade fair rather than a consumer car show.",
    ],
    highlights: ["Inaugural Asian edition", "Transport technology", "Industry networking"],
    mrt: [{ name: "Expo", codes: "CG1 / DT35", access: "About 3 minutes' walk to the halls" }],
    gallery: ["Singapore Expo"],
    sources: [{ label: "Railway Age events", url: "https://www.v2.railwayage.com/event/innotrans-asia-2027" }],
  },
  {
    slug: "singapore-grand-prix-2027",
    name: "Formula 1 Singapore Grand Prix 2027",
    type: "Motorsport",
    start: "2027-10-08", end: "2027-10-10",
    venue: "Marina Bay Street Circuit", address: "Raffles Boulevard, Marina Bay, Singapore 039594",
    admission: "Ticketed — waitlist open", audience: "Public", organiser: "Singapore GP / Formula 1",
    short: "F1's original night race returns to the 4.9 km Marina Bay Street Circuit.",
    about: [
      "The Formula 1 Singapore Airlines Singapore Grand Prix returns to the Marina Bay Street Circuit from 8 to 10 October 2027. The 4.927 km street circuit hosted F1's first-ever night race in 2008 and runs past illuminated skyscrapers, across bridges and through the Civic District.",
      "Race weekend includes three days of on-track action plus concerts and entertainment inside the circuit park. Tickets are not on sale yet — the official waitlist is open.",
    ],
    highlights: ["F1's original night race", "4.927 km street circuit", "Concerts & entertainment", "Waitlist open now"],
    mrt: [
      { name: "Promenade", codes: "CC4 / DT15", access: "Closest to Zone 1 and Bayfront gates" },
      { name: "Esplanade", codes: "CC3", access: "Closest to Esplanade-side gates" },
      { name: "City Hall", codes: "EW13 / NS25", access: "Padang and Civic District gates" },
    ],
    officialUrl: "https://singaporegp.sg",
    imageFrom: "https://singaporegp.sg",
    gallery: ["Marina Bay Street Circuit", "Singapore Grand Prix"],
    sources: [{ label: "Formula 1 ticketing", url: "https://ticketing.formula1.com/singapore/" }],
  },
];

export const getEvent = (slug: string) => EVENTS.find(e => e.slug === slug);

export function eventStatus(e: AutoEvent, now = new Date()): "upcoming" | "ongoing" | "past" {
  const start = new Date(`${e.start}T00:00:00+08:00`);
  const end = new Date(`${e.end}T23:59:59+08:00`);
  if (now > end) return "past";
  if (now >= start) return "ongoing";
  return "upcoming";
}

export function formatEventDates(e: AutoEvent): string {
  if (e.datesTba) return e.datesTba;
  const s = new Date(`${e.start}T00:00:00+08:00`);
  const t = new Date(`${e.end}T00:00:00+08:00`);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Singapore" };
  if (e.start === e.end) return s.toLocaleDateString("en-SG", opts);
  const sameMonth = s.getUTCMonth() === t.getUTCMonth() && s.getUTCFullYear() === t.getUTCFullYear();
  return sameMonth
    ? `${s.toLocaleDateString("en-SG", { day: "numeric", timeZone: "Asia/Singapore" })}–${t.toLocaleDateString("en-SG", opts)}`
    : `${s.toLocaleDateString("en-SG", { day: "numeric", month: "short", timeZone: "Asia/Singapore" })} – ${t.toLocaleDateString("en-SG", opts)}`;
}

export interface EventView extends AutoEvent { keyVisual: string | null; photos: WikiInfo[] }

export async function loadEvent(e: AutoEvent): Promise<EventView> {
  const [keyVisual, photos] = await Promise.all([
    e.imageFrom ? getOgImage(e.imageFrom, "automobile") : Promise.resolve(null),
    Promise.all(e.gallery.map(t => getWikiInfo(t, t, "automobile"))),
  ]);
  return { ...e, keyVisual, photos: photos.filter((p): p is WikiInfo => !!p?.imageUrl) };
}

export async function loadEvents() {
  const all = await Promise.all(EVENTS.map(loadEvent));
  const now = new Date();
  const sorted = all.sort((a, b) => a.start.localeCompare(b.start));
  return {
    upcoming: sorted.filter(e => eventStatus(e, now) !== "past"),
    past: sorted.filter(e => eventStatus(e, now) === "past").reverse(),
  };
}
