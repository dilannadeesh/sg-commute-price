"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="cpc-nav">
      <Link
        href="/"
        style={{ font: "700 18px var(--font-sans)", color: "var(--color-ink)", letterSpacing: "-0.3px", textDecoration: "none" }}
      >
        SGliving
      </Link>
      <div className="cpc-nav-tabs">
        <Link
          href="/"
          className={"cpc-nav-tab" + (pathname === "/" ? " is-active" : "")}
        >
          Commute
        </Link>
        <Link
          href="/food-deals"
          className={"cpc-nav-tab" + (pathname.startsWith("/food-deals") ? " is-active" : "")}
        >
          Food Deals
        </Link>
      </div>
    </nav>
  );
}
