"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { SG_AREAS } from "@/lib/quote";
import type { Area } from "@/lib/types";
import Icon from "./Icon";

interface Props {
  value: Area | null;
  onChange: (area: Area) => void;
  label: string;
  placeholder: string;
  anchor?: "left" | "right";
}

export default function AreaPicker({ value, onChange, label, placeholder, anchor = "left" }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const groups = useMemo(() => {
    const filtered = SG_AREAS.filter(
      a =>
        a.name.toLowerCase().includes(q.toLowerCase()) ||
        a.region.toLowerCase().includes(q.toLowerCase())
    );
    const byRegion: Record<string, Area[]> = {};
    filtered.forEach(a => {
      if (!byRegion[a.region]) byRegion[a.region] = [];
      byRegion[a.region].push(a);
    });
    return byRegion;
  }, [q]);

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
              onChange={e => setQ(e.target.value)}
              placeholder="Search planning area"
            />
          </div>
          <div className="cpc-popover-list">
            {Object.entries(groups).map(([region, areas]) => (
              <div key={region}>
                <div className="cpc-popover-group">{region}</div>
                {areas.map(a => (
                  <button
                    key={a.id}
                    className={"cpc-popover-item" + (value?.id === a.id ? " is-selected" : "")}
                    onClick={() => { onChange(a); setOpen(false); setQ(""); }}
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
            {Object.keys(groups).length === 0 && (
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
