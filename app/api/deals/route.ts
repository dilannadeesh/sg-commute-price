import { NextResponse } from "next/server";
import type { Deal } from "@/lib/types";

const CHANNEL = "sgfooddeals";

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

// Extract external URLs from the raw HTML of the message block.
// Looks at <a href="..."> tags — Telegram auto-links all URLs in posts.
// Excludes internal Telegram links (t.me, telegram.me, ?q=).
function extractExternalUrls(html: string): string[] {
  return [...html.matchAll(/href="(https?:\/\/[^"]+)"/gi)]
    .map(m => m[1])
    .filter(url =>
      !url.includes("t.me/") &&
      !url.includes("telegram.me/") &&
      !url.startsWith("tg://")
    );
}

// ── Scrape t.me/s/{channel} ───────────────────────────────────────────────────

async function fetchFromPublicChannel(): Promise<Deal[]> {
  const res = await fetch(`https://t.me/s/${CHANNEL}`, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SGliving/1.0; +https://sgliving.life)" },
    // Tag-based cache: revalidateTag("deals") clears this immediately
    next: { tags: ["deals"], revalidate: 86400 },
  });

  if (!res.ok) return [];

  const html = await res.text();
  const deals: Deal[] = [];

  // Split on each message container boundary
  const chunks = html.split(/(?=<[^>]*?data-post="sgfooddeals\/\d+")/);

  for (const chunk of chunks) {
    const idMatch = chunk.match(/data-post="sgfooddeals\/(\d+)"/);
    if (!idMatch) continue;
    const messageId = parseInt(idMatch[1]);

    // Grab the raw inner HTML of the message text block
    const textBlockMatch = chunk.match(
      /class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/
    );
    if (!textBlockMatch) continue;

    const blockHtml = textBlockMatch[1];
    const rawText   = stripHtml(blockHtml);

    // ── Hard filter 1: must contain #deals ───────────────────────────────────
    if (!rawText.toLowerCase().includes("#deals")) continue;

    // ── Hard filter 2: must have at least one external "more info" URL ────────
    const externalUrls = extractExternalUrls(blockHtml);
    if (externalUrls.length === 0) continue;

    const moreInfoUrl = externalUrls[0];

    // Date
    const dateMatch = chunk.match(/datetime="([^"]+)"/);
    const date = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();

    // Photo (background-image from the photo wrapper)
    const photoMatch = chunk.match(/background-image:url\('([^']+)'\)/);
    const imageUrl = photoMatch?.[1];

    deals.push({
      id: messageId,
      text: rawText,
      excerpt: buildExcerpt(rawText),
      date,
      tags: extractTags(rawText),
      telegramUrl: `https://t.me/${CHANNEL}/${messageId}`,
      moreInfoUrl,
      imageUrl,
    });
  }

  return deals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Mock data (shown only when scraping fails) ─────────────────────────────────

const MOCK_DEALS: Deal[] = [
  {
    id: 1,
    text: "🍔 1-for-1 Burgers at Shake Shack Jewel today only! Valid 11am–3pm. No code needed — just show this post. #deals #burger #1for1",
    excerpt: "1-for-1 Burgers at Shake Shack Jewel today only! Valid 11am–3pm. No code needed — just show this post.",
    date: new Date(Date.now() - 2 * 3600_000).toISOString(),
    tags: ["#deals", "#burger", "#1for1"],
    telegramUrl: `https://t.me/${CHANNEL}/1`,
    moreInfoUrl: "https://www.shakeshack.com.sg/promotions",
  },
  {
    id: 2,
    text: "🍜 $5 ramen at Ippudo Singapore this weekend. Valid Sat & Sun, dine-in only. #deals #ramen #japanese",
    excerpt: "$5 ramen at Ippudo Singapore this weekend. Valid Sat & Sun, dine-in only.",
    date: new Date(Date.now() - 6 * 3600_000).toISOString(),
    tags: ["#deals", "#ramen", "#japanese"],
    telegramUrl: `https://t.me/${CHANNEL}/2`,
    moreInfoUrl: "https://www.ippudo.com.sg/promotions",
  },
  {
    id: 3,
    text: "🧋 Buy 2 get 1 FREE at LiHO Tea! Use promo code LIHO3FOR2 on their app. Valid until end of month. #deals #bubbletea #drinks",
    excerpt: "Buy 2 get 1 FREE at LiHO Tea! Use promo code LIHO3FOR2 on their app. Valid until end of month.",
    date: new Date(Date.now() - 10 * 3600_000).toISOString(),
    tags: ["#deals", "#bubbletea", "#drinks"],
    telegramUrl: `https://t.me/${CHANNEL}/3`,
    moreInfoUrl: "https://www.lihosg.com",
  },
  {
    id: 4,
    text: "🍕 Pizza Hut — 40% off all pizzas online. Use code: PIZZASG40. Min order $30. #deals #pizza #delivery",
    excerpt: "Pizza Hut — 40% off all pizzas online. Use code: PIZZASG40. Min order $30.",
    date: new Date(Date.now() - 18 * 3600_000).toISOString(),
    tags: ["#deals", "#pizza", "#delivery"],
    telegramUrl: `https://t.me/${CHANNEL}/4`,
    moreInfoUrl: "https://www.pizzahut.com.sg/deals",
  },
  {
    id: 5,
    text: "☕ Free coffee with any pastry at Starbucks! Redeem via the app. Mon–Fri 8–10am only. #deals #coffee #breakfast",
    excerpt: "Free coffee with any pastry at Starbucks! Redeem via the app. Mon–Fri 8–10am only.",
    date: new Date(Date.now() - 24 * 3600_000).toISOString(),
    tags: ["#deals", "#coffee", "#breakfast"],
    telegramUrl: `https://t.me/${CHANNEL}/5`,
    moreInfoUrl: "https://www.starbucks.com.sg/promo",
  },
  {
    id: 6,
    text: "🍱 $8.80 bento sets at Ichiban Boshi. Includes miso soup + salad. All day every day this month! #deals #japanese #lunch",
    excerpt: "$8.80 bento sets at Ichiban Boshi. Includes miso soup + salad. All day every day this month!",
    date: new Date(Date.now() - 30 * 3600_000).toISOString(),
    tags: ["#deals", "#japanese", "#lunch"],
    telegramUrl: `https://t.me/${CHANNEL}/6`,
    moreInfoUrl: "https://www.ichibanboshi.com.sg/promotions",
  },
];

// ── Route handler ─────────────────────────────────────────────────────────────

export const revalidate = 86400; // 24h fallback — overridden by cron revalidateTag

export async function GET() {
  try {
    const deals = await fetchFromPublicChannel();
    if (deals.length > 0) {
      return NextResponse.json({ deals, updatedAt: new Date().toISOString(), source: "telegram" });
    }
    return NextResponse.json({ deals: MOCK_DEALS, updatedAt: new Date().toISOString(), source: "mock" });
  } catch (err) {
    console.error("[/api/deals] error:", err);
    return NextResponse.json({ deals: MOCK_DEALS, updatedAt: new Date().toISOString(), source: "mock" });
  }
}
