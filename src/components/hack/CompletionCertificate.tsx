import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Share2, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CategoryMastery } from "@/hooks/useHackProgress";

interface Props {
  playerName: string;
  onNameChange: (n: string) => void;
  xp: number;
  levelsCleared: number;
  totalLevels: number;
  mastery: CategoryMastery[];
  onClose: () => void;
}

const rankFor = (score: number) => {
  if (score >= 95) return { title: "CYBER LEGEND", color: "#f0abfc", grade: "S+" };
  if (score >= 85) return { title: "ELITE DEFENDER", color: "#facc15", grade: "S" };
  if (score >= 70) return { title: "SENIOR ANALYST", color: "#22d3ee", grade: "A" };
  if (score >= 55) return { title: "FIELD OPERATIVE", color: "#4ade80", grade: "B" };
  return { title: "DATA GUARDIAN", color: "#94a3b8", grade: "C" };
};

const certId = (seed: string) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `DDH-${(h >>> 0).toString(16).toUpperCase().padStart(8, "0")}`;
};

const W = 1000;
const H = 700;

export default function CompletionCertificate({
  playerName,
  onNameChange,
  xp,
  levelsCleared,
  totalLevels,
  mastery,
  onClose,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const avg = mastery.length
    ? Math.round(mastery.reduce((s, m) => s + m.mastery, 0) / mastery.length)
    : 0;
  const rank = rankFor(avg);
  const name = playerName.trim() || "Anonymous Defender";
  const issued = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [],
  );
  const id = useMemo(() => certId(name + issued + xp), [name, issued, xp]);

  const download = async () => {
    if (!svgRef.current) return;
    setBusy(true);
    try {
      const xml = new XMLSerializer().serializeToString(svgRef.current);
      const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("render failed"));
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = W * 2;
      canvas.height = H * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no canvas");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `data-defense-hero-certificate-${id}.png`;
      a.click();
      toast({ title: "Certificate downloaded", description: `${id} saved as PNG.` });
    } catch {
      toast({
        title: "Download failed",
        description: "Your browser blocked the export. Try a screenshot instead.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    const text = `I completed all ${totalLevels} Data Defense Hero missions — rank ${rank.title} (${rank.grade}), ${xp} XP. Certificate ${id}.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Data Defense Hero", text });
      } else {
        await navigator.clipboard.writeText(text);
        toast({ title: "Copied to clipboard", description: "Share your badge anywhere." });
      }
    } catch {}
  };

  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-black/85 backdrop-blur-sm animate-fade-in p-4 flex items-start sm:items-center justify-center">
      <div className="w-full max-w-3xl my-auto space-y-3">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-400" />
            <span className="font-display text-sm uppercase tracking-[0.25em]">Reward unlocked</span>
          </div>
          <button onClick={onClose} className="opacity-60 hover:opacity-100" aria-label="Close certificate">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-white/15 shadow-[0_0_60px_rgba(34,211,238,0.25)] bg-black">
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            role="img"
            aria-label={`Certificate of completion for ${name}, rank ${rank.title}`}
          >
            <defs>
              <linearGradient id="cert-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#05060d" />
                <stop offset="50%" stopColor="#0b1226" />
                <stop offset="100%" stopColor="#08131a" />
              </linearGradient>
              <linearGradient id="cert-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor={rank.color} />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <radialGradient id="cert-glow" cx="50%" cy="18%" r="60%">
                <stop offset="0%" stopColor={rank.color} stopOpacity="0.28" />
                <stop offset="100%" stopColor="#000" stopOpacity="0" />
              </radialGradient>
              <pattern id="cert-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="#22d3ee" strokeOpacity="0.07" strokeWidth="1" />
              </pattern>
            </defs>

            <rect width={W} height={H} fill="url(#cert-bg)" />
            <rect width={W} height={H} fill="url(#cert-grid)" />
            <rect width={W} height={H} fill="url(#cert-glow)" />
            <rect x="18" y="18" width={W - 36} height={H - 36} fill="none" stroke="url(#cert-line)" strokeWidth="2" rx="10" />
            <rect x="30" y="30" width={W - 60} height={H - 60} fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" rx="6" />

            {/* Seal */}
            <g transform={`translate(${W / 2}, 132)`}>
              <circle r="52" fill="none" stroke={rank.color} strokeOpacity="0.35" strokeWidth="2" />
              <circle r="42" fill={rank.color} fillOpacity="0.1" stroke={rank.color} strokeWidth="2" />
              <path
                d="M0 -26 L22 -16 L22 4 C22 18 12 26 0 30 C-12 26 -22 18 -22 4 L-22 -16 Z"
                fill={rank.color}
                fillOpacity="0.22"
                stroke={rank.color}
                strokeWidth="2"
              />
              <text y="8" textAnchor="middle" fill={rank.color} fontSize="24" fontWeight="700" fontFamily="monospace">
                {rank.grade}
              </text>
            </g>

            <text x={W / 2} y="222" textAnchor="middle" fill="#e2e8f0" fontSize="15" letterSpacing="8" fontFamily="monospace">
              CERTIFICATE OF COMPLETION
            </text>
            <text x={W / 2} y="258" textAnchor="middle" fill="#94a3b8" fontSize="13" letterSpacing="4" fontFamily="monospace">
              DATA DEFENSE HERO · CYBER SECURITY TRAINING PROGRAM
            </text>

            <text x={W / 2} y="330" textAnchor="middle" fill="#ffffff" fontSize="46" fontWeight="700" fontFamily="Georgia, serif">
              {name}
            </text>
            <line x1={W / 2 - 240} y1="348" x2={W / 2 + 240} y2="348" stroke="url(#cert-line)" strokeWidth="2" />

            <text x={W / 2} y="386" textAnchor="middle" fill="#cbd5e1" fontSize="16" fontFamily="sans-serif">
              has successfully neutralised all {totalLevels} live attack scenarios — phishing, credential
            </text>
            <text x={W / 2} y="410" textAnchor="middle" fill="#cbd5e1" fontSize="16" fontFamily="sans-serif">
              theft and privacy breaches — and is hereby recognised as
            </text>

            <text x={W / 2} y="462" textAnchor="middle" fill={rank.color} fontSize="34" fontWeight="700" letterSpacing="6" fontFamily="monospace">
              {rank.title}
            </text>

            {/* Stats */}
            <g>
              {[
                { label: "MISSIONS", value: `${levelsCleared}/${totalLevels}` },
                { label: "TOTAL XP", value: `${xp}` },
                { label: "MASTERY", value: `${avg}%` },
              ].map((s, i) => {
                const x = W / 2 + (i - 1) * 230;
                return (
                  <g key={s.label} transform={`translate(${x}, 520)`}>
                    <rect x="-100" y="0" width="200" height="72" rx="8" fill="#ffffff" fillOpacity="0.05" stroke="#ffffff" strokeOpacity="0.12" />
                    <text y="30" textAnchor="middle" fill="#ffffff" fontSize="26" fontWeight="700" fontFamily="monospace">
                      {s.value}
                    </text>
                    <text y="54" textAnchor="middle" fill="#94a3b8" fontSize="11" letterSpacing="3" fontFamily="monospace">
                      {s.label}
                    </text>
                  </g>
                );
              })}
            </g>

            <text x="60" y={H - 52} fill="#64748b" fontSize="12" fontFamily="monospace">
              ISSUED {issued.toUpperCase()}
            </text>
            <text x={W - 60} y={H - 52} textAnchor="end" fill="#64748b" fontSize="12" fontFamily="monospace">
              CERT ID {id}
            </text>
            <text x={W / 2} y={H - 52} textAnchor="middle" fill="#64748b" fontSize="12" letterSpacing="3" fontFamily="monospace">
              VERIFIED BY CIPHER CITY SOC
            </text>
          </svg>
        </div>

        {/* Mastery badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {mastery.map((m) => (
            <div key={m.category} className="rounded-lg border border-white/10 bg-white/5 p-3 text-white">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">{m.category}</div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xl font-bold">{m.mastery}%</span>
                <span className="text-[11px] text-white/60">{m.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={playerName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Type your name for the certificate"
            aria-label="Name on certificate"
            maxLength={28}
            className="flex-1 rounded-md bg-black/60 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={share}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="cyber" onClick={download} disabled={busy}>
            <Download className="h-4 w-4" /> {busy ? "Rendering…" : "Download PNG"}
          </Button>
        </div>
      </div>
    </div>
  );
}
