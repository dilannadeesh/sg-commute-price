import { NextResponse } from "next/server";
import type { AirlineDeal } from "@/lib/types";

// Configurable via AIRLINE_CHANNEL env var — defaults to a known SG airline deals channel
const CHANNEL    = process.env.AIRLINE_CHANNEL ?? "sgairlinedeals";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ── Known airlines operating from Singapore ──────────────────────────────────
const AIRLINES = [
  "Singapore Airlines", "SIA", "Scoot", "Jetstar", "AirAsia",
  "Batik Air", "Malindo", "Vietnam Airlines", "Thai Airways",
  "Cathay Pacific", "Emirates", "Qatar Airways", "Malaysia Airlines",
  "Cebu Pacific", "Philippine Airlines", "Garuda", "Lion Air",
  "Korean Air", "Japan Airlines", "JAL", "ANA", "Qantas",
  "British Airways", "Lufthansa", "KLM", "Air France",
];

// Common destinations from Singapore
const DESTINATIONS = [
  "Bangkok", "Bali", "Tokyo", "Osaka", "Seoul", "Kuala Lumpur", "KL",
  "Hong Kong", "Taipei", "Manila", "Jakarta", "Ho Chi Minh", "Hanoi",
  "Phuket", "Krabi", "Langkawi", "Penang", "Colombo", "Maldives",
  "Sydney", "Melbourne", "Brisbane", "Perth", "Auckland", "London",
  "Paris", "Amsterdam", "Dubai", "Doha", "Abu Dhabi", "Zurich",
  "Istanbul", "Athens", "Rome", "Barcelona", "Madrid", "New York",
  "Los Angeles", "San Francisco", "Vancouver", "Toronto",
  "Kathmandu", "Colombo", "Mumbai", "Delhi", "Chennai",
  "Chiang Mai", "Koh Samui", "Da Nang", "Siem Reap", "Yangon",
  "Darwin", "Cairns", "Gold Coast", "Christchurch",
];

// ── Extractors ────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/&nbsp;/g, " ")
    .trim();
}

function buildExcerpt(text: string): string {
  return text
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim()
    .slice(0, 260);
}

function extractExternalUrls(html: string): string[] {
  return [...html.matchAll(/href="(https?:\/\/[^"]+)"/gi)]
    .map(m => m[1])
    .filter(u => !u.includes("t.me/") && !u.includes("telegram.me/") && !u.startsWith("tg://"));
}

function extractPrice(text: string): string | undefined {
  // Match S$xxx, SGD xxx, $xxx patterns
  const m = text.match(/(?:S\$|SGD\s?|from\s+\$?|from\s+S\$)(\d[\d,]*(?:\.\d{2})?)/i)
         ?? text.match(/\$(\d[\d,]*(?:\.\d{2})?)/);
  return m ? `S$${m[1].replace(/,/g, "")}` : undefined;
}

function extractDestination(text: string): string | undefined {
  const upper = text.toUpperCase();
  // Arrow patterns: Singapore → XXX or SIN-XXX
  const arrow = text.match(/(?:Singapore|SIN)\s*[→\->–—]+\s*([A-Za-z\s]+?)(?:\n|,|\.|!|\$|from|return|one)/i);
  if (arrow) return arrow[1].trim();

  for (const dest of DESTINATIONS) {
    if (upper.includes(dest.toUpperCase())) return dest;
  }
  return undefined;
}

function extractAirline(text: string): string | undefined {
  const upper = text.toUpperCase();
  for (const airline of AIRLINES) {
    if (upper.includes(airline.toUpperCase())) return airline;
  }
  return undefined;
}

function isSingaporeDeal(text: string): boolean {
  const upper = text.toUpperCase();
  return (
    upper.includes("SINGAPORE") ||
    upper.includes(" SIN ") ||
    upper.includes("(SIN)") ||
    upper.includes("FROM SIN") ||
    upper.includes("SIN-") ||
    upper.includes("CHANGI")
  );
}

// ── Scrape t.me/s/{channel} ───────────────────────────────────────────────────

