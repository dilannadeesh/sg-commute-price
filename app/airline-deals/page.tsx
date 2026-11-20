import type { Metadata } from "next";
import AirlineDealsClient from "./AirlineDealsClient";
import SeoBlock from "@/components/seo/SeoBlock";
import { getAirlineDeals } from "@/lib/dealsData";

// Deals are rendered on the server so search engines see them in the HTML.
// Refreshed nightly by the /api/*/refresh cron (cache tag) and at most every 24h.
export const revalidate = 86400;

// An empty deal page is thin content — keep it out of Google's index until deals return.
export async function generateMetadata(): Promise<Metadata> {
  const { deals } = await getAirlineDeals();
  return deals.length > 0 ? {} : { robots: { index: false, follow: true } };
}

export default async function Page() {
  const initial = await getAirlineDeals();
  return (
    <>
      <AirlineDealsClient initial={initial} />
      <SeoBlock page="airline" />
    </>
  );
}
