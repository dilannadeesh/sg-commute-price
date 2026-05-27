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

// ── Scrape t.me/s/{channel} (public channel web preview) ─────────────────────

async function fetchFromPublicChannel(): Promise<Deal[]> {
  const res = await fetch(`https://t.me/s/${CHANNEL}`, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SGliving/1.0; +https://sgliving.life)" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const html = await res.text();
  const deals: Deal[] = [];

  // Each message block starts with data-post="channel/id"
  // We split on that anchor and process each chunk independently
  const chunks = html.split(/(?=<[^>]*?data-post="sgfooddeals\/\d+")/);

  for (const chunk of chunks) {
    // Get message ID
    const idMatch = chunk.match(/data-post="sgfooddeals\/(\d+)"/);
    if (!idMatch) continue;
    const messageId = parseInt(idMatch[1]);

    // Text lives in .tgme_widget_message_text (may have nested spans/links)
    const textBlockMatch = chunk.match(
      /class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/
    );
    if (!textBlockMatch) continue;

    const rawText = stripHtml(textBlockMatch[1]);

    // Only posts tagged #deals
    if (!rawText.toLowerCase().includes("#deals")) continue;

    // Date from <time datetime="...">
    const dateMatch = chunk.match(/datetime="([^"]+)"/);
    const date = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();

    // Photo: background-image:url('https://...')
    const photoMatch = chunk.match(/background-image:url\('([^']+)'\)/);
    const imageUrl = photoMatch?.[1];

    deals.push({
      id: messageId,
      text: rawText,
      excerpt: buildExcerpt(rawText),
      date,
      tags: extractTags(rawText),
      url: `https://t.me/${CHANNEL}/${messageId}`,
      imageUrl,
    });
  }

  return deals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Mock data (fallback when scraping fails or in dev without internet) ───────

const MOCK_DEALS: Deal[] = [
  {
    id: 1,
    text: "🍔 1-for-1 Burgers at Shake Shack Jewel today only! Valid 11am–3pm. No code needed — just show this post. #deals #burger #1for1",
    excerpt: "1-for-1 Burgers at Shake Shack Jewel today only! Valid 11am–3pm. No code needed — just show this post.",
    date: new Date(Date.now() - 2 * 3600_000).toISOString(),
    tags: ["#deals", "#burger", "#1for1"],
    url: `https://t.me/${CHANNEL}/1`,
  },
  {
    id: 2,
    text: "🍜 $5 ramen at Ippudo Singapore this weekend. Valid Sat & Sun, dine-in only. #deals #ramen #japanese #weekend",
    excerpt: "$5 ramen at Ippudo Singapore this weekend. Valid Sat & Sun, dine-in only.",
    date: new Date(Date.now() - 6 * 3600_000).toISOString(),
    tags: ["#deals", "#ramen", "#japanese", "#weekend"],
    url: `https://t.me/${CHANNEL}/2`,
  },
  {
    id: 3,
    text: "🧋 Buy 2 get 1 FREE at LiHO Tea all outlets! Use promo code LIHO3FOR2 on their app. Valid until end of month. #deals #bubbletea #liho #drinks",
    excerpt: "Buy 2 get 1 FREE at LiHO Tea all outlets! Use promo code LIHO3FOR2 on their app. Valid until end of month.",
    date: new Date(Date.now() - 10 * 3600_000).toISOString(),
    tags: ["#deals", "#bubbletea", "#liho", "#drinks"],
    url: `https://t.me/${CHANNEL}/3`,
  },
  {
    id: 4,
    text: "🍕 Pizza Hut Singapore — 40% off all pizzas online orders. Use code: PIZZASG40. Min order $30. #deals #pizza #delivery",
    excerpt: "Pizza Hut Singapore — 40% off all pizzas online orders. Use code: PIZZASG40. Min order $30.",
    date: new Date(Date.now() - 18 * 3600_000).toISOString(),
    tags: ["#deals", "#pizza", "#delivery"],
    url: `https://t.me/${CHANNEL}/4`,
  },
  {
    id: 5,
    text: "☕ Free coffee with any pastry at Starbucks! Redeem via the Starbucks app. Mon–Fri 8–10am only. #deals #coffee #starbucks #breakfast",
    excerpt: "Free coffee with any pastry at Starbucks! Redeem via the Starbucks app. Mon–Fri 8–10am only.",
    date: new Date(Date.now() - 24 * 3600_000).toISOString(),
    tags: ["#deals", "#coffee", "#starbucks", "#breakfast"],
    url: `https://t.me/${CHANNEL}/5`,
  },
  {
    id: 6,
    text: "🍱 $8.80 bento sets at Ichiban Boshi. Includes miso soup + salad. All day every day this month! #deals #japanese #bento #lunch",
    excerpt: "$8.80 bento sets at Ichiban Boshi. Includes miso soup + salad. All day every day this month!",
    date: new Date(Date.now() - 30 * 3600_000).toISOString(),
    tags: ["#deals", "#japanese", "#bento", "#lunch"],
    url: `https://t.me/${CHANNEL}/6`,
  },
];

// ── Handler ───────────────────────────────────────────────────────────────────

export const revalidate = 3600; // Next.js ISR: revalidate every hour

export async function GET() {
  try {
    const deals = await fetchFromPublicChannel();

    if (deals.length > 0) {
      return NextResponse.json({ deals, updatedAt: new Date().toISOString(), source: "telegram" });
    }

    // Scraping returned nothing — serve mock data
    return NextResponse.json({ deals: MOCK_DEALS, updatedAt: new Date().toISOString(), source: "mock" });
  } catch (err) {
    console.error("[/api/deals] fetch error:", err);
    return NextResponse.json({ deals: MOCK_DEALS, updatedAt: new Date().toISOString(), source: "mock" });
  }
}
