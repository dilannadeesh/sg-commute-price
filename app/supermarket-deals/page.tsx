import type { Metadata } from "next";
import SupermarketDealsClient from "./SupermarketDealsClient";
import SeoBlock from "@/components/seo/SeoBlock";
import { getSupermarketDeals } from "@/lib/dealsData";

// Deals are rendered on the server so search engines see them in the HTML.
// Refreshed nightly by the /api/*/refresh cron (cache tag) and at most every 24h.
export const revalidate = 86400;

// An empty deal page is thin content — keep it out of Google's index until deals return.
export async function generateMetadata(): Promise<Metadata> {
  const { deals } = await getSupermarketDeals();
  return deals.length > 0 ? {} : { robots: { index: false, follow: true } };
}

export default async function Page() {
  const initial = await getSupermarketDeals();
  return (
    <>
      <SupermarketDealsClient initial={initial} />
      <SeoBlock page="supermarket" />
    </>
  );
}
