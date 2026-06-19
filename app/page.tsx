"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import NavBar from "@/components/NavBar";
import type { PlanResponse, ItinerarySlot, TravelLeg } from "@/lib/types";
import { SG_AREAS } from "@/lib/quote";

// ── Constants ─────────────────────────────────────────────────────────────────

const DURATION_OPTIONS = [
  { label: "2h", value: 2 }, { label: "3h", value: 3 },
  { label: "4h", value: 4 }, { label: "6h", value: 6 },
  { label: "Full day", value: 8 },
];

const MEAL_OPTIONS = [
  { key: "breakfast", label: "Breakfast", emoji: "🍳" },
  { key: "brunch",    label: "Brunch",    emoji: "🥞" },
  { key: "lunch",     label: "Lunch",     emoji: "🍜" },
  { key: "dinner",    label: "Dinner",    emoji: "🌙" },
];

const CUISINE_OPTIONS = [
  { key: "western", label: "Western", emoji: "🍔" },
  { key: "chinese", label: "Chinese", emoji: "🥢" },
  { key: "indian",  label: "Indian",  emoji: "🍛" },
  { key: "malay",   label: "Malay",   emoji: "🥘" },
];

const ACTIVITY_OPTIONS = [
  { key: "outdoor", label: "Outdoor",  emoji: "🌿" },
  { key: "indoor",  label: "Indoor",   emoji: "🏛️" },
  { key: "museum",  label: "Museum",   emoji: "🎨" },
  { key: "beach",   label: "Beach",    emoji: "🏖️" },
  { key: "sports",  label: "Sports",   emoji: "⚽" },
  { key: "arts",    label: "Arts",     emoji: "🎭" },
  { key: "hiking",  label: "Hiking",   emoji: "🥾" },
  { key: "family",  label: "Family",   emoji: "👨‍👩‍👧" },
];

const KID_AGE_GROUPS = ["0–2", "3–6", "7–12", "13+"];

const LOADING_MESSAGES = [
  "Checking today's food deals…",
  "Browsing weekend activities…",
  "Clustering activities by area…",
  "Personalising for your group…",
  "Building your itinerary…",
  "Almost ready!",
];

