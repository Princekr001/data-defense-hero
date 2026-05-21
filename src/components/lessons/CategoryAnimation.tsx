import type { LessonCategory } from "@/data/categoryLessons";

/**
 * 2D character animated SVG scenes — one per topic.
 * Each scene is a self-contained <svg> with scoped <style> using @keyframes
 * lasting 18–22s on infinite loop. Pure SVG/CSS, no external deps.
 *
 * The "character" is a friendly stick-figure style hero who acts out the
 * threat and the safe response in a short visual story.
 */

interface Props {
  category: LessonCategory;
  className?: string;
}

// Shared character body (centered around x=cx, baseline y=by).
const Hero = ({ id, cx, by, color = "#22d3ee" }: { id: string; cx: number; by: number; color?: string }) => (
  <g id={id}>
    {/* head */}
    <circle cx={cx} cy={by - 70} r="14" fill="#fde68a" stroke="#1f2937" strokeWidth="1.5" />
    {/* eyes */}
    <circle cx={cx - 4} cy={by - 72} r="1.5" fill="#111827" />
    <circle cx={cx + 4} cy={by - 72} r="1.5" fill="#111827" />
    {/* smile */}
    <path d={`M${cx - 4} ${by - 66} Q${cx} ${by - 62} ${cx + 4} ${by - 66}`} stroke="#111827" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* body */}
    <rect x={cx - 12} y={by - 56} width="24" height="32" rx="6" fill={color} stroke="#0f172a" strokeWidth="1.5" />
    {/* arms */}
    <line x1={cx - 12} y1={by - 50} x2={cx - 22} y2={by - 36} stroke={color} strokeWidth="5" strokeLinecap="round" />
    <line x1={cx + 12} y1={by - 50} x2={cx + 22} y2={by - 36} stroke={color} strokeWidth="5" strokeLinecap="round" />
    {/* legs */}
    <line x1={cx - 6} y1={by - 24} x2={cx - 8} y2={by} stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
    <line x1={cx + 6} y1={by - 24} x2={cx + 8} y2={by} stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
  </g>
);

const Badge = ({ x, y, text, color }: { x: number; y: number; text: string; color: string }) => (
  <g>
    <rect x={x} y={y} rx="6" ry="6" width="78" height="22" fill={color} opacity="0.9" />
    <text x={x + 39} y={y + 15} textAnchor="middle" fontSize="11" fontFamily="ui-sans-serif, system-ui" fontWeight="700" fill="#0b1020">
      {text}
    </text>
  </g>
);

export default function CategoryAnimation({ category, className }: Props) {
  const common = `w-full h-56 sm:h-64 rounded-lg ${className ?? ""}`;
  switch (category) {
    case "phishing":
      return <PhishingScene className={common} />;
    case "password":
      return <PasswordScene className={common} />;
    case "social":
      return <SocialScene className={common} />;
    case "network":
      return <NetworkScene className={common} />;
    case "malware":
      return <MalwareScene className={common} />;
    case "privacy":
      return <PrivacyScene className={common} />;
    case "scam":
      return <ScamScene className={common} />;
    case "gaming":
      return <GamingScene className={common} />;
  }
}

/* ----------------------- SCENES ----------------------- */

const sky = (
  <defs>
    <linearGradient id="bg-sky" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="#0b1326" />
      <stop offset="100%" stopColor="#1e293b" />
    </linearGradient>
    <linearGradient id="floor" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
    </linearGradient>
  </defs>
);

