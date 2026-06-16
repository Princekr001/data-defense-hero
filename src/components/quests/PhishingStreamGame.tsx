import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { phishingTypes } from "@/data/phishingTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trash2,
  Inbox,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Flame,
  Heart,
  Zap,
  X,
  Eye,
  Trophy,
  Skull,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StreamMessage {
  id: string;
  text: string;
  phish: boolean;
  typeName: string;
  hint?: string;
}

interface Result {
  correct: number;
  wrong: number;
  missed: number;
  total: number;
  score: number;
  bestCombo: number;
}

interface Props {
  durationSec?: number;
  onComplete: (result: Result) => void;
  onExit: () => void;
}

const TICK_MS = 80;
const MSG_LIFETIME_START_MS = 2400;
const MSG_LIFETIME_FLOOR_MS = 850;
const MSG_LIFETIME_DECAY_MS = 80;
const START_LIVES = 2;
const ANSWERS_PER_LEVEL = 5;

const LEVELS = [
  { name: "ROOKIE",     color: "from-sky-400 to-cyan-300",     ring: "ring-sky-400/60" },
  { name: "ANALYST",    color: "from-emerald-400 to-lime-300", ring: "ring-emerald-400/60" },
  { name: "HUNTER",     color: "from-amber-400 to-yellow-300", ring: "ring-amber-400/60" },
  { name: "SPECIALIST", color: "from-orange-500 to-rose-400",  ring: "ring-orange-500/60" },
  { name: "ELITE",      color: "from-fuchsia-500 to-pink-400", ring: "ring-fuchsia-500/60" },
  { name: "LEGEND",     color: "from-violet-500 to-indigo-400",ring: "ring-violet-500/60" },
  { name: "MYTHIC",     color: "from-red-500 to-rose-600",     ring: "ring-red-500/60" },
];
const getLevel = (n: number) =>
  LEVELS[Math.min(LEVELS.length - 1, Math.floor(n / ANSWERS_PER_LEVEL))];

const buildPool = (): StreamMessage[] => {
  let i = 0;
  return phishingTypes.flatMap((t) =>
    t.samples.map((s) => ({
      id: `${t.id}-${i++}`,
      text: s.text,
      phish: s.phish,
      typeName: t.name,
      hint: s.hint,
    })),
  );
};

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const typeRedFlags = (typeName: string): string[] => {
  const t = phishingTypes.find((x) => x.name === typeName);
  return t ? t.redFlags : [];
};

