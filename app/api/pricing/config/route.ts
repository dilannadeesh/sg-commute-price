import { NextResponse } from "next/server";
import { PLATFORMS, TIME_BLOCKS } from "@/lib/quote";

export const revalidate = 900; // 15 min cache

export async function GET() {
  const platforms: Record<string, object> = {};
  for (const p of PLATFORMS) {
    platforms[p.id] = {
      base:       p.base,
      perKm:      p.perKm,
      perMin:     p.perMin,
      surgeable:  p.surgeable,
      speedKmh:   p.speedKmh,
      etaMin:     p.etaMin,
    };
  }

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    platforms,
    timeBlocks: TIME_BLOCKS.map(t => ({
      id:         t.id,
      label:      t.label,
      surge:      t.surge,
      surgeLabel: t.surgeLabel,
    })),
  });
}
