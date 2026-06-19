import { NextResponse } from "next/server";
import type { Deal, ItinerarySlot, PlanResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

// ── Request shape ─────────────────────────────────────────────────────────────

interface PlanRequest {
  adults: number;
  kidAges: string[];
  startTime: string;      // "09:00"
  durationHours: number;
  meals: string[];        // ["breakfast", "lunch"]
  activities: string[];   // ["outdoor", "museum"] — empty = any
}

// ── Fallback data (used when no real deal matches) ────────────────────────────

interface FallbackItem {
  title: string;
  excerpt: string;
  moreInfoUrl: string;
  tags: string[];
  estimatedCostPerPax: number;
  keywords: string[];
}

const FALLBACK_ACTIVITIES: FallbackItem[] = [
  {
    title: "East Coast Park",
    excerpt: "Singapore's favourite beach park — rent a bicycle, enjoy BBQ pits, and stroll along the coast with the family.",
    moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/east-coast-park",
    tags: ["#outdoor", "#beach", "#family", "#cycling"],
    estimatedCostPerPax: 5,
    keywords: ["outdoor", "beach", "family", "cycling", "nature", "park"],
  },
  {
    title: "MacRitchie Reservoir Park",
    excerpt: "Walk the iconic HSBC TreeTop Walk suspension bridge and explore lush rainforest trails above the city.",
    moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/central-catchment-nature-reserve",
    tags: ["#outdoor", "#hiking", "#nature", "#family"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "hiking", "nature", "trail", "treeto", "walk"],
  },
  {
    title: "National Museum of Singapore",
    excerpt: "Journey through Singapore's story — from ancient trading port to modern metropolis. Free for citizens and PRs.",
    moreInfoUrl: "https://www.nationalmuseum.sg/",
    tags: ["#museum", "#indoor", "#family", "#history"],
    estimatedCostPerPax: 15,
    keywords: ["museum", "indoor", "history", "culture", "heritage", "art"],
  },
  {
    title: "Gardens by the Bay (Outdoor Gardens)",
    excerpt: "The iconic Supertrees, serene landscapes, and water features — all outdoors and free to explore any time.",
    moreInfoUrl: "https://www.gardensbythebay.com.sg/",
    tags: ["#outdoor", "#family", "#nature", "#kids"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "garden", "nature", "family", "kids", "supertree"],
  },
  {
    title: "Sentosa (Siloso & Palawan Beaches)",
    excerpt: "Singapore's go-to beach destination — free beach access with water sports, cabanas, and great food options nearby.",
    moreInfoUrl: "https://www.sentosa.com.sg/en/things-to-do/beaches/",
    tags: ["#beach", "#outdoor", "#family", "#kids"],
    estimatedCostPerPax: 4,
    keywords: ["beach", "outdoor", "sentosa", "family", "kids", "swim"],
  },
  {
    title: "Singapore Botanic Gardens",
    excerpt: "UNESCO World Heritage Site — explore the orchid garden, heritage trees, and tranquil lakes. Free entry to most areas.",
    moreInfoUrl: "https://www.nparks.gov.sg/sbg",
    tags: ["#outdoor", "#nature", "#family", "#kids"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "garden", "nature", "family", "walking", "orchid"],
  },
  {
    title: "ArtScience Museum",
    excerpt: "Where science meets art — permanent and touring exhibitions inside the iconic lotus-shaped building at Marina Bay.",
    moreInfoUrl: "https://www.marinabaysands.com/museum.html",
    tags: ["#museum", "#indoor", "#arts", "#family"],
    estimatedCostPerPax: 17,
    keywords: ["museum", "indoor", "art", "science", "culture", "exhibition"],
  },
  {
    title: "Fort Canning Park",
    excerpt: "A historic hilltop park in the heart of the CBD with walking trails, heritage landmarks, and frequent outdoor events.",
    moreInfoUrl: "https://www.nparks.gov.sg/gardens-parks-and-nature/parks-and-nature-reserves/fort-canning-park",
    tags: ["#outdoor", "#history", "#family"],
    estimatedCostPerPax: 0,
    keywords: ["outdoor", "history", "walking", "city", "park", "fort"],
  },
];

const FALLBACK_MEALS: Record<string, FallbackItem> = {
  breakfast: {
    title: "Traditional Kopitiam Breakfast",
    excerpt: "Start your Singapore morning right — kaya toast, soft-boiled eggs, and kopi at any neighbourhood kopitiam from just $5.",
    moreInfoUrl: "https://www.visitsingapore.com/dining-drinks-singapore/local-dishes/kaya-toast/",
    tags: ["#breakfast", "#local", "#hawker"],
    estimatedCostPerPax: 6,
    keywords: [],
  },
  brunch: {
    title: "Brunch at a Café",
    excerpt: "Singapore's café scene is thriving — Tiong Bahru, Tanjong Pagar, and Dempsey Hill are packed with excellent brunch spots from $18/pax.",
    moreInfoUrl: "https://www.hungrygowhere.com/",
    tags: ["#brunch", "#cafe"],
    estimatedCostPerPax: 22,
    keywords: [],
  },
  lunch: {
    title: "Maxwell Food Centre",
    excerpt: "One of Singapore's most famous hawker centres — Tian Tian chicken rice, Zhen Zhen porridge and dozens of other stalls from $4.",
    moreInfoUrl: "https://www.visitsingapore.com/see-do-singapore/places-to-see/maxwell-food-centre/",
    tags: ["#lunch", "#hawker", "#local"],
    estimatedCostPerPax: 8,
    keywords: [],
  },
  dinner: {
    title: "Lau Pa Sat Festival Market",
    excerpt: "Iconic Victorian cast-iron hawker market in the CBD — famous for evening satay and a wide variety of local cuisine.",
    moreInfoUrl: "https://www.laupasat.sg/",
    tags: ["#dinner", "#hawker", "#satay"],
    estimatedCostPerPax: 20,
    keywords: [],
  },
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
  const lower = text.toLowerCase();
  return /free\s+entry|free\s+admission|free\s+for|no\s+admission|no\s+entry\s+fee/.test(lower);
}

function extractDealBadge(text: string): string | undefined {
  if (/1.for.1|1-for-1|one.for.one/i.test(text)) return "1-for-1";
  const pct = text.match(/(\d{1,2})%\s*off/i);
  if (pct) return `${pct[1]}% off`;
  if (/free\s+entry|free\s+admission/i.test(text)) return "Free entry";
  if (isFreeActivity(text)) return "Free";
  return undefined;
}

// ── Scoring ───────────────────────────────────────────────────────────────────

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
  beach:    ["beach", "sentosa", "coastal", "sea", "wave", "shore"],
  sports:   ["sport", "swim", "tennis", "badminton", "golf", "gym", "fitness", "run", "climb"],
  arts:     ["concert", "theatre", "theater", "performance", "dance", "music", "show", "opera"],
  hiking:   ["hike", "hiking", "trail", "treeto", "reservoir", "bukit", "summit"],
  family:   ["family", "kids", "children", "child", "toddler"],
};

