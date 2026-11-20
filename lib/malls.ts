import { getWikiInfo, getInfoboxNumber, type WikiInfo } from "./wiki";

export type Region = "Central" | "North" | "North-East" | "East" | "West";
export const REGIONS: { id: Region; blurb: string }[] = [
  { id: "Central",    blurb: "Orchard Road, Marina Bay, City Hall & HarbourFront" },
  { id: "North",      blurb: "Woodlands, Yishun & Sembawang" },
  { id: "North-East", blurb: "Serangoon, Punggol, Sengkang & Hougang" },
  { id: "East",       blurb: "Changi, Tampines, Bedok & Marine Parade" },
  { id: "West",       blurb: "Jurong, Clementi & Choa Chu Kang" },
];

export interface Station { name: string; codes: string; access: string }

type MixKey = "luxury" | "downtown" | "suburban" | "lifestyle" | "outlet";

export interface Mall {
  slug: string;
  name: string;
  region: Region;
  area: string;
  address: string;
  /** Approximate store count — overridden weekly by Wikipedia's infobox when available. */
  stores: number;
  short: string;
  about: string;
  mrt: Station[];
  directions: string[];
  highlights: string[];
  mix: MixKey;
  website?: string;
  wiki?: string;
}

/** Typical tenant mix (share of stores) by mall type — used to estimate the category breakdown. */
const MIX: Record<MixKey, [string, number][]> = {
  luxury:    [["Fashion & Accessories", 40], ["Food & Beverage", 22], ["Beauty & Wellness", 15], ["Lifestyle & Home", 8], ["Electronics & Tech", 4], ["Kids & Toys", 3], ["Services & Others", 8]],
  downtown:  [["Fashion & Accessories", 32], ["Food & Beverage", 28], ["Beauty & Wellness", 13], ["Lifestyle & Home", 9], ["Electronics & Tech", 6], ["Kids & Toys", 4], ["Services & Others", 8]],
  suburban:  [["Food & Beverage", 32], ["Fashion & Accessories", 22], ["Beauty & Wellness", 12], ["Services & Others", 12], ["Lifestyle & Home", 9], ["Electronics & Tech", 7], ["Kids & Toys", 6]],
  lifestyle: [["Food & Beverage", 40], ["Fashion & Accessories", 20], ["Beauty & Wellness", 12], ["Lifestyle & Home", 12], ["Services & Others", 7], ["Electronics & Tech", 5], ["Kids & Toys", 4]],
  outlet:    [["Fashion & Accessories", 40], ["Food & Beverage", 25], ["Lifestyle & Home", 10], ["Beauty & Wellness", 8], ["Electronics & Tech", 6], ["Services & Others", 6], ["Kids & Toys", 5]],
};

export function estimateMix(mall: Mall, total: number): { category: string; count: number }[] {
  return MIX[mall.mix].map(([category, pct]) => ({ category, count: Math.round((total * pct) / 100) }));
}