const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 22; h++) {
  for (const m of [0, 30]) {
    if (h === 22 && m === 30) break;
    TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = "form" | "loading" | "result";

interface FormState {
  adults: number;
  kidAges: string[];
  startAreaId: string;
  startTime: string;
  durationHours: number;
  meals: string[];
  foodTypes: string[];
  activities: string[];
}

// ── Location combobox ─────────────────────────────────────────────────────────

function LocationCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [query, setQuery]         = useState("");
  const [open, setOpen]           = useState(false);
  const [highlighted, setHi]      = useState(0);
  const inputRef                  = useRef<HTMLInputElement>(null);
  const selectedArea              = SG_AREAS.find(a => a.id === value);

  const suggestions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return SG_AREAS.slice(0, 12);
    return SG_AREAS.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.region.toLowerCase().includes(q) ||
      a.id.replace(/-/g, " ").includes(q)
    ).sort((a, b) => {
      const aS = a.name.toLowerCase().startsWith(q) ? 0 : 1;
      const bS = b.name.toLowerCase().startsWith(q) ? 0 : 1;
      return aS - bS;
    }).slice(0, 10);
  }, [query]);

  function select(area: typeof SG_AREAS[0]) {
    onChange(area.id);
    setQuery(area.name);
    setOpen(false);
  }

  function clear() {
    onChange("");
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    if (value) onChange("");   // clear selection when user re-types
    setOpen(true);
    setHi(0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) { if (e.key === "ArrowDown" || e.key === "Enter") { e.preventDefault(); setOpen(true); } return; }
    if (e.key === "ArrowDown")  { e.preventDefault(); setHi(h => Math.min(h + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); }
    else if (e.key === "Enter")  { e.preventDefault(); if (suggestions[highlighted]) select(suggestions[highlighted]); }
    else if (e.key === "Escape") { setOpen(false); }
  }

  const displayValue = selectedArea ? selectedArea.name : query;

  return (
    <div className="planner-combobox">
      <div className="planner-combobox-wrap">
        <span className="planner-combobox-pin">📍</span>
        <input
          ref={inputRef}
          type="text"
          className="planner-combobox-input"
          placeholder="Search your area in Singapore…"
          value={displayValue}
          autoComplete="off"
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 160)}
          onKeyDown={handleKeyDown}
        />
        {(value || query) && (
          <button type="button" className="planner-combobox-clear" onClick={clear} aria-label="Clear">✕</button>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <ul className="planner-combobox-dropdown" role="listbox">
          {suggestions.map((area, i) => (
            <li
              key={area.id}
              role="option"
              aria-selected={area.id === value}
              className={
                "planner-combobox-option" +
                (i === highlighted    ? " is-hi"       : "") +
                (area.id === value    ? " is-selected" : "")
              }
              onMouseDown={() => select(area)}
              onMouseEnter={() => setHi(i)}
            >
              <span className="planner-combobox-name">{area.name}</span>
              <span className="planner-combobox-region">{area.region}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Loader ────────────────────────────────────────────────────────────────────

function PlannerLoader() {
  const [msgIdx, setMsgIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 700);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="planner-loader-wrap">
      <div className="planner-loader-rings">
        <div className="planner-ring planner-ring-1" />
        <div className="planner-ring planner-ring-2" />
        <div className="planner-ring planner-ring-3" />
        <span className="planner-loader-icon">🗓️</span>
      </div>
      <p className="planner-loader-msg" key={msgIdx}>{LOADING_MESSAGES[msgIdx]}</p>
      <p className="planner-loader-sub">Fetching real-time Singapore deals &amp; activities</p>
    </div>
  );
}

// ── Travel leg ────────────────────────────────────────────────────────────────

function TravelLegRow({ leg, label }: { leg: TravelLeg; label?: string }) {
  return (
    <div className="planner-travel-leg">
      <div className="planner-travel-arrow">↓</div>
      <div className="planner-travel-body">
        <span className="planner-travel-platform">{leg.platformName}</span>
        <span className="planner-travel-dot">·</span>
        <span className="planner-travel-time">{leg.minutes} min</span>
        <span className="planner-travel-dot">·</span>
        <span className="planner-travel-price">S${leg.price.toFixed(2)}</span>
        {leg.surgeLabel && <span className="planner-travel-surge"> · {leg.surgeLabel}</span>}
        {label && <span className="planner-travel-label"> — {label}</span>}
      </div>
    </div>
  );
}

// ── Slot card ─────────────────────────────────────────────────────────────────

function SlotCard({ slot }: { slot: ItinerarySlot }) {
  const isMeal = slot.type === "meal";
  const [imgFailed, setImgFailed] = useState(false);
  const MEAL_ICONS: Record<string, string> = { breakfast: "🍳", brunch: "🥞", lunch: "🍜", dinner: "🌙" };
  const placeholderIcon = isMeal ? (MEAL_ICONS[slot.mealType ?? ""] ?? "🍽️") : "🎯";

  return (
    <div className={"planner-slot-card" + (isMeal ? " planner-slot-meal" : " planner-slot-activity")}>
      {slot.imageUrl && !imgFailed ? (
        <div className="planner-slot-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slot.imageUrl} alt="" loading="lazy" onError={() => setImgFailed(true)} />
        </div>
      ) : (
        <div className="planner-slot-img-placeholder"><span>{placeholderIcon}</span></div>
      )}
      <div className="planner-slot-body">
        <div className="planner-slot-meta">
          <span className={"planner-slot-type-badge" + (isMeal ? " planner-badge-meal" : " planner-badge-act")}>
            {isMeal ? (slot.mealType ? slot.mealType.charAt(0).toUpperCase() + slot.mealType.slice(1) : "Meal") : "Activity"}
          </span>
          {slot.areaName && <span className="planner-slot-area">📍 {slot.areaName}</span>}
          {slot.dealBadge && <span className="planner-deal-badge">{slot.dealBadge}</span>}
          {slot.isRealDeal && <span className="planner-live-badge">Live deal</span>}
        </div>
        <p className="planner-slot-title">{slot.title}</p>
        <p className="planner-slot-excerpt">{slot.excerpt}</p>
        {slot.tags.filter(t => t !== "#deals").length > 0 && (
          <div className="planner-slot-tags">
            {slot.tags.filter(t => t !== "#deals").slice(0, 4).map(t => (
              <span key={t} className="deal-tag">{t}</span>
            ))}
          </div>
        )}
        <div className="planner-slot-footer">
          <span className="planner-slot-cost">~S${slot.estimatedCostPerPax}/pax</span>
          <div className="planner-slot-actions">
            {slot.telegramUrl && (
              <a href={slot.telegramUrl} target="_blank" rel="noopener noreferrer" className="planner-tg-link">Telegram ↗</a>
            )}
            <a href={slot.moreInfoUrl} target="_blank" rel="noopener noreferrer" className="deal-card-cta">More info →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Result ────────────────────────────────────────────────────────────────────

function fmt12h(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function ItineraryResult({ plan, form, onReset }: { plan: PlanResponse; form: FormState; onReset: () => void }) {
  const paxLabel =
    `${form.adults} adult${form.adults !== 1 ? "s" : ""}` +
    (form.kidAges.length > 0 ? ` + ${form.kidAges.length} kid${form.kidAges.length !== 1 ? "s" : ""}` : "");

  return (
    <div className="planner-result-wrap">
      <div className="planner-result-header">
        <div>
          <h2 className="planner-result-title">Your Singapore Day Plan ✨</h2>
          <p className="planner-result-sub">
            {paxLabel} · Starting {fmt12h(form.startTime)} · {form.durationHours === 8 ? "Full day" : `${form.durationHours}h`}
          </p>
        </div>
        <button onClick={onReset} className="planner-outline-btn">Plan another day</button>
      </div>

      <div className="planner-timeline">

        {/* Departure from home */}
        {plan.departureTravel && (
          <div className="planner-timeline-row planner-travel-row">
            <div className="planner-time-col">
              <div className="planner-time-label planner-time-home">🏠</div>
              <div className="planner-time-line" />
            </div>
            <div className="planner-timeline-content">
              <div className="planner-home-label">Leaving from {plan.startAreaName}</div>
              <TravelLegRow leg={plan.departureTravel} />
            </div>
          </div>
        )}

        {plan.itinerary.map((slot, i) => (
          <div key={i}>
            <div className="planner-timeline-row">
              <div className="planner-time-col">
                <div className="planner-time-label">{fmt12h(slot.time)}</div>
                {(i < plan.itinerary.length - 1 || slot.travelAfter || plan.returnTravel) && (
                  <div className="planner-time-line" />
                )}
              </div>
              <div className="planner-timeline-content">
                <SlotCard slot={slot} />
              </div>
            </div>
            {slot.travelAfter && (
              <div className="planner-timeline-row planner-travel-row">
                <div className="planner-time-col">
                  <div className="planner-time-line" />
                </div>
                <div className="planner-timeline-content">
                  <TravelLegRow leg={slot.travelAfter} />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Return home */}
        {plan.returnTravel && (
          <div className="planner-timeline-row planner-travel-row">
            <div className="planner-time-col">
              <div className="planner-time-label planner-time-home">🏠</div>
            </div>
            <div className="planner-timeline-content">
              <TravelLegRow leg={plan.returnTravel} label={`Back to ${plan.startAreaName}`} />
            </div>
          </div>
        )}
      </div>

      <div className="planner-cost-summary">
        <div className="planner-cost-eyebrow">Estimated spend</div>
        <div className="planner-cost-amount">S${plan.totalCostMin} – S${plan.totalCostMax}</div>
        <div className="planner-cost-breakdown">
          <span>Activities &amp; meals</span>
          {plan.totalTravelCost > 0 && (
            <span>Travel ~S${plan.totalTravelCost.toFixed(2)}</span>
          )}
        </div>
        <div className="planner-cost-sub">
          for {plan.pax} {plan.pax === 1 ? "person" : "people"} · including transport
        </div>
      </div>

      <div className="planner-result-footer">
        <button onClick={onReset} className="planner-generate-btn">Plan another day 🗓️</button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PlannerPage() {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>({
    adults: 2,
    kidAges: [],
    startAreaId: "",
    startTime: "10:00",
    durationHours: 4,
    meals: ["lunch"],
    foodTypes: [],
    activities: [],
  });
  const [plan, setPlan]   = useState<PlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const withKids = form.kidAges.length > 0;

  function toggleMeal(m: string) { setForm(f => ({ ...f, meals: f.meals.includes(m) ? f.meals.filter(x => x !== m) : [...f.meals, m] })); }
  function toggleFoodType(ft: string) { setForm(f => ({ ...f, foodTypes: f.foodTypes.includes(ft) ? f.foodTypes.filter(x => x !== ft) : [...f.foodTypes, ft] })); }
  function toggleActivity(a: string) { setForm(f => ({ ...f, activities: f.activities.includes(a) ? f.activities.filter(x => x !== a) : [...f.activities, a] })); }
  function toggleKidAge(age: string) { setForm(f => ({ ...f, kidAges: f.kidAges.includes(age) ? f.kidAges.filter(x => x !== age) : [...f.kidAges, age] })); }

  async function handleGenerate() {
    if (form.meals.length === 0 && form.activities.length === 0) return;
    setStep("loading");
    setError(null);
    try {
      const [res] = await Promise.all([
        fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }).then(async r => {
          if (!r.ok) throw new Error("api");
          return r.json() as Promise<PlanResponse>;
        }),
        new Promise<void>(r => setTimeout(r, 2500)),
      ]);
      setPlan(res);
      setStep("result");
    } catch {
      setError("Something went wrong. Please try again.");
      setStep("form");
    }
  }

  function reset() { setPlan(null); setStep("form"); setError(null); }

  return (
    <div className="cpc-app">
      <NavBar />

      {step === "loading" && <div className="planner-page"><PlannerLoader /></div>}

      {step === "result" && plan && (
        <div className="planner-page">
          <ItineraryResult plan={plan} form={form} onReset={reset} />
        </div>
      )}

      {step === "form" && (
        <div className="planner-page">
          <header className="planner-hero">
            <div className="cpc-hero-eyebrow">Free · personalised · real-time deals</div>
            <h1 className="cpc-hero-title">Plan Your Day<br />in Singapore</h1>
            <p className="cpc-hero-sub">
              Tell us who you&apos;re with, when you&apos;re heading out, and what you&apos;d love to do.
              We&apos;ll build a personalised itinerary with today&apos;s best live deals — including step-by-step travel costs.
            </p>
          </header>

          {error && <p className="planner-error">{error}</p>}

          <div className="planner-form-card">

            {/* Who's coming */}
            <div className="planner-section">
              <h3 className="planner-section-title">Who&apos;s coming?</h3>
              <div className="planner-section-row">
                <div className="planner-row-item">
                  <span className="planner-field-label">Adults</span>
                  <Counter value={form.adults} onChange={v => setForm(f => ({ ...f, adults: v }))} />
                </div>
                <div className="planner-row-item">
                  <span className="planner-field-label">With kids?</span>
                  <button type="button" className={"planner-toggle" + (withKids ? " is-active" : "")}
                    onClick={() => setForm(f => ({ ...f, kidAges: withKids ? [] : ["7–12"] }))}>
                    {withKids ? "Yes ✓" : "No"}
                  </button>
                </div>
              </div>
              {withKids && (
                <div className="planner-kid-ages">
                  <span className="planner-field-label">Kids&apos; ages (select all that apply)</span>
                  <div className="planner-chip-row">
                    {KID_AGE_GROUPS.map(age => (
                      <button key={age} type="button"
                        className={"planner-chip" + (form.kidAges.includes(age) ? " is-active" : "")}
                        onClick={() => toggleKidAge(age)}>
                        {age} yrs
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Start location */}
            <div className="planner-section">
              <h3 className="planner-section-title">Where are you starting from?</h3>
              <p className="planner-section-hint">We&apos;ll show step-by-step travel costs between every destination.</p>
              <LocationCombobox
                value={form.startAreaId}
                onChange={id => setForm(f => ({ ...f, startAreaId: id }))}
              />
            </div>

            {/* Timing */}
            <div className="planner-section">
              <h3 className="planner-section-title">When are you heading out?</h3>
              <div className="planner-section-row planner-timing-row">
                <div className="planner-row-item">
                  <span className="planner-field-label">Start time</span>
                  <select className="planner-select" value={form.startTime}
                    onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}>
                    {TIME_OPTIONS.map(t => {
                      const [h, m] = t.split(":").map(Number);
                      return <option key={t} value={t}>{h % 12 || 12}:{String(m).padStart(2, "0")} {h >= 12 ? "PM" : "AM"}</option>;
                    })}
                  </select>
                </div>
                <div className="planner-row-item planner-duration-item">
                  <span className="planner-field-label">How long?</span>
                  <div className="planner-chip-row">
                    {DURATION_OPTIONS.map(o => (
                      <button key={o.value} type="button"
                        className={"planner-chip" + (form.durationHours === o.value ? " is-active" : "")}
                        onClick={() => setForm(f => ({ ...f, durationHours: o.value }))}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Meals */}
            <div className="planner-section">
              <h3 className="planner-section-title">What would you like to eat?</h3>
              <p className="planner-section-hint">We&apos;ll match active food deals and suggest options near your activities.</p>
              <div className="planner-chip-row">
                {MEAL_OPTIONS.map(m => (
                  <button key={m.key} type="button"
                    className={"planner-chip" + (form.meals.includes(m.key) ? " is-active" : "")}
                    onClick={() => toggleMeal(m.key)}>
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisine — shown only when meals selected */}
            {form.meals.length > 0 && (
              <div className="planner-section planner-section-sub">
                <h3 className="planner-section-title">Preferred cuisine?</h3>
                <p className="planner-section-hint">Optional — leave blank to see all options. Multi-select welcome.</p>
                <div className="planner-chip-row">
                  {CUISINE_OPTIONS.map(c => (
                    <button key={c.key} type="button"
                      className={"planner-chip" + (form.foodTypes.includes(c.key) ? " is-active" : "")}
                      onClick={() => toggleFoodType(c.key)}>
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Activities */}
            <div className="planner-section planner-section-last">
              <h3 className="planner-section-title">What type of activities?</h3>
              <p className="planner-section-hint">Leave blank to discover all types. We&apos;ll cluster nearby destinations to minimise travel.</p>
              <div className="planner-chip-row">
                {ACTIVITY_OPTIONS.map(a => (
                  <button key={a.key} type="button"
                    className={"planner-chip" + (form.activities.includes(a.key) ? " is-active" : "")}
                    onClick={() => toggleActivity(a.key)}>
                    {a.emoji} {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="planner-cta-area">
            <button type="button" className="planner-generate-btn" onClick={handleGenerate}
              disabled={form.meals.length === 0 && form.activities.length === 0}>
              Build My Itinerary 🗓️
            </button>
            <p className="planner-cta-note">Uses live deals from @sgfooddeals &amp; @sgweekend</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Counter (unchanged) ───────────────────────────────────────────────────────

function Counter({ value, onChange, min = 1, max = 12 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="planner-counter">
      <button type="button" className="planner-counter-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>−</button>
      <span className="planner-counter-val">{value}</span>
      <button type="button" className="planner-counter-btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
    </div>
  );
}
