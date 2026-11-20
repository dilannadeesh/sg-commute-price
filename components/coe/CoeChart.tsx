import type { CoePoint } from "@/lib/coe";

/** Server-rendered SVG line chart of COE premiums over time — no client JS needed. */
export default function CoeChart({ points, title }: { points: CoePoint[]; title: string }) {
  if (points.length < 2) return null;
  const W = 820, H = 300, L = 64, R = 16, T = 16, B = 34;
  const max = Math.max(...points.map(p => p.premium));
  const step = max > 60000 ? 20000 : max > 20000 ? 5000 : 2000;
  const top = Math.ceil(max / step) * step;
  const x = (i: number) => L + (i / (points.length - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - v / top) * (H - T - B);
  const line = points.map((p, i) => `${x(i).toFixed(1)},${y(p.premium).toFixed(1)}`).join(" ");
  const area = `${L},${y(0)} ${line} ${x(points.length - 1)},${y(0)}`;
  const grid = Array.from({ length: top / step + 1 }, (_, i) => i * step);
  const yearTicks = points
    .map((p, i) => ({ i, year: p.month.slice(0, 4), first: i === 0 || points[i - 1].month.slice(0, 4) !== p.month.slice(0, 4) }))
    .filter(t => t.first);
  const every = Math.ceil(yearTicks.length / 9);
  const last = points[points.length - 1];

  return (
    <figure className="coe-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}: line chart of premiums from ${points[0].label} to ${last.label}`}>
        {grid.map(g => (
          <g key={g}>
            <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke="#ebebeb" />
            <text x={L - 8} y={y(g) + 4} textAnchor="end" fontSize="11" fill="#6a6a6a">
              {g >= 1000 ? `S$${g / 1000}k` : `S$${g}`}
            </text>
          </g>
        ))}
        {yearTicks.filter((_, k) => k % every === 0).map(t => (
          <text key={t.year} x={x(t.i)} y={H - 12} textAnchor="middle" fontSize="11" fill="#6a6a6a">{t.year}</text>
        ))}
        <polygon points={area} fill="#ff385c14" />
        <polyline points={line} fill="none" stroke="#ff385c" strokeWidth="2" strokeLinejoin="round" />
        <circle cx={x(points.length - 1)} cy={y(last.premium)} r="4" fill="#ff385c" />
      </svg>
      <figcaption>
        {title}, every bidding round from {points[0].label} to {last.label}. Source: LTA via data.gov.sg.
      </figcaption>
    </figure>
  );
}
