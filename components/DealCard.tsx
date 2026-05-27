"use client";

import type { Deal } from "@/lib/types";

const CATEGORY_EMOJI: Record<string, string> = {
  "#burger": "🍔", "#pizza": "🍕", "#sushi": "🍣", "#japanese": "🍱",
  "#ramen": "🍜", "#coffee": "☕", "#breakfast": "🥞", "#lunch": "🍽️",
  "#dinner": "🌙", "#delivery": "🛵", "#bento": "🍱", "#drinks": "🧋",
  "#bubbletea": "🧋", "#chicken": "🍗", "#seafood": "🦐", "#vegetarian": "🥗",
  "#dessert": "🍨", "#cake": "🎂", "#chinese": "🥢", "#western": "🥩",
  "#indian": "🍛", "#thai": "🍲", "#korean": "🥘", "#malay": "🍛",
  "#hawker": "🏮", "#dineout": "🍴", "#1for1": "2️⃣", "#promo": "🎉",
};

const GRADIENTS = [
  "linear-gradient(135deg, #ff385c22 0%, #ff6b3522 100%)",
  "linear-gradient(135deg, #00B14F22 0%, #00d46822 100%)",
  "linear-gradient(135deg, #1F6FEB22 0%, #7A4DFF22 100%)",
  "linear-gradient(135deg, #FF7A0022 0%, #FFB80022 100%)",
  "linear-gradient(135deg, #7A4DFF22 0%, #ff385c22 100%)",
  "linear-gradient(135deg, #0AAB1C22 0%, #00B14F22 100%)",
];

function getCategoryEmoji(tags: string[]): string {
  for (const tag of tags) {
    if (CATEGORY_EMOJI[tag]) return CATEGORY_EMOJI[tag];
  }
  return "🍴";
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
  const emoji    = getCategoryEmoji(deal.tags);
  const gradient = GRADIENTS[deal.id % GRADIENTS.length];
  const displayTags = deal.tags.filter(t => t !== "#deals").slice(0, 4);

  return (
    <a
      href={deal.moreInfoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="deal-card"
      aria-label={deal.excerpt}
    >
      {deal.imageUrl ? (
        <div className="deal-card-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={deal.imageUrl} alt="Deal" loading="lazy" />
        </div>
      ) : (
        <div className="deal-card-img-placeholder" style={{ background: gradient }}>
          <span className="deal-card-emoji">{emoji}</span>
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
