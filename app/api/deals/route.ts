import { NextResponse } from "next/server";
import type { Deal } from "@/lib/types";

// ── Channel registry ──────────────────────────────────────────────────────────
// Each entry adds a Telegram public channel as a deal source.
// idOffset ensures Deal IDs never collide across channels.
// foodOnly=true: only keep posts that mention food/restaurants.

const CHANNELS = [
  { name: "sgfooddeals", idOffset: 0,             requireDealTag: true,  foodOnly: false },
  { name: "sgdeals",     idOffset: 1_000_000_000, requireDealTag: true,  foodOnly: true  },
] as const;

type ChannelCfg = typeof CHANNELS[number];

const MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 days
const MAX_PAGES  = 12;                          // per channel (~240–360 posts)

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// Used to identify food posts in broader deal channels
const FOOD_KEYWORDS = [
  "restaurant", "cafe", "café", "food", "dining", "eat", "drink",
  "burger", "pizza", "ramen", "sushi", "pasta", "steak", "bbq", "grill",
  "hawker", "kopitiam", "dim sum", "noodle", "rice", "chicken", "seafood",
  "dessert", "cake", "ice cream", "bubble tea", "boba",
  "#food", "#restaurant", "#cafe", "#dining", "#lunch", "#dinner",
  "#breakfast", "#brunch", "#dessert", "#drinks", "#coffee", "#tea",
  "#burger", "#pizza", "#ramen", "#sushi",
  "grab food", "foodpanda", "deliveroo",
];

// ── HTML helpers ──────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/&nbsp;/g, " ").trim();
}

