import { useEffect, useState } from "react";
import { useHackProgress } from "@/hooks/useHackProgress";
import { hackLevels, hackTiers, hackCategories } from "@/data/hackTargets";
import type { HackCategory, HackLevel } from "@/data/hackTargets";
import HackGrid3D from "./hack/HackGrid3D";
import MissionScene3D from "./hack/MissionScene3D";
import BossFight from "./hack/BossFight";
import { bossForLevel } from "@/data/hackBosses";
import PasswordCracker from "./hackGames/PasswordCracker";
import TraceAttacker from "./hackGames/TraceAttacker";
import FirewallBypass from "./hackGames/FirewallBypass";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Zap, RotateCw, ChevronRight, Terminal, Target, Trash2, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CategoryLessonDialog from "@/components/lessons/CategoryLessonDialog";
import ScenarioScene from "@/components/lessons/ScenarioScene";

const HACK_CAT_MAP: Record<string, "phishing" | "password" | "privacy"> = {
  phishing: "phishing",
  passwords: "password",
  privacy: "privacy",
};

type View = "grid" | "briefing" | "mission" | "boss" | "result";

interface HackGameProps {
  /** Optional level to open directly (e.g. jumped in from a landing-page slide). */
  initialLevelId?: number;
}

export default function HackGame({ initialLevelId }: HackGameProps = {}) {
  const { completed, xp, isUnlocked, isComplete, completeLevel, reset } = useHackProgress();
  const [view, setView] = useState<View>("grid");
  const [activeCategory, setActiveCategory] = useState<HackCategory | "all">(() => {
    try {
      const saved = localStorage.getItem("ddh.hackCategory.v1");
      if (saved && ["all", "passwords", "phishing", "privacy"].includes(saved)) {
        return saved as HackCategory | "all";
      }
    } catch {}
    return "all";
  });

  useEffect(() => {
    try {
      localStorage.setItem("ddh.hackCategory.v1", activeCategory);
    } catch {}
  }, [activeCategory]);
  const [active, setActive] = useState<HackLevel | null>(null);
  const [result, setResult] = useState<"success" | "fail" | null>(null);
  const [bossRun, setBossRun] = useState(0);
  const [lessonCategory, setLessonCategory] = useState<string | null>(null);
  const [fallbackFrom, setFallbackFrom] = useState<HackLevel | null>(null);
  const { toast } = useToast();

  const pulseHaptics = (pattern: number | number[] = [40, 60, 40]) => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch {}
  };

  const tierColor = (lvl: HackLevel | null) =>
    lvl ? hackTiers.find((t) => t.tier === lvl.tier)?.color ?? "#22d3ee" : "#22d3ee";

  const handleSelect = (lvl: HackLevel, clearFallback = true) => {
    setActive(lvl);
    setResult(null);
    if (clearFallback) setFallbackFrom(null);
    setView("briefing");
  };

  // Deep-link: open a specific level's briefing when arriving from a slideshow slide.
  useEffect(() => {
    if (!initialLevelId) return;
    const lvl = hackLevels.find((l) => l.id === initialLevelId);
    if (!lvl) return;
    // Locked? Practise the closest unlocked target in the same topic instead.
    const target = isUnlocked(lvl.id)
      ? lvl
      : hackLevels
          .filter((l) => l.category === lvl.category && isUnlocked(l.id))
          .sort((a, b) => b.id - a.id)[0] ??
        hackLevels.filter((l) => isUnlocked(l.id)).sort((a, b) => b.id - a.id)[0];
    if (!target) return;
    if (target.id !== lvl.id) {
      setFallbackFrom(lvl);
      pulseHaptics([60, 80, 60]);
      toast({
        title: `🔒 "${lvl.name}" is locked`,
        description: `Falling back to the nearest unlocked level: "${target.name}". Beat it to unlock more of this track.`,
        variant: "destructive",
      });
    }
    setActiveCategory(target.category);
    handleSelect(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLevelId]);

  const activeBoss = active ? bossForLevel(active.id) : null;

  // Clearing the mini-game only opens the door — the boss guards the level.
  const handleSuccess = () => {
    if (!active) return;
    if (activeBoss) {
      setBossRun((n) => n + 1);
      setView("boss");
      toast({
        title: `⚠ ${activeBoss.handle} has taken the system`,
        description: activeBoss.threat,
        variant: "destructive",
      });
      return;
    }
    completeLevel(active.id);
    setResult("success");
    setView("result");
    toast({ title: `Hack successful — +${active.xpReward} XP`, description: active.name });
  };

  const handleBossDefeat = () => {
    if (!active) return;
    completeLevel(active.id);
    setResult("success");
    setView("result");
    toast({ title: `Boss purged — +${active.xpReward} XP`, description: active.name });
  };
  const handleFail = () => {
    setResult("fail");
    setView("result");
  };

  const handleResetAll = () => {
    if (!window.confirm("Reset all hack progress and category stats? This cannot be undone.")) return;
    reset();
    setActiveCategory("all");
    try { localStorage.removeItem("ddh.hackCategory.v1"); } catch {}
    setView("grid");
    setActive(null);
    setFallbackFrom(null);
    toast({ title: "Progress reset", description: "All hack stats and category filter cleared." });
  };

  const renderMiniGame = () => {
    if (!active) return null;
    const props = { tier: active.tier, onSuccess: handleSuccess, onFail: handleFail };
    if (active.miniGame === "password") return <PasswordCracker {...props} />;
    if (active.miniGame === "trace") return <TraceAttacker {...props} />;
    return <FirewallBypass {...props} />;
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#05060d] text-foreground font-body">
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 sm:p-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { setView("grid"); setActive(null); setFallbackFrom(null); }} className="bg-black/40 backdrop-blur border-white/10">
            <ArrowLeft className="h-4 w-4" /> Hack Grid
          </Button>
        </div>
        <div className="pointer-events-auto flex items-center gap-2 bg-black/40 backdrop-blur border border-white/10 rounded-full px-3 py-1.5 text-xs">
          <Trophy className="h-3.5 w-3.5 text-yellow-400" />
          <span className="font-mono text-white tracking-tight">{xp} XP</span>
          <span className="text-white/40">·</span>
          <span className="text-white/70">{completed.length}/{hackLevels.length}</span>
          <button onClick={handleResetAll} className="ml-2 opacity-60 hover:opacity-100" title="Reset all progress">
            <RotateCw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 3D layer */}
      <div className="absolute inset-0">
        {view === "grid" ? (
          <HackGrid3D
            isUnlocked={isUnlocked}
            isComplete={isComplete}
            onSelect={handleSelect}
            onDimmedClick={(lvl) =>
              toast({
                title: "Target filtered out",
                description: `"${lvl.name}" isn't in the current category. Pick a highlighted target or switch the filter.`,
              })
            }
            activeCategory={activeCategory}
          />
        ) : (
          <MissionScene3D accent={tierColor(active)} />
        )}
      </div>

      {/* Overlays */}
      {view === "grid" && (
        <>
          {/* Keyboard-accessible level list — visible only when focused */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 focus-within:flex hidden flex-wrap items-center justify-center gap-1.5 max-w-[min(100vw,640px)] bg-black/60 backdrop-blur border border-white/10 rounded-lg p-2">
            <span className="sr-only" id="hack-targets-help">
              Use Tab and Shift+Tab to move between hack targets. Press Enter to begin a hack.
            </span>
            {hackLevels
              .filter((l) => activeCategory === "all" || l.category === activeCategory)
              .filter((l) => isUnlocked(l.id))
              .map((l) => (
                <button
                  key={l.id}
                  aria-describedby="hack-targets-help"
                  onClick={() => handleSelect(l)}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-white/5 text-white/80 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {isComplete(l.id) ? "✓ " : ""}{l.name}
                </button>
              ))}
          </div>

          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 px-3 w-full max-w-[min(100vw,640px)]"
          >
            <div
              role="radiogroup"
              aria-label="Filter hack targets by topic"
              onKeyDown={(e) => {
                const ids = hackCategories.map((c) => c.id);
                const i = ids.indexOf(activeCategory);
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveCategory(ids[(i + 1) % ids.length]);
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveCategory(ids[(i - 1 + ids.length) % ids.length]);
                } else if (e.key === "Home") {
                  e.preventDefault();
                  setActiveCategory(ids[0]);
                } else if (e.key === "End") {
                  e.preventDefault();
                  setActiveCategory(ids[ids.length - 1]);
                }
              }}
              className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 bg-black/40 backdrop-blur border border-white/10 rounded-full p-1"
            >
              {hackCategories.map((cat) => {
                const count =
                  cat.id === "all"
                    ? hackLevels.length
                    : hackLevels.filter((l) => l.category === cat.id).length;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    role="radio"
                    aria-checked={isActive}
                    tabIndex={isActive ? 0 : -1}
                    ref={(el) => {
                      if (isActive && el && document.activeElement?.getAttribute("role") === "radio") {
                        el.focus();
                      }
                    }}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`text-[11px] sm:text-xs font-medium px-3 py-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-cyber"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {cat.label}
                    <span className={`ml-1.5 text-[10px] ${isActive ? "opacity-80" : "opacity-50"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
            <p className="pointer-events-none text-white/60 text-[11px] sm:text-xs bg-black/30 backdrop-blur px-3 py-1 rounded-full border border-white/5">
              <Target className="inline h-3 w-3 mr-1" />
              Click a glowing node or press Tab to navigate · Enter to start
            </p>
          </div>
        </>
      )}

      {view === "briefing" && active && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-md border-white/10 bg-black/70 text-white">
            <CardContent className="p-6 space-y-4">
              {fallbackFrom && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 flex items-start gap-3 animate-pulse-glow">
                  <span className="text-lg" aria-hidden>🔒</span>
                  <div>
                    <p className="text-sm font-semibold text-destructive-foreground">
                      Fallback level active
                    </p>
                    <p className="text-xs text-white/80 leading-relaxed">
                      "{fallbackFrom.name}" is locked. You are practicing the nearest unlocked level: <span className="font-bold text-white">{active.name}</span>. Clear it to unlock the rest of this track.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-white/20 text-white">
                  Tier {active.tier} · {hackTiers.find((t) => t.tier === active.tier)?.name}
                </Badge>
                <span className="text-xs text-white/60 font-mono">+{active.xpReward} XP</span>
              </div>
              <ScenarioScene category={HACK_CAT_MAP[active.category]} title={active.target} />
              <div>
                <h2 className="font-display text-2xl font-bold tracking-[0.06em] uppercase">{active.name}</h2>
                <p className="text-sm text-white/60 mt-1 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5" /> Target: {active.target}
                </p>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">{active.briefing}</p>
              <p className="text-xs text-white/50 italic">Objective: {active.objective}</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => { setView("grid"); setFallbackFrom(null); }}>
                  Abort
                </Button>
                <Button variant="cyber" className="flex-1" onClick={() => setView("mission")}>
                  <Zap className="h-4 w-4" /> Begin Hack
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {view === "mission" && active && (
        <div className="absolute inset-0 z-30 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
          <Card className="w-full sm:max-w-md border-white/10 bg-black/80 text-white pointer-events-auto rounded-b-none sm:rounded-lg animate-slide-in-right">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm tracking-[0.2em] uppercase">{active.name}</h3>
                <Badge variant="outline" className="border-white/20 text-white text-[10px]">LIVE</Badge>
              </div>
              {renderMiniGame()}
            </CardContent>
          </Card>
        </div>
      )}

      {view === "boss" && active && activeBoss && (
        <BossFight
          key={`${active.id}-${bossRun}`}
          boss={activeBoss}
          accent={tierColor(active)}
          onDefeat={handleBossDefeat}
          onOverrun={() => setBossRun((n) => n + 1)}
          onAbort={() => {
            setView("grid");
            setActive(null);
          }}
        />
      )}

      {view === "result" && active && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <Card className={`w-full max-w-md border bg-black/80 text-white ${result === "success" ? "border-accent/50" : "border-destructive/50"}`}>
            <CardContent className="p-6 space-y-4 text-center">
              <div className="text-5xl">{result === "success" ? "🛡️" : "🚨"}</div>
              <h2 className="font-display text-2xl font-bold tracking-[0.12em] uppercase">
                {result === "success" ? "Hack Successful" : "Detected & Blocked"}
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                {result === "success" ? active.successStory : "The defenses held this time. Analyse what went wrong and try again."}
              </p>

              {/* Wrong-answer / fail: prominent lesson CTA */}
              {result === "fail" && (
                <button
                  onClick={() => setLessonCategory(active.category)}
                  className="w-full rounded-md border border-accent/40 bg-accent/10 hover:bg-accent/20 transition-colors p-3 text-left flex items-center gap-3"
                >
                  <PlayCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-accent">Watch the {active.category} lesson</div>
                    <div className="text-[11px] text-white/60">Risks, real-life threats &amp; how to avoid them — animated.</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-accent" />
                </button>
              )}

              {/* Category breakdown */}
              <div className="rounded-md border border-white/10 bg-white/5 p-3 text-left">
                <div className="text-[10px] uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1.5">
                  <Target className="h-3 w-3" /> Category breakdown
                </div>
                <ul className="space-y-1.5">
                  {hackCategories.filter((c) => c.id !== "all").map((cat) => {
                    const total = hackLevels.filter((l) => l.category === cat.id).length;
                    const done = hackLevels.filter((l) => l.category === cat.id && completed.includes(l.id)).length;
                    const pct = total ? (done / total) * 100 : 0;
                    const isActive = active.category === cat.id;
                    return (
                      <li key={cat.id} className="text-xs">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className={`${isActive ? "text-accent font-semibold" : "text-white/80"}`}>
                            {cat.label}{isActive && " ←"}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setLessonCategory(cat.id)}
                              className="text-[10px] uppercase tracking-wider text-white/40 hover:text-accent flex items-center gap-1"
                              title={`Watch ${cat.label} lesson`}
                            >
                              <PlayCircle className="h-3 w-3" /> lesson
                            </button>
                            <span className="font-mono text-white/60">{done}/{total}</span>
                          </div>
                        </div>
                        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full transition-all ${isActive ? "bg-accent" : "bg-white/40"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => { setView("grid"); setActive(null); }}>
                  Back to Grid
                </Button>
                {result === "fail" ? (
                  <Button variant="cyber" className="flex-1" onClick={() => setView("mission")}>
                    <RotateCw className="h-4 w-4" /> Retry
                  </Button>
                ) : (
                  <Button variant="cyber" className="flex-1" onClick={() => { setView("grid"); setActive(null); }}>
                    Next Target <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <button
                onClick={handleResetAll}
                className="w-full text-xs text-white/40 hover:text-destructive flex items-center justify-center gap-1.5 py-1 transition-colors"
              >
                <Trash2 className="h-3 w-3" /> Reset All Progress
              </button>
            </CardContent>
          </Card>
        </div>
      )}

      <CategoryLessonDialog
        open={!!lessonCategory}
        onOpenChange={(v) => { if (!v) setLessonCategory(null); }}
        category={lessonCategory}
      />
    </div>
  );
}
