import { NextResponse } from "next/server";
import type { Deal, ItinerarySlot, PlanResponse, CommuteOption } from "@/lib/types";
import { SG_AREAS, TIME_BLOCKS, quoteAll } from "@/lib/quote";

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
  // East
  {
    title: "East Coast Park",
    excerpt: "Singapore's favourite beach park — rent a bicycle, enjoy BBQ pits, and stroll along the coast.",
    moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/east-coast-park",
    tags: ["#outdoor", "#beach", "#family", "#cycling"],
    estimatedCostPerPax: 5,
    keywords: ["outdoor", "beach", "family", "cycling", "nature", "park"],
    areaId: "east-coast",
  },
  {
    title: "Jewel Changi Airport",
    excerpt: "Home to the world's tallest indoor waterfall (HSBC Rain Vortex), indoor forest, and 280+ shops and restaurants.",
    moreInfoUrl: "https://www.jewelchangiairport.com/",
    tags: ["#indoor", "#family", "#kids", "#shopping"],
    estimatedCostPerPax: 15,
    keywords: ["indoor", "family", "kids", "shopping", "waterfall"],
    areaId: "changi",
  },
  {
    title: "Katong Heritage Walk",
    excerpt: "Stroll through Singapore's vibrant Peranakan neighbourhood — colourful shophouses, heritage trails, and Katong laksa.",
    moreInfoUrl: "https://www.visitsingapore.com/walking-tour/katong-joo-chiat/",
    tags: ["#outdoor", "#culture", "#heritage", "#food"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "heritage", "culture", "walking", "peranakan"],
    areaId: "katong",
  },
  // Central
  {
    title: "Gardens by the Bay (Outdoor Gardens)",
    excerpt: "Iconic Supertrees, serene landscapes, and water features — all outdoors and free to explore any time.",
    moreInfoUrl: "https://www.gardensbythebay.com.sg/",
    tags: ["#outdoor", "#family", "#nature", "#kids"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "garden", "nature", "family", "kids", "supertree"],
    areaId: "marina",
  },
  {
    title: "National Museum of Singapore",
    excerpt: "Journey through Singapore's story from ancient trading port to modern metropolis. Great for all ages.",
    moreInfoUrl: "https://www.nationalmuseum.sg/",
    tags: ["#museum", "#indoor", "#family", "#history"],
    estimatedCostPerPax: 15,
    keywords: ["museum", "indoor", "history", "culture", "heritage"],
    areaId: "bugis",
  },
  {
    title: "ArtScience Museum",
    excerpt: "Where art meets science — immersive exhibitions inside the iconic lotus-shaped building at Marina Bay Sands.",
    moreInfoUrl: "https://www.marinabaysands.com/museum.html",
    tags: ["#museum", "#indoor", "#arts", "#family"],
    estimatedCostPerPax: 17,
    keywords: ["museum", "indoor", "art", "science", "culture", "exhibition"],
    areaId: "marina",
  },
  {
    title: "Fort Canning Park",
    excerpt: "Historic hilltop park in the CBD — walking trails, heritage landmarks, and frequent outdoor events.",
    moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/fort-canning-park",
    tags: ["#outdoor", "#history", "#family"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "history", "walking", "city", "park"],
    areaId: "chinatown",
  },
  {
    title: "Haji Lane & Arab Street",
    excerpt: "Singapore's hippest street — vibrant murals, indie boutiques, and eclectic cafés in the historic Kampong Glam district.",
    moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/haji-lane/",
    tags: ["#outdoor", "#arts", "#culture", "#shopping"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "arts", "culture", "shopping", "street", "cafe"],
    areaId: "bugis",
  },
  {
    title: "Clarke Quay & Singapore River",
    excerpt: "Vibrant riverside precinct with restored heritage shophouses, restaurants, and bars along the Singapore River.",
    moreInfoUrl: "https://www.clarke-quay.com.sg/",
    tags: ["#outdoor", "#arts", "#family", "#riverside"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "riverside", "arts", "entertainment", "night"],
    areaId: "chinatown",
  },
  {
    title: "Merlion Park & Marina Bay",
    excerpt: "Visit Singapore's most iconic landmark and enjoy the stunning cityscape of Marina Bay — always free.",
    moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/merlion-park/",
    tags: ["#outdoor", "#family", "#kids", "#landmark"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "landmark", "family", "kids", "photography"],
    areaId: "marina",
  },
  {
    title: "Chinatown Heritage & Food Street",
    excerpt: "Explore vibrant Pagoda Street, heritage temples, and the famous Chinatown Complex Food Centre.",
    moreInfoUrl: "https://www.chinatown.sg/",
    tags: ["#outdoor", "#culture", "#food", "#family"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "culture", "heritage", "food", "hawker"],
    areaId: "chinatown",
  },
  {
    title: "Singapore Botanic Gardens",
    excerpt: "UNESCO World Heritage Site — orchid garden, heritage trees, and tranquil lakes. Free entry to most areas.",
    moreInfoUrl: "https://www.nparks.gov.sg/sbg",
    tags: ["#outdoor", "#nature", "#family", "#kids"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "garden", "nature", "family", "walking", "orchid"],
    areaId: "orchard",
  },
  {
    title: "Tiong Bahru Neighbourhood",
    excerpt: "Explore Singapore's hippest neighbourhood — art deco architecture, indie bookshops, and artisan bakeries.",
    moreInfoUrl: "https://www.visitsingapore.com/walking-tour/tiong-bahru/",
    tags: ["#outdoor", "#arts", "#culture", "#food"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "arts", "culture", "food", "neighbourhood", "cafe"],
    areaId: "tiong-bahru",
  },
  {
    title: "Little India Heritage Walk",
    excerpt: "Immerse yourself in vibrant colours, spices, and temples on a self-guided walk through Little India.",
    moreInfoUrl: "https://www.visitsingapore.com/walking-tour/little-india/",
    tags: ["#outdoor", "#culture", "#heritage", "#family"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "heritage", "culture", "walking", "india"],
    areaId: "novena",
  },
  {
    title: "Sports Hub (Climbing & Aquatic Centre)",
    excerpt: "Singapore's mega sports complex — climbing walls, Olympic-size pools, and sports halls in one venue.",
    moreInfoUrl: "https://www.sgsportshub.com.sg/",
    tags: ["#sports", "#indoor", "#family"],
    estimatedCostPerPax: 12,
    keywords: ["sport", "swim", "climb", "gym", "fitness", "indoor"],
    areaId: "bugis",
  },
  // South
  {
    title: "Sentosa (Siloso & Palawan Beaches)",
    excerpt: "Singapore's go-to beach destination — free beach access with water sports and great food nearby.",
    moreInfoUrl: "https://www.sentosa.com.sg/en/things-to-do/beaches/",
    tags: ["#beach", "#outdoor", "#family", "#kids"],
    estimatedCostPerPax: 4,
    keywords: ["beach", "outdoor", "sentosa", "family", "kids", "swim"],
    areaId: "sentosa",
  },
  {
    title: "Universal Studios Singapore",
    excerpt: "Southeast Asia's only Universal Studios — rides, shows, and beloved IP characters for all ages.",
    moreInfoUrl: "https://www.rwsentosa.com/en/attractions/universal-studios-singapore",
    tags: ["#indoor", "#family", "#kids", "#theme-park"],
    estimatedCostPerPax: 83,
    keywords: ["indoor", "family", "kids", "theme park", "rides"],
    areaId: "sentosa",
  },
  {
    title: "S.E.A. Aquarium",
    excerpt: "One of the world's largest aquariums — over 100,000 marine animals across 50 different habitats.",
    moreInfoUrl: "https://www.rwsentosa.com/en/attractions/sea-aquarium",
    tags: ["#indoor", "#family", "#kids", "#nature"],
    estimatedCostPerPax: 42,
    keywords: ["indoor", "family", "kids", "aquarium", "nature", "marine"],
    areaId: "sentosa",
  },
  // North-East
  {
    title: "MacRitchie Reservoir Park",
    excerpt: "Walk the iconic HSBC TreeTop Walk suspension bridge and explore lush rainforest trails.",
    moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/central-catchment-nature-reserve",
    tags: ["#outdoor", "#hiking", "#nature", "#family"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "hiking", "nature", "trail", "treeto", "walk"],
    areaId: "bishan",
  },
  {
    title: "Bishan–Ang Mo Kio Park",
    excerpt: "One of Singapore's largest parks with a restored river, inclusive playgrounds, and cycling paths.",
    moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/bishan---ang-mo-kio-park",
    tags: ["#outdoor", "#family", "#kids", "#cycling"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "family", "kids", "park", "cycling"],
    areaId: "ang-mo-kio",
  },
  {
    title: "Punggol Waterway Park",
    excerpt: "Scenic 4.2 km waterway park in the north-east — kayaking, cycling, and picnic spots along the water.",
    moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/punggol-waterway-park",
    tags: ["#outdoor", "#family", "#kids", "#cycling"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "family", "kids", "cycling", "kayak", "waterway"],
    areaId: "punggol",
  },
  // North
  {
    title: "Singapore Zoo",
    excerpt: "Award-winning open-concept zoo — hundreds of species in naturalistic habitats. Famous orang utan breakfast!",
    moreInfoUrl: "https://www.mandai.com/en/singapore-zoo.html",
    tags: ["#outdoor", "#nature", "#family", "#kids"],
    estimatedCostPerPax: 46,
    keywords: ["outdoor", "nature", "family", "kids", "wildlife", "zoo", "animals"],
    areaId: "yishun",
  },
  {
    title: "Mandai Night Safari",
    excerpt: "The world's first nocturnal wildlife park — tram rides through 7 habitats with over 2,500 animals.",
    moreInfoUrl: "https://www.mandai.com/en/night-safari.html",
    tags: ["#outdoor", "#nature", "#family", "#kids"],
    estimatedCostPerPax: 55,
    keywords: ["outdoor", "nature", "family", "kids", "wildlife", "safari", "night"],
    areaId: "yishun",
  },
  // West
  {
    title: "Bukit Timah Nature Reserve",
    excerpt: "Summit Singapore's highest natural peak through primary rainforest — great wildlife sightings along the way.",
    moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/bukit-timah-nature-reserve",
    tags: ["#outdoor", "#hiking", "#nature"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "hiking", "nature", "trail", "summit", "bukit"],
    areaId: "bukit-timah",
  },
];

