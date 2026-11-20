import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist. Browse Singapore deals, malls, hotels and COE results on SGliving.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="cpc-app">
      <NavBar />
      <article className="lx-detail" style={{ maxWidth: 760, textAlign: "center", padding: "64px 16px" }}>
        <div style={{ fontSize: 56 }}>🧭</div>
        <h1 className="lx-detail-title">We couldn&apos;t find that page</h1>
        <p className="lx-detail-lede" style={{ margin: "0 auto 24px" }}>It may have moved, or the deal may have expired. Try one of these instead:</p>
        <nav className="lx-chips" aria-label="Popular pages">
          <Link href="/" className="lx-chip">Home</Link>
          <Link href="/food-deals" className="lx-chip">Food deals</Link>
          <Link href="/supermarket-deals" className="lx-chip">Supermarket promotions</Link>
          <Link href="/malls" className="lx-chip">Shopping malls</Link>
          <Link href="/hotels" className="lx-chip">Hotels</Link>
          <Link href="/automobile" className="lx-chip">COE results</Link>
        </nav>
      </article>
    </div>
  );
}
