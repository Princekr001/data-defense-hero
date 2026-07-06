import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, ShieldOff, Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import DefenderAvatar, { type DefenderPose } from "./DefenderAvatar";
import AttackerAvatar from "./AttackerAvatar";
import DefenderHUD from "./DefenderHUD";
import ConsequenceOverlay from "./ConsequenceOverlay";
import ThreatScene from "./scenes/ThreatScene";
import CipherBot from "./CipherBot";
import KnowledgeCard, { type KnowledgePayload } from "./knowledge/KnowledgeCard";
import CaseFileCard from "./CaseFileCard";
import AchievementToast from "./AchievementToast";
import {
  METER_STARTS,
  WAVES,
  type MeterKey,
  type ThreatAction,
} from "@/data/defenderThreats";
import {
  FUN_FACTS,
  COMIC_CASES,
  MYTHS,
  CYBER_TIPS,
  CASE_FILES,
  ACHIEVEMENTS_DEF,
} from "@/data/knowledge";
import { useKnowledgeVault, pickRandom } from "@/hooks/useKnowledgeVault";

interface StreamResult {
  correct: number;
  wrong: number;
  missed: number;
  total: number;
  score: number;
  bestCombo: number;
  bankSaved: number;
  identityLeft: number;
  knowledgeGained: number;
  factsUnlocked: number;
  achievements: number;
}

interface Props {
  durationSec?: number;
  onExit: () => void;
  onComplete: (r: StreamResult) => void;
}

type Phase = "playing" | "consequence" | "knowledge" | "caseFile" | "over";

interface PendingOutcome {
  outcome: "safe" | "compromised";
  message: string;
  teach: string;
  damage?: Partial<Record<MeterKey, number>>;
}

const TICK_MS = 100;

