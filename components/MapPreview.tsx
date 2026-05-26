"use client";

import { SG_AREAS, FLEXAR_STATIONS } from "@/lib/quote";
import type { Area, QuoteResult } from "@/lib/types";

// Fixed Singapore bounds for SVG projection
const SG = { minLat: 1.205, maxLat: 1.475, minLng: 103.595, maxLng: 104.010 };

function project(lat: number, lng: number) {
  const pad = 6, w = 100, h = 60;
  return {
    x: pad + ((lng - SG.minLng) / (SG.maxLng - SG.minLng)) * (w - pad * 2),
    // Y is flipped: higher lat = lower SVG y
    y: pad + ((SG.maxLat - lat) / (SG.maxLat - SG.minLat)) * (h - pad * 2),
  };
}

interface Props {
  origin: Area | null;
  dest: Area | null;
  height?: number;
  flexarQuote?: QuoteResult | null;
  showFlexarStations?: boolean;
  servicedRegions?: string[] | null;
}

export default function MapPreview({
  origin,
  dest,
  height = 260,
  flexarQuote = null,
  showFlexarStations = false,
  servicedRegions = null,
}: Props) {
  const oP = origin ? project(origin.lat, origin.lng) : null;
  const dP = dest   ? project(dest.lat,   dest.lng)   : null;

  return (
    <div className="cpc-map" style={{ height }}>
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" width="100%" height="100%">
        <defs>
          <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#ebebeb" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="60" fill="#f7f7f7" />
        <rect width="100" height="60" fill="url(#grid)" />

        {/* Rough Singapore island silhouette */}
        <path
          d="M 5 28 Q 8 18 16 16 Q 28 12 38 14 Q 52 12 64 16 Q 76 14 86 18 Q 94 22 95 32 Q 92 42 84 46 Q 70 50 56 48 Q 40 50 26 48 Q 14 46 8 38 Z"
          fill="#ffffff" stroke="#dddddd" strokeWidth="0.4"
        />

        {/* Serviced-region tint */}
        {servicedRegions && SG_AREAS
          .filter(a => servicedRegions.includes(a.region))
          .map(a => {
            const p = project(a.lat, a.lng);
            return <circle key={"sv-" + a.id} cx={p.x} cy={p.y} r="3.2" fill="#7A4DFF" opacity="0.08" />;
          })}

        {/* All area dots */}
        {SG_AREAS.map(a => {
          const p = project(a.lat, a.lng);
          const isEnd = a.id === origin?.id || a.id === dest?.id;
          return <circle key={a.id} cx={p.x} cy={p.y} r={isEnd ? 0 : 0.6} fill="#c1c1c1" />;
        })}

        {/* Flexar stations */}
        {showFlexarStations && FLEXAR_STATIONS.map(s => {
          const sArea = SG_AREAS.find(a => a.id === s.area);
          if (servicedRegions && !servicedRegions.includes(sArea?.region ?? "")) return null;
          const p = project(s.lat, s.lng);
          return <circle key={s.id} cx={p.x} cy={p.y} r="0.7" fill="#7A4DFF" opacity="0.7" />;
        })}

        {/* Flexar route detail (walk in + drive + walk out) */}
        {flexarQuote?.flexar && oP && dP && (() => {
          const pa = project(flexarQuote.flexar!.pickupStation.lat,  flexarQuote.flexar!.pickupStation.lng);
          const pb = project(flexarQuote.flexar!.dropoffStation.lat, flexarQuote.flexar!.dropoffStation.lng);
          return (
            <g key="flx-route">
              <path d={`M ${oP.x} ${oP.y} L ${pa.x} ${pa.y}`}
                stroke="#7A4DFF" strokeWidth="0.6" strokeDasharray="0.6 0.6" fill="none" />
              <path d={`M ${pa.x} ${pa.y} Q ${(pa.x + pb.x) / 2} ${Math.min(pa.y, pb.y) - 4} ${pb.x} ${pb.y}`}
                stroke="#7A4DFF" strokeWidth="1" fill="none" />
              <path d={`M ${pb.x} ${pb.y} L ${dP.x} ${dP.y}`}
                stroke="#7A4DFF" strokeWidth="0.6" strokeDasharray="0.6 0.6" fill="none" />
              <circle cx={pa.x} cy={pa.y} r="1.2" fill="#7A4DFF" />
              <circle cx={pa.x} cy={pa.y} r="0.5" fill="#fff" />
              <circle cx={pb.x} cy={pb.y} r="1.2" fill="#7A4DFF" />
              <circle cx={pb.x} cy={pb.y} r="0.5" fill="#fff" />
            </g>
          );
        })()}

        {/* Route arc */}
        {oP && dP && (
          <g>
            <path
              d={`M ${oP.x} ${oP.y} Q ${(oP.x + dP.x) / 2} ${Math.min(oP.y, dP.y) - 6} ${dP.x} ${dP.y}`}
              stroke="#ff385c" strokeWidth="0.8" fill="none" strokeDasharray="1.5 1"
            />
            <circle cx={oP.x} cy={oP.y} r="1.6" fill="#222" />
            <circle cx={oP.x} cy={oP.y} r="0.6" fill="#fff" />
            <circle cx={dP.x} cy={dP.y} r="1.8" fill="#ff385c" />
            <circle cx={dP.x} cy={dP.y} r="0.7" fill="#fff" />
          </g>
        )}
      </svg>

      {oP && dP && origin && dest && (
        <>
          <div className="cpc-map-label" style={{ left: `${oP.x}%`, top: `${(oP.y / 60) * 100}%` }}>
            <span className="cpc-map-pin" style={{ background: "var(--color-ink)" }}>A</span>
            <span>{origin.address ? "From" : origin.name}</span>
          </div>
          <div className="cpc-map-label" style={{ left: `${dP.x}%`, top: `${(dP.y / 60) * 100}%` }}>
            <span className="cpc-map-pin" style={{ background: "var(--color-primary)" }}>B</span>
            <span>{dest.address ? "To" : dest.name}</span>
          </div>
        </>
      )}
    </div>
  );
}
