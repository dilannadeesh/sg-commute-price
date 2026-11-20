import { getWikiInfo, getInfoboxNumber, type WikiInfo } from "./wiki";
import type { Station } from "./malls";

export type Tier = "budget" | "3-star" | "4-star" | "5-star";
export const TIERS: { id: Tier; label: string; stars: number; blurb: string }[] = [
  { id: "budget", label: "Budget hotels",  stars: 0, blurb: "Capsules, chains and no-frills rooms for travellers who just need a clean bed." },
  { id: "3-star", label: "3-star hotels",  stars: 3, blurb: "Comfortable mid-range hotels close to MRT stations and the city's food spots." },
  { id: "4-star", label: "4-star hotels",  stars: 4, blurb: "Upscale hotels with pools, restaurants and great locations — the sweet spot for value." },
  { id: "5-star", label: "5-star hotels",  stars: 5, blurb: "Singapore's iconic luxury hotels, from heritage landmarks to Marina Bay skyline stays." },
];

export interface Hotel {
  slug: string;
  name: string;
  tier: Tier;
  area: string;
  address?: string;
  /** Typical nightly rate for a standard double room, SGD — an estimate, not a live quote. */
  priceFrom: number;
  priceTo: number;
  rooms?: number;
  short: string;
  about: string;
  roomTypes: { name: string; from: number }[];
  mrt: Station[];
  access: string[];
  amenities: string[];
  multiLocation?: boolean;
  website?: string;
  wiki?: string;
}

const rt = (std: number, mult: [string, number][]) => mult.map(([name, m]) => ({ name, from: Math.round((std * m) / 10) * 10 }));

