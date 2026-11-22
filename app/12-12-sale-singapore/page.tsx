import SaleEventPage from "@/components/sale/SaleEventPage";

// Deal caches refresh nightly (cache tags); the 6-hour revalidate keeps the countdown line current.
export const revalidate = 21600;

export default function TwelveTwelvePage() {
  return <SaleEventPage eventKey="twelvetwelve" />;
}