function PhishingScene({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Phishing animation">
      <style>{`
        .ph-bait { animation: phBait 20s ease-in-out infinite; transform-origin: 70px 40px; }
        .ph-hero { animation: phHero 20s ease-in-out infinite; transform-origin: 200px 180px; }
        .ph-warn { opacity: 0; animation: phWarn 20s ease-in-out infinite; }
        .ph-shield { opacity: 0; animation: phShield 20s ease-in-out infinite; transform-origin: 200px 110px; }
        @keyframes phBait {
          0%,5% { transform: translate(0,0) rotate(0); }
          25%   { transform: translate(120px,90px) rotate(15deg); }
          45%   { transform: translate(120px,90px) rotate(-10deg); }
          55%   { transform: translate(120px,90px) rotate(0); }
          75%,100% { transform: translate(0,0) rotate(0); }
        }
        @keyframes phHero {
          0%,25% { transform: translate(0,0); }
          40%    { transform: translate(0,-4px); }
          55%    { transform: translate(0,0); }
          70%    { transform: translate(-20px,0); }
          100%   { transform: translate(0,0); }
        }
        @keyframes phWarn { 0%,40% { opacity: 0 } 50%,65% { opacity: 1 } 70%,100% { opacity: 0 } }
        @keyframes phShield { 0%,70% { opacity: 0; transform: scale(0.6) } 80%,95% { opacity: 1; transform: scale(1) } 100% { opacity: 0 } }
      `}</style>
      {sky}
      <rect width="400" height="220" fill="url(#bg-sky)" />
      <rect y="180" width="400" height="40" fill="url(#floor)" />
      {/* attacker w/ rod */}
      <g>
        <circle cx="40" cy="60" r="10" fill="#1f2937" />
        <rect x="32" y="68" width="16" height="22" fill="#7f1d1d" />
        <line x1="48" y1="70" x2="80" y2="40" stroke="#9ca3af" strokeWidth="2" />
        {/* fishing line */}
        <line x1="80" y1="40" x2="80" y2="120" stroke="#9ca3af" strokeWidth="1" className="ph-bait" />
      </g>
      {/* bait email */}
      <g className="ph-bait">
        <rect x="58" y="115" width="44" height="30" rx="3" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
        <text x="80" y="135" textAnchor="middle" fontSize="14" fill="#b45309" fontWeight="700">✉</text>
      </g>
      {/* hero */}
      <g className="ph-hero">
        <Hero id="ph-h" cx={220} by={180} color="#22d3ee" />
      </g>
      {/* warning */}
      <g className="ph-warn">
        <text x="220" y="100" textAnchor="middle" fontSize="22" fill="#f59e0b">⚠</text>
        <text x="220" y="118" textAnchor="middle" fontSize="10" fill="#fcd34d" fontWeight="700">Suspicious!</text>
      </g>
      {/* shield */}
      <g className="ph-shield">
        <path d="M200 95 l18 7 v15 c0 14 -10 24 -18 28 c-8 -4 -18 -14 -18 -28 v-15 z" fill="#10b981" stroke="#064e3b" strokeWidth="1.5" />
        <text x="200" y="130" textAnchor="middle" fontSize="14" fill="white" fontWeight="700">✓</text>
      </g>
      <Badge x={6} y={6} text="DON'T CLICK" color="#fbbf24" />
    </svg>
  );
}

function PasswordScene({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Password animation">
      <style>{`
        .pw-weak  { animation: pwWeak  20s ease-in-out infinite; }
        .pw-crack { animation: pwCrack 20s ease-in-out infinite; transform-origin: 110px 110px; opacity: 0; }
        .pw-strong { opacity: 0; animation: pwStrong 20s ease-in-out infinite; }
        .pw-hero { animation: pwHero 20s ease-in-out infinite; transform-origin: 320px 180px; }
        .pw-key  { animation: pwKey 20s ease-in-out infinite; transform-origin: 320px 120px; }
        @keyframes pwWeak  { 0%,30% { opacity:1 } 40%,100% { opacity:0 } }
        @keyframes pwCrack { 0%,15% { opacity:0; transform: scale(0.6) } 25%,38% { opacity:1; transform: scale(1.1) } 45%,100% { opacity:0 } }
        @keyframes pwStrong { 0%,45% { opacity:0 } 55%,100% { opacity:1 } }
        @keyframes pwHero { 0%,40% { transform: translate(0,0) } 55% { transform: translate(0,-6px) } 70%,100% { transform: translate(0,0) } }
        @keyframes pwKey  { 0%,40% { transform: rotate(0) } 55% { transform: rotate(-25deg) } 80%,100% { transform: rotate(0) } }
      `}</style>
      {sky}
      <rect width="400" height="220" fill="url(#bg-sky)" />
      <rect y="180" width="400" height="40" fill="url(#floor)" />
      {/* weak vault */}
      <g>
        <rect x="60" y="80" width="100" height="80" rx="6" fill="#1e293b" stroke="#475569" />
        <circle cx="110" cy="120" r="22" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
        <text x="110" y="125" textAnchor="middle" fontSize="14" fill="#fbbf24" fontWeight="700" className="pw-weak">1234</text>
        <text x="110" y="125" textAnchor="middle" fontSize="14" fill="#10b981" fontWeight="700" className="pw-strong">●●●●●●●●●●●●●●●●</text>
      </g>
      {/* hammer crack */}
      <g className="pw-crack">
        <line x1="20" y1="60" x2="100" y2="110" stroke="#7f1d1d" strokeWidth="4" />
        <rect x="0" y="40" width="34" height="30" fill="#9ca3af" stroke="#1f2937" />
        <text x="125" y="105" fontSize="22" fill="#ef4444" fontWeight="700">✗</text>
      </g>
      {/* hero with key */}
      <g className="pw-hero">
        <Hero id="pw-h" cx={320} by={180} color="#a78bfa" />
      </g>
      <g className="pw-key">
        <circle cx="320" cy="118" r="6" fill="none" stroke="#fbbf24" strokeWidth="3" />
        <line x1="320" y1="124" x2="320" y2="142" stroke="#fbbf24" strokeWidth="3" />
        <line x1="320" y1="135" x2="326" y2="135" stroke="#fbbf24" strokeWidth="3" />
      </g>
      <Badge x={6} y={6} text="USE 16+ CHARS" color="#a78bfa" />
    </svg>
  );
}

