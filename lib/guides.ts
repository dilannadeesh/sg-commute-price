export interface GuideMeta {
  slug: string;
  title: string;          // H1
  seoTitle: string;       // <title> (brand appended by template)
  description: string;
  emoji: string;
  category: "Cars & COE" | "Getting around" | "Shopping" | "Hotels & travel";
  published: string;      // ISO date
  updated: string;        // ISO date
}

export const GUIDES: GuideMeta[] = [
  {
    slug: "how-coe-bidding-works", emoji: "🚗", category: "Cars & COE",
    title: "How COE Bidding Works in Singapore: A Plain-English Guide",
    seoTitle: "How COE Bidding Works in Singapore",
    description: "What a COE is, what Cat A to E cover, how the twice-monthly bidding works, and what PQP means when you renew — with the latest COE prices.",
    published: "2026-11-20", updated: "2026-11-20",
  },
  {
    slug: "grab-vs-gojek-vs-tada", emoji: "🚕", category: "Getting around",
    title: "Grab vs Gojek vs TADA: Which Is Cheapest in Singapore?",
    seoTitle: "Grab vs Gojek vs TADA: Which Is Cheapest?",
    description: "Estimated Grab, Gojek and TADA fares for short, medium and long trips in Singapore — off-peak, rush hour and late night — compared with MRT and bus.",
    published: "2026-11-20", updated: "2026-11-20",
  },
  {
    slug: "changi-airport-to-city", emoji: "✈️", category: "Getting around",
    title: "Changi Airport to the City: MRT, Bus, Taxi or Grab?",
    seoTitle: "Changi Airport to the City: MRT, Bus or Grab",
    description: "The cheapest and fastest ways from Changi Airport and Jewel to the city centre — MRT route, bus 36, taxi and ride-hailing, with typical times and costs.",
    published: "2026-11-20", updated: "2026-11-20",
  },
  {
    slug: "biggest-shopping-malls-singapore", emoji: "🛍️", category: "Shopping",
    title: "The Biggest Shopping Malls in Singapore, Ranked",
    seoTitle: "Biggest Shopping Malls in Singapore, Ranked",
    description: "Singapore's largest shopping malls ranked by number of stores — from Northpoint City and Jurong Point to VivoCity — with the nearest MRT for each.",
    published: "2026-11-20", updated: "2026-11-20",
  },
  {
    slug: "hotels-near-marina-bay", emoji: "🏨", category: "Hotels & travel",
    title: "Where to Stay Near Marina Bay (and for the Singapore F1)",
    seoTitle: "Hotels Near Marina Bay & for the Singapore F1",
    description: "Hotels within walking distance of Marina Bay, from Marina Bay Sands to budget picks nearby, with typical nightly rates and tips for F1 race weekend.",
    published: "2026-11-20", updated: "2026-11-20",
  },
];

export const getGuide = (slug: string) => GUIDES.find(g => g.slug === slug);

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00+08:00`).toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Singapore" });
