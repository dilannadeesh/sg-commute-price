import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Called nightly at 11:59 PM SGT (15:59 UTC) by Vercel cron.
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  revalidateTag("airline-deals");

  return NextResponse.json({
    revalidated: true,
    timestamp:   new Date().toISOString(),
    message:     "Airline deals cache cleared — next request fetches fresh data",
  });
}
