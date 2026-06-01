import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Called daily at 11:59 PM SGT (15:59 UTC) by Vercel cron.
// Vercel automatically adds: Authorization: Bearer {CRON_SECRET}
export async function GET() {
  revalidateTag("deals");

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
    message: "Deals cache cleared — next request will fetch fresh data from @sgfooddeals",
  });
}