const CURATED_FOOD_DB: CuratedFood[] = [
  // Western
  {
    title: "Tiong Bahru Bakery",
    excerpt: "Beloved Singapore bakery famous for impossibly flaky croissants and artisan pastries — perfect for breakfast or brunch.",
    moreInfoUrl: "https://tiongbahrubakery.com/",
    tags: ["#breakfast", "#brunch", "#cafe", "#western"],
    estimatedCostPerPax: 15,
    cuisineTypes: ["western"],
    areaIds: ["tiong-bahru", "orchard", "marina"],
    mealTypes: ["breakfast", "brunch"],
  },
  {
    title: "Dempsey Hill Restaurants",
    excerpt: "A charming enclave of restored colonial bungalows with great Western dining options for brunch through dinner.",
    moreInfoUrl: "https://dempseyhill.com/",
    tags: ["#western", "#brunch", "#lunch", "#dinner"],
    estimatedCostPerPax: 35,
    cuisineTypes: ["western"],
    areaIds: ["orchard", "bukit-timah"],
    mealTypes: ["brunch", "lunch", "dinner"],
  },
  {
    title: "East Coast Seafood (UDMC)",
    excerpt: "Singapore's most famous stretch for chilli crab, black pepper crab, and fresh seafood along the coast.",
    moreInfoUrl: "https://www.visitsingapore.com/dining-drinks-singapore/food-experiences/east-coast-seafood/",
    tags: ["#seafood", "#dinner", "#lunch"],
    estimatedCostPerPax: 45,
    cuisineTypes: ["western", "chinese"],
    areaIds: ["east-coast", "bedok"],
    mealTypes: ["lunch", "dinner"],
  },
  {
    title: "Holland Village Cafés",
    excerpt: "A popular enclave with a mix of Western bistros and casual restaurants — great for weekend brunch.",
    moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/holland-village/",
    tags: ["#western", "#brunch", "#cafe"],
    estimatedCostPerPax: 22,
    cuisineTypes: ["western"],
    areaIds: ["queenstown", "clementi"],
    mealTypes: ["breakfast", "brunch", "lunch"],
  },
  // Chinese
  {
    title: "Maxwell Food Centre",
    excerpt: "One of Singapore's most famous hawker centres — Tian Tian chicken rice, Zhen Zhen porridge, and more from S$4.",
    moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/maxwell-food-centre/",
    tags: ["#lunch", "#hawker", "#local", "#chinese"],
    estimatedCostPerPax: 8,
    cuisineTypes: ["chinese"],
    areaIds: ["outram", "chinatown"],
    mealTypes: ["breakfast", "lunch", "dinner"],
  },
  {
    title: "Chinatown Complex Food Centre",
    excerpt: "Over 260 stalls serving authentic Chinese classics — one of Singapore's largest and most beloved hawker centres.",
    moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/chinatown-complex/",
    tags: ["#lunch", "#dinner", "#hawker", "#chinese"],
    estimatedCostPerPax: 8,
    cuisineTypes: ["chinese"],
    areaIds: ["chinatown"],
    mealTypes: ["breakfast", "lunch", "dinner"],
  },
  {
    title: "Old Airport Road Food Centre",
    excerpt: "Heritage hawker gem with legendary stalls — famous for beef hor fun, hokkien mee, and char kway teow.",
    moreInfoUrl: "https://www.hungrygowhere.com/places/old-airport-road-food-centre",
    tags: ["#lunch", "#dinner", "#hawker", "#chinese"],
    estimatedCostPerPax: 7,
    cuisineTypes: ["chinese"],
    areaIds: ["katong", "bedok"],
    mealTypes: ["breakfast", "lunch", "dinner"],
  },
  {
    title: "Lau Pa Sat Festival Market",
    excerpt: "Iconic Victorian cast-iron hawker market in the CBD — famous for evening satay and a wide variety of local cuisine.",
    moreInfoUrl: "https://www.laupasat.sg/",
    tags: ["#dinner", "#hawker", "#satay", "#chinese"],
    estimatedCostPerPax: 18,
    cuisineTypes: ["chinese", "malay"],
    areaIds: ["marina", "chinatown"],
    mealTypes: ["lunch", "dinner"],
  },
  {
    title: "Newton Food Centre",
    excerpt: "Singapore's most famous open-air hawker centre — freshly grilled satay, BBQ seafood, and rojak from S$5.",
    moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/newton-food-centre/",
    tags: ["#dinner", "#hawker", "#local"],
    estimatedCostPerPax: 15,
    cuisineTypes: ["chinese", "malay"],
    areaIds: ["newton", "novena", "orchard"],
    mealTypes: ["dinner"],
  },
  {
    title: "Swee Choon Dim Sum",
    excerpt: "One of Singapore's best dim sum spots — try the fluffy char siu bao and crispy spring rolls.",
    moreInfoUrl: "https://www.sweechoon.com/",
    tags: ["#dinner", "#breakfast", "#chinese", "#dim-sum"],
    estimatedCostPerPax: 22,
    cuisineTypes: ["chinese"],
    areaIds: ["novena", "bugis"],
    mealTypes: ["breakfast", "dinner"],
  },
  // Indian
  {
    title: "Banana Leaf Apolo",
    excerpt: "Legendary banana leaf curry restaurant in Little India — fish head curry, biryani, and 40+ years of flavour.",
    moreInfoUrl: "https://www.thebananaleafapolo.com/",
    tags: ["#lunch", "#dinner", "#indian"],
    estimatedCostPerPax: 22,
    cuisineTypes: ["indian"],
    areaIds: ["novena"],
    mealTypes: ["lunch", "dinner"],
  },
  {
    title: "Komala Vilas (Little India)",
    excerpt: "Vegetarian South Indian institution since 1947 — masala dosa, thali sets, and fresh coconut water.",
    moreInfoUrl: "https://komalavilas.com.sg/",
    tags: ["#breakfast", "#lunch", "#dinner", "#indian", "#vegetarian"],
    estimatedCostPerPax: 10,
    cuisineTypes: ["indian"],
    areaIds: ["novena"],
    mealTypes: ["breakfast", "lunch", "dinner"],
  },
  {
    title: "Springleaf Prata Place",
    excerpt: "Freshly made roti prata at any hour — perfect with dhal and curry. Multiple locations across Singapore.",
    moreInfoUrl: "https://www.springleafprataplace.com/",
    tags: ["#breakfast", "#indian", "#prata"],
    estimatedCostPerPax: 8,
    cuisineTypes: ["indian"],
    areaIds: ["ang-mo-kio", "bishan", "novena"],
    mealTypes: ["breakfast", "brunch"],
  },
  // Malay
  {
    title: "Hajjah Maimunah Restaurant",
    excerpt: "Beloved Malay heritage restaurant in Kampong Glam — nasi padang with over 40 dishes displayed daily.",
    moreInfoUrl: "https://www.hajjahmaimunah.com/",
    tags: ["#lunch", "#malay", "#nasi-padang"],
    estimatedCostPerPax: 14,
    cuisineTypes: ["malay"],
    areaIds: ["bugis"],
    mealTypes: ["breakfast", "lunch"],
  },
  {
    title: "Geylang Serai Market",
    excerpt: "The heartland of Malay culture in Singapore — wet market and food centre with authentic Malay delights.",
    moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/geylang-serai-market/",
    tags: ["#breakfast", "#lunch", "#malay", "#hawker"],
    estimatedCostPerPax: 8,
    cuisineTypes: ["malay"],
    areaIds: ["bedok", "katong"],
    mealTypes: ["breakfast", "lunch"],
  },
  {
    title: "Zam Zam Restaurant",
    excerpt: "Century-old Muslim eatery at Arab Street — famous for roti john, murtabak, and fragrant biryanis.",
    moreInfoUrl: "https://www.visitsingapore.com/dining-drinks-singapore/local-dishes/murtabak/",
    tags: ["#breakfast", "#lunch", "#dinner", "#malay", "#murtabak"],
    estimatedCostPerPax: 12,
    cuisineTypes: ["malay", "indian"],
    areaIds: ["bugis"],
    mealTypes: ["breakfast", "lunch", "dinner"],
  },
  // General / kopitiam
  {
    title: "Traditional Kopitiam Breakfast",
    excerpt: "Start your Singapore morning right — kaya toast, soft-boiled eggs, and kopi at any neighbourhood kopitiam from S$5.",
    moreInfoUrl: "https://www.visitsingapore.com/dining-drinks-singapore/local-dishes/kaya-toast/",
    tags: ["#breakfast", "#local", "#hawker"],
    estimatedCostPerPax: 6,
    cuisineTypes: ["chinese", "malay"],
    areaIds: ["orchard", "bugis", "chinatown", "novena", "ang-mo-kio", "tampines"],
    mealTypes: ["breakfast"],
  },
  {
    title: "Café Brunch",
    excerpt: "Singapore's café scene is thriving — Tiong Bahru, Tanjong Pagar, and Dempsey Hill offer excellent brunch from S$18.",
    moreInfoUrl: "https://www.hungrygowhere.com/",
    tags: ["#brunch", "#cafe", "#western"],
    estimatedCostPerPax: 22,
    cuisineTypes: ["western"],
    areaIds: ["tiong-bahru", "outram", "orchard"],
    mealTypes: ["brunch"],
  },
];

