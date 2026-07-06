import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINES_SAFE = [
  "Nice catch. That one had teeth.",
  "You saw the flag before I did.",
  "Textbook block. Data secured.",
  "Clean defense. Attackers hate that.",
  "I'd fist-bump you if I had hands.",
];
const LINES_HIT = [
  "Oof. Attacker landed one.",
  "I would've clicked that too… fortunately, I'm software.",
  "Curiosity is good. Random links, less so.",
  "Shake it off. Next threat incoming.",
  "That URL was suspicious. Now we know.",
];
const LINES_IDLE = [
  "Cipher Bot online. I've got your back.",
  "Watching every packet with you.",
  "Say the word, I'll pull the red flags.",
];

interface Props {
  mood?: "idle" | "safe" | "hit";
  compact?: boolean;
}

export default function CipherBot({ mood = "idle", compact }: Props) {
  const [line, setLine] = useState<string>(LINES_IDLE[0]);

  useEffect(() => {
    const pool = mood === "safe" ? LINES_SAFE : mood === "hit" ? LINES_HIT : LINES_IDLE;
    setLine(pool[Math.floor(Math.random() * pool.length)]);
  }, [mood]);

  return (
    <div className={cn("pointer-events-none flex items-end gap-2", compact ? "" : "animate-fade-in")}>
      {/* Robot */}
      <div className="relative shrink-0" style={{ animation: "bot-bob 2.6s ease-in-out infinite" }}>
        <svg viewBox="0 0 64 64" className={cn(compact ? "w-10 h-10" : "w-14 h-14", "drop-shadow-[0_0_10px_hsl(var(--primary)/0.6)]")}>
          <rect x="14" y="18" width="36" height="30" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
          <circle cx="24" cy="32" r="4" fill={mood === "hit" ? "hsl(var(--destructive))" : "hsl(var(--primary))"} className="animate-pulse" />
          <circle cx="40" cy="32" r="4" fill={mood === "hit" ? "hsl(var(--destructive))" : "hsl(var(--primary))"} className="animate-pulse" />
          <rect x="26" y="41" width="12" height="2" rx="1" fill="hsl(var(--primary))" />
          <line x1="32" y1="10" x2="32" y2="18" stroke="hsl(var(--primary))" strokeWidth="2" />
          <circle cx="32" cy="9" r="2.5" fill="hsl(var(--primary))" className="animate-pulse" />
          <rect x="10" y="26" width="4" height="10" rx="2" fill="hsl(var(--primary))" />
          <rect x="50" y="26" width="4" height="10" rx="2" fill="hsl(var(--primary))" />
        </svg>
      </div>
      {/* Speech bubble */}
      <div className="relative max-w-[220px] rounded-2xl rounded-bl-sm bg-primary/15 border border-primary/40 px-3 py-1.5 text-[11px] leading-snug text-foreground backdrop-blur animate-fade-in">
        <div className="text-[9px] uppercase tracking-widest text-primary font-black">Cipher Bot</div>
        {line}
      </div>
    </div>
  );
}
