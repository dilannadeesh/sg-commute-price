import { NextResponse } from "next/server";
import type { Deal, ItinerarySlot, PlanResponse, TravelLegOptions, SingleLegQuote, FlexarLegQuote, GetGoLegQuote, QuoteResult } from "@/lib/types";
import { SG_AREAS, TIME_BLOCKS, FLEXAR_STATIONS, quoteAll } from "@/lib/quote";

export const dynamic = "force-dynamic";

// ── Request shape ─────────────────────────────────────────────────────────────

interface PlanRequest {
  adults: number;
  kidAges: string[];
  startTime: string;
  durationHours: number;
  meals: string[];
  activities: string[];
  foodTypes: string[];
  startAreaId: string;
}

// ── Curated databases ─────────────────────────────────────────────────────────

interface CuratedActivity {
  title: string;
  excerpt: string;
  moreInfoUrl: string;
  tags: string[];
  estimatedCostPerPax: number;
  keywords: string[];
  areaId: string;
  bestTimeOfDay: -1 | 0 | 1 | 2;
}

interface CuratedFood {
  title: string;
  excerpt: string;
  moreInfoUrl: string;
  tags: string[];
  estimatedCostPerPax: number;
  cuisineTypes: string[];
  areaIds: string[];
  mealTypes: string[];
}

