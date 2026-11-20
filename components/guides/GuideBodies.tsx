import Link from "next/link";
import { COE_CATS } from "@/lib/coe";
import { getCoeResults } from "@/lib/automobile";
import { PLATFORMS, priceFor, travelMinutes } from "@/lib/quote";
import { loadAllMalls } from "@/lib/malls";
import { HOTELS, TIERS } from "@/lib/hotels";
import { getEvent, formatEventDates } from "@/lib/automobile";

const sgd = (n: number) => `S$${n.toLocaleString("en-SG")}`;
const sgd2 = (n: number) => `S$${n.toFixed(2)}`;

/* ── COE bidding ────────────────────────────────────────────────────────── */
export async function CoeGuide() {
  const coe = await getCoeResults();
  return (
    <>
      <p>A Certificate of Entitlement (COE) is the licence you need to own a vehicle in Singapore. It lasts 10 years, it&apos;s sold through open bidding, and it often costs more than the car's own market value. Here&apos;s how the system works.</p>

      <h2>The five COE categories</h2>
      <table className="lx-table">
        <thead><tr><th>Category</th><th>Covers</th><th>Latest premium</th></tr></thead>
        <tbody>
          {COE_CATS.map(c => {
            const row = coe.latest.rows.find(r => r.category === c.key);
            return <tr key={c.slug}><td><Link href={`/coe/${c.slug}`}>{c.short}</Link></td><td>{c.covers}</td><td>{row ? sgd(row.premium) : "–"}</td></tr>;
          })}
        </tbody>
      </table>
      <p className="lx-muted">Latest results: {coe.latest.label}. See the <Link href="/coe">full COE price history</Link>.</p>

      <h2>How the bidding works</h2>
      <ol>
        <li><strong>LTA sets a quota</strong> for each category every quarter, based mainly on how many vehicles were deregistered.</li>
        <li><strong>Two bidding exercises are held each month.</strong> Bidding usually opens on a Monday at 12 noon and closes on Wednesday at 4pm, when results are announced.</li>
        <li><strong>Bidders name the most they&apos;re willing to pay</strong> and can revise their bid upwards while the exercise is open. Most buyers let their car dealer bid on their behalf as part of the car package.</li>
        <li><strong>Everyone pays the same price.</strong> The quota premium (QP) is the lowest successful bid, and every successful bidder in that category pays that amount — even if they bid more.</li>
      </ol>

      <h2>Why COE prices move so much</h2>
      <p>Premiums depend on supply and demand: a smaller quota or more buyers pushes prices up. Quotas shrink when fewer old vehicles are scrapped, and demand jumps around big events — LTA has warned that car shows can lift bidding. Category E (Open) can be used for any vehicle except motorcycles, so it usually tracks the higher of Cat A and Cat B.</p>

      <h2>Renewing a COE: what PQP means</h2>
      <p>When your COE expires you can deregister the vehicle or renew by paying the Prevailing Quota Premium (PQP) — a moving average of the quota premium over the latest three months. You can renew for 5 years (a one-time renewal) or 10 years (which can be renewed again).</p>

      <h2>Tips before you bid</h2>
      <ul>
        <li>Compare dealer packages with &ldquo;guaranteed COE&rdquo; against ones where you pay the actual premium — the guarantee is priced in.</li>
        <li>Check the trend for your category, not just the last result: <Link href="/coe/cat-a">Cat A</Link>, <Link href="/coe/cat-b">Cat B</Link>, <Link href="/coe/cat-e">Cat E</Link>.</li>
        <li>Car fairs like the <Link href="/automobile/singapore-motorshow-2027">Singapore Motorshow</Link> are a good time to compare packages.</li>
      </ul>
    </>
  );
}

