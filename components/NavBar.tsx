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
        <Link href="/"                   className={"cpc-nav-tab" + (pathname === "/"                         ? " is-active" : "")}>Home</Link>
        <Link href="/food-deals"         className={"cpc-nav-tab" + (pathname.startsWith("/food-deals")       ? " is-active" : "")}>Food Deals</Link>
        <Link href="/supermarket-deals"  className={"cpc-nav-tab" + (pathname.startsWith("/supermarket-deals")? " is-active" : "")}>Supermarket</Link>
        <Link href="/electronics-deals"  className={"cpc-nav-tab" + (pathname.startsWith("/electronics-deals")? " is-active" : "")}>Electronics</Link>
        <Link href="/airline-deals"      className={"cpc-nav-tab" + (pathname.startsWith("/airline-deals")    ? " is-active" : "")}>Airline Deals</Link>
        <Link href="/weekend"            className={"cpc-nav-tab" + (pathname.startsWith("/weekend")          ? " is-active" : "")}>Weekend</Link>
      </div>
    </nav>
  );
}
