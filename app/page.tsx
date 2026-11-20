import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import HomeSections from "@/components/lifestyle/HomeSections";
import SeoBlock from "@/components/seo/SeoBlock";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { getFoodDeals, getSupermarketDeals, getElectronicsDeals, getAirlineDeals } from "@/lib/dealsData";

// Deal previews refresh nightly; malls / hotels / automobile sections weekly (cron + cache tags).
export const revalidate = 86400;

export const metadata: Metadata = pageMeta({
  path: "/",
  title: { absolute: "SGliving: Singapore Deals Today, Malls, Hotels & COE" },
  description:
    "Today's best Singapore deals — food 1-for-1s, supermarket promos, electronics sales and cheap flights from Changi — plus mall, hotel and COE guides.",
  socialTitle: "SGliving — Singapore Deals, Malls, Hotels & COE",
});

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SGliving",
  url: SITE_URL,
  description:
    "Singapore's daily deals hub — food deals, supermarket promotions, electronics sales and cheap flights, plus commute price comparison.",
  applicationCategory: "ShoppingApplication",
  operatingSystem: "Web",
  inLanguage: "en-SG",
  offers: { "@type": "Offer", price: "0", priceCurrency: "SGD" },
  featureList: [
    "Daily Singapore food deals and restaurant promotions — 1-for-1 offers, promo codes",
    "Singapore supermarket deals — NTUC FairPrice, Cold Storage, Giant, Sheng Siong, Don Don Donki",
    "Singapore electronics deals — Harvey Norman, Courts, Best Denki, Challenger, Gain City",
    "Singapore airline deals — cheap flights from Changi, Scoot, AirAsia, Jetstar, SIA",
    "Singapore commute price comparison — Grab, TADA, Gojek, Flexar, GetGo, MRT/bus",
    "Deals updated nightly via automated aggregation",
    "Search and filter by category, store, tag or keyword",
  ],
};

export default async function HomePage() {
  const [food, supermarket, electronics, airline] = await Promise.all([
    getFoodDeals(), getSupermarketDeals(), getElectronicsDeals(), getAirlineDeals(),
  ]);
  const previews = {
    food: food.deals.slice(0, 3),
    supermarket: supermarket.deals.slice(0, 3),
    electronics: electronics.deals.slice(0, 3),
    airline: airline.deals.slice(0, 3),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <HomeClient lifestyle={<HomeSections />} previews={previews} />
      <SeoBlock page="home" />
    </>
  );
}
