import WeekendClient from "./WeekendClient";
import SeoBlock from "@/components/seo/SeoBlock";
import { getWeekendDeals } from "@/lib/dealsData";

// Deals are rendered on the server so search engines see them in the HTML.
// Refreshed nightly by the /api/*/refresh cron (cache tag) and at most every 24h.
export const revalidate = 86400;

export default async function Page() {
  const initial = await getWeekendDeals();
  return (
    <>
      <WeekendClient initial={initial} />
      <SeoBlock page="weekend" />
    </>
  );
}
