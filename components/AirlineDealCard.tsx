"use client";

import type { AirlineDeal } from "@/lib/types";

const AIRLINE_EMOJI: Record<string, string> = {
  "singapore airlines": "🇸🇬",
  "sia": "🇸🇬",
  "scoot": "🛫",
  "jetstar": "🌟",
  "airasia": "🔴",
  "batik air": "🦋",
  "malindo": "🦋",
  "vietnam airlines": "🇻🇳",
  "thai airways": "🇹🇭",
  "cathay pacific": "🇭🇰",
  "emirates": "🇦🇪",
  "qatar airways": "🇶🇦",
  "malaysia airlines": "🇲🇾",
  "cebu pacific": "🇵🇭",
  "philippine airlines": "🇵🇭",
  "garuda": "🇮🇩",
  "lion air": "🇮🇩",
  "korean air": "🇰🇷",
  "japan airlines": "🇯🇵",
  "jal": "🇯🇵",
  "ana": "🇯🇵",
  "qantas": "🇦🇺",
  "british airways": "🇬🇧",
  "lufthansa": "🇩🇪",
  "klm": "🇳🇱",
  "air france": "🇫🇷",
};

const DEST_EMOJI: Record<string, string> = {
  "tokyo": "🗼",     "osaka": "🏯",     "seoul": "🇰🇷",
  "bangkok": "🏛️",  "bali": "🌴",      "kuala lumpur": "🏙️",
  "kl": "🏙️",       "hong kong": "🌃", "taipei": "🏙️",
  "manila": "🇵🇭",  "jakarta": "🇮🇩",  "sydney": "🦘",
  "melbourne": "☕", "london": "🎡",    "paris": "🗼",
  "amsterdam": "🌷", "dubai": "🌆",    "maldives": "🏝️",
  "phuket": "🌊",   "krabi": "🪨",      "chiang mai": "🏔️",
};

const GRADIENTS = [
  "linear-gradient(135deg, #1F6FEB22 0%, #7A4DFF22 100%)",
  "linear-gradient(135deg, #0088cc22 0%, #1F6FEB22 100%)",
  "linear-gradient(135deg, #00529222 0%, #0088cc22 100%)",
  "linear-gradient(135deg, #7A4DFF22 0%, #0088cc22 100%)",
  "linear-gradient(135deg, #1F6FEB22 0%, #00B14F22 100%)",
  "linear-gradient(135deg, #0088cc22 0%, #ff385c22 100%)",
];

function getEmoji(deal: AirlineDeal): string {
  if (deal.airline) {
    const e = AIRLINE_EMOJI[deal.airline.toLowerCase()];
    if (e) return e;
  }
  if (deal.destination) {
    const e = DEST_EMOJI[deal.destination.toLowerCase()];
    if (e) return e;
  }
  return "✈️";
}

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

interface Props { deal: AirlineDeal; }

export default function AirlineDealCard({ deal }: Props) {
  const emoji    = getEmoji(deal);
  const gradient = GRADIENTS[deal.id % GRADIENTS.length];

  return (
    <a
      href={deal.moreInfoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="deal-card airline-deal-card"
      aria-label={deal.excerpt}
    >
      {deal.imageUrl ? (
        <div className="deal-card-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={deal.imageUrl} alt="Airline deal" loading="lazy" />
        </div>
      ) : (
        <div className="deal-card-img-placeholder" style={{ background: gradient }}>
          <span className="deal-card-emoji">{emoji}</span>
        </div>
      )}

      <div className="deal-card-body">
        {/* Route header */}
        <div className="airline-route-row">
          <span className="airline-origin">Singapore</span>
          <span className="airline-arrow">✈</span>
          <span className="airline-dest">{deal.destination ?? "Destination"}</span>
          {deal.price && <span className="airline-price-badge">{deal.price}</span>}
        </div>

        {deal.airline && (
          <div className="airline-name">{deal.airline}</div>
        )}

        <p className="deal-card-text">{deal.excerpt}</p>

        <div className="deal-card-footer">
          <span className="deal-card-time">{timeAgo(deal.date)}</span>
          <span className="deal-card-cta">View deal →</span>
        </div>
      </div>
    </a>
  );
}
