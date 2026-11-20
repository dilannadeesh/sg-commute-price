import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Weekly Vercel cron (see vercel.json). Clears the "automobile" cache tag so the next
// request re-pulls fresh data, then re-renders the list, detail pages and homepage.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  revalidateTag("automobile");
  revalidatePath("/automobile", "layout");
  revalidatePath("/coe", "layout");
  revalidatePath("/guides", "layout");
  revalidatePath("/");
  return NextResponse.json({ revalidated: true, section: "automobile", timestamp: new Date().toISOString() });
}
