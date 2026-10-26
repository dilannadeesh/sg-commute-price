"use client";

import { useState } from "react";
import type { Deal } from "@/lib/types";

// Maps deal tags → Wikipedia topic slug (reuses /api/destination-image proxy)
const TAG_TOPIC: Record<string, string> = {
  // Food & drink
  "#burger":    "burger",
  "#pizza":     "pizza",
  "#ramen":     "ramen",
  "#sushi":     "sushi",
  "#japanese":  "japanese-cuisine",
  "#korean":    "korean-cuisine",
  "#chinese":   "chinese-cuisine",
  "#indian":    "indian-cuisine",
  "#thai":      "thai-cuisine",
  "#malay":     "malay-cuisine",
  "#western":   "western-food",
  "#coffee":    "coffee",
  "#bubbletea": "bubbletea",
  "#dessert":   "dessert",
  "#cake":      "cake",
  "#chicken":   "fried-chicken",
  "#seafood":   "seafood",
  "#hawker":    "hawker-centre",
  "#dimsum":    "dim-sum",
  "#bbq":       "barbeque",
  "#breakfast": "breakfast",
  "#lunch":     "lunch",
  "#dinner":    "dinner",
  "#drinks":    "cocktail",
  // Supermarket
  "#grocery":   "grocery-store",
  "#ntuc":      "ntuc-fairprice",
  "#fairprice": "ntuc-fairprice",
  // Electronics
  "#laptop":    "laptop",
  "#phone":     "smartphone",
  "#iphone":    "iphone",
  "#tv":        "television",
  "#gaming":    "video-game",
  // Weekend activities
  "#hiking":    "hiking",
  "#beach":     "beach",
  "#museum":    "museum",
  "#arts":      "art-gallery",
  "#sports":    "sport",
  "#outdoor":   "nature",
  "#family":    "picnic",
  "#events":    "festival",
  "#cycling":   "cycling",
};

// Emoji fallback (last resort, always works with no network)
const TAG_EMOJI: Record<string, string> = {
  // Food
  "#burger": "🍔", "#pizza": "🍕", "#sushi": "🍣", "#japanese": "🍱",
  "#ramen": "🍜", "#coffee": "☕", "#breakfast": "🥞", "#lunch": "🍽️",
  "#dinner": "🌙", "#delivery": "🛵", "#bento": "🍱", "#drinks": "🧋",
  "#bubbletea": "🧋", "#chicken": "🍗", "#seafood": "🦐", "#vegetarian": "🥗",
  "#dessert": "🍨", "#cake": "🎂", "#chinese": "🥢", "#western": "🥩",
  "#indian": "🍛", "#thai": "🍲", "#korean": "🥘", "#malay": "🍛",
  "#hawker": "🏮", "#dineout": "🍴", "#1for1": "2️⃣", "#promo": "🎉",
  // Supermarket
  "#grocery": "🛒", "#ntuc": "🛒", "#fairprice": "🛒", "#coldstorage": "🧊",
  "#giant": "🏪", "#shengsiong": "🏪", "#donki": "🇯🇵", "#guardian": "💊",
  "#meat": "🥩", "#seafood": "🦐", "#dairy": "🥛", "#frozen": "🧊",
  // Electronics
  "#tech": "💻", "#laptop": "💻", "#phone": "📱", "#iphone": "📱",
  "#samsung": "📱", "#apple": "🍎", "#sony": "🎧", "#tv": "📺",
  "#gaming": "🎮", "#ps5": "🎮", "#headphones": "🎧", "#tablet": "📱",
  "#camera": "📷", "#dyson": "💨",
  // Weekend
  "#outdoor": "🌿", "#indoor": "🏛️", "#hiking": "🥾", "#beach": "🏖️",
  "#sports": "⚽", "#museum": "🖼️", "#arts": "🎨", "#events": "🎭",
  "#family": "👨‍👩‍👧", "#kids": "🧒", "#free": "🎁", "#weekend": "🌤️",
};

const DEFAULT_EMOJI_BY_CATEGORY: Record<string, string> = {
  food: "🍴",
  supermarket: "🛒",
  electronics: "📱",
  airline: "✈️",
};

