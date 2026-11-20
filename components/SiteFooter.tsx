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
      ["/automobile#coe", "Latest COE results"],
      ["/automobile#events", "Car events in Singapore"],
      ["/commute", "Grab vs Gojek vs MRT prices"],
      ["/about", "About SGliving"],
      ["/privacy", "Privacy Policy"],
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