function SocialScene({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Social engineering animation">
      <style>{`
        .so-mask { animation: soMask 20s ease-in-out infinite; transform-origin: 80px 70px; }
        .so-chat { opacity: 0; animation: soChat 20s ease-in-out infinite; }
        .so-pause { opacity: 0; animation: soPause 20s ease-in-out infinite; }
        @keyframes soMask { 0%,30% { transform: translateY(0) } 45% { transform: translateY(-6px) rotate(-8deg) } 60%,100% { transform: translateY(0) } }
        @keyframes soChat { 0%,15% { opacity:0 } 25%,55% { opacity:1 } 65%,100% { opacity:0 } }
        @keyframes soPause { 0%,60% { opacity:0 } 70%,100% { opacity:1 } }
      `}</style>
      {sky}
      <rect width="400" height="220" fill="url(#bg-sky)" />
      <rect y="180" width="400" height="40" fill="url(#floor)" />
      {/* attacker w/ mask */}
      <g>
        <Hero id="so-att" cx={80} by={180} color="#7f1d1d" />
        <g className="so-mask">
          <rect x="68" y="60" width="24" height="10" rx="2" fill="#111827" />
        </g>
      </g>
      {/* speech bubble */}
      <g className="so-chat">
        <path d="M115 90 q5 -25 30 -25 h130 q25 0 25 25 v20 q0 25 -25 25 h-110 l-20 15 v-15 h-5 q-25 0 -25 -25 z" fill="#0f172a" stroke="#22d3ee" />
        <text x="210" y="105" textAnchor="middle" fontSize="11" fill="#e2e8f0" fontWeight="600">"Hi, IT support. What's your code?"</text>
        <text x="210" y="122" textAnchor="middle" fontSize="10" fill="#94a3b8">…urgent, please share quickly</text>
      </g>
      {/* hero */}
      <Hero id="so-h" cx={320} by={180} color="#22d3ee" />
      <g className="so-pause">
        <text x="320" y="105" textAnchor="middle" fontSize="20" fill="#fbbf24">✋</text>
        <text x="320" y="122" textAnchor="middle" fontSize="10" fill="#fbbf24" fontWeight="700">Verify first</text>
      </g>
      <Badge x={6} y={6} text="NEVER SHARE OTP" color="#f87171" />
    </svg>
  );
}

