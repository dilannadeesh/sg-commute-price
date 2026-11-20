import HomeClient from "./HomeClient";

// Homepage-only structured data. Kept out of the root layout so other pages
// don't end up with two FAQPage blocks (Search Console flags duplicates).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is SGliving?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving is a free Singapore deals hub that aggregates daily food deals, supermarket promotions, electronics sales and cheap flights from Changi Airport — all updated automatically every night. You can also compare commute prices across Grab, TADA, Gojek, Flexar, GetGo and public transport.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I find the best deals in Singapore today?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving aggregates Singapore deals across four categories: Food Deals (restaurant promos, 1-for-1s), Supermarket Deals (NTUC FairPrice, Cold Storage, Giant, Sheng Siong), Electronics Deals (Harvey Norman, Courts, Best Denki) and Airline Deals (cheap flights from Changi). Everything is updated nightly and completely free.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I find Singapore food deals today?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving's Food Deals page aggregates the latest Singapore restaurant promotions, 1-for-1 offers and discount codes — updated daily and searchable by cuisine or category.",
      },
    },
    {
      "@type": "Question",
      name: "Which supermarkets have promotions in Singapore this week?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving's Supermarket Deals page tracks weekly sales and promotions from NTUC FairPrice, Cold Storage, Giant, Sheng Siong, Don Don Donki and Guardian — updated every night.",
      },
    },
    {
      "@type": "Question",
      name: "How can I find cheap flights from Singapore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SGliving's Airline Deals page shows current flash sales and promo fares departing from Singapore Changi Airport — Scoot, AirAsia, Jetstar, Singapore Airlines and more, updated daily.",
      },
    },
    {
      "@type": "Question",
      name: "How much does Grab cost in Singapore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Grab in Singapore starts at around S$3.40 base fare, with S$0.85 per km and S$0.22 per minute. Peak-hour surge can add 1.3× to 1.5× to the fare. Use SGliving's commute comparison to compare Grab against TADA, Gojek and public transport for your route.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <HomeClient />
    </>
  );
}
