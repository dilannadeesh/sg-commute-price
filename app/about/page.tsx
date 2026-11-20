import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { pageMeta } from "@/lib/seo";

const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export const metadata: Metadata = pageMeta({
  path: "/about",
  title: "About Us",
  description: "SGliving is a free, independent Singapore guide to everyday deals, shopping malls, hotels, COE results and ride prices. Here's where our information comes from.",
});

export default function AboutPage() {
  return (
    <div className="cpc-app">
      <NavBar />
      <article className="lx-detail" style={{ maxWidth: 780 }}>
        <h1 className="lx-detail-title">About SGliving</h1>
        <p className="lx-detail-lede">A free, independent guide to getting more out of everyday life in Singapore.</p>

        <section className="lx-block">
          <h2>What you&apos;ll find here</h2>
          <ul className="lx-steps" style={{ listStyle: "disc" }}>
            <li><Link href="/food-deals">Food</Link>, <Link href="/supermarket-deals">supermarket</Link>, <Link href="/electronics-deals">electronics</Link> and <Link href="/airline-deals">airline</Link> deals, gathered in one place.</li>
            <li>Guides to <Link href="/malls">shopping malls</Link> by region, with how to get there by MRT.</li>
            <li><Link href="/hotels">Hotels</Link> from budget to 5-star, with typical prices and access tips.</li>
            <li>The latest <Link href="/automobile">COE results and car events</Link>.</li>
            <li>A <Link href="/commute">commute price comparison</Link> for Grab, Gojek, TADA and public transport.</li>
          </ul>
        </section>

        <section className="lx-block">
          <h2>Where our information comes from</h2>
          <p>COE results come from the Land Transport Authority&apos;s open data on data.gov.sg. Mall and hotel photos come from Wikipedia / Wikimedia Commons. Hotel prices are typical published rates, and mall shop breakdowns are estimates — we label these clearly. Deals link to the original promotion so you can check the latest terms before you buy.</p>
        </section>

        <section className="lx-block">
          <h2>How SGliving is funded</h2>
          <p>SGliving is free to use and supported by advertising. Ads are clearly separated from our content, and advertisers don&apos;t influence which deals or places we list. See our <Link href="/privacy">Privacy Policy</Link> for how ads and cookies work.</p>
        </section>

        <section className="lx-block">
          <h2>Contact</h2>
          <p>{CONTACT ? <>Spotted a mistake, or want a deal or place added? Email <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</> : <>Spotted a mistake, or want a deal or place added? Let us know — we read every message.</>}</p>
        </section>
      </article>
    </div>
  );
}
