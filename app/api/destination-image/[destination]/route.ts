import { NextResponse } from "next/server";

// Resolves a topic (destination, product, food, store category…) to a Wikipedia /
// Wikimedia Commons photo and redirects the browser to it.
//
// Why a redirect (not a byte proxy): Wikimedia only serves a fixed set of thumbnail
// widths and throttles server-side bulk fetches. Redirecting to a standard-width
// thumbnail lets the browser load it directly, and Vercel's CDN caches the redirect.

const UA = "SGliving/1.0 (https://sgliving.life; contact@sgliving.life)";

// Wikimedia's standard thumbnail steps — other widths are rejected.
const WIDTHS = [250, 330, 500, 960, 1280];

// Slugs that Wikipedia finds better under a specific title
const ALIASES: Record<string, string> = {
  // Destinations
  "kl":               "Kuala Lumpur",
  "ho-chi-minh":      "Ho Chi Minh City",
  "new-york":         "New York City",
  "los-angeles":      "Los Angeles",
  "san-francisco":    "San Francisco",
  "da-nang":          "Da Nang",
  "siem-reap":        "Siem Reap",
  "koh-samui":        "Ko Samui",
  "chiang-mai":       "Chiang Mai",
  "abu-dhabi":        "Abu Dhabi",
  "gold-coast":       "Gold Coast, Queensland",
  "changi-airport":   "Singapore Changi Airport",
  "airliner":         "Airliner",
  // Airlines (their articles lead with an aircraft photo)
  "scoot":            "Scoot (airline)",
  "singapore-airlines": "Singapore Airlines",
  "jetstar":          "Jetstar Asia",
  "airasia":          "AirAsia",
  "qantas":           "Qantas",
  "cathay-pacific":   "Cathay Pacific",
  "malaysia-airlines": "Malaysia Airlines",
  "thai-airways":     "Thai Airways",
  "emirates":         "Emirates (airline)",
  "qatar-airways":    "Qatar Airways",
  "batik-air":        "Batik Air Malaysia",
  "vietnam-airlines": "Vietnam Airlines",
  "cebu-pacific":     "Cebu Pacific",
  "korean-air":       "Korean Air",
  "japan-airlines":   "Japan Airlines",
  "ana":              "All Nippon Airways",
  "british-airways":  "British Airways",
  // Food categories
  "burger":           "Hamburger",
  "fried-chicken":    "Fried chicken",
  "bubbletea":        "Bubble tea",
  "hawker-centre":    "Hawker centre",
  "japanese-cuisine": "Japanese cuisine",
  "korean-cuisine":   "Korean cuisine",
  "chinese-cuisine":  "Chinese cuisine",
  "indian-cuisine":   "Indian cuisine",
  "thai-cuisine":     "Thai cuisine",
  "malay-cuisine":    "Malay cuisine",
  "western-food":     "Western cuisine",
  "dim-sum":          "Dim sum",
  "barbeque":         "Barbecue",
  "food":             "Singaporean cuisine",
  // Supermarket
  "supermarket":      "Supermarket",
  "grocery-store":    "Supermarket",
  "instant-noodles":  "Instant noodle",
  "frozen-food":      "Frozen food",
  "egg":              "Egg as food",
  "personal-care":    "Toiletry",
  "household":        "Cleaning agent",
  "snacks":           "Snack food",
  // Electronics
  "consumer-electronics": "Consumer electronics",
  "iphone":           "iPhone",
  "samsung-galaxy":   "Samsung Galaxy",
  "smartphone":       "Smartphone",
  "television":       "Television set",
  "headphones":       "Headphones",
  "loudspeaker":      "Loudspeaker",
  "laptop":           "Laptop",
  "macbook":          "MacBook",
  "ipad":             "iPad",
  "tablet":           "Tablet computer",
  "camera":           "Digital camera",
  "playstation-5":    "PlayStation 5",
  "nintendo-switch":  "Nintendo Switch",
  "game-console":     "Video game console",
  "vacuum-cleaner":   "Vacuum cleaner",
  "air-conditioner":  "Air conditioning",
  "refrigerator":     "Refrigerator",
  "washing-machine":  "Washing machine",
  "smartwatch":       "Smartwatch",
  "computer-monitor": "Computer monitor",
  // Weekend activity categories
  "art-gallery":      "Art museum",
  "nature-walk":      "Nature trail",
  "water-sports":     "Water sport",
  "kids-activities":  "Playground",
};

interface Summary {
  type?: string;
  thumbnail?: { source: string; width: number };
  originalimage?: { source: string; width: number };
}

async function summary(title: string): Promise<Summary | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}?redirect=true`,
      { headers: { "User-Agent": UA }, next: { revalidate: 604800 }, signal: AbortSignal.timeout(6000) },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Summary;
    return data.type === "disambiguation" ? null : data;
  } catch {
    return null;
  }
}

async function search(query: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=1&format=json&srsearch=${encodeURIComponent(query)}`,
      { headers: { "User-Agent": UA }, next: { revalidate: 604800 }, signal: AbortSignal.timeout(6000) },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { query?: { search?: { title: string }[] } };
    return data.query?.search?.[0]?.title ?? null;
  } catch {
    return null;
  }
}

function imageAt(s: Summary, want: number): string | null {
  const thumb = s.thumbnail?.source;
  const orig = s.originalimage;
  if (!thumb) return orig?.source ?? null;
  const width = WIDTHS.find(w => w >= want) ?? 960;
  if (orig && orig.width <= width) return orig.source;          // original is small enough
  return /\/\d+px-/.test(thumb) ? thumb.replace(/\/\d+px-/, `/${width}px-`) : thumb;
}

export async function GET(req: Request, { params }: { params: Promise<{ destination: string }> }) {
  const { destination } = await params;
  const key = decodeURIComponent(destination).toLowerCase();
  const term = ALIASES[key] ?? key.replace(/-/g, " ");
  const want = Number(new URL(req.url).searchParams.get("w")) || 500;

  let s = await summary(term);
  if (!s?.thumbnail) {
    const found = await search(term);
    if (found) s = await summary(found);
  }
  const url = s ? imageAt(s, want) : null;

  if (!url) {
    return new NextResponse(null, { status: 404, headers: { "Cache-Control": "public, s-maxage=86400" } });
  }
  return NextResponse.redirect(url, {
    status: 307,
    headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
  });
}