export default function PhishingStreamGame({ onExit, onComplete }: Props) {
  const queue = useMemo(() => WAVES.flatMap((w, wi) => w.map((t) => ({ ...t, waveIdx: wi }))), []);
  const totalWaves = WAVES.length;

  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [meters, setMeters] = useState<Record<MeterKey, number>>({ ...METER_STARTS });
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [pose, setPose] = useState<DefenderPose>("alert");
  const [botMood, setBotMood] = useState<"idle" | "safe" | "hit">("idle");
  const [attackerDefeated, setAttackerDefeated] = useState(false);
  const [pending, setPending] = useState<PendingOutcome | null>(null);
  const [knowledge, setKnowledge] = useState<KnowledgePayload | null>(null);
  const [caseFile, setCaseFile] = useState<(typeof CASE_FILES)[number] | null>(null);
  const [achievement, setAchievement] = useState<{ icon: string; name: string; tagline: string } | null>(null);

  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [missed, setMissed] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [showRedFlags, setShowRedFlags] = useState(false);
  const [lifelineUsedThisThreat, setLifelineUsedThisThreat] = useState(false);
  const [bankAtWaveStart, setBankAtWaveStart] = useState(METER_STARTS.bank);

  const vault = useKnowledgeVault();

  const threat = queue[idx];
  const waveIdx = threat?.waveIdx ?? totalWaves - 1;

  // Achievements deduped per session
  const unlockedThisRun = useRef<Set<string>>(new Set());
  const tryUnlock = useCallback((id: string) => {
    if (unlockedThisRun.current.has(id)) return;
    const def = ACHIEVEMENTS_DEF.find((a) => a.id === id);
    if (!def) return;
    unlockedThisRun.current.add(id);
    vault.unlockAchievement(id);
    setAchievement({ icon: def.icon, name: def.name, tagline: def.tagline });
  }, [vault]);

  useEffect(() => {
    if (!threat || phase !== "playing") return;
    setTimeLeftMs(threat.reactMs);
    setPose("alert");
    setAttackerDefeated(false);
    setShowRedFlags(false);
    setLifelineUsedThisThreat(false);
  }, [threat, phase]);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (phase !== "playing" || !threat || showRedFlags) {
      if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
      return;
    }
    tickRef.current = setInterval(() => {
      setTimeLeftMs((t) => {
        const next = t - TICK_MS;
        if (next <= 0) {
          clearInterval(tickRef.current!); tickRef.current = null;
          handleTimeout(); return 0;
        }
        return next;
      });
    }, TICK_MS);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
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
      if (killed) setTimeout(() => setPhase("over"), 50);
      return next;
    });
  }, []);

  // Pick a random knowledge card, avoiding already-seen
  const pickKnowledge = useCallback((): KnowledgePayload => {
    const buckets = ["fact", "comic", "myth", "tip"] as const;
    const kind = buckets[Math.floor(Math.random() * buckets.length)];
    const seen = vault.state.seen;
    if (kind === "fact") return { kind, data: pickRandom(FUN_FACTS, seen) };
    if (kind === "comic") return { kind, data: pickRandom(COMIC_CASES, seen) };
    if (kind === "myth") return { kind, data: pickRandom(MYTHS, seen) };
    return { kind: "tip", data: pickRandom(CYBER_TIPS, seen) };
  }, [vault.state.seen]);

  const advanceAfterKnowledge = useCallback(() => {
    // Check for wave end -> case file
    const nextIdx = idx + 1;
    const currentWave = queue[idx]?.waveIdx ?? 0;
    const nextWave = queue[nextIdx]?.waveIdx;
    const waveClearing = nextWave !== undefined && nextWave !== currentWave;
    const allDone = nextIdx >= queue.length;

    // Bank Guardian achievement — bank untouched during wave
    if ((waveClearing || allDone) && meters.bank >= bankAtWaveStart) {
      tryUnlock("bank-guardian");
    }

    if (waveClearing) {
      const file = CASE_FILES[Math.min(currentWave, CASE_FILES.length - 1)];
      setCaseFile(file);
      setPhase("caseFile");
      return;
    }
    if (allDone) { setPhase("over"); return; }
    setIdx(nextIdx);
    setPhase("playing");
  }, [idx, queue, meters.bank, bankAtWaveStart, tryUnlock]);

  const finishConsequence = useCallback(() => {
    setPending(null);
    // Cipher Bot reacts through the knowledge screen (mood already set)
    const payload = pickKnowledge();
    // mark seen + count
    vault.markSeen((payload.data as any).id);
    setKnowledge(payload);
    setPhase("knowledge");
    // Cyber Scholar achievement
    if (vault.state.cardsRead + 1 >= 5) tryUnlock("cyber-scholar");
  }, [pickKnowledge, vault, tryUnlock]);

  const finishKnowledge = useCallback(() => {
    setKnowledge(null);
    advanceAfterKnowledge();
  }, [advanceAfterKnowledge]);

  const finishCaseFile = useCallback(() => {
    setCaseFile(null);
    const nextIdx = idx + 1;
    if (nextIdx >= queue.length) { setPhase("over"); return; }
    setBankAtWaveStart(meters.bank);
    setIdx(nextIdx);
    setPhase("playing");
  }, [idx, queue.length, meters.bank]);

  const handleTimeout = useCallback(() => {
    if (!threat) return;
    setMissed((n) => n + 1);
    setCombo(0);
    setPose("hurt");
    setBotMood("hit");
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
        const gained = 100 + speedBonus + combo * 10;
        setScore((s) => s + gained);
        setCorrect((n) => {
          const next = n + 1;
          if (next >= 5) tryUnlock("spam-slayer");
          return next;
        });
        setCombo((c) => {
          const next = c + 1;
          setBestCombo((b) => Math.max(b, next));
          if (next >= 3) tryUnlock("no-flinch");
          return next;
        });
        if (lifelineUsedThisThreat) tryUnlock("eagle-eye");
        if (threat.scene === "qr") tryUnlock("qr-master");
        setPose("shield");
        setBotMood("safe");
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
        setBotMood("hit");
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
    [threat, phase, timeLeftMs, combo, applyDamage, lifelineUsedThisThreat, tryUnlock],
  );

  const emittedRef = useRef(false);
  useEffect(() => {
    if (phase !== "over" || emittedRef.current) return;
    emittedRef.current = true;
    const total = correct + wrong + missed;
    onComplete({
      correct, wrong, missed, total, score, bestCombo,
      bankSaved: meters.bank,
      identityLeft: meters.identity,
      knowledgeGained: (correct + wrong + missed) * 15,
      factsUnlocked: vault.state.seen.length,
      achievements: unlockedThisRun.current.size,
    });
  }, [phase, correct, wrong, missed, score, bestCombo, meters, vault.state.seen.length, onComplete]);

  const useLifeline = () => {
    if (lifelineUsed || phase !== "playing") return;
    setLifelineUsed(true);
    setLifelineUsedThisThreat(true);
    setShowRedFlags(true);
  };
  const resumeAfterLifeline = () => setShowRedFlags(false);

  if (phase === "over" && !pending && !knowledge && !caseFile) return null;

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-screen"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, hsl(var(--primary)) 0, hsl(var(--primary)) 1px, transparent 1px, transparent 4px)",
        }}
      />

      <div className="space-y-3 relative">
        <DefenderHUD
          meters={meters}
          wave={waveIdx + 1}
          waveTotal={totalWaves}
          timeLeftMs={timeLeftMs}
          reactWindowMs={threat?.reactMs ?? 1}
        />

        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl border border-primary/20 bg-card/40 backdrop-blur p-3 min-h-[180px]">
          <DefenderAvatar pose={pose} className="w-28 h-28" />
          <div className="flex flex-col items-center justify-center gap-1 text-primary/70">
            <div className="text-[9px] uppercase tracking-widest font-black">{threat?.category}</div>
            <div className="flex items-center gap-1">
              <span className="animate-pulse">◄</span>
              <span className="animate-pulse [animation-delay:100ms]">◄</span>
              <span className="animate-pulse [animation-delay:200ms]">◄</span>
            </div>
            <div className="text-[9px] font-mono text-destructive animate-pulse">INBOUND</div>
          </div>
          {threat && <AttackerAvatar kind={threat.attacker} defeated={attackerDefeated} className="w-24" />}
        </div>

        {threat && phase === "playing" && <ThreatScene threat={threat} showRedFlags={showRedFlags} />}

        {showRedFlags && (
          <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3 flex items-center justify-between gap-3 animate-fade-in">
            <div className="text-xs text-yellow-400">Timer paused. Study the flags, then pick your action.</div>
            <Button size="sm" variant="secondary" onClick={resumeAfterLifeline}>Ready</Button>
          </div>
        )}

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

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={useLifeline} disabled={lifelineUsed || phase !== "playing"} className="gap-1">
            <Eye className="w-4 h-4" />
            {lifelineUsed ? "Lifeline used" : "Red flags (1x)"}
          </Button>
          <div className="ml-auto flex items-center gap-3 text-[11px]">
            <span className="text-primary font-mono">SCORE {score}</span>
            <span className="text-orange-500 font-mono">x{combo}</span>
            <span className="text-muted-foreground font-mono">{correct}✓ / {wrong}✗ / {missed}⏱</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onExit} className="gap-1 text-destructive">
            <ShieldOff className="w-4 h-4" /> Abort
          </Button>
        </div>

        {/* Cipher Bot — floating companion */}
        <div className="fixed bottom-4 left-4 z-30">
          <CipherBot mood={botMood} />
        </div>
      </div>

      {pending && (
        <ConsequenceOverlay
          outcome={pending.outcome}
          message={pending.message}
          teach={pending.teach}
          damage={pending.damage}
          onDone={finishConsequence}
        />
      )}

      {knowledge && <KnowledgeCard payload={knowledge} onDone={finishKnowledge} />}
      {caseFile && <CaseFileCard file={caseFile} onDone={finishCaseFile} />}
      {achievement && (
        <AchievementToast
          icon={achievement.icon}
          name={achievement.name}
          tagline={achievement.tagline}
          onDone={() => setAchievement(null)}
        />
      )}

      {phase === "over" && !pending && !knowledge && !caseFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
          <div className="max-w-md w-full rounded-2xl border-2 border-destructive p-6 space-y-3 text-center bg-card">
            <Skull className="w-16 h-16 mx-auto text-destructive animate-pulse" />
            <div className="text-3xl font-black text-destructive">IDENTITY SOLD</div>
            <p className="text-sm text-muted-foreground">An attacker fully compromised you. Your data is now on the dark web.</p>
          </div>
        </div>
      )}
    </div>
  );
}
