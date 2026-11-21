// On-page copy for the deal, home and commute pages: a short Singapore-specific guide,
// related internal links and FAQs. The same FAQ text feeds both the visible FAQ section
// and the FAQPage structured data, so they always match (a Google requirement).

export type SeoPageKey = "home" | "food" | "supermarket" | "electronics" | "airline" | "weekend" | "commute" | "travel" | "newdriver" | "blackfriday";

export interface SeoContent {
  heading: string;
  intro: string[];
  tips?: { title: string; items: string[] };
  related: { href: string; label: string }[];
  faqs: { q: string; a: string }[];
}

export const SEO_CONTENT: Record<SeoPageKey, SeoContent> = {
  home: {
    heading: "Your guide to saving money and getting around Singapore",
    intro: [
      "SGliving brings Singapore's best everyday deals into one place — restaurant 1-for-1s and promo codes, supermarket promotions, electronics sales and cheap flights out of Changi — so you don't have to follow a dozen channels and newsletters.",
      "Beyond deals, you'll find guides to Singapore's shopping malls by region with the nearest MRT station, hotels from budget to 5-star with typical nightly rates, the latest COE results and upcoming car events, and a fare checker that compares Grab, Gojek, TADA and public transport for your route.",
    ],
    related: [
      { href: "/food-deals", label: "Food deals today" },
      { href: "/black-friday-deals-singapore", label: "Black Friday deals 2026" },
      { href: "/supermarket-deals", label: "Supermarket promotions" },
      { href: "/malls", label: "Shopping malls by region" },
      { href: "/hotels", label: "Hotels by price" },
      { href: "/coe", label: "Latest COE prices" },
      { href: "/commute", label: "Compare ride prices" },
      { href: "/travel", label: "Singapore journey planner" },
      { href: "/new-driver/btt-mock-test", label: "Free BTT mock exam" },
    ],
    faqs: [
      { q: "What is SGliving?", a: "SGliving is a free Singapore guide that collects daily food deals, supermarket promotions, electronics sales and cheap flights from Changi, alongside guides to shopping malls, hotels, COE results and a ride-price comparison for Grab, Gojek, TADA and public transport." },
      { q: "How often are the deals updated?", a: "Deal pages refresh automatically every night. Mall, hotel and automobile pages refresh weekly, and COE results are pulled from LTA's open data after each bidding exercise." },
      { q: "Where can I find the best deals in Singapore today?", a: "Start with the Food Deals page for restaurant promotions and 1-for-1s, Supermarket Deals for grocery promotions, Electronics Deals for gadget sales and Airline Deals for flight promotions from Changi. Each deal links to the original promotion so you can check the latest terms." },
      { q: "How much does a Grab ride cost in Singapore?", a: "SGliving's fare checker estimates Grab at about S$3.40 flag-down plus around S$0.85 per km and S$0.22 per minute, before surge. Peak-hour surge can add 30–50%. Use the Commute page to compare Grab with Gojek, TADA and MRT/bus for your exact route." },
    ],
  },

  food: {
    heading: "Finding food deals in Singapore",
    intro: [
      "Singapore's food promotions move fast — 1-for-1 lunches, app-only promo codes, opening specials and weekday set meals often last just a few days. This page collects them in one place every night, from hawker-friendly bargains to restaurant and café offers across the island.",
      "Search by cuisine or dish, filter by tag, and tap through to the original post to check the terms before you go. Promotions usually depend on outlet, time slot and stock, so it's worth confirming on the day.",
    ],
    tips: {
      title: "Tips for getting the most from food deals",
      items: [
        "1-for-1 deals often apply only to dine-in or to specific outlets — check before you queue.",
        "Delivery-app promo codes (GrabFood, foodpanda, Deliveroo) usually have a minimum spend and a usage cap.",
        "Weekday lunch sets are typically the best value in the CBD; weekend deals cluster in suburban malls.",
      ],
    },
    related: [
      { href: "/supermarket-deals", label: "Supermarket promotions" },
      { href: "/weekend", label: "Things to do this weekend" },
      { href: "/malls", label: "Malls and their food halls" },
    ],
    faqs: [
      { q: "Where do these Singapore food deals come from?", a: "Deals are collected from public Singapore food-deal channels, including @sgfooddeals on Telegram, and refreshed every night. Each card links to the original post so you can check the full terms." },
      { q: "Are the promotions still valid?", a: "We show recent posts, newest first, and older promotions drop off automatically. Food deals can end early or vary by outlet, so always confirm with the restaurant or app before you go." },
      { q: "Do I need an account to use SGliving?", a: "No. SGliving is free with no sign-up — search, filter and tap through to the original promotion." },
    ],
  },

  supermarket: {
    heading: "Supermarket promotions in Singapore",
    intro: [
      "Grocery bills add up quickly in Singapore, and the big chains — NTUC FairPrice, Cold Storage, Giant, Sheng Siong and Don Don Donki — run different weekly promotions on fresh produce, meat, household items and personal care. This page brings those promotions together so you can compare before you shop.",
      "Promotions often depend on membership (such as NTUC LinkPoints), minimum spend or limited stock, so check the details on each retailer's site or app.",
    ],
    tips: {
      title: "Ways to save on groceries",
      items: [
        "Combine weekly promotions with member points — FairPrice LinkPoints and similar schemes stack with many in-store offers.",
        "Bulk and 'buy 2' offers on rice, cooking oil and toiletries are usually the biggest savings.",
        "Sheng Siong and Giant are often cheaper on staples; Cold Storage and Donki for imported and Japanese items.",
      ],
    },
    related: [
      { href: "/food-deals", label: "Restaurant & food deals" },
      { href: "/malls", label: "Malls with supermarkets near you" },
      { href: "/electronics-deals", label: "Home appliance sales" },
    ],
    faqs: [
      { q: "Which Singapore supermarkets are covered?", a: "We pick out promotions from NTUC FairPrice, Cold Storage, Giant, Sheng Siong, Don Don Donki, Guardian and other grocery stores from public Singapore deal channels such as GoodLobang, and refresh the list every night." },
      { q: "Which supermarket is cheapest in Singapore?", a: "It depends on what you buy. Sheng Siong and Giant are often cheaper on everyday staples, FairPrice has the widest member promotions, and Cold Storage and Don Don Donki are popular for imported and Japanese products. Comparing weekly promotions is the easiest way to save." },
      { q: "Why don't I see any promotions right now?", a: "If no current promotions are available from our sources, the page shows none rather than outdated offers. Check back after the nightly refresh." },
    ],
  },

  electronics: {
    heading: "Electronics sales in Singapore",
    intro: [
      "Singapore's electronics retailers — Harvey Norman, Courts, Best Denki, Challenger and Gain City — run frequent weekend sales, member prices and bundle deals on phones, laptops, TVs, headphones and home appliances. This page gathers current promotions so you can compare prices in one place.",
      "Prices change quickly around big sale dates such as 9.9, 11.11, 12.12 and the Great Singapore Sale, so it's worth checking the retailer's site for the final price, warranty and stock before you buy.",
    ],
    tips: {
      title: "Before you buy",
      items: [
        "Check whether the warranty is a local (Singapore) warranty or an international one.",
        "Member prices and credit-card rebates can stack with in-store promotions.",
        "For big appliances, ask about free delivery, installation and disposal of your old unit.",
      ],
    },
    related: [
      { href: "/black-friday-deals-singapore", label: "Black Friday deals 2026" },
      { href: "/malls", label: "Malls with electronics stores" },
      { href: "/supermarket-deals", label: "Household promotions" },
      { href: "/airline-deals", label: "Travel deals" },
    ],
    faqs: [
      { q: "Where do the electronics deals come from?", a: "Deals are collected from public Singapore tech-deal channels such as SG Tech & Games — covering gadgets, gaming and electronics sales from retailers like Harvey Norman, Courts, Best Denki, Challenger and online stores — and refreshed every night." },
      { q: "When are the biggest electronics sales in Singapore?", a: "The largest sales usually cluster around 9.9, 11.11 and 12.12, year-end holidays, Chinese New Year and the Great Singapore Sale, with retailer weekend sales in between." },
      { q: "How do I find the cheapest iPhone or Samsung price?", a: "Search for the model on this page to see current promotions across retailers, then compare the final price, warranty and any bundled accessories on each retailer's site." },
    ],
  },

  airline: {
    heading: "Cheap flights from Singapore Changi",
    intro: [
      "Changi Airport connects Singapore to more than a hundred cities, and airlines regularly run flash sales and promo fares — budget carriers such as Scoot, AirAsia and Jetstar, and full-service airlines including Singapore Airlines. This page collects current promotions departing Singapore, with prices in SGD.",
      "Promo fares usually have fixed travel windows, limited seats and extra charges for baggage and seat selection, so check the full price on the airline's site before booking.",
    ],
    tips: {
      title: "How to get the best fare",
      items: [
        "Budget fares often exclude checked baggage — add it at booking, which is cheaper than at the airport.",
        "Fly mid-week and avoid Singapore school holidays and long weekends for the lowest prices.",
        "Sign up for airline newsletters — many flash sales open to members first.",
      ],
    },
    related: [
      { href: "/hotels", label: "Singapore hotels for stopovers" },
      { href: "/malls/jewel-changi-airport", label: "Jewel Changi Airport guide" },
      { href: "/commute", label: "Ride prices to the airport" },
    ],
    faqs: [
      { q: "Where do the flight deals come from?", a: "Deals are collected from public Singapore travel-deal channels such as SG Travel Promos, and every deal links to the airline or booking site. We only show flight and fare promotions." },
      { q: "Which airlines are included?", a: "Promotions from budget carriers such as Scoot, AirAsia and Jetstar, and full-service airlines including Singapore Airlines, Cathay Pacific and Malaysia Airlines, whenever they're shared publicly for Singapore departures." },
      { q: "Are these fares from Singapore only?", a: "Yes. We only show deals departing Singapore Changi Airport (SIN), and prices are shown in Singapore dollars where available." },
      { q: "How often are flight deals updated?", a: "Every night. Deals older than 30 days are removed automatically so you only see recent promotions." },
    ],
  },

  weekend: {
    heading: "Planning your weekend in Singapore",
    intro: [
      "From nature trails at MacRitchie and the Southern Ridges to beach days on Sentosa and East Coast Park, museum exhibitions, kids' workshops and pop-up markets, there's always something happening in Singapore on a weekend. This page collects current events, activities and weekend deals in one place.",
      "Listings link to the original post with booking details. Popular activities and free museum days fill up fast, so book early where you can.",
    ],
    related: [
      { href: "/food-deals", label: "Weekend food deals" },
      { href: "/malls", label: "Malls by region" },
      { href: "/automobile", label: "Car shows and events" },
    ],
    faqs: [
      { q: "Where do the weekend listings come from?", a: "Listings come from public Singapore weekend-activity channels, including @sgweekend on Telegram. Only posts with booking or information links are shown." },
      { q: "How often are weekend activities updated?", a: "Every night, covering roughly the past two months of posts so you can plan ahead." },
      { q: "What kinds of activities are listed?", a: "Outdoor and nature activities, beach days, family events, museum and arts programmes, sports sessions and promotions on weekend attractions across Singapore." },
    ],
  },

  commute: {
    heading: "How Singapore ride prices compare",
    intro: [
      "The cheapest way across Singapore depends on the time of day and the distance. MRT and buses are almost always cheapest, ride-hailing becomes better value when you're sharing a ride or travelling late at night, and car-sharing services like Flexar and GetGo can win for longer trips with several stops.",
      "The fare checker estimates each option for your route in Singapore dollars, including typical peak-hour surge for Grab, Gojek and TADA.",
    ],
    related: [
      { href: "/travel", label: "Full journey planner" },
      { href: "/travel/what-is-flexar", label: "What is Flexar?" },
      { href: "/malls", label: "Malls by MRT station" },
      { href: "/hotels", label: "Hotels and how to get there" },
      { href: "/automobile", label: "COE results" },
    ],
    faqs: [
      { q: "Which ride-hailing app is cheapest in Singapore?", a: "It depends on your route and the time of day — surge pricing changes which app is cheapest. The fare checker estimates Grab, Gojek and TADA side by side for your trip, alongside MRT/bus." },
      { q: "Does the comparison include peak-hour surge pricing?", a: "Yes. Estimates factor in typical peak-hour surge for ride-hailing apps, so morning and evening rush-hour fares reflect what you are likely to pay." },
      { q: "Can I compare car sharing and car rental too?", a: "Yes. The comparison includes Flexar car sharing (with walking time to the nearest station) and GetGo car rental (with round-trip cost), next to ride-hailing and public transport." },
    ],
  },
  travel: {
    heading: "Getting around Singapore: MRT, bus, Grab, Gojek, GetGo or Flexar?",
    intro: [
      "Singapore's MRT and buses are the cheapest way to travel: one distance-based fare covers the whole journey across up to five transfers, and most adult card fares are between S$1.28 and S$2.57. Trains run from roughly 5.30am to midnight, and bus routes fill the gaps between stations.",
      "Ride-hailing with Grab or Gojek is the quickest door-to-door option and worth it for groups, luggage, late nights or places far from an MRT station — expect to pay more at the morning and evening peaks. Car sharing suits self-drivers: GetGo rents cars by the hour for round trips from car parks near you, while Flexar lets you drive one way between stations in the East, North-East and Central regions.",
    ],
    tips: {
      title: "Tips to pay less",
      items: [
        "Tap in with the same card or phone for the whole journey — transfers within 45 minutes are charged as one distance fare.",
        "Avoid booking rides between 7–10am and 5–8pm on weekdays, when surge pricing is most common.",
        "Compare Grab and Gojek before you book; promo codes often make one noticeably cheaper.",
        "For a one-way drive, Flexar is usually cheaper than GetGo, which charges until you return the car.",
        "Going to or from Changi Airport with bags? A 6-seater ride split between friends can cost less per person than separate trains and taxis.",
      ],
    },
    related: [
      { href: "/travel/what-is-grab", label: "What is Grab?" },
      { href: "/travel/what-is-gojek", label: "What is Gojek?" },
      { href: "/travel/what-is-getgo", label: "What is GetGo?" },
      { href: "/travel/what-is-flexar", label: "What is Flexar?" },
      { href: "/guides/changi-airport-to-city", label: "Changi Airport to the city" },
      { href: "/guides/grab-vs-gojek-vs-tada", label: "Grab vs Gojek vs TADA" },
      { href: "/commute", label: "Quick fare checker by area" },
    ],
    faqs: [
      { q: "What is the cheapest way to travel in Singapore?", a: "Public transport. MRT, LRT and basic bus journeys are charged one distance-based fare for the whole trip, from S$1.28 to S$2.57 for adults paying by card from 27 December 2025. Ride-hailing usually costs several times more for the same route." },
      { q: "How much is an MRT ride in Singapore?", a: "Adult card fares from 27 December 2025 start at S$1.28 for journeys up to 3.2 km and rise with distance to a maximum of S$2.57 for journeys over 40.2 km. Bus and train legs in one journey are added together and charged as a single fare." },
      { q: "Is Grab or Gojek cheaper?", a: "It depends on the time and route. Gojek is often slightly cheaper off-peak, while Grab usually has more drivers and shorter waits. Our planner shows an estimated price range for both on your trip." },
      { q: "What is the difference between GetGo and Flexar?", a: "GetGo rents cars by the hour and you return the car to where you picked it up, so it suits round trips. Flexar is point-to-point: you pick up a car at one Flexar station and drop it at another, paying by the minute with fuel included." },
      { q: "How accurate are the prices in this planner?", a: "Public transport fares use the official adult card fare table. Grab, Gojek, GetGo and Flexar prices are estimates from published fees and typical fares, shown as a range. The app shows the exact fare before you book." },
      { q: "What time do MRT trains start and stop running?", a: "Most MRT and LRT lines run from about 5.30am to around midnight, with exact first and last train times varying by station. Outside those hours, take a taxi, ride-hail or a night bus where available." },
    ],
  },
  newdriver: {
    heading: "Driving in Singapore as a new driver",
    intro: [
      "Getting a Singapore licence means passing two theory tests (BTT and FTT) and the Traffic Police practical test, with lessons in between. Government fees are modest — S$7.20 per theory test, S$25 for the Provisional Driving Licence, S$40 for the practical test and S$50 for the licence — but lessons bring the typical total to S$1,700–S$3,000.",
      "Once you pass, you're on probation for a year with P plates. Rules are getting stricter: speeding penalties rose on 1 January 2026, and from 1 January 2027 a new driver loses their licence at 12 demerit points and other drivers are suspended at 18. Lower drink-driving limits and a ban on holding your phone while driving have also been passed into law.",
    ],
    tips: {
      title: "Tips for learners",
      items: [
        "Take a few full BTT mock exams until you score 47+ consistently before booking the real test.",
        "Book your practical test early — slots at popular centres can fill weeks ahead.",
        "Ask for a warm-up lesson on test day, and exaggerate every mirror and blind-spot check.",
        "Not ready to buy a car? Car sharing like GetGo or Flexar lets you keep driving after you pass.",
      ],
    },
    related: [
      { href: "/new-driver/btt-mock-test", label: "Free BTT mock exam" },
      { href: "/new-driver/singapore-driving-rules", label: "Latest driving rules" },
      { href: "/new-driver/how-to-get-driving-licence-singapore", label: "How to get a licence" },
      { href: "/new-driver/practical-driving-test-tips", label: "Practical test tips" },
      { href: "/coe", label: "COE prices" },
      { href: "/travel/what-is-getgo", label: "What is GetGo?" },
    ],
    faqs: [
      { q: "What is the minimum age to drive in Singapore?", a: "You must be at least 18 to get a Class 3 or 3A car licence in Singapore." },
      { q: "How much does it cost to get a driving licence in Singapore in 2026?", a: "Typically S$1,700–S$3,000 for a Class 3 or 3A licence, mostly lesson fees. Traffic Police fees total about S$140: S$7.20 each for the BTT and FTT, S$25 for the PDL, S$40 for the practical test and S$50 for the licence." },
      { q: "How do I pass the BTT?", a: "Study the official Basic Theory of Driving handbook, then practise with timed mock tests. You need 45 out of 50 correct, so aim to score consistently above 90% in practice before booking." },
      { q: "What are P plates in Singapore?", a: "P (probationary) plates — a red triangle on a yellow background — must be displayed by new drivers for their first year. During that year the licence is revoked at 13 demerit points, or 12 from 1 January 2027." },
      { q: "What changed for drivers in Singapore in 2026?", a: "Speeding penalties rose on 1 January 2026, theory and practical test fees rose on 13 March 2026, and Parliament passed lower drink-driving limits and a phone-holding offence in August 2026 (start date to be announced). Stricter demerit point thresholds start on 1 January 2027." },
    ],
  },

  blackfriday: {
    heading: "Black Friday 2026 in Singapore: what to know",
    intro: [
      "Black Friday falls on Friday 27 November 2026, followed by Cyber Monday on 30 November. In Singapore the sales rarely stick to one day: many retailers start early in the week and run offers through the weekend, so most of the deals on this page last 3 to 5 days.",
      "Electronics and appliances usually see the biggest cuts, from chains such as Courts, Harvey Norman, Challenger, Best Denki and Gain City, alongside online marketplaces like Lazada, Shopee and Amazon.sg. Supermarkets, restaurants and airlines join in with their own weekend promotions. Each deal here links to the original post, so you can check the price and terms before you buy.",
    ],
    tips: {
      title: "How to get real savings on Black Friday",
      items: [
        "Note today's price on the items you want, so you can tell a real discount from a raised-then-cut price.",
        "Compare the same model across two or three retailers. Courts, Harvey Norman and Challenger often price-match each other.",
        "Stack savings: card cashback, retailer member points and marketplace vouchers can often be combined with the sale price.",
        "Check warranty and delivery terms. Parallel-import electronics may not carry a local warranty.",
        "If an item isn't discounted much, wait. 12.12 on Saturday 12 December is the next big sale.",
      ],
    },
    related: [
      { href: "/electronics-deals", label: "Electronics deals today" },
      { href: "/supermarket-deals", label: "Supermarket promotions" },
      { href: "/food-deals", label: "Food deals today" },
      { href: "/airline-deals", label: "Cheap flights from Singapore" },
      { href: "/malls", label: "Shopping malls by region" },
    ],
    faqs: [
      { q: "When is Black Friday 2026 in Singapore?", a: "Black Friday 2026 is on Friday 27 November, and Cyber Monday is on Monday 30 November. Many Singapore retailers start their promotions a few days earlier and run them through the weekend." },
      { q: "Which Singapore stores have Black Friday sales?", a: "Electronics and appliance chains such as Courts, Harvey Norman, Challenger, Best Denki and Gain City usually take part, along with online marketplaces like Lazada, Shopee and Amazon.sg, many fashion and beauty brands, and some supermarkets, restaurants and airlines. This page lists the Black Friday promotions posted for each category." },
      { q: "Is Black Friday or 12.12 better for deals in Singapore?", a: "It depends on what you're buying. Electronics and appliance stores often give their deepest cuts around Black Friday, while marketplaces such as Shopee and Lazada tend to push their biggest vouchers on 11.11 and 12.12. If a price isn't much lower on Black Friday, it can be worth waiting for 12.12." },
      { q: "How do I know a Black Friday deal is genuine?", a: "Check the item's normal price before the sale, compare the same model at another retailer, and read the terms for limits on stock, outlets or payment methods. Every deal on SGliving links to the original post so you can verify it." },
      { q: "How often is this page updated?", a: "Every night. New Black Friday and Cyber Monday posts are added automatically, and each category shows its latest deals if no Black Friday posts have appeared yet." },
    ],
  },
};