function scoreFood(deal: Deal, mealType: string): number {
  let score = 0;
  const lower = deal.text.toLowerCase();
  const tags  = deal.tags.map(t => t.toLowerCase());

  for (const kw of MEAL_KEYWORDS[mealType] ?? []) {
    if (lower.includes(kw)) { score += 10; break; }
  }
  if (tags.includes(`#${mealType}`)) score += 8;
  if (extractFirstPrice(deal.text) !== null) score += 4;
  if (extractDealBadge(deal.text)) score += 6;

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

  if (hasYoungKids) {
    if (["climbing", "treeto", "trail", "obstacle", "bouldering"].some(u => lower.includes(u))) score -= 8;
  }

  const daysOld = (Date.now() - new Date(deal.date).getTime()) / 86_400_000;
  if (daysOld < 7) score += 5;
  else if (daysOld < 30) score += 2;

  if (deal.imageUrl) score += 2;
  return score;
}

// ── Cost estimation ───────────────────────────────────────────────────────────

const MEAL_DEFAULT_COST: Record<string, number> = {
  breakfast: 10, brunch: 22, lunch: 18, dinner: 38,
};
const ACTIVITY_TAG_COST: [string, number][] = [
  ["#beach",   4], ["#outdoor", 5], ["#hiking", 5],
  ["#museum", 15], ["#sports", 20], ["#arts",   40], ["#indoor", 25],
];

