import { NextResponse } from "next/server";
import type { Deal } from "@/lib/types";

const CHANNEL    = process.env.ELECTRONICS_CHANNEL ?? "sgelectronics";
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

// ── Electronics brand/category detection ─────────────────────────────────────
const ELECTRONICS_KEYWORDS = [
  "apple", "samsung", "sony", "lg", "philips", "panasonic", "sharp",
  "dyson", "asus", "acer", "lenovo", "dell", "hp", "microsoft", "google",
  "xiaomi", "huawei", "oneplus", "oppo", "vivo", "realme",
  "iphone", "macbook", "ipad", "airpods", "galaxy", "pixel",
  "laptop", "tablet", "phone", "earbuds", "headphones", "speaker",
  "tv", "television", "monitor", "printer", "camera", "drone",
  "gaming", "playstation", "xbox", "nintendo", "ps5", "gpu", "cpu",
  "air conditioner", "washing machine", "refrigerator", "dishwasher",
  "harvey norman", "courts", "best denki", "challenger", "gain city",
  "lazada", "shopee", "carousell", "hachi", "ezbuy",
  "electronics", "gadget", "tech deal",
];

function isElectronicsDeal(text: string): boolean {
  const lower = text.toLowerCase();
  return ELECTRONICS_KEYWORDS.some(k => lower.includes(k));
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
      ...(page === 0 ? { next: { tags: ["electronics-deals"], revalidate: 86400 } } : {}),
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

      if (!isElectronicsDeal(rawText) && !rawText.toLowerCase().includes("#tech")) continue;

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
    text: "📱 iPhone 16 Pro 256GB at S$1,699 — Harvey Norman members get extra S$100 off with promo code HN100. Valid this week only! #deals #apple #iphone #tech",
    excerpt: "iPhone 16 Pro 256GB at S$1,699 — Harvey Norman members get extra S$100 off with promo code HN100. Valid this week only!",
    date: new Date(Date.now() - 2 * 3600_000).toISOString(),
    tags: ["#deals", "#apple", "#iphone", "#tech"],
    telegramUrl: "https://t.me/sgelectronics/1",
    moreInfoUrl: "https://www.harveynorman.com.sg/promotions",
  },
  {
    id: 2,
    text: "🖥️ Samsung 55\" 4K QLED TV — S$899 (usual S$1,299) at Courts. Free wall mounting included! Limited stock. #deals #samsung #tv",
    excerpt: "Samsung 55\" 4K QLED TV — S$899 (usual S$1,299) at Courts. Free wall mounting included! Limited stock.",
    date: new Date(Date.now() - 6 * 3600_000).toISOString(),
    tags: ["#deals", "#samsung", "#tv"],
    telegramUrl: "https://t.me/sgelectronics/2",
    moreInfoUrl: "https://www.courts.com.sg/promotions",
  },
  {
    id: 3,
    text: "🎧 Sony WH-1000XM5 Noise Cancelling Headphones S$299 (U.P. S$449) at Best Denki. While stocks last. #deals #sony #headphones #audio",
    excerpt: "Sony WH-1000XM5 Noise Cancelling Headphones S$299 (U.P. S$449) at Best Denki. While stocks last.",
    date: new Date(Date.now() - 12 * 3600_000).toISOString(),
    tags: ["#deals", "#sony", "#headphones", "#audio"],
    telegramUrl: "https://t.me/sgelectronics/3",
    moreInfoUrl: "https://www.bestdenki.com.sg/promotions",
  },
  {
    id: 4,
    text: "💻 ASUS VivoBook 15 Laptop (i5, 16GB RAM, 512GB SSD) — S$899 at Challenger. Student promo available. #deals #asus #laptop #tech",
    excerpt: "ASUS VivoBook 15 Laptop (i5, 16GB RAM, 512GB SSD) — S$899 at Challenger. Student promo available.",
    date: new Date(Date.now() - 18 * 3600_000).toISOString(),
    tags: ["#deals", "#asus", "#laptop", "#tech"],
    telegramUrl: "https://t.me/sgelectronics/4",
    moreInfoUrl: "https://www.challenger.sg/promotions",
  },
  {
    id: 5,
    text: "🌬️ Dyson V15 Detect Vacuum Cleaner — S$749 at Gain City. Free extra tool kit worth S$89. Valid till Sunday. #deals #dyson #vacuum #homegadget",
    excerpt: "Dyson V15 Detect Vacuum Cleaner — S$749 at Gain City. Free extra tool kit worth S$89. Valid till Sunday.",
    date: new Date(Date.now() - 24 * 3600_000).toISOString(),
    tags: ["#deals", "#dyson", "#vacuum", "#homegadget"],
    telegramUrl: "https://t.me/sgelectronics/5",
    moreInfoUrl: "https://www.gaincity.com/promotions",
  },
  {
    id: 6,
    text: "🎮 PS5 Slim Bundle with 2 controllers + Spider-Man 2 — S$899 at GameProSG. Limited bundles available! #deals #ps5 #gaming #playstation",
    excerpt: "PS5 Slim Bundle with 2 controllers + Spider-Man 2 — S$899 at GameProSG. Limited bundles available!",
    date: new Date(Date.now() - 30 * 3600_000).toISOString(),
    tags: ["#deals", "#ps5", "#gaming", "#playstation"],
    telegramUrl: "https://t.me/sgelectronics/6",
    moreInfoUrl: "https://www.lazada.com.sg/promotions",
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
    console.error("[/api/electronics-deals] error:", err);
    return NextResponse.json({ deals: MOCK_DEALS, updatedAt: new Date().toISOString(), source: "mock" });
  }
}
