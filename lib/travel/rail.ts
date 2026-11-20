// A lightweight MRT/LRT network router used when no live journey planner is configured.
// It finds the quickest train path between the stations nearest to the origin and destination,
// adds a walk or feeder-bus leg at each end, and prices the trip with the official distance fare.

import { RAIL_STATIONS } from "./stations";
import { adultCardFare } from "./fares";

export type LegMode = "walk" | "bus" | "rail";

export interface TransitLeg {
  mode: LegMode;
  line?: string;          // e.g. "EW"
  lineName?: string;      // e.g. "East-West Line"
  color?: string;
  from: string;
  to: string;
  stops?: number;
  minutes: number;
  km: number;
  detail?: string;
}

export interface TransitPlan {
  source: "onemap" | "estimate";
  minutes: number;
  fare: number;
  km: number;
  transfers: number;
  walkMinutes: number;
  legs: TransitLeg[];
  notes: string[];
}

export const LINES: Record<string, { name: string; color: string; lrt?: boolean }> = {
  NS: { name: "North-South Line", color: "#D42E12" },
  EW: { name: "East-West Line", color: "#009645" },
  CG: { name: "East-West Line (Changi Airport branch)", color: "#009645" },
  NE: { name: "North East Line", color: "#9900AA" },
  CC: { name: "Circle Line", color: "#FA9E0D" },
  DT: { name: "Downtown Line", color: "#005EC4" },
  TE: { name: "Thomson-East Coast Line", color: "#9D5B25" },
  BP: { name: "Bukit Panjang LRT", color: "#748477", lrt: true },
  SE: { name: "Sengkang LRT (East Loop)", color: "#748477", lrt: true },
  SW: { name: "Sengkang LRT (West Loop)", color: "#748477", lrt: true },
  PE: { name: "Punggol LRT (East Loop)", color: "#748477", lrt: true },
  PW: { name: "Punggol LRT (West Loop)", color: "#748477", lrt: true },
};

const RAIL_DETOUR = 1.15;
const WALK_DETOUR = 1.3;
const ROAD_DETOUR = 1.3;
const WALK_KMH = 4.8;
const BUS_KMH = 17;
const MRT_KMH = 42;
const LRT_KMH = 25;
const DWELL_MIN = 0.6;
const BOARD_WAIT_MIN = 3;
const TRANSFER_MIN = 4;
const BUS_WAIT_MIN = 6;
const MAX_WALK_KM = 0.9;   // straight-line; beyond this we assume a feeder bus to the station

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface Station { id: number; name: string; lat: number; lng: number; lines: string[] }
interface Edge { to: string; km: number; min: number; line: string | null }

let graph: { stations: Station[]; adj: Map<string, Edge[]> } | null = null;

const parseCode = (code: string): { line: string; num: number } | null => {
  if (code === "CG") return { line: "CG", num: 0 };
  if (code === "STC") return { line: "STC", num: 0 };
  if (code === "PTC") return { line: "PTC", num: 0 };
  const m = code.match(/^([A-Z]{2})(\d+)$/);
  return m ? { line: m[1], num: Number(m[2]) } : null;
};

const node = (stationId: number, line: string) => `${stationId}:${line}`;

function build() {
  if (graph) return graph;
  const stations: Station[] = RAIL_STATIONS.map(([name, codes, lat, lng], id) => ({ id, name, lat, lng, lines: [] }));
  const byLine = new Map<string, { num: number; st: Station }[]>();
  const add = (line: string, num: number, st: Station) => {
    if (!byLine.has(line)) byLine.set(line, []);
    byLine.get(line)!.push({ num, st });
    if (!st.lines.includes(line)) st.lines.push(line);
  };
  RAIL_STATIONS.forEach(([, codes], id) => {
    for (const c of codes) {
      const p = parseCode(c);
      if (!p) continue;
      const st = stations[id];
      // Sengkang / Punggol LRT hubs serve both loops
      if (p.line === "STC") { add("SE", 0, st); add("SW", 0, st); continue; }
      if (p.line === "PTC") { add("PE", 0, st); add("PW", 0, st); continue; }
      add(p.line, p.num, st);
    }
  });

  const adj = new Map<string, Edge[]>();
  const link = (a: Station, b: Station, line: string) => {
    const km = haversineKm(a.lat, a.lng, b.lat, b.lng) * RAIL_DETOUR;
    const min = (km / (LINES[line]?.lrt ? LRT_KMH : MRT_KMH)) * 60 + DWELL_MIN;
    const na = node(a.id, line), nb = node(b.id, line);
    if (!adj.has(na)) adj.set(na, []);
    if (!adj.has(nb)) adj.set(nb, []);
    adj.get(na)!.push({ to: nb, km, min, line });
    adj.get(nb)!.push({ to: na, km, min, line });
  };

  for (const [line, list] of byLine) {
    list.sort((x, y) => x.num - y.num);
    for (let i = 0; i < list.length - 1; i++) link(list[i].st, list[i + 1].st, line);
    const first = list[0], last = list[list.length - 1];
    // Loops that return to their hub
    if (["SE", "SW", "PE", "PW"].includes(line)) link(last.st, first.st, line);
    if (line === "BP") {
      const hub = list.find(x => x.num === 6);
      if (hub && last.num !== 6) link(last.st, hub.st, line);
    }
    if (line === "CC") {
      // Bayfront (CC34) continues to Promenade (CC4)
      const promenade = list.find(x => x.num === 4);
      if (promenade && last.num >= 34) link(last.st, promenade.st, line);
    }
  }
  // Interchange transfers between lines at the same station
  for (const st of stations) {
    for (const a of st.lines) for (const b of st.lines) {
      if (a === b) continue;
      const na = node(st.id, a);
      if (!adj.has(na)) adj.set(na, []);
      adj.get(na)!.push({ to: node(st.id, b), km: 0, min: TRANSFER_MIN, line: null });
    }
  }
  graph = { stations, adj };
  return graph;
}

