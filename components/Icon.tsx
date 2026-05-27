"use client";

interface Props {
  name: string;
  size?: number;
  stroke?: number;
  color?: string;
}

export default function Icon({ name, size = 18, stroke = 2, color = "currentColor" }: Props) {
  const c = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "swap":
      return <svg {...c}><path d="M7 4v16M3 8l4-4 4 4M17 20V4M21 16l-4 4-4-4"/></svg>;
    case "search":
      return <svg {...c}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "pin":
      return <svg {...c}><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case "flag":
      return <svg {...c}><path d="M5 21V4M5 4h13l-2 4 2 4H5"/></svg>;
    case "clock":
      return <svg {...c}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "spark":
      return <svg {...c}><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>;
    case "dollar":
      return <svg {...c}><path d="M12 3v18M17 7H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H7"/></svg>;
    case "trend":
      return <svg {...c}><path d="M3 17l6-6 4 4 8-8M14 7h7v7"/></svg>;
    case "x":
      return <svg {...c}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "arrow":
      return <svg {...c}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case "transfer":
      return <svg {...c}><path d="M3 7h13l-3-3M21 17H8l3 3"/></svg>;
    case "chevron":
      return <svg {...c}><path d="M6 9l6 6 6-6"/></svg>;
    case "locate":
      return <svg {...c}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="9"/></svg>;
    default:
      return null;
  }
}
