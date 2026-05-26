import { NextResponse } from "next/server";
import { FLEXAR_STATIONS, SG_AREAS } from "@/lib/quote";

export const revalidate = 3600; // 1 hour cache

export async function GET() {
  const townIds = [...new Set(FLEXAR_STATIONS.map(s => s.area))];

  const towns = townIds.map(townId => {
    const area = SG_AREAS.find(a => a.id === townId);
    const stations = FLEXAR_STATIONS.filter(s => s.area === townId).map(s => ({
      id: s.id,
      name: s.name,
      lat: s.lat,
      lng: s.lng,
    }));
    return {
      id: townId,
      name: area?.name ?? townId,
      region: area?.region ?? "",
      stationCount: stations.length,
      stations,
    };
  });

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    towns,
  });
}
