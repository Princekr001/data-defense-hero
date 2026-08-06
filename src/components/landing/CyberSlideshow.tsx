import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Play, Pause, ChevronLeft, ChevronRight, Zap, ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Animated SVG scenes — each one "explains" a cyber issue visually    */
/* ------------------------------------------------------------------ */

const P = "hsl(var(--primary))";
const D = "hsl(var(--destructive))";
const A = "hsl(var(--accent))";
const W = "hsl(var(--warning))";
const S = "hsl(var(--secondary))";
const MUTED = "hsl(var(--muted-foreground))";

const Grid = () => (
  <g opacity="0.18" stroke={P} strokeWidth="0.5">
    {Array.from({ length: 13 }).map((_, i) => (
      <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="320" />
    ))}
    {Array.from({ length: 9 }).map((_, i) => (
      <line key={`h${i}`} x1="0" y1={i * 40} x2="480" y2={i * 40} />
    ))}
  </g>
);

/** 1. Phishing — a hook drags a credential card out of an inbox */
const PhishingScene = () => (
  <svg viewBox="0 0 480 320" className="w-full h-full">
    <Grid />
    <rect x="40" y="90" width="180" height="140" rx="10" fill="hsl(var(--card))" stroke={P} strokeWidth="2" />
    <rect x="56" y="110" width="148" height="18" rx="4" fill={MUTED} opacity="0.35" />
    <rect x="56" y="138" width="110" height="12" rx="4" fill={MUTED} opacity="0.25" />
    <rect x="56" y="158" width="130" height="12" rx="4" fill={MUTED} opacity="0.25" />
    <text x="56" y="205" fontSize="13" fill={D} fontFamily="monospace">
      &quot;Verify your account now&quot;
      <animate attributeName="opacity" values="0.2;1;0.2" dur="2.4s" repeatCount="indefinite" />
    </text>

    {/* fishing line + hook */}
    <path d="M420 10 L420 96 Q420 122 396 122" stroke={D} strokeWidth="2" fill="none" strokeDasharray="6 5">
      <animate attributeName="stroke-dashoffset" values="0;-22" dur="1s" repeatCount="indefinite" />
    </path>

    {/* dragged credential card */}
    <g>
      <animateTransform attributeName="transform" type="translate"
        values="0 0; 150 -34; 150 -34; 0 0" keyTimes="0;0.45;0.8;1" dur="5s" repeatCount="indefinite" />
      <rect x="240" y="120" width="150" height="66" rx="8" fill={D} opacity="0.14" stroke={D} strokeWidth="2" />
      <text x="256" y="146" fontSize="12" fill={D} fontFamily="monospace">user@mail.com</text>
      <text x="256" y="168" fontSize="12" fill={D} fontFamily="monospace">••••••••••</text>
    </g>

    <text x="40" y="278" fontSize="14" fill={W} fontFamily="monospace">
      1 click → credentials gone in 3s
      <animate attributeName="opacity" values="0.35;1;0.35" dur="2s" repeatCount="indefinite" />
    </text>
  </svg>
);

/** 2. Weak passwords — brute force cracking a vault */
const PasswordScene = () => (
  <svg viewBox="0 0 480 320" className="w-full h-full">
    <Grid />
    <rect x="150" y="70" width="180" height="180" rx="14" fill="hsl(var(--card))" stroke={W} strokeWidth="2" />
    <circle cx="240" cy="160" r="52" fill="none" stroke={W} strokeWidth="4" opacity="0.5" />
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0 240 160" to="360 240 160" dur="3s" repeatCount="indefinite" />
      <line x1="240" y1="160" x2="240" y2="115" stroke={W} strokeWidth="6" strokeLinecap="round" />
    </g>
    <circle cx="240" cy="160" r="8" fill={W} />

    {["p a s s 1 2 3", "q w e r t y", "1 2 3 4 5 6"].map((t, i) => (
      <text key={t} x="24" y={110 + i * 34} fontSize="14" fill={D} fontFamily="monospace">
        {t}
        <animate attributeName="opacity" values="0;1;0" dur="1.8s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
      </text>
    ))}

    <rect x="150" y="266" width="180" height="10" rx="5" fill={MUTED} opacity="0.25" />
    <rect x="150" y="266" width="0" height="10" rx="5" fill={D}>
      <animate attributeName="width" values="0;180" dur="2.6s" repeatCount="indefinite" />
    </rect>
    <text x="344" y="276" fontSize="13" fill={D} fontFamily="monospace">CRACKED</text>
  </svg>
);