function extractTags(text: string): string[] {
  return (text.match(/#[\w]+/gi) ?? []).map(t => t.toLowerCase());
}

function buildExcerpt(text: string): string {
  return text
    .replace(/#[\w]+/g, "").replace(/https?:\/\/\S+/g, "")
    .replace(/\n{2,}/g, "\n").trim().slice(0, 240);
}

function extractExternalUrls(html: string): string[] {
  return [...html.matchAll(/href="(https?:\/\/[^"]+)"/gi)]
    .map(m => m[1])
    .filter(u => !u.includes("t.me/") && !u.includes("telegram.me/") && !u.startsWith("tg://"));
}

function isFoodRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return FOOD_KEYWORDS.some(kw => lower.includes(kw));
}

function extractTelegramImage(chunk: string): string | undefined {
  let raw: string | undefined;

  const zoom = chunk.match(/data-zoom-src="([^"]+)"/);
  if (zoom) raw = zoom[1];

  if (!raw) {
    const inner = chunk.match(/tgme_widget_message_photo_inner_image[^>]*src="([^"]+)"/);
    if (inner) raw = inner[1];
  }

  if (!raw) {
    const decoded = chunk.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    const bg = decoded.match(/background-image:\s*url\(\s*['"]?((?:https?:)?\/\/[^'")\s]+)['"]?\s*\)/);
    if (bg) raw = bg[1];
  }

  if (!raw) {
    const cdn = chunk.match(/(?:https?:)?\/\/cdn[^"'\s>)]*\.(?:telegram-cdn\.org|cdn-telegram\.org|telesco\.pe)\/[^"'\s>)]+/);
    if (cdn) raw = cdn[0];
  }

  if (!raw) return undefined;
  const absolute = raw.startsWith("//") ? `https:${raw}` : raw;
  return `/api/telegram-image?url=${encodeURIComponent(absolute)}`;
}

async function fetchPostOgImage(channel: string, messageId: number): Promise<string | undefined> {
  try {
    const res = await fetch(`https://t.me/${channel}/${messageId}`, {
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

// ── Per-channel scraper ───────────────────────────────────────────────────────

async function scrapeChannel(
  cfg: ChannelCfg,
  seenUrls: Set<string>,  // cross-channel dedup: same moreInfoUrl = same deal
  tagCache: boolean,      // only the primary channel tags the Next.js ISR cache
): Promise<Deal[]> {
  const deals   = new Array<Deal>();
  const seenIds = new Set<number>(); // within-channel dedup by message ID
  const cutoff  = Date.now() - MAX_AGE_MS;
  const idRe    = new RegExp(`data-post="${cfg.name}\\/(\\d+)"`);
  const splitRe = new RegExp(`(?=<[^>]*?data-post="${cfg.name}\\/\\d+")`, "g");

  let url: string | null = `https://t.me/s/${cfg.name}`;
  let page = 0;

  while (url && page < MAX_PAGES) {
    let res: Response;
    try {
      res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SGliving/1.0; +https://sgliving.life)" },
        ...(tagCache && page === 0 ? { next: { tags: ["deals"], revalidate: 86400 } } : {}),
      });
    } catch {
      break;
    }
    if (!res.ok) break;

    const html   = await res.text();
    const chunks = html.split(splitRe);

    let oldestId: number | null = null;
    let reachedCutoff = false;

    for (const chunk of chunks) {
      const idMatch = chunk.match(idRe);
      if (!idMatch) continue;
      const messageId = parseInt(idMatch[1]);

      if (seenIds.has(messageId)) continue;
      seenIds.add(messageId);
      if (oldestId === null || messageId < oldestId) oldestId = messageId;

      const dateMatch = chunk.match(/datetime="([^"]+)"/);
      const date      = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();
      if (new Date(date).getTime() < cutoff) { reachedCutoff = true; continue; }

      const textBlockMatch = chunk.match(/class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      if (!textBlockMatch) continue;

      const blockHtml = textBlockMatch[1];
      const rawText   = stripHtml(blockHtml);

      if (cfg.requireDealTag && !rawText.toLowerCase().includes("#deals")) continue;
      if (cfg.foodOnly       && !isFoodRelated(rawText))                   continue;

      const externalUrls = extractExternalUrls(blockHtml);
      if (externalUrls.length === 0) continue;

      const moreInfoUrl = externalUrls[0];
      // Cross-channel deduplication: skip if this destination URL already found
      if (seenUrls.has(moreInfoUrl)) continue;
      seenUrls.add(moreInfoUrl);

      deals.push({
        id:          cfg.idOffset + messageId,
        text:        rawText,
        excerpt:     buildExcerpt(rawText),
        date,
        tags:        extractTags(rawText),
        telegramUrl: `https://t.me/${cfg.name}/${messageId}`,
        moreInfoUrl,
        imageUrl:    extractTelegramImage(chunk),
      });
    }

    if (reachedCutoff || oldestId === null) break;
    url = `https://t.me/s/${cfg.name}?before=${oldestId}`;
    page++;
  }

  // Fetch OG images in parallel for any deal still missing an image
  const needsImage = deals.filter(d => !d.imageUrl);
  if (needsImage.length > 0) {
    const images = await Promise.all(
      needsImage.map(d => fetchPostOgImage(cfg.name, d.id - cfg.idOffset))
    );
    needsImage.forEach((d, i) => { if (images[i]) d.imageUrl = images[i]; });
  }

  return deals;
}

// ── Multi-channel aggregator ──────────────────────────────────────────────────

async function fetchAllDeals(): Promise<Deal[]> {
  const seenUrls = new Set<string>();
  const allDeals: Deal[] = [];

  for (let i = 0; i < CHANNELS.length; i++) {
    try {
      const batch = await scrapeChannel(CHANNELS[i], seenUrls, i === 0);
      allDeals.push(...batch);
      console.log(`[deals] @${CHANNELS[i].name}: ${batch.length} deals`);
    } catch (err) {
      console.warn(`[deals] @${CHANNELS[i].name} failed:`, err);
    }
  }

  // Newest first across all channels
  return allDeals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Mock data (fallback when scraping fails) ──────────────────────────────────

const MOCK_DEALS: Deal[] = [
  {
    id: 1,
    text: "🍔 1-for-1 Burgers at Shake Shack Jewel today only! Valid 11am–3pm. No code needed — just show this post. #deals #burger #1for1",
    excerpt: "1-for-1 Burgers at Shake Shack Jewel today only! Valid 11am–3pm. No code needed — just show this post.",
    date: new Date(Date.now() - 2 * 3600_000).toISOString(),
    tags: ["#deals", "#burger", "#1for1"],
    telegramUrl: "https://t.me/sgfooddeals/1",
    moreInfoUrl: "https://www.shakeshack.com.sg/promotions",
  },
  {
    id: 2,
    text: "🍜 $5 ramen at Ippudo Singapore this weekend. Valid Sat & Sun, dine-in only. #deals #ramen #japanese",
    excerpt: "$5 ramen at Ippudo Singapore this weekend. Valid Sat & Sun, dine-in only.",
    date: new Date(Date.now() - 6 * 3600_000).toISOString(),
    tags: ["#deals", "#ramen", "#japanese"],
    telegramUrl: "https://t.me/sgfooddeals/2",
    moreInfoUrl: "https://www.ippudo.com.sg/promotions",
  },
  {
    id: 3,
    text: "🧋 Buy 2 get 1 FREE at LiHO Tea! Use promo code LIHO3FOR2 on their app. Valid until end of month. #deals #bubbletea #drinks",
    excerpt: "Buy 2 get 1 FREE at LiHO Tea! Use promo code LIHO3FOR2 on their app. Valid until end of month.",
    date: new Date(Date.now() - 10 * 3600_000).toISOString(),
    tags: ["#deals", "#bubbletea", "#drinks"],
    telegramUrl: "https://t.me/sgfooddeals/3",
    moreInfoUrl: "https://www.lihosg.com",
  },
  {
    id: 4,
    text: "🍕 Pizza Hut — 40% off all pizzas online. Use code: PIZZASG40. Min order $30. #deals #pizza #delivery",
    excerpt: "Pizza Hut — 40% off all pizzas online. Use code: PIZZASG40. Min order $30.",
    date: new Date(Date.now() - 18 * 3600_000).toISOString(),
    tags: ["#deals", "#pizza", "#delivery"],
    telegramUrl: "https://t.me/sgfooddeals/4",
    moreInfoUrl: "https://www.pizzahut.com.sg/deals",
  },
  {
    id: 5,
    text: "☕ Free coffee with any pastry at Starbucks! Redeem via the app. Mon–Fri 8–10am only. #deals #coffee #breakfast",
    excerpt: "Free coffee with any pastry at Starbucks! Redeem via the app. Mon–Fri 8–10am only.",
    date: new Date(Date.now() - 24 * 3600_000).toISOString(),
    tags: ["#deals", "#coffee", "#breakfast"],
    telegramUrl: "https://t.me/sgfooddeals/5",
    moreInfoUrl: "https://www.starbucks.com.sg/promo",
  },
  {
    id: 6,
    text: "🍱 $8.80 bento sets at Ichiban Boshi. Includes miso soup + salad. All day every day this month! #deals #japanese #lunch",
    excerpt: "$8.80 bento sets at Ichiban Boshi. Includes miso soup + salad. All day every day this month!",
    date: new Date(Date.now() - 30 * 3600_000).toISOString(),
    tags: ["#deals", "#japanese", "#lunch"],
    telegramUrl: "https://t.me/sgfooddeals/6",
    moreInfoUrl: "https://www.ichibanboshi.com.sg/promotions",
  },
];

// ── Route handler ─────────────────────────────────────────────────────────────

export const revalidate = 86400; // refreshed at 11pm SGT by /api/deals/refresh cron

export async function GET() {
  try {
    const deals = await fetchAllDeals();
    if (deals.length > 0) {
      return NextResponse.json({ deals, updatedAt: new Date().toISOString(), source: "telegram" });
    }
    return NextResponse.json({ deals: MOCK_DEALS, updatedAt: new Date().toISOString(), source: "mock" });
  } catch (err) {
    console.error("[/api/deals] error:", err);
    return NextResponse.json({ deals: MOCK_DEALS, updatedAt: new Date().toISOString(), source: "mock" });
  }
}
