"use client";

import type { QuoteResult, Area } from "@/lib/types";
import PlatformGlyph from "./PlatformGlyph";

interface Props {
  q: QuoteResult;
  origin?: Area | null;
  dest?: Area | null;
  onGetgoStopoverChange?: ((hours: number) => void) | null;
}

export default function ResultRow({ q, origin = null, dest = null, onGetgoStopoverChange = null }: Props) {
  const p = q.platform;

  if (q.unavailable) {
    return (
      <div className="cpc-row cpc-row-unavailable">
        <div className="cpc-row-platform">
          <div className="cpc-platform-icon" style={{ background: "#f2f2f2", color: "#929292" }}>
            <PlatformGlyph id={p.id} color="#929292" size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="t-display-sm" style={{ color: "var(--color-muted)" }}>{p.name}</span>
              <span className="cpc-tag" style={{ background: "#929292" }}>Not in service</span>
            </div>
            <div className="cpc-row-meta">
              <span>{q.reason}</span>
            </div>
          </div>
        </div>
        <div className="cpc-row-price" style={{ color: "var(--color-muted)" }}>
          <div className="cpc-price-num" style={{ fontSize: 18, color: "var(--color-muted)" }}>—</div>
        </div>
      </div>
    );
  }

  const tag =
    q.isBestValue ? { label: "Best value", color: "var(--color-primary)" } :
    q.isCheapest  ? { label: "Cheapest",   color: "#1F8A5B" } :
    q.isFastest   ? { label: "Fastest",    color: "#1F6FEB" } : null;

  return (
    <div className="cpc-row">
      <div className="cpc-row-platform">
        <div className="cpc-platform-icon" style={{ background: p.color + "1a", color: p.color }}>
          <PlatformGlyph id={p.id} color={p.color} size={22} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className="t-display-sm">{p.name}</span>
            {tag && <span className="cpc-tag" style={{ background: tag.color }}>{tag.label}</span>}
            {q.surge > 1.20 && (
              <span className="cpc-surge-pill" title={q.surgeLabel ?? undefined}>
                ×{q.surge.toFixed(2)} {q.surgeLabel}
              </span>
            )}
          </div>
          <div className="cpc-row-meta">
            <span>{p.short}</span>
            {p.id !== "publictransport" && p.id !== "flexar" && p.id !== "getgo" && (
              <><span>·</span><span>{q.eta} min pickup</span></>
            )}
            {q.getgo && (
              <><span>·</span><span>Round trip · {q.getgo.stopoverHours}h stop</span></>
            )}
            {q.transfers !== null && (
              <><span>·</span><span>{q.transfers === 0 ? "Direct" : `${q.transfers} transfer${q.transfers > 1 ? "s" : ""}`}</span></>
            )}
          </div>

          {q.flexar && (
            <div className="cpc-flexar-leg">
              <div className="cpc-flexar-step">
                <span className="cpc-flexar-dot" />
                <div>
                  <div className="cpc-flexar-line">Take a car from <strong>nearest Flexar station</strong></div>
                  <div className="cpc-flexar-sub">
                    {q.flexar.originStationCount} station{q.flexar.originStationCount > 1 ? "s" : ""} in {q.flexar.originTown} · ~{q.flexar.walkInMin} min walk
                  </div>
                </div>
              </div>
              <div className="cpc-flexar-step">
                <span className="cpc-flexar-dot cpc-flexar-dot-drive" />
                <div>
                  <div className="cpc-flexar-line">Drive to <strong>any Flexar station in {q.flexar.destTown}</strong></div>
                  <div className="cpc-flexar-sub">
                    {q.flexar.destStationCount} station{q.flexar.destStationCount > 1 ? "s" : ""} available · {q.km} km · {q.flexar.driveMin} min drive
                  </div>
                </div>
              </div>
              <div className="cpc-flexar-step">
                <span className="cpc-flexar-dot cpc-flexar-dot-end" />
                <div>
                  <div className="cpc-flexar-line">Walk to destination</div>
                  <div className="cpc-flexar-sub">~{q.flexar.walkOutMin} min walk from drop-off station</div>
                </div>
              </div>
            </div>
          )}

          {q.getgo && (
            <div className="cpc-flexar-leg cpc-getgo-leg">
              <div className="cpc-getgo-header">
                <div className="cpc-getgo-note">Round-trip rental — you must return the car to its origin pod.</div>
                {onGetgoStopoverChange && (
                  <div className="cpc-getgo-stopover-picker">
                    <span className="cpc-getgo-stopover-lbl">Stop at destination for</span>
                    <div className="cpc-chip-group">
                      {[0.5, 1, 2, 3, 4].map(h => (
                        <button
                          key={h}
                          type="button"
                          className={"cpc-chip" + (q.getgo!.stopoverHours === h ? " is-selected" : "")}
                          onClick={() => onGetgoStopoverChange(h)}
                        >
                          {h < 1 ? "30m" : h + "h"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="cpc-flexar-step">
                <span className="cpc-getgo-dot" />
                <div>
                  <div className="cpc-flexar-line">Drive <strong>{origin?.name || "origin"} → {dest?.name || "destination"}</strong></div>
                  <div className="cpc-flexar-sub">{q.getgo.oneWayKm} km · {q.getgo.oneWayMin} min</div>
                </div>
              </div>
              <div className="cpc-flexar-step">
                <span className="cpc-getgo-dot cpc-getgo-dot-stop" />
                <div>
                  <div className="cpc-flexar-line">Stopover at destination</div>
                  <div className="cpc-flexar-sub">
                    {q.getgo.stopoverHours < 1 ? "30 min" : `${q.getgo.stopoverHours} hour${q.getgo.stopoverHours > 1 ? "s" : ""}`} · {q.getgo.stopoverMin} min
                  </div>
                </div>
              </div>
              <div className="cpc-flexar-step">
                <span className="cpc-getgo-dot" />
                <div>
                  <div className="cpc-flexar-line">Drive back <strong>{dest?.name || "destination"} → {origin?.name || "origin"}</strong></div>
                  <div className="cpc-flexar-sub">{q.getgo.oneWayKm} km · {q.getgo.oneWayMin} min</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="cpc-row-time">
        {q.getgo ? (
          <>
            <div className="cpc-stat-num">{q.minutes}</div>
            <div className="cpc-stat-lbl">min total</div>
            <div className="cpc-stat-sublbl">{2 * q.getgo.oneWayMin}m drive + {q.getgo.stopoverMin}m stop</div>
          </>
        ) : (
          <>
            <div className="cpc-stat-num">{q.minutes}</div>
            <div className="cpc-stat-lbl">min</div>
          </>
        )}
      </div>

      <div className="cpc-row-price">
        <div className="cpc-price-currency">S$</div>
        <div className="cpc-price-num">{q.price.toFixed(2)}</div>
      </div>
    </div>
  );
}
