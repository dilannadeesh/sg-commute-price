import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { Breadcrumbs, JsonLd } from "@/components/lifestyle/Cards";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { BTT_QUESTIONS } from "@/lib/newdriver/btt";
import { ARTICLES } from "@/lib/newdriver/articles";
import BttExam from "./BttExam";

const PATH = "/new-driver/btt-mock-test";

export const metadata: Metadata = pageMeta({
  path: PATH,
  title: "Free BTT Mock Test Singapore 2026: 50 Questions with Answers",
  description: "Take a free Singapore Basic Theory Test (BTT) mock exam: 50 questions in 50 minutes, 90% pass mark, instant marks and every wrong answer explained. Updated for 2026 road rules.",
});

const FAQS = [
  { q: "How many questions are in the Singapore BTT?", a: "The Basic Theory Test has 50 multiple-choice questions. You need at least 45 correct (90%) to pass." },
  { q: "How long is the BTT?", a: "Most centres give you 50 minutes for the 50 questions, about a minute per question. Our full mock exam uses the same 50-minute timer." },
  { q: "How much does the BTT cost?", a: "The Traffic Police fee is S$7.20 for tests booked from 13 March 2026, rising to S$8 from 13 March 2027. Driving centres add a small booking fee." },
  { q: "What topics does the BTT cover?", a: "Road signs and signals, road markings, right of way at junctions and crossings, safe driving practices, traffic rules and penalties, and what to do in emergencies — all from the official Basic Theory of Driving handbook." },
  { q: "Are these the real BTT questions?", a: "No. These are original SGliving practice questions written from Singapore's road rules to help you prepare. The official test draws from the Traffic Police question bank, so also study the Basic Theory of Driving handbook." },
  { q: "Do I need to pass the BTT to convert a foreign licence?", a: "Yes. Foreigners converting a foreign driving licence to a Singapore licence must pass the BTT first." },
];

export default function BttPage() {
  const url = `${SITE_URL}${PATH}`;
  const app = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SGliving BTT mock exam",
    url,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    inLanguage: "en-SG",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "SGD" },
    description: "Free Singapore Basic Theory Test practice exam with 50 timed questions, marks and explanations.",
    publisher: { "@type": "Organization", name: "SGliving", url: SITE_URL },
  };
  const quiz = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "Singapore Basic Theory Test (BTT) practice quiz",
    url,
    inLanguage: "en-SG",
    educationalLevel: "Beginner",
    about: { "@type": "Thing", name: "Singapore Basic Theory Test" },
    hasPart: BTT_QUESTIONS.slice(0, 10).map(q => ({
      "@type": "Question",
      eduQuestionType: "Multiple choice",
      text: q.q,
      suggestedAnswer: q.options.filter((_, i) => i !== q.answer).map(o => ({ "@type": "Answer", text: o })),
      acceptedAnswer: { "@type": "Answer", text: q.options[q.answer] },
    })),
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SGliving", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "New driver in Singapore", item: `${SITE_URL}/new-driver` },
      { "@type": "ListItem", position: 3, name: "BTT mock exam", item: url },
    ],
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="cpc-app">
      <NavBar />
      <JsonLd data={app} />
      <JsonLd data={quiz} />
      <JsonLd data={crumbs} />
      <JsonLd data={faq} />
      <main className="nd-page">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "New driver", href: "/new-driver" }, { label: "BTT mock exam" }]} />
        <header className="nd-hero">
          <span className="nd-kicker">📝 Free practice test</span>
          <h1>BTT mock exam (Singapore Basic Theory Test)</h1>
          <p>Practise for the Basic Theory Test under real conditions: 50 questions, 50 minutes, and you need 45 to pass. At the end you&apos;ll see your marks, a breakdown by topic and every wrong answer with the correct one explained.</p>
        </header>

        <BttExam />

        <section className="lx-block nd-after">
          <h2>About the Basic Theory Test</h2>
          <p>The BTT is the first test on the way to a Singapore driving licence, and the one foreigners take to convert a foreign licence. It&apos;s a computerised multiple-choice test taken at BBDC, CDC or SSDC, in English, Chinese, Malay or Tamil. Questions come from the Traffic Police&apos;s <em>Basic Theory of Driving</em> handbook: road signs, markings, rules of the road, right of way, safe driving and penalties.</p>
          <p>Passing lets you apply for your Provisional Driving Licence (S$25, valid two years) and start practical lessons.</p>
          <h2>BTT FAQs</h2>
          <div className="seo-faq">
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0}><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
          <nav className="seo-related" aria-label="More for new drivers">
            {ARTICLES.map(a => <Link key={a.slug} href={`/new-driver/${a.slug}`} className="lx-chip">{a.card}</Link>)}
          </nav>
        </section>
      </main>
    </div>
  );
}
