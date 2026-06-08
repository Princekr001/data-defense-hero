import { Mail, Lock, Users, Wifi, Download, Eye, DollarSign, Gamepad2 } from "lucide-react";

type Category = "phishing" | "password" | "social" | "network" | "malware" | "privacy" | "scam" | "gaming";

interface Props {
  category: Category;
  title?: string;
}

const META: Record<Category, { hue: string; accent: string; label: string; Icon: typeof Mail }> = {
  phishing: { hue: "#f97316", accent: "#fbbf24", label: "Phishing vector", Icon: Mail },
  password: { hue: "#22d3ee", accent: "#a78bfa", label: "Credential risk", Icon: Lock },
  social:   { hue: "#ec4899", accent: "#f472b6", label: "Social engineering", Icon: Users },
  network:  { hue: "#3b82f6", accent: "#60a5fa", label: "Network exposure", Icon: Wifi },
  malware:  { hue: "#ef4444", accent: "#f87171", label: "Malicious payload", Icon: Download },
  privacy:  { hue: "#8b5cf6", accent: "#a78bfa", label: "Data privacy", Icon: Eye },
  scam:     { hue: "#eab308", accent: "#facc15", label: "Financial scam", Icon: DollarSign },
  gaming:   { hue: "#10b981", accent: "#34d399", label: "Gaming threat", Icon: Gamepad2 },
};

