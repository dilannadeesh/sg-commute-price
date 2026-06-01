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
  // Weekend activities
  "#hiking":    "hiking",
  "#beach":     "beach",
  "#museum":    "museum",
  "#arts":      "art-gallery",
  "#sports":    "sport",
  "#outdoor":   "nature",
  "#indoor":    "escape-room",
  "#family":    "picnic",
  "#kids":      "kids-activities",
  "#events":    "festival",
  "#cycling":   "cycling",
  "#yoga":      "yoga",
  "#climbing":  "rock-climbing",
};

// Emoji fallback (last resort, no image at all)
const TAG_EMOJI: Record<string, string> = {
  "#burger": "🍔", "#pizza": "🍕", "#sushi": "🍣", "#japanese": "🍱",
  "#ramen": "🍜", "#coffee": "☕", "#breakfast": "🥞", "#lunch": "🍽️",
  "#dinner": "🌙", "#delivery": "🛵", "#bento": "🍱", "#drinks": "🧋",
  "#bubbletea": "🧋", "#chicken": "🍗", "#seafood": "🦐", "#vegetarian": "🥗",
  "#dessert": "🍨", "#cake": "🎂", "#chinese": "🥢", "#western": "🥩",
  "#indian": "🍛", "#thai": "🍲", "#korean": "🥘", "#malay": "🍛",
  "#hawker": "🏮", "#dineout": "🍴", "#1for1": "2️⃣", "#promo": "🎉",
  "#outdoor": "🌿", "#indoor": "🏛️", "#hiking": "🥾", "#beach": "🏖️",
  "#sports": "⚽", "#museum": "🖼️", "#arts": "🎨", "#events": "🎭",
  "#family": "👨‍👩‍👧", "#kids": "🧒", "#free": "🎁", "#weekend": "🌤️",
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
  return "🍴";
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

  // Three-stage image chain:
  //   1. Telegram CDN photo (from deal.imageUrl)
  //   2. Wikipedia topic image via proxy (derived from deal tags)
  //   3. Gradient + emoji placeholder (no network, always works)
  const [imgSrc, setImgSrc]     = useState<string | null>(deal.imageUrl ?? fallbackUrl);
  const [allFailed, setAllFailed] = useState(false);

  function handleError() {
    if (imgSrc === deal.imageUrl && fallbackUrl) {
      // Stage 1 failed → try stage 2
      setImgSrc(fallbackUrl);
    } else {
      // Stage 2 (or stage 1 with no fallback) failed → show placeholder
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
      {imgSrc && !allFailed ? (
        <div className="deal-card-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={displayTags[0] ?? "Deal"}
            loading="lazy"
            onError={handleError}
          />
        </div>
      ) : (
        <div className="deal-card-img-placeholder" style={{ background: gradient }}>
          <span className="deal-card-emoji">{getEmoji(deal.tags)}</span>
        </div>
      )}

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