function estimateCostPerPax(deal: Deal | FallbackItem, type: "meal" | "activity", mealType?: string): number {
  const text = "text" in deal ? deal.text : deal.excerpt;
  if (isFreeActivity(text)) return 0;
  const price = extractFirstPrice(text);
  if (price !== null) return price;
  if (type === "meal" && mealType) return MEAL_DEFAULT_COST[mealType] ?? 15;
  const tags = deal.tags.map(t => t.toLowerCase());
  for (const [tag, cost] of ACTIVITY_TAG_COST) {
    if (tags.includes(tag)) return cost;
  }
  if ("estimatedCostPerPax" in deal) return deal.estimatedCostPerPax;
  return 20;
}

// ── Time-slot generator ───────────────────────────────────────────────────────

interface SlotDef { h: number; type: "meal" | "activity"; mealType?: string; }

const MEAL_NATURAL_H: Record<string, number>  = { breakfast: 8.5, brunch: 10.5, lunch: 12.0, dinner: 18.5 };
const MEAL_DUR: Record<string, number>         = { breakfast: 1.0, brunch:  1.5, lunch:  1.0, dinner:  1.5 };

function generateSlots(startH: number, durationH: number, meals: string[]): SlotDef[] {
  const endH = startH + durationH;
  const slots: SlotDef[] = [];
  let cursor = startH;

  // Build chronological meal schedule with minimum 2-h gap between meals
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

  // Interleave activities in the gaps
  for (const ms of scheduled) {
    while (cursor + 1.5 <= ms.h - 0.25) {
      slots.push({ h: cursor, type: "activity" });
      cursor += 1.75;
    }
    slots.push({ h: ms.h, type: "meal", mealType: ms.mealType });
    cursor = ms.h + ms.dur + 0.25;
  }

  // Fill remaining time
  while (cursor + 1.5 <= endH) {
    slots.push({ h: cursor, type: "activity" });
    cursor += 1.75;
  }

  return slots;
}

// ── Core builder ──────────────────────────────────────────────────────────────

