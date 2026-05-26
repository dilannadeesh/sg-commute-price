"use client";

import { useState, useRef, useEffect } from "react";
import { TIME_BLOCKS } from "@/lib/quote";
import type { TimeBlock } from "@/lib/types";

interface Props {
  value: TimeBlock;
  onChange: (t: TimeBlock) => void;
  label?: string;
}

export default function TimePicker({ value, onChange, label = "When" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <button type="button" onClick={() => setOpen(o => !o)} className="cpc-field">
        <span className="cpc-field-label">{label}</span>
        <span className="cpc-field-value">{value.label}</span>
      </button>
      {open && (
        <div className="cpc-popover" style={{ right: 0, width: 320 }}>
          <div className="cpc-popover-list" style={{ padding: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {TIME_BLOCKS.map(t => (
                <button
                  key={t.id}
                  className={"cpc-time-cell" + (t.id === value.id ? " is-selected" : "")}
                  onClick={() => { onChange(t); setOpen(false); }}
                >
                  <span style={{ font: "var(--type-body-sm)" }}>{t.label}</span>
                  {t.surge >= 1.30 && (
                    <span className="cpc-surge-dot" title={t.surgeLabel ?? undefined} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
