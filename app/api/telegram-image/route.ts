import { NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  ".telegram-cdn.org",
  ".cdn-telegram.org",
  ".telegram.org",
];

// Cache proxied Telegram images for 24 h at the edge
export const revalidate = 86400;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("url");
  if (!raw) return new NextResponse("Missing url param", { status: 400 });

  // Normalise protocol-relative URLs
  const absolute = raw.startsWith("//") ? `https:${raw}` : raw;

  // Allow only Telegram CDN domains — block open-proxy abuse
  let parsed: URL;
  try {
    parsed = new URL(absolute);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }
  const allowed = ALLOWED_HOSTS.some(h => parsed.hostname.endsWith(h));
  if (!allowed) return new NextResponse("Forbidden", { status: 403 });

  try {
    const imgRes = await fetch(parsed.toString(), {
      headers: {
        // Telegram CDN checks Referer for some assets
        "Referer":    "https://t.me/",
        "User-Agent": "Mozilla/5.0 (compatible; SGliving/1.0; +https://sgliving.life)",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!imgRes.ok) return new NextResponse(null, { status: 404 });

    const body  = await imgRes.arrayBuffer();
    const ctype = imgRes.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(body, {
      headers: {
        "Content-Type":  ctype,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
