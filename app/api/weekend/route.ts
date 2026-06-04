import { NextResponse } from "next/server";
import type { Deal } from "@/lib/types";

const CHANNEL    = "sgweekend";
const MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 days (2 months)
const MAX_PAGES  = 15; // safety cap — ~300–450 posts max

// ── HTML helpers ──────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/&nbsp;/g, " ")
    .trim();
}

function extractTags(text: string): string[] {
  return (text.match(/#[\w]+/gi) ?? []).map(t => t.toLowerCase());
}

function buildExcerpt(text: string): string {
  return text
    .replace(/#[\w]+/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim()
    .slice(0, 240);
}

function extractExternalUrls(html: string): string[] {
  return [...html.matchAll(/href="(https?:\/\/[^"]+)"/gi)]
    .map(m => m[1])
    .filter(url =>
      !url.includes("t.me/") &&
      !url.includes("telegram.me/") &&
      !url.startsWith("tg://")
    );
}

// Try every place Telegram embeds images, best quality first.
// Returns a proxy URL (/api/telegram-image?url=...) so the browser
// never touches Telegram CDN directly — avoids CORS/referrer failures.
function extractTelegramImage(chunk: string): string | undefined {
  let raw: string | undefined;

  // 1. data-zoom-src — full-size original photo
  const zoom = chunk.match(/data-zoom-src="([^"]+)"/);
  if (zoom) raw = zoom[1];

  // 2. src on photo inner image element
  if (!raw) {
    const inner = chunk.match(/tgme_widget_message_photo_inner_image[^>]*src="([^"]+)"/);
    if (inner) raw = inner[1];
  }

  // 3. CSS background-image thumbnail — decode HTML entities, accept any quoting style
  if (!raw) {
    const decoded = chunk.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    const bg = decoded.match(/background-image:\s*url\(\s*['"]?((?:https?:)?\/\/[^'")\s]+)['"]?\s*\)/);
    if (bg) raw = bg[1];
  }

  // 4. Any Telegram CDN URL in the chunk as last resort (all known CDN domains)
  if (!raw) {
    const cdn = chunk.match(/(?:https?:)?\/\/cdn[^"'\s>)]*\.(?:telegram-cdn\.org|cdn-telegram\.org|telesco\.pe)\/[^"'\s>)]+/);
    if (cdn) raw = cdn[0];
  }

  if (!raw) return undefined;

  const absolute = raw.startsWith("//") ? `https:${raw}` : raw;
  return `/api/telegram-image?url=${encodeURIComponent(absolute)}`;
}

// ── Per-post OG image fetch ───────────────────────────────────────────────────
const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

async function fetchPostOgImage(messageId: number): Promise<string | undefined> {
  try {
    const res = await fetch(`https://t.me/${CHANNEL}/${messageId}`, {
      headers: {
        "User-Agent":      BROWSER_UA,
        "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return undefined;
    const html = await res.text();
    const m = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
           ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
    if (!m) return undefined;
    const raw = m[1].replace(/&amp;/g, "&");
    const absolute = raw.startsWith("//") ? `https:${raw}` : raw;
    return `/api/telegram-image?url=${encodeURIComponent(absolute)}`;
  } catch {
    return undefined;
  }
}

// ── Paginated scrape of t.me/s/{channel} ─────────────────────────────────────
// Fetches page 1 then walks backwards via ?before={messageId} until either
// the 60-day cutoff is reached or MAX_PAGES pages have been fetched.

async function fetchFromPublicChannel(): Promise<Deal[]> {
  const allDeals: Deal[] = [];
  const seen    = new Set<number>();
  const cutoff  = Date.now() - MAX_AGE_MS;
  let   url: string | null = `https://t.me/s/${CHANNEL}`;
  let   page = 0;

  while (url && page < MAX_PAGES) {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SGliving/1.0; +https://sgliving.life)",
      },
      // Tag only the first fetch — revalidateTag("weekend") clears the whole route
      ...(page === 0 ? { next: { tags: ["weekend"], revalidate: 86400 } } : {}),
    });

    if (!res.ok) break;

    const html   = await res.text();
    const chunks = html.split(/(?=<[^>]*?data-post="sgweekend\/\d+")/);

    let oldestId: number | null = null;
    let reachedCutoff = false;

    for (const chunk of chunks) {
      const idMatch = chunk.match(/data-post="sgweekend\/(\d+)"/);
      if (!idMatch) continue;
      const messageId = parseInt(idMatch[1]);

      if (seen.has(messageId)) continue;
      seen.add(messageId);

      // Track oldest message on this page to build next ?before= URL
      if (oldestId === null || messageId < oldestId) oldestId = messageId;

      // Parse date early so we can skip posts older than 2 months
      const dateMatch = chunk.match(/datetime="([^"]+)"/);
      const date      = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();

      if (new Date(date).getTime() < cutoff) { reachedCutoff = true; continue; }

      const textBlockMatch = chunk.match(
        /class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/
      );
      if (!textBlockMatch) continue;

      const blockHtml = textBlockMatch[1];
      const rawText   = stripHtml(blockHtml);

      // Hard filter 1: must contain #article or #uniqueevent
      const lowerText = rawText.toLowerCase();
      if (!lowerText.includes("#article") && !lowerText.includes("#uniqueevent")) continue;

      // Hard filter 2: must have at least one external "more info" URL
      const externalUrls = extractExternalUrls(blockHtml);
      if (externalUrls.length === 0) continue;

      allDeals.push({
        id:          messageId,
        text:        rawText,
        excerpt:     buildExcerpt(rawText),
        date,
        tags:        extractTags(rawText),
        telegramUrl: `https://t.me/${CHANNEL}/${messageId}`,
        moreInfoUrl: externalUrls[0],
        imageUrl:    extractTelegramImage(chunk),
      });
    }

    // Stop once we've passed the 2-month window or there are no more posts
    if (reachedCutoff || oldestId === null) break;

    url = `https://t.me/s/${CHANNEL}?before=${oldestId}`;
    page++;
  }

  // For every deal still missing an image, fetch its post page in parallel to
  // get the og:image — runs once per day since the route is cached 24 h.
  const needsImage = allDeals.filter(d => !d.imageUrl);
  if (needsImage.length > 0) {
    const images = await Promise.all(needsImage.map(d => fetchPostOgImage(d.id)));
    needsImage.forEach((d, i) => { if (images[i]) d.imageUrl = images[i]; });
  }

  // Newest listings always on top
  return allDeals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Mock data (shown only when scraping fails) ────────────────────────────────

const MOCK_DEALS: Deal[] = [
  {
    id: 1,
    text: "🌿 Free guided nature walk at MacRitchie Reservoir this Saturday 8am. Family-friendly, all ages welcome! #deals #outdoor #hiking #family",
    excerpt: "Free guided nature walk at MacRitchie Reservoir this Saturday 8am. Family-friendly, all ages welcome!",
    date: new Date(Date.now() - 2 * 3600_000).toISOString(),
    tags: ["#deals", "#outdoor", "#hiking", "#family"],
    telegramUrl: `https://t.me/${CHANNEL}/1`,
    moreInfoUrl: "https://www.nparks.gov.sg/",
  },
  {
    id: 2,
    text: "🎨 Art Jamming at Gardens by the Bay — $15/pax this weekend only. Includes materials + 1 drink. #deals #arts #indoor #weekend",
    excerpt: "Art Jamming at Gardens by the Bay — $15/pax this weekend only. Includes materials + 1 drink.",
    date: new Date(Date.now() - 6 * 3600_000).toISOString(),
    tags: ["#deals", "#arts", "#indoor", "#weekend"],
    telegramUrl: `https://t.me/${CHANNEL}/2`,
    moreInfoUrl: "https://www.gardensbythebay.com.sg/",
  },
  {
    id: 3,
    text: "🏊 Free swimming trial at Singapore Sports Hub pool. Kids under 12 go free with paying adult. Sat & Sun only. #deals #sports #family #kids",
    excerpt: "Free swimming trial at Singapore Sports Hub pool. Kids under 12 go free with paying adult. Sat & Sun only.",
    date: new Date(Date.now() - 10 * 3600_000).toISOString(),
    tags: ["#deals", "#sports", "#family", "#kids"],
    telegramUrl: `https://t.me/${CHANNEL}/3`,
    moreInfoUrl: "https://www.sportshub.com.sg/",
  },
  {
    id: 4,
    text: "🎭 Sistic — 20% off selected shows this weekend. Use code WEEKEND20 at checkout. Valid Sat–Sun only. #deals #events #arts #promo",
    excerpt: "Sistic — 20% off selected shows this weekend. Use code WEEKEND20 at checkout. Valid Sat–Sun only.",
    date: new Date(Date.now() - 18 * 3600_000).toISOString(),
    tags: ["#deals", "#events", "#arts", "#promo"],
    telegramUrl: `https://t.me/${CHANNEL}/4`,
    moreInfoUrl: "https://www.sistic.com.sg/",
  },
  {
    id: 5,
    text: "🏖️ Sentosa Beach Club — free entry this Sunday before 10am. Bring your own mat. Parking $5 flat. #deals #beach #outdoor #free",
    excerpt: "Sentosa Beach Club — free entry this Sunday before 10am. Bring your own mat. Parking $5 flat.",
    date: new Date(Date.now() - 24 * 3600_000).toISOString(),
    tags: ["#deals", "#beach", "#outdoor", "#free"],
    telegramUrl: `https://t.me/${CHANNEL}/5`,
    moreInfoUrl: "https://www.sentosa.com.sg/",
  },
  {
    id: 6,
    text: "🏛️ National Museum of Singapore — free admission every Friday 6–9pm and all weekend for kids under 6. #deals #museum #family #free",
    excerpt: "National Museum of Singapore — free admission every Friday 6–9pm and all weekend for kids under 6.",
    date: new Date(Date.now() - 30 * 3600_000).toISOString(),
    tags: ["#deals", "#museum", "#family", "#free"],
    telegramUrl: `https://t.me/${CHANNEL}/6`,
    moreInfoUrl: "https://www.nationalmuseum.sg/",
  },
];

// ── Route handler ─────────────────────────────────────────────────────────────

export const revalidate = 86400; // refreshed nightly by /api/weekend/refresh cron

export async function GET() {
  try {
    const deals = await fetchFromPublicChannel();
    if (deals.length > 0) {
      return NextResponse.json({ deals, updatedAt: new Date().toISOString(), source: "telegram" });
    }
    return NextResponse.json({ deals: MOCK_DEALS, updatedAt: new Date().toISOString(), source: "mock" });
  } catch (err) {
    console.error("[/api/weekend] error:", err);
    return NextResponse.json({ deals: MOCK_DEALS, updatedAt: new Date().toISOString(), source: "mock" });
  }
}