export const MALLS: Mall[] = [
  // ── Central ────────────────────────────────────────────────────────────────
  {
    slug: "ion-orchard", name: "ION Orchard", region: "Central", area: "Orchard Road",
    address: "2 Orchard Turn, Singapore 238801", stores: 300, mix: "luxury",
    short: "Orchard Road's landmark mall — luxury flagships, high-street fashion and a huge basement food hall.",
    about: "ION Orchard sits right on top of Orchard MRT and anchors the Orchard Road shopping belt. The upper floors are lined with luxury maison flagships, while the basement levels hold high-street fashion, beauty and one of the city's busiest food halls.",
    mrt: [{ name: "Orchard", codes: "NS22 / TE14", access: "Direct underground link from the station into ION's basement" }],
    directions: [
      "Take the North-South Line (red) or Thomson-East Coast Line (brown) to Orchard station.",
      "Follow signs for ION Orchard — the station exits straight into basement 4 of the mall.",
      "Many bus services stop along Orchard Road and Orchard Boulevard outside the mall.",
    ],
    highlights: ["Luxury flagship stores", "Large basement food hall", "Direct MRT link", "ION Art gallery space"],
    website: "https://www.ionorchard.com", wiki: "ION Orchard",
  },
  {
    slug: "vivocity", name: "VivoCity", region: "Central", area: "HarbourFront",
    address: "1 HarbourFront Walk, Singapore 098585", stores: 300, mix: "downtown",
    short: "Singapore's largest mall by floor area, on the waterfront and the gateway to Sentosa.",
    about: "VivoCity is the country's largest shopping mall by retail space, set along the HarbourFront waterfront facing Sentosa. It mixes big-box anchors, a hypermarket, a cineplex and family attractions, and its Level 3 houses the Sentosa Express monorail station.",
    mrt: [{ name: "HarbourFront", codes: "NE1 / CC29", access: "Direct underground link into VivoCity's basement" }],
    directions: [
      "Take the North East Line (purple) or Circle Line (orange) to HarbourFront station.",
      "Follow the signs to VivoCity — the station connects directly to basement 2.",
      "Heading to Sentosa? The Sentosa Express station is on VivoCity Level 3.",
    ],
    highlights: ["Largest mall by floor area", "Rooftop Sky Park with water play", "Sentosa Express station", "Waterfront promenade"],
    website: "https://www.vivocity.com.sg", wiki: "VivoCity",
  },
  {
    slug: "suntec-city", name: "Suntec City", region: "Central", area: "Marina Centre",
    address: "3 Temasek Boulevard, Singapore 038983", stores: 360, mix: "downtown",
    short: "Sprawling Marina Centre mall built around the Fountain of Wealth, linked to the convention centre.",
    about: "Suntec City spans four connected towers and a convention centre in Marina Centre. Its wings are split into zones for fashion, dining and lifestyle, and it hosts major events such as the Singapore Motorshow at the attached Suntec Convention Centre.",
    mrt: [
      { name: "Promenade", codes: "CC4 / DT15", access: "About 3 minutes' walk, sheltered" },
      { name: "Esplanade", codes: "CC3", access: "About 5 minutes via the underground CityLink" },
      { name: "City Hall", codes: "EW13 / NS25", access: "About 10 minutes via CityLink Mall underground" },
    ],
    directions: [
      "Take the Circle Line (orange) or Downtown Line (blue) to Promenade and follow the Suntec City exit.",
      "From City Hall, walk underground through CityLink Mall and Esplanade station — fully sheltered.",
      "Bus services along Raffles Boulevard and Temasek Boulevard stop at the mall.",
    ],
    highlights: ["Fountain of Wealth", "Attached convention & exhibition centre", "Sheltered link to Marina Square", "Large supermarket and food courts"],
    website: "https://www.sunteccity.com.sg", wiki: "Suntec City",
  },
  {
    slug: "the-shoppes-at-marina-bay-sands", name: "The Shoppes at Marina Bay Sands", region: "Central", area: "Marina Bay",
    address: "2 Bayfront Avenue, Singapore 018972", stores: 170, mix: "luxury",
    short: "Luxury mall at Marina Bay Sands with a canal, celebrity-chef restaurants and bay views.",
    about: "The Shoppes runs along Marina Bay beneath the Marina Bay Sands towers. It is Singapore's top address for luxury brands and fine dining, with an indoor canal and sampan rides, and connects to the casino, ArtScience Museum and Gardens by the Bay.",
    mrt: [{ name: "Bayfront", codes: "CE1 / DT16", access: "Direct underground link into The Shoppes" }],
    directions: [
      "Take the Downtown Line (blue) or Circle Line extension to Bayfront station.",
      "Exit towards The Shoppes at Marina Bay Sands — the station opens into the mall's basement.",
      "Walking from the city? Cross the Helix Bridge from Promenade (about 10 minutes).",
    ],
    highlights: ["Luxury maisons", "Indoor canal & sampan rides", "Celebrity-chef restaurants", "Next to Gardens by the Bay"],
    website: "https://www.marinabaysands.com/shopping.html", wiki: "The Shoppes at Marina Bay Sands",
  },
  {
    slug: "plaza-singapura", name: "Plaza Singapura", region: "Central", area: "Dhoby Ghaut",
    address: "68 Orchard Road, Singapore 238839", stores: 250, mix: "downtown",
    short: "Long-running family mall at the start of Orchard Road, right above a three-line interchange.",
    about: "Opened in 1974, Plaza Singapura is one of Orchard Road's oldest malls and a reliable all-rounder: everyday fashion, homeware, a supermarket, a cineplex and plenty of mid-priced dining, all directly above Dhoby Ghaut interchange.",
    mrt: [{ name: "Dhoby Ghaut", codes: "NS24 / NE6 / CC1", access: "Direct link from the station" }],
    directions: [
      "Take the North-South, North East or Circle Line to Dhoby Ghaut interchange.",
      "Follow the Plaza Singapura exit — the mall connects directly to the station.",
      "Many bus services stop along Orchard Road outside the mall.",
    ],
    highlights: ["Three-line MRT interchange", "Cineplex", "Supermarket", "Family-friendly mid-range brands"],
    wiki: "Plaza Singapura",
  },
  {
    slug: "raffles-city", name: "Raffles City Shopping Centre", region: "Central", area: "City Hall",
    address: "252 North Bridge Road, Singapore 179103", stores: 200, mix: "downtown",
    short: "Civic District mall above City Hall MRT with fashion, beauty and a busy dining basement.",
    about: "Raffles City is part of an integrated development with hotels and offices, sitting directly above City Hall interchange. It is known for premium fashion and beauty, a strong basement dining line-up, and underground links to CityLink and the Esplanade area.",
    mrt: [
      { name: "City Hall", codes: "EW13 / NS25", access: "Direct underground link" },
      { name: "Esplanade", codes: "CC3", access: "About 5 minutes underground via CityLink Mall" },
    ],
    directions: [
      "Take the East-West or North-South Line to City Hall and follow signs to Raffles City.",
      "Underground walkways continue to CityLink Mall, Esplanade and Marina Square.",
    ],
    highlights: ["Directly above City Hall MRT", "Premium beauty & fashion", "Basement dining", "Sheltered links across the Civic District"],
    wiki: "Raffles City",
  },
  {
    slug: "bugis-junction", name: "Bugis Junction", region: "Central", area: "Bugis",
    address: "200 Victoria Street, Singapore 188021", stores: 180, mix: "downtown",
    short: "Glass-roofed shopping street mall linked to Bugis MRT, opposite the Bugis Street market.",
    about: "Bugis Junction converted three streets of old shophouses into an air-conditioned, glass-roofed shopping street. It is popular with students and young shoppers for affordable fashion and dining, and sits opposite Bugis Street market and Bugis+.",
    mrt: [{ name: "Bugis", codes: "EW12 / DT14", access: "Direct underground link" }],
    directions: [
      "Take the East-West Line (green) or Downtown Line (blue) to Bugis station.",
      "Follow signs to Bugis Junction — the station connects directly to the basement.",
    ],
    highlights: ["Glass-covered shophouse street", "Affordable fashion", "Opposite Bugis Street market", "Direct MRT link"],
    wiki: "Bugis Junction",
  },
  {
    slug: "marina-square", name: "Marina Square", region: "Central", area: "Marina Centre",
    address: "6 Raffles Boulevard, Singapore 039594", stores: 250, mix: "downtown",
    short: "Big, sheltered Marina Centre mall between Suntec City and the Esplanade.",
    about: "Marina Square is one of the largest malls in the city centre, connected by covered and underground links to Suntec City, Millenia Walk and Esplanade. It mixes fashion, sports, dining and family entertainment across a very large single-block floor plate.",
    mrt: [
      { name: "Esplanade", codes: "CC3", access: "About 3 minutes via underground link" },
      { name: "Promenade", codes: "CC4 / DT15", access: "About 5 minutes, sheltered" },
      { name: "City Hall", codes: "EW13 / NS25", access: "About 10 minutes via CityLink Mall" },
    ],
    directions: [
      "Take the Circle Line (orange) to Esplanade and follow the Marina Square exit.",
      "From City Hall, walk underground through CityLink Mall — sheltered all the way.",
    ],
    highlights: ["Linked to Suntec City & Esplanade", "Family entertainment", "Sports & outdoor stores", "Large food court"],
    wiki: "Marina Square",
  },

  // ── North ──────────────────────────────────────────────────────────────────
  {
    slug: "northpoint-city", name: "Northpoint City", region: "North", area: "Yishun",
    address: "930 Yishun Avenue 2, Singapore 769098", stores: 500, mix: "suburban",
    short: "The North's biggest mall — two wings, a bus interchange and over 500 shops in Yishun.",
    about: "Northpoint City is the largest mall in northern Singapore, combining the original Northpoint with a newer South Wing. It sits beside Yishun MRT and an air-conditioned bus interchange, with a community club, library and rooftop community garden in the same development.",
    mrt: [{ name: "Yishun", codes: "NS13", access: "About 2 minutes, sheltered link" }],
    directions: [
      "Take the North-South Line (red) to Yishun station.",
      "Exit towards Northpoint City — a sheltered walkway leads straight into the mall.",
      "Yishun Integrated Transport Hub (bus interchange) is inside the development.",
    ],
    highlights: ["Largest mall in the North", "Integrated bus interchange", "Public library & community club", "Rooftop community garden"],
    website: "https://www.northpointcity.com.sg", wiki: "Northpoint City",
  },
  {
    slug: "causeway-point", name: "Causeway Point", region: "North", area: "Woodlands",
    address: "1 Woodlands Square, Singapore 738099", stores: 250, mix: "suburban",
    short: "Woodlands' main mall next to the MRT, popular with locals and visitors from Johor.",
    about: "Causeway Point is the main regional mall for Woodlands, beside Woodlands MRT and bus interchange. It is busy with families and cross-border shoppers and has a supermarket, department store, cineplex and a wide spread of dining.",
    mrt: [{ name: "Woodlands", codes: "NS9 / TE2", access: "About 3 minutes, sheltered" }],
    directions: [
      "Take the North-South Line (red) or Thomson-East Coast Line (brown) to Woodlands interchange.",
      "Follow signs to Causeway Point via the Woodlands bus interchange.",
    ],
    highlights: ["Next to Woodlands interchange", "Cineplex", "Supermarket & department store", "Rooftop garden"],
    wiki: "Causeway Point",
  },
  {
    slug: "sun-plaza", name: "Sun Plaza", region: "North", area: "Sembawang",
    address: "30 Sembawang Drive, Singapore 757713", stores: 120, mix: "suburban",
    short: "Sembawang's neighbourhood mall right next to the MRT, for everyday shopping and food.",
    about: "Sun Plaza is a compact neighbourhood mall serving Sembawang and Canberra, built next to Sembawang MRT and bus interchange. Expect a supermarket, food court, enrichment centres and everyday services rather than big-name fashion.",
    mrt: [{ name: "Sembawang", codes: "NS11", access: "About 2 minutes' walk" }],
    directions: [
      "Take the North-South Line (red) to Sembawang station.",
      "Exit to Sembawang Drive — Sun Plaza is beside the station and bus interchange.",
    ],
    highlights: ["Neighbourhood convenience", "Supermarket & food court", "Next to bus interchange"],
    wiki: "Sun Plaza",
  },

  // ── North-East ─────────────────────────────────────────────────────────────
  {
    slug: "nex", name: "NEX", region: "North-East", area: "Serangoon",
    address: "23 Serangoon Central, Singapore 556083", stores: 300, mix: "suburban",
    short: "The North-East's largest mall, on top of Serangoon interchange with a rooftop play garden.",
    about: "NEX is the biggest mall in the North-East and sits directly above Serangoon MRT interchange and bus interchange. It has a hypermarket, cineplex, public library and a popular rooftop garden and water play area for kids.",
    mrt: [{ name: "Serangoon", codes: "NE12 / CC13", access: "Direct underground link" }],
    directions: [
      "Take the North East Line (purple) or Circle Line (orange) to Serangoon interchange.",
      "Follow signs to NEX — the station connects directly to the mall's basement.",
      "Serangoon bus interchange is integrated at the mall's ground level.",
    ],
    highlights: ["Largest mall in the North-East", "Rooftop garden & water play", "Public library", "Integrated bus interchange"],
    wiki: "NEX (shopping mall)",
  },
  {
    slug: "waterway-point", name: "Waterway Point", region: "North-East", area: "Punggol",
    address: "83 Punggol Central, Singapore 828761", stores: 220, mix: "suburban",
    short: "Punggol's riverside mall linked to the MRT, with dining along My Waterway @ Punggol.",
    about: "Waterway Point is a family mall on the Punggol Waterway, linked to Punggol MRT/LRT. Its three wings hold a supermarket, cinema and lots of dining, with alfresco restaurants opening onto the waterway park.",
    mrt: [{ name: "Punggol", codes: "NE17 / PTC", access: "About 3 minutes via sheltered link" }],
    directions: [
      "Take the North East Line (purple) to Punggol station.",
      "Follow the sheltered link to Waterway Point; Punggol bus interchange is next door.",
    ],
    highlights: ["Waterfront alfresco dining", "Cinema", "Family-friendly", "Linked to Punggol MRT/LRT"],
    wiki: "Waterway Point",
  },
  {
    slug: "compass-one", name: "Compass One", region: "North-East", area: "Sengkang",
    address: "1 Sengkang Square, Singapore 545078", stores: 200, mix: "suburban",
    short: "Sengkang's main mall sitting directly on top of the MRT/LRT station.",
    about: "Compass One is the heart of Sengkang town, built above Sengkang MRT/LRT station and bus interchange. It covers daily needs with a supermarket, food court, enrichment centres and family fashion, plus a public library.",
    mrt: [{ name: "Sengkang", codes: "NE16 / STC", access: "Direct link" }],
    directions: [
      "Take the North East Line (purple) to Sengkang station.",
      "Follow signs to Compass One — the mall connects directly to the station concourse.",
    ],
    highlights: ["Directly above Sengkang MRT", "Public library", "Supermarket & food court"],
    wiki: "Compass One",
  },
  {
    slug: "hougang-mall", name: "Hougang Mall", region: "North-East", area: "Hougang",
    address: "90 Hougang Avenue 10, Singapore 538766", stores: 150, mix: "suburban",
    short: "Hougang's neighbourhood mall for groceries, food and family shopping.",
    about: "Hougang Mall is the main neighbourhood mall for Hougang town centre, close to Hougang MRT and the bus interchange. It is a practical stop for groceries, food court meals and household essentials.",
    mrt: [{ name: "Hougang", codes: "NE14", access: "About 5 minutes' walk" }],
    directions: [
      "Take the North East Line (purple) to Hougang station.",
      "Exit towards Hougang Central — the mall is a short walk past the bus interchange.",
    ],
    highlights: ["Neighbourhood convenience", "Supermarket", "Near Hougang bus interchange"],
    wiki: "Hougang Mall",
  },

  // ── East ───────────────────────────────────────────────────────────────────
  {
    slug: "jewel-changi-airport", name: "Jewel Changi Airport", region: "East", area: "Changi",
    address: "78 Airport Boulevard, Singapore 819666", stores: 280, mix: "lifestyle",
    short: "Airport lifestyle destination with the world's tallest indoor waterfall and 280+ shops.",
    about: "Jewel sits in front of Changi Airport Terminal 1 and links to Terminals 2 and 3. Built around the HSBC Rain Vortex and the five-storey Shiseido Forest Valley, it combines shopping, dining, the Canopy Park attractions and early check-in for flights.",
    mrt: [{ name: "Changi Airport", codes: "CG2", access: "About 5–10 minutes via Terminal 2 or 3 link bridges" }],
    directions: [
      "Take the East-West Line (green) to Tanah Merah, then the Changi Airport branch to Changi Airport station.",
      "Follow signs to Terminal 2 or 3, then the link bridge to Jewel (around 5–10 minutes).",
      "Free Skytrain and walkways connect Jewel to all terminals.",
    ],
    highlights: ["HSBC Rain Vortex waterfall", "Shiseido Forest Valley", "Canopy Park attractions", "Early flight check-in"],
    website: "https://www.jewelchangiairport.com", wiki: "Jewel Changi Airport",
  },
  {
    slug: "tampines-mall", name: "Tampines Mall", region: "East", area: "Tampines",
    address: "4 Tampines Central 5, Singapore 529510", stores: 200, mix: "suburban",
    short: "Busy Tampines regional-centre mall right beside the MRT interchange.",
    about: "Tampines Mall is one of the East's busiest malls, right next to Tampines MRT interchange. It sits alongside Century Square and Tampines 1, making Tampines Central one of the biggest shopping clusters outside the city.",
    mrt: [{ name: "Tampines", codes: "EW2 / DT32", access: "About 2 minutes' walk" }],
    directions: [
      "Take the East-West Line (green) or Downtown Line (blue) to Tampines interchange.",
      "Exit to Tampines Central — the mall is directly opposite the station.",
    ],
    highlights: ["Next to Tampines interchange", "Cinema", "Department store", "Close to Century Square & Tampines 1"],
    wiki: "Tampines Mall",
  },
  {
    slug: "parkway-parade", name: "Parkway Parade", region: "East", area: "Marine Parade",
    address: "80 Marine Parade Road, Singapore 449269", stores: 250, mix: "suburban",
    short: "East Coast's classic mall near East Coast Park, now with its own MRT station.",
    about: "Parkway Parade has served Marine Parade and the East Coast since the 1980s. It is a big family mall with a supermarket, department store, medical clinics and plenty of food, a short walk from East Coast Park and Marine Parade MRT.",
    mrt: [{ name: "Marine Parade", codes: "TE26", access: "About 3 minutes' walk" }],
    directions: [
      "Take the Thomson-East Coast Line (brown) to Marine Parade station.",
      "Exit towards Marine Parade Road — the mall is a short walk away.",
      "East Coast Park is about 10 minutes' walk via the underpass.",
    ],
    highlights: ["Near East Coast Park", "Supermarket & department store", "Medical & services", "Large F&B mix"],
    wiki: "Parkway Parade",
  },
  {
    slug: "bedok-mall", name: "Bedok Mall", region: "East", area: "Bedok",
    address: "311 New Upper Changi Road, Singapore 467360", stores: 200, mix: "suburban",
    short: "Bedok town-centre mall directly above the MRT and an air-conditioned bus interchange.",
    about: "Bedok Mall is built over Bedok MRT and the air-conditioned Bedok bus interchange, making it one of the most connected suburban malls in the East. It focuses on dining, groceries and everyday fashion.",
    mrt: [{ name: "Bedok", codes: "EW5", access: "Direct link" }],
    directions: [
      "Take the East-West Line (green) to Bedok station.",
      "Follow signs to Bedok Mall — it connects directly to the station and bus interchange.",
    ],
    highlights: ["Directly above Bedok MRT", "Integrated bus interchange", "Supermarket & dining"],
    wiki: "Bedok Mall",
  },

  // ── West ───────────────────────────────────────────────────────────────────
  {
    slug: "jurong-point", name: "Jurong Point", region: "West", area: "Boon Lay",
    address: "1 Jurong West Central 2, Singapore 648886", stores: 450, mix: "suburban",
    short: "Singapore's largest suburban mall with 450+ stores, beside Boon Lay MRT.",
    about: "Jurong Point is the largest suburban mall in Singapore, built in phases next to Boon Lay MRT and bus interchange. It has a huge range of everyday fashion, dining, supermarkets, a cinema and a public library, serving Jurong West and nearby campuses.",
    mrt: [{ name: "Boon Lay", codes: "EW27", access: "About 2 minutes, sheltered" }],
    directions: [
      "Take the East-West Line (green) to Boon Lay station.",
      "Follow signs to Jurong Point — linked via the Boon Lay bus interchange.",
    ],
    highlights: ["Largest suburban mall", "Cinema & library", "Next to Boon Lay interchange", "Huge F&B selection"],
    website: "https://www.jurongpoint.com.sg", wiki: "Jurong Point",
  },
  {
    slug: "jem", name: "JEM", region: "West", area: "Jurong East",
    address: "50 Jurong Gateway Road, Singapore 608549", stores: 250, mix: "suburban",
    short: "Jurong Gateway mall linked to Jurong East MRT, with fashion, dining, a cinema and library.",
    about: "JEM is part of the Jurong Lake District cluster around Jurong East interchange. It has a broad fashion and dining mix, a supermarket, a cinema and a public library, connected by covered walkways to Westgate and the MRT.",
    mrt: [{ name: "Jurong East", codes: "EW24 / NS1", access: "About 3 minutes via sheltered link bridge" }],
    directions: [
      "Take the East-West or North-South Line to Jurong East interchange.",
      "Follow the elevated link bridge to JEM; Westgate is next door.",
    ],
    highlights: ["Part of Jurong Gateway cluster", "Cinema", "Public library", "Sheltered link to Westgate"],
    wiki: "Jem (Singapore)",
  },
  {
    slug: "westgate", name: "Westgate", region: "West", area: "Jurong East",
    address: "3 Gateway Drive, Singapore 608532", stores: 200, mix: "suburban",
    short: "Family-focused Jurong East mall with an outdoor kids' playground and dining.",
    about: "Westgate sits beside JEM at Jurong Gateway and leans towards families, with a kids' floor, an outdoor playground and a large selection of restaurants. It links to Jurong East MRT by sheltered bridges.",
    mrt: [{ name: "Jurong East", codes: "EW24 / NS1", access: "About 3 minutes via sheltered link bridge" }],
    directions: [
      "Take the East-West or North-South Line to Jurong East interchange.",
      "Follow signs for Westgate across the elevated link bridges.",
    ],
    highlights: ["Kids' floor & playground", "Linked to JEM", "Large dining selection"],
    wiki: "Westgate (Singapore)",
  },
  {
    slug: "imm", name: "IMM", region: "West", area: "Jurong East",
    address: "2 Jurong East Street 21, Singapore 609601", stores: 250, mix: "outlet",
    short: "Singapore's largest outlet mall — brand outlets, furniture and home stores in Jurong East.",
    about: "IMM is best known as Singapore's largest outlet mall, with dozens of fashion and sports brand outlets alongside furniture, home and DIY stores and a hypermarket. It is a short walk or free shuttle from Jurong East MRT.",
    mrt: [{ name: "Jurong East", codes: "EW24 / NS1", access: "About 10 minutes' walk" }],
    directions: [
      "Take the East-West or North-South Line to Jurong East interchange.",
      "Walk through Jurong Gateway towards Jurong East Street 21 (about 10 minutes).",
    ],
    highlights: ["Largest outlet mall", "Home & furniture stores", "Hypermarket"],
    wiki: "IMM (Singapore)",
  },
  {
    slug: "the-clementi-mall", name: "The Clementi Mall", region: "West", area: "Clementi",
    address: "3155 Commonwealth Avenue West, Singapore 129588", stores: 150, mix: "suburban",
    short: "Clementi's mall directly linked to the MRT and bus interchange, near NUS and SIM.",
    about: "The Clementi Mall is integrated with Clementi MRT and bus interchange and sits under HDB blocks. It is popular with students and families for dining, a supermarket and a public library.",
    mrt: [{ name: "Clementi", codes: "EW23", access: "Direct link" }],
    directions: [
      "Take the East-West Line (green) to Clementi station.",
      "Follow signs to The Clementi Mall — linked directly to the station.",
    ],
    highlights: ["Directly linked to Clementi MRT", "Public library", "Supermarket & food court"],
    wiki: "The Clementi Mall",
  },
  {
    slug: "lot-one", name: "Lot One", region: "West", area: "Choa Chu Kang",
    address: "21 Choa Chu Kang Avenue 4, Singapore 689812", stores: 150, mix: "suburban",
    short: "Choa Chu Kang's town mall next to the MRT/LRT, with a cinema and library.",
    about: "Lot One Shoppers' Mall serves Choa Chu Kang town, beside Choa Chu Kang MRT/LRT and bus interchange. It has a cinema, public library and a solid line-up of dining and everyday shops.",
    mrt: [{ name: "Choa Chu Kang", codes: "NS4 / BP1", access: "About 2 minutes' walk" }],
    directions: [
      "Take the North-South Line (red) to Choa Chu Kang station.",
      "Exit towards Choa Chu Kang Avenue 4 — Lot One is next to the station.",
    ],
    highlights: ["Next to MRT/LRT & bus interchange", "Cinema", "Public library"],
    wiki: "Lot One",
  },
];