async function fetchFromPublicChannel(): Promise<AirlineDeal[]> {
  const res = await fetch(`https://t.me/s/${CHANNEL}`, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SGliving/1.0; +https://sgliving.life)" },
    next: { tags: ["airline-deals"], revalidate: 86400 },
  });

  if (!res.ok) return [];

  const html  = await res.text();
  const deals: AirlineDeal[] = [];
  const chunks = html.split(new RegExp(`(?=<[^>]*?data-post="${CHANNEL}\\/\\d+")`));

  for (const chunk of chunks) {
    const idMatch = chunk.match(new RegExp(`data-post="${CHANNEL}\\/(\\d+)"`));
    if (!idMatch) continue;
    const messageId = parseInt(idMatch[1]);

    const textBlockMatch = chunk.match(/class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    if (!textBlockMatch) continue;

    const blockHtml = textBlockMatch[1];
    const rawText   = stripHtml(blockHtml);

    // ── Hard filter 1: must be a Singapore departure deal ────────────────────
    if (!isSingaporeDeal(rawText)) continue;

    // ── Hard filter 2: must have an external more-info URL ───────────────────
    const externalUrls = extractExternalUrls(blockHtml);
    if (externalUrls.length === 0) continue;

    // ── Hard filter 3: must be within 30 days ────────────────────────────────
    const dateMatch = chunk.match(/datetime="([^"]+)"/);
    const date = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();
    if (Date.now() - new Date(date).getTime() > MAX_AGE_MS) continue;

    const photoMatch = chunk.match(/background-image:url\('([^']+)'\)/);

    deals.push({
      id:          messageId,
      text:        rawText,
      excerpt:     buildExcerpt(rawText),
      date,
      destination: extractDestination(rawText),
      airline:     extractAirline(rawText),
      price:       extractPrice(rawText),
      telegramUrl: `https://t.me/${CHANNEL}/${messageId}`,
      moreInfoUrl: externalUrls[0],
      imageUrl:    photoMatch?.[1],
    });
  }

  return deals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_DEALS: AirlineDeal[] = [
  {
    id: 1,
    text: "✈️ Scoot — Singapore → Tokyo (NRT) from S$299 return! Book by 15 Jun, travel Aug–Nov 2025. Limited seats.",
    excerpt: "Scoot — Singapore → Tokyo (NRT) from S$299 return! Book by 15 Jun, travel Aug–Nov 2025. Limited seats.",
    date: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    destination: "Tokyo",
    airline: "Scoot",
    price: "S$299",
    telegramUrl: `https://t.me/${CHANNEL}/1`,
    moreInfoUrl: "https://www.flyscoot.com/en/",
  },
  {
    id: 2,
    text: "🌴 AirAsia — Singapore → Bali (DPS) from S$89 one-way. Travel Jan–Mar 2026. Book now before seats run out!",
    excerpt: "AirAsia — Singapore → Bali (DPS) from S$89 one-way. Travel Jan–Mar 2026. Book now before seats run out!",
    date: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    destination: "Bali",
    airline: "AirAsia",
    price: "S$89",
    telegramUrl: `https://t.me/${CHANNEL}/2`,
    moreInfoUrl: "https://www.airasia.com/",
  },
  {
    id: 3,
    text: "🇹🇭 Jetstar — Singapore → Bangkok (BKK) return from S$159. Includes 7kg hand baggage. Book by 20 Jun 2025.",
    excerpt: "Jetstar — Singapore → Bangkok (BKK) return from S$159. Includes 7kg hand baggage. Book by 20 Jun 2025.",
    date: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    destination: "Bangkok",
    airline: "Jetstar",
    price: "S$159",
    telegramUrl: `https://t.me/${CHANNEL}/3`,
    moreInfoUrl: "https://www.jetstar.com/sg/en/",
  },
  {
    id: 4,
    text: "🇰🇷 Singapore Airlines — Singapore → Seoul (ICN) return from S$549. KrisFlyer miles eligible. Travel Sep–Dec 2025.",
    excerpt: "Singapore Airlines — Singapore → Seoul (ICN) return from S$549. KrisFlyer miles eligible. Travel Sep–Dec 2025.",
    date: new Date(Date.now() - 7 * 86_400_000).toISOString(),
    destination: "Seoul",
    airline: "Singapore Airlines",
    price: "S$549",
    telegramUrl: `https://t.me/${CHANNEL}/4`,
    moreInfoUrl: "https://www.singaporeair.com/",
  },
  {
    id: 5,
    text: "🇦🇺 Qantas — Singapore → Sydney (SYD) return from S$799. Includes checked baggage + meals. Book by 30 Jun.",
    excerpt: "Qantas — Singapore → Sydney (SYD) return from S$799. Includes checked baggage + meals. Book by 30 Jun.",
    date: new Date(Date.now() - 10 * 86_400_000).toISOString(),
    destination: "Sydney",
    airline: "Qantas",
    price: "S$799",
    telegramUrl: `https://t.me/${CHANNEL}/5`,
    moreInfoUrl: "https://www.qantas.com/sg/",
  },
  {
    id: 6,
    text: "🇲🇾 Malaysia Airlines — Singapore → Kuala Lumpur return from S$59. Daily flights from Changi. No baggage included.",
    excerpt: "Malaysia Airlines — Singapore → Kuala Lumpur return from S$59. Daily flights from Changi. No baggage included.",
    date: new Date(Date.now() - 12 * 86_400_000).toISOString(),
    destination: "Kuala Lumpur",
    airline: "Malaysia Airlines",
    price: "S$59",
    telegramUrl: `https://t.me/${CHANNEL}/6`,
    moreInfoUrl: "https://www.malaysiaairlines.com/",
  },
];

// ── Handler ───────────────────────────────────────────────────────────────────

export const revalidate = 86400;

export async function GET() {
  try {
    const deals = await fetchFromPublicChannel();
    if (deals.length > 0) {
      return NextResponse.json({ deals, updatedAt: new Date().toISOString(), source: "telegram" });
    }
    return NextResponse.json({ deals: MOCK_DEALS, updatedAt: new Date().toISOString(), source: "mock" });
  } catch (err) {
    console.error("[/api/airline-deals] error:", err);
    return NextResponse.json({ deals: MOCK_DEALS, updatedAt: new Date().toISOString(), source: "mock" });
  }
}
