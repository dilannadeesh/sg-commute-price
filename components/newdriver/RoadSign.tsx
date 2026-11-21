import type { SignType } from "@/lib/newdriver/btt";

const RED = "#C8102E", BLUE = "#0057B8";

function Prohibit({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={label}>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke={RED} strokeWidth="9" />
      {children}
      <line x1="20" y1="20" x2="80" y2="80" stroke={RED} strokeWidth="9" />
    </svg>
  );
}

function Arrow({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />;
}

function Blue({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={label}>
      <circle cx="50" cy="50" r="47" fill={BLUE} />
      {children}
    </svg>
  );
}

function Speed({ n }: { n: number }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={`Speed limit ${n} sign`}>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke={RED} strokeWidth="9" />
      <text x="50" y="63" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="38" fill="#111">{n}</text>
    </svg>
  );
}

export default function RoadSign({ type, size = 120 }: { type: SignType; size?: number }) {
  let svg: React.ReactNode;
  switch (type) {
    case "stop":
      svg = (
        <svg viewBox="0 0 100 100" role="img" aria-label="Stop sign">
          <polygon points="30,3 70,3 97,30 97,70 70,97 30,97 3,70 3,30" fill={RED} stroke="#fff" strokeWidth="3" />
          <text x="50" y="60" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="27" fill="#fff">STOP</text>
        </svg>
      );
      break;
    case "give-way":
      svg = (
        <svg viewBox="0 0 100 100" role="img" aria-label="Give way sign">
          <polygon points="5,10 95,10 50,92" fill="#fff" stroke={RED} strokeWidth="9" strokeLinejoin="round" />
        </svg>
      );
      break;
    case "no-entry":
      svg = (
        <svg viewBox="0 0 100 100" role="img" aria-label="No entry sign">
          <circle cx="50" cy="50" r="47" fill={RED} />
          <rect x="18" y="41" width="64" height="18" fill="#fff" />
        </svg>
      );
      break;
    case "speed-40": svg = <Speed n={40} />; break;
    case "speed-50": svg = <Speed n={50} />; break;
    case "speed-70": svg = <Speed n={70} />; break;
    case "speed-90": svg = <Speed n={90} />; break;
    case "no-u-turn":
      svg = <Prohibit label="No U-turn sign"><Arrow d="M38 78 V42 a12 12 0 0 1 24 0 V62" /><path d="M52 56 L62 70 L72 56" fill="#111" /></Prohibit>;
      break;
    case "no-right-turn":
      svg = <Prohibit label="No right turn sign"><Arrow d="M40 80 V48 H62" /><path d="M60 36 L76 48 L60 60 Z" fill="#111" /></Prohibit>;
      break;
    case "no-left-turn":
      svg = <Prohibit label="No left turn sign"><Arrow d="M60 80 V48 H38" /><path d="M40 36 L24 48 L40 60 Z" fill="#111" /></Prohibit>;
      break;
    case "keep-left":
      svg = <Blue label="Keep left sign"><path d="M70 28 L38 60" stroke="#fff" strokeWidth="10" strokeLinecap="round" /><path d="M28 48 L28 72 L52 72 Z" fill="#fff" /></Blue>;
      break;
    case "turn-left":
      svg = <Blue label="Turn left sign"><path d="M62 80 V52 a10 10 0 0 0 -10 -10 H40" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" /><path d="M42 28 L24 42 L42 56 Z" fill="#fff" /></Blue>;
      break;
    case "ahead-only":
      svg = <Blue label="Ahead only sign"><path d="M50 80 V38" stroke="#fff" strokeWidth="10" strokeLinecap="round" /><path d="M34 42 L50 20 L66 42 Z" fill="#fff" /></Blue>;
      break;
    case "warning":
      svg = (
        <svg viewBox="0 0 100 100" role="img" aria-label="Warning sign">
          <polygon points="50,6 95,88 5,88" fill="#fff" stroke={RED} strokeWidth="9" strokeLinejoin="round" />
          <rect x="45.5" y="36" width="9" height="28" rx="3" fill="#111" />
          <circle cx="50" cy="74" r="5" fill="#111" />
        </svg>
      );
      break;
  }
  return <div className="road-sign" style={{ width: size, height: size }}>{svg}</div>;
}