export const getMall = (slug: string) => MALLS.find(m => m.slug === slug);

export interface MallView extends Mall {
  storeCount: number;
  storeCountSource: "wikipedia" | "estimate";
  wikiInfo: WikiInfo | null;
}

/** Mall + weekly-refreshed Wikipedia data (photo, coordinates, infobox store count). */
export async function loadMall(mall: Mall): Promise<MallView> {
  const [wikiInfo, wikiStores] = await Promise.all([
    getWikiInfo(mall.wiki, mall.name, "malls"),
    mall.wiki ? getInfoboxNumber(mall.wiki, ["number_of_stores", "stores", "number_of_tenants"], "malls") : Promise.resolve(null),
  ]);
  const useWiki = wikiStores !== null && wikiStores >= 30 && wikiStores <= 1500;
  return {
    ...mall,
    storeCount: useWiki ? wikiStores : mall.stores,
    storeCountSource: useWiki ? "wikipedia" : "estimate",
    wikiInfo,
  };
}

export async function loadAllMalls(): Promise<MallView[]> {
  return Promise.all(MALLS.map(loadMall));
}

/** The three biggest malls by store count. */
export async function loadBiggestMalls(n = 3): Promise<MallView[]> {
  const all = await loadAllMalls();
  return [...all].sort((a, b) => b.storeCount - a.storeCount).slice(0, n);
}
