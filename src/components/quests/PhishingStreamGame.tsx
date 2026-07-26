import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, ShieldOff, Skull, Sparkles, AlertTriangle, BookOpen, ChevronRight } from "lucide-react";
import ActionJournal, { type JournalEntry } from "./ActionJournal";
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
import DamageReport from "./DamageReport";
import {
  METER_STARTS,
  WAVES,
  FOLLOW_UPS,
  inferExposures,
  type MeterKey,
  type ThreatAction,
  type Threat,
  type Exposure,
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

type QThreat = Threat & { waveIdx: number; injected?: boolean };

interface StreamResult {
  correct: number; wrong: number; missed: number; total: number;
  score: number; bestCombo: number;
  bankSaved: number; identityLeft: number;
  knowledgeGained: number; factsUnlocked: number; achievements: number;
}

interface Props {
  durationSec?: number;
  onExit: () => void;
  onComplete: (r: StreamResult) => void;
}

type Phase = "playing" | "consequence" | "report" | "knowledge" | "caseFile" | "over";

interface PendingOutcome {
  outcome: "safe" | "compromised";
  message: string;
  teach: string;
  damage?: Partial<Record<MeterKey, number>>;
  heal?: Partial<Record<MeterKey, number>>;
  branchTag?: string; // shown in overlay: "Attacker escalating…" / "Recovery pulse"
  actionTaken: string;
  category: string;
  exposures: Exposure[];
  metersBefore: Record<MeterKey, number>;
}

const TICK_MS = 100;
const MAX_INJECTIONS = 4;

function initialQueue(): QThreat[] {
  return WAVES.flatMap((w, wi) => w.map((t) => ({ ...t, waveIdx: wi })));
}

export default function PhishingStreamGame({ onExit, onComplete }: Props) {
  const [queue, setQueue] = useState<QThreat[]>(() => initialQueue());
  const totalWaves = WAVES.length;

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

  // -------- Branching profile --------
  const [safeStreak, setSafeStreak] = useState(0);
  const [riskyStreak, setRiskyStreak] = useState(0);
  const [exposures, setExposures] = useState<Exposure[]>([]);
  const [reactMod, setReactMod] = useState(1); // multiplier for next threat's reactMs
  const injectionsRef = useRef(0);
  const JOURNAL_KEY = "dds.actionJournal.v1";
  const [journal, setJournal] = useState<JournalEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(JOURNAL_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as JournalEntry[]) : [];
    } catch {
      return [];
    }
  });
  const [journalOpen, setJournalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
    } catch {
      /* storage full or blocked — ignore */
    }
  }, [journal]);
  const stepRef = useRef(0);

  const vault = useKnowledgeVault();


  const threat = queue[0];
  const waveIdx = threat?.waveIdx ?? totalWaves - 1;

  const unlockedThisRun = useRef<Set<string>>(new Set());
  const tryUnlock = useCallback((id: string) => {
    if (unlockedThisRun.current.has(id)) return;
    const def = ACHIEVEMENTS_DEF.find((a) => a.id === id);
    if (!def) return;
    unlockedThisRun.current.add(id);
    vault.unlockAchievement(id);
    setAchievement({ icon: def.icon, name: def.name, tagline: def.tagline });
  }, [vault]);

  // Reset timer per threat, applying the branching reactMod
  useEffect(() => {
    if (!threat || phase !== "playing") return;
    const modded = Math.max(1200, Math.round(threat.reactMs * reactMod));
    setTimeLeftMs(modded);
    setPose("alert");
    setAttackerDefeated(false);
    setShowRedFlags(false);
    setLifelineUsedThisThreat(false);
  }, [threat, phase, reactMod]);

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

  const applyDelta = useCallback((delta: Partial<Record<MeterKey, number>>, mode: "damage" | "heal") => {
    setMeters((m) => {
      const next = { ...m };
      let killed = false;
      (Object.entries(delta) as [MeterKey, number][]).forEach(([k, v]) => {
        const cap = k === "bank" ? METER_STARTS.bank : k === "contacts" ? METER_STARTS.contacts : 100;
        if (mode === "damage") {
          next[k] = Math.max(0, next[k] - v);
          if (next[k] <= 0) killed = true;
        } else {
          next[k] = Math.min(cap, next[k] + v);
        }
      });
      if (killed) setTimeout(() => setPhase("over"), 50);
      return next;
    });
  }, []);

  // Inject a follow-up threat targeted at the fresh exposure
  const injectFollowUp = useCallback((exp: Exposure, waveOf: number) => {
    if (injectionsRef.current >= MAX_INJECTIONS) return;
    const pool = FOLLOW_UPS[exp];
    if (!pool || pool.length === 0) return;
    const t = pool[Math.floor(Math.random() * pool.length)];
    const fu: QThreat = { ...t, waveIdx: waveOf, injected: true, id: `${t.id}-${Date.now()}` };
    injectionsRef.current += 1;
    setQueue((q) => {
      if (q.length <= 1) return [...q, fu];
      // insert AFTER the current threat, so the branching kicks in next
      return [q[0], fu, ...q.slice(1)];
    });
  }, []);

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
    // Consume the current head
    setQueue((q) => {
      const consumed = q[0];
      const rest = q.slice(1);
      const nextHead = rest[0];
      const currentWave = consumed?.waveIdx ?? 0;
      const nextWave = nextHead?.waveIdx;
      const waveClearing = nextHead && nextWave !== currentWave;
      const allDone = rest.length === 0;

      if ((waveClearing || allDone) && meters.bank >= bankAtWaveStart) {
        tryUnlock("bank-guardian");
      }
      if (waveClearing) {
        const file = CASE_FILES[Math.min(currentWave, CASE_FILES.length - 1)];
        setCaseFile(file);
        setPhase("caseFile");
      } else if (allDone) {
        setPhase("over");
      } else {
        setPhase("playing");
      }
      return rest;
    });
  }, [meters.bank, bankAtWaveStart, tryUnlock]);

  const finishConsequence = useCallback(() => {
    // Cinematic done — gate the player behind the Damage Report.
    setPhase("report");
  }, []);

  const finishReport = useCallback(() => {
    if (pending) {
      stepRef.current += 1;
      const now = new Date();
      setJournal((j) => [
        ...j,
        {
          id: `${now.getTime()}-${stepRef.current}`,
          step: stepRef.current,
          category: pending.category,
          actionTaken: pending.actionTaken,
          outcome: pending.outcome,
          damage: pending.damage,
          heal: pending.heal,
          lesson: pending.teach,
          time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
    setPending(null);
    const payload = pickKnowledge();
    vault.markSeen((payload.data as any).id);
    setKnowledge(payload);
    setPhase("knowledge");
    if (vault.state.cardsRead + 1 >= 5) tryUnlock("cyber-scholar");
  }, [pending, pickKnowledge, vault, tryUnlock]);

  const finishKnowledge = useCallback(() => {
    setKnowledge(null);
    advanceAfterKnowledge();
  }, [advanceAfterKnowledge]);

  const finishCaseFile = useCallback(() => {
    setCaseFile(null);
    setBankAtWaveStart(meters.bank);
    if (queue.length === 0) { setPhase("over"); return; }
    setPhase("playing");
  }, [queue.length, meters.bank]);

  const handleTimeout = useCallback(() => {
    if (!threat) return;
    setMissed((n) => n + 1);
    setCombo(0);
    setSafeStreak(0);
    setRiskyStreak((r) => r + 1);
    setReactMod(0.85); // attackers press the advantage
    setPose("hurt");
    setBotMood("hit");
    const worstUnsafe = threat.actions.find((a) => !a.safe && a.damage);
    const dmg: Partial<Record<MeterKey, number>> = { identity: 8 };
    if (worstUnsafe?.damage) {
      (Object.entries(worstUnsafe.damage) as [MeterKey, number][]).forEach(([k, v]) => {
        dmg[k] = (dmg[k] ?? 0) + Math.round(v * 0.5);
      });
    }
    const before = { ...meters };
    applyDelta(dmg, "damage");
    setPending({
      outcome: "compromised",
      message: `You froze. The attack landed while you hesitated.`,
      teach: threat.teach,
      damage: dmg,
      branchTag: "Next threat closes in faster.",
      actionTaken: "No response (timeout)",
      category: threat.category,
      exposures: worstUnsafe ? inferExposures(worstUnsafe) : [],
      metersBefore: before,
    });
    setPhase("consequence");
  }, [threat, meters, applyDelta]);

  const handleAction = useCallback(
    (action: ThreatAction) => {
      if (!threat || phase !== "playing") return;

      const before = { ...meters };

      if (action.safe) {
        const speedBonus = Math.round((timeLeftMs / (threat.reactMs * reactMod)) * 50);
        const gained = 100 + speedBonus + combo * 10;
        setScore((s) => s + gained);
        setCorrect((n) => { const nx = n + 1; if (nx >= 5) tryUnlock("spam-slayer"); return nx; });
        setCombo((c) => {
          const nx = c + 1;
          setBestCombo((b) => Math.max(b, nx));
          if (nx >= 3) tryUnlock("no-flinch");
          return nx;
        });
        setRiskyStreak(0);

        const nextSafeStreak = safeStreak + 1;
        setSafeStreak(nextSafeStreak);

        // Optional per-action heal (e.g. "report" actions)
        if (action.heal) applyDelta(action.heal, "heal");

        // RECOVERY PULSE — 3 consecutive safe picks: heal + gentler next threat
        let branchTag: string | undefined;
        let pulseHeal: Partial<Record<MeterKey, number>> | undefined;
        if (nextSafeStreak >= 3) {
          setSafeStreak(0);
          pulseHeal = { identity: 10, device: 10, contacts: 20, bank: 1500 };
          applyDelta(pulseHeal, "heal");
          setReactMod(1.25); // player earned breathing room
          branchTag = "Recovery pulse: meters healed, next threat gentler.";
        } else {
          // subtle easing after any safe pick
          setReactMod((r) => Math.min(1.15, r + 0.05));
        }

        if (lifelineUsedThisThreat) tryUnlock("eagle-eye");
        if (threat.scene === "qr") tryUnlock("qr-master");
        setPose("shield");
        setBotMood("safe");
        setAttackerDefeated(true);
        setPending({
          outcome: "safe",
          message: action.rewardMessage ?? "You made the right call. Attack neutralized.",
          teach: threat.teach,
          heal: { ...(action.heal ?? {}), ...(pulseHeal ?? {}) },
          branchTag,
          actionTaken: action.label,
          category: threat.category,
          exposures: [],
          metersBefore: before,
        });
        setPhase("consequence");
      } else {
        setWrong((n) => n + 1);
        setCombo(0);
        setSafeStreak(0);
        const nextRisky = riskyStreak + 1;
        setRiskyStreak(nextRisky);

        if (action.damage) applyDelta(action.damage, "damage");

        // BRANCH: record exposures + inject a targeted follow-up
        const exps = inferExposures(action);
        if (exps.length) {
          setExposures((e) => Array.from(new Set([...e, ...exps])));
          injectFollowUp(exps[0], threat.waveIdx);
        }

        // Attackers speed up more if you keep failing
        const newMod = nextRisky >= 2 ? 0.75 : 0.85;
        setReactMod(newMod);

        setPose("hurt");
        setBotMood("hit");
        setPending({
          outcome: "compromised",
          message: action.failMessage ?? "Attacker succeeded. Data compromised.",
          teach: threat.teach,
          damage: action.damage,
          branchTag: exps.length
            ? `Attacker escalating — targeting your ${exps[0]}.`
            : "Attackers press the advantage. Next threat is faster.",
          actionTaken: action.label,
          category: threat.category,
          exposures: exps,
          metersBefore: before,
        });
        setPhase("consequence");
      }
    },
    [threat, phase, meters, timeLeftMs, combo, reactMod, safeStreak, riskyStreak, lifelineUsedThisThreat, applyDelta, injectFollowUp, tryUnlock],
  );

  const emittedRef = useRef(false);
  useEffect(() => {
    if (phase !== "over" || emittedRef.current) return;
    emittedRef.current = true;
    onComplete({
      correct, wrong, missed, total: correct + wrong + missed,
      score, bestCombo,
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

  // Profile badge state
  const profileState =
    riskyStreak >= 2 ? { label: "ATTACKERS ESCALATING", color: "text-destructive border-destructive/60 bg-destructive/10", Icon: AlertTriangle }
    : safeStreak >= 2 ? { label: "STEADY DEFENSE", color: "text-primary border-primary/60 bg-primary/10", Icon: Sparkles }
    : { label: "NEUTRAL", color: "text-muted-foreground border-white/10 bg-white/5", Icon: Sparkles };

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
          reactWindowMs={Math.round((threat?.reactMs ?? 1) * reactMod)}
        />

        {/* Branching profile strip */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full border", profileState.color)}>
            <profileState.Icon className="w-3 h-3" />
            {profileState.label}
          </div>
          {threat?.injected && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-destructive/60 bg-destructive/10 text-destructive animate-pulse">
              ⚡ FOLLOW-UP ATTACK
            </div>
          )}
          {exposures.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-yellow-400">
              LEAKED: {exposures.join(" · ")}
            </div>
          )}
        </div>

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
                  "group relative overflow-hidden rounded-xl border p-3 text-left transition-all hover:scale-[1.02] active:scale-95",
                  "border-primary/25 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur",
                  "hover:border-primary hover:shadow-[0_0_25px_hsl(var(--primary)/0.35)]",
                  "min-h-[72px] flex flex-col justify-center",
                )}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="text-sm font-black leading-tight tracking-tight">{a.label}</div>
                {a.hint && <div className="text-[10px] text-muted-foreground mt-0.5">{a.hint}</div>}
                <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-hover:text-primary group-hover:translate-x-0.5 transition" />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={useLifeline} disabled={lifelineUsed || phase !== "playing"} className="gap-1">
            <Eye className="w-4 h-4" />
            {lifelineUsed ? "Lifeline used" : "Red flags (1x)"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setJournalOpen(true)}
            className="gap-1 border-primary/40 hover:bg-primary/10 relative"
          >
            <BookOpen className="w-4 h-4" />
            Journal
            {journal.length > 0 && (
              <span className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black">
                {journal.length}
              </span>
            )}
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

        <div className="fixed bottom-4 left-4 z-30">
          <CipherBot mood={botMood} />
        </div>
      </div>

      {pending && phase === "consequence" && (
        <ConsequenceOverlay
          outcome={pending.outcome}
          message={pending.message + (pending.branchTag ? ` — ${pending.branchTag}` : "")}
          teach={pending.teach}
          damage={pending.damage}
          onDone={finishConsequence}
        />
      )}

      {pending && phase === "report" && (
        <DamageReport
          outcome={pending.outcome}
          actionTaken={pending.actionTaken}
          category={pending.category}
          message={pending.message}
          teach={pending.teach}
          damage={pending.damage}
          heal={pending.heal}
          metersBefore={pending.metersBefore}
          metersAfter={meters}
          exposures={pending.exposures}
          branchTag={pending.branchTag}
          onContinue={finishReport}
        />
      )}

      {knowledge && <KnowledgeCard payload={knowledge} onDone={finishKnowledge} />}
      {caseFile && <CaseFileCard file={caseFile} onDone={finishCaseFile} />}

      <ActionJournal
        entries={journal}
        open={journalOpen}
        onClose={() => setJournalOpen(false)}
        onClear={() => setJournal([])}
      />

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
