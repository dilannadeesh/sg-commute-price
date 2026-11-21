// "New driver in Singapore" guides. Facts are checked against the sources listed on each page
// (Traffic Police / MHA first, then reputable media). Keep `updated` current when editing.

export type ArticleSlug = "singapore-driving-rules" | "how-to-get-driving-licence-singapore" | "practical-driving-test-tips";

export interface Block {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  ordered?: boolean;
  table?: { caption?: string; head: string[]; rows: string[][] };
  callout?: { tone: "info" | "warn"; text: string };
}

export interface Article {
  slug: ArticleSlug;
  emoji: string;
  card: string;            // card title on home/hub
  cardSub: string;
  title: string;           // <title>
  h1: string;
  description: string;
  lede: string;
  keyFacts: { label: string; value: string }[];
  blocks: Block[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  updated: string;
}

const UPDATED = "2026-11-21";

export const ARTICLES: Article[] = [
  {
    slug: "singapore-driving-rules",
    emoji: "🚦",
    card: "Latest Singapore driving rules",
    cardSub: "2026 speeding penalties, the 2027 demerit points shake-up, new drink-driving and phone laws",
    title: "Singapore Driving Rules 2026–2027: New Penalties & Demerit Points",
    h1: "Latest Singapore driving rules (2026–2027)",
    description: "What changed for Singapore drivers: heavier speeding penalties from 1 Jan 2026, stricter demerit points (DIPS) from 1 Jan 2027, lower drink-driving limits and the new phone-holding offence.",
    lede: "Singapore has tightened its road rules more in 2026 than in any year in recent memory. Here's what's already in force, what starts on 1 January 2027, and what's been passed but is still waiting for a start date — explained for new and experienced drivers.",
    keyFacts: [
      { label: "Speeding (up to 20 km/h over)", value: "6 points + S$200 since 1 Jan 2026" },
      { label: "First suspension threshold", value: "24 → 18 points from 1 Jan 2027" },
      { label: "New driver licence revoked at", value: "13 → 12 points from 1 Jan 2027" },
      { label: "Breath alcohol limit", value: "35 → 15 µg/100ml (passed, start date TBA)" },
      { label: "Holding a phone while moving", value: "Becomes an offence (start date TBA)" },
      { label: "P plate", value: "Display for your first year of driving" },
    ],
    blocks: [
      {
        heading: "1. Heavier speeding penalties (in force since 1 January 2026)",
        paragraphs: [
          "From 1 January 2026, the Ministry of Home Affairs raised both the demerit points and composition fines for every speeding band. Even a small excess — up to 20 km/h over the limit — now costs 6 demerit points and S$200 for a car, up from 4 points and S$150. Speeding by more than 40 km/h isn't compounded: you're prosecuted in court.",
          "Penalties are also higher for speeding, beating red lights and failing to give way to pedestrians inside Friendly Streets (school and silver zone areas).",
        ],
        table: {
          caption: "Speeding penalties for light vehicles (cars) from 1 January 2026",
          head: ["Over the speed limit by", "Demerit points", "Composition fine (car)"],
          rows: [
            ["Up to 20 km/h", "6", "S$200"],
            ["21–30 km/h", "8", "S$300"],
            ["31–40 km/h", "12", "S$400"],
            ["41–50 km/h", "18", "Prosecution in court"],
            ["More than 50 km/h", "24 (18 from 1 Jan 2027)", "Prosecution in court"],
          ],
        },
      },
      {
        heading: "2. Stricter demerit points (DIPS) from 1 January 2027",
        paragraphs: [
          "On 31 July 2026 the Traffic Police announced the biggest change to the Driver Improvement Points System in years, citing a rise in traffic deaths and violations. It takes effect on 1 January 2027.",
        ],
        table: {
          head: ["Rule", "Until 31 Dec 2026", "From 1 Jan 2027"],
          rows: [
            ["First suspension (non-probationary)", "24 points in 24 months", "18 points in 24 months"],
            ["Length of first suspension", "12 weeks", "4 months"],
            ["Probationary (new) driver licence revoked at", "13 points", "12 points"],
            ["Offences that carry 24 points (e.g. >50 km/h over, reckless or dangerous driving)", "24 points", "18 points"],
            ["DIPS Retraining Course", "Shortens suspension to 1 or 4 weeks", "Once only, at first suspension: 4 months cut to 6 weeks"],
            ["Safe Driving Course (expunges 4 points)", "Offer letters stopped 1 Aug 2026", "Discontinued"],
          ],
        },
        callout: { tone: "info", text: "One-time adjustment: on 1 January 2027, up to 6 points are deducted from non-probationary drivers' balances and up to 1 point from probationary drivers', so nobody is pushed closer to the new thresholds overnight." },
      },
      {
        heading: "3. Lower drink-driving limits and a phone-holding offence (passed, start date to be announced)",
        paragraphs: [
          "Parliament passed the Road Traffic (Miscellaneous Amendments) Bill on 4 August 2026, and it became law on 24 August 2026. It comes into force on a date the Minister will announce, so the old rules still apply until then.",
        ],
        list: [
          "Breath alcohol limit cut from 35 to 15 microgrammes per 100 ml of breath; blood alcohol limit cut from 80 to 30 mg per 100 ml of blood. In practice: if you drive, don't drink at all.",
          "Simply holding a phone (or another mobile device) while the vehicle is moving becomes an offence — police won't need to prove you were using it. A phone fixed in a holder for navigation is still allowed.",
          "A new offence of driving with specified drugs in your blood, and a new offence of purposeful endangerment for people who deliberately use a vehicle to endanger others.",
          "Higher penalties for dangerous and careless driving causing grievous hurt.",
          "Traffic Police can use handheld breathalysers for evidence, and cameras or videos submitted by the public to enforce some offences.",
        ],
      },
      {
        heading: "4. Higher driving test fees (from 13 March 2026)",
        paragraphs: ["Traffic Police test fees were raised for the first time since 2016, in stages. The fee depends on when you book the test."],
        table: {
          head: ["Test", "Before", "13 Mar 2026", "13 Mar 2027", "13 Mar 2028"],
          rows: [
            ["Basic / Final Theory Test (BTT, FTT), Riding Theory Test", "S$6.50", "S$7.20", "S$8.00", "—"],
            ["Practical driving / riding test", "S$33", "S$40", "S$45", "S$50"],
          ],
        },
        callout: { tone: "warn", text: "Work Permit and S Pass holders who converted a foreign licence to Class 3C/3CA must now pass a road assessment at SSDC before they can learn for a Class 4 licence. Failing it revokes the 3C/3CA licence for a year." },
      },
      {
        heading: "Everyday rules every new driver should know",
        list: [
          "Display P plates (red triangle on yellow) at the top right of the front and rear windscreens for your first year of driving. Not displaying them can mean a fine the first time and losing your licence the next.",
          "During your probation year your licence is revoked at 13 demerit points (12 from 1 January 2027) — one serious speeding offence can be enough.",
          "Everyone in the car must wear a seat belt, and children shorter than 1.35 m need an approved child restraint or booster seat.",
          "Single yellow line: no parking 7am–7pm except Sundays and public holidays. Double yellow line: no parking at any time.",
          "Bus lanes: normal bus lanes (yellow) operate on weekday peak hours; full-day bus lanes (red) run from 7.30am to 11pm, Monday to Saturday. Check the time plate on the road.",
          "Turn on your headlights from 7pm to 7am and whenever visibility is poor, such as heavy rain.",
          "Slow down in School Zones and Silver Zones, which have lower speed limits and higher penalties.",
          "Using a mobile phone while driving is already an offence today; mount it and use voice or hands-free.",
        ],
      },
    ],
    faqs: [
      { q: "What are the new speeding fines in Singapore?", a: "Since 1 January 2026, speeding by up to 20 km/h costs 6 demerit points and S$200 for a car; 21–30 km/h is 8 points and S$300; 31–40 km/h is 12 points and S$400. Speeding by more than 40 km/h leads to prosecution in court and 18 or more demerit points." },
      { q: "How many demerit points before my licence is suspended in Singapore?", a: "Until 31 December 2026, a non-probationary driver is suspended at 24 points within 24 months. From 1 January 2027 the threshold drops to 18 points, and the first suspension lengthens from 12 weeks to four months." },
      { q: "What happens to new drivers with demerit points?", a: "New drivers are on probation for a year. If they collect 13 or more demerit points in that year their licence is revoked; from 1 January 2027 the limit is 12 points. They then have to retake the tests." },
      { q: "What is the new drink-driving limit in Singapore?", a: "Parliament has passed a lower limit of 15 microgrammes of alcohol per 100 ml of breath (from 35) and 30 mg per 100 ml of blood (from 80). It takes effect on a date still to be announced; until then the old limits apply. The safest rule is not to drink at all if you're driving." },
      { q: "Is it illegal to hold your phone while driving in Singapore?", a: "Using a phone while driving is already an offence. Under the amended Road Traffic Act passed in August 2026, merely holding a phone while the vehicle is moving will also be an offence once the law comes into force. A phone fixed in a holder for navigation is allowed." },
      { q: "How long do I need to display P plates in Singapore?", a: "New drivers must display probationary (P) plates for one year after getting their licence, at the top right of the front and rear windscreens." },
    ],
    sources: [
      { label: "MHA — Enhanced penalties for speeding offences (19 Dec 2025)", url: "https://www.mha.gov.sg/media-room/newsroom/enhanced-penalties-for-speeding-offences-2025/" },
      { label: "SPF — Tightening of the Driver Improvement Points System (31 Jul 2026)", url: "https://www.police.gov.sg/media-hub/news/2026/07/20260731_tightening_of_the_driver_improvement_points" },
      { label: "MHA — Second reading of the Road Traffic (Miscellaneous Amendments) Bill (4 Aug 2026)", url: "https://www.mha.gov.sg/media-room/newsroom/second-reading-of-the-road-traffic-miscelleanous-amendments-bill/" },
      { label: "Singapore Statutes Online — Road Traffic (Miscellaneous Amendments) Act 2026", url: "https://sso.agc.gov.sg/Acts-Supp/18-2026/Published/20260908?DocDate=20260908" },
      { label: "SPF — Revised test fees and mandatory road assessment for Class 3C/3CA (13 Mar 2026)", url: "https://www.police.gov.sg/media-hub/news/2026/03/20260313_revised_test_fees_and_mandatory_road_assessment_for_class_3c_3ca_license" },
      { label: "SPF — Penalties for traffic offences", url: "https://www.police.gov.sg/Knowledge-Hub/Traffic/Traffic-Matters/Penalties-for-Traffic-Offences" },
    ],
    updated: UPDATED,
  },
  {
    slug: "how-to-get-driving-licence-singapore",
    emoji: "🪪",
    card: "How to get a Singapore driving licence",
    cardSub: "Step-by-step: BTT, PDL, lessons, FTT and the TP test — plus 2026 fees and converting a foreign licence",
    title: "How to Get a Driving Licence in Singapore (2026): Steps & Costs",
    h1: "How to get a driving licence in Singapore",
    description: "Step-by-step guide to a Singapore Class 3/3A driving licence in 2026: eligibility, BTT, Provisional Driving Licence, lessons, FTT, practical test, official fees, total cost and foreign licence conversion.",
    lede: "Getting a Singapore car licence takes three tests — two theory, one practical — plus lessons in between. Most learners take a few months and spend roughly S$1,700–S$3,000 in total, but only about S$140 of that is government fees.",
    keyFacts: [
      { label: "Minimum age", value: "18" },
      { label: "Theory tests", value: "BTT + FTT, 50 questions each, pass at 45" },
      { label: "Theory test fee", value: "S$7.20 (S$8 from 13 Mar 2027)" },
      { label: "Provisional Driving Licence", value: "S$25, valid 2 years" },
      { label: "Practical test fee", value: "S$40 (S$45 from 13 Mar 2027)" },
      { label: "Licence fee", value: "S$50" },
    ],
    blocks: [
      {
        heading: "Which licence do you need?",
        list: [
          "Class 3A — automatic cars only. The most popular choice; fewer lessons to learn.",
          "Class 3 — manual and automatic cars (up to 3,000 kg unladen, up to 7 passengers).",
          "Class 2B — motorcycles up to 200cc, with its own Riding Theory Test.",
        ],
        paragraphs: ["You must be at least 18, physically and mentally fit, and pass an eyesight and colour-vision check when you enrol."],
      },
      {
        heading: "Driving school or private instructor?",
        paragraphs: [
          "Singapore has three driving centres: Bukit Batok Driving Centre (BBDC), ComfortDelGro Driving Centre (CDC) in Ubi and Singapore Safety Driving Centre (SSDC) in Woodlands. A school gives you a structured course, circuit practice and test slots at the same centre, at a higher price — practical lessons there cost about S$77–S$90 per 100-minute session in 2026.",
          "A private instructor is usually cheaper per hour and more flexible, but you book tests yourself at a centre and may need extra circuit practice there before the test.",
        ],
      },
      {
        heading: "Step by step",
        ordered: true,
        list: [
          "Enrol with a driving centre (or register as a private learner) and do the eyesight test.",
          "Study the official Basic Theory of Driving handbook and take practice tests — try our free BTT mock exam.",
          "Book and pass the Basic Theory Test (BTT): 50 multiple-choice questions, pass with 45 correct.",
          "Apply for your Provisional Driving Licence (PDL) online with Singpass. It costs S$25, is valid for two years, and is required before any practical lesson.",
          "Take practical lessons with your school or a private instructor, always displaying L plates.",
          "Pass the Final Theory Test (FTT) — also 50 questions with a 90% pass mark. After the FTT you have two years to pass the practical test.",
          "Complete any simulator or revision lessons your school requires, then book the Traffic Police practical test.",
          "Pass the practical test: a circuit section followed by a road section. You fail on one immediate failure or 20 demerit points.",
          "Pay the S$50 licence fee and get your Qualified Driving Licence. Display P plates for your first year.",
        ],
      },
      {
        heading: "How much does a Singapore driving licence cost in 2026?",
        table: {
          head: ["Item", "Who charges it", "Cost"],
          rows: [
            ["Basic Theory Test (BTT)", "Traffic Police", "S$7.20 (S$8 from 13 Mar 2027) + centre admin fee"],
            ["Final Theory Test (FTT)", "Traffic Police", "S$7.20 (S$8 from 13 Mar 2027) + centre admin fee"],
            ["Provisional Driving Licence (PDL)", "Traffic Police", "S$25, valid 2 years"],
            ["Practical lessons", "School or private instructor", "About S$77–S$90 per 100-min lesson at a school"],
            ["Practical driving test", "Traffic Police", "S$40 (S$45 from 13 Mar 2027, S$50 from 13 Mar 2028)"],
            ["Qualified Driving Licence", "Traffic Police", "S$50"],
            ["Typical total, Class 3/3A", "—", "About S$1,700–S$3,000, mostly lessons"],
          ],
        },
      },
      {
        heading: "Converting a foreign driving licence",
        paragraphs: [
          "Foreigners living in Singapore for no more than 12 months can drive on a valid foreign licence (with an International Driving Permit or official English translation if it isn't in English). Permanent residents, foreigners living here for over 12 months, and Work Permit or S Pass holders employed as drivers must convert to a Singapore licence; new citizens and PRs can use their foreign licence for only three months.",
          "To convert, you pass the BTT in Singapore, complete Traffic Police's online Foreign Licence Pre-assessment, then book an appointment. Work Permit and S Pass holders receive a Class 3C/3CA licence rather than Class 3/3A.",
        ],
      },
    ],
    faqs: [
      { q: "How long does it take to get a driving licence in Singapore?", a: "Most learners take three to six months from enrolment to licence, depending on lesson availability and test slots. You need to pass the BTT, get a Provisional Driving Licence, take lessons, pass the FTT and then the practical test." },
      { q: "How much does it cost to get a driving licence in Singapore?", a: "Expect about S$1,700–S$3,000 in total for a Class 3 or 3A licence in 2026. Government fees are only around S$140 (BTT and FTT S$7.20 each, PDL S$25, practical test S$40, licence S$50); the rest is lessons and centre charges." },
      { q: "What is the difference between Class 3 and Class 3A?", a: "Class 3A lets you drive automatic cars only, while Class 3 covers both manual and automatic cars. Most new drivers choose 3A because it's quicker to learn." },
      { q: "How long is the Provisional Driving Licence valid?", a: "A PDL is valid for two years and costs S$25. You need a valid PDL for every practical lesson and for the practical test." },
      { q: "Can I drive in Singapore with a foreign licence?", a: "Yes, if you've lived in Singapore for no more than 12 months and your licence is valid (with an IDP or translation if it isn't in English). After that, or if you become a PR or citizen, you must convert it by passing the BTT and applying to the Traffic Police." },
      { q: "How many questions are in the BTT?", a: "The Basic Theory Test has 50 multiple-choice questions and you need at least 45 correct (90%) to pass. Practise with our free BTT mock exam." },
    ],
    sources: [
      { label: "SPF — Revised test fees from 13 March 2026", url: "https://www.police.gov.sg/media-hub/news/2026/03/20260313_revised_test_fees_and_mandatory_road_assessment_for_class_3c_3ca_license" },
      { label: "SPF — Traffic matters: converting a foreign licence", url: "https://www.police.gov.sg/advisories/traffic/traffic-matters" },
      { label: "SPF e-Services — Foreign driving licence conversion", url: "https://eservices1.police.gov.sg/phub/eservices/landingpage/foreign-driving-licence-conversion" },
      { label: "Driving licence in Singapore — Wikipedia", url: "https://en.wikipedia.org/wiki/Driving_licence_in_Singapore" },
      { label: "TestHub — Driving licence cost Singapore 2026", url: "https://testhub.sg/tptest/cost-of-getting-driving-licence-singapore-2026" },
      { label: "SteerClear — Singapore driving licence cost 2026", url: "https://www.steerclear.io/sg/cost-of-driving-licence-singapore" },
    ],
    updated: UPDATED,
  },
  {
    slug: "practical-driving-test-tips",
    emoji: "🚗",
    card: "Practical test best practices",
    cardSub: "How the TP test is marked, the immediate failures to avoid and tips to pass first time",
    title: "Singapore Practical Driving Test Tips: Pass the TP Test First Time",
    h1: "Practical driving test (TP test): best practices to pass",
    description: "How Singapore's Traffic Police practical driving test is marked, the immediate failures that end your test, common demerit-point mistakes and proven tips to pass the circuit and road test first time.",
    lede: "The Traffic Police practical test has two parts — a circuit and a road drive — and two ways to fail: one immediate failure, or 20 demerit points. Most failures come from a handful of avoidable habits. Here's how to stay clear of them.",
    keyFacts: [
      { label: "You fail with", value: "1 immediate failure, or 20+ demerit points" },
      { label: "Highest passing score", value: "18 points (points come in steps of 2)" },
      { label: "Test fee", value: "S$40 (S$45 from 13 Mar 2027)" },
      { label: "Bring", value: "Valid PDL and FTT pass" },
      { label: "First-time pass rate (CDC, 3A)", value: "About 4 in 10" },
      { label: "After FTT", value: "Pass within 2 years" },
    ],
    blocks: [
      {
        heading: "How the test works",
        paragraphs: [
          "You start in the test centre's circuit, where the tester checks set exercises such as the S-course and crank course, parallel and vertical parking, the slope, directional change and an emergency stop. If you rack up 20 points in the circuit, the test usually ends there. If not, you drive out onto public roads, where the tester checks observation, lane discipline, speed, junctions and how you deal with other road users.",
          "Mistakes are marked on the Traffic Police assessment checklist. Most carry demerit points in steps of two, so 18 is the highest score that still passes. Some are immediate failures that end your chances regardless of points.",
        ],
      },
      {
        heading: "Immediate failures to avoid",
        list: [
          "Mounting the kerb in the circuit or on the road.",
          "Not stopping fully at a stop line — including in the circuit where there's no STOP sign.",
          "Beating a red light or disobeying a mandatory or prohibitory sign.",
          "Exceeding the speed limit, including the circuit's limits.",
          "Not giving way to pedestrians at a crossing, or to traffic that has right of way.",
          "Changing lanes without due care, or driving across the centre line.",
          "Not stopping within the set distance in the emergency stop.",
          "Any situation where the tester has to brake or steer for you.",
        ],
      },
      {
        heading: "10 best practices to pass first time",
        ordered: true,
        list: [
          "Exaggerate every safety check. Turn your head, not just your eyes, for mirrors and blind spots before moving off, changing lanes, turning and reversing.",
          "Follow mirror – signal – blind spot – manoeuvre every time, even when the road looks empty.",
          "Come to a complete stop at every stop line and count a beat before moving off.",
          "Keep well under the speed limit in the circuit and on the road; it's an immediate failure, not just points.",
          "Practise on your test centre's circuit and nearby routes so nothing surprises you.",
          "Book a warm-up or revision lesson just before the test to settle your nerves.",
          "Adjust your seat, mirrors and seat belt before starting — and readjust mirrors after parking exercises.",
          "Keep a safe following distance and position correctly before turning.",
          "If you make a mistake, don't panic. One error rarely fails you — the next rushed decision often does.",
          "Know your weak exercises (parallel parking, slope, crank course) and drill them with your instructor.",
        ],
      },
      {
        heading: "What to bring on test day",
        list: [
          "Your valid Provisional Driving Licence (PDL) and FTT pass result — without them the tester will reject the test.",
          "Your NRIC or passport, glasses if you need them, and arrive early for the briefing.",
        ],
        callout: { tone: "info", text: "Failed? You can re-book. Many learners pass on the second try after targeting the specific items on their checklist — keep the sheet and work through every ticked box with your instructor." },
      },
    ],
    faqs: [
      { q: "How many demerit points can you get in the Singapore driving test?", a: "You fail if you collect 20 or more demerit points, or commit any one immediate failure. Points come in steps of two, so 18 is the highest score that still passes." },
      { q: "What are immediate failures in the TP test?", a: "Examples include mounting the kerb, not stopping fully at a stop line, beating a red light, speeding, failing to give way to pedestrians or traffic with right of way, changing lanes without due care, driving across the centre line and needing the tester to brake or steer." },
      { q: "What is the pass rate for the Singapore driving test?", a: "Pass rates vary by centre. For Class 3A at ComfortDelGro Driving Centre, Traffic Police data for August 2025 to July 2026 showed about 39% passing on the first attempt." },
      { q: "How much is the practical driving test in Singapore?", a: "The Traffic Police practical test costs S$40 for tests booked from 13 March 2026, rising to S$45 from 13 March 2027 and S$50 from 13 March 2028. Driving centres also charge for the test-day car and admin." },
      { q: "What should I bring to my practical driving test?", a: "Bring your valid Provisional Driving Licence and FTT pass result, plus your identification. Without a valid PDL and FTT pass, the tester will not let you take the test." },
    ],
    sources: [
      { label: "SPF — Revised test fees from 13 March 2026", url: "https://www.police.gov.sg/media-hub/news/2026/03/20260313_revised_test_fees_and_mandatory_road_assessment_for_class_3c_3ca_license" },
      { label: "BTT.sg — Every immediate failure in the Singapore practical test", url: "https://www.btt.sg/en/blog/immediate-failures-singapore-practical-driving-test" },
      { label: "BTT.sg — CDC Class 3A TP test guide", url: "https://www.btt.sg/en/tp-test/cdc/class-3a" },
      { label: "SSDC — Class 3/3A course", url: "https://ssdcl.com.sg/courses/class-3-3a-course/" },
      { label: "Budget Direct — 10 tips for the practical driving test", url: "https://www.budgetdirect.com.sg/car-insurance/articles/10-tips-practical-driving-test" },
    ],
    updated: UPDATED,
  },
];

export const getArticle = (slug: string) => ARTICLES.find(a => a.slug === slug);

export const BTT_CARD = {
  href: "/new-driver/btt-mock-test",
  emoji: "📝",
  card: "BTT mock exam",
  cardSub: "Free 50-question practice test with a timer, your score and every wrong answer explained",
};