/* ── Ride-hailing comparison ────────────────────────────────────────────── */
const TRIPS = [
  { label: "Short trip", km: 5, eg: "e.g. Tampines Mall → Bedok" },
  { label: "Medium trip", km: 12, eg: "e.g. Orchard → Jurong East" },
  { label: "Long trip", km: 22, eg: "e.g. Changi Airport → Orchard" },
];
const TIMES = [
  { label: "Off-peak (10am–12pm)", surge: 1.05 },
  { label: "Morning rush (8–10am)", surge: 1.5 },
  { label: "Late night (12–2am)", surge: 1.2 },
];

export function RideGuide() {
  const hail = PLATFORMS.filter(p => ["grab", "gojek", "tada"].includes(p.id));
  const transit = PLATFORMS.find(p => p.id === "publictransport")!;
  return (
    <>
      <p>Grab, Gojek and TADA all price rides from a base fare plus distance and time, then add surge when demand is high. The differences are small on short hops and grow on long trips and at rush hour. The tables below use SGliving&apos;s fare model — the same one behind our <Link href="/commute">fare checker</Link> — so treat them as estimates, not quotes.</p>

      {TIMES.map(t => (
        <section key={t.label}>
          <h2>{t.label}</h2>
          <table className="lx-table">
            <thead><tr><th>Trip</th>{hail.map(p => <th key={p.id}>{p.name}</th>)}<th>MRT / bus</th></tr></thead>
            <tbody>
              {TRIPS.map(trip => {
                const prices = hail.map(p => priceFor(p, trip.km, t.surge));
                const min = Math.min(...prices);
                return (
                  <tr key={trip.label}>
                    <td>{trip.label} ({trip.km} km)<br /><span className="lx-muted">{trip.eg}</span></td>
                    {prices.map((v, i) => <td key={hail[i].id}>{v === min ? <strong>{sgd2(v)}</strong> : sgd2(v)}</td>)}
                    <td>{sgd2(priceFor(transit, trip.km, 1))}<br /><span className="lx-muted">~{Math.round(travelMinutes(transit, trip.km))} min</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ))}
      <p className="lx-muted">Estimates in SGD from SGliving&apos;s fare model; cheapest ride-hailing option in bold. Actual fares vary with traffic, promotions, booking fees and live demand.</p>

      <h2>What the numbers show</h2>
      <ul>
        <li><strong>TADA tends to be cheapest</strong> in our model, with Gojek close behind and Grab slightly higher — but promotions and live surge regularly change the order, so it&apos;s worth checking two apps before you book.</li>
        <li><strong>Rush hour matters more than the app.</strong> The same 12 km ride can cost around 40% more between 8 and 10am than mid-morning.</li>
        <li><strong>MRT and bus win on price every time</strong> — a long cross-island trip still costs a couple of dollars, though it takes longer.</li>
      </ul>

      <h2>Tips to pay less</h2>
      <ul>
        <li>Shift your trip by 30–60 minutes outside the 7–10am and 5–8pm peaks if you can.</li>
        <li>Compare at least two apps — prices for the same route differ from minute to minute.</li>
        <li>For trips with several stops, car-sharing (Flexar, GetGo) can beat ride-hailing — compare in the <Link href="/commute">fare checker</Link>.</li>
      </ul>
    </>
  );
}

/* ── Changi Airport to city ─────────────────────────────────────────────── */
export function AirportGuide() {
  const km = 22;
  const hail = PLATFORMS.filter(p => ["grab", "gojek", "tada"].includes(p.id));
  const prices = hail.map(p => priceFor(p, km, 1.05));
  const lo = Math.min(...prices), hi = Math.max(...hail.map(p => priceFor(p, km, 1.5)));
  return (
    <>
      <p>Changi Airport sits at the eastern tip of Singapore, about 20 km from the city centre. You have four main options — here&apos;s how they compare.</p>

      <h2>1. MRT — cheapest</h2>
      <p>Changi Airport MRT station (CG2) is underneath Terminals 2 and 3, with a covered link to Jewel. Take the train to Tanah Merah, then change to a westbound East-West Line train towards the city — City Hall and Raffles Place are roughly 35–45 minutes away in total. Pay by contactless bank card or EZ-Link; the fare is a couple of dollars. Trains run from early morning until around midnight.</p>

      <h2>2. Public bus 36 — cheap, slower</h2>
      <p>Bus 36 runs from the airport terminals to the city via Marina Centre and Orchard Road. It takes longer than the MRT but drops you closer to many hotels, and costs about the same.</p>

      <h2>3. Grab, Gojek or TADA — door to door</h2>
      <p>A ride to the city takes around 20–30 minutes without traffic. Our fare model estimates about {sgd(Math.round(lo))} off-peak and up to around {sgd(Math.round(hi))} at rush hour for a 22 km trip. Pickup points are signposted at each terminal&apos;s arrival hall. <Link href="/guides/grab-vs-gojek-vs-tada">Which app is cheapest?</Link></p>

      <h2>4. Taxi — no app needed</h2>
      <p>Taxi queues are outside every arrival hall. Metered fares are similar to ride-hailing, plus an airport surcharge — it&apos;s the easiest option if you don&apos;t have a local data plan.</p>

      <h2>Got time? Visit Jewel</h2>
      <p><Link href="/malls/jewel-changi-airport">Jewel Changi Airport</Link> is connected to Terminals 1, 2 and 3. Its HSBC Rain Vortex waterfall and 280+ shops are worth a stop on arrival or before your flight.</p>

      <h2>Which should you pick?</h2>
      <table className="lx-table">
        <thead><tr><th>Option</th><th>Best for</th><th>Typical time to city</th></tr></thead>
        <tbody>
          <tr><td>MRT</td><td>Cheapest; light luggage</td><td>35–45 min</td></tr>
          <tr><td>Bus 36</td><td>Budget; hotels near Orchard or Marina Centre</td><td>About an hour</td></tr>
          <tr><td>Grab / Gojek / TADA</td><td>Groups, heavy luggage, late night</td><td>20–30 min</td></tr>
          <tr><td>Taxi</td><td>No app or data plan</td><td>20–30 min</td></tr>
        </tbody>
      </table>
      <p>Looking for somewhere to stay? See <Link href="/hotels">Singapore hotels by price</Link> or catch a <Link href="/airline-deals">cheap flight out of Changi</Link>.</p>
    </>
  );
}

/* ── Biggest malls ──────────────────────────────────────────────────────── */
export async function MallsGuide() {
  const malls = (await loadAllMalls()).sort((a, b) => b.storeCount - a.storeCount).slice(0, 12);
  return (
    <>
      <p>&ldquo;Biggest&rdquo; can mean floor area or number of shops. By floor area, <Link href="/malls/vivocity">VivoCity</Link> is Singapore&apos;s largest mall. By number of stores, the suburban giants lead — malls built around MRT and bus interchanges, packed with everyday shops and food. Here are the top 12 by store count.</p>
      <table className="lx-table">
        <thead><tr><th>#</th><th>Mall</th><th>Area</th><th>Stores</th><th>Nearest MRT</th></tr></thead>
        <tbody>
          {malls.map((m, i) => (
            <tr key={m.slug}>
              <td>{i + 1}</td><td><Link href={`/malls/${m.slug}`}>{m.name}</Link></td><td>{m.area} ({m.region})</td>
              <td>{m.storeCount}+</td><td>{m.mrt[0].name} {m.mrt[0].codes ? `(${m.mrt[0].codes})` : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="lx-muted">Store counts are approximate and include shops, restaurants and services; where Wikipedia lists an official figure we use it. Rechecked weekly.</p>

      {malls.slice(0, 5).map((m, i) => (
        <section key={m.slug}>
          <h2>{i + 1}. {m.name}</h2>
          <p>{m.about}</p>
          <p><strong>Getting there:</strong> {m.mrt[0].name} MRT — {m.mrt[0].access.toLowerCase()}. <Link href={`/malls/${m.slug}`}>Full {m.name} guide →</Link></p>
        </section>
      ))}

      <h2>Find a mall near you</h2>
      <p>Browse <Link href="/malls">all malls by region</Link> — <Link href="/malls#central">Central</Link>, <Link href="/malls#east">East</Link>, <Link href="/malls#west">West</Link>, <Link href="/malls#north">North</Link> and <Link href="/malls#north-east">North-East</Link> — and check this week&apos;s <Link href="/food-deals">food deals</Link> before you go.</p>
    </>
  );
}

/* ── Hotels near Marina Bay ─────────────────────────────────────────────── */
const MARINA = ["marina-bay-sands", "the-ritz-carlton-millenia-singapore", "the-fullerton-hotel-singapore", "raffles-hotel-singapore", "carlton-hotel-singapore"];
const NEARBY_VALUE = ["hotel-g-singapore", "ibis-singapore-on-bencoolen", "the-pod-beach-road"];

export function HotelsGuide() {
  const f1 = getEvent("singapore-grand-prix-2027");
  const row = (slug: string) => {
    const h = HOTELS.find(x => x.slug === slug)!;
    const tier = TIERS.find(t => t.id === h.tier)!;
    return (
      <tr key={slug}>
        <td><Link href={`/hotels/${h.slug}`}>{h.name}</Link></td><td>{tier.label.replace(/ hotels$/, "")}</td>
        <td>{sgd(h.priceFrom)}–{sgd(h.priceTo)}</td><td>{h.mrt[0].name} — {h.mrt[0].access.toLowerCase()}</td>
      </tr>
    );
  };
  return (
    <>
      <p>Marina Bay is Singapore&apos;s postcard view — the skyline, Gardens by the Bay, the Merlion and, every October, the Formula 1 night race. These hotels put you within walking distance of the bay. Prices are typical nightly rates for a standard room; they rise sharply on race weekend.</p>

      <h2>On the bay</h2>
      <table className="lx-table">
        <thead><tr><th>Hotel</th><th>Class</th><th>Typical / night</th><th>Nearest MRT</th></tr></thead>
        <tbody>{MARINA.map(row)}</tbody>
      </table>
      <ul>
        <li><strong>Marina Bay Sands</strong> — the rooftop infinity pool is the draw; it&apos;s directly above Bayfront MRT and The Shoppes.</li>
        <li><strong>The Ritz-Carlton, Millenia</strong> — famous for skyline views from the bathtub, a short walk from Promenade MRT.</li>
        <li><strong>The Fullerton Hotel</strong> — heritage building on the Singapore River, steps from Merlion Park.</li>
        <li><strong>Raffles Hotel</strong> — all-suite colonial landmark in the Civic District, ten minutes&apos; walk from the bay.</li>
      </ul>

      <h2>Better value a short walk away</h2>
      <table className="lx-table">
        <thead><tr><th>Hotel</th><th>Class</th><th>Typical / night</th><th>Nearest MRT</th></tr></thead>
        <tbody>{NEARBY_VALUE.map(row)}</tbody>
      </table>
      <p>Bugis and Bencoolen are one or two MRT stops from the bay and usually much cheaper, with plenty of food nearby.</p>

      {f1 && (
        <>
          <h2>Staying for the Singapore Grand Prix</h2>
          <p>The <Link href={`/automobile/${f1.slug}`}>{f1.name}</Link> runs {formatEventDates(f1)}. Hotels around the circuit sell out early and often require minimum stays, so book as soon as you have tickets. Some roads near the bay close during race week — MRT is the easiest way in and out.</p>
        </>
      )}

      <p>Compare more options in <Link href="/hotels">Singapore hotels by price</Link>, or see <Link href="/guides/changi-airport-to-city">how to get from Changi Airport to the city</Link>.</p>
    </>
  );
}
