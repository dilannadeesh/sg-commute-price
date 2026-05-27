import { NextResponse } from "next/server";
import type { Deal } from "@/lib/types";

const BOT_TOKEN   = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID  = process.env.TELEGRAM_CHANNEL_ID ?? "@sgfooddeals";

interface TgPhotoSize { file_id: string; width: number; height: number; file_size?: number; }
interface TgEntity   { type: string; offset: number; length: number; }
interface TgPost {
  message_id: number;
  chat: { id: number; username?: string; type: string };
  text?: string;
  caption?: string;
  photo?: TgPhotoSize[];
  date: number;
  entities?: TgEntity[];
  caption_entities?: TgEntity[];
}
interface TgUpdate { update_id: number; channel_post?: TgPost; }

function extractTags(text: string): string[] {
  return (text.match(/#[\w]+/gi) ?? []).map(t => t.toLowerCase());
}

function buildExcerpt(text: string): string {
  return text
    .replace(/#[\w]+/g, "")   // strip hashtags
    .replace(/https?:\/\/\S+/g, "") // strip URLs
    .replace(/\n{2,}/g, "\n")
    .trim()
    .slice(0, 220);
}

async function getImageUrl(fileId: string): Promise<string | undefined> {
  if (!BOT_TOKEN) return undefined;
  try {
    const res  = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
    const data = await res.json();
    if (!data.ok) return undefined;
    return `https://api.telegram.org/file/bot${BOT_TOKEN}/${data.result.file_path}`;
  } catch { return undefined; }
}

// --- Mock data shown when env vars are not yet configured ---
const MOCK_DEALS: Deal[] = [
  {
    id: 1,
    text: "🍔 1-for-1 Burgers at Shake Shack Jewel today only! Valid 11am–3pm. No code needed — just show this post. #deals #burger #1for1",
    excerpt: "1-for-1 Burgers at Shake Shack Jewel today only! Valid 11am–3pm. No code needed — just show this post.",
    date: new Date(Date.now() - 2 * 3600_000).toISOString(),
    tags: ["#deals", "#burger", "#1for1"],
    url: "https://t.me/sgfooddeals/1",
  },
  {
    id: 2,
    text: "🍜 $5 ramen at Ippudo Singapore this weekend. Valid Sat & Sun, dine-in only. #deals #ramen #japanese #weekend",
    excerpt: "$5 ramen at Ippudo Singapore this weekend. Valid Sat & Sun, dine-in only.",
    date: new Date(Date.now() - 6 * 3600_000).toISOString(),
    tags: ["#deals", "#ramen", "#japanese", "#weekend"],
    url: "https://t.me/sgfooddeals/2",
  },
  {
    id: 3,
    text: "🧋 Buy 2 get 1 FREE at LiHO Tea all outlets! Use promo code LIHO3FOR2 on their app. Valid until end of month. #deals #bubbletea #liho #drinks",
    excerpt: "Buy 2 get 1 FREE at LiHO Tea all outlets! Use promo code LIHO3FOR2 on their app. Valid until end of month.",
    date: new Date(Date.now() - 10 * 3600_000).toISOString(),
    tags: ["#deals", "#bubbletea", "#liho", "#drinks"],
    url: "https://t.me/sgfooddeals/3",
  },
  {
    id: 4,
    text: "🍕 Pizza Hut Singapore — 40% off all pizzas online orders. Use code: PIZZASG40. Min order $30. #deals #pizza #delivery",
    excerpt: "Pizza Hut Singapore — 40% off all pizzas online orders. Use code: PIZZASG40. Min order $30.",
    date: new Date(Date.now() - 18 * 3600_000).toISOString(),
    tags: ["#deals", "#pizza", "#delivery"],
    url: "https://t.me/sgfooddeals/4",
  },
  {
    id: 5,
    text: "☕ Free coffee with any pastry at Starbucks! Redeem via the Starbucks app. Mon–Fri 8–10am only. #deals #coffee #starbucks #breakfast",
    excerpt: "Free coffee with any pastry at Starbucks! Redeem via the Starbucks app. Mon–Fri 8–10am only.",
    date: new Date(Date.now() - 24 * 3600_000).toISOString(),
    tags: ["#deals", "#coffee", "#starbucks", "#breakfast"],
    url: "https://t.me/sgfooddeals/5",
  },
  {
    id: 6,
    text: "🍱 $8.80 bento sets at Ichiban Boshi. Includes miso soup + salad. All day every day this month! #deals #japanese #bento #lunch",
    excerpt: "$8.80 bento sets at Ichiban Boshi. Includes miso soup + salad. All day every day this month!",
    date: new Date(Date.now() - 30 * 3600_000).toISOString(),
    tags: ["#deals", "#japanese", "#bento", "#lunch"],
    url: "https://t.me/sgfooddeals/6",
  },
];

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  // Return mock data until bot token is configured
  if (!BOT_TOKEN) {
    return NextResponse.json({
      deals: MOCK_DEALS,
      updatedAt: new Date().toISOString(),
      source: "mock",
    });
  }

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?allowed_updates=["channel_post"]&limit=100`,
      { next: { revalidate: 3600 } }
    );
    const tgData = await tgRes.json();

    if (!tgData.ok) {
      return NextResponse.json(
        { deals: MOCK_DEALS, error: tgData.description, source: "mock" },
        { status: 200 }
      );
    }

    const updates: TgUpdate[] = tgData.result;
    const channelUsername = CHANNEL_ID.startsWith("@")
      ? CHANNEL_ID.slice(1).toLowerCase()
      : null;

    const filtered = updates.filter(u => {
      const post = u.channel_post;
      if (!post) return false;
      const text = post.text ?? post.caption ?? "";
      if (!text.toLowerCase().includes("#deals")) return false;
      // Filter to the configured channel
      if (channelUsername) return post.chat.username?.toLowerCase() === channelUsername;
      return post.chat.id.toString() === CHANNEL_ID;
    });

    const deals: Deal[] = await Promise.all(
      filtered.map(async u => {
        const post = u.channel_post!;
        const text = post.text ?? post.caption ?? "";
        const chanUsername = post.chat.username;

        // Pick the largest photo variant
        const photo = post.photo?.sort((a, b) => b.width - a.width)[0];
        const imageUrl = photo ? await getImageUrl(photo.file_id) : undefined;

        return {
          id: post.message_id,
          text,
          excerpt: buildExcerpt(text),
          date: new Date(post.date * 1000).toISOString(),
          tags: extractTags(text),
          url: chanUsername
            ? `https://t.me/${chanUsername}/${post.message_id}`
            : `https://t.me/c/${Math.abs(post.chat.id)}/${post.message_id}`,
          imageUrl,
        };
      })
    );

    deals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ deals, updatedAt: new Date().toISOString(), source: "telegram" });
  } catch (err) {
    console.error("Telegram fetch error:", err);
    return NextResponse.json({ deals: MOCK_DEALS, source: "mock", error: "fetch failed" });
  }
}
