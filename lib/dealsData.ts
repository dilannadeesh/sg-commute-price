import { unstable_cache } from "next/cache";
import type { Deal, AirlineDeal } from "./types";
import { GET as foodGET } from "@/app/api/deals/route";
import { GET as supermarketGET } from "@/app/api/supermarket-deals/route";
import { GET as electronicsGET } from "@/app/api/electronics-deals/route";
import { GET as airlineGET } from "@/app/api/airline-deals/route";
import { GET as weekendGET } from "@/app/api/weekend/route";

export interface DealsPayload<T> { deals: T[]; updatedAt: string; source: string }

// Server-side access to the same data the /api routes serve, cached for a day and tagged
// so the nightly refresh crons (revalidateTag) rebuild the pages with fresh deals.
function cached<T>(handler: () => Promise<Response>, key: string, tag: string) {
  return unstable_cache(
    async (): Promise<DealsPayload<T>> => {
      try {
        const data = (await (await handler()).json()) as DealsPayload<T>;
        return { deals: data.deals ?? [], updatedAt: data.updatedAt, source: data.source };
      } catch {
        return { deals: [], updatedAt: new Date().toISOString(), source: "unavailable" };
      }
    },
    [key],
    { revalidate: 86400, tags: [tag] },
  );
}

export const getFoodDeals        = cached<Deal>(foodGET, "ssr-food-deals-v1", "deals");
export const getSupermarketDeals = cached<Deal>(supermarketGET, "ssr-supermarket-deals-v1", "supermarket-deals");
export const getElectronicsDeals = cached<Deal>(electronicsGET, "ssr-electronics-deals-v1", "electronics-deals");
export const getAirlineDeals     = cached<AirlineDeal>(airlineGET, "ssr-airline-deals-v1", "airline-deals");
export const getWeekendDeals     = cached<Deal>(weekendGET, "ssr-weekend-v1", "weekend");
