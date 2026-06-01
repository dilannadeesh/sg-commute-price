import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export async function GET() {
  const result: Record<string, unknown> = {};

  // 1. Can we reach t.me/s/sgfooddeals?
  try {
    const r = await fetch("https://t.me/s/sgfooddeals", {
      headers: { "User-Agent": BROWSER_UA },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const html = await r.text();
    const ids = [...html.matchAll(/data-post="sgfooddeals\/(\d+)"/g)].map(m => parseInt(m[1]));
    result.channelPage = { status: r.status, postIds: ids.slice(0, 5), totalFound: ids.length };

    // 2. Fetch OG image for the most recent post
    if (ids.length > 0) {
      const newest = Math.max(...ids);
      const postUrl = `https://t.me/sgfooddeals/${newest}`;
      try {
        const pr = await fetch(postUrl, {
          headers: { "User-Agent": BROWSER_UA, "Accept": "text/html,*/*" },
          signal: AbortSignal.timeout(8000),
          cache: "no-store",
        });
        const phtml = await pr.text();
        const ogMatch = phtml.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
                     ?? phtml.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
        const ogUrl = ogMatch ? ogMatch[1].replace(/&amp;/g, "&") : null;

        result.postPage = { postId: newest, status: pr.status, ogImageUrl: ogUrl };

        // 3. Try proxying that OG image
        if (ogUrl) {
          const absolute = ogUrl.startsWith("//") ? `https:${ogUrl}` : ogUrl;
          let proxyAllowed = false;
          try {
            const parsed = new URL(absolute);
            const ALLOWED = [".telegram-cdn.org", ".cdn-telegram.org", ".telegram.org", ".telegramcdn.net", ".t.me"];
            proxyAllowed = ALLOWED.some(h => parsed.hostname.endsWith(h));
            result.proxyCheck = { url: absolute, hostname: parsed.hostname, allowed: proxyAllowed };
          } catch {
            result.proxyCheck = { error: "invalid URL", url: absolute };
          }

          if (proxyAllowed) {
            try {
              const ir = await fetch(absolute, {
                headers: { "Referer": "https://t.me/", "User-Agent": BROWSER_UA },
                signal: AbortSignal.timeout(8000),
              });
              result.imageFetch = { status: ir.status, contentType: ir.headers.get("content-type") };
            } catch (e) {
              result.imageFetch = { error: String(e) };
            }
          }
        }
      } catch (e) {
        result.postPage = { error: String(e) };
      }
    }
  } catch (e) {
    result.channelPage = { error: String(e) };
  }

  return NextResponse.json(result, { headers: { "Content-Type": "application/json" } });
}