function NetworkScene({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Network safety animation">
      <style>{`
        .nw-wave { animation: nwWave 4s linear infinite; transform-origin: 200px 60px; }
        .nw-spy  { animation: nwSpy  20s ease-in-out infinite; }
        .nw-vpn  { opacity: 0; animation: nwVpn 20s ease-in-out infinite; transform-origin: 200px 130px; }
        @keyframes nwWave { 0% { opacity: 0.2; transform: scale(0.6) } 100% { opacity: 0; transform: scale(1.3) } }
        @keyframes nwSpy { 0%,40% { transform: translateX(0); opacity: 1 } 55%,100% { transform: translateX(-60px); opacity: 0 } }
        @keyframes nwVpn { 0%,45% { opacity: 0; transform: scale(0.6) } 55%,100% { opacity: 1; transform: scale(1) } }
      `}</style>
      {sky}
      <rect width="400" height="220" fill="url(#bg-sky)" />
      <rect y="180" width="400" height="40" fill="url(#floor)" />
      {/* router */}
      <g>
        <rect x="180" y="50" width="40" height="20" rx="3" fill="#1e293b" stroke="#22d3ee" />
        <line x1="190" y1="50" x2="186" y2="36" stroke="#22d3ee" strokeWidth="2" />
        <line x1="210" y1="50" x2="214" y2="36" stroke="#22d3ee" strokeWidth="2" />
        <circle cx="200" cy="60" r="20" fill="none" stroke="#22d3ee" strokeWidth="1.5" className="nw-wave" />
        <circle cx="200" cy="60" r="30" fill="none" stroke="#22d3ee" strokeWidth="1.5" className="nw-wave" style={{ animationDelay: "1s" }} />
        <circle cx="200" cy="60" r="40" fill="none" stroke="#22d3ee" strokeWidth="1.5" className="nw-wave" style={{ animationDelay: "2s" }} />
      </g>
      {/* spy */}
      <g className="nw-spy">
        <Hero id="nw-spy" cx={80} by={180} color="#7f1d1d" />
        <text x="80" y="100" textAnchor="middle" fontSize="14">🕶</text>
      </g>
      {/* hero */}
      <Hero id="nw-h" cx={320} by={180} color="#22d3ee" />
      {/* vpn tunnel */}
      <g className="nw-vpn">
        <rect x="120" y="120" width="160" height="24" rx="12" fill="#10b981" opacity="0.4" />
        <text x="200" y="137" textAnchor="middle" fontSize="11" fill="#ecfdf5" fontWeight="700">VPN tunnel</text>
      </g>
      <Badge x={6} y={6} text="USE VPN ON WIFI" color="#34d399" />
    </svg>
  );
}

function MalwareScene({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Malware animation">
      <style>{`
        .mw-virus { animation: mwVirus 20s ease-in-out infinite; transform-origin: 60px 80px; }
        .mw-screen { animation: mwScreen 20s ease-in-out infinite; }
        .mw-scan { opacity: 0; animation: mwScan 20s ease-in-out infinite; }
        @keyframes mwVirus {
          0%,10% { transform: translate(0,0) rotate(0); opacity: 1 }
          30%    { transform: translate(120px,40px) rotate(180deg); opacity: 1 }
          45%    { transform: translate(120px,40px) rotate(180deg); opacity: 0 }
          100%   { opacity: 0 }
        }
        @keyframes mwScreen {
          0%,28% { fill: #0f172a }
          32%,55% { fill: #7f1d1d }
          60%,100% { fill: #064e3b }
        }
        @keyframes mwScan { 0%,55% { opacity:0 } 65%,100% { opacity:1 } }
      `}</style>
      {sky}
      <rect width="400" height="220" fill="url(#bg-sky)" />
      <rect y="180" width="400" height="40" fill="url(#floor)" />
      {/* laptop */}
      <g>
        <rect x="160" y="90" width="160" height="80" rx="4" fill="#1f2937" stroke="#475569" />
        <rect x="170" y="100" width="140" height="60" rx="2" className="mw-screen" />
        <rect x="150" y="170" width="180" height="10" rx="2" fill="#334155" />
      </g>
      {/* hero */}
      <Hero id="mw-h" cx={350} by={180} color="#22d3ee" />
      {/* virus */}
      <g className="mw-virus">
        <circle cx="60" cy="80" r="14" fill="#7f1d1d" stroke="#fca5a5" strokeWidth="1.5" />
        <line x1="60" y1="60" x2="60" y2="50" stroke="#fca5a5" strokeWidth="2" />
        <line x1="60" y1="100" x2="60" y2="110" stroke="#fca5a5" strokeWidth="2" />
        <line x1="40" y1="80" x2="30" y2="80" stroke="#fca5a5" strokeWidth="2" />
        <line x1="80" y1="80" x2="90" y2="80" stroke="#fca5a5" strokeWidth="2" />
        <text x="60" y="85" textAnchor="middle" fontSize="12" fill="white" fontWeight="700">!</text>
      </g>
      {/* scan ok */}
      <g className="mw-scan">
        <text x="240" y="135" textAnchor="middle" fontSize="22" fill="#34d399" fontWeight="700">✓</text>
        <text x="240" y="152" textAnchor="middle" fontSize="10" fill="#bbf7d0" fontWeight="600">Updated &amp; scanned</text>
      </g>
      <Badge x={6} y={6} text="UPDATE EVERYTHING" color="#34d399" />
    </svg>
  );
}

