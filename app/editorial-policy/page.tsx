import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { pageMeta } from "@/lib/seo";

const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export const metadata: Metadata = pageMeta({
  path: "/editorial-policy",
  title: "Editorial Policy",
  description: "How SGliving chooses deals, sources data, checks facts and keeps pages up to date — and how advertising is kept separate from what we publish.",
});

export default function EditorialPolicy() {
  return (
    <div className="cpc-app">
      <NavBar />
      <article className="lx-detail guide">
        <h1 className="lx-detail-title">Editorial Policy</h1>
        <p className="guide-byline">SGliving Editorial Team · Last updated 20 November 2026</p>
        <div className="guide-body">
          <p>SGliving helps people in Singapore save money and get around. This page explains where our information comes from, how we check it, and how we keep it current.</p>

          <h2>Where our information comes from</h2>
          <ul>
            <li><strong>Deals</strong> are collected from public Singapore deal channels (such as SG Food Deals, SG Travel Promos and SG Tech &amp; Games) and link back to the original post or retailer so you can check the latest terms.</li>
            <li><strong>COE results</strong> come from the Land Transport Authority&apos;s official open data on data.gov.sg.</li>
            <li><strong>Mall and hotel guides</strong> are written by our team using official sources, with photos, coordinates and store or room counts from Wikipedia and Wikimedia Commons.</li>
            <li><strong>Fare estimates</strong> come from our own fare model, based on published base fares, distance and typical peak-hour surge.</li>
          </ul>

          <h2>How we keep it accurate and current</h2>
          <ul>
            <li>Deal pages refresh every night; older deals drop off automatically.</li>
            <li>COE, mall, hotel and event pages refresh weekly.</li>
            <li>Estimates are labelled as estimates — for example typical hotel rates, shop-category breakdowns and ride fares.</li>
            <li>We never show made-up or sample deals. If a section has no current deals, we say so.</li>
            <li>Every guide shows when it was last updated.</li>
          </ul>

          <h2>Advertising and independence</h2>
          <p>SGliving is free and supported by advertising through Google AdSense. Ads are clearly separate from our content. Advertisers and retailers don&apos;t pay to be listed and don&apos;t see or approve what we publish.</p>

          <h2>Corrections</h2>
          <p>{CONTACT
            ? <>Spotted something wrong or out of date? Email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> and we&apos;ll fix it.</>
            : <>Spotted something wrong or out of date? Let us know through our <Link href="/about">About page</Link> and we&apos;ll fix it.</>}
          </p>
          <p>See also our <Link href="/about">About page</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>
        </div>
      </article>
    </div>
  );
}
