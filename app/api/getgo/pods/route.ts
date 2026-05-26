import { NextResponse } from "next/server";
import { GETGO_PODS } from "@/lib/quote";

export const revalidate = 3600; // 1 hour cache

export async function GET() {
  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    pods: GETGO_PODS,
  });
}
