import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SG Commute Price — Compare Grab, TADA, Gojek, Flexar, GetGo & Public Transport",
  description:
    "Compare commute costs across Singapore's transport platforms in real Singapore dollars, with peak-hour surge, Flexar station walks, and GetGo round-trip baked in.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
