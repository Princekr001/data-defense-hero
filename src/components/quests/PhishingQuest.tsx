import { useState } from "react";
import { phishingTypes } from "@/data/phishingTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Trophy,
  Zap,
  Flame,
  Skull,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PhishingStreamGame from "./PhishingStreamGame";

type Phase = "intro" | "stream" | "results";

interface StreamResult {
  correct: number;
  wrong: number;
  missed: number;
  total: number;
  score: number;
  bestCombo: number;
}

interface Props {
  onExit: () => void;
  onReward?: (xp: { knowledge: number; reputation: number }) => void;
}

export default function PhishingQuest({ onExit, onReward }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [result, setResult] = useState<StreamResult | null>(null);

  // ---------- INTRO (no theory walls — just the threat lineup) ----------
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 p-4 relative overflow-hidden">
        {/* ambient glow */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-destructive/20 blur-3xl animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onExit} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Cipher City
            </Button>
            <Badge variant="destructive" className="gap-1 animate-pulse">
              <Skull className="h-3 w-3" /> HARD MODE
            </Badge>
          </div>

          <Card className="bg-card/90 backdrop-blur-xl border-primary/40 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary via-destructive to-primary animate-pulse" />
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="text-6xl mb-2 animate-bounce">🎣</div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                  PHISHING STORM
                </h1>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  6 attack types. 3 lives. 3 seconds per call. One wrong nuke and you bleed.
                </p>
              </div>

              {/* Threat lineup — quick scan, no theory */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {phishingTypes.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-primary/20 bg-card/60 p-2 text-center hover-scale"
                    title={`${t.name} — ${t.tagline}`}
                  >
                    <div className="text-2xl mb-1">{t.emoji}</div>
                    <div className="text-[10px] font-bold leading-tight">
                      {t.name.split(" ")[0]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Game rules — bite-sized */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <Skull className="h-5 w-5 mx-auto text-destructive mb-1" />
                  <div className="text-xs font-bold">3 lives</div>
                </div>
                <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
                  <Flame className="h-5 w-5 mx-auto text-orange-500 mb-1" />
                  <div className="text-xs font-bold">Build combos</div>
                </div>
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <Target className="h-5 w-5 mx-auto text-primary mb-1" />
                  <div className="text-xs font-bold">Fast = bonus</div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setPhase("stream")}
                className="w-full h-16 text-lg font-black tracking-wider gap-2 bg-gradient-to-r from-primary to-destructive hover:opacity-90"
              >
                <Play className="h-6 w-6 fill-current" /> ENTER THE STORM
              </Button>

              <p className="text-center text-[11px] text-muted-foreground">
                You'll learn each attack <span className="text-primary font-bold">by surviving it</span>.
                Mess up → instant solution card.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ---------- STREAM ----------
  if (phase === "stream") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 p-4">
        <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setPhase("intro")} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Abort
            </Button>
            <Badge variant="destructive" className="gap-1 animate-pulse">
              <Zap className="h-3 w-3" /> LIVE
            </Badge>
          </div>
          <PhishingStreamGame
            durationSec={45}
            onExit={() => setPhase("intro")}
            onComplete={(r) => {
              setResult(r);
              setPhase("results");
              const knowledge = Math.min(40, r.correct * 3);
              const reputation = Math.min(30, r.correct * 2 - r.wrong * 3);
              onReward?.({ knowledge, reputation: Math.max(0, reputation) });
            }}
          />
        </div>
      </div>
    );
  }

  // ---------- RESULTS ----------
  const r = result!;
  const accuracy = r.total === 0 ? 0 : Math.round((r.correct / r.total) * 100);
  const rank =
    accuracy >= 90
      ? { name: "Phish Hunter", emoji: "🏆", color: "text-yellow-400" }
      : accuracy >= 75
        ? { name: "Inbox Guardian", emoji: "🛡️", color: "text-primary" }
        : accuracy >= 50
          ? { name: "Cautious Clicker", emoji: "🧐", color: "text-orange-400" }
          : { name: "Compromised", emoji: "💀", color: "text-destructive" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 p-4 flex items-center justify-center">
      <Card className="max-w-xl w-full bg-card/95 backdrop-blur-xl border-primary/40 animate-fade-in overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary via-destructive to-primary" />
        <CardContent className="p-6 space-y-5 text-center">
          <div className="text-7xl animate-bounce">{rank.emoji}</div>
          <div>
            <div className={cn("text-3xl font-black", rank.color)}>{rank.name}</div>
            <p className="text-sm text-muted-foreground">Phishing Storm survived</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
              <Zap className="h-5 w-5 mx-auto text-primary mb-1" />
              <div className="text-3xl font-black text-primary">{r.score}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Score
              </div>
            </div>
            <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
              <Flame className="h-5 w-5 mx-auto text-orange-500 mb-1" />
              <div className="text-3xl font-black text-orange-500">x{r.bestCombo}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Best combo
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
              <div className="text-xl font-bold text-primary">{r.correct}</div>
              <div className="text-[10px] text-muted-foreground">Correct</div>
            </div>
            <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-2">
              <div className="text-xl font-bold text-destructive">{r.wrong}</div>
              <div className="text-[10px] text-muted-foreground">Wrong</div>
            </div>
            <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/20 p-2">
              <div className="text-xl font-bold text-yellow-500">{r.missed}</div>
              <div className="text-[10px] text-muted-foreground">Let through</div>
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              Accuracy
            </div>
            <div className="text-3xl font-black text-primary">{accuracy}%</div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-1 h-12 font-bold"
              onClick={() => {
                setResult(null);
                setPhase("stream");
              }}
            >
              <RotateCcw className="h-4 w-4" /> Retry
            </Button>
            <Button className="flex-1 gap-1 h-12 font-bold" onClick={onExit}>
              <Trophy className="h-4 w-4" /> Claim
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