function PrivacyScene({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Privacy animation">
      <style>{`
        .pr-post { animation: prPost 20s ease-in-out infinite; transform-origin: 110px 100px; }
        .pr-eye  { animation: prEye  20s ease-in-out infinite; transform-origin: 320px 80px; }
        .pr-lock { opacity: 0; animation: prLock 20s ease-in-out infinite; }
        @keyframes prPost { 0%,30% { transform: scale(1) } 45% { transform: scale(1.08) } 70%,100% { transform: scale(0.9); opacity: 0.4 } }
        @keyframes prEye  { 0%,30% { transform: translateX(0); opacity: 1 } 60%,100% { transform: translateX(40px); opacity: 0 } }
        @keyframes prLock { 0%,60% { opacity: 0 } 70%,100% { opacity: 1 } }
      `}</style>
      {sky}
      <rect width="400" height="220" fill="url(#bg-sky)" />
      <rect y="180" width="400" height="40" fill="url(#floor)" />
      {/* hero with phone */}
      <Hero id="pr-h" cx={110} by={180} color="#22d3ee" />
      <g className="pr-post">
        <rect x="80" y="80" width="60" height="44" rx="4" fill="#0f172a" stroke="#22d3ee" />
        <circle cx="92" cy="94" r="4" fill="#fbbf24" />
        <rect x="100" y="92" width="32" height="3" fill="#475569" />
        <rect x="84" y="104" width="48" height="16" rx="2" fill="#1e293b" />
        <text x="108" y="116" textAnchor="middle" fontSize="9" fill="#94a3b8">📍 Home, 8pm</text>
      </g>
      {/* watching eye */}
      <g className="pr-eye">
        <ellipse cx="320" cy="80" rx="22" ry="12" fill="#0f172a" stroke="#f87171" strokeWidth="2" />
        <circle cx="320" cy="80" r="6" fill="#f87171" />
        <circle cx="320" cy="80" r="2" fill="#0f172a" />
      </g>
      {/* lock appears */}
      <g className="pr-lock">
        <rect x="290" y="70" width="60" height="50" rx="6" fill="#10b981" />
        <rect x="306" y="60" width="28" height="20" rx="10" fill="none" stroke="#10b981" strokeWidth="4" />
        <text x="320" y="103" textAnchor="middle" fontSize="14" fill="white" fontWeight="700">🔒</text>
      </g>
      <Badge x={6} y={6} text="LOCK YOUR PROFILE" color="#34d399" />
    </svg>
  );
}

