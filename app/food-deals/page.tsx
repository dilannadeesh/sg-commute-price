import FoodDealsClient from "./FoodDealsClient";
import SeoBlock from "@/components/seo/SeoBlock";
import { getFoodDeals } from "@/lib/dealsData";

// Deals are rendered on the server so search engines see them in the HTML.
// Refreshed nightly by the /api/*/refresh cron (cache tag) and at most every 24h.
export const revalidate = 86400;

export default async function Page() {
  const initial = await getFoodDeals();
  return (
    <>
      <FoodDealsClient initial={initial} />
      <SeoBlock page="food" />
    </>
  );
}
