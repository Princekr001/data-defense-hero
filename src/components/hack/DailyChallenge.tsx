import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Timer, Gift, CheckCircle2 } from "lucide-react";
import type { HackLevel } from "@/data/hackTargets";

interface Props {
  target: HackLevel | null;
  claimed: boolean;
  streak: number;
  reward: number;
  msLeft: number;
  onPlay: (lvl: HackLevel) => void;
}

const fmt = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export default function DailyChallenge({ target, claimed, streak, reward, msLeft, onPlay }: Props) {
  const [left, setLeft] = useState(msLeft);

  useEffect(() => setLeft(msLeft), [msLeft]);
  useEffect(() => {
    const t = setInterval(() => setLeft((v) => Math.max(0, v - 1000)), 1000) as ReturnType<
      typeof setInterval
    >;
    return () => clearInterval(t);
  }, []);

  if (!target) return null;

  return (
    <div className="pointer-events-auto w-[260px] rounded-xl border border-orange-400/40 bg-black/60 backdrop-blur p-3 space-y-2 shadow-[0_0_30px_rgba(251,146,60,0.15)]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-orange-300">
          <Flame className="h-3.5 w-3.5" /> Daily challenge
        </span>
        <span className="flex items-center gap-1 text-[10px] font-mono text-white/55">
          <Timer className="h-3 w-3" /> {fmt(left)}
        </span>
      </div>

      <p className="text-sm font-semibold text-white leading-tight">{target.name}</p>
      <p className="text-[11px] text-white/55 line-clamp-2">{target.brief ?? target.category}</p>

      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1 text-yellow-300">
          <Gift className="h-3 w-3" /> +{reward} bonus XP
        </span>
        {streak > 0 && (
          <span className="text-orange-300 font-mono">🔥 {streak}-day streak</span>
        )}
      </div>

      {claimed ? (
        <div className="flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-2 py-1.5 text-[11px] text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" /> Claimed — new target in {fmt(left)}
        </div>
      ) : (
        <Button variant="cyber" size="sm" className="w-full" onClick={() => onPlay(target)}>
          Take today's challenge
        </Button>
      )}
    </div>
  );
}
