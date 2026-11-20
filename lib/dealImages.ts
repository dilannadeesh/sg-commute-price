// Picks a relevant photo topic for a deal from its tags and text, most specific first.
// Topics resolve to Wikipedia / Wikimedia Commons photos via /api/destination-image/[topic].

export type DealCategory = "food" | "supermarket" | "electronics" | "weekend";

type Rule = [RegExp, string];

const ELECTRONICS: Rule[] = [
  [/\bps5\b|playstation/i, "playstation-5"],
  [/nintendo|\bswitch\b/i, "nintendo-switch"],
  [/xbox|gaming console|\bconsole\b/i, "game-console"],
  [/iphone/i, "iphone"],
  [/macbook/i, "macbook"],
  [/\bipad\b/i, "ipad"],
  [/galaxy|samsung (phone|s2\d|z ?fold|z ?flip)/i, "samsung-galaxy"],
  [/smart ?watch|apple watch|galaxy watch|garmin/i, "smartwatch"],
  [/\b(tv|television|qled|oled|uhd)\b|#tv\b/i, "television"],
  [/headphone|earbud|airpods|earphone|wh-1000/i, "headphones"],
  [/speaker|soundbar|#audio\b/i, "loudspeaker"],
  [/laptop|notebook|vivobook|zenbook|thinkpad|chromebook/i, "laptop"],
  [/monitor/i, "computer-monitor"],
  [/tablet/i, "tablet"],
  [/camera|gopro|mirrorless|dslr/i, "camera"],
  [/vacuum|dyson/i, "vacuum-cleaner"],
  [/aircon|air[- ]?con|air conditioner/i, "air-conditioner"],
  [/fridge|refrigerator/i, "refrigerator"],
  [/washing machine|washer|dryer/i, "washing-machine"],
  [/phone|mobile|#phone\b/i, "smartphone"],
];

const SUPERMARKET: Rule[] = [
  [/sashimi|sushi/i, "sashimi"],
  [/instant ?noodle|nissin|maggi|#instantnoodles/i, "instant-noodles"],
  [/beer|tiger|heineken|carlsberg/i, "beer"],
  [/wine/i, "wine"],
  [/\bmeat\b|beef|pork|chicken|lamb|#meat\b/i, "meat"],
  [/seafood|prawn|salmon|fish/i, "seafood"],
  [/fruit|apple|orange|durian|mango|grape/i, "fruit"],
  [/vegetable|veggie|produce/i, "vegetable"],
  [/\bmilk\b|dairy|yoghurt|yogurt|cheese/i, "milk"],
  [/\begg/i, "egg"],
  [/bread|bakery/i, "bread"],
  [/\brice\b/i, "rice"],
  [/frozen|ice cream/i, "frozen-food"],
  [/snack|chips|biscuit|chocolate/i, "snacks"],
  [/coffee/i, "coffee"],
  [/shampoo|personal ?care|dove|skincare|toiletr|#personalcare/i, "personal-care"],
  [/detergent|household|cleaning|tissue/i, "household"],
];

const FOOD: Rule[] = [
  [/burger/i, "burger"], [/pizza/i, "pizza"], [/ramen/i, "ramen"], [/sushi/i, "sushi"],
  [/dim ?sum/i, "dim-sum"], [/bubble ?tea|boba|milk tea|#bubbletea/i, "bubbletea"],
  [/coffee|latte|kopi/i, "coffee"], [/fried chicken|chicken/i, "fried-chicken"],
  [/korean/i, "korean-cuisine"], [/japanese|bento/i, "japanese-cuisine"],
  [/thai/i, "thai-cuisine"], [/indian|prata|biryani/i, "indian-cuisine"],
  [/chinese/i, "chinese-cuisine"], [/malay|nasi lemak/i, "malay-cuisine"],
  [/bbq|barbecue/i, "barbeque"], [/seafood|crab/i, "seafood"],
  [/dessert|ice cream|cake/i, "dessert"], [/breakfast/i, "breakfast"],
  [/hawker/i, "hawker-centre"], [/steak|western/i, "western-food"],
];

const WEEKEND: Rule[] = [
  [/hiking|hike|trail/i, "nature-walk"], [/beach/i, "beach"], [/museum/i, "museum"],
  [/art|gallery/i, "art-gallery"], [/kayak|water ?sport|surf/i, "water-sports"],
  [/kids|children|family|playground/i, "kids-activities"], [/cycling|bike/i, "cycling"],
  [/concert|festival|music/i, "festival"],
];

const RULES: Record<DealCategory, Rule[]> = {
  electronics: ELECTRONICS,
  supermarket: SUPERMARKET,
  food: FOOD,
  weekend: WEEKEND,
};

/** Section-level photo used when nothing more specific matches. */
export const CATEGORY_DEFAULT: Record<DealCategory, string> = {
  food: "food",
  supermarket: "supermarket",
  electronics: "consumer-electronics",
  weekend: "singapore",
};

export const imageFor = (topic: string) => `/api/destination-image/${encodeURIComponent(topic)}`;

/** Ordered list of image URLs to try for a deal: specific topic first, then the section default. */
export function dealImageCandidates(category: DealCategory | undefined, tags: string[], text: string): string[] {
  const haystack = `${tags.join(" ")} ${text}`;
  const rules = category ? RULES[category] : [...ELECTRONICS, ...SUPERMARKET, ...FOOD];
  const out: string[] = [];
  for (const [re, topic] of rules) {
    if (re.test(haystack)) { out.push(imageFor(topic)); break; }
  }
  if (category) out.push(imageFor(CATEGORY_DEFAULT[category]));
  return out;
}

/** Airline deals: destination → the airline's aircraft → Changi Airport. */
export function airlineImageCandidates(imageUrl: string | undefined, airline: string | undefined): string[] {
  const out: string[] = [];
  if (imageUrl) out.push(imageUrl);
  if (airline) out.push(imageFor(airline.toLowerCase().replace(/\s+/g, "-")));
  out.push(imageFor("changi-airport"));
  return out;
}
