"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="cpc-nav">
      <div className="cpc-nav-brand-row">
        <Link href="/" className="cpc-nav-brand">SGliving</Link>
      </div>
      <div className="cpc-nav-tabs">
        <Link href="/"              className={"cpc-nav-tab" + (pathname === "/"                       ? " is-active" : "")}>Commute</Link>
        <Link href="/food-deals"    className={"cpc-nav-tab" + (pathname.startsWith("/food-deals")     ? " is-active" : "")}>Food Deals</Link>
        <Link href="/airline-deals" className={"cpc-nav-tab" + (pathname.startsWith("/airline-deals")  ? " is-active" : "")}>Airline Deals</Link>
        <Link href="/weekend"       className={"cpc-nav-tab" + (pathname.startsWith("/weekend")        ? " is-active" : "")}>Weekend</Link>
      </div>
    </nav>
  );
}
