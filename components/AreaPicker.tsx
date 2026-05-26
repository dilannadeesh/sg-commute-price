"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { SG_AREAS, findNearestArea } from "@/lib/quote";
import type { Area } from "@/lib/types";
import Icon from "./Icon";

interface OneMapResult {
  ADDRESS: string;
  LATITUDE: string;
  LONGITUDE: string;
  LONGTITUDE?: string; // typo in OneMap API
}

interface Props {
  value: Area | null;
  onChange: (area: Area) => void;
  label: string;
  placeholder: string;
  anchor?: "left" | "right";
}

async function searchOneMap(query: string): Promise<Area[]> {
  try {
    const res = await fetch(
      `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(query)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
    );
    if (!res.ok) return [];
    const data = await res.json();
    const results: OneMapResult[] = data.results || [];
    return results.slice(0, 6).map(r => {
      const lat = parseFloat(r.LATITUDE);
      const lng = parseFloat(r.LONGITUDE || r.LONGTITUDE || "103.8198");
      const nearest = findNearestArea(lat, lng);
      return {
        id: nearest.id,
        name: r.ADDRESS,
        region: nearest.region,
        lat,
        lng,
        address: r.ADDRESS,
      };
    });
  } catch {
    return [];
  }
}

export default function AreaPicker({ value, onChange, label, placeholder, anchor = "left" }: Props) {
  const [open, setOpen]         = useState(false);
  const [q, setQ]               = useState("");
  const [searching, setSearching] = useState(false);
  const [addrResults, setAddrResults] = useState<Area[]>([]);
  const ref         = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Debounced address search
  const runSearch = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 3) {
      setAddrResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchOneMap(query);
      setAddrResults(results);
      setSearching(false);
    }, 300);
  }, []);

  function handleQueryChange(value: string) {
    setQ(value);
    runSearch(value);
  }

  // Planning areas filtered by query (name or region)
  const filteredAreas = useMemo(() => {
    if (!q) return SG_AREAS;
    const lower = q.toLowerCase();
    return SG_AREAS.filter(
      a =>
        a.name.toLowerCase().includes(lower) ||
        a.region.toLowerCase().includes(lower)
    );
  }, [q]);

  const byRegion = useMemo(() => {
    const map: Record<string, Area[]> = {};
    filteredAreas.forEach(a => {
      if (!map[a.region]) map[a.region] = [];
      map[a.region].push(a);
    });
    return map;
  }, [filteredAreas]);

  function select(area: Area) {
    onChange(area);
    setOpen(false);
    setQ("");
    setAddrResults([]);
  }

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="cpc-field"
        aria-expanded={open}
      >
        <span className="cpc-field-label">{label}</span>
        <span
          className="cpc-field-value"
          style={{ color: value ? "var(--color-ink)" : "var(--color-muted)" }}
        >
          {value ? value.name : placeholder}
        </span>
      </button>

      {open && (
        <div className="cpc-popover" style={{ [anchor]: 0 }}>
          <div className="cpc-popover-search">
            <Icon name="search" size={16} color="var(--color-muted)" />
            <input
              autoFocus
              value={q}
              onChange={e => handleQueryChange(e.target.value)}
              placeholder="Search address or area"
            />
            {searching && (
              <span style={{ font: "var(--type-caption-sm)", color: "var(--color-muted)" }}>…</span>
            )}
          </div>

          <div className="cpc-popover-list">
            {/* Address search results */}
            {addrResults.length > 0 && (
              <div>
                <div className="cpc-popover-group">Addresses</div>
                {addrResults.map((a, i) => (
                  <button
                    key={i}
                    className={"cpc-popover-item" + (value?.address === a.address ? " is-selected" : "")}
                    onClick={() => select(a)}
                  >
                    <Icon name="pin" size={16} color="var(--color-primary)" />
                    <div>
                      <div style={{ font: "var(--type-body-sm)", color: "var(--color-ink)" }}>
                        {a.name}
                      </div>
                      <div style={{ font: "var(--type-caption-sm)", color: "var(--color-muted)" }}>
                        {a.region} region
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Planning areas */}
            {Object.entries(byRegion).map(([region, areas]) => (
              <div key={region}>
                <div className="cpc-popover-group">{region}</div>
                {areas.map(a => (
                  <button
                    key={a.id}
                    className={"cpc-popover-item" + (value?.id === a.id && !value?.address ? " is-selected" : "")}
                    onClick={() => select(a)}
                  >
                    <Icon name="pin" size={16} color="var(--color-muted)" />
                    <div>
                      <div style={{ font: "var(--type-body-md)", color: "var(--color-ink)" }}>{a.name}</div>
                      <div style={{ font: "var(--type-caption-sm)", color: "var(--color-muted)" }}>{a.region}</div>
                    </div>
                  </button>
                ))}
              </div>
            ))}

            {Object.keys(byRegion).length === 0 && addrResults.length === 0 && !searching && (
              <div style={{ padding: 24, textAlign: "center", color: "var(--color-muted)" }}>
                No matches
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
