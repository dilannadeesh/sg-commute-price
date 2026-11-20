// "What is …" guides for the transport providers compared in the Travelling in Singapore planner.
// Facts are checked against the sources listed on each page; prices change often, so the pages
// describe how pricing works and link to the provider for live rates.

export type ProviderSlug = "what-is-grab" | "what-is-gojek" | "what-is-getgo" | "what-is-flexar";

export interface ProviderGuide {
  slug: ProviderSlug;
  id: "grab" | "gojek" | "getgo" | "flexar";
  name: string;
  emoji: string;
  color: string;
  kind: "Ride-hailing" | "Car-sharing";
  title: string;          // <title>
  h1: string;
  description: string;    // meta description
  lede: string;
  facts: { label: string; value: string }[];
  org: { legalName?: string; url: string; foundingDate?: string; sameAs?: string[]; address?: string };
  sections: { heading: string; paragraphs?: string[]; list?: string[] }[];
  pros: string[];
  cons: string[];
  steps: string[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  updated: string;        // ISO date
}

const UPDATED = "2026-11-21";

export const PROVIDERS: ProviderGuide[] = [
  {
    slug: "what-is-grab",
    id: "grab",
    name: "Grab",
    emoji: "🟢",
    color: "#00B14F",
    kind: "Ride-hailing",
    title: "What is Grab? Singapore Ride-Hailing Fares & Fees",
    h1: "What is Grab?",
    description: "Grab is Singapore's biggest ride-hailing app. Learn how JustGrab, GrabCar and GrabTaxi work, what a Grab ride costs, the 2026 platform fee and how it compares with Gojek and MRT.",
    lede: "Grab is the Singapore-headquartered “super app” for rides, food delivery and payments. For getting around Singapore it's the most-used way to book a private-hire car or a taxi from your phone.",
    facts: [
      { label: "Type", value: "Ride-hailing, delivery and payments app" },
      { label: "Founded", value: "2012, as MyTeksi in Malaysia" },
      { label: "Headquarters", value: "Singapore" },
      { label: "Listed", value: "Nasdaq (GRAB)" },
      { label: "Ride types in SG", value: "JustGrab, GrabCar, GrabTaxi/GrabCab, GrabCar Premium, larger 6-seaters, GrabHitch" },
      { label: "Platform fee", value: "S$1.20 per ride from 1 Jan 2026" },
    ],
    org: { legalName: "Grab Holdings Limited", url: "https://www.grab.com/sg/", foundingDate: "2012", sameAs: ["https://en.wikipedia.org/wiki/Grab_Holdings"] },
    sections: [
      {
        heading: "Grab in a nutshell",
        paragraphs: [
          "Grab started in 2012 as MyTeksi, a taxi-booking app in Kuala Lumpur, and moved its headquarters to Singapore in 2014. It now runs ride-hailing, food and grocery delivery (GrabFood, GrabMart), parcel delivery (GrabExpress) and the GrabPay wallet across Southeast Asia.",
          "In Singapore, Grab is the largest ride-hailing platform. You can book private-hire cars, metered taxis (GrabCab) and carpools (GrabHitch) in the same app, and pay by card, GrabPay or cash for some rides.",
        ],
      },
      {
        heading: "Which Grab ride should I book?",
        list: [
          "JustGrab — matches you with the nearest private-hire car or taxi at a fixed upfront fare. Usually the quickest to get.",
          "GrabCar — private-hire cars only, fixed fare shown before you book.",
          "GrabTaxi / GrabCab — a metered taxi booked through the app; the fare follows the taxi meter plus booking fee.",
          "GrabCar Premium — newer, larger cars for a higher fare.",
          "6-seater options — for groups or luggage, e.g. airport runs.",
          "GrabHitch — a carpool with a driver already heading your way; cheaper but less predictable.",
        ],
      },
      {
        heading: "How much does Grab cost in Singapore?",
        paragraphs: [
          "Grab shows a fixed upfront fare for private-hire rides. It is based on distance, expected travel time and demand, so the same trip costs more during the morning and evening peaks, in heavy rain or late at night.",
          "On top of the ride fare, Grab charges a platform fee. Grab raised it from S$0.90 to S$1.20 per ride from 1 January 2026 to cover higher CPF contributions for drivers under the Platform Workers Act. In 2026 Grab also added a temporary fuel surcharge (S$0.90 per trip from April, later extended), which goes to drivers. Check the fare breakdown in the app for the fees on your trip.",
          "As a rough guide, a 5 km trip off-peak is usually S$10–14 and a 15 km cross-island trip around S$22–30, more at peak. Use our planner for an estimate on your exact route.",
        ],
      },
    ],
    pros: [
      "Largest pool of drivers, so the shortest waits in most places",
      "Fixed upfront fares for private-hire rides",
      "One app for rides, food, groceries and payments, with GrabRewards points",
    ],
    cons: [
      "Surge pricing at peak hours and in bad weather",
      "Platform fee and surcharges add S$1–2 to every ride",
      "Usually dearer than Gojek or TADA for the same trip off-peak",
    ],
    steps: [
      "Download the Grab app and sign up with your mobile number.",
      "Enter your pick-up point and destination, and compare ride types.",
      "Check the upfront fare and fee breakdown, choose a payment method, then book.",
      "Match the car plate number before you get in; rate the trip after.",
    ],
    faqs: [
      { q: "What is Grab in Singapore?", a: "Grab is a Singapore-headquartered app for booking private-hire cars and taxis, ordering food and groceries, sending parcels and paying with GrabPay. It is the largest ride-hailing platform in Singapore." },
      { q: "How much is the Grab platform fee in 2026?", a: "Grab's platform fee for rides in Singapore is S$1.20 per trip from 1 January 2026, up from S$0.90. Temporary fuel surcharges may also apply; the app shows every fee before you book." },
      { q: "Is Grab cheaper than a taxi?", a: "Off-peak, a JustGrab or GrabCar fare is often similar to a metered taxi for short trips and can be cheaper for longer ones. At peak times surge pricing can make Grab dearer, so it's worth comparing with a metered GrabCab or the MRT." },
      { q: "Is Grab or Gojek cheaper in Singapore?", a: "Gojek is often a little cheaper than Grab for the same route, especially with promo codes, while Grab usually has shorter waiting times because it has more drivers. Compare both in our Travelling in Singapore planner." },
      { q: "Can I pay Grab with cash in Singapore?", a: "Cash is accepted for some ride types, but most riders pay by card or GrabPay. You choose the payment method before booking." },
    ],
    sources: [
      { label: "Grab Singapore", url: "https://www.grab.com/sg/" },
      { label: "Grab platform fee to rise 30 cents from 1 Jan 2026 (Malay Mail / The Straits Times)", url: "https://www.malaymail.com/news/singapore/2025/12/24/grab-to-raise-ride-platform-fee-in-singapore-adding-30-cents-from-jan-1/203067" },
      { label: "Grab raises fuel surcharge to S$0.90 per trip (Mothership)", url: "https://mothership.sg/2026/03/grab-temporarily-raise-fuel-surcharge-price-volatility/" },
      { label: "Grab Holdings — Wikipedia", url: "https://en.wikipedia.org/wiki/Grab_Holdings" },
    ],
    updated: UPDATED,
  },
  {
    slug: "what-is-gojek",
    id: "gojek",
    name: "Gojek",
    emoji: "🟩",
    color: "#00880F",
    kind: "Ride-hailing",
    title: "What is Gojek? Singapore Rides, Fares & Grab Comparison",
    h1: "What is Gojek?",
    description: "Gojek is an Indonesian ride-hailing app that runs GoCar rides in Singapore. See how Gojek works, typical fares, how it compares with Grab, and the latest on the Grab–GoTo merger talks.",
    lede: "Gojek is a ride-hailing app from Indonesia, part of the GoTo Group. In Singapore it offers private-hire car rides and is the second-biggest alternative to Grab, often a little cheaper.",
    facts: [
      { label: "Type", value: "Ride-hailing app" },
      { label: "Founded", value: "2010 in Jakarta, Indonesia" },
      { label: "Parent", value: "GoTo Group (Gojek + Tokopedia, formed 2021)" },
      { label: "In Singapore since", value: "Late 2018 (beta), full launch early 2019" },
      { label: "Ride types in SG", value: "GoCar, with larger and premium car options in the app" },
      { label: "Payment", value: "Card or cash, plus in-app promos" },
    ],
    org: { legalName: "PT GoTo Gojek Tokopedia Tbk", url: "https://www.gojek.com/sg", foundingDate: "2010", sameAs: ["https://en.wikipedia.org/wiki/Gojek"] },
    sections: [
      {
        heading: "Gojek in a nutshell",
        paragraphs: [
          "Gojek began in Jakarta in 2010 as a call centre for motorcycle taxis (ojek) and became an app in 2015. In Indonesia it is a super app for rides, food delivery and payments. In 2021 Gojek merged with e-commerce company Tokopedia to form the GoTo Group.",
          "In Singapore, Gojek focuses on car rides: you book a private-hire car (GoCar) in the app at an upfront fare. It doesn't offer motorbike taxis here, which aren't allowed in Singapore.",
        ],
      },
      {
        heading: "How much does Gojek cost in Singapore?",
        paragraphs: [
          "Like Grab, Gojek shows a fixed upfront fare based on distance, time and demand, plus a platform fee. Prices rise at peak hours and in the rain. For the same trip Gojek is often a dollar or two cheaper than Grab off-peak, and promo codes are common.",
          "Waiting times can be a little longer than Grab's in some neighbourhoods because the driver pool is smaller, so it's worth checking both apps when you're in a hurry.",
        ],
      },
      {
        heading: "Will Gojek merge with Grab?",
        paragraphs: [
          "Grab and GoTo have held merger talks on and off for years; reports in late 2025 put a possible deal at about US$7 billion. Any deal affecting Singapore would be reviewed by the Competition and Consumer Commission of Singapore (CCCS). Until then, Gojek keeps operating separately in Singapore.",
        ],
      },
    ],
    pros: [
      "Often cheaper than Grab for the same route, with frequent promo codes",
      "Upfront fixed fares and a simple app",
      "Seen as a driver-friendly platform by many drivers",
    ],
    cons: [
      "Fewer drivers than Grab, so waits can be longer",
      "Rides only in Singapore — no food or parcel delivery here",
      "Future uncertain while merger talks with Grab continue",
    ],
    steps: [
      "Download the Gojek app and register with your phone number.",
      "Set your pick-up and drop-off points and pick a GoCar option.",
      "Apply any promo code, check the upfront fare and book.",
      "Check the car plate and driver name before getting in.",
    ],
    faqs: [
      { q: "What is Gojek in Singapore?", a: "Gojek is a ride-hailing app from Indonesia's GoTo Group. In Singapore you can use it to book private-hire car rides (GoCar) at an upfront fixed fare." },
      { q: "Is Gojek cheaper than Grab?", a: "For many routes Gojek is slightly cheaper than Grab, particularly off-peak and with promo codes. Grab usually has more drivers and shorter waits. Prices change with demand, so compare both before booking." },
      { q: "Does Gojek have motorbike taxis in Singapore?", a: "No. Motorbike taxis aren't allowed in Singapore, so Gojek only offers car rides here." },
      { q: "Is Gojek merging with Grab?", a: "Grab and GoTo, Gojek's parent, have discussed a merger for years, with talks reported to have accelerated in late 2025. A deal would need regulatory review, including by Singapore's CCCS. Gojek still operates independently in Singapore." },
      { q: "Can I pay Gojek with cash?", a: "Yes, Gojek in Singapore accepts cash as well as credit and debit cards." },
    ],
    sources: [
      { label: "Gojek Singapore", url: "https://www.gojek.com/sg" },
      { label: "Gojek and Tokopedia merge to form GoTo Group (TechCrunch)", url: "https://techcrunch.com/2021/05/16/gojek-and-tokopedia-merge-to-form-goto-group" },
      { label: "Grab vs GoJek vs Be: 2026 comparison and merger outlook (Digital in Asia)", url: "https://digitalinasia.com/grab-vs-gojek-vs-be/" },
      { label: "Gojek — Wikipedia", url: "https://en.wikipedia.org/wiki/Gojek" },
    ],
    updated: UPDATED,
  },
  {
    slug: "what-is-getgo",
    id: "getgo",
    name: "GetGo",
    emoji: "🟠",
    color: "#F26B21",
    kind: "Car-sharing",
    title: "What is GetGo? Singapore Car Sharing Rates & How It Works",
    h1: "What is GetGo?",
    description: "GetGo is Singapore's largest car-sharing service: rent a car by the hour from 1,700+ locations with no deposit. See GetGo rates, mileage charges, how booking works and when it beats Grab.",
    lede: "GetGo is a Singapore car-sharing app that lets you rent a car by the hour from a car park near you. You pick the car up and return it to the same spot, so it's built for round trips — IKEA runs, family outings or a few errands in one go.",
    facts: [
      { label: "Type", value: "Car-sharing (self-drive, hourly)" },
      { label: "Launched", value: "February 2021" },
      { label: "Fleet", value: "3,000+ cars at 1,700+ locations (June 2026)" },
      { label: "Model", value: "A-to-A: return to where you picked up" },
      { label: "Mileage", value: "About S$0.39–0.44/km petrol, S$0.29/km electric" },
      { label: "Sign-up", value: "Singpass MyInfo, no deposit or membership fee" },
    ],
    org: { url: "https://www.getgo.sg", foundingDate: "2021", address: "55 Ayer Rajah Crescent, Singapore 139949", sameAs: ["https://en.wikipedia.org/wiki/GetGo_(carsharing_company)"] },
    sections: [
      {
        heading: "GetGo in a nutshell",
        paragraphs: [
          "GetGo launched in February 2021 and grew quickly by putting cars in HDB and condo car parks across the island. As of mid-2026 it has more than 3,000 vehicles at over 1,700 locations, making it Singapore's largest car-sharing operator.",
          "You book in the app, unlock the car with your phone, and drive. Registration uses Singpass MyInfo, and GetGo doesn't charge a deposit or membership fee.",
        ],
      },
      {
        heading: "How much does GetGo cost?",
        paragraphs: [
          "You pay a time charge plus a mileage charge. Hourly rates depend on the car category and when you book: cheapest late at night and on weekday daytimes, highest in the evening and on weekends. Economy cars can cost just a few dollars an hour off-peak.",
          "Mileage is charged per kilometre — around S$0.39–0.44/km for petrol cars and S$0.29/km for electric cars — and a small booking fee applies. Petrol is included, but ERP and parking charges are on you. Daily rates cap the cost for longer rentals.",
          "Because you return the car to the start, GetGo makes most sense for round trips with stops. For a one-way ride, Grab, Gojek or Flexar is usually cheaper.",
        ],
      },
    ],
    pros: [
      "Cars in many HDB car parks, often a short walk away",
      "Pay by the hour, petrol included, no deposit",
      "Great for round trips with heavy shopping or several stops",
    ],
    cons: [
      "Must return the car to the same spot (no one-way trips)",
      "Mileage charge adds up on long drives",
      "You pay for ERP and parking, and an insurance excess applies if there's damage",
    ],
    steps: [
      "Download the GetGo app and sign up with Singpass MyInfo (you need a valid driving licence).",
      "Pick a nearby car, choose your start and end time, and book.",
      "Unlock the car in the app, check for damage and report it with photos.",
      "Drive, then park back at the same spot, lock the car in the app and end the trip.",
    ],
    faqs: [
      { q: "What is GetGo car sharing?", a: "GetGo is a Singapore car-sharing app that rents cars by the hour from car parks around the island. You book in the app, unlock with your phone, and return the car to the same location." },
      { q: "How much does GetGo cost per hour?", a: "GetGo's hourly rate depends on the car category and time of booking — lowest late at night and on weekday daytimes, higher in the evening and on weekends — plus a mileage charge of around S$0.39–0.44/km for petrol cars or S$0.29/km for EVs. Petrol is included." },
      { q: "Can I drop off a GetGo car somewhere else?", a: "No. GetGo is a point A-to-A service, so you return the car where you picked it up. For one-way trips, look at Flexar, which lets you drop off at another station." },
      { q: "Is there a deposit for GetGo?", a: "GetGo doesn't charge a deposit or membership fee. You sign up with Singpass MyInfo and a valid driving licence." },
      { q: "Is GetGo cheaper than Grab?", a: "For a quick one-way trip, Grab is usually cheaper. GetGo wins when you need a car for a few hours with several stops or a lot to carry, since one hourly booking covers the whole outing." },
    ],
    sources: [
      { label: "GetGo rates", url: "https://www.getgo.sg/rates" },
      { label: "GetGo — Wikipedia", url: "https://en.wikipedia.org/wiki/GetGo_(carsharing_company)" },
      { label: "GetGo car sharing in Singapore: 2026 cost guide (The Money Bees)", url: "https://themoneybees.co/blog/car-sharing-singapore-guide" },
      { label: "Best car sharing in Singapore 2026 (MoneySmart)", url: "https://blog.moneysmart.sg/transportation/car-sharing-singapore-guide/" },
    ],
    updated: UPDATED,
  },
  {
    slug: "what-is-flexar",
    id: "flexar",
    name: "Flexar",
    emoji: "🟣",
    color: "#5B3CC4",
    kind: "Car-sharing",
    title: "What is Flexar? Singapore One-Way Car Sharing (ex-BlueSG)",
    h1: "What is Flexar?",
    description: "Flexar is Singapore's point-to-point car-sharing service from the team behind BlueSG. Pick up a car at one station, drop it at another, pay by the minute with fuel included. Prices, areas and how it works.",
    lede: "Flexar is a one-way car-sharing service: you pick up a car at one Flexar station and drop it off at another, paying by the minute. It's run by BlueSG Pte Ltd and replaced the BlueSG electric car-sharing service in 2026.",
    facts: [
      { label: "Type", value: "Point-to-point car sharing (self-drive)" },
      { label: "Operator", value: "BlueSG Pte Ltd" },
      { label: "Launched", value: "Public beta 15 April 2026" },
      { label: "Network", value: "200+ cars at about 100 stations at launch" },
      { label: "Service area", value: "East, North-East and Central Singapore" },
      { label: "Pricing", value: "Per minute, first 5 minutes free; fuel, charging and CDW included" },
    ],
    org: { legalName: "BlueSG Pte Ltd", url: "https://www.flexar.com.sg", foundingDate: "2017", address: "48 Changi South Street 1, Singapore", sameAs: ["https://en.wikipedia.org/wiki/BlueSG"] },
    sections: [
      {
        heading: "Flexar in a nutshell",
        paragraphs: [
          "BlueSG ran Singapore's first electric car-sharing service from 2017. It paused the service in August 2025 and relaunched it as Flexar, with a public beta from 15 April 2026 and a mixed fleet of electric and petrol cars.",
          "Flexar keeps the one-way idea: book a car near you, drive, and park at any Flexar station near your destination — no need to bring it back. At its official launch it had over 200 vehicles across about 100 stations, starting in heartland towns such as Punggol, Sengkang, Hougang, Tampines, Ang Mo Kio and Toa Payoh.",
        ],
      },
      {
        heading: "How much does Flexar cost?",
        paragraphs: [
          "Flexar charges by the minute, and the rate depends on when your reservation starts. The first 5 minutes of every rental are free. Fuel, charging and collision damage waiver (CDW) are included, and there's no distance fee or subscription.",
          "Flexar's own example: a 30-minute ride starting at 6pm on a weekday costs S$15.99. After the first hour, pricing switches to hourly. A reservation is held free for 15 minutes, with extensions at S$1.50 per 10 minutes. A fuel or electricity surcharge may apply when market prices are high.",
        ],
      },
      {
        heading: "Who can use Flexar?",
        paragraphs: [
          "Drivers must be 18 or older with a valid Singapore driving licence. There's no deposit or membership fee, and verification happens in the app.",
        ],
      },
    ],
    pros: [
      "One-way trips: drop the car at a station near your destination",
      "Fuel, charging and CDW included, no mileage fee",
      "No deposit, membership or subscription; open to drivers from 18",
    ],
    cons: [
      "Only serves the East, North-East and Central regions for now",
      "You must start and end at a Flexar station, so add walking time",
      "Per-minute pricing gets expensive in heavy traffic",
    ],
    steps: [
      "Download the Flexar app and verify your identity and Singapore driving licence.",
      "Find a car at a nearby station and reserve it (held free for 15 minutes).",
      "Unlock the car with the app and drive — the first 5 minutes are free.",
      "Park at any Flexar station near your destination and end the rental in the app.",
    ],
    faqs: [
      { q: "What is Flexar?", a: "Flexar is a point-to-point car-sharing service in Singapore run by BlueSG Pte Ltd. You pick up a car at one Flexar station and drop it off at another, paying by the minute." },
      { q: "Is Flexar the same as BlueSG?", a: "Flexar is operated by BlueSG Pte Ltd and replaced the BlueSG service, which paused in August 2025. Flexar launched its public beta on 15 April 2026 with a mixed fleet of electric and petrol cars." },
      { q: "How much does Flexar cost?", a: "Flexar charges per minute, with the first 5 minutes free and fuel, charging and CDW included. Flexar's example is S$15.99 for a 30-minute ride starting at 6pm on a weekday; rates depend on the start time." },
      { q: "Where can I use Flexar?", a: "Flexar currently serves the East, North-East and Central regions of Singapore. You must pick up and drop off at Flexar stations." },
      { q: "What age do you need to be to drive Flexar?", a: "You need to be at least 18 with a valid Singapore driving licence." },
    ],
    sources: [
      { label: "Flexar pricing", url: "https://www.flexar.com.sg/pricing" },
      { label: "BlueSG relaunches as Flexar, testing from 15 April (Mothership)", url: "https://mothership.sg/2026/04/flexar-beta-phase-testing-apr-15/" },
      { label: "Flexar officially launches with over 200 vehicles (Mustsharenews)", url: "https://mustsharenews.com/flexar-official-launch/" },
      { label: "Flexar (BlueSG) — Wikipedia", url: "https://en.wikipedia.org/wiki/BlueSG" },
    ],
    updated: UPDATED,
  },
];

export const getProvider = (slug: string) => PROVIDERS.find(p => p.slug === slug);