// ── Keyword maps ──────────────────────────────────────────────────────────────

const CUISINE_KEYWORDS: Record<string, string[]> = {
  western: ["western", "burger", "pasta", "pizza", "steak", "cafe", "sandwich", "salad", "brunch", "bagel", "croissant"],
  chinese: ["chinese", "dim sum", "bak kut", "char siu", "roast", "dumpling", "wonton", "claypot", "noodle", "porridge", "congee", "hor fun", "kway teow"],
  indian:  ["indian", "naan", "curry", "briyani", "biryani", "tandoor", "roti", "prata", "thali", "masala", "dosa", "banana leaf"],
  malay:   ["malay", "nasi", "rendang", "satay", "laksa", "mee", "ayam", "ikan", "murtabak", "kampung", "nasi padang", "nasi lemak"],
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
  sports:   ["sport", "swim", "tennis", "badminton", "golf", "gym", "fitness", "run", "climb"],
  arts:     ["concert", "theatre", "theater", "performance", "dance", "music", "show", "opera"],
  hiking:   ["hike", "hiking", "trail", "treeto", "reservoir", "bukit", "summit"],
  family:   ["family", "kids", "children", "child", "toddler"],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDecimalH(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
}

function formatTime(decH: number): string {
  const h = Math.floor(decH);
  const m = Math.round((decH % 1) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function extractFirstPrice(text: string): number | null {
  const prices = [...text.matchAll(/\$(\d+(?:\.\d{1,2})?)/g)]
    .map(m => parseFloat(m[1]))
    .filter(p => p > 0 && p < 500);
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

function getTimeBlock(startTime: string) {
  const h = parseInt(startTime.split(":")[0]);
  for (const block of TIME_BLOCKS) {
    const [s, e] = block.id.split("-").map(Number);
    if (h >= s && h < (e || 24)) return block;
  }
  return TIME_BLOCKS[5];
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreFood(deal: Deal, mealType: string, foodTypes: string[]): number {
  let score = 0;
  const lower = deal.text.toLowerCase();
  const tags  = deal.tags.map(t => t.toLowerCase());

  for (const kw of MEAL_KEYWORDS[mealType] ?? []) {
    if (lower.includes(kw)) { score += 10; break; }
  }
  if (tags.includes(`#${mealType}`)) score += 8;
  if (extractFirstPrice(deal.text) !== null) score += 4;
  if (extractDealBadge(deal.text)) score += 6;

  for (const ft of foodTypes) {
    for (const kw of CUISINE_KEYWORDS[ft] ?? []) {
      if (lower.includes(kw)) { score += 8; break; }
    }
  }

  const daysOld = (Date.now() - new Date(deal.date).getTime()) / 86_400_000;
  if (daysOld < 7) score += 5;
  else if (daysOld < 30) score += 2;

  if (deal.imageUrl) score += 2;
  return score;
}

function scoreActivity(
  deal: Deal,
  requested: string[],
  hasKids: boolean,
  hasYoungKids: boolean,
): number {
  let score = 0;
  const lower = deal.text.toLowerCase();
  const tags  = deal.tags.map(t => t.toLowerCase());

  if (requested.length === 0) {
    score += 5;
  } else {
    for (const act of requested) {
      const kws    = ACTIVITY_KEYWORDS[act] ?? [];
      const tagHit = tags.includes(`#${act}`);
      const txtHit = kws.some(kw => lower.includes(kw));
      if (tagHit || txtHit) score += 15;
    }
  }

  if (hasKids && (
    tags.includes("#family") || tags.includes("#kids") ||
    lower.includes("family") || lower.includes("kids") || lower.includes("children")
  )) score += 10;

  if (hasYoungKids && ["climbing", "treeto", "trail", "obstacle", "bouldering"].some(u => lower.includes(u))) {
    score -= 8;
  }

  const daysOld = (Date.now() - new Date(deal.date).getTime()) / 86_400_000;
  if (daysOld < 7) score += 5;
  else if (daysOld < 30) score += 2;

  if (deal.imageUrl) score += 2;
  return score;
}

function scoreCuratedFood(
  food: CuratedFood,
  mealType: string,
  foodTypes: string[],
  primaryAreaId: string | null,
): number {
  let score = 0;

  if (food.mealTypes.includes(mealType)) score += 20;

  if (foodTypes.length > 0) {
    for (const ft of foodTypes) {
      if (food.cuisineTypes.includes(ft)) score += 15;
    }
  } else {
    score += 5;
  }

  if (primaryAreaId) {
    if (food.areaIds.includes(primaryAreaId)) {
      score += 15;
    } else {
      const destArea = SG_AREAS.find(a => a.id === primaryAreaId);
      if (destArea) {
        const sameRegion = food.areaIds.some(
          id => SG_AREAS.find(a => a.id === id)?.region === destArea.region
        );
        if (sameRegion) score += 7;
      }
    }
  }

  return score;
}

function scoreCuratedActivity(
  ca: CuratedActivity,
  requested: string[],
  hasKids: boolean,
  hasYoungKids: boolean,
): number {
  let score = 0;

  if (requested.length === 0) {
    score += 5;
  } else {
    for (const act of requested) {
      const kws = ACTIVITY_KEYWORDS[act] ?? [];
      if (
        ca.tags.includes(`#${act}`) ||
        ca.keywords.some(k => kws.includes(k) || k === act)
      ) score += 15;
    }
  }

  if (hasKids && (
    ca.tags.includes("#family") || ca.tags.includes("#kids") ||
    ca.keywords.includes("family") || ca.keywords.includes("kids")
  )) score += 10;

  if (hasYoungKids && ["climbing", "treeto", "trail", "obstacle", "bouldering", "hiking"].some(u => ca.keywords.includes(u))) {
    score -= 8;
  }

  return score;
}

// ── Cost estimation ───────────────────────────────────────────────────────────

const MEAL_DEFAULT_COST: Record<string, number> = {
  breakfast: 10, brunch: 22, lunch: 18, dinner: 38,
};
const ACTIVITY_TAG_COST: [string, number][] = [
  ["#beach", 4], ["#outdoor", 5], ["#hiking", 5],
  ["#museum", 15], ["#sports", 20], ["#arts", 40], ["#indoor", 25],
];

function estimateCostPerPax(
  item: Deal | CuratedActivity | CuratedFood,
  type: "meal" | "activity",
  mealType?: string,
): number {
  const text = "text" in item ? item.text : item.excerpt;
  if (isFreeActivity(text)) return 0;
  const price = extractFirstPrice(text);
  if (price !== null) return price;
  if (type === "meal" && mealType) return MEAL_DEFAULT_COST[mealType] ?? 15;
  const tags = item.tags.map(t => t.toLowerCase());
  for (const [tag, cost] of ACTIVITY_TAG_COST) {
    if (tags.includes(tag)) return cost;
  }
  if ("estimatedCostPerPax" in item) return item.estimatedCostPerPax;
  return 20;
}

// ── Time-slot generator ───────────────────────────────────────────────────────

interface SlotDef { h: number; type: "meal" | "activity"; mealType?: string; }

const MEAL_NATURAL_H: Record<string, number> = { breakfast: 8.5, brunch: 10.5, lunch: 12.0, dinner: 18.5 };
const MEAL_DUR: Record<string, number>        = { breakfast: 1.0, brunch:  1.5, lunch:  1.0, dinner:  1.5 };

function generateSlots(startH: number, durationH: number, meals: string[]): SlotDef[] {
  const endH  = startH + durationH;
  const slots: SlotDef[] = [];
  let cursor  = startH;

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
    while (cursor + 1.5 <= ms.h - 0.25) {
      slots.push({ h: cursor, type: "activity" });
      cursor += 1.75;
    }
    slots.push({ h: ms.h, type: "meal", mealType: ms.mealType });
    cursor = ms.h + ms.dur + 0.25;
  }

  while (cursor + 1.5 <= endH) {
    slots.push({ h: cursor, type: "activity" });
    cursor += 1.75;
  }

  return slots;
}

// ── Core builder ──────────────────────────────────────────────────────────────

function buildItinerary(req: PlanRequest, foodDeals: Deal[], weekendDeals: Deal[]): PlanResponse {
  const { adults, kidAges, startTime, durationHours, meals, activities, foodTypes, startAreaId } = req;
  const pax          = adults + kidAges.length;
  const hasKids      = kidAges.length > 0;
  const hasYoungKids = kidAges.some(a => ["0–2", "3–6"].includes(a));
  const startH       = toDecimalH(startTime);
  const slots        = generateSlots(startH, durationHours, meals);

  // Pre-score curated activities to determine primary destination
  const scoredCuratedActs = CURATED_ACTIVITIES
    .map(ca => ({ ca, score: scoreCuratedActivity(ca, activities, hasKids, hasYoungKids) }))
    .sort((a, b) => b.score - a.score);

  const primaryDestAreaId = scoredCuratedActs[0]?.ca.areaId ?? null;

  // Compute commute if start area provided
  const startArea = startAreaId ? SG_AREAS.find(a => a.id === startAreaId) ?? null : null;
  const destArea  = primaryDestAreaId ? SG_AREAS.find(a => a.id === primaryDestAreaId) ?? null : null;

  let commuteOptions: CommuteOption[] | undefined;
  let startAreaName: string | undefined;
  let firstDestAreaName: string | undefined;

  if (startArea && destArea && startArea.id !== destArea.id) {
    startAreaName    = startArea.name;
    firstDestAreaName = destArea.name;

    const timeBlock  = getTimeBlock(startTime);
    const quotes     = quoteAll(startArea, destArea, timeBlock);
    const available  = quotes.filter(q => !q.unavailable);
    const cheapestQ  = available.find(q => q.isCheapest);
    const fastestQ   = available.find(q => q.isFastest);

    const seen: Set<string> = new Set();
    const candidates: CommuteOption[] = [];
    for (const q of [cheapestQ, fastestQ]) {
      if (q && !seen.has(q.platformId)) {
        seen.add(q.platformId);
        candidates.push({
          platformName: q.platform.name,
          price:        Math.round(q.price * 100) / 100,
          minutes:      Math.round(q.minutes),
          badge:        candidates.length === 0 ? "Cheapest" : "Fastest",
          surgeLabel:   q.surgeLabel,
        });
      }
    }
    if (candidates.length > 0) commuteOptions = candidates;
  }

  // Build itinerary — merge Telegram deals + curated DB
  const usedFoodDealIds  = new Set<number>();
  const usedActDealIds   = new Set<number>();
  const usedCuratedFood  = new Set<string>();
  const usedCuratedAct   = new Set<string>();
  const itinerary: ItinerarySlot[] = [];

  const LIVE_BONUS = 15;

  for (const slot of slots) {
    if (slot.type === "meal") {
      const mealType = slot.mealType!;

      const dealCandidates = foodDeals
        .filter(d => !usedFoodDealIds.has(d.id))
        .map(d => ({ kind: "deal" as const, d, score: scoreFood(d, mealType, foodTypes) + LIVE_BONUS }));

      const curatedCandidates = CURATED_FOOD_DB
        .filter(f => !usedCuratedFood.has(f.title))
        .map(f => ({ kind: "curated" as const, f, score: scoreCuratedFood(f, mealType, foodTypes, primaryDestAreaId) }));

      const best = [...dealCandidates, ...curatedCandidates].sort((a, b) => b.score - a.score)[0];
      if (!best) continue;

      if (best.kind === "deal") {
        const { d } = best;
        usedFoodDealIds.add(d.id);
        const cpp = estimateCostPerPax(d, "meal", mealType);
        itinerary.push({
          time: formatTime(slot.h),
          type: "meal",
          mealType,
          title:               d.excerpt.slice(0, 80),
          excerpt:             d.excerpt,
          estimatedCostPerPax: cpp,
          totalCost:           cpp * pax,
          imageUrl:            d.imageUrl,
          moreInfoUrl:         d.moreInfoUrl,
          telegramUrl:         d.telegramUrl,
          tags:                d.tags,
          isRealDeal:          true,
          dealBadge:           extractDealBadge(d.text),
        });
      } else {
        const { f } = best;
        usedCuratedFood.add(f.title);
        const cpp = f.estimatedCostPerPax;
        itinerary.push({
          time: formatTime(slot.h),
          type: "meal",
          mealType,
          title:               f.title,
          excerpt:             f.excerpt,
          estimatedCostPerPax: cpp,
          totalCost:           cpp * pax,
          moreInfoUrl:         f.moreInfoUrl,
          tags:                f.tags,
          isRealDeal:          false,
        });
      }
    } else {
      // Activity slot
      const dealCandidates = weekendDeals
        .filter(d => !usedActDealIds.has(d.id))
        .map(d => ({ kind: "deal" as const, d, score: scoreActivity(d, activities, hasKids, hasYoungKids) + LIVE_BONUS }));

      const curatedCandidates = CURATED_ACTIVITIES
        .filter(ca => !usedCuratedAct.has(ca.title))
        .map(ca => ({ kind: "curated" as const, ca, score: scoreCuratedActivity(ca, activities, hasKids, hasYoungKids) }));

      const best = [...dealCandidates, ...curatedCandidates].sort((a, b) => b.score - a.score)[0];
      if (!best) continue;

      if (best.kind === "deal") {
        const { d } = best;
        usedActDealIds.add(d.id);
        const cpp = estimateCostPerPax(d, "activity");
        itinerary.push({
          time: formatTime(slot.h),
          type: "activity",
          title:               d.excerpt.slice(0, 80),
          excerpt:             d.excerpt,
          estimatedCostPerPax: cpp,
          totalCost:           cpp * pax,
          imageUrl:            d.imageUrl,
          moreInfoUrl:         d.moreInfoUrl,
          telegramUrl:         d.telegramUrl,
          tags:                d.tags,
          isRealDeal:          true,
          dealBadge:           extractDealBadge(d.text),
        });
      } else {
        const { ca } = best;
        usedCuratedAct.add(ca.title);
        itinerary.push({
          time: formatTime(slot.h),
          type: "activity",
          title:               ca.title,
          excerpt:             ca.excerpt,
          estimatedCostPerPax: ca.estimatedCostPerPax,
          totalCost:           ca.estimatedCostPerPax * pax,
          moreInfoUrl:         ca.moreInfoUrl,
          tags:                ca.tags,
          isRealDeal:          false,
        });
      }
    }
  }

  const totalCostMin = itinerary.reduce((s, i) => s + i.estimatedCostPerPax, 0) * pax;
  const totalCostMax = Math.round(totalCostMin * 1.3);

  return {
    itinerary,
    totalCostMin,
    totalCostMax,
    pax,
    generatedAt: new Date().toISOString(),
    commuteOptions,
    startAreaName,
    firstDestAreaName,
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
