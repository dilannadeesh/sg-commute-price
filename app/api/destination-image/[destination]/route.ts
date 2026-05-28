import { NextResponse } from "next/server";

// Aliases for destinations that Wikipedia searches better with a full name
const ALIASES: Record<string, string> = {
  "kl":            "Kuala Lumpur",
  "ho-chi-minh":   "Ho Chi Minh City",
  "new-york":      "New York City",
  "los-angeles":   "Los Angeles",
  "san-francisco": "San Francisco",
  "da-nang":       "Da Nang",
  "siem-reap":     "Siem Reap",
  "koh-samui":     "Ko Samui",
  "chiang-mai":    "Chiang Mai",
  "abu-dhabi":     "Abu Dhabi",
  "gold-coast":    "Gold Coast, Queensland",
};

// Cache proxy responses for 7 days at the edge
export const revalidate = 604800;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ destination: string }> }
) {
  const { destination } = await params;
  const key = destination.toLowerCase();
  const searchTerm = ALIASES[key] ?? key.replace(/-/g, " ");

  try {
    // 1. Ask Wikipedia for the page summary (includes thumbnail URL)
    const summaryRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`,
      {
        headers: { "User-Agent": "SGliving/1.0 (https://sgliving.life; contact@sgliving.life)" },
        signal: AbortSignal.timeout(6000),
      }
    );
    if (!summaryRes.ok) return new NextResponse(null, { status: 404 });

    const data = await summaryRes.json() as { thumbnail?: { source: string } };
    const rawSrc = data.thumbnail?.source;
    if (!rawSrc) return new NextResponse(null, { status: 404 });

    // Boost to 800px for a crisp card image
    const imageUrl = rawSrc.replace(/\/\d+px-/, "/800px-");

    // 2. Fetch the actual image bytes and stream back through our server
    const imgRes = await fetch(imageUrl, {
      headers: { "User-Agent": "SGliving/1.0 (https://sgliving.life; contact@sgliving.life)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!imgRes.ok) return new NextResponse(null, { status: 404 });

    const body  = await imgRes.arrayBuffer();
    const ctype = imgRes.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(body, {
      headers: {
        "Content-Type": ctype,
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
