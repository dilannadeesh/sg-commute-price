"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BTT_QUESTIONS, CATEGORIES, PASS_MARK, type Question } from "@/lib/newdriver/btt";
import RoadSign from "@/components/newdriver/RoadSign";

interface ExamQ { q: Question; order: number[] }          // order maps displayed option index → original index
type Phase = "start" | "exam" | "result";
type Mode = { id: "full" | "quick" | "retry"; count: number; minutes: number; label: string };

const MODES: Mode[] = [
  { id: "full", count: 50, minutes: 50, label: "Full mock exam" },
  { id: "quick", count: 10, minutes: 10, label: "Quick practice" },
];
const LETTERS = ["A", "B", "C", "D"];
const STORE_KEY = "sgliving-btt-best";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Pick `count` questions spread across categories, then shuffle options. */
function buildExam(count: number, pool: Question[] = BTT_QUESTIONS): ExamQ[] {
  const byCat = CATEGORIES.map(c => shuffle(pool.filter(q => q.cat === c)));
  const picked: Question[] = [];
  let i = 0;
  while (picked.length < Math.min(count, pool.length)) {
    const list = byCat[i % byCat.length];
    if (list.length) picked.push(list.shift()!);
    i++;
    if (i > 10_000) break;
  }
  return shuffle(picked).map(q => ({ q, order: shuffle([0, 1, 2, 3]) }));
}

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function BttExam() {
  const [phase, setPhase] = useState<Phase>("start");
  const [mode, setMode] = useState<Mode>(MODES[0]);
  const [exam, setExam] = useState<ExamQ[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);   // original option index chosen
  const [flags, setFlags] = useState<boolean[]>([]);
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(0);
  const [used, setUsed] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [best, setBest] = useState<{ score: number; total: number } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { const b = localStorage.getItem(STORE_KEY); if (b) setBest(JSON.parse(b)); } catch { /* storage unavailable */ }
  }, []);

  const start = useCallback((m: Mode, pool?: Question[]) => {
    const e = buildExam(m.count, pool);
    setMode(m); setExam(e); setAnswers(e.map(() => null)); setFlags(e.map(() => false));
    setIdx(0); setLeft(m.minutes * 60); setUsed(0); setConfirming(false); setShowAll(false); setPhase("exam");
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  }, []);

  const finish = useCallback(() => {
    setPhase("result"); setConfirming(false);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "exam") return;
    const t = setInterval(() => {
      setLeft(s => { if (s <= 1) { clearInterval(t); finish(); return 0; } return s - 1; });
      setUsed(u => u + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [phase, finish]);

  const score = useMemo(() => exam.reduce((s, e, i) => s + (answers[i] === e.q.answer ? 1 : 0), 0), [exam, answers]);
  const total = exam.length;
  const passed = total > 0 && score / total >= PASS_MARK;
  const wrong = useMemo(() => exam.map((e, i) => ({ e, i, a: answers[i] })).filter(x => x.a !== x.e.q.answer), [exam, answers]);

  // Save best full-exam score
  useEffect(() => {
    if (phase !== "result" || mode.id !== "full") return;
    try {
      const prev = best ? best.score / best.total : -1;
      if (score / total > prev) { const b = { score, total }; localStorage.setItem(STORE_KEY, JSON.stringify(b)); setBest(b); }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "start") {
    return (
      <div ref={topRef} className="btt-start">
        <div className="btt-start-grid">
          {MODES.map(m => (
            <button key={m.id} type="button" className={"btt-mode" + (m.id === "full" ? " is-primary" : "")} onClick={() => start(m)}>
              <strong>{m.label}</strong>
              <span>{m.count} questions · {m.minutes} min · pass at {Math.ceil(m.count * PASS_MARK)}</span>
              <span className="btt-mode-go">Start →</span>
            </button>
          ))}
        </div>
        <ul className="btt-rules">
          <li>Questions are drawn at random from our {BTT_QUESTIONS.length}-question bank across road signs, markings, right of way, safe driving, rules and emergencies.</li>
          <li>Just like the real BTT, you need 90% to pass. You'll see your marks and every wrong answer with an explanation at the end.</li>
          <li>The timer submits your test automatically when time runs out.</li>
        </ul>
        {best && <p className="btt-best">Your best full mock score on this device: <strong>{best.score}/{best.total}</strong></p>}
      </div>
    );
  }

  if (phase === "exam") {
    const cur = exam[idx];
    const answered = answers.filter(a => a !== null).length;
    const unanswered = total - answered;
    return (
      <div ref={topRef} className="btt-exam">
        <div className="btt-bar">
          <span className="btt-bar-q">Question {idx + 1} of {total}</span>
          <span className={"btt-timer" + (left < 60 ? " is-low" : "")} aria-live="off">⏱ {fmtTime(left)}</span>
        </div>
        <div className="btt-progress" aria-hidden><span style={{ width: `${(answered / total) * 100}%` }} /></div>

        <fieldset className="btt-card">
          <legend className="btt-cat">{cur.q.cat}</legend>
          {cur.q.sign && <RoadSign type={cur.q.sign} />}
          <p className="btt-question">{cur.q.q}</p>
          <div className="btt-options" role="radiogroup">
            {cur.order.map((orig, di) => {
              const checked = answers[idx] === orig;
              return (
                <label key={orig} className={"btt-option" + (checked ? " is-checked" : "")}>
                  <input type="radio" name={`q-${cur.q.id}`} checked={checked}
                    onChange={() => setAnswers(a => { const n = [...a]; n[idx] = orig; return n; })} />
                  <span className="btt-letter">{LETTERS[di]}</span>
                  <span>{cur.q.options[orig]}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="btt-nav">
          <button type="button" className="btt-btn" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>← Previous</button>
          <button type="button" className={"btt-btn btt-flag" + (flags[idx] ? " is-on" : "")} onClick={() => setFlags(f => { const n = [...f]; n[idx] = !n[idx]; return n; })}>
            {flags[idx] ? "★ Flagged" : "☆ Flag"}
          </button>
          {idx < total - 1
            ? <button type="button" className="btt-btn is-primary" onClick={() => setIdx(i => i + 1)}>Next →</button>
            : <button type="button" className="btt-btn is-primary" onClick={() => (unanswered ? setConfirming(true) : finish())}>Submit test</button>}
        </div>

        <div className="btt-grid" aria-label="Question navigator">
          {exam.map((_, i) => (
            <button key={i} type="button" onClick={() => setIdx(i)} aria-label={`Go to question ${i + 1}`}
              className={"btt-dot" + (answers[i] !== null ? " is-done" : "") + (flags[i] ? " is-flag" : "") + (i === idx ? " is-cur" : "")}>
              {i + 1}
            </button>
          ))}
        </div>

        <div className="btt-submit-row">
          <span>{answered}/{total} answered{flags.some(Boolean) ? ` · ${flags.filter(Boolean).length} flagged` : ""}</span>
          <button type="button" className="btt-btn" onClick={() => (unanswered ? setConfirming(true) : finish())}>Finish &amp; see results</button>
        </div>
        {confirming && (
          <div className="btt-confirm" role="alertdialog" aria-label="Confirm submit">
            <p>You have <strong>{unanswered}</strong> unanswered question{unanswered === 1 ? "" : "s"}. Unanswered questions count as wrong.</p>
            <div className="btt-nav">
              <button type="button" className="btt-btn" onClick={() => { setConfirming(false); setIdx(answers.findIndex(a => a === null)); }}>Go to first unanswered</button>
              <button type="button" className="btt-btn is-primary" onClick={finish}>Submit anyway</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Results ─────────────────────────────────────────────
  const pct = Math.round((score / total) * 100);
  const need = Math.ceil(total * PASS_MARK);
  const catStats = CATEGORIES.map(c => {
    const items = exam.map((e, i) => ({ e, i })).filter(x => x.e.q.cat === c);
    return { c, total: items.length, right: items.filter(x => answers[x.i] === x.e.q.answer).length };
  }).filter(s => s.total > 0);
  const reviewList = showAll ? exam.map((e, i) => ({ e, i, a: answers[i] })) : wrong;

  return (
    <div ref={topRef} className="btt-result">
      <div className={"btt-score " + (passed ? "is-pass" : "is-fail")}>
        <div className="btt-score-ring" style={{ ["--pct" as string]: `${pct}%` }}><span>{score}<small>/{total}</small></span></div>
        <div>
          <p className="btt-verdict">{passed ? "🎉 Pass" : "Not yet — keep practising"}</p>
          <p className="btt-score-sub">{pct}% · you needed {need}/{total} to pass · time used {fmtTime(used)}</p>
          <p className="btt-score-sub">{wrong.length === 0 ? "Perfect score — no wrong answers!" : `${wrong.length} wrong or unanswered — review them below.`}</p>
        </div>
      </div>

      <div className="btt-cats">
        {catStats.map(s => (
          <div key={s.c} className="btt-cat-row">
            <span>{s.c}</span>
            <div className="btt-cat-bar"><span style={{ width: `${(s.right / s.total) * 100}%` }} className={s.right / s.total >= PASS_MARK ? "ok" : "low"} /></div>
            <span className="btt-cat-num">{s.right}/{s.total}</span>
          </div>
        ))}
      </div>

      <div className="btt-actions">
        {wrong.length > 0 && <button type="button" className="btt-btn is-primary" onClick={() => start({ id: "retry", count: wrong.length, minutes: Math.max(2, wrong.length), label: "Retry wrong answers" }, wrong.map(w => w.e.q))}>Retry my {wrong.length} wrong answer{wrong.length === 1 ? "" : "s"}</button>}
        <button type="button" className="btt-btn" onClick={() => start(MODES[0])}>New full mock (50)</button>
        <button type="button" className="btt-btn" onClick={() => start(MODES[1])}>Quick 10</button>
      </div>

      <div className="btt-review-head">
        <h2>{showAll ? "All answers" : "Your wrong answers"}</h2>
        <button type="button" className="btt-link" onClick={() => setShowAll(s => !s)}>{showAll ? "Show wrong answers only" : "Review all answers"}</button>
      </div>
      {reviewList.length === 0 && <p className="btt-score-sub">Nothing to review. 🎯</p>}
      <ol className="btt-review">
        {reviewList.map(({ e, i, a }) => {
          const right = a === e.q.answer;
          return (
            <li key={e.q.id} className={"btt-review-item " + (right ? "is-right" : "is-wrong")}>
              <p className="btt-review-q"><span className="btt-review-num">Q{i + 1}</span> {e.q.q}</p>
              {e.q.sign && <RoadSign type={e.q.sign} size={84} />}
              <p className={"btt-ans " + (right ? "ok" : "bad")}>
                {right ? "✓" : "✗"} Your answer: {a === null || a === undefined ? <em>not answered</em> : e.q.options[a]}
              </p>
              {!right && <p className="btt-ans ok">✓ Correct answer: {e.q.options[e.q.answer]}</p>}
              <p className="btt-explain">{e.q.explain}</p>
            </li>
          );
        })}
      </ol>
      <p className="btt-disclaimer">
        These are SGliving practice questions based on Singapore road rules — not the official Traffic Police question bank. Study the official <em>Basic Theory of Driving</em> handbook too.
        Next: <Link href="/new-driver/how-to-get-driving-licence-singapore">how to get your licence</Link> · <Link href="/new-driver/singapore-driving-rules">latest driving rules</Link>.
      </p>
    </div>
  );
}
