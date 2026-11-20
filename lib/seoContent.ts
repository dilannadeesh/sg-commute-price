// On-page copy for the deal, home and commute pages: a short Singapore-specific guide,
// related internal links and FAQs. The same FAQ text feeds both the visible FAQ section
// and the FAQPage structured data, so they always match (a Google requirement).

export type SeoPageKey = "home" | "food" | "supermarket" | "electronics" | "airline" | "weekend" | "commute";

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
      { href: "/supermarket-deals", label: "Supermarket promotions" },
      { href: "/malls", label: "Shopping malls by region" },
      { href: "/hotels", label: "Hotels by price" },
      { href: "/automobile", label: "Latest COE results" },
      { href: "/commute", label: "Compare ride prices" },
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
      { q: "Which Singapore supermarkets are covered?", a: "We track promotions from NTUC FairPrice, Cold Storage, Giant, Sheng Siong, Don Don Donki and Guardian when they're shared publicly, and refresh the list every night." },
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
      { href: "/malls", label: "Malls with electronics stores" },
      { href: "/supermarket-deals", label: "Household promotions" },
      { href: "/airline-deals", label: "Travel deals" },
    ],
    faqs: [
      { q: "Which electronics stores are covered?", a: "We track public promotions from Harvey Norman, Courts, Best Denki, Challenger and Gain City, plus online sales shared by Singapore deal channels, refreshed every night." },
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
};