const GRADIENTS = [
  "linear-gradient(135deg, #ff385c22 0%, #ff6b3522 100%)",
  "linear-gradient(135deg, #00B14F22 0%, #00d46822 100%)",
  "linear-gradient(135deg, #1F6FEB22 0%, #7A4DFF22 100%)",
  "linear-gradient(135deg, #FF7A0022 0%, #FFB80022 100%)",
  "linear-gradient(135deg, #7A4DFF22 0%, #ff385c22 100%)",
  "linear-gradient(135deg, #0AAB1C22 0%, #00B14F22 100%)",
];

function getEmoji(tags: string[]): string {
  for (const tag of tags) {
    if (TAG_EMOJI[tag]) return TAG_EMOJI[tag];
  }
  return "🏷️";
}

// Pick the best Wikipedia topic slug from the deal's tags
function getFallbackImageUrl(tags: string[]): string | null {
  for (const tag of tags) {
    const topic = TAG_TOPIC[tag.toLowerCase()];
    if (topic) return `/api/destination-image/${encodeURIComponent(topic)}`;
  }
  return null;
}

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

interface Props { deal: Deal; }

export default function DealCard({ deal }: Props) {
  const gradient    = GRADIENTS[deal.id % GRADIENTS.length];
  const displayTags = deal.tags.filter(t => t !== "#deals").slice(0, 4);
  const fallbackUrl = getFallbackImageUrl(deal.tags);

  // Image loading strategy:
  //   Stage 1 → deal.imageUrl (Telegram CDN via /api/telegram-image proxy)
  //   Stage 2 → Wikipedia topic image via /api/destination-image proxy (tag-derived)
  //   Stage 3 → gradient + emoji placeholder (always works, no network)
  //
  // We start at stage 1 if an imageUrl exists, otherwise jump straight to stage 2.
  // If the imageUrl is a proxy URL (/api/telegram-image?...) and stage 1 fails,
  // we fall through to stage 2 (Wikipedia). If stage 2 also fails, show placeholder.

  const initialSrc = deal.imageUrl ?? fallbackUrl;
  const [imgSrc, setImgSrc]       = useState<string | null>(initialSrc);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [allFailed, setAllFailed] = useState(!initialSrc); // skip straight to emoji if no src at all

  function handleError() {
    // Stage 1 failed: try stage 2 (Wikipedia fallback) if we haven't yet
    if (imgSrc !== fallbackUrl && fallbackUrl) {
      setImgSrc(fallbackUrl);
      setImgLoaded(false);
    } else {
      // Stage 2 failed (or no fallback): show gradient + emoji placeholder
      setAllFailed(true);
    }
  }

  return (
    <a
      href={deal.moreInfoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="deal-card"
      aria-label={deal.excerpt}
    >
      {/* Image area */}
      <div className="deal-card-img-wrap">
        {/* Always render the emoji placeholder underneath — visible if image fails or before it loads */}
        {(!imgSrc || allFailed) ? (
          <div className="deal-card-img-placeholder" style={{ background: gradient }}>
            <span className="deal-card-emoji">{getEmoji(deal.tags)}</span>
          </div>
        ) : (
          <>
            {/* Show gradient behind image while it's loading */}
            {!imgLoaded && (
              <div className="deal-card-img-placeholder" style={{ background: gradient }}>
                <span className="deal-card-emoji">{getEmoji(deal.tags)}</span>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={displayTags[0]?.replace("#", "") ?? "Deal"}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onError={handleError}
              className={`deal-card-img${imgLoaded ? " is-loaded" : ""}`}
              style={!imgLoaded ? { opacity: 0, position: "absolute", width: "100%", height: "100%" } : {}}
            />
          </>
        )}
      </div>

      <div className="deal-card-body">
        <p className="deal-card-text">{deal.excerpt}</p>

        {displayTags.length > 0 && (
          <div className="deal-card-tags">
            {displayTags.map(tag => (
              <span key={tag} className="deal-tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="deal-card-footer">
          <span className="deal-card-time">{timeAgo(deal.date)}</span>
          <span className="deal-card-cta">More info →</span>
        </div>
      </div>
    </a>
  );
}
