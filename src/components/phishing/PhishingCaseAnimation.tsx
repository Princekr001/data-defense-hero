import { useEffect, useRef, useState } from "react";
import type { CasePanel, PhishingType } from "@/data/phishingStream";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";

interface Props {
  type: PhishingType;
  panels: CasePanel[];
  /** ms per panel */
  duration?: number;
}

/**
 * Auto-advancing 4-panel animated case study.
 * SVG/CSS only, respects prefers-reduced-motion via the Pause control.
 */
export default function PhishingCaseAnimation({ type, panels, duration = 6000 }: Props) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % panels.length);
    }, duration);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, duration, panels.length]);

  const panel = panels[idx];

  return (
    <div className="rounded-lg border border-border/50 bg-card/50 overflow-hidden">
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
        <SceneFor type={type} step={idx} />
        {/* progress dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {panels.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-primary" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="p-4 flex items-start gap-3">
        <div className="flex-1 min-h-[60px] animate-fade-in" key={idx}>
          <p className="text-xs uppercase tracking-wider text-primary font-bold mb-1">
            {panel.title}
          </p>
          <p className="text-sm text-foreground">{panel.caption}</p>
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIdx(0)}
            aria-label="Restart"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- scenes ---------------- */

function SceneFor({ type, step }: { type: PhishingType; step: number }) {
  if (type === "email") return <EmailScene step={step} />;
  if (type === "spear") return <SpearScene step={step} />;
  return <QuishingScene step={step} />;
}

const Hero = ({ cx, by, color }: { cx: number; by: number; color: string }) => (
  <g>
    <circle cx={cx} cy={by - 60} r="12" fill="#fde68a" stroke="#1f2937" strokeWidth="1.5" />
    <circle cx={cx - 3} cy={by - 62} r="1.4" fill="#111827" />
    <circle cx={cx + 3} cy={by - 62} r="1.4" fill="#111827" />
    <rect x={cx - 10} y={by - 48} width="20" height="28" rx="5" fill={color} stroke="#0f172a" strokeWidth="1.5" />
    <line x1={cx - 10} y1={by - 42} x2={cx - 20} y2={by - 28} stroke={color} strokeWidth="4" strokeLinecap="round" />
    <line x1={cx + 10} y1={by - 42} x2={cx + 20} y2={by - 28} stroke={color} strokeWidth="4" strokeLinecap="round" />
    <line x1={cx - 5} y1={by - 20} x2={cx - 7} y2={by} stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
    <line x1={cx + 5} y1={by - 20} x2={cx + 7} y2={by} stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
  </g>
);

function EmailScene({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-56" role="img" aria-label={`Email phishing panel ${step + 1}`}>
      <rect width="400" height="220" fill="transparent" />
      {step === 0 && (
        <g className="animate-fade-in">
          <rect x="40" y="60" width="80" height="50" rx="4" fill="#1f2937" stroke="#9ca3af" />
          <text x="80" y="90" textAnchor="middle" fontSize="22">📧</text>
          <text x="80" y="135" textAnchor="middle" fontSize="9" fill="#cbd5e1">secure-bank-alerts.co</text>
          <text x="280" y="80" textAnchor="middle" fontSize="11" fill="#fbbf24" fontWeight="700">10,000 emails sent</text>
          <g>
            <line x1="125" y1="85" x2="240" y2="100" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="125" y1="85" x2="240" y2="130" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="125" y1="85" x2="240" y2="160" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="250" cy="100" r="6" fill="#fde68a" />
            <circle cx="250" cy="130" r="6" fill="#fde68a" />
            <circle cx="250" cy="160" r="6" fill="#fde68a" />
          </g>
        </g>
      )}
      {step === 1 && (
        <g className="animate-fade-in">
          <Hero cx={100} by={180} color="#22d3ee" />
          <rect x="160" y="60" width="200" height="100" rx="6" fill="#0f172a" stroke="#7f1d1d" strokeWidth="2" />
          <text x="260" y="90" textAnchor="middle" fontSize="11" fill="#fca5a5" fontWeight="700">SecureBank Login</text>
          <rect x="180" y="100" width="160" height="14" fill="#1e293b" />
          <rect x="180" y="120" width="160" height="14" fill="#1e293b" />
          <rect x="180" y="138" width="60" height="14" rx="3" fill="#ef4444" />
          <text x="210" y="149" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">Sign in</text>
          <text x="260" y="180" textAnchor="middle" fontSize="10" fill="#fca5a5">Fake clone page</text>
        </g>
      )}
      {step === 2 && (
        <g className="animate-fade-in">
          <Hero cx={80} by={180} color="#22d3ee" />
          <text x="80" y="100" textAnchor="middle" fontSize="14" fill="#fca5a5">😰</text>
          <g>
            <rect x="160" y="80" width="140" height="60" rx="4" fill="#7f1d1d" stroke="#fca5a5" />
            <text x="230" y="105" textAnchor="middle" fontSize="11" fill="white" fontWeight="700">€ DRAINED</text>
            <text x="230" y="125" textAnchor="middle" fontSize="9" fill="#fecaca">Recovery email changed</text>
          </g>
          <g>
            <circle cx="340" cy="100" r="14" fill="#1f2937" />
            <text x="340" y="105" textAnchor="middle" fontSize="14">🥷</text>
            <text x="340" y="135" textAnchor="middle" fontSize="9" fill="#fca5a5">Attacker</text>
          </g>
        </g>
      )}
      {step === 3 && (
        <g className="animate-fade-in">
          <Hero cx={120} by={180} color="#22d3ee" />
          <path d="M180 90 l40 14 v22 c0 22 -16 36 -40 44 c-24 -8 -40 -22 -40 -44 v-22 z" fill="#10b981" stroke="#064e3b" strokeWidth="1.5" />
          <text x="180" y="150" textAnchor="middle" fontSize="18" fill="white" fontWeight="700">✓</text>
          <text x="300" y="100" textAnchor="middle" fontSize="11" fill="#bbf7d0" fontWeight="700">Open the bank app</text>
          <text x="300" y="118" textAnchor="middle" fontSize="11" fill="#bbf7d0" fontWeight="700">directly — never the link</text>
        </g>
      )}
    </svg>
  );
}

function SpearScene({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-56" role="img" aria-label={`Spear phishing panel ${step + 1}`}>
      {step === 0 && (
        <g className="animate-fade-in">
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#fbbf24" fontWeight="700">Recon</text>
          {["LinkedIn", "Blog", "Slack pic", "Press release"].map((s, i) => (
            <g key={s}>
              <rect x={40 + i * 85} y={70} width="70" height="44" rx="4" fill="#1e293b" stroke="#22d3ee" />
              <text x={75 + i * 85} y={97} textAnchor="middle" fontSize="10" fill="#cbd5e1">{s}</text>
            </g>
          ))}
          <g>
            <circle cx="200" cy="170" r="16" fill="#1f2937" stroke="#fca5a5" />
            <text x="200" y="175" textAnchor="middle" fontSize="14">🥷</text>
            <text x="200" y="200" textAnchor="middle" fontSize="10" fill="#fca5a5">Profile assembled</text>
          </g>
        </g>
      )}
      {step === 1 && (
        <g className="animate-fade-in">
          <rect x="80" y="50" width="240" height="120" rx="8" fill="#0f172a" stroke="#7f1d1d" strokeWidth="2" />
          <text x="200" y="72" textAnchor="middle" fontSize="11" fill="#fca5a5" fontWeight="700">From: priya.shah@yourcompany-hq.com</text>
          <text x="200" y="92" textAnchor="middle" fontSize="10" fill="#e2e8f0">"Wire €38,400 — Aurora vendor"</text>
          <text x="200" y="108" textAnchor="middle" fontSize="10" fill="#e2e8f0">"Don't loop in finance"</text>
          <text x="200" y="124" textAnchor="middle" fontSize="10" fill="#fbbf24">"Today or we miss the deadline"</text>
          <text x="200" y="150" textAnchor="middle" fontSize="9" fill="#94a3b8">Sent 4:55pm Friday</text>
        </g>
      )}
      {step === 2 && (
        <g className="animate-fade-in">
          <Hero cx={100} by={180} color="#22d3ee" />
          <text x="100" y="100" textAnchor="middle" fontSize="14">😬</text>
          <g>
            <path d="M140 130 q60 -40 130 -10" stroke="#ef4444" strokeWidth="3" fill="none" strokeDasharray="4 4" />
            <text x="200" y="118" textAnchor="middle" fontSize="10" fill="#fca5a5">€ wire sent</text>
          </g>
          <g>
            <circle cx="320" cy="140" r="16" fill="#1f2937" />
            <text x="320" y="145" textAnchor="middle" fontSize="14">🥷</text>
            <text x="320" y="170" textAnchor="middle" fontSize="9" fill="#fca5a5">Unrecoverable in 1hr</text>
          </g>
        </g>
      )}
      {step === 3 && (
        <g className="animate-fade-in">
          <Hero cx={120} by={180} color="#22d3ee" />
          <text x="120" y="100" textAnchor="middle" fontSize="16">📞</text>
          <text x="260" y="100" textAnchor="middle" fontSize="11" fill="#bbf7d0" fontWeight="700">Call the CEO on her</text>
          <text x="260" y="116" textAnchor="middle" fontSize="11" fill="#bbf7d0" fontWeight="700">known number to verify</text>
          <rect x="220" y="140" width="80" height="32" rx="6" fill="#10b981" />
          <text x="260" y="161" textAnchor="middle" fontSize="12" fill="white" fontWeight="700">VERIFIED</text>
        </g>
      )}
    </svg>
  );
}

function QuishingScene({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-56" role="img" aria-label={`QR phishing panel ${step + 1}`}>
      {step === 0 && (
        <g className="animate-fade-in">
          <rect x="60" y="50" width="120" height="140" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
          <text x="120" y="75" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="700">FREE WI-FI</text>
          <rect x="80" y="85" width="80" height="80" fill="#0f172a" />
          {/* fake QR pattern */}
          {Array.from({ length: 64 }).map((_, i) => {
            const x = 82 + (i % 8) * 10;
            const y = 87 + Math.floor(i / 8) * 10;
            return <rect key={i} x={x} y={y} width="8" height="8" fill={(i * 7) % 3 === 0 ? "#fde68a" : "#0f172a"} />;
          })}
          <text x="120" y="180" textAnchor="middle" fontSize="9" fill="#92400e">Scan to connect</text>
          <g transform="translate(220,80)">
            <text x="0" y="0" fontSize="22">🥷</text>
            <text x="40" y="14" fontSize="10" fill="#fca5a5">Sticker placed</text>
            <text x="40" y="28" fontSize="10" fill="#fca5a5">over real poster</text>
          </g>
        </g>
      )}
      {step === 1 && (
        <g className="animate-fade-in">
          <Hero cx={80} by={180} color="#22d3ee" />
          <text x="80" y="100" textAnchor="middle" fontSize="16">📱</text>
          <rect x="160" y="40" width="220" height="140" rx="6" fill="#ffffff" stroke="#cbd5e1" />
          <rect x="160" y="40" width="220" height="22" fill="#e2e8f0" />
          <text x="270" y="56" textAnchor="middle" fontSize="10" fill="#0f172a">🔒 accounts.googⅼe-wifi.com</text>
          <text x="270" y="90" textAnchor="middle" fontSize="11" fill="#0f172a" fontWeight="700">Sign in with Google</text>
          <rect x="190" y="105" width="160" height="14" fill="#f1f5f9" stroke="#cbd5e1" />
          <rect x="190" y="125" width="160" height="14" fill="#f1f5f9" stroke="#cbd5e1" />
          <rect x="190" y="148" width="160" height="18" rx="3" fill="#3b82f6" />
          <text x="270" y="161" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">Sign in</text>
        </g>
      )}
      {step === 2 && (
        <g className="animate-fade-in">
          <Hero cx={80} by={180} color="#22d3ee" />
          <text x="80" y="100" textAnchor="middle" fontSize="14">😱</text>
          <g>
            <rect x="150" y="70" width="100" height="50" rx="4" fill="#0f172a" stroke="#22d3ee" />
            <text x="200" y="98" textAnchor="middle" fontSize="10" fill="#22d3ee">Login + 2FA</text>
          </g>
          <line x1="250" y1="95" x2="300" y2="95" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
          <g>
            <rect x="300" y="70" width="80" height="50" rx="4" fill="#7f1d1d" stroke="#fca5a5" />
            <text x="340" y="92" textAnchor="middle" fontSize="14">🥷</text>
            <text x="340" y="110" textAnchor="middle" fontSize="9" fill="#fecaca">Live relay</text>
          </g>
          <text x="240" y="160" textAnchor="middle" fontSize="10" fill="#fca5a5">Email, drive, contacts compromised</text>
        </g>
      )}
      {step === 3 && (
        <g className="animate-fade-in">
          <Hero cx={120} by={180} color="#22d3ee" />
          <text x="120" y="100" textAnchor="middle" fontSize="16">📶</text>
          <text x="280" y="90" textAnchor="middle" fontSize="11" fill="#bbf7d0" fontWeight="700">Use your own hotspot</text>
          <text x="280" y="108" textAnchor="middle" fontSize="11" fill="#bbf7d0" fontWeight="700">or ask staff for real Wi-Fi</text>
          <rect x="230" y="130" width="100" height="32" rx="6" fill="#10b981" />
          <text x="280" y="151" textAnchor="middle" fontSize="11" fill="white" fontWeight="700">NO QR LOGIN</text>
        </g>
      )}
    </svg>
  );
}