// Iconographic SVG scene per category — characters + devices, no external assets.
function Scene({ category, hue, accent }: { category: Category; hue: string; accent: string }) {
  const common = (
    <>
      <defs>
        <linearGradient id={`bg-${category}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={hue} stopOpacity="0.25" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.05" />
        </linearGradient>
        <pattern id={`grid-${category}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={hue} strokeOpacity="0.12" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="180" fill={`url(#bg-${category})`} />
      <rect width="400" height="180" fill={`url(#grid-${category})`} />
    </>
  );

  switch (category) {
    case "phishing":
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full">
          {common}
          {/* attacker */}
          <circle cx="60" cy="70" r="18" fill={hue} opacity="0.9" />
          <rect x="42" y="90" width="36" height="40" rx="6" fill={hue} opacity="0.7" />
          <text x="60" y="150" textAnchor="middle" fontSize="10" fill="#fff" opacity="0.8">Attacker</text>
          {/* envelope flying */}
          <g transform="translate(150 70)">
            <rect width="60" height="40" rx="4" fill="#fff" opacity="0.9" />
            <path d="M0 0 L30 22 L60 0" stroke={hue} strokeWidth="2" fill="none" />
            <text x="30" y="55" textAnchor="middle" fontSize="9" fill="#fff" opacity="0.7">"Urgent!"</text>
          </g>
          {/* dashed flight path */}
          <path d="M90 80 Q 180 30 280 95" stroke={accent} strokeWidth="2" strokeDasharray="4 4" fill="none" />
          {/* victim laptop */}
          <g transform="translate(280 80)">
            <rect width="70" height="44" rx="3" fill={accent} opacity="0.85" />
            <rect x="4" y="4" width="62" height="36" fill="#0a0a1a" />
            <rect x="-6" y="44" width="82" height="4" rx="1" fill={accent} opacity="0.6" />
            <text x="35" y="26" textAnchor="middle" fontSize="14" fill={hue}>!</text>
          </g>
          <text x="315" y="150" textAnchor="middle" fontSize="10" fill="#fff" opacity="0.8">You</text>
        </svg>
      );
    case "password":
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full">
          {common}
          {/* vault */}
          <g transform="translate(140 35)">
            <rect width="120" height="110" rx="8" fill={hue} opacity="0.25" stroke={hue} strokeWidth="2" />
            <circle cx="60" cy="55" r="26" fill="none" stroke={accent} strokeWidth="3" />
            <circle cx="60" cy="55" r="6" fill={accent} />
            <rect x="56" y="55" width="8" height="22" fill={accent} />
          </g>
          {/* weak vs strong pw */}
          <g transform="translate(20 70)">
            <rect width="90" height="22" rx="3" fill="#0a0a1a" stroke="#ef4444" />
            <text x="45" y="16" textAnchor="middle" fontSize="11" fill="#ef4444" fontFamily="monospace">123456</text>
            <text x="45" y="36" textAnchor="middle" fontSize="9" fill="#ef4444">weak</text>
          </g>
          <g transform="translate(290 70)">
            <rect width="90" height="22" rx="3" fill="#0a0a1a" stroke="#10b981" />
            <text x="45" y="16" textAnchor="middle" fontSize="11" fill="#10b981" fontFamily="monospace">k$7!nQp#9</text>
            <text x="45" y="36" textAnchor="middle" fontSize="9" fill="#10b981">strong</text>
          </g>
        </svg>
      );
    case "social":
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full">
          {common}
          {/* friend bubble */}
          <g transform="translate(40 50)">
            <circle cx="20" cy="20" r="18" fill={accent} />
            <rect x="50" y="6" width="140" height="40" rx="20" fill="#fff" opacity="0.95" />
            <text x="120" y="30" textAnchor="middle" fontSize="11" fill="#0a0a1a">"Send me your code?"</text>
          </g>
          {/* victim phone */}
          <g transform="translate(250 50)">
            <rect width="50" height="90" rx="8" fill={hue} opacity="0.8" />
            <rect x="4" y="10" width="42" height="70" fill="#0a0a1a" />
            <circle cx="25" cy="85" r="2" fill="#fff" />
            <text x="25" y="45" textAnchor="middle" fontSize="12" fill={accent}>?</text>
          </g>
          {/* arrow of manipulation */}
          <path d="M200 75 L 250 90" stroke={hue} strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#arrow)" />
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={hue} />
            </marker>
          </defs>
        </svg>
      );
    case "network":
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full">
          {common}
          {/* coffee cup */}
          <g transform="translate(30 70)">
            <path d="M5 10 L 5 50 Q 5 60 15 60 L 45 60 Q 55 60 55 50 L 55 10 Z" fill={accent} opacity="0.8" />
            <path d="M55 20 Q 70 20 70 35 Q 70 50 55 50" fill="none" stroke={accent} strokeWidth="3" />
            <text x="30" y="78" textAnchor="middle" fontSize="9" fill="#fff" opacity="0.7">Café WiFi</text>
          </g>
          {/* wifi waves */}
          <g transform="translate(180 90)" fill="none" stroke={hue} strokeWidth="2">
            <path d="M-30 10 Q 0 -20 30 10" />
            <path d="M-20 15 Q 0 -5 20 15" />
            <circle cx="0" cy="18" r="3" fill={hue} stroke="none" />
          </g>
          {/* eavesdropper */}
          <g transform="translate(290 60)">
            <circle cx="20" cy="20" r="16" fill={hue} opacity="0.9" />
            <rect x="6" y="38" width="28" height="32" rx="4" fill={hue} opacity="0.7" />
            <circle cx="13" cy="18" r="3" fill="#0a0a1a" />
            <circle cx="27" cy="18" r="3" fill="#0a0a1a" />
            <text x="20" y="88" textAnchor="middle" fontSize="9" fill="#fff" opacity="0.7">Sniffer</text>
          </g>
        </svg>
      );
    case "malware":
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full">
          {common}
          {/* download cloud */}
          <g transform="translate(60 40)">
            <path d="M20 30 Q 0 30 0 50 Q 0 70 25 70 L 80 70 Q 100 70 100 50 Q 100 30 80 30 Q 80 10 50 10 Q 25 10 20 30 Z" fill={accent} opacity="0.85" />
            <path d="M50 40 L 50 60 M 40 52 L 50 62 L 60 52" stroke="#0a0a1a" strokeWidth="3" fill="none" />
          </g>
          {/* file with bug */}
          <g transform="translate(230 50)">
            <path d="M0 0 L 60 0 L 80 20 L 80 90 L 0 90 Z" fill="#fff" opacity="0.9" />
            <path d="M60 0 L 60 20 L 80 20" fill="none" stroke={hue} strokeWidth="2" />
            <g transform="translate(40 50)">
              <ellipse cx="0" cy="0" rx="12" ry="10" fill={hue} />
              <line x1="-14" y1="-6" x2="-20" y2="-12" stroke={hue} strokeWidth="2" />
              <line x1="14" y1="-6" x2="20" y2="-12" stroke={hue} strokeWidth="2" />
              <line x1="-14" y1="6" x2="-20" y2="12" stroke={hue} strokeWidth="2" />
              <line x1="14" y1="6" x2="20" y2="12" stroke={hue} strokeWidth="2" />
              <circle cx="-4" cy="-2" r="2" fill="#fff" />
              <circle cx="4" cy="-2" r="2" fill="#fff" />
            </g>
            <text x="40" y="105" textAnchor="middle" fontSize="9" fill="#fff" opacity="0.7">free-software.exe</text>
          </g>
        </svg>
      );
    case "privacy":
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full">
          {common}
          {/* big eye */}
          <g transform="translate(200 90)">
            <ellipse cx="0" cy="0" rx="70" ry="38" fill="none" stroke={hue} strokeWidth="3" />
            <circle cx="0" cy="0" r="22" fill={accent} opacity="0.6" />
            <circle cx="0" cy="0" r="10" fill="#0a0a1a" />
            <circle cx="-4" cy="-4" r="3" fill="#fff" />
          </g>
          {/* data crumbs */}
          {[40, 90, 320, 360].map((x, i) => (
            <g key={i} transform={`translate(${x} ${i % 2 ? 40 : 140})`}>
              <rect width="30" height="14" rx="2" fill={hue} opacity="0.7" />
              <text x="15" y="11" textAnchor="middle" fontSize="8" fill="#0a0a1a" fontFamily="monospace">data</text>
            </g>
          ))}
        </svg>
      );
    case "scam":
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full">
          {common}
          {/* money bag */}
          <g transform="translate(50 50)">
            <path d="M20 20 Q 10 30 10 60 Q 10 90 50 90 Q 90 90 90 60 Q 90 30 80 20 Z" fill={accent} opacity="0.9" />
            <rect x="25" y="10" width="50" height="12" fill={hue} />
            <text x="50" y="65" textAnchor="middle" fontSize="20" fill="#0a0a1a" fontWeight="bold">$</text>
          </g>
          {/* hook */}
          <g transform="translate(220 30)" fill="none" stroke={hue} strokeWidth="3">
            <line x1="40" y1="0" x2="40" y2="50" />
            <path d="M40 50 Q 40 80 20 80 Q 5 80 5 65" />
            <circle cx="5" cy="62" r="3" fill={hue} />
          </g>
          {/* fake prize banner */}
          <g transform="translate(180 100)">
            <rect width="180" height="50" rx="6" fill="#fff" opacity="0.95" />
            <text x="90" y="22" textAnchor="middle" fontSize="11" fill={hue} fontWeight="bold">YOU WON $10,000!</text>
            <text x="90" y="38" textAnchor="middle" fontSize="9" fill="#0a0a1a">Click here to claim →</text>
          </g>
        </svg>
      );
    case "gaming":
      return (
        <svg viewBox="0 0 400 180" className="w-full h-full">
          {common}
          {/* controller */}
          <g transform="translate(90 60)">
            <path d="M0 30 Q 0 0 40 0 L 140 0 Q 180 0 180 30 Q 180 60 150 60 L 30 60 Q 0 60 0 30 Z" fill={hue} opacity="0.85" />
            <circle cx="40" cy="30" r="10" fill="#0a0a1a" />
            <circle cx="140" cy="30" r="10" fill="#0a0a1a" />
            <rect x="85" y="25" width="10" height="10" fill={accent} />
          </g>
          {/* chat scam bubble */}
          <g transform="translate(220 130)">
            <rect width="160" height="40" rx="20" fill="#fff" opacity="0.95" />
            <text x="80" y="18" textAnchor="middle" fontSize="10" fill="#0a0a1a">"Free V-Bucks!"</text>
            <text x="80" y="32" textAnchor="middle" fontSize="9" fill={hue}>send your login →</text>
          </g>
        </svg>
      );
  }
}

export default function ScenarioScene({ category, title }: Props) {
  const m = META[category];
  const Icon = m.Icon;
  return (
    <div className="relative rounded-xl overflow-hidden border-2 border-primary/20 bg-card/40 backdrop-blur-sm shadow-cyber">
      <div className="aspect-[20/9] w-full">
        <Scene category={category} hue={m.hue} accent={m.accent} />
      </div>
      <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur border border-white/10">
        <Icon className="h-3.5 w-3.5" style={{ color: m.hue }} />
        <span className="text-[10px] uppercase tracking-wider text-white/80">{m.label}</span>
      </div>
      {title && (
        <div className="absolute bottom-3 left-3 right-3 text-white drop-shadow-lg">
          <p className="text-[11px] opacity-70">Scenario reference</p>
          <p className="text-sm font-semibold leading-tight">{title}</p>
        </div>
      )}
    </div>
  );
}
