import { useMemo } from "react";
import { TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import type { TimelineEntry } from "@/hooks/useHackProgress";

interface Props {
  history: TimelineEntry[];
}

const fmt = (t: number) =>
  new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });

/** Sparkline + run log showing how mastery and XP grew across played levels. */
export default function ProgressTimeline({ history }: Props) {
  const points = useMemo(() => history.slice(-24), [history]);

  const path = useMemo(() => {
    if (points.length < 2) return { mastery: "", xp: "" };
    const w = 100;
    const h = 34;
    const maxXp = Math.max(...points.map((p) => p.xp), 1);
    const x = (i: number) => (i / (points.length - 1)) * w;
    const line = (val: (p: TimelineEntry) => number) =>
      points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${(h - val(p) * h).toFixed(1)}`).join(" ");
    return {
      mastery: line((p) => p.mastery / 100),
      xp: line((p) => p.xp / maxXp),
    };
  }, [points]);

  const latest = points[points.length - 1];
  const first = points[0];

  return (
    <section
      aria-label="Progress timeline"
      className="pointer-events-auto w-[min(92vw,300px)] rounded-xl border border-white/10 bg-black/55 backdrop-blur-md p-3 space-y-3"
    >
      <header className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" aria-hidden />
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80 font-display">
          Progress timeline
        </h2>
      </header>

      {points.length < 2 ? (
        <p className="text-[10px] leading-relaxed text-white/55">
          Play a few levels — your mastery and XP curve will chart here.
        </p>
      ) : (
        <>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
            <svg viewBox="0 0 100 34" preserveAspectRatio="none" className="h-16 w-full" aria-hidden>
              <path d={path.xp} fill="none" stroke="#a78bfa" strokeWidth="1.2" strokeLinejoin="round" opacity="0.7" />
              <path
                d={path.mastery}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.6"
                strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 0 3px #22d3ee)" }}
              />
            </svg>
            <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
              <span className="text-[#22d3ee]">mastery {latest.mastery}%</span>
              <span className="text-[#a78bfa]">{latest.xp} XP</span>
            </div>
          </div>

          <p className="text-[10px] text-white/50">
            {fmt(first.t)} → {fmt(latest.t)} · {points.length} runs ·{" "}
            <span className="text-white/80">+{latest.mastery - first.mastery} pts</span> mastery
          </p>

          <ol className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {[...points].reverse().map((p, i) => (
              <li key={`${p.t}-${i}`} className="flex items-center gap-2 text-[10px]">
                {p.won ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" aria-hidden />
                ) : (
                  <XCircle className="h-3 w-3 text-destructive shrink-0" aria-hidden />
                )}
                <span className="flex-1 min-w-0 truncate text-white/80">{p.levelName}</span>
                <span className="font-mono tabular-nums text-white/45">{p.mastery}%</span>
                <span className="font-mono tabular-nums text-white/45">{p.xp}xp</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
