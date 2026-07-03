import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, ShieldOff, Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import DefenderAvatar, { type DefenderPose } from "./DefenderAvatar";
import AttackerAvatar from "./AttackerAvatar";
import DefenderHUD from "./DefenderHUD";
import ConsequenceOverlay from "./ConsequenceOverlay";
import ThreatScene from "./scenes/ThreatScene";
import {
  METER_STARTS,
  WAVES,
  type MeterKey,
  type Threat,
  type ThreatAction,
} from "@/data/defenderThreats";

interface StreamResult {
  correct: number;
  wrong: number;
  missed: number;
  total: number;
  score: number;
  bestCombo: number;
}

interface Props {
  durationSec?: number; // kept for API compatibility
  onExit: () => void;
  onComplete: (r: StreamResult) => void;
}

type Phase = "playing" | "consequence" | "over";

interface PendingOutcome {
  outcome: "safe" | "compromised";
  message: string;
  teach: string;
  damage?: Partial<Record<MeterKey, number>>;
}

const TICK_MS = 100;

/**
 * Data Defense Simulator (formerly Phishing Stream Game)
 * Orchestrates waves of live threats. Player defends 4 meters.
 */
export default function PhishingStreamGame({ onExit, onComplete }: Props) {
  // --- flattened threat queue across waves ---
  const queue = useMemo(() => WAVES.flatMap((w, wi) => w.map((t) => ({ ...t, waveIdx: wi }))), []);
  const totalWaves = WAVES.length;

  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [meters, setMeters] = useState<Record<MeterKey, number>>({ ...METER_STARTS });
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [pose, setPose] = useState<DefenderPose>("alert");
  const [attackerDefeated, setAttackerDefeated] = useState(false);
  const [pending, setPending] = useState<PendingOutcome | null>(null);

  // stats
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [missed, setMissed] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  // lifeline
  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [showRedFlags, setShowRedFlags] = useState(false);

  const threat = queue[idx];
  const waveIdx = threat?.waveIdx ?? totalWaves - 1;

  // Reset reaction timer when threat changes
  useEffect(() => {
    if (!threat || phase !== "playing") return;
    setTimeLeftMs(threat.reactMs);
    setPose("alert");
    setAttackerDefeated(false);
    setShowRedFlags(false);
  }, [threat, phase]);

  // Reaction countdown
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (phase !== "playing" || !threat || showRedFlags) {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      return;
    }
    tickRef.current = setInterval(() => {
      setTimeLeftMs((t) => {
        const next = t - TICK_MS;
        if (next <= 0) {
          clearInterval(tickRef.current!);
          tickRef.current = null;
          handleTimeout();
          return 0;
        }
        return next;
      });
    }, TICK_MS);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, threat, showRedFlags]);

  const applyDamage = useCallback((damage: Partial<Record<MeterKey, number>>) => {
    setMeters((m) => {
      const next = { ...m };
      let killed = false;
      (Object.entries(damage) as [MeterKey, number][]).forEach(([k, v]) => {
        next[k] = Math.max(0, next[k] - v);
        if (next[k] <= 0) killed = true;
      });
      if (killed) {
        // schedule end-of-game after consequence overlay
        setTimeout(() => setPhase("over"), 50);
      }
      return next;
    });
  }, []);

  const finishConsequence = useCallback(() => {
    setPending(null);
    // move to next threat or end
    setIdx((i) => {
      const next = i + 1;
      if (next >= queue.length) {
        setPhase("over");
        return i;
      }
      setPhase("playing");
      return next;
    });
  }, [queue.length]);

  const handleTimeout = useCallback(() => {
    if (!threat) return;
    setMissed((n) => n + 1);
    setCombo(0);
    setPose("hurt");
    // timeout = light damage on identity + whatever the worst unsafe damage would have been (half)
    const worstUnsafe = threat.actions.find((a) => !a.safe && a.damage);
    const dmg: Partial<Record<MeterKey, number>> = { identity: 8 };
    if (worstUnsafe?.damage) {
      (Object.entries(worstUnsafe.damage) as [MeterKey, number][]).forEach(([k, v]) => {
        dmg[k] = (dmg[k] ?? 0) + Math.round(v * 0.5);
      });
    }
    applyDamage(dmg);
    setPending({
      outcome: "compromised",
      message: `You froze. The attack landed while you hesitated.`,
      teach: threat.teach,
      damage: dmg,
    });
    setPhase("consequence");
  }, [threat, applyDamage]);

  const handleAction = useCallback(
    (action: ThreatAction) => {
      if (!threat || phase !== "playing") return;

      if (action.safe) {
        const speedBonus = Math.round((timeLeftMs / threat.reactMs) * 50);
        const base = 100;
        const gained = base + speedBonus + combo * 10;
        setScore((s) => s + gained);
        setCorrect((n) => n + 1);
        setCombo((c) => {
          const next = c + 1;
          setBestCombo((b) => Math.max(b, next));
          return next;
        });
        setPose("shield");
        setAttackerDefeated(true);
        setPending({
          outcome: "safe",
          message: action.rewardMessage ?? "You made the right call. Attack neutralized.",
          teach: threat.teach,
        });
        setPhase("consequence");
      } else {
        setWrong((n) => n + 1);
        setCombo(0);
        setPose("hurt");
        if (action.damage) applyDamage(action.damage);
        setPending({
          outcome: "compromised",
          message: action.failMessage ?? "Attacker succeeded. Data compromised.",
          teach: threat.teach,
          damage: action.damage,
        });
        setPhase("consequence");
      }
    },
    [threat, phase, timeLeftMs, combo, applyDamage],
  );

  // Emit result on game over
  const emittedRef = useRef(false);
  useEffect(() => {
    if (phase !== "over" || emittedRef.current) return;
    emittedRef.current = true;
    const total = correct + wrong + missed;
    onComplete({
      correct,
      wrong,
      missed,
      total,
      score,
      bestCombo,
    });
  }, [phase, correct, wrong, missed, score, bestCombo, onComplete]);

  const useLifeline = () => {
    if (lifelineUsed || phase !== "playing") return;
    setLifelineUsed(true);
    setShowRedFlags(true);
  };

  const resumeAfterLifeline = () => setShowRedFlags(false);

  if (phase === "over" && !pending) {
    // Handled by parent (results screen)
    return null;
  }

  return (
    <div className="relative">
      {/* Ambient scanlines background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-screen"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, hsl(var(--primary)) 0, hsl(var(--primary)) 1px, transparent 1px, transparent 4px)",
        }}
      />

      <div className="space-y-3 relative">
        {/* HUD */}
        <DefenderHUD
          meters={meters}
          wave={waveIdx + 1}
          waveTotal={totalWaves}
          timeLeftMs={timeLeftMs}
          reactWindowMs={threat?.reactMs ?? 1}
        />

        {/* Battle stage */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl border border-primary/20 bg-card/40 backdrop-blur p-3 min-h-[180px]">
          <DefenderAvatar pose={pose} className="w-28 h-28" />

          {/* attack vector arrows */}
          <div className="flex flex-col items-center justify-center gap-1 text-primary/70">
            <div className="text-[9px] uppercase tracking-widest font-black">
              {threat?.category}
            </div>
            <div className="flex items-center gap-1">
              <span className="animate-pulse">◄</span>
              <span className="animate-pulse [animation-delay:100ms]">◄</span>
              <span className="animate-pulse [animation-delay:200ms]">◄</span>
            </div>
            <div className="text-[9px] font-mono text-destructive animate-pulse">
              INBOUND
            </div>
          </div>

          {threat && (
            <AttackerAvatar
              kind={threat.attacker}
              defeated={attackerDefeated}
              className="w-24"
            />
          )}
        </div>

        {/* Threat scene */}
        {threat && phase === "playing" && (
          <ThreatScene threat={threat} showRedFlags={showRedFlags} />
        )}

        {/* Lifeline red flags overlay resume prompt */}
        {showRedFlags && (
          <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3 flex items-center justify-between gap-3 animate-fade-in">
            <div className="text-xs text-yellow-400">
              Timer paused. Study the flags, then pick your action.
            </div>
            <Button size="sm" variant="secondary" onClick={resumeAfterLifeline}>
              Ready
            </Button>
          </div>
        )}

        {/* Actions */}
        {threat && phase === "playing" && (
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(threat.actions.length, 3)}, minmax(0,1fr))` }}>
            {threat.actions.map((a) => (
              <button
                key={a.id}
                onClick={() => handleAction(a)}
                className={cn(
                  "relative rounded-lg border-2 p-3 text-left transition-all hover:scale-[1.02] active:scale-95",
                  "border-primary/30 bg-card/60 backdrop-blur hover:border-primary hover:bg-primary/10",
                  "min-h-[68px] flex flex-col justify-center",
                )}
              >
                <div className="text-sm font-black leading-tight">{a.label}</div>
                {a.hint && <div className="text-[10px] text-muted-foreground mt-0.5">{a.hint}</div>}
              </button>
            ))}
          </div>
        )}

        {/* Bottom controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={useLifeline}
            disabled={lifelineUsed || phase !== "playing"}
            className="gap-1"
          >
            <Eye className="w-4 h-4" />
            {lifelineUsed ? "Lifeline used" : "Red flags (1x)"}
          </Button>
          <div className="ml-auto flex items-center gap-3 text-[11px]">
            <span className="text-primary font-mono">SCORE {score}</span>
            <span className="text-orange-500 font-mono">x{combo}</span>
            <span className="text-muted-foreground font-mono">
              {correct}✓ / {wrong}✗ / {missed}⏱
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onExit} className="gap-1 text-destructive">
            <ShieldOff className="w-4 h-4" /> Abort
          </Button>
        </div>
      </div>

      {/* Consequence cutscene */}
      {pending && (
        <ConsequenceOverlay
          outcome={pending.outcome}
          message={pending.message}
          teach={pending.teach}
          damage={pending.damage}
          onDone={finishConsequence}
        />
      )}

      {/* Game-over screen for meter wipeout — brief, then parent handles results */}
      {phase === "over" && !pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
          <div className="max-w-md w-full rounded-2xl border-2 border-destructive p-6 space-y-3 text-center bg-card">
            <Skull className="w-16 h-16 mx-auto text-destructive animate-pulse" />
            <div className="text-3xl font-black text-destructive">IDENTITY SOLD</div>
            <p className="text-sm text-muted-foreground">
              An attacker fully compromised you. Your data is now on the dark web.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
