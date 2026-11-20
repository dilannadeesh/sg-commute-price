import { NextResponse } from "next/server";
import { searchPlaces } from "@/lib/travel/onemap";

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 2) return NextResponse.json({ results: [] });
  try {
    const results = await searchPlaces(q);
    return NextResponse.json({ results }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return NextResponse.json({ results: [], error: "Search is temporarily unavailable." }, { status: 502 });
  }
}
