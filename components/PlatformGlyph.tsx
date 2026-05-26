"use client";

interface Props {
  id: string;
  color: string;
  size?: number;
}

export default function PlatformGlyph({ id, color, size = 22 }: Props) {
  const s = size;
  const stroke = 2;
  const common = {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (id) {
    case "grab":
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M8 14c1.5 1.5 6.5 1.5 8 0M9 10h.01M15 10h.01"/></svg>;
    case "tada":
      return <svg {...common}><path d="M3 12h6l3-7 3 14 3-7h3"/></svg>;
    case "gojek":
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "flexar":
      return <svg {...common}><path d="M3 12h18M7 12V8h10v4M5 12v6h2v-2h10v2h2v-6"/><circle cx="8" cy="16" r="1.4"/><circle cx="16" cy="16" r="1.4"/></svg>;
    case "publictransport":
      return <svg {...common}><rect x="5" y="3" width="14" height="14" rx="2"/><path d="M5 14h14M9 17l-2 4M15 17l2 4"/><circle cx="9" cy="11" r=".8" fill={color}/><circle cx="15" cy="11" r=".8" fill={color}/></svg>;
    case "getgo":
      return <svg {...common}><path d="M4 13l2-6h12l2 6M4 13v5h3v-2h10v2h3v-5"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>;
    default:
      return null;
  }
}
