import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Skull, ShieldAlert, Activity, ChevronRight, Gauge, FileDown, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  bossTuning,
  bossDifficulties,
  bossDifficultyById,
  type BossDifficulty,
  type HackBoss,
} from "@/data/hackBosses";

interface Props {
  boss: HackBoss;
  accent: string;
  onDefeat: () => void;
  onOverrun: () => void;
  onAbort: () => void;
}

const DRAIN_PER_SEC: Record<1 | 2 | 3, number> = { 1: 1.1, 2: 1.8, 3: 2.6 };
const DIFF_KEY = "ddh.bossDifficulty.v1";
const CKPT_KEY = "ddh.bossCheckpoint.v1";

interface Checkpoint {
  bossId: string | number;
  phaseIdx: number;
  integrity: number;
  difficulty: BossDifficulty;
  started: boolean;
}

const readCheckpoint = (bossId: string | number): Checkpoint | null => {
  try {
    const raw = localStorage.getItem(CKPT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Checkpoint;
    if (!c || c.bossId !== bossId) return null;
    if (typeof c.phaseIdx !== "number" || typeof c.integrity !== "number") return null;
    if (c.integrity <= 0) return null;
    return c;
  } catch {
    return null;
  }
};

const clearCheckpoint = () => {
  try { localStorage.removeItem(CKPT_KEY); } catch {}
};

export default function BossFight({ boss, accent, onDefeat, onOverrun, onAbort }: Props) {
  const base = bossTuning[boss.tier];
  const restored = useMemo(() => readCheckpoint(boss.levelId), [boss.levelId]);
  const [difficulty, setDifficulty] = useState<BossDifficulty>(() => {
    if (restored?.difficulty && bossDifficulties.some((d) => d.id === restored.difficulty)) {
      return restored.difficulty;
    }
    try {
      const saved = localStorage.getItem(DIFF_KEY) as BossDifficulty | null;
      if (saved && bossDifficulties.some((d) => d.id === saved)) return saved;
    } catch {}
    return "operator";
  });
  const preset = bossDifficultyById(difficulty);
  const tune = useMemo(
    () => ({
      integrity: base.integrity,
      phaseMs: Math.round(base.phaseMs * preset.timeMul),
      wrongHit: Math.round(base.wrongHit * preset.penaltyMul),
      timeoutHit: Math.round(base.timeoutHit * preset.penaltyMul),
      drainPerSec: DRAIN_PER_SEC[boss.tier] * preset.drainMul,
    }),
    [base, preset, boss.tier],
  );

  const [phaseIdx, setPhaseIdx] = useState(() =>
    restored ? Math.min(restored.phaseIdx, boss.phases.length - 1) : 0,
  );
  const [integrity, setIntegrity] = useState<number>(() => restored?.integrity ?? base.integrity);
  const [timeLeft, setTimeLeft] = useState<number>(tune.phaseMs);
  const [picked, setPicked] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [taunt, setTaunt] = useState(boss.taunts[0]);
  const [outcome, setOutcome] = useState<"running" | "won" | "lost">("running");
  const [showRestored, setShowRestored] = useState(!!restored);
  const endedRef = useRef(false);
  const startedRef = useRef(!!restored?.started);

  const phase = boss.phases[phaseIdx];
  const critical = integrity <= 35;
  const locked = startedRef.current || phaseIdx > 0 || picked !== null;

  const pickDifficulty = (id: BossDifficulty) => {
    if (locked) return;
    setDifficulty(id);
    try { localStorage.setItem(DIFF_KEY, id); } catch {}
    const p = bossDifficultyById(id);
    setTimeLeft(Math.round(base.phaseMs * p.timeMul));
    setIntegrity(base.integrity);
  };

  // persist checkpoint while the gauntlet is live
  useEffect(() => {
    if (outcome !== "running") return;
    try {
      const ckpt: Checkpoint = {
        bossId: boss.levelId,
        phaseIdx,
        integrity,
        difficulty,
        started: startedRef.current,
      };
      localStorage.setItem(CKPT_KEY, JSON.stringify(ckpt));
    } catch {}
  }, [boss.levelId, phaseIdx, integrity, difficulty, outcome, picked]);

  // clear checkpoint once the fight resolves
  useEffect(() => {
    if (outcome !== "running") clearCheckpoint();
  }, [outcome]);

  // hide the "checkpoint restored" banner after a moment
  useEffect(() => {
    if (!showRestored) return;
    const id = setTimeout(() => setShowRestored(false), 5000);
    return () => clearTimeout(id);
  }, [showRestored]);

  // ---- checkpoint export / import ----
  const fileRef = useRef<HTMLInputElement>(null);
  const [ioMsg, setIoMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (!ioMsg) return;
    const id = setTimeout(() => setIoMsg(null), 4500);
    return () => clearTimeout(id);
  }, [ioMsg]);

  const exportCheckpoint = () => {
    const payload = {
      format: "ddh.bossCheckpoint",
      version: 1,
      exportedAt: new Date().toISOString(),
      bossName: boss.handle,
      checkpoint: {
        bossId: boss.levelId,
        phaseIdx,
        integrity,
        difficulty,
        started: startedRef.current,
      } as Checkpoint,
    };
    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `boss-checkpoint-${boss.levelId}-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setIoMsg({ tone: "ok", text: "Checkpoint exported as JSON." });
    } catch {
      setIoMsg({ tone: "err", text: "Export failed." });
    }
  };

  const applyImported = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      const c: Checkpoint = parsed?.checkpoint ?? parsed;
      if (!c || typeof c.phaseIdx !== "number" || typeof c.integrity !== "number") {
        setIoMsg({ tone: "err", text: "Invalid checkpoint file." });
        return;
      }
      if (String(c.bossId) !== String(boss.levelId)) {
        setIoMsg({ tone: "err", text: "This checkpoint belongs to a different boss." });
        return;
      }
      if (c.integrity <= 0) {
        setIoMsg({ tone: "err", text: "Checkpoint is already overrun." });
        return;
      }
      const diff: BossDifficulty = bossDifficulties.some((d) => d.id === c.difficulty)
        ? c.difficulty
        : difficulty;
      setDifficulty(diff);
      setPhaseIdx(Math.min(Math.max(0, Math.floor(c.phaseIdx)), boss.phases.length - 1));
      setIntegrity(Math.min(base.integrity, Math.max(1, c.integrity)));
      setPicked(null);
      setOutcome("running");
      endedRef.current = false;
      startedRef.current = !!c.started;
      setTimeLeft(Math.round(base.phaseMs * bossDifficultyById(diff).timeMul));
      try { localStorage.setItem(CKPT_KEY, JSON.stringify({ ...c, difficulty: diff })); } catch {}
      setIoMsg({ tone: "ok", text: `Checkpoint imported — stage ${Math.floor(c.phaseIdx) + 1}.` });
    } catch {
      setIoMsg({ tone: "err", text: "Could not read that file." });
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => applyImported(String(ev.target?.result ?? ""));
    reader.readAsText(file);
  };




  // rotating taunts
  useEffect(() => {
    const id = setInterval(() => {
      setTaunt(boss.taunts[Math.floor(Math.random() * boss.taunts.length)]);
    }, 4200);
    return () => clearInterval(id);
  }, [boss.taunts]);

  const finish = useCallback(
    (won: boolean) => {
      if (endedRef.current) return;
      endedRef.current = true;
      setOutcome(won ? "won" : "lost");
    },
    [],
  );

  const damage = useCallback(
    (amount: number) => {
      setIntegrity((v) => {
        const next = Math.max(0, v - amount);
        if (next <= 0) finish(false);
        return next;
      });
      setShake(true);
      setTimeout(() => setShake(false), 480);
    },
    [finish],
  );

  // phase countdown + passive integrity drain
  useEffect(() => {
    if (outcome !== "running" || picked !== null) return;
    const id: ReturnType<typeof setInterval> = setInterval(() => {
      setIntegrity((v) => {
        const next = Math.max(0, v - tune.drainPerSec / 10);
        if (next <= 0) finish(false);
        return next;
      });
      setTimeLeft((t) => {
        const next = t - 100;
        if (next <= 0) {
          setPicked(-1);
          damage(tune.timeoutHit);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [outcome, picked, tune.drainPerSec, tune.timeoutHit, damage, finish]);

  const choose = (i: number) => {
    if (picked !== null || outcome !== "running") return;
    startedRef.current = true;
    setPicked(i);
    if (i !== phase.answer) damage(tune.wrongHit);
  };


  const advance = () => {
    if (endedRef.current) return;
    if (phaseIdx + 1 >= boss.phases.length) {
      finish(true);
      return;
    }
    setPhaseIdx((i) => i + 1);
    setPicked(null);
    setTimeLeft(tune.phaseMs);
  };

  const timePct = (timeLeft / tune.phaseMs) * 100;
  const wasWrong = picked !== null && picked !== phase.answer;

  const barColor = useMemo(() => {
    if (integrity > 60) return "hsl(var(--primary))";
    if (integrity > 30) return "hsl(38 92% 50%)";
    return "hsl(var(--destructive))";
  }, [integrity]);

  if (outcome !== "running") {
    const won = outcome === "won";
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-body">
        <div
          className={cn(
            "w-full max-w-md rounded-xl border p-6 text-center space-y-4 bg-black/80",
            won ? "border-accent/60" : "border-destructive/60",
          )}
          style={{ boxShadow: won ? "0 0 60px hsl(var(--accent) / 0.35)" : "0 0 60px hsl(var(--destructive) / 0.4)" }}
        >
          <div className="text-5xl">{won ? "🛡️" : "☠️"}</div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-[0.18em] text-white">
            {won ? "Boss Purged" : "System Overrun"}
          </h2>
          <p className="font-display text-xs uppercase tracking-[0.3em]" style={{ color: accent }}>
            {boss.handle}
          </p>
          <p className="text-sm text-white/75 leading-relaxed">
            {won ? boss.defeat : `${boss.handle} owns the network. Integrity hit zero before the last stage closed.`}
          </p>
          {won && (
            <p className="text-xs text-white/55 italic border-t border-white/10 pt-3">{boss.victory}</p>
          )}
          <Button
            variant={won ? "cyber" : "outline"}
            className={cn("w-full", !won && "border-white/20 text-white hover:bg-white/10")}
            onClick={won ? onDefeat : onOverrun}
          >
            {won ? "Claim the level" : "Re-engage the boss"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md font-body",
        shake && "animate-[boss-shake_0.45s_ease-in-out]",
      )}
    >
      {/* threat wash */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, hsl(var(--destructive) / 0.28), transparent 60%), repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,0,40,0.04) 3px 4px)",
          opacity: critical ? 1 : 0.55,
        }}
      />
      {critical && <div className="pointer-events-none absolute inset-0 border-4 border-destructive/70 animate-pulse" />}

      <div className="relative w-full max-w-lg rounded-xl border border-destructive/40 bg-black/85 overflow-hidden"
        style={{ boxShadow: `0 0 80px hsl(var(--destructive) / ${critical ? 0.55 : 0.3})` }}
      >
        {/* boss header */}
        <div className="px-4 py-3 border-b border-destructive/30 bg-destructive/10">
          <div className="flex items-center gap-2">
            <Skull className="h-5 w-5 text-destructive animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="font-display text-base font-bold uppercase tracking-[0.22em] text-white truncate">
                {boss.handle}
              </div>
              <div className="font-mono text-[10px] text-destructive/90 truncate">{boss.title} · {boss.threat}</div>
            </div>
            <span className="font-display text-[10px] uppercase tracking-[0.2em] text-white/60 shrink-0">
              Tier {boss.tier} boss
            </span>
          </div>
          <p className="mt-2 font-mono text-[11px] text-destructive/80 italic truncate">&gt; {taunt}</p>

          {/* difficulty selector */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="font-display text-[9px] uppercase tracking-[0.2em] text-white/45 flex items-center gap-1">
              <Gauge className="h-3 w-3" /> Threat level
            </span>
            {bossDifficulties.map((d) => (
              <button
                key={d.id}
                onClick={() => pickDifficulty(d.id)}
                disabled={locked}
                title={d.blurb}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-display text-[9px] uppercase tracking-[0.16em] transition-all",
                  d.id === difficulty
                    ? "border-destructive/70 bg-destructive/25 text-white"
                    : "border-white/10 bg-white/5 text-white/55 hover:bg-white/10 hover:text-white",
                  locked && d.id !== difficulty && "opacity-35 cursor-not-allowed",
                )}
              >
                {d.label}
              </button>
            ))}
            <span className="font-mono text-[9px] text-white/40 ml-auto">
              {(tune.phaseMs / 1000).toFixed(0)}s · drain {tune.drainPerSec.toFixed(1)}%/s · hit -{tune.wrongHit}%
            </span>
          </div>
          {locked && (
            <p className="mt-1 font-mono text-[9px] text-white/30">Threat level locks once the gauntlet starts.</p>
          )}
          {showRestored && (
            <p className="mt-2 rounded border border-accent/40 bg-accent/10 px-2 py-1 font-mono text-[9px] text-accent">
              Checkpoint restored — stage {phaseIdx + 1}, integrity {Math.ceil(integrity)}%
            </p>
          )}
        </div>



        {/* integrity + timer */}
        <div className="px-4 pt-3 space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 shrink-0" style={{ color: barColor }} />
            <span className="font-display text-[10px] uppercase tracking-[0.2em] text-white/60 shrink-0">
              System integrity
            </span>
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full transition-all duration-150"
                style={{ width: `${integrity}%`, background: barColor, boxShadow: `0 0 12px ${barColor}` }}
              />
            </div>
            <span className="font-mono text-[11px] shrink-0" style={{ color: barColor }}>
              {Math.ceil(integrity)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display text-[10px] uppercase tracking-[0.2em] text-white/40 shrink-0">
              Stage {phaseIdx + 1}/{boss.phases.length} · {phase.stage}
            </span>
            <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className={cn("h-full transition-all", timePct > 40 ? "bg-primary" : "bg-destructive animate-pulse")}
                style={{ width: `${timePct}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-white/50 shrink-0">{(timeLeft / 1000).toFixed(1)}s</span>
          </div>
        </div>

        {/* hostile console */}
        <div className="mx-4 mt-3 rounded-lg border border-white/10 bg-[#05060d] p-3 space-y-1">
          {phase.console.map((line, i) => (
            <div key={i} className="font-mono text-[10.5px] leading-relaxed text-emerald-300/80 break-words">
              <span className="text-white/25 select-none">{String(i + 1).padStart(2, "0")} </span>
              {line}
            </div>
          ))}
        </div>

        {/* prompt + options */}
        <div className="p-4 space-y-2">
          <p className="font-display text-sm text-white uppercase tracking-wide flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            {phase.prompt}
          </p>
          <div className="space-y-1.5">
            {phase.options.map((opt, i) => {
              const isAnswer = i === phase.answer;
              const revealed = picked !== null;
              return (
                <button
                  key={i}
                  disabled={revealed}
                  onClick={() => choose(i)}
                  className={cn(
                    "w-full text-left rounded-lg border px-3 py-2.5 text-[13px] transition-all",
                    !revealed && "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30",
                    revealed && isAnswer && "border-accent/70 bg-accent/15 text-white",
                    revealed && !isAnswer && picked === i && "border-destructive/70 bg-destructive/15 text-white",
                    revealed && !isAnswer && picked !== i && "border-white/5 bg-white/[0.02] text-white/35",
                  )}
                >
                  <span className="font-mono text-[10px] text-white/40 mr-2">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div
              className={cn(
                "rounded-lg border p-3 text-xs leading-relaxed animate-fade-in",
                wasWrong ? "border-destructive/40 bg-destructive/10 text-white/85" : "border-accent/40 bg-accent/10 text-white/85",
              )}
            >
              <div className="font-display text-[10px] uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3" />
                {picked === -1
                  ? `Too slow — ${tune.timeoutHit}% integrity lost`
                  : wasWrong
                    ? `Wrong call — ${tune.wrongHit}% integrity lost`
                    : "Correct countermeasure"}
              </div>
              {phase.debrief}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 text-white/70 hover:bg-white/10"
              onClick={() => { clearCheckpoint(); onAbort(); }}
            >
              Disconnect
            </Button>
            <Button
              variant="cyber"
              size="sm"
              className="flex-1"
              disabled={picked === null}
              onClick={advance}
            >
              {phaseIdx + 1 >= boss.phases.length ? "Purge the boss" : "Next stage"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