function buildItinerary(req: PlanRequest, foodDeals: Deal[], weekendDeals: Deal[]): PlanResponse {
  const { adults, kidAges, startTime, durationHours, meals, activities } = req;
  const pax          = adults + kidAges.length;
  const hasKids      = kidAges.length > 0;
  const hasYoungKids = kidAges.some(a => ["0-2", "3-6"].includes(a));
  const startH       = toDecimalH(startTime);
  const slots        = generateSlots(startH, durationHours, meals);

  const usedFood  = new Set<number>();
  const usedAct   = new Set<number>();
  const usedFb    = new Set<string>();
  const itinerary: ItinerarySlot[] = [];

  for (const slot of slots) {
    if (slot.type === "meal") {
      const mealType = slot.mealType!;
      const best = foodDeals
        .filter(d => !usedFood.has(d.id))
        .map(d => ({ d, score: scoreFood(d, mealType) }))
        .sort((a, b) => b.score - a.score)[0];

      if (best && best.score >= 0) {
        const { d } = best;
        usedFood.add(d.id);
        const cpp = estimateCostPerPax(d, "meal", mealType);
        itinerary.push({
          time: formatTime(slot.h),
          type: "meal",
          mealType,
          title:                d.excerpt.slice(0, 80),
          excerpt:              d.excerpt,
          estimatedCostPerPax:  cpp,
          totalCost:            cpp * pax,
          imageUrl:             d.imageUrl,
          moreInfoUrl:          d.moreInfoUrl,
          telegramUrl:          d.telegramUrl,
          tags:                 d.tags,
          isRealDeal:           true,
          dealBadge:            extractDealBadge(d.text),
        });
      } else {
        const fb  = FALLBACK_MEALS[mealType] ?? FALLBACK_MEALS.lunch;
        const cpp = fb.estimatedCostPerPax;
        itinerary.push({
          time: formatTime(slot.h),
          type: "meal",
          mealType,
          title: fb.title, excerpt: fb.excerpt,
          estimatedCostPerPax: cpp, totalCost: cpp * pax,
          moreInfoUrl: fb.moreInfoUrl,
          tags: fb.tags, isRealDeal: false,
        });
      }
    } else {
      // Activity slot — real deal first
      const best = weekendDeals
        .filter(d => !usedAct.has(d.id))
        .map(d => ({ d, score: scoreActivity(d, activities, hasKids, hasYoungKids) }))
        .sort((a, b) => b.score - a.score)[0];

      if (best && best.score > 0) {
        const { d } = best;
        usedAct.add(d.id);
        const cpp = estimateCostPerPax(d, "activity");
        itinerary.push({
          time: formatTime(slot.h),
          type: "activity",
          title:                d.excerpt.slice(0, 80),
          excerpt:              d.excerpt,
          estimatedCostPerPax:  cpp,
          totalCost:            cpp * pax,
          imageUrl:             d.imageUrl,
          moreInfoUrl:          d.moreInfoUrl,
          telegramUrl:          d.telegramUrl,
          tags:                 d.tags,
          isRealDeal:           true,
          dealBadge:            extractDealBadge(d.text),
        });
      } else {
        // Score fallbacks by requested activities + kids preference
        let candidates = FALLBACK_ACTIVITIES.filter(fb => !usedFb.has(fb.title));
        if (hasKids) {
          const family = candidates.filter(fb => fb.tags.includes("#family") || fb.tags.includes("#kids"));
          if (family.length > 0) candidates = family;
        }
        const scored = candidates
          .map(fb => ({
            fb,
            score: activities.length === 0 ? 5 :
              activities.reduce((s, act) => {
                const kws = ACTIVITY_KEYWORDS[act] ?? [];
                return s + (
                  fb.keywords.some(k => kws.includes(k)) ||
                  fb.tags.some(t => t.includes(act))
                    ? 10 : 0
                );
              }, 0),
          }))
          .sort((a, b) => b.score - a.score);

        if (scored.length > 0) {
          const { fb } = scored[0];
          usedFb.add(fb.title);
          itinerary.push({
            time: formatTime(slot.h),
            type: "activity",
            title: fb.title, excerpt: fb.excerpt,
            estimatedCostPerPax: fb.estimatedCostPerPax,
            totalCost: fb.estimatedCostPerPax * pax,
            moreInfoUrl: fb.moreInfoUrl,
            tags: fb.tags, isRealDeal: false,
          });
        }
      }
    }
  }

  const totalCostMin = itinerary.reduce((s, i) => s + i.estimatedCostPerPax, 0) * pax;
  const totalCostMax = Math.round(totalCostMin * 1.3);

  return { itinerary, totalCostMin, totalCostMax, pax, generatedAt: new Date().toISOString() };
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

    const foodDeals:    Deal[] = dealsRes.ok   ? ((await dealsRes.json()).deals   ?? []) : [];
    const weekendDeals: Deal[] = weekendRes.ok  ? ((await weekendRes.json()).deals ?? []) : [];

    return NextResponse.json(buildItinerary(body, foodDeals, weekendDeals));
  } catch (err) {
    console.error("[/api/plan]", err);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}