export default function PhishingStreamGame({
  durationSec = 45,
  onComplete,
  onExit,
}: Props) {
  const pool = useMemo(() => shuffle(buildPool()), []);
  const cursor = useRef(0);

  const [current, setCurrent] = useState<StreamMessage | null>(() => pool[0] ?? null);
  const [msgAgeMs, setMsgAgeMs] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [lives, setLives] = useState(START_LIVES);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const lifetimeMs = Math.max(
    MSG_LIFETIME_FLOOR_MS,
    MSG_LIFETIME_START_MS - answered * MSG_LIFETIME_DECAY_MS,
  );
  const [result, setResult] = useState<Result>({
    correct: 0,
    wrong: 0,
    missed: 0,
    total: 0,
    score: 0,
    bestCombo: 0,
  });
  const [solution, setSolution] = useState<{
    kind: "correct" | "wrong" | "missed";
    title: string;
    body: string;
  } | null>(null);
  const [shake, setShake] = useState(false);
  const [finished, setFinished] = useState(false);
  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [lifelineActive, setLifelineActive] = useState(false);
  const [levelUp, setLevelUp] = useState<null | { idx: number }>(null);
  const levelIdx = Math.min(LEVELS.length - 1, Math.floor(answered / ANSWERS_PER_LEVEL));
  const level = LEVELS[levelIdx];
  const levelProgress = ((answered % ANSWERS_PER_LEVEL) / ANSWERS_PER_LEVEL) * 100;

  // Trigger level-up overlay
  useEffect(() => {
    if (answered === 0) return;
    if (answered % ANSWERS_PER_LEVEL === 0) {
      const idx = Math.min(LEVELS.length - 1, Math.floor(answered / ANSWERS_PER_LEVEL));
      setLevelUp({ idx });
      const id = window.setTimeout(() => setLevelUp(null), 1400);
      return () => window.clearTimeout(id);
    }
  }, [answered]);

  useEffect(() => {
    cursor.current = 1;
  }, []);

  const nextMessage = useCallback(() => {
    const msg = pool[cursor.current % pool.length];
    cursor.current += 1;
    setCurrent(msg ? { ...msg, id: `${msg.id}-${cursor.current}` } : null);
    setMsgAgeMs(0);
  }, [pool]);

  const finish = useCallback(
    (finalScore: number, finalCombo: number) => {
      setFinished(true);
      setResult((r) => {
        const final = { ...r, score: finalScore, bestCombo: finalCombo };
        onComplete(final);
        return final;
      });
    },
    [onComplete],
  );

  const handleDecision = useCallback(
    (action: "remove" | "keep") => {
      if (!current || finished || solution || lifelineActive) return;
      const isCorrect =
        (current.phish && action === "remove") ||
        (!current.phish && action === "keep");

      // time bonus: faster = more points
      const speedBonus = Math.max(0, Math.round((lifetimeMs - msgAgeMs) / 100));
      const base = current.phish ? 100 : 60;
      const comboMult = 1 + combo * 0.15;
      const gained = isCorrect ? Math.round((base + speedBonus) * comboMult) : 0;

      let nextLives = lives;
      let nextCombo = isCorrect ? combo + 1 : 0;
      if (!isCorrect) nextLives = lives - 1;

      setScore((s) => s + gained);
      setCombo(nextCombo);
      setBestCombo((b) => Math.max(b, nextCombo));
      if (!isCorrect) {
        setShake(true);
        window.setTimeout(() => setShake(false), 400);
      }

      setResult((r) => ({
        ...r,
        correct: r.correct + (isCorrect ? 1 : 0),
        wrong: r.wrong + (isCorrect ? 0 : 1),
        total: r.total + 1,
      }));
      setLives(nextLives);
      setAnswered((n) => n + 1);

      // Solution flash — game stops while shown
      setSolution({
        kind: isCorrect ? "correct" : "wrong",
        title: isCorrect
          ? current.phish
            ? `🎯 Neutralized — ${current.typeName}`
            : `✅ Smart — that one was legit`
          : current.phish
            ? `💥 Phish slipped through — ${current.typeName}`
            : `💥 You nuked a real message`,
        body:
          current.hint ??
          (current.phish
            ? "Look for urgency, lookalike domains, secrecy demands, and unexpected attachments."
            : "Normal traffic — no urgency, no credential ask, no lookalike sender."),
      });

      if (nextLives <= 0) {
        // delay finish slightly so player reads the solution
        window.setTimeout(() => finish(score + gained, Math.max(bestCombo, nextCombo)), 1400);
      }
    },
    [current, finished, solution, lifelineActive, msgAgeMs, combo, lives, score, bestCombo, finish],
  );

  const dismissSolution = useCallback(() => {
    setSolution(null);
    if (lives > 0 && !finished) nextMessage();
  }, [lives, finished, nextMessage]);

  const useLifeline = useCallback(() => {
    if (lifelineUsed || !current || finished || solution || lifelineActive) return;
    setLifelineUsed(true);
    setLifelineActive(true);
  }, [lifelineUsed, current, finished, solution, lifelineActive]);

  const dismissLifeline = useCallback(() => {
    setLifelineActive(false);
    if (lives > 0 && !finished) nextMessage();
  }, [lives, finished, nextMessage]);

  // Global countdown
  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) {
      finish(score, bestCombo);
      return;
    }
    const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearTimeout(id);
  }, [timeLeft, finished, finish, score, bestCombo]);

  // Per-message lifetime (auto miss)
  useEffect(() => {
    if (finished || solution || lifelineActive || !current) return;
    const id = window.setInterval(() => {
      setMsgAgeMs((a) => {
        const next = a + TICK_MS;
        if (next >= lifetimeMs) {
          // missed
          const wasPhish = current.phish;
          setResult((r) => ({
            ...r,
            missed: r.missed + (wasPhish ? 1 : 0),
            total: r.total + 1,
          }));
          setCombo(0);
          setAnswered((n) => n + 1);
          if (wasPhish) {
            const newLives = lives - 1;
            setLives(newLives);
            setShake(true);
            window.setTimeout(() => setShake(false), 400);
            setSolution({
              kind: "missed",
              title: `⏱️ Let through — ${current.typeName}`,
              body: current.hint ?? "Hesitation = compromise. Decide fast next time.",
            });
            if (newLives <= 0) {
              window.setTimeout(() => finish(score, bestCombo), 1400);
            }
          } else {
            // legit ignored — neutral, just move on
            nextMessage();
          }
          return 0;
        }
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [current, finished, solution, lifelineActive, lives, nextMessage, finish, score, bestCombo]);

  const msgRemainPct = Math.max(0, 100 - (msgAgeMs / lifetimeMs) * 100);
  const danger = msgRemainPct < 35;

  return (
    <Card
      className={cn(
        "relative bg-card/95 backdrop-blur-xl border-primary/40 overflow-hidden",
        "ring-2 ring-offset-0 transition-all duration-500",
        level.ring,
        shake && "animate-[shake_0.4s_ease-in-out]",
      )}
    >
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes pop-in {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes grid-drift {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes level-burst {
          0% { transform: scale(0.6) rotate(-8deg); opacity: 0; }
          40% { transform: scale(1.15) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes aurora {
          0%,100% { transform: translate3d(-10%, -10%, 0) scale(1); }
          50% { transform: translate3d(10%, 5%, 0) scale(1.15); }
        }
      `}</style>

      {/* Animated cyber background */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(120,140,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(120,140,255,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            animation: "grid-drift 6s linear infinite",
          }}
        />
        <div
          className={cn(
            "absolute -top-32 -left-32 h-80 w-80 rounded-full blur-3xl opacity-40 bg-gradient-to-br",
            level.color,
          )}
          style={{ animation: "aurora 8s ease-in-out infinite" }}
        />
        <div
          className={cn(
            "absolute -bottom-32 -right-32 h-80 w-80 rounded-full blur-3xl opacity-30 bg-gradient-to-br",
            level.color,
          )}
          style={{ animation: "aurora 10s ease-in-out infinite reverse" }}
        />
      </div>

      <CardContent className="relative z-10 p-5 space-y-4">
        {/* HUD */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r text-black font-black text-xs tracking-widest shadow-lg",
              level.color,
            )}>
              <Trophy className="h-3.5 w-3.5" />
              LVL {levelIdx + 1} · {level.name}
            </div>
            <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Inbox Defense
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="gap-1 font-mono backdrop-blur">
              <Clock className="h-3 w-3" /> {timeLeft}s
            </Badge>
            <Badge variant="outline" className="gap-1 font-mono backdrop-blur">
              {Array.from({ length: START_LIVES }).map((_, i) => (
                <Heart
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < lives ? "text-destructive fill-destructive" : "text-muted-foreground/30",
                  )}
                />
              ))}
            </Badge>
            <Badge
              className={cn(
                "gap-1 font-mono",
                combo >= 5
                  ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white animate-pulse"
                  : combo >= 3
                  ? "bg-orange-500 hover:bg-orange-500"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary",
              )}
            >
              <Flame className="h-3 w-3" /> x{combo}
            </Badge>
            <Badge variant="default" className="gap-1 font-mono">
              <Zap className="h-3 w-3" /> {score}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={useLifeline}
              disabled={lifelineUsed || !current || finished || !!solution || lifelineActive}
              className={cn(
                "h-6 px-2 text-[10px] font-bold gap-1 border-primary/50 backdrop-blur",
                !lifelineUsed && "animate-pulse",
                lifelineUsed && "opacity-40 cursor-not-allowed",
              )}
            >
              <Eye className="h-3 w-3" /> RED FLAGS
            </Button>
          </div>
        </div>

        {/* Stacked timers: round + level progress */}
        <div className="space-y-1.5">
          <Progress value={(timeLeft / durationSec) * 100} className="h-1.5" />
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full bg-gradient-to-r transition-all duration-300", level.color)}
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
              {answered % ANSWERS_PER_LEVEL}/{ANSWERS_PER_LEVEL} → next rank
            </span>
          </div>
        </div>


        {/* Card stage */}
        <div className="relative min-h-[260px]">
          {levelUp && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
              <div
                className={cn(
                  "px-8 py-5 rounded-2xl bg-gradient-to-br shadow-2xl border-2 border-white/20",
                  "text-black text-center",
                  LEVELS[levelUp.idx].color,
                )}
                style={{ animation: "level-burst 0.5s cubic-bezier(.34,1.56,.64,1)" }}
              >
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest opacity-80">
                  <Skull className="h-3 w-3" /> THREAT LEVEL UP <Skull className="h-3 w-3" />
                </div>
                <div className="text-3xl font-black tracking-wider mt-1">
                  {LEVELS[levelUp.idx].name}
                </div>
                <div className="text-[11px] font-semibold mt-1 opacity-80">
                  Messages get faster — stay sharp
                </div>
              </div>
            </div>
          )}
          {current && !solution && !finished && !lifelineActive && (
            <div
              key={current.id}
              className={cn(
                "rounded-2xl border-2 p-5 bg-gradient-to-br from-card to-card/60 shadow-xl transition-all",
                "animate-fade-in",
                danger
                  ? "border-destructive/70 shadow-destructive/30"
                  : "border-primary/40",
              )}
              style={{ animation: "pop-in 0.25s ease-out" }}
            >
              {/* Per-message timer bar */}
              <div className="mb-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    danger ? "bg-destructive" : "bg-primary",
                  )}
                  style={{ width: `${msgRemainPct}%` }}
                />
              </div>

              <div className="flex items-start gap-3">
                <div className="text-3xl">📩</div>
                <p className="flex-1 text-base sm:text-lg leading-snug text-foreground font-medium">
                  {current.text}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleDecision("keep")}
                  className="h-14 gap-2 border-2 hover:border-primary hover:bg-primary/10 font-bold"
                >
                  <ShieldCheck className="h-5 w-5" /> KEEP
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={() => handleDecision("remove")}
                  className="h-14 gap-2 font-bold"
                >
                  <Trash2 className="h-5 w-5" /> NUKE
                </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground mt-2 uppercase tracking-wider">
                Hesitation = compromise · 1 wrong move costs a life
              </p>
            </div>
          )}

          {solution && (
            <div
              className={cn(
                "rounded-2xl border-2 p-5 shadow-2xl",
                solution.kind === "correct"
                  ? "border-primary/60 bg-primary/10"
                  : "border-destructive/60 bg-destructive/10",
              )}
              style={{ animation: "pop-in 0.2s ease-out" }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  {solution.kind === "correct" ? (
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  )}
                  <h3 className="font-bold text-lg leading-tight">{solution.title}</h3>
                </div>
                <Button size="icon" variant="ghost" onClick={dismissSolution}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="rounded-lg bg-background/60 border border-border p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  Solution
                </div>
                <p className="text-sm leading-relaxed">{solution.body}</p>
              </div>
              <Button
                onClick={dismissSolution}
                className="w-full mt-3 h-11 font-bold"
                disabled={lives <= 0}
              >
                {lives <= 0 ? "Game over…" : "Next threat →"}
              </Button>
            </div>
          )}

          {lifelineActive && current && (
            <div
              className="rounded-2xl border-2 p-5 shadow-2xl border-amber-500/60 bg-amber-500/10"
              style={{ animation: "pop-in 0.2s ease-out" }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-6 w-6 text-amber-400" />
                  <h3 className="font-bold text-lg leading-tight">
                    🔍 Red Flags — {current.typeName}
                  </h3>
                </div>
                <Button size="icon" variant="ghost" onClick={dismissLifeline}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="rounded-lg bg-background/60 border border-border p-3 space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  Watch for these signals
                </div>
                {typeRedFlags(current.typeName).map((flag, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-sm text-amber-100"
                  >
                    <span className="mt-0.5 text-amber-400">⚠️</span>
                    <span className="leading-relaxed">{flag}</span>
                  </div>
                ))}
                {typeRedFlags(current.typeName).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No specific red flags recorded for this type — rely on your gut.
                  </p>
                )}
              </div>
              <Button
                onClick={dismissLifeline}
                className="w-full mt-3 h-11 font-bold bg-amber-500 hover:bg-amber-600 text-black"
              >
                Resume →
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-1">
          <Button variant="ghost" size="sm" onClick={onExit}>
            Exit
          </Button>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Best combo · x{bestCombo}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