/** 3. Data breach — records leaking out of a server rack */
const BreachScene = () => (
  <svg viewBox="0 0 480 320" className="w-full h-full">
    <Grid />
    <rect x="46" y="70" width="130" height="190" rx="10" fill="hsl(var(--card))" stroke={P} strokeWidth="2" />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x="60" y={88 + i * 34} width="102" height="22" rx="4" fill={P} opacity="0.15" />
        <circle cx={152} cy={99 + i * 34} r="4" fill={A}>
          <animate attributeName="fill" values={`${A};${D};${A}`} dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      </g>
    ))}

    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x="176" y={92 + (i % 5) * 34} width="16" height="8" rx="2" fill={D}>
        <animate attributeName="x" values="176;430" dur="2.6s" begin={`${i * 0.42}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;1;0" dur="2.6s" begin={`${i * 0.42}s`} repeatCount="indefinite" />
      </rect>
    ))}

    <g opacity="0.9">
      <rect x="356" y="120" width="96" height="86" rx="10" fill={D} opacity="0.12" stroke={D} strokeWidth="2" />
      <text x="372" y="168" fontSize="30" fill={D} fontFamily="monospace">☠</text>
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.6s" repeatCount="indefinite" />
    </g>
    <text x="46" y="292" fontSize="14" fill={D} fontFamily="monospace">
      records/sec exfiltrated: 1,204
    </text>
  </svg>
);

/** 4. Ransomware — files encrypting one by one, countdown */
const RansomwareScene = () => (
  <svg viewBox="0 0 480 320" className="w-full h-full">
    <Grid />
    {Array.from({ length: 12 }).map((_, i) => {
      const x = 40 + (i % 4) * 84;
      const y = 66 + Math.floor(i / 4) * 74;
      return (
        <g key={i}>
          <rect x={x} y={y} width="64" height="56" rx="8" fill="hsl(var(--card))" stroke={P} strokeWidth="1.5" />
          <rect x={x} y={y} width="64" height="56" rx="8" fill={D} opacity="0">
            <animate attributeName="opacity" values="0;0;0.75;0.75" keyTimes="0;0.3;0.45;1"
              dur="6s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
          </rect>
          <text x={x + 22} y={y + 36} fontSize="18" fill={W} opacity="0.9">🔒
            <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.3;0.45;1"
              dur="6s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
          </text>
        </g>
      );
    })}
    <rect x="140" y="220" width="200" height="46" rx="8" fill={D} opacity="0.14" stroke={D} strokeWidth="2" />
    <text x="160" y="250" fontSize="16" fill={D} fontFamily="monospace">
      PAY 00:59:59
      <animate attributeName="opacity" values="1;0.25;1" dur="1s" repeatCount="indefinite" />
    </text>
  </svg>
);

/** 5. Public Wi-Fi / MITM — traffic intercepted between phone and tower */
const WifiScene = () => (
  <svg viewBox="0 0 480 320" className="w-full h-full">
    <Grid />
    <rect x="36" y="110" width="72" height="120" rx="12" fill="hsl(var(--card))" stroke={P} strokeWidth="2" />
    <rect x="46" y="124" width="52" height="82" rx="4" fill={P} opacity="0.18" />

    <g stroke={A} strokeWidth="3" fill="none" opacity="0.8">
      {[18, 30, 42].map((r, i) => (
        <path key={r} d={`M400 ${170 - r * 0.2} a ${r} ${r} 0 0 1 0 ${r * 1.2}`} transform="translate(0,-10)">
          <animate attributeName="opacity" values="0.15;1;0.15" dur="1.8s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
        </path>
      ))}
    </g>
    <rect x="392" y="120" width="14" height="110" rx="4" fill={A} opacity="0.5" />

    {/* packets */}
    {[0, 1, 2].map((i) => (
      <rect key={i} x="112" y={148 + i * 22} width="20" height="10" rx="3" fill={P}>
        <animate attributeName="x" values="112;250;250;380" keyTimes="0;0.45;0.6;1" dur="3.4s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        <animate attributeName="fill" values={`${P};${D};${D}`} keyTimes="0;0.5;1" dur="3.4s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
      </rect>
    ))}

    {/* interceptor */}
    <g>
      <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="2.2s" repeatCount="indefinite" />
      <rect x="216" y="86" width="88" height="72" rx="10" fill={D} opacity="0.14" stroke={D} strokeWidth="2" strokeDasharray="6 4" />
      <text x="238" y="130" fontSize="26" fill={D}>👁</text>
    </g>
    <text x="180" y="290" fontSize="13" fill={W} fontFamily="monospace">"Free_Airport_WiFi" — man in the middle</text>
  </svg>
);

/** 6. Oversharing / social engineering — profile pieces assembled into an ID */
const OversharingScene = () => (
  <svg viewBox="0 0 480 320" className="w-full h-full">
    <Grid />
    {[
      { t: "birthday", x: 30, y: 70 },
      { t: "pet name", x: 30, y: 130 },
      { t: "school", x: 30, y: 190 },
      { t: "location", x: 30, y: 250 },
    ].map((c, i) => (
      <g key={c.t}>
        <animateTransform attributeName="transform" type="translate"
          values={`0 0; ${210} ${20 - i * 46}; ${210} ${20 - i * 46}; 0 0`}
          keyTimes="0;0.4;0.85;1" dur="6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
        <rect x={c.x} y={c.y} width="120" height="40" rx="8" fill={S} opacity="0.15" stroke={S} strokeWidth="1.5" />
        <text x={c.x + 14} y={c.y + 25} fontSize="13" fill={S} fontFamily="monospace">{c.t}</text>
      </g>
    ))}
    <rect x="250" y="86" width="190" height="150" rx="12" fill="hsl(var(--card))" stroke={D} strokeWidth="2" />
    <circle cx="290" cy="130" r="20" fill={D} opacity="0.25" />
    <rect x="322" y="120" width="94" height="10" rx="4" fill={D} opacity="0.4" />
    <rect x="322" y="138" width="70" height="10" rx="4" fill={D} opacity="0.25" />
    <text x="268" y="196" fontSize="14" fill={D} fontFamily="monospace">IDENTITY CLONED
      <animate attributeName="opacity" values="0.2;1;0.2" dur="2.2s" repeatCount="indefinite" />
    </text>
  </svg>
);

/** Final slide — defense stack coming online */
const DefenseScene = () => (
  <svg viewBox="0 0 480 320" className="w-full h-full">
    <Grid />
    <path d="M240 54 L360 100 V178 C360 232 306 264 240 282 C174 264 120 232 120 178 V100 Z"
      fill={A} opacity="0.12" stroke={A} strokeWidth="3">
      <animate attributeName="opacity" values="0.06;0.2;0.06" dur="3s" repeatCount="indefinite" />
    </path>
    <path d="M196 168 l30 30 l60 -66" fill="none" stroke={A} strokeWidth="8" strokeLinecap="round"
      strokeDasharray="140" strokeDashoffset="140">
      <animate attributeName="stroke-dashoffset" values="140;0;0;140" keyTimes="0;0.35;0.85;1" dur="4s" repeatCount="indefinite" />
    </path>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <circle key={i} r="5" fill={D}>
        <animateMotion dur="2.6s" begin={`${i * 0.35}s`} repeatCount="indefinite"
          path={`M${i % 2 ? 470 : 10} ${40 + i * 42} L240 168`} />
        <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.7;0.8" dur="2.6s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
      </circle>
    ))}
  </svg>
);

/* ------------------------------------------------------------------ */

interface Slide {
  id: string;
  kicker: string;
  headline: string;
  punch: string;
  stat: string;
  statLabel: string;
  defense: string;
  tone: "danger" | "warning" | "purple" | "safe";
  Scene: () => JSX.Element;
}

const slides: Slide[] = [
  {
    id: "phishing",
    kicker: "Threat 01",
    headline: "Phishing",
    punch: "A fake message. One click. Your login is theirs.",
    stat: "3.4B",
    statLabel: "phishing mails / day",
    defense: "Check the sender domain before you ever touch a link.",
    tone: "danger",
    Scene: PhishingScene,
  },
  {
    id: "passwords",
    kicker: "Threat 02",
    headline: "Weak Passwords",
    punch: "\"password123\" falls to a brute-force rig in under a second.",
    stat: "<1s",
    statLabel: "to crack a common password",
    defense: "Long passphrase + a manager + 2FA on every account.",
    tone: "warning",
    Scene: PasswordScene,
  },
  {
    id: "breach",
    kicker: "Threat 03",
    headline: "Data Breaches",
    punch: "Your records leave the building before anyone notices.",
    stat: "$10.5T",
    statLabel: "annual cybercrime cost",
    defense: "Share less, use unique passwords, watch breach alerts.",
    tone: "danger",
    Scene: BreachScene,
  },
  {
    id: "ransomware",
    kicker: "Threat 04",
    headline: "Ransomware",
    punch: "Files lock one by one while a timer demands payment.",
    stat: "every 11s",
    statLabel: "a new attack launches",
    defense: "Offline backups and patched software beat the timer.",
    tone: "danger",
    Scene: RansomwareScene,
  },
  {
    id: "wifi",
    kicker: "Threat 05",
    headline: "Public Wi-Fi",
    punch: "Free hotspot, silent listener, every packet copied.",
    stat: "MITM",
    statLabel: "man-in-the-middle capture",
    defense: "Use a VPN, stick to HTTPS, never bank on open Wi-Fi.",
    tone: "warning",
    Scene: WifiScene,
  },
  {
    id: "oversharing",
    kicker: "Threat 06",
    headline: "Oversharing",
    punch: "Birthday, pet, school — that's a full identity kit.",
    stat: "4 posts",
    statLabel: "can rebuild your identity",
    defense: "Lock profiles down and starve the social engineer.",
    tone: "purple",
    Scene: OversharingScene,
  },
  {
    id: "defense",
    kicker: "Your Move",
    headline: "Defend It",
    punch: "Every threat above is a playable level. Learn it by surviving it.",
    stat: "9",
    statLabel: "missions + boss fights",
    defense: "Enter the grid and start defending real data.",
    tone: "safe",
    Scene: DefenseScene,
  },
];

const toneRing: Record<Slide["tone"], string> = {
  danger: "border-destructive/40 shadow-danger",
  warning: "border-warning/40",
  purple: "border-secondary/40",
  safe: "border-accent/40 shadow-success",
};

const toneText: Record<Slide["tone"], string> = {
  danger: "text-destructive",
  warning: "text-warning",
  purple: "text-secondary",
  safe: "text-accent",
};

const DURATION = 8000;

interface Props {
  onStart: () => void;
}

export default function CyberSlideshow({ onStart }: Props) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());

  const go = useCallback((next: number) => {
    setIdx((next + slides.length) % slides.length);
    setProgress(0);
    startRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!playing) return;
    startRef.current = Date.now() - progress * DURATION;
    const id = setInterval(() => {
      const p = (Date.now() - startRef.current) / DURATION;
      if (p >= 1) {
        setIdx((i) => (i + 1) % slides.length);
        setProgress(0);
        startRef.current = Date.now();
      } else {
        setProgress(p);
      }
    }, 60);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, idx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(idx + 1);
      if (e.key === "ArrowLeft") go(idx - 1);
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, go]);

  const s = slides[idx];

  return (
    <section
      className="relative overflow-hidden border-b border-border/30"
      aria-roledescription="carousel"
      aria-label="Cybersecurity threats explained"
    >
      {/* ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn(
          "absolute -top-24 left-1/4 h-96 w-96 rounded-full blur-3xl transition-colors duration-1000",
          s.tone === "safe" ? "bg-accent/10" : s.tone === "purple" ? "bg-secondary/10" : "bg-destructive/10",
        )} />
        <div className="absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-14 md:py-20">
        {/* progress segments */}
        <div className="flex gap-1.5 mb-10">
          {slides.map((sl, i) => (
            <button
              key={sl.id}
              onClick={() => go(i)}
              aria-label={`Go to ${sl.headline}`}
              className="group relative h-1.5 flex-1 rounded-full bg-muted overflow-hidden"
            >
              <span
                className="absolute inset-y-0 left-0 bg-primary rounded-full transition-[width] duration-100"
                style={{ width: i < idx ? "100%" : i === idx ? `${progress * 100}%` : "0%" }}
              />
            </button>
          ))}
        </div>

        <div key={s.id} className="grid lg:grid-cols-2 gap-10 items-center animate-fade-in">
          {/* animated scene */}
          <div className={cn(
            "order-1 lg:order-2 rounded-2xl border-2 bg-card/40 backdrop-blur-sm p-3 animate-scale-in",
            toneRing[s.tone],
          )}>
            <div className="aspect-[3/2] w-full">
              <s.Scene />
            </div>
          </div>

          {/* narration */}
          <div className="order-2 lg:order-1">
            <p className={cn("font-mono text-xs uppercase tracking-[0.35em] mb-3", toneText[s.tone])}>
              {s.kicker}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">{s.headline}</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/90 mb-6 max-w-lg">{s.punch}</p>

            <div className="flex items-end gap-4 mb-6">
              <span className={cn("text-4xl md:text-5xl font-extrabold tabular-nums", toneText[s.tone])}>
                {s.stat}
              </span>
              <span className="text-sm text-muted-foreground pb-2 uppercase tracking-wider">
                {s.statLabel}
              </span>
            </div>

            <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 mb-8 max-w-lg">
              <p className="text-sm text-foreground/85">
                <span className="font-semibold text-accent">Defense · </span>{s.defense}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" variant="cyber" onClick={onStart} className="group animate-pulse-glow">
                <Zap className="h-5 w-5" />
                Enter Hack Grid
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => go(idx - 1)}
                  aria-label="Previous threat"
                  className="h-10 w-10 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                  className="h-10 w-10 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => go(idx + 1)}
                  aria-label="Next threat"
                  className="h-10 w-10 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
