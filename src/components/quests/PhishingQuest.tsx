import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Zap, Flame, Skull, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import PhishingStreamGame from "./PhishingStreamGame";
import MissionReport from "./MissionReport";
import CipherBot from "./CipherBot";

type Phase = "intro" | "stream" | "results";

interface StreamResult {
  correct: number; wrong: number; missed: number; total: number;
  score: number; bestCombo: number;
  bankSaved: number; identityLeft: number;
  knowledgeGained: number; factsUnlocked: number; achievements: number;
}

interface Props {
  onExit: () => void;
  onReward?: (xp: { knowledge: number; reputation: number }) => void;
}

export default function PhishingQuest({ onExit, onReward }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [result, setResult] = useState<StreamResult | null>(null);

  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 p-4 relative overflow-hidden">
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
              <Skull className="h-3 w-3" /> LIVE OPERATION
            </Badge>
          </div>

          <Card className="bg-card/90 backdrop-blur-xl border-primary/40 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary via-destructive to-primary animate-pulse" />
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="text-6xl mb-2 animate-bounce">🛡️</div>
                <div className="text-[10px] uppercase tracking-widest text-primary font-black">Briefing</div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                  OPERATION: HOME SHIELD
                </h1>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Attackers are already inside the network. <span className="text-destructive font-bold">Every alert is real.</span> Your bank, identity, contacts and device are on the line.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { l: "Bank", v: "₹50,000" },
                  { l: "Identity", v: "100%" },
                  { l: "Contacts", v: "300" },
                  { l: "Device", v: "100%" },
                ].map((m) => (
                  <div key={m.l} className="rounded-lg border border-primary/30 bg-primary/5 p-2 text-center">
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{m.l}</div>
                    <div className={cn("font-mono font-black text-sm text-primary")}>{m.v}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <Skull className="h-5 w-5 mx-auto text-destructive mb-1" />
                  <div className="text-xs font-bold">Any meter → 0 = game over</div>
                </div>
                <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
                  <Flame className="h-5 w-5 mx-auto text-orange-500 mb-1" />
                  <div className="text-xs font-bold">3 waves, escalating</div>
                </div>
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <Target className="h-5 w-5 mx-auto text-primary mb-1" />
                  <div className="text-xs font-bold">1 lifeline: Red flags</div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setPhase("stream")}
                className="w-full h-16 text-lg font-black tracking-wider gap-2 bg-gradient-to-r from-primary to-destructive hover:opacity-90"
              >
                <Play className="h-6 w-6 fill-current" /> DEPLOY DEFENDER
              </Button>

              <p className="text-center text-[11px] text-muted-foreground">
                Learn through <span className="text-destructive font-bold">real consequences</span> — cinematic hits, comic case files, Cipher Bot tips.
              </p>
            </CardContent>
          </Card>

          <div className="fixed bottom-4 left-4 z-30">
            <CipherBot mood="idle" />
          </div>
        </div>
      </div>
    );
  }

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
              const knowledge = Math.min(60, r.correct * 4 + r.factsUnlocked);
              const reputation = Math.min(40, r.correct * 3 - r.wrong * 2);
              onReward?.({ knowledge, reputation: Math.max(0, reputation) });
            }}
          />
        </div>
      </div>
    );
  }

  const r = result!;
  return (
    <MissionReport
      correct={r.correct}
      wrong={r.wrong}
      missed={r.missed}
      score={r.score}
      bestCombo={r.bestCombo}
      bankSaved={r.bankSaved}
      identityLeft={r.identityLeft}
      knowledgeGained={r.knowledgeGained}
      factsUnlocked={r.factsUnlocked}
      achievements={r.achievements}
      onRetry={() => { setResult(null); setPhase("stream"); }}
      onExit={onExit}
    />
  );
}