export function nearestStations(lat: number, lng: number, n = 4, maxKm = 3.5) {
  const { stations } = build();
  return stations
    .map(s => ({ s, km: haversineKm(lat, lng, s.lat, s.lng) }))
    .filter(x => x.km <= maxKm)
    .sort((a, b) => a.km - b.km)
    .slice(0, n);
}

export function nearestStationName(lat: number, lng: number): string | null {
  const s = nearestStations(lat, lng, 1, 6)[0];
  return s ? s.s.name : null;
}

function access(km: number): { mode: LegMode; km: number; min: number } {
  if (km <= MAX_WALK_KM) {
    const d = km * WALK_DETOUR;
    return { mode: "walk", km: d, min: Math.max(1, (d / WALK_KMH) * 60) };
  }
  const d = km * ROAD_DETOUR;
  return { mode: "bus", km: d, min: BUS_WAIT_MIN + (d / BUS_KMH) * 60 };
}

class MinHeap {
  private a: [number, string][] = [];
  push(x: [number, string]) { this.a.push(x); let i = this.a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (this.a[p][0] <= this.a[i][0]) break; [this.a[p], this.a[i]] = [this.a[i], this.a[p]]; i = p; } }
  pop(): [number, string] | undefined {
    if (!this.a.length) return undefined;
    const top = this.a[0], last = this.a.pop()!;
    if (this.a.length) { this.a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < this.a.length && this.a[l][0] < this.a[m][0]) m = l; if (r < this.a.length && this.a[r][0] < this.a[m][0]) m = r; if (m === i) break; [this.a[m], this.a[i]] = [this.a[i], this.a[m]]; i = m; } }
    return top;
  }
  get size() { return this.a.length; }
}

const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

