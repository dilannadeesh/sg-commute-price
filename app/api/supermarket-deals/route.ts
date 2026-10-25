import { NextResponse } from "next/server";
import type { Deal } from "@/lib/types";

const CHANNEL    = process.env.SUPERMARKET_CHANNEL ?? "sgsuper";
const MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 days
const MAX_PAGES  = 10;

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

// ── Known Singapore supermarket chains ───────────────────────────────────────
const SUPERMARKET_KEYWORDS = [
  "fairprice", "ntuc", "cold storage", "giant", "sheng siong", "prime",
  "don don donki", "donki", "meidi-ya", "market place", "jasons",
  "cold storage", "unity", "guardian", "watsons", "redmart", "shopee mart",
  "supermarket", "grocery", "hypermart", "warehouse club", "costco",
];

function isSupermarketDeal(text: string): boolean {
  const lower = text.toLowerCase();
  return SUPERMARKET_KEYWORDS.some(k => lower.includes(k));
}

// ── Paginated scrape ──────────────────────────────────────────────────────────

async function fetchFromPublicChannel(): Promise<Deal[]> {
  const allDeals: Deal[] = [];
  const seen    = new Set<number>();
  const cutoff  = Date.now() - MAX_AGE_MS;
  let   url: string | null = `https://t.me/s/${CHANNEL}`;
  let   page = 0;

  while (url && page < MAX_PAGES) {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SGliving/1.0; +https://sgliving.life)" },
      ...(page === 0 ? { next: { tags: ["supermarket-deals"], revalidate: 86400 } } : {}),
    });

    if (!res.ok) break;

    const html   = await res.text();
    const chunks = html.split(new RegExp(`(?=<[^>]*?data-post="${CHANNEL}\\/\\d+")`));

    let oldestId: number | null = null;
    let reachedCutoff = false;

    for (const chunk of chunks) {
      const idMatch = chunk.match(new RegExp(`data-post="${CHANNEL}\\/(\\d+)"`));
      if (!idMatch) continue;
      const messageId = parseInt(idMatch[1]);

      if (seen.has(messageId)) continue;
      seen.add(messageId);

      if (oldestId === null || messageId < oldestId) oldestId = messageId;

      const dateMatch = chunk.match(/datetime="([^"]+)"/);
      const date      = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();
      if (new Date(date).getTime() < cutoff) { reachedCutoff = true; continue; }

      const textBlockMatch = chunk.match(/class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      if (!textBlockMatch) continue;

      const blockHtml = textBlockMatch[1];
      const rawText   = stripHtml(blockHtml);

      if (!rawText.toLowerCase().includes("#deals") && !isSupermarketDeal(rawText)) continue;

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

    if (reachedCutoff || oldestId === null) break;
    url = `https://t.me/s/${CHANNEL}?before=${oldestId}`;
    page++;
  }

  return allDeals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_DEALS: Deal[] = [
  {
    id: 1,
    text: "🛒 NTUC FairPrice — Members get 20% off all fresh produce this weekend! Valid Sat & Sun only. #deals #fairprice #grocery",
    excerpt: "NTUC FairPrice — Members get 20% off all fresh produce this weekend! Valid Sat & Sun only.",
    date: new Date(Date.now() - 2 * 3600_000).toISOString(),
    tags: ["#deals", "#fairprice", "#grocery"],
    telegramUrl: "https://t.me/sgsuper/1",
    moreInfoUrl: "https://www.fairprice.com.sg/promotions",
  },
  {
    id: 2,
    text: "🥩 Cold Storage — Buy 2 get 1 FREE on selected meats. Offer valid till Sunday, while stocks last. #deals #coldstorage #meat",
    excerpt: "Cold Storage — Buy 2 get 1 FREE on selected meats. Offer valid till Sunday, while stocks last.",
    date: new Date(Date.now() - 6 * 3600_000).toISOString(),
    tags: ["#deals", "#coldstorage", "#meat"],
    telegramUrl: "https://t.me/sgsuper/2",
    moreInfoUrl: "https://www.coldstorage.com.sg/promotions",
  },
  {
    id: 3,
    text: "🍺 Giant Hypermart — Beer crates from S$45! Heineken, Tiger, Carlsberg. This week only at all Giant outlets. #deals #giant #drinks",
    excerpt: "Giant Hypermart — Beer crates from S$45! Heineken, Tiger, Carlsberg. This week only at all Giant outlets.",
    date: new Date(Date.now() - 12 * 3600_000).toISOString(),
    tags: ["#deals", "#giant", "#drinks"],
    telegramUrl: "https://t.me/sgsuper/3",
    moreInfoUrl: "https://www.giant.sg/promotions",
  },
  {
    id: 4,
    text: "🍜 Sheng Siong — 3-for-2 on all Nissin instant noodles. Min 3 packs, max 9 per customer. Till end of month. #deals #shengsiong #instantnoodles",
    excerpt: "Sheng Siong — 3-for-2 on all Nissin instant noodles. Min 3 packs, max 9 per customer. Till end of month.",
    date: new Date(Date.now() - 24 * 3600_000).toISOString(),
    tags: ["#deals", "#shengsiong", "#instantnoodles"],
    telegramUrl: "https://t.me/sgsuper/4",
    moreInfoUrl: "https://www.shengsiong.com.sg/promotions",
  },
  {
    id: 5,
    text: "🍣 Don Don Donki — Fresh sashimi sets from S$8.90. New stock daily at 10am. ION Orchard & Jewel outlets. #deals #donki #japanese #sashimi",
    excerpt: "Don Don Donki — Fresh sashimi sets from S$8.90. New stock daily at 10am. ION Orchard & Jewel outlets.",
    date: new Date(Date.now() - 30 * 3600_000).toISOString(),
    tags: ["#deals", "#donki", "#japanese", "#sashimi"],
    telegramUrl: "https://t.me/sgsuper/5",
    moreInfoUrl: "https://www.donki.com/en/store/singapore",
  },
  {
    id: 6,
    text: "🧴 Guardian Pharmacy — 30% off all Dove personal care products. Valid online and in-store. Use code DOVE30. #deals #guardian #personalcare",
    excerpt: "Guardian Pharmacy — 30% off all Dove personal care products. Valid online and in-store. Use code DOVE30.",
    date: new Date(Date.now() - 36 * 3600_000).toISOString(),
    tags: ["#deals", "#guardian", "#personalcare"],
    telegramUrl: "https://t.me/sgsuper/6",
    moreInfoUrl: "https://www.guardian.com.sg/promotions",
  },
];

// ── Route handler ─────────────────────────────────────────────────────────────

export const revalidate = 86400;

export async function GET() {
  try {
    const deals = await fetchFromPublicChannel();
    if (deals.length > 0) {
      return NextResponse.json({ deals, updatedAt: new Date().toISOString(), source: "telegram" });
    }
    return NextResponse.json({ deals: MOCK_DEALS, updatedAt: new Date().toISOString(), source: "mock" });
  } catch (err) {
    console.error("[/api/supermarket-deals] error:", err);
    return NextResponse.json({ deals: MOCK_DEALS, updatedAt: new Date().toISOString(), source: "mock" });
  }
}
