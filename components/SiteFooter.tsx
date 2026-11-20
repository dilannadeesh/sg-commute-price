import Link from "next/link";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Deals",
    links: [
      ["/food-deals", "Food deals"],
      ["/supermarket-deals", "Supermarket promotions"],
      ["/electronics-deals", "Electronics sales"],
      ["/airline-deals", "Cheap flights from Singapore"],
      ["/weekend", "Things to do this weekend"],
    ],
  },
  {
    title: "Shopping malls",
    links: [
      ["/malls#central", "Central Singapore malls"],
      ["/malls#east", "East malls"],
      ["/malls#west", "West malls"],
      ["/malls#north", "North malls"],
      ["/malls#north-east", "North-East malls"],
    ],
  },
  {
    title: "Hotels & travel",
    links: [
      ["/hotels#5-star", "5-star hotels"],
      ["/hotels#4-star", "4-star hotels"],
      ["/hotels#3-star", "3-star hotels"],
      ["/hotels#budget", "Budget hotels"],
      ["/malls/jewel-changi-airport", "Jewel Changi Airport"],
    ],
  },
  {
    title: "Getting around",
    links: [
      ["/travel", "Singapore journey planner"],
      ["/travel/what-is-grab", "What is Grab?"],
      ["/travel/what-is-gojek", "What is Gojek?"],
      ["/travel/what-is-getgo", "What is GetGo?"],
      ["/travel/what-is-flexar", "What is Flexar?"],
      ["/coe", "COE prices & history"],
      ["/automobile#events", "Car events in Singapore"],
      ["/commute", "Grab vs Gojek vs MRT prices"],
    ],
  },
  {
    title: "Guides",
    links: [
      ["/guides/how-coe-bidding-works", "How COE bidding works"],
      ["/guides/grab-vs-gojek-vs-tada", "Grab vs Gojek vs TADA"],
      ["/guides/changi-airport-to-city", "Changi Airport to the city"],
      ["/guides/biggest-shopping-malls-singapore", "Biggest malls in Singapore"],
      ["/guides/hotels-near-marina-bay", "Hotels near Marina Bay"],
    ],
  },
  {
    title: "About",
    links: [
      ["/about", "About SGliving"],
      ["/editorial-policy", "Editorial policy"],
      ["/privacy", "Privacy Policy"],
      ["/guides", "All guides"],
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="site-footer-logo">SGliving</Link>
          <p>Singapore&apos;s guide to everyday deals, malls, hotels and getting around. Free, and refreshed every day.</p>
        </div>
        {COLUMNS.map(col => (
          <nav key={col.title} className="site-footer-col" aria-label={col.title}>
            <h2>{col.title}</h2>
            <ul>{col.links.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
          </nav>
        ))}
      </div>
      <p className="site-footer-legal">© {new Date().getFullYear()} SGliving · Made in Singapore 🇸🇬 · Prices in SGD</p>
    </footer>
  );
}