const CURATED_ACTIVITIES: CuratedActivity[] = [
  { title: "East Coast Park", excerpt: "Singapore's favourite beach park — rent a bicycle, enjoy BBQ pits, and stroll along the coast.", moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/east-coast-park", tags: ["#outdoor", "#beach", "#family", "#cycling"], estimatedCostPerPax: 5, keywords: ["outdoor", "beach", "family", "cycling", "nature", "park"], areaId: "east-coast", bestTimeOfDay: 0 },
  { title: "Jewel Changi Airport", excerpt: "Home to the world's tallest indoor waterfall (HSBC Rain Vortex), indoor forest, and 280+ shops and restaurants.", moreInfoUrl: "https://www.jewelchangiairport.com/", tags: ["#indoor", "#family", "#kids", "#shopping"], estimatedCostPerPax: 15, keywords: ["indoor", "family", "kids", "shopping", "waterfall"], areaId: "changi", bestTimeOfDay: -1 },
  { title: "Katong Heritage Walk", excerpt: "Stroll through Singapore's vibrant Peranakan neighbourhood — colourful shophouses, heritage trails, and Katong laksa.", moreInfoUrl: "https://www.visitsingapore.com/walking-tour/katong-joo-chiat/", tags: ["#outdoor", "#culture", "#heritage"], estimatedCostPerPax: 0, keywords: ["outdoor", "heritage", "culture", "walking", "peranakan"], areaId: "katong", bestTimeOfDay: 0 },
  { title: "Gardens by the Bay (Outdoor Gardens)", excerpt: "Iconic Supertrees, serene landscapes, and water features — all outdoors and free to explore any time.", moreInfoUrl: "https://www.gardensbythebay.com.sg/", tags: ["#outdoor", "#family", "#nature", "#kids"], estimatedCostPerPax: 0, keywords: ["outdoor", "garden", "nature", "family", "kids", "supertree"], areaId: "marina", bestTimeOfDay: 2 },
  { title: "National Museum of Singapore", excerpt: "Journey through Singapore's story from ancient trading port to modern metropolis. Great for all ages.", moreInfoUrl: "https://www.nationalmuseum.sg/", tags: ["#museum", "#indoor", "#family", "#history"], estimatedCostPerPax: 15, keywords: ["museum", "indoor", "history", "culture", "heritage"], areaId: "bugis", bestTimeOfDay: 1 },
  { title: "ArtScience Museum", excerpt: "Where art meets science — immersive exhibitions inside the iconic lotus-shaped building at Marina Bay Sands.", moreInfoUrl: "https://www.marinabaysands.com/museum.html", tags: ["#museum", "#indoor", "#arts", "#family"], estimatedCostPerPax: 17, keywords: ["museum", "indoor", "art", "science", "culture", "exhibition"], areaId: "marina", bestTimeOfDay: 1 },
  { title: "Fort Canning Park", excerpt: "Historic hilltop park in the CBD — walking trails, heritage landmarks, and frequent outdoor events.", moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/fort-canning-park", tags: ["#outdoor", "#history", "#family"], estimatedCostPerPax: 0, keywords: ["outdoor", "history", "walking", "city", "park"], areaId: "chinatown", bestTimeOfDay: 0 },
  { title: "Haji Lane & Arab Street", excerpt: "Singapore's hippest street — vibrant murals, indie boutiques, and eclectic cafés in the historic Kampong Glam district.", moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/haji-lane/", tags: ["#outdoor", "#arts", "#culture", "#shopping"], estimatedCostPerPax: 0, keywords: ["outdoor", "arts", "culture", "shopping", "street", "cafe"], areaId: "bugis", bestTimeOfDay: -1 },
  { title: "Clarke Quay & Singapore River", excerpt: "Vibrant riverside precinct with restored heritage shophouses, restaurants, and bars along the Singapore River.", moreInfoUrl: "https://www.clarke-quay.com.sg/", tags: ["#outdoor", "#arts", "#family", "#riverside"], estimatedCostPerPax: 0, keywords: ["outdoor", "riverside", "arts", "entertainment", "night"], areaId: "chinatown", bestTimeOfDay: 2 },
  { title: "Merlion Park & Marina Bay", excerpt: "Visit Singapore's most iconic landmark and enjoy the stunning cityscape of Marina Bay — always free.", moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/merlion-park/", tags: ["#outdoor", "#family", "#kids", "#landmark"], estimatedCostPerPax: 0, keywords: ["outdoor", "landmark", "family", "kids", "photography"], areaId: "marina", bestTimeOfDay: 2 },
  { title: "Chinatown Heritage & Food Street", excerpt: "Explore vibrant Pagoda Street, heritage temples, and the famous Chinatown Complex Food Centre.", moreInfoUrl: "https://www.chinatown.sg/", tags: ["#outdoor", "#culture", "#food", "#family"], estimatedCostPerPax: 0, keywords: ["outdoor", "culture", "heritage", "food", "hawker"], areaId: "chinatown", bestTimeOfDay: -1 },
  { title: "Singapore Botanic Gardens", excerpt: "UNESCO World Heritage Site — orchid garden, heritage trees, and tranquil lakes. Free entry to most areas.", moreInfoUrl: "https://www.nparks.gov.sg/sbg", tags: ["#outdoor", "#nature", "#family", "#kids"], estimatedCostPerPax: 0, keywords: ["outdoor", "garden", "nature", "family", "walking", "orchid"], areaId: "orchard", bestTimeOfDay: 0 },
  { title: "Tiong Bahru Neighbourhood", excerpt: "Explore Singapore's hippest neighbourhood — art deco architecture, indie bookshops, and artisan bakeries.", moreInfoUrl: "https://www.visitsingapore.com/walking-tour/tiong-bahru/", tags: ["#outdoor", "#arts", "#culture", "#food"], estimatedCostPerPax: 0, keywords: ["outdoor", "arts", "culture", "food", "neighbourhood", "cafe"], areaId: "tiong-bahru", bestTimeOfDay: 0 },
  { title: "Little India Heritage Walk", excerpt: "Immerse yourself in vibrant colours, spices, and temples on a self-guided walk through Little India.", moreInfoUrl: "https://www.visitsingapore.com/walking-tour/little-india/", tags: ["#outdoor", "#culture", "#heritage", "#family"], estimatedCostPerPax: 0, keywords: ["outdoor", "heritage", "culture", "walking", "india"], areaId: "novena", bestTimeOfDay: 0 },
  { title: "Sports Hub (Climbing & Aquatic Centre)", excerpt: "Singapore's mega sports complex — climbing walls, Olympic-size pools, and sports halls in one venue.", moreInfoUrl: "https://www.sgsportshub.com.sg/", tags: ["#sports", "#indoor", "#family"], estimatedCostPerPax: 12, keywords: ["sport", "swim", "climb", "gym", "fitness", "indoor"], areaId: "bugis", bestTimeOfDay: 1 },
  { title: "Sentosa (Siloso & Palawan Beaches)", excerpt: "Singapore's go-to beach destination — free beach access with water sports and great food nearby.", moreInfoUrl: "https://www.sentosa.com.sg/en/things-to-do/beaches/", tags: ["#beach", "#outdoor", "#family", "#kids"], estimatedCostPerPax: 4, keywords: ["beach", "outdoor", "sentosa", "family", "kids", "swim"], areaId: "sentosa", bestTimeOfDay: 0 },
  { title: "Universal Studios Singapore", excerpt: "Southeast Asia's only Universal Studios — rides, shows, and beloved IP characters for all ages.", moreInfoUrl: "https://www.rwsentosa.com/en/attractions/universal-studios-singapore", tags: ["#indoor", "#family", "#kids", "#theme-park"], estimatedCostPerPax: 83, keywords: ["indoor", "family", "kids", "theme park", "rides"], areaId: "sentosa", bestTimeOfDay: -1 },
  { title: "S.E.A. Aquarium", excerpt: "One of the world's largest aquariums — over 100,000 marine animals across 50 different habitats.", moreInfoUrl: "https://www.rwsentosa.com/en/attractions/sea-aquarium", tags: ["#indoor", "#family", "#kids", "#nature"], estimatedCostPerPax: 42, keywords: ["indoor", "family", "kids", "aquarium", "nature", "marine"], areaId: "sentosa", bestTimeOfDay: 1 },
  { title: "MacRitchie Reservoir Park", excerpt: "Walk the iconic HSBC TreeTop Walk suspension bridge and explore lush rainforest trails.", moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/central-catchment-nature-reserve", tags: ["#outdoor", "#hiking", "#nature", "#family"], estimatedCostPerPax: 0, keywords: ["outdoor", "hiking", "nature", "trail", "treeto", "walk"], areaId: "bishan", bestTimeOfDay: 0 },
  { title: "Bishan–Ang Mo Kio Park", excerpt: "One of Singapore's largest parks with a restored river, inclusive playgrounds, and cycling paths.", moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/bishan---ang-mo-kio-park", tags: ["#outdoor", "#family", "#kids", "#cycling"], estimatedCostPerPax: 0, keywords: ["outdoor", "family", "kids", "park", "cycling"], areaId: "ang-mo-kio", bestTimeOfDay: 0 },
  { title: "Punggol Waterway Park", excerpt: "Scenic 4.2 km waterway park — kayaking, cycling, and picnic spots along the water.", moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/punggol-waterway-park", tags: ["#outdoor", "#family", "#kids", "#cycling"], estimatedCostPerPax: 0, keywords: ["outdoor", "family", "kids", "cycling", "kayak", "waterway"], areaId: "punggol", bestTimeOfDay: 0 },
  { title: "Singapore Zoo", excerpt: "Award-winning open-concept zoo — hundreds of species in naturalistic habitats. Famous orang utan breakfast!", moreInfoUrl: "https://www.mandai.com/en/singapore-zoo.html", tags: ["#outdoor", "#nature", "#family", "#kids"], estimatedCostPerPax: 46, keywords: ["outdoor", "nature", "family", "kids", "wildlife", "zoo", "animals"], areaId: "yishun", bestTimeOfDay: 0 },
  { title: "Mandai Night Safari", excerpt: "The world's first nocturnal wildlife park — tram rides through 7 habitats with over 2,500 animals.", moreInfoUrl: "https://www.mandai.com/en/night-safari.html", tags: ["#outdoor", "#nature", "#family", "#kids"], estimatedCostPerPax: 55, keywords: ["outdoor", "nature", "family", "kids", "wildlife", "safari", "night"], areaId: "yishun", bestTimeOfDay: 2 },
  { title: "Bukit Timah Nature Reserve", excerpt: "Summit Singapore's highest natural peak through primary rainforest — great wildlife sightings along the way.", moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/bukit-timah-nature-reserve", tags: ["#outdoor", "#hiking", "#nature"], estimatedCostPerPax: 0, keywords: ["outdoor", "hiking", "nature", "trail", "summit", "bukit"], areaId: "bukit-timah", bestTimeOfDay: 0 },
];

const CURATED_FOOD_DB: CuratedFood[] = [
  { title: "Tiong Bahru Bakery", excerpt: "Beloved Singapore bakery famous for impossibly flaky croissants and artisan pastries — perfect for breakfast or brunch.", moreInfoUrl: "https://tiongbahrubakery.com/", tags: ["#breakfast", "#brunch", "#cafe", "#western"], estimatedCostPerPax: 15, cuisineTypes: ["western"], areaIds: ["tiong-bahru", "orchard", "marina"], mealTypes: ["breakfast", "brunch"] },
  { title: "Dempsey Hill Restaurants", excerpt: "Charming enclave of restored colonial bungalows with great Western dining from brunch through dinner.", moreInfoUrl: "https://dempseyhill.com/", tags: ["#western", "#brunch", "#lunch", "#dinner"], estimatedCostPerPax: 35, cuisineTypes: ["western"], areaIds: ["orchard", "bukit-timah"], mealTypes: ["brunch", "lunch", "dinner"] },
  { title: "East Coast Seafood (UDMC)", excerpt: "Singapore's most famous stretch for chilli crab, black pepper crab, and fresh seafood along the coast.", moreInfoUrl: "https://www.visitsingapore.com/dining-drinks-singapore/food-experiences/east-coast-seafood/", tags: ["#seafood", "#dinner", "#lunch"], estimatedCostPerPax: 45, cuisineTypes: ["western", "chinese"], areaIds: ["east-coast", "bedok"], mealTypes: ["lunch", "dinner"] },
  { title: "Holland Village Cafés", excerpt: "Popular enclave with a mix of Western bistros and casual restaurants — great for weekend brunch.", moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/holland-village/", tags: ["#western", "#brunch", "#cafe"], estimatedCostPerPax: 22, cuisineTypes: ["western"], areaIds: ["queenstown", "clementi"], mealTypes: ["breakfast", "brunch", "lunch"] },
  { title: "Maxwell Food Centre", excerpt: "One of Singapore's most famous hawker centres — Tian Tian chicken rice, Zhen Zhen porridge, and more from S$4.", moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/maxwell-food-centre/", tags: ["#lunch", "#hawker", "#local", "#chinese"], estimatedCostPerPax: 8, cuisineTypes: ["chinese"], areaIds: ["outram", "chinatown"], mealTypes: ["breakfast", "lunch", "dinner"] },
  { title: "Chinatown Complex Food Centre", excerpt: "Over 260 stalls serving authentic Chinese classics — one of Singapore's largest and most beloved hawker centres.", moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/chinatown-complex/", tags: ["#lunch", "#dinner", "#hawker", "#chinese"], estimatedCostPerPax: 8, cuisineTypes: ["chinese"], areaIds: ["chinatown"], mealTypes: ["breakfast", "lunch", "dinner"] },
  { title: "Old Airport Road Food Centre", excerpt: "Heritage hawker gem — famous for beef hor fun, hokkien mee, and char kway teow.", moreInfoUrl: "https://www.hungrygowhere.com/places/old-airport-road-food-centre", tags: ["#lunch", "#dinner", "#hawker", "#chinese"], estimatedCostPerPax: 7, cuisineTypes: ["chinese"], areaIds: ["katong", "bedok"], mealTypes: ["breakfast", "lunch", "dinner"] },
  { title: "Lau Pa Sat Festival Market", excerpt: "Iconic Victorian cast-iron hawker market in the CBD — famous for evening satay and wide variety of local cuisine.", moreInfoUrl: "https://www.laupasat.sg/", tags: ["#dinner", "#hawker", "#satay", "#chinese"], estimatedCostPerPax: 18, cuisineTypes: ["chinese", "malay"], areaIds: ["marina", "chinatown"], mealTypes: ["lunch", "dinner"] },
  { title: "Newton Food Centre", excerpt: "Singapore's most famous open-air hawker centre — freshly grilled satay, BBQ seafood, and rojak.", moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/newton-food-centre/", tags: ["#dinner", "#hawker", "#local"], estimatedCostPerPax: 15, cuisineTypes: ["chinese", "malay"], areaIds: ["newton", "novena", "orchard"], mealTypes: ["dinner"] },
  { title: "Swee Choon Dim Sum", excerpt: "One of Singapore's best dim sum spots — try the fluffy char siu bao and crispy spring rolls.", moreInfoUrl: "https://www.sweechoon.com/", tags: ["#dinner", "#breakfast", "#chinese"], estimatedCostPerPax: 22, cuisineTypes: ["chinese"], areaIds: ["novena", "bugis"], mealTypes: ["breakfast", "dinner"] },
  { title: "Banana Leaf Apolo", excerpt: "Legendary banana leaf curry restaurant in Little India — fish head curry, biryani, and 40+ years of flavour.", moreInfoUrl: "https://www.thebananaleafapolo.com/", tags: ["#lunch", "#dinner", "#indian"], estimatedCostPerPax: 22, cuisineTypes: ["indian"], areaIds: ["novena"], mealTypes: ["lunch", "dinner"] },
  { title: "Komala Vilas (Little India)", excerpt: "Vegetarian South Indian institution since 1947 — masala dosa, thali sets, and fresh coconut water.", moreInfoUrl: "https://komalavilas.com.sg/", tags: ["#breakfast", "#lunch", "#indian", "#vegetarian"], estimatedCostPerPax: 10, cuisineTypes: ["indian"], areaIds: ["novena"], mealTypes: ["breakfast", "lunch", "dinner"] },
  { title: "Springleaf Prata Place", excerpt: "Freshly made roti prata at any hour — perfect with dhal and curry. Multiple locations across Singapore.", moreInfoUrl: "https://www.springleafprataplace.com/", tags: ["#breakfast", "#indian", "#prata"], estimatedCostPerPax: 8, cuisineTypes: ["indian"], areaIds: ["ang-mo-kio", "bishan", "novena"], mealTypes: ["breakfast", "brunch"] },
  { title: "Hajjah Maimunah Restaurant", excerpt: "Beloved Malay heritage restaurant in Kampong Glam — nasi padang with over 40 dishes displayed daily.", moreInfoUrl: "https://www.hajjahmaimunah.com/", tags: ["#lunch", "#malay"], estimatedCostPerPax: 14, cuisineTypes: ["malay"], areaIds: ["bugis"], mealTypes: ["breakfast", "lunch"] },
  { title: "Geylang Serai Market", excerpt: "The heartland of Malay culture in Singapore — authentic Malay delights and heritage food stalls.", moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/geylang-serai-market/", tags: ["#breakfast", "#lunch", "#malay", "#hawker"], estimatedCostPerPax: 8, cuisineTypes: ["malay"], areaIds: ["bedok", "katong"], mealTypes: ["breakfast", "lunch"] },
  { title: "Zam Zam Restaurant", excerpt: "Century-old Muslim eatery at Arab Street — famous for roti john, murtabak, and fragrant biryanis.", moreInfoUrl: "https://www.visitsingapore.com/dining-drinks-singapore/local-dishes/murtabak/", tags: ["#breakfast", "#lunch", "#dinner", "#malay"], estimatedCostPerPax: 12, cuisineTypes: ["malay", "indian"], areaIds: ["bugis"], mealTypes: ["breakfast", "lunch", "dinner"] },
  { title: "Traditional Kopitiam Breakfast", excerpt: "Start your Singapore morning right — kaya toast, soft-boiled eggs, and kopi at any neighbourhood kopitiam from S$5.", moreInfoUrl: "https://www.visitsingapore.com/dining-drinks-singapore/local-dishes/kaya-toast/", tags: ["#breakfast", "#local", "#hawker"], estimatedCostPerPax: 6, cuisineTypes: ["chinese", "malay"], areaIds: ["orchard", "bugis", "chinatown", "novena", "ang-mo-kio", "tampines", "bedok"], mealTypes: ["breakfast"] },
  { title: "Café Brunch", excerpt: "Singapore's café scene is thriving — Tiong Bahru, Tanjong Pagar, and Dempsey Hill offer excellent brunch from S$18.", moreInfoUrl: "https://www.hungrygowhere.com/", tags: ["#brunch", "#cafe", "#western"], estimatedCostPerPax: 22, cuisineTypes: ["western"], areaIds: ["tiong-bahru", "outram", "orchard", "bugis"], mealTypes: ["brunch"] },
];

// ── Keyword maps ──────────────────────────────────────────────────────────────

const CUISINE_KEYWORDS: Record<string, string[]> = {
  western: ["western", "burger", "pasta", "pizza", "steak", "cafe", "sandwich", "salad", "brunch", "bagel", "croissant"],
  chinese: ["chinese", "dim sum", "bak kut", "char siu", "roast", "dumpling", "wonton", "claypot", "noodle", "porridge", "hor fun", "kway teow"],
  indian:  ["indian", "naan", "curry", "briyani", "biryani", "tandoor", "roti", "prata", "thali", "masala", "dosa"],
  malay:   ["malay", "nasi", "rendang", "satay", "laksa", "ayam", "ikan", "murtabak", "nasi padang", "nasi lemak"],
};

const MEAL_KEYWORDS: Record<string, string[]> = {
  breakfast: ["breakfast", "morning", "kopi", "kaya", "toast", "egg", "granola", "oat"],
  brunch:    ["brunch"],
  lunch:     ["lunch", "noon", "midday", "lunchtime"],
  dinner:    ["dinner", "supper", "evening", "night"],
};

const ACTIVITY_KEYWORDS: Record<string, string[]> = {
  outdoor:  ["outdoor", "garden", "park", "nature", "reservoir", "green", "walk", "trail", "alfresco"],
  indoor:   ["indoor", "escape", "studio", "workshop", "mall", "shopping"],
  museum:   ["museum", "gallery", "heritage", "history", "science", "exhibit"],
  beach:    ["beach", "sentosa", "coastal", "sea", "wave", "shore", "swim"],
  sports:   ["sport", "swim", "tennis", "badminton", "golf", "gym", "fitness", "run", "climb", "kayak"],
  arts:     ["concert", "theatre", "theater", "performance", "dance", "music", "show", "opera"],
  hiking:   ["hike", "hiking", "trail", "treeto", "reservoir", "bukit", "summit"],
  family:   ["family", "kids", "children", "child", "toddler", "playground"],
};

const MEAL_NATURAL_H: Record<string, number> = { breakfast: 8.5, brunch: 10.5, lunch: 12.0, dinner: 18.5 };
const MEAL_DUR:       Record<string, number> = { breakfast: 1.0, brunch: 1.5, lunch: 1.0, dinner: 1.5 };
const MEAL_DEFAULT_COST: Record<string, number> = { breakfast: 10, brunch: 22, lunch: 18, dinner: 38 };
const ACTIVITY_DUR  = 1.5;
const TRAVEL_BUFFER = 0.25;
const ACTIVITY_TAG_COST: [string, number][] = [
  ["#beach", 4], ["#outdoor", 5], ["#hiking", 5],
  ["#museum", 15], ["#sports", 20], ["#arts", 40], ["#indoor", 25],
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDecimalH(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
}

function formatTime(decH: number): string {
  const h = Math.floor(decH) % 24;
  const m = Math.round((decH % 1) * 60) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function extractFirstPrice(text: string): number | null {
  const prices = [...text.matchAll(/\$(\d+(?:\.\d{1,2})?)/g)]
    .map(m => parseFloat(m[1])).filter(p => p > 0 && p < 500);
  return prices.length > 0 ? Math.min(...prices) : null;
}

function isFreeActivity(text: string): boolean {
  return /free\s+entry|free\s+admission|free\s+for|no\s+admission|no\s+entry\s+fee/i.test(text);
}

function extractDealBadge(text: string): string | undefined {
  if (/1.for.1|1-for-1|one.for.one/i.test(text)) return "1-for-1";
  const pct = text.match(/(\d{1,2})%\s*off/i);
  if (pct) return `${pct[1]}% off`;
  if (/free\s+entry|free\s+admission/i.test(text)) return "Free entry";
  if (isFreeActivity(text)) return "Free";
  return undefined;
}

function getTimeBlockForH(h: number) {
  for (const block of TIME_BLOCKS) {
    const [s, e] = block.id.split("-").map(Number);
    if (h >= s && h < (e || 24)) return block;
  }
  return TIME_BLOCKS[5];
}

function timeOfDay(h: number): 0 | 1 | 2 {
  return h < 11 ? 0 : h < 17 ? 1 : 2;
}

function getAreaRegion(areaId: string): string | null {
  return SG_AREAS.find(a => a.id === areaId)?.region ?? null;
}

function pickFoodArea(food: CuratedFood, nearAreaId: string | null): string {
  if (!nearAreaId) return food.areaIds[0];
  if (food.areaIds.includes(nearAreaId)) return nearAreaId;
  const nearRegion = getAreaRegion(nearAreaId);
  return food.areaIds.find(id => getAreaRegion(id) === nearRegion) ?? food.areaIds[0];
}

function toSingleLeg(q: QuoteResult, perPax: boolean): SingleLegQuote {
  return {
    platformName: q.platform.name,
    platformId:   q.platformId,
    minutes:      Math.round(q.minutes),
    price:        Math.round(q.price * 100) / 100,
    surgeLabel:   q.surgeLabel,
    perPax,
  };
}

/** Compute all 4 transport options for a single leg. */
function computeLegOptions(
  fromAreaId: string,
  toAreaId: string,
  atHour: number,
  dayDurationHours: number,
): TravelLegOptions | null {
  if (fromAreaId === toAreaId) return null;
  const from = SG_AREAS.find(a => a.id === fromAreaId);
  const to   = SG_AREAS.find(a => a.id === toAreaId);
  if (!from || !to) return null;

  const timeBlock = getTimeBlockForH(atHour);
  const quotes    = quoteAll(from, to, timeBlock, {
    getgoStopoverHours: dayDurationHours,
    flexarStations: FLEXAR_STATIONS,
  });
  const avail = quotes.filter(q => !q.unavailable);

  const ptQ     = avail.find(q => q.platformId === "publictransport");
  // Cheapest hail-type platform (Grab, TADA, Gojek)
  const taxiQ   = avail
    .filter(q => q.platform.kind === "hail")
    .sort((a, b) => a.price - b.price)[0];
  const flexarQ = avail.find(q => q.platformId === "flexar");
  const getgoQ  = avail.find(q => q.platformId === "getgo");

  // Flexar: only include if stations are within 15-min walk at both ends
  const flexarOk = !!(
    flexarQ?.flexar &&
    flexarQ.flexar.walkInMin <= 15 &&
    flexarQ.flexar.walkOutMin <= 15
  );

  const flexarLeg: FlexarLegQuote | null = flexarOk && flexarQ
    ? { ...toSingleLeg(flexarQ, false), walkInMin: flexarQ.flexar!.walkInMin, walkOutMin: flexarQ.flexar!.walkOutMin }
    : null;

  const getgoLeg: GetGoLegQuote | null = getgoQ?.getgo
    ? { ...toSingleLeg(getgoQ, false), stopoverHours: getgoQ.getgo.stopoverHours }
    : null;

  return {
    fromName: from.name,
    toName:   to.name,
    fromAreaId,
    toAreaId,
    publictransport: ptQ  ? toSingleLeg(ptQ, true)   : null,
    taxi:            taxiQ ? toSingleLeg(taxiQ, false) : null,
    flexar:          flexarLeg,
    getgo:           getgoLeg,
  };
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreFood(deal: Deal, mealType: string, foodTypes: string[]): number {
  let score = 0;
  const lower = deal.text.toLowerCase();
  const tags  = deal.tags.map(t => t.toLowerCase());
  for (const kw of MEAL_KEYWORDS[mealType] ?? []) { if (lower.includes(kw)) { score += 10; break; } }
  if (tags.includes(`#${mealType}`)) score += 8;
  if (extractFirstPrice(deal.text) !== null) score += 4;
  if (extractDealBadge(deal.text)) score += 6;
  for (const ft of foodTypes) {
    for (const kw of CUISINE_KEYWORDS[ft] ?? []) { if (lower.includes(kw)) { score += 8; break; } }
  }
  const daysOld = (Date.now() - new Date(deal.date).getTime()) / 86_400_000;
  if (daysOld < 7) score += 5; else if (daysOld < 30) score += 2;
  if (deal.imageUrl) score += 2;
  return score;
}

function scoreActivity(deal: Deal, requested: string[], hasKids: boolean, hasYoungKids: boolean): number {
  let score = 0;
  const lower = deal.text.toLowerCase();
  const tags  = deal.tags.map(t => t.toLowerCase());
  if (requested.length === 0) { score += 5; }
  else { for (const act of requested) { if (tags.includes(`#${act}`) || (ACTIVITY_KEYWORDS[act] ?? []).some(kw => lower.includes(kw))) score += 15; } }
  if (hasKids && (tags.includes("#family") || tags.includes("#kids") || lower.includes("family") || lower.includes("kids"))) score += 10;
  if (hasYoungKids && ["climbing", "treeto", "obstacle", "bouldering"].some(u => lower.includes(u))) score -= 8;
  const daysOld = (Date.now() - new Date(deal.date).getTime()) / 86_400_000;
  if (daysOld < 7) score += 5; else if (daysOld < 30) score += 2;
  if (deal.imageUrl) score += 2;
  return score;
}

function scoreCuratedFood(food: CuratedFood, mealType: string, foodTypes: string[], nearAreaId: string | null): number {
  let score = 0;
  if (food.mealTypes.includes(mealType)) score += 20;
  if (foodTypes.length > 0) { for (const ft of foodTypes) { if (food.cuisineTypes.includes(ft)) score += 15; } }
  else { score += 5; }
  if (nearAreaId) {
    if (food.areaIds.includes(nearAreaId)) score += 20;
    else if (food.areaIds.some(id => getAreaRegion(id) === getAreaRegion(nearAreaId))) score += 8;
  }
  return score;
}

function scoreCuratedActivity(ca: CuratedActivity, requested: string[], hasKids: boolean, hasYoungKids: boolean, lastAreaId: string | null, slotH: number): number {
  let score = 0;
  if (requested.length === 0) { score += 5; }
  else { for (const act of requested) { const kws = ACTIVITY_KEYWORDS[act] ?? []; if (ca.tags.includes(`#${act}`) || ca.keywords.some(k => kws.includes(k) || k === act)) score += 15; } }
  if (hasKids && (ca.tags.includes("#family") || ca.tags.includes("#kids"))) score += 10;
  if (hasYoungKids && ["climbing", "treeto", "obstacle", "bouldering", "hiking"].some(u => ca.keywords.includes(u))) score -= 10;
  if (lastAreaId) { if (ca.areaId === lastAreaId) score += 20; else if (getAreaRegion(ca.areaId) === getAreaRegion(lastAreaId)) score += 8; }
  const tod = timeOfDay(slotH);
  if (ca.bestTimeOfDay !== -1 && ca.bestTimeOfDay === tod) score += 8;
  if (tod === 1 && ca.tags.includes("#outdoor") && !ca.tags.includes("#beach")) score -= 4;
  return score;
}

function estimateCostPerPax(item: Deal | CuratedActivity | CuratedFood, type: "meal" | "activity", mealType?: string): number {
  const text = "text" in item ? item.text : item.excerpt;
  if (isFreeActivity(text)) return 0;
  const price = extractFirstPrice(text);
  if (price !== null) return price;
  if (type === "meal" && mealType) return MEAL_DEFAULT_COST[mealType] ?? 15;
  const tags = item.tags.map(t => t.toLowerCase());
  for (const [tag, cost] of ACTIVITY_TAG_COST) { if (tags.includes(tag)) return cost; }
  if ("estimatedCostPerPax" in item) return item.estimatedCostPerPax;
  return 20;
}

// ── Slot sequence ─────────────────────────────────────────────────────────────

interface SlotSpec { type: "meal" | "activity"; mealType?: string; targetH: number; }

function generateSlotSequence(startH: number, durationH: number, meals: string[]): SlotSpec[] {
  const endH = startH + durationH;
  const specs: SlotSpec[] = [];
  let cursor = startH;
  const orderedMeals = ["breakfast", "brunch", "lunch", "dinner"].filter(m => meals.includes(m));
  const scheduled: Array<{ h: number; mealType: string; dur: number }> = [];
  let lastMealEnd = -Infinity;
  for (const meal of orderedMeals) {
    const natural  = MEAL_NATURAL_H[meal] ?? startH;
    const earliest = Math.max(startH, natural, lastMealEnd + 2);
    const dur      = MEAL_DUR[meal] ?? 1;
    if (earliest + dur > endH) continue;
    scheduled.push({ h: earliest, mealType: meal, dur });
    lastMealEnd = earliest + dur;
  }
  for (const ms of scheduled) {
    while (cursor + ACTIVITY_DUR <= ms.h - TRAVEL_BUFFER) { specs.push({ type: "activity", targetH: cursor }); cursor += ACTIVITY_DUR + TRAVEL_BUFFER; }
    specs.push({ type: "meal", mealType: ms.mealType, targetH: ms.h });
    cursor = ms.h + ms.dur + TRAVEL_BUFFER;
  }
  while (cursor + ACTIVITY_DUR <= endH) { specs.push({ type: "activity", targetH: cursor }); cursor += ACTIVITY_DUR + TRAVEL_BUFFER; }
  return specs;
}

// ── Core builder ──────────────────────────────────────────────────────────────

function buildItinerary(req: PlanRequest, foodDeals: Deal[], weekendDeals: Deal[]): PlanResponse {
  const { adults, kidAges, startTime, durationHours, meals, activities, foodTypes, startAreaId } = req;
  const pax          = adults + kidAges.length;
  const hasKids      = kidAges.length > 0;
  const hasYoungKids = kidAges.some(a => ["0–2", "3–6"].includes(a));
  const startH       = toDecimalH(startTime);
  const specs        = generateSlotSequence(startH, durationHours, meals);

  const usedFoodDealIds = new Set<number>();
  const usedActDealIds  = new Set<number>();
  const usedCuratedFood = new Set<string>();
  const usedCuratedAct  = new Set<string>();
  const LIVE_BONUS      = 15;

  // Pass 1: pick content for each slot, track areas
  interface Draft { spec: SlotSpec; areaId: string | null; content: ItinerarySlot; }
  const drafts: Draft[] = [];
  let lastAreaId: string | null = startAreaId || null;

  for (const spec of specs) {
    if (spec.type === "meal") {
      const mealType = spec.mealType!;
      const dealCands = foodDeals.filter(d => !usedFoodDealIds.has(d.id)).map(d => ({ kind: "deal" as const, d, score: scoreFood(d, mealType, foodTypes) + LIVE_BONUS }));
      const curatedCands = CURATED_FOOD_DB.filter(f => !usedCuratedFood.has(f.title)).map(f => ({ kind: "curated" as const, f, score: scoreCuratedFood(f, mealType, foodTypes, lastAreaId) }));
      const best = [...dealCands, ...curatedCands].sort((a, b) => b.score - a.score)[0];
      if (!best) continue;

      let areaId: string | null = null;
      let slot: ItinerarySlot;
      if (best.kind === "deal") {
        usedFoodDealIds.add(best.d.id);
        const cpp = estimateCostPerPax(best.d, "meal", mealType);
        slot = { time: formatTime(spec.targetH), type: "meal", mealType, title: best.d.excerpt.slice(0, 80), excerpt: best.d.excerpt, estimatedCostPerPax: cpp, totalCost: cpp * pax, imageUrl: best.d.imageUrl, moreInfoUrl: best.d.moreInfoUrl, telegramUrl: best.d.telegramUrl, tags: best.d.tags, isRealDeal: true, dealBadge: extractDealBadge(best.d.text) };
      } else {
        usedCuratedFood.add(best.f.title);
        areaId = pickFoodArea(best.f, lastAreaId);
        const cpp = best.f.estimatedCostPerPax;
        slot = { time: formatTime(spec.targetH), type: "meal", mealType, title: best.f.title, excerpt: best.f.excerpt, estimatedCostPerPax: cpp, totalCost: cpp * pax, moreInfoUrl: best.f.moreInfoUrl, tags: best.f.tags, isRealDeal: false, areaId: areaId ?? undefined, areaName: SG_AREAS.find(a => a.id === areaId)?.name };
      }
      if (areaId) lastAreaId = areaId;
      drafts.push({ spec, areaId, content: slot });

    } else {
      const dealCands = weekendDeals.filter(d => !usedActDealIds.has(d.id)).map(d => ({ kind: "deal" as const, d, score: scoreActivity(d, activities, hasKids, hasYoungKids) + LIVE_BONUS }));
      const curatedCands = CURATED_ACTIVITIES.filter(ca => !usedCuratedAct.has(ca.title)).map(ca => ({ kind: "curated" as const, ca, score: scoreCuratedActivity(ca, activities, hasKids, hasYoungKids, lastAreaId, spec.targetH) }));
      const best = [...dealCands, ...curatedCands].sort((a, b) => b.score - a.score)[0];
      if (!best) continue;

      let areaId: string | null = null;
      let slot: ItinerarySlot;
      if (best.kind === "deal") {
        usedActDealIds.add(best.d.id);
        const cpp = estimateCostPerPax(best.d, "activity");
        slot = { time: formatTime(spec.targetH), type: "activity", title: best.d.excerpt.slice(0, 80), excerpt: best.d.excerpt, estimatedCostPerPax: cpp, totalCost: cpp * pax, imageUrl: best.d.imageUrl, moreInfoUrl: best.d.moreInfoUrl, telegramUrl: best.d.telegramUrl, tags: best.d.tags, isRealDeal: true, dealBadge: extractDealBadge(best.d.text) };
      } else {
        usedCuratedAct.add(best.ca.title);
        areaId = best.ca.areaId;
        const cpp = best.ca.estimatedCostPerPax;
        slot = { time: formatTime(spec.targetH), type: "activity", title: best.ca.title, excerpt: best.ca.excerpt, estimatedCostPerPax: cpp, totalCost: cpp * pax, moreInfoUrl: best.ca.moreInfoUrl, tags: best.ca.tags, isRealDeal: false, areaId, areaName: SG_AREAS.find(a => a.id === areaId)?.name };
      }
      if (areaId) lastAreaId = areaId;
      drafts.push({ spec, areaId, content: slot });
    }
  }

  // Pass 2: compute travel options and adjust times
  const itinerary: ItinerarySlot[] = [];
  let cursor = startH;

  let departureOptions: TravelLegOptions | undefined;
  const firstDraft = drafts[0];
  if (startAreaId && firstDraft?.areaId && startAreaId !== firstDraft.areaId) {
    const opts = computeLegOptions(startAreaId, firstDraft.areaId, startH, durationHours);
    if (opts) {
      departureOptions = opts;
      // Adjust cursor by cheapest option's travel time (PT as default baseline)
      const baseMin = opts.publictransport?.minutes ?? opts.taxi?.minutes ?? 20;
      cursor += baseMin / 60;
    }
  }

  for (let i = 0; i < drafts.length; i++) {
    const { spec, areaId, content } = drafts[i];
    const slotH = spec.type === "meal" ? Math.max(cursor, spec.targetH) : cursor;
    const slot: ItinerarySlot = { ...content, time: formatTime(slotH) };

    // Compute travel to NEXT slot (if areas differ)
    const next = drafts[i + 1];
    if (next?.areaId && areaId && areaId !== next.areaId) {
      const slotDur = spec.type === "meal" ? (MEAL_DUR[spec.mealType ?? "lunch"] ?? 1) : ACTIVITY_DUR;
      const opts = computeLegOptions(areaId, next.areaId, Math.floor(slotH + slotDur), durationHours);
      if (opts) {
        slot.travelAfterOptions = opts;
        const baseMin = opts.publictransport?.minutes ?? opts.taxi?.minutes ?? 15;
        cursor = slotH + slotDur + baseMin / 60 + TRAVEL_BUFFER;
      } else {
        cursor = slotH + (spec.type === "meal" ? (MEAL_DUR[spec.mealType ?? "lunch"] ?? 1) : ACTIVITY_DUR) + TRAVEL_BUFFER;
      }
    } else {
      cursor = slotH + (spec.type === "meal" ? (MEAL_DUR[spec.mealType ?? "lunch"] ?? 1) : ACTIVITY_DUR) + TRAVEL_BUFFER;
    }

    itinerary.push(slot);
  }

  // Return travel options
  let returnOptions: TravelLegOptions | undefined;
  const lastDraft = drafts[drafts.length - 1];
  if (startAreaId && lastDraft?.areaId && startAreaId !== lastDraft.areaId) {
    const opts = computeLegOptions(lastDraft.areaId, startAreaId, Math.floor(cursor), durationHours);
    if (opts) returnOptions = opts;
  }

  const totalFoodCost       = itinerary.filter(s => s.type === "meal").reduce((s, i) => s + i.totalCost, 0);
  const totalActivitiesCost = itinerary.filter(s => s.type === "activity").reduce((s, i) => s + i.totalCost, 0);
  const startArea           = SG_AREAS.find(a => a.id === startAreaId);

  return {
    itinerary,
    departureOptions,
    returnOptions,
    totalFoodCost,
    totalActivitiesCost,
    pax,
    generatedAt: new Date().toISOString(),
    startAreaName: startArea?.name,
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body: PlanRequest = await req.json();
    if (!body.startTime || !body.durationHours) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const origin = new URL(req.url).origin;
    const [dealsRes, weekendRes] = await Promise.all([
      fetch(`${origin}/api/deals`,   { cache: "no-store" }),
      fetch(`${origin}/api/weekend`, { cache: "no-store" }),
    ]);
    const foodDeals:    Deal[] = dealsRes.ok  ? ((await dealsRes.json()).deals   ?? []) : [];
    const weekendDeals: Deal[] = weekendRes.ok ? ((await weekendRes.json()).deals ?? []) : [];
    return NextResponse.json(buildItinerary(body, foodDeals, weekendDeals));
  } catch (err) {
    console.error("[/api/plan]", err);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}