/** Estimate the best public transport journey between two points (Singapore only). */
export function estimateTransit(from: { lat: number; lng: number; name: string }, to: { lat: number; lng: number; name: string }, hour: number): TransitPlan {
  const straight = haversineKm(from.lat, from.lng, to.lat, to.lng);
  const notes: string[] = [];
  const nightNote = hour >= 0 && hour < 6;

  // Very short trips: just walk.
  if (straight <= 1.1) {
    const km = straight * WALK_DETOUR;
    const min = Math.max(2, Math.round((km / WALK_KMH) * 60));
    return { source: "estimate", minutes: min, fare: 0, km: round(km), transfers: 0, walkMinutes: min, legs: [{ mode: "walk", from: from.name, to: to.name, minutes: min, km: round(km, 2) }], notes: ["It's a short walk — no fare needed."] };
  }

  const { stations, adj } = build();
  const starts = nearestStations(from.lat, from.lng);
  const ends = nearestStations(to.lat, to.lng);

  // Direct bus estimate (used when trains don't help, e.g. short hops or no station nearby)
  const busKm = straight * ROAD_DETOUR;
  const busOnly = { min: BUS_WAIT_MIN + 4 + (busKm / BUS_KMH) * 60, km: busKm };

  let best: { min: number; path: string[]; start: (typeof starts)[0]; end: (typeof ends)[0]; edges: Edge[] } | null = null;

  if (starts.length && ends.length) {
    const dist = new Map<string, number>();
    const prev = new Map<string, { from: string; edge: Edge } | null>();
    const startOf = new Map<string, (typeof starts)[0]>();
    const heap = new MinHeap();
    for (const s of starts) {
      const acc = access(s.km);
      for (const line of s.s.lines) {
        const n = node(s.s.id, line);
        const cost = acc.min + BOARD_WAIT_MIN;
        if (cost < (dist.get(n) ?? Infinity)) { dist.set(n, cost); prev.set(n, null); startOf.set(n, s); heap.push([cost, n]); }
      }
    }
    while (heap.size) {
      const [d, n] = heap.pop()!;
      if (d > (dist.get(n) ?? Infinity)) continue;
      for (const e of adj.get(n) ?? []) {
        const nd = d + e.min;
        if (nd < (dist.get(e.to) ?? Infinity)) { dist.set(e.to, nd); prev.set(e.to, { from: n, edge: e }); startOf.set(e.to, startOf.get(n)!); heap.push([nd, e.to]); }
      }
    }
    for (const e of ends) {
      const eg = access(e.km);
      for (const line of e.s.lines) {
        const n = node(e.s.id, line);
        const d = dist.get(n);
        if (d === undefined) continue;
        const total = d + eg.min;
        if (!best || total < best.min) {
          const path: string[] = [n];
          const edges: Edge[] = [];
          let cur = n;
          while (prev.get(cur)) { const p = prev.get(cur)!; edges.unshift(p.edge); path.unshift(p.from); cur = p.from; }
          best = { min: total, path, start: startOf.get(n)!, end: e, edges };
        }
      }
    }
  }

  if (!best || busOnly.min < best.min - 2 || best.edges.length === 0) {
    const min = Math.round(busOnly.min);
    notes.push("A direct bus is likely quickest for this trip. Check bus service numbers in an app like SG BusLeh, MyTransport.SG or Google Maps.");
    if (nightNote) notes.push("Most bus services stop around midnight; only NightRider/Nite Owl services run after that on weekends and eves of public holidays.");
    return {
      source: "estimate", minutes: min, fare: adultCardFare(busOnly.km), km: round(busOnly.km), transfers: 0, walkMinutes: 6,
      legs: [
        { mode: "walk", from: from.name, to: "Nearest bus stop", minutes: 3, km: 0.2 },
        { mode: "bus", from: "Bus stop near " + from.name, to: "Bus stop near " + to.name, minutes: Math.max(4, min - 6), km: round(busOnly.km), detail: "Direct bus (service number varies)" },
        { mode: "walk", from: "Bus stop", to: to.name, minutes: 3, km: 0.2 },
      ],
      notes,
    };
  }

  // Assemble legs: access → rail segments grouped by line → egress
  const legs: TransitLeg[] = [];
  const st = (n: string) => stations[Number(n.split(":")[0])];
  const acc = access(best.start.km);
  legs.push({
    mode: acc.mode, from: from.name, to: `${best.start.s.name} station`, minutes: Math.round(acc.min), km: round(acc.km, 2),
    ...(acc.mode === "bus" ? { detail: `Feeder bus to ${best.start.s.name}` } : {}),
  });

  let railKm = 0, transfers = 0;
  let seg: TransitLeg | null = null;
  for (let i = 0; i < best.edges.length; i++) {
    const e = best.edges[i];
    const fromSt = st(best.path[i]);
    const toSt = st(best.path[i + 1]);
    if (e.line === null) {
      if (seg) { legs.push(seg); seg = null; }
      transfers++;
      continue;
    }
    railKm += e.km;
    if (!seg || seg.line !== e.line) {
      if (seg) legs.push(seg);
      const meta: { name: string; color: string } | undefined = LINES[e.line];
      seg = { mode: "rail", line: e.line, lineName: meta?.name ?? e.line, color: meta?.color, from: fromSt.name, to: toSt.name, stops: 1, minutes: e.min, km: e.km };
    } else {
      seg.to = toSt.name; seg.stops = (seg.stops ?? 0) + 1; seg.minutes += e.min; seg.km += e.km;
    }
  }
  if (seg) legs.push(seg);
  for (const l of legs) if (l.mode === "rail") { l.minutes = Math.round(l.minutes); l.km = round(l.km); }

  const eg = access(best.end.km);
  legs.push({
    mode: eg.mode, from: `${best.end.s.name} station`, to: to.name, minutes: Math.round(eg.min), km: round(eg.km, 2),
    ...(eg.mode === "bus" ? { detail: `Bus from ${best.end.s.name}` } : {}),
  });

  const fareKm = railKm + (acc.mode === "bus" ? acc.km : 0) + (eg.mode === "bus" ? eg.km : 0);
  const walkMinutes = legs.filter(l => l.mode === "walk").reduce((s, l) => s + l.minutes, 0);
  if (acc.mode === "bus" || eg.mode === "bus") notes.push("Bus legs are estimated — check the exact bus service in a live transit app.");
  if (nightNote) notes.push("MRT and LRT trains generally run from about 5.30am to midnight. Outside these hours, take a ride-hail or taxi.");
  notes.push("Train-only journeys that tap in before 7.45am on weekdays (excluding public holidays) pay a lower early-travel fare.");

  return {
    source: "estimate",
    minutes: Math.round(best.min),
    fare: adultCardFare(fareKm),
    km: round(fareKm),
    transfers,
    walkMinutes,
    legs,
    notes,
  };
}