function ScamScene({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Scam animation">
      <style>{`
        .sc-prize { animation: scPrize 20s ease-in-out infinite; transform-origin: 110px 100px; }
        .sc-cash  { animation: scCash 20s ease-in-out infinite; }
        .sc-no    { opacity: 0; animation: scNo 20s ease-in-out infinite; }
        @keyframes scPrize { 0%,40% { transform: rotate(-4deg) } 50% { transform: rotate(4deg) } 65%,100% { transform: rotate(0) scale(0.7); opacity: 0.5 } }
        @keyframes scCash  { 0%,40% { transform: translateY(0); opacity: 1 } 60% { transform: translateY(-40px); opacity: 0 } 100% { opacity: 0 } }
        @keyframes scNo    { 0%,55% { opacity: 0 } 65%,100% { opacity: 1 } }
      `}</style>
      {sky}
      <rect width="400" height="220" fill="url(#bg-sky)" />
      <rect y="180" width="400" height="40" fill="url(#floor)" />
      {/* fake prize box */}
      <g className="sc-prize">
        <rect x="80" y="80" width="60" height="50" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
        <rect x="105" y="80" width="10" height="50" fill="#b45309" />
        <rect x="80" y="100" width="60" height="6" fill="#b45309" />
        <text x="110" y="155" textAnchor="middle" fontSize="11" fill="#fcd34d" fontWeight="700">YOU WON!</text>
      </g>
      {/* hero */}
      <Hero id="sc-h" cx={250} by={180} color="#22d3ee" />
      {/* cash flying away */}
      <g className="sc-cash">
        <rect x="240" y="115" width="20" height="12" fill="#34d399" stroke="#065f46" />
        <text x="250" y="125" textAnchor="middle" fontSize="9" fill="#065f46" fontWeight="700">$</text>
      </g>
      {/* No badge */}
      <g className="sc-no">
        <circle cx="250" cy="100" r="18" fill="none" stroke="#ef4444" strokeWidth="4" />
        <line x1="238" y1="88" x2="262" y2="112" stroke="#ef4444" strokeWidth="4" />
        <text x="250" y="135" textAnchor="middle" fontSize="10" fill="#fca5a5" fontWeight="700">Ignore &amp; report</text>
      </g>
      <Badge x={6} y={6} text="TOO GOOD = FAKE" color="#fbbf24" />
    </svg>
  );
}

function GamingScene({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Gaming safety animation">
      <style>{`
        .gm-lure { animation: gmLure 20s ease-in-out infinite; transform-origin: 110px 90px; }
        .gm-key  { animation: gmKey 20s ease-in-out infinite; transform-origin: 250px 110px; }
        .gm-2fa  { opacity: 0; animation: gm2fa 20s ease-in-out infinite; }
        @keyframes gmLure { 0%,30% { transform: scale(1) } 45% { transform: scale(1.1) } 60%,100% { transform: scale(0.6); opacity: 0.3 } }
        @keyframes gmKey  { 0%,40% { transform: translateX(0) } 55% { transform: translateX(-60px) rotate(-30deg) } 70%,100% { transform: translateX(0) rotate(0) } }
        @keyframes gm2fa  { 0%,55% { opacity: 0 } 65%,100% { opacity: 1 } }
      `}</style>
      {sky}
      <rect width="400" height="220" fill="url(#bg-sky)" />
      <rect y="180" width="400" height="40" fill="url(#floor)" />
      {/* lure: free skins popup */}
      <g className="gm-lure">
        <rect x="70" y="70" width="80" height="50" rx="6" fill="#0f172a" stroke="#a78bfa" />
        <text x="110" y="90" textAnchor="middle" fontSize="10" fill="#a78bfa" fontWeight="700">FREE SKINS</text>
        <text x="110" y="105" textAnchor="middle" fontSize="8" fill="#cbd5e1">claim now!</text>
        <text x="110" y="116" textAnchor="middle" fontSize="9" fill="#fbbf24">★★★</text>
      </g>
      {/* hero w/ controller */}
      <Hero id="gm-h" cx={270} by={180} color="#22d3ee" />
      <g>
        <ellipse cx="270" cy="135" rx="22" ry="10" fill="#1f2937" stroke="#22d3ee" />
        <circle cx="262" cy="135" r="2" fill="#22d3ee" />
        <circle cx="278" cy="135" r="2" fill="#22d3ee" />
      </g>
      {/* attacker reaching for account key */}
      <g className="gm-key">
        <circle cx="250" cy="108" r="5" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
        <line x1="250" y1="113" x2="250" y2="125" stroke="#fbbf24" strokeWidth="2.5" />
      </g>
      {/* 2FA shield */}
      <g className="gm-2fa">
        <rect x="320" y="60" width="60" height="40" rx="6" fill="#10b981" />
        <text x="350" y="85" textAnchor="middle" fontSize="14" fill="white" fontWeight="700">2FA ✓</text>
      </g>
      <Badge x={6} y={6} text="ENABLE 2FA" color="#a78bfa" />
    </svg>
  );
}
