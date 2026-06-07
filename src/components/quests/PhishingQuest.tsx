import { useState } from "react";
import { phishingTypes, PhishingType } from "@/data/phishingTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Play,
  RotateCcw,
  Trophy,
} from "lucide-react";
import PhishingTypeAnimation from "./PhishingTypeAnimation";
import PhishingStreamGame from "./PhishingStreamGame";
import { cn } from "@/lib/utils";

type Phase = "overview" | "study" | "stream" | "results";

interface StreamResult {
  correct: number;
  wrong: number;
  missed: number;
  total: number;
}

interface Props {
  onExit: () => void;
  /** Optional reward hook back into the city */
  onReward?: (xp: { knowledge: number; reputation: number }) => void;
}

export default function PhishingQuest({ onExit, onReward }: Props) {
  const [phase, setPhase] = useState<Phase>("overview");
  const [studyIndex, setStudyIndex] = useState(0);
  const [studied, setStudied] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<StreamResult | null>(null);

  const current: PhishingType = phishingTypes[studyIndex];
  const allStudied = studied.size >= phishingTypes.length;

  const handleNextStudy = () => {
    setStudied((s) => new Set(s).add(current.id));
    if (studyIndex < phishingTypes.length - 1) {
      setStudyIndex((i) => i + 1);
    } else {
      setPhase("overview");
    }
  };

  // ---------- OVERVIEW ----------
  if (phase === "overview") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onExit} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Cipher City
            </Button>
            <Badge variant="outline" className="gap-1">
              <ShieldCheck className="h-3 w-3" /> Phishing Stream Quest
            </Badge>
          </div>

          <Card className="bg-card/90 backdrop-blur-xl border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                🎣 Clear the Phishing Stream
              </CardTitle>
              <p className="text-muted-foreground">
                Study every phishing attack type below, then clear the live inbox stream —
                remove the phish, keep the legit.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {phishingTypes.map((t, i) => {
                  const done = studied.has(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setStudyIndex(i);
                        setPhase("study");
                      }}
                      className={cn(
                        "text-left rounded-xl p-4 border-2 transition-all hover:scale-[1.02]",
                        done
                          ? "border-primary/50 bg-primary/10"
                          : "border-border bg-card/60 hover:border-primary/40",
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-3xl">{t.emoji}</div>
                        {done && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-xs text-muted-foreground mt-1 leading-snug">
                        {t.tagline}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  className="flex-1 gap-2"
                  size="lg"
                  onClick={() => {
                    setStudyIndex(0);
                    setPhase("study");
                  }}
                >
                  <BookOpen className="h-5 w-5" />
                  {studied.size === 0 ? "Start case studies" : "Continue studying"}
                </Button>
                <Button
                  variant={allStudied ? "default" : "outline"}
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={() => setPhase("stream")}
                  disabled={!allStudied}
                  title={allStudied ? "Begin the stream challenge" : "Study all 6 types first"}
                >
                  <Play className="h-5 w-5" />
                  Enter the Stream {allStudied ? "" : `(${studied.size}/${phishingTypes.length})`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ---------- STUDY (animated case study + content) ----------
  if (phase === "study") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setPhase("overview")} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> All types
            </Button>
            <Badge variant="outline">
              {studyIndex + 1} / {phishingTypes.length}
            </Badge>
          </div>

          <Card className="bg-card/90 backdrop-blur-xl border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="text-3xl">{current.emoji}</span> {current.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{current.tagline}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <PhishingTypeAnimation type={current} />

              <section className="rounded-md border border-border bg-card/60 p-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-1">
                  What it is
                </h4>
                <p className="text-sm text-foreground/90">{current.what}</p>
              </section>

              <section className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-destructive mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Red flags
                </h4>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {current.redFlags.map((r) => (
                    <li
                      key={r}
                      className="text-sm rounded-md border border-border bg-background/40 p-2.5 leading-snug"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-md border border-yellow-500/30 bg-yellow-500/5 p-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400 mb-1 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Real-world case
                </h4>
                <p className="text-sm text-foreground/90 leading-relaxed">{current.realCase}</p>
              </section>

              <section className="rounded-md border border-primary/30 bg-primary/5 p-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> How to defend
                </h4>
                <ul className="space-y-1.5">
                  {current.defenses.map((d) => (
                    <li key={d} className="text-sm flex gap-2 leading-snug">
                      <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  disabled={studyIndex === 0}
                  onClick={() => setStudyIndex((i) => Math.max(0, i - 1))}
                  className="gap-1"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </Button>
                <Button onClick={handleNextStudy} className="gap-1">
                  {studyIndex < phishingTypes.length - 1 ? (
                    <>
                      Next type <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Finish studying <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ---------- STREAM ----------
  if (phase === "stream") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setPhase("overview")} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Badge variant="outline">Live phishing stream — 60s</Badge>
          </div>
          <PhishingStreamGame
            durationSec={60}
            onExit={() => setPhase("overview")}
            onComplete={(r) => {
              setResult(r);
              setPhase("results");
              const knowledge = Math.min(25, r.correct * 2);
              const reputation = Math.min(20, r.correct - r.wrong);
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
      ? { name: "Phish Hunter", emoji: "🏆" }
      : accuracy >= 75
        ? { name: "Inbox Guardian", emoji: "🛡️" }
        : accuracy >= 50
          ? { name: "Cautious Clicker", emoji: "🧐" }
          : { name: "Needs Training", emoji: "📚" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 flex items-center justify-center">
      <Card className="max-w-xl w-full bg-card/90 backdrop-blur-xl border-primary/30 animate-fade-in">
        <CardHeader className="text-center">
          <div className="text-6xl mb-2">{rank.emoji}</div>
          <CardTitle className="text-3xl">{rank.name}</CardTitle>
          <p className="text-muted-foreground">Phishing Stream cleared</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-primary/10 border border-primary/30 p-3">
              <div className="text-2xl font-bold text-primary">{r.correct}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3">
              <div className="text-2xl font-bold text-destructive">{r.wrong}</div>
              <div className="text-xs text-muted-foreground">Wrong</div>
            </div>
            <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 p-3">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {r.missed}
              </div>
              <div className="text-xs text-muted-foreground">Let through</div>
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
            <div className="text-sm text-muted-foreground">Accuracy</div>
            <div className="text-4xl font-bold text-primary">{accuracy}%</div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-1"
              onClick={() => {
                setResult(null);
                setPhase("stream");
              }}
            >
              <RotateCcw className="h-4 w-4" /> Retry stream
            </Button>
            <Button className="flex-1 gap-1" onClick={onExit}>
              <Trophy className="h-4 w-4" /> Claim & exit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
