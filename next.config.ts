import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Next.js <Image> with Telegram CDN and Wikipedia images.
    // The <img> tags in DealCard also use /api/telegram-image proxy,
    // but declaring remotePatterns prevents "Invalid src" console warnings.
    remotePatterns: [
      // Telegram CDN — multiple subdomains
      { protocol: "https", hostname: "**.telegram-cdn.org" },
      { protocol: "https", hostname: "**.cdn-telegram.org" },
      { protocol: "https", hostname: "**.telesco.pe" },
      { protocol: "https", hostname: "cdn.telesco.pe" },
      { protocol: "https", hostname: "**.telegramcdn.net" },
      // Wikipedia / Wikimedia Commons (destination-image proxy fallback)
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "**.wikipedia.org" },
    ],
  },

  // Ensure that external fetches in API routes can reach Telegram and Wikipedia
  // (Vercel's network policy allows these; listing them here is informational)
  experimental: {},
};

export default nextConfig;
