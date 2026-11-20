import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import { pageMeta } from "@/lib/seo";

const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export const metadata: Metadata = pageMeta({
  path: "/privacy",
  title: "Privacy Policy",
  description: "How SGliving uses cookies, Google Analytics and Google AdSense advertising, and the choices you have — including opting out of personalised ads.",
});

export default function PrivacyPage() {
  return (
    <div className="cpc-app">
      <NavBar />
      <article className="lx-detail" style={{ maxWidth: 780 }}>
        <h1 className="lx-detail-title">Privacy Policy</h1>
        <p className="lx-muted">Last updated: 20 November 2026</p>

        <section className="lx-block">
          <h2>Who we are</h2>
          <p>SGliving (sgliving.life) is a free guide to deals, shopping malls, hotels and motoring in Singapore. We don&apos;t require you to create an account, and we don&apos;t ask for your name, email or payment details to use the site.</p>
        </section>

        <section className="lx-block">
          <h2>Information collected automatically</h2>
          <p>Like most websites, our hosting provider (Vercel) records basic technical information such as your IP address, browser type and the pages you request, to keep the site secure and running.</p>
          <p>We use Google Analytics to understand how the site is used — for example which pages are popular. Google Analytics uses cookies and collects data such as approximate location, device type and pages visited. You can opt out with the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics opt-out browser add-on</a>.</p>
          <p>If you allow location access on the Commute page, your location is used in your browser to estimate ride prices and is not stored by us.</p>
        </section>

        <section className="lx-block">
          <h2>Advertising</h2>
          <p>We use Google AdSense to show ads, which helps keep SGliving free. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites.</p>
          <p>Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the internet. You can opt out of personalised advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>, or opt out of some third-party vendors&apos; use of cookies for personalised advertising at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</p>
          <p>Learn more about <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">how Google uses data when you use partners&apos; sites</a>. Visitors in the EEA, UK and Switzerland are asked for consent before personalised ads are shown.</p>
        </section>

        <section className="lx-block">
          <h2>Third-party content and links</h2>
          <p>Deal listings link to the original promotions on retailer, airline and Telegram pages. Some pages show photos from Wikipedia / Wikimedia Commons and map tiles from OpenStreetMap. Those sites have their own privacy policies.</p>
        </section>

        <section className="lx-block">
          <h2>Your choices</h2>
          <p>You can block or delete cookies in your browser settings. The site still works without cookies, though ads may be less relevant.</p>
        </section>

        <section className="lx-block">
          <h2>Contact</h2>
          <p>{CONTACT ? <>Questions about this policy? Email <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</> : <>Questions about this policy? Contact us through the details on our <a href="/about">About page</a>.</>}</p>
        </section>
      </article>
    </div>
  );
}
