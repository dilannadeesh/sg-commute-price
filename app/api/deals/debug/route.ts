import { NextResponse } from "next/server";

// Temporary diagnostic endpoint — returns raw Telegram HTML for the first page
// of @sgfooddeals so we can inspect what structure is actually being served.
// DELETE this file once the image extraction issue is resolved.

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://t.me/s/sgfooddeals", {
      headers: {
        "User-Agent":      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Telegram returned ${res.status}` }, { status: 502 });
    }

    const html = await res.text();

    // Split into first few message chunks for inspection
    const chunks = html.split(/(?=<[^>]*?data-post="sgfooddeals\/\d+")/);

    const analysis = {
      totalHtmlBytes: html.length,
      totalChunks: chunks.length,
      // How many chunks contain common Telegram image patterns
      chunksWith_data_zoom_src:         chunks.filter(c => /data-zoom-src=/.test(c)).length,
      chunksWith_photo_inner_image:     chunks.filter(c => /tgme_widget_message_photo_inner_image/.test(c)).length,
      chunksWith_background_image_url:  chunks.filter(c => /background-image.*url\(/.test(c)).length,
      chunksWith_telegram_cdn:          chunks.filter(c => /telegram-cdn\.org/.test(c)).length,
      chunksWith_cdn_telegram:          chunks.filter(c => /cdn-telegram\.org/.test(c)).length,
      // First 2 real post chunks for manual inspection (up to 3000 chars each)
      sampleChunks: chunks
        .filter(c => /data-post="sgfooddeals\/\d+"/.test(c))
        .slice(0, 2)
        .map(c => c.slice(0, 3000)),
    };

    return NextResponse.json(analysis, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