export const HOTELS: Hotel[] = [
  // ── 5-star ─────────────────────────────────────────────────────────────────
  {
    slug: "marina-bay-sands", name: "Marina Bay Sands", tier: "5-star", area: "Marina Bay",
    address: "10 Bayfront Avenue, Singapore 018956", priceFrom: 750, priceTo: 1200,
    short: "Singapore's skyline icon, famous for the 57th-floor infinity pool overlooking Marina Bay.",
    about: "Marina Bay Sands is the three-tower integrated resort that defines Singapore's skyline. Guests get access to the rooftop infinity pool at the SkyPark, and the hotel connects directly to The Shoppes, the casino, ArtScience Museum and Gardens by the Bay.",
    roomTypes: rt(750, [["Deluxe Room", 1], ["Premier Room", 1.2], ["Club Room", 1.7], ["Suite", 2.8]]),
    mrt: [{ name: "Bayfront", codes: "CE1 / DT16", access: "Direct underground link" }],
    access: ["Take the Downtown Line (blue) to Bayfront station — exits connect directly to the hotel and The Shoppes.", "From Changi Airport, a taxi or ride-hail takes about 20 minutes."],
    amenities: ["Rooftop infinity pool", "Casino", "Celebrity-chef restaurants", "Spa", "Direct mall access"],
    website: "https://www.marinabaysands.com", wiki: "Marina Bay Sands",
  },
  {
    slug: "raffles-hotel-singapore", name: "Raffles Hotel Singapore", tier: "5-star", area: "City Hall",
    address: "1 Beach Road, Singapore 189673", priceFrom: 1300, priceTo: 2200,
    short: "The legendary 1887 colonial hotel and birthplace of the Singapore Sling — all suites.",
    about: "Raffles Hotel is a national monument and one of Asia's most famous hotels. Every room is a suite with butler service, and the hotel's Long Bar, courtyards and arcade of shops and restaurants are destinations in their own right.",
    roomTypes: rt(1300, [["Courtyard Suite", 1], ["Palm Court Suite", 1.2], ["Personality Suite", 1.9], ["Grand Hotel Suite", 4]]),
    mrt: [
      { name: "City Hall", codes: "EW13 / NS25", access: "About 5 minutes' walk via Raffles City" },
      { name: "Esplanade", codes: "CC3", access: "About 5 minutes' walk" },
    ],
    access: ["Take the East-West or North-South Line to City Hall, exit through Raffles City and cross Bras Basah Road.", "From Changi Airport, a taxi or ride-hail takes about 20–25 minutes."],
    amenities: ["Butler service", "Long Bar (Singapore Sling)", "Heritage courtyards", "Spa", "Fine dining"],
    website: "https://www.raffles.com/singapore", wiki: "Raffles Hotel",
  },
  {
    slug: "the-fullerton-hotel-singapore", name: "The Fullerton Hotel Singapore", tier: "5-star", area: "Raffles Place",
    address: "1 Fullerton Square, Singapore 049178", priceFrom: 450, priceTo: 750,
    short: "Grand neoclassical former General Post Office on the Singapore River, by Marina Bay.",
    about: "The Fullerton Hotel occupies the 1928 Fullerton Building, a national monument that once housed the General Post Office. Rooms look over the Singapore River, the courtyard atrium or Marina Bay, with the CBD and Merlion Park on the doorstep.",
    roomTypes: rt(450, [["Courtyard Room", 1], ["Heritage Room", 1.2], ["Quay Room", 1.35], ["Suite", 2.5]]),
    mrt: [{ name: "Raffles Place", codes: "EW14 / NS26", access: "About 5 minutes' walk" }],
    access: ["Take the East-West or North-South Line to Raffles Place and exit towards One Fullerton / Fullerton Square.", "Merlion Park and Marina Bay waterfront are a 3-minute walk away."],
    amenities: ["Riverside infinity pool", "Heritage architecture", "Afternoon tea", "Fitness centre"],
    website: "https://www.fullertonhotels.com", wiki: "The Fullerton Hotel Singapore",
  },
  {
    slug: "shangri-la-singapore", name: "Shangri-La Singapore", tier: "5-star", area: "Orange Grove / Orchard",
    address: "22 Orange Grove Road, Singapore 258350", priceFrom: 420, priceTo: 700,
    short: "Garden resort-style luxury hotel set in tropical grounds a short walk from Orchard Road.",
    about: "Shangri-La Singapore is a resort in the city: three wings set in landscaped tropical gardens just off Orchard Road. It is popular with families for its pools and gardens, and with business travellers for its quiet location near the shopping belt.",
    roomTypes: rt(420, [["Deluxe Room", 1], ["Premier Room", 1.2], ["Horizon Club Room", 1.6], ["Suite", 2.6]]),
    mrt: [
      { name: "Orchard Boulevard", codes: "TE13", access: "About 8 minutes' walk" },
      { name: "Orchard", codes: "NS22 / TE14", access: "About 12 minutes' walk" },
    ],
    access: ["Take the Thomson-East Coast Line (brown) to Orchard Boulevard and walk up Orange Grove Road.", "The hotel runs a shuttle to Orchard Road (check current schedule with the hotel)."],
    amenities: ["Tropical gardens", "Outdoor pools", "Kids' facilities", "Spa", "Multiple restaurants"],
    website: "https://www.shangri-la.com/singapore/shangrila", wiki: "Shangri-La Hotel, Singapore",
  },
  {
    slug: "capella-singapore", name: "Capella Singapore", tier: "5-star", area: "Sentosa",
    address: "1 The Knolls, Sentosa Island, Singapore 098297", priceFrom: 900, priceTo: 1600,
    short: "Ultra-luxury Sentosa hideaway in restored colonial buildings, with villas and sea views.",
    about: "Capella Singapore combines restored 1880s colonial buildings with contemporary wings designed by Foster + Partners, set in rainforest on Sentosa's hilltop. Many villas have private plunge pools, and it hosted the 2018 US–North Korea summit.",
    roomTypes: rt(900, [["Premier Garden Room", 1], ["Premier Sea View Room", 1.3], ["Villa", 2.6], ["Colonial Manor", 6]]),
    mrt: [{ name: "HarbourFront", codes: "NE1 / CC29", access: "Then Sentosa Express to Imbiah + short taxi or hotel transfer" }],
    access: ["Take the North East or Circle Line to HarbourFront, then the Sentosa Express from VivoCity Level 3 to Imbiah station.", "From Imbiah, a short taxi or the hotel's transfer reaches The Knolls; most guests arrive by car (about 25 minutes from Changi Airport)."],
    amenities: ["Private villas with plunge pools", "Auriga Spa", "Rainforest grounds", "Sea-view pools"],
    website: "https://www.capellahotels.com/en/capella-singapore", wiki: "Capella Singapore",
  },
  {
    slug: "the-ritz-carlton-millenia-singapore", name: "The Ritz-Carlton, Millenia Singapore", tier: "5-star", area: "Marina Centre",
    address: "7 Raffles Avenue, Singapore 039799", priceFrom: 600, priceTo: 950,
    short: "Marina Centre luxury hotel known for its big bay-view bathroom windows and art collection.",
    about: "The Ritz-Carlton, Millenia sits in Marina Centre with views over Marina Bay and the Kallang Basin. It is known for its octagonal bathroom windows framing the skyline, a large modern art collection and easy covered access to Millenia Walk, Marina Square and Suntec City.",
    roomTypes: rt(600, [["Deluxe Kallang Room", 1], ["Deluxe Marina Bay Room", 1.2], ["Club Room", 1.6], ["Suite", 2.7]]),
    mrt: [{ name: "Promenade", codes: "CC4 / DT15", access: "About 5 minutes' walk, sheltered via Millenia Walk" }],
    access: ["Take the Circle Line (orange) or Downtown Line (blue) to Promenade and walk through Millenia Walk.", "Marina Bay Sands is about 10 minutes away on foot via the Helix Bridge."],
    amenities: ["Marina Bay views", "Outdoor pool", "Art collection", "Spa", "Club lounge"],
    website: "https://www.ritzcarlton.com/en/hotels/sinrz-the-ritz-carlton-millenia-singapore", wiki: "The Ritz-Carlton, Millenia Singapore",
  },

  // ── 4-star ─────────────────────────────────────────────────────────────────
  {
    slug: "hotel-jen-orchardgateway", name: "Hotel Jen Orchardgateway", tier: "4-star", area: "Orchard / Somerset",
    address: "277 Orchard Road, Singapore 238858", priceFrom: 280, priceTo: 400,
    short: "Modern hotel above orchardgateway mall with a rooftop pool and direct Somerset MRT access.",
    about: "Hotel Jen Orchardgateway sits on top of the orchardgateway mall in the middle of Orchard Road, with a rooftop pool and bar. Its direct underground link to Somerset MRT makes it one of the most convenient mid-upscale bases for shopping trips.",
    roomTypes: rt(280, [["Superior Room", 1], ["Deluxe Room", 1.15], ["Club Room", 1.45]]),
    mrt: [{ name: "Somerset", codes: "NS23", access: "Direct underground link via orchardgateway" }],
    access: ["Take the North-South Line (red) to Somerset and follow signs to orchardgateway — lifts go up to the hotel lobby.", "From Changi Airport, a taxi or ride-hail takes about 25 minutes."],
    amenities: ["Rooftop pool", "Direct mall & MRT access", "Fitness centre", "All-day dining"],
    wiki: "Hotel Jen Orchardgateway",
  },
  {
    slug: "carlton-hotel-singapore", name: "Carlton Hotel Singapore", tier: "4-star", area: "Bras Basah / City Hall",
    address: "76 Bras Basah Road, Singapore 189558", priceFrom: 260, priceTo: 380,
    short: "Large city-centre hotel in the Civic District, walkable to Raffles Hotel and Bugis.",
    about: "Carlton Hotel Singapore is a large, well-run city hotel in the Bras Basah arts and heritage district. It is walking distance to City Hall, Bugis and the museums, with two wings, an outdoor pool and Chinese and international restaurants.",
    roomTypes: rt(260, [["Deluxe Room", 1], ["Premier Room", 1.2], ["Executive Room", 1.5]]),
    mrt: [
      { name: "Bras Basah", codes: "CC2", access: "About 3 minutes' walk" },
      { name: "City Hall", codes: "EW13 / NS25", access: "About 6 minutes' walk" },
    ],
    access: ["Take the Circle Line (orange) to Bras Basah, or the East-West/North-South Line to City Hall.", "Raffles Hotel and Raffles City are across the road."],
    amenities: ["Outdoor pool", "Chinese restaurant", "Fitness centre", "Central location"],
    wiki: "Carlton Hotel Singapore",
  },
  {
    slug: "holiday-inn-singapore-atrium", name: "Holiday Inn Singapore Atrium", tier: "4-star", area: "Outram / Havelock",
    address: "317 Outram Road, Singapore 169075", priceFrom: 230, priceTo: 340,
    short: "Family-friendly hotel with a soaring atrium near Robertson Quay and Chinatown.",
    about: "Holiday Inn Singapore Atrium is known for its tall central atrium and glass lifts. It sits between Chinatown, Robertson Quay and Great World, and is a good-value base for families with its pool and kids' amenities.",
    roomTypes: rt(230, [["Standard Room", 1], ["Premier Room", 1.15], ["Executive Club Room", 1.5]]),
    mrt: [
      { name: "Havelock", codes: "TE16", access: "About 5 minutes' walk" },
      { name: "Outram Park", codes: "EW16 / NE3 / TE17", access: "About 12 minutes' walk" },
    ],
    access: ["Take the Thomson-East Coast Line (brown) to Havelock and walk along Havelock Road.", "Robertson Quay and the Singapore River are about 10 minutes' walk."],
    amenities: ["Atrium with glass lifts", "Outdoor pool", "Kids-friendly", "Halal-certified dining options"],
    wiki: "Holiday Inn Singapore Atrium",
  },
  {
    slug: "village-hotel-changi", name: "Village Hotel Changi", tier: "4-star", area: "Changi Village",
    address: "1 Netheravon Road, Singapore 508502", priceFrom: 200, priceTo: 300,
    short: "Laid-back seaside hotel near Changi Village with a rooftop pool and sea views.",
    about: "Village Hotel Changi is a quiet coastal retreat at the eastern tip of Singapore, close to Changi Village hawker centre, Changi Point Ferry Terminal for Pulau Ubin, and the airport. Its rooftop infinity pool looks out over the sea.",
    roomTypes: rt(200, [["Deluxe Room", 1], ["Sea View Room", 1.2], ["Club Room", 1.45]]),
    mrt: [{ name: "Tanah Merah", codes: "EW4", access: "Then a bus to Changi Village (about 25 minutes)" }],
    access: ["Take the East-West Line to Tanah Merah, then a bus towards Changi Village.", "From Changi Airport it's about 10 minutes by taxi or ride-hail."],
    amenities: ["Rooftop infinity pool", "Sea views", "Near Changi Village hawker centre", "Close to the airport"],
    wiki: "Village Hotel Changi",
  },
  {
    slug: "oasia-hotel-downtown", name: "Oasia Hotel Downtown", tier: "4-star", area: "Tanjong Pagar",
    address: "100 Peck Seah Street, Singapore 079333", priceFrom: 280, priceTo: 400,
    short: "Award-winning red 'green' skyscraper in Tanjong Pagar, covered in climbing plants.",
    about: "Oasia Hotel Downtown is a striking red tower wrapped in greenery, designed by WOHA. It has sky gardens and pools on several levels and sits in the Tanjong Pagar CBD, close to Chinatown and the area's restaurants and bars.",
    roomTypes: rt(280, [["Club Room", 1], ["Club Plus Room", 1.15], ["Studio", 1.4]]),
    mrt: [{ name: "Tanjong Pagar", codes: "EW15", access: "About 3 minutes' walk" }],
    access: ["Take the East-West Line (green) to Tanjong Pagar and exit towards Peck Seah Street.", "Chinatown and Maxwell Food Centre are about 10 minutes' walk."],
    amenities: ["Sky gardens", "Rooftop pools", "Iconic architecture", "CBD location"],
    wiki: "Oasia Hotel Downtown",
  },
  {
    slug: "novotel-singapore-on-stevens", name: "Novotel Singapore on Stevens", tier: "4-star", area: "Stevens / Orchard",
    address: "28 Stevens Road, Singapore 257878", priceFrom: 230, priceTo: 330,
    short: "Leafy, family-friendly hotel near Orchard Road with a large pool and Stevens MRT nearby.",
    about: "Novotel on Stevens is part of a resort-style complex just north of Orchard Road, with a large pool, sports facilities and family rooms. Stevens MRT on the Downtown and Thomson-East Coast lines is a short walk away.",
    roomTypes: rt(230, [["Superior Room", 1], ["Executive Room", 1.25], ["Family Room", 1.35]]),
    mrt: [{ name: "Stevens", codes: "DT10 / TE11", access: "About 5 minutes' walk" }],
    access: ["Take the Downtown Line (blue) or Thomson-East Coast Line (brown) to Stevens.", "Orchard Road is about 10 minutes by foot or a short taxi ride."],
    amenities: ["Large outdoor pool", "Family rooms", "Fitness & sports facilities", "Quiet green setting"],
    wiki: "Novotel Singapore on Stevens",
  },

  // ── 3-star ─────────────────────────────────────────────────────────────────
  {
    slug: "ibis-singapore-on-bencoolen", name: "ibis Singapore on Bencoolen", tier: "3-star", area: "Bugis / Bencoolen",
    address: "170 Bencoolen Street, Singapore 189657", priceFrom: 180, priceTo: 260,
    short: "Reliable mid-range hotel between Bugis and Little India with simple, modern rooms.",
    about: "ibis on Bencoolen is a large, efficient mid-range hotel in the Bugis–Bencoolen area, walkable to Bugis Street, Little India and the museums. Rooms are compact but modern, and the location has two MRT lines within a few minutes.",
    roomTypes: rt(180, [["Standard Room", 1], ["Twin Room", 1.05], ["Superior Room", 1.15]]),
    mrt: [
      { name: "Bencoolen", codes: "DT21", access: "About 3 minutes' walk" },
      { name: "Bugis", codes: "EW12 / DT14", access: "About 7 minutes' walk" },
    ],
    access: ["Take the Downtown Line (blue) to Bencoolen station.", "Bugis Junction and Bugis Street market are under 10 minutes away on foot."],
    amenities: ["24-hour reception", "Restaurant & bar", "Central location"],
    wiki: "Ibis Singapore on Bencoolen",
  },
  {
    slug: "hotel-boss", name: "Hotel Boss", tier: "3-star", area: "Lavender / Kampong Glam",
    address: "500 Jalan Sultan, Singapore 199020", priceFrom: 140, priceTo: 210,
    short: "Big value hotel near Kampong Glam with a rooftop pool and easy Lavender MRT access.",
    about: "Hotel Boss is a large, good-value hotel on the edge of Kampong Glam, with over 1,000 compact rooms, a rooftop pool and a supermarket and eateries on the ground floor. Haji Lane and Arab Street are a short walk away.",
    roomTypes: rt(140, [["Superior Room", 1], ["Deluxe Room", 1.15], ["Family Room", 1.5]]),
    mrt: [
      { name: "Lavender", codes: "EW11", access: "About 5 minutes' walk" },
      { name: "Nicoll Highway", codes: "CC5", access: "About 8 minutes' walk" },
    ],
    access: ["Take the East-West Line (green) to Lavender and walk along Jalan Sultan.", "Kampong Glam and Haji Lane are about 10 minutes away on foot."],
    amenities: ["Rooftop pool", "Supermarket downstairs", "Near Kampong Glam"],
    wiki: "Hotel Boss",
  },
  {
    slug: "hotel-g-singapore", name: "Hotel G Singapore", tier: "3-star", area: "Bugis / Middle Road",
    address: "200 Middle Road, Singapore 188980", priceFrom: 190, priceTo: 270,
    short: "Stylish boutique hotel in the arts district with buzzy restaurants downstairs.",
    about: "Hotel G is a design-led boutique hotel on Middle Road, between Bugis and Bras Basah. Rooms are compact and well designed, and its ground-floor restaurants and bars are popular with locals as well as guests.",
    roomTypes: rt(190, [["Good Room", 1], ["Great Room", 1.15], ["Greater Room", 1.35]]),
    mrt: [
      { name: "Bencoolen", codes: "DT21", access: "About 5 minutes' walk" },
      { name: "Bugis", codes: "EW12 / DT14", access: "About 7 minutes' walk" },
    ],
    access: ["Take the Downtown Line to Bencoolen or the East-West Line to Bugis, then walk to Middle Road.", "Bras Basah museums and Bugis Junction are within 10 minutes on foot."],
    amenities: ["Design-led rooms", "Popular restaurants & bars", "Arts-district location"],
    wiki: "Hotel G Singapore",
  },
  {
    slug: "holiday-inn-express-clarke-quay", name: "Holiday Inn Express Singapore Clarke Quay", tier: "3-star", area: "Clarke Quay / Robertson Quay",
    address: "2 Magazine Road, Singapore 059573", priceFrom: 200, priceTo: 280,
    short: "Modern hotel with a rooftop pool, a short walk from Clarke Quay's riverside nightlife.",
    about: "Holiday Inn Express Clarke Quay offers modern rooms with breakfast included and a rooftop pool. It is a few minutes' walk to the Singapore River, Clarke Quay and Chinatown.",
    roomTypes: rt(200, [["Standard Room", 1], ["Twin Room", 1.05], ["Premium Room", 1.2]]),
    mrt: [
      { name: "Clarke Quay", codes: "NE5", access: "About 8 minutes' walk" },
      { name: "Fort Canning", codes: "DT20", access: "About 8 minutes' walk" },
    ],
    access: ["Take the North East Line (purple) to Clarke Quay and walk along the river.", "Chinatown is about 10 minutes away on foot."],
    amenities: ["Rooftop pool", "Breakfast included", "Near Clarke Quay nightlife"],
    wiki: "Holiday Inn Express Singapore Clarke Quay",
  },
  {
    slug: "ibis-styles-singapore-on-macpherson", name: "ibis Styles Singapore on Macpherson", tier: "3-star", area: "MacPherson",
    priceFrom: 150, priceTo: 220,
    short: "Colourful, good-value hotel with breakfast included, between the city and the East.",
    about: "ibis Styles on Macpherson is a cheerful, budget-friendly 3-star with a rooftop pool and breakfast included in many rates. It sits in a residential area between the city centre and the East, with MRT and plenty of local food nearby.",
    roomTypes: rt(150, [["Standard Room", 1], ["Twin Room", 1.05], ["Superior Room", 1.15]]),
    mrt: [
      { name: "Mattar", codes: "DT25", access: "About 8 minutes' walk" },
      { name: "MacPherson", codes: "CC10 / DT26", access: "About 10 minutes' walk" },
    ],
    access: ["Take the Downtown Line (blue) to Mattar and walk along Macpherson Road.", "The city centre is about 15 minutes by taxi."],
    amenities: ["Rooftop pool", "Breakfast included on many rates", "Local food nearby"],
    wiki: "Ibis Styles Singapore on Macpherson",
  },

  // ── Budget ─────────────────────────────────────────────────────────────────
  {
    slug: "hotel-81", name: "Hotel 81", tier: "budget", area: "Multiple locations", multiLocation: true,
    priceFrom: 80, priceTo: 140,
    short: "Singapore's best-known budget chain — compact, clean rooms in Geylang, Bugis, Chinatown and more.",
    about: "Hotel 81 is Singapore's largest budget hotel chain, with branches spread across the island including Geylang, Chinatown, Bugis and Little India. Rooms are small and simple with private bathrooms — a practical choice for short stays.",
    roomTypes: rt(80, [["Standard Room", 1], ["Superior Room", 1.2], ["Deluxe Room", 1.4]]),
    mrt: [{ name: "Varies by branch", codes: "", access: "Most branches are within 10 minutes' walk of an MRT station" }],
    access: ["Check the specific branch address when booking — the nearest MRT differs by location.", "Central branches (Chinatown, Bugis, Dickson) are best for sightseeing."],
    amenities: ["Private bathroom", "Air-conditioning", "24-hour front desk", "Many locations"],
    wiki: "Hotel 81",
  },
  {
    slug: "fragrance-hotel", name: "Fragrance Hotel", tier: "budget", area: "Multiple locations", multiLocation: true,
    priceFrom: 80, priceTo: 140,
    short: "Budget hotel chain with branches across Singapore — simple rooms at low prices.",
    about: "Fragrance Hotel is a long-running Singapore budget chain with branches in areas such as Geylang, Joo Chiat and the city fringe. Expect basic but functional rooms; some branches include small rooftop pools.",
    roomTypes: rt(80, [["Standard Room", 1], ["Superior Room", 1.2], ["Deluxe Room", 1.4]]),
    mrt: [{ name: "Varies by branch", codes: "", access: "Check the branch — many are near Aljunied, Lavender or Paya Lebar MRT" }],
    access: ["Check the specific branch address when booking.", "East-side branches are convenient for Changi Airport (15–20 minutes by taxi)."],
    amenities: ["Private bathroom", "Air-conditioning", "Low prices", "Many locations"],
    wiki: "Fragrance Hotel",
  },
  {
    slug: "ibis-budget-singapore", name: "ibis budget Singapore", tier: "budget", area: "Multiple locations", multiLocation: true,
    priceFrom: 90, priceTo: 150,
    short: "No-frills Accor budget hotels with consistent, compact rooms in several neighbourhoods.",
    about: "ibis budget runs several small hotels in Singapore with Accor's standardised compact rooms. They are good for travellers who want a predictable international brand at a budget price.",
    roomTypes: rt(90, [["Standard Double", 1], ["Twin Room", 1.05], ["Family Room", 1.35]]),
    mrt: [{ name: "Varies by branch", codes: "", access: "Check the branch for the nearest MRT" }],
    access: ["Check the specific branch address when booking.", "Book directly with Accor for loyalty points."],
    amenities: ["Accor loyalty points", "Compact modern rooms", "24-hour reception"],
  },
  {
    slug: "the-pod-beach-road", name: "The Pod @ Beach Road", tier: "budget", area: "Bugis / Beach Road",
    address: "289 Beach Road, Singapore 199552", priceFrom: 60, priceTo: 110,
    short: "Boutique capsule hotel near Bugis and Kampong Glam — a stylish pod for solo travellers.",
    about: "The Pod is a boutique capsule hotel on Beach Road, between Bugis and Kampong Glam. Guests sleep in private pods with shared bathrooms and lounges — one of the cheapest ways to stay centrally.",
    roomTypes: [{ name: "Single Pod", from: 60 }, { name: "Queen Pod", from: 90 }, { name: "Private Room", from: 150 }],
    mrt: [{ name: "Bugis", codes: "EW12 / DT14", access: "About 7 minutes' walk" }],
    access: ["Take the East-West or Downtown Line to Bugis and walk towards Beach Road.", "Haji Lane and Arab Street are about 5 minutes away."],
    amenities: ["Private sleeping pods", "Shared lounge & pantry", "Central location"],
  },
];

export const getHotel = (slug: string) => HOTELS.find(h => h.slug === slug);

export interface HotelView extends Hotel { wikiInfo: WikiInfo | null; roomCount?: number }

export async function loadHotel(hotel: Hotel): Promise<HotelView> {
  const [wikiInfo, rooms] = await Promise.all([
    hotel.multiLocation && !hotel.wiki ? Promise.resolve(null) : getWikiInfo(hotel.wiki, hotel.name, "hotels"),
    hotel.wiki && !hotel.multiLocation ? getInfoboxNumber(hotel.wiki, ["number_of_rooms", "rooms"], "hotels") : Promise.resolve(null),
  ]);
  return { ...hotel, wikiInfo, roomCount: rooms && rooms >= 10 && rooms <= 5000 ? rooms : hotel.rooms };
}

export const loadAllHotels = () => Promise.all(HOTELS.map(loadHotel));

/** Average of the typical nightly range midpoints for a tier. */
export function tierAverage(tier: Tier): number {
  const list = HOTELS.filter(h => h.tier === tier);
  const avg = list.reduce((s, h) => s + (h.priceFrom + h.priceTo) / 2, 0) / list.length;
  return Math.round(avg / 10) * 10;
}
