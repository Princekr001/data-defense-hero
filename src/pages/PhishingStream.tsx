import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PHISHING_STAGES } from "@/data/phishingStream";
import PhishingSim from "@/components/phishing/PhishingSim";
import PhishingCaseAnimation from "@/components/phishing/PhishingCaseAnimation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserAuthButton } from "@/components/UserAuthButton";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Fish,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";

const STORAGE_KEY = "phishingStream.progress.v1";

interface Progress {
  stageIdx: number;
  step: "brief" | "sim" | "case" | "quiz" | "done";
  completed: string[];
  perfectRun: boolean;
  xp: number;
}

const initial: Progress = { stageIdx: 0, step: "brief", completed: [], perfectRun: true, xp: 0 };

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

export default function PhishingStream() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [p, setP] = useState<Progress>(() => load());
  const [pickedQuiz, setPickedQuiz] = useState<number | null>(null);
  const [lastOutcome, setLastOutcome] = useState<"secure" | "risky" | "neutral" | null>(null);

  const stage = PHISHING_STAGES[p.stageIdx];
  const totalStages = PHISHING_STAGES.length;
  const allDone = p.step === "done" && p.completed.length === totalStages;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }, [p]);

  useEffect(() => {
    setPickedQuiz(null);
    setLastOutcome(null);
  }, [p.stageIdx, p.step]);

  const overall = useMemo(() => {
    const stagesDone = p.completed.length;
    const stepWeight = { brief: 0, sim: 0.33, case: 0.66, quiz: 0.85, done: 1 }[p.step];
    return Math.round(((stagesDone + (allDone ? 0 : stepWeight)) / totalStages) * 100);
  }, [p, allDone, totalStages]);

  function nextStep(to: Progress["step"]) {
    setP((prev) => ({ ...prev, step: to }));
  }

  function onResolved(_id: string, outcome: "secure" | "risky" | "neutral") {
    setLastOutcome(outcome);
    if (outcome === "risky") {
      setP((prev) => ({ ...prev, perfectRun: false }));
      toast({ title: "That would have been costly", description: "Check the case study to see what really happens.", variant: "destructive" });
    } else if (outcome === "secure") {
      toast({ title: "Nice catch", description: "+50 XP — moving to the case study." });
    }
  }

  function completeStage() {
    setP((prev) => {
      const completed = prev.completed.includes(stage.id) ? prev.completed : [...prev.completed, stage.id];
      const xp = prev.xp + 50;
      const isLast = prev.stageIdx + 1 >= totalStages;
      if (isLast) {
        const bonus = prev.perfectRun ? 100 : 0;
        if (bonus) toast({ title: "Phish Spotter unlocked", description: "+100 perfect-run bonus" });
        return { ...prev, completed, xp: xp + bonus, step: "done" };
      }
      return { ...prev, completed, xp, stageIdx: prev.stageIdx + 1, step: "brief" };
    });
  }

  function resetQuest() {
    localStorage.removeItem(STORAGE_KEY);
    setP(initial);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" /> Home
          </Button>
          <div className="flex items-center gap-2">
            <Fish className="h-5 w-5 text-primary" />
            <p className="font-bold tracking-tight">Phishing Stream</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Badge variant="outline" className="border-primary/40 text-primary">
              <Sparkles className="h-3 w-3 mr-1" /> {p.xp} XP
            </Badge>
            <UserAuthButton />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Stage {Math.min(p.stageIdx + 1, totalStages)} of {totalStages}</span>
            <span>{overall}%</span>
          </div>
          <Progress value={overall} className="h-2" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {allDone ? (
          <Card className="border-success/40 bg-success/5">
            <CardContent className="p-8 text-center">
              <Trophy className="h-10 w-10 text-warning mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">Quest complete</h2>
              <p className="text-muted-foreground mb-1">
                You earned <span className="text-primary font-semibold">{p.xp} XP</span> across {totalStages} phishing scenarios.
              </p>
              {p.perfectRun && (
                <Badge className="bg-warning/15 text-warning border-warning/30 mt-2">🏆 Phish Spotter — perfect run</Badge>
              )}
              <div className="mt-6 flex justify-center gap-2">
                <Button variant="outline" onClick={resetQuest}>Replay</Button>
                <Button variant="cyber" onClick={() => navigate("/")}>Back to home</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-accent/40 text-accent">{stage.subtitle}</Badge>
                  <p className="text-xs text-muted-foreground">Stage {p.stageIdx + 1}</p>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">{stage.title}</h1>
                {p.step === "brief" && (
                  <>
                    <p className="text-sm text-muted-foreground mt-2">{stage.brief}</p>
                    <Button className="mt-4" variant="cyber" onClick={() => nextStep("sim")}>
                      Open the simulation <ArrowRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {p.step === "sim" && (
              <>
                <PhishingSim stage={stage} onResolved={onResolved} />
                {lastOutcome && (
                  <div className="flex justify-end">
                    <Button onClick={() => nextStep("case")} variant="cyber">
                      Watch the case study <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}

            {p.step === "case" && (
              <>
                <h2 className="text-lg font-bold tracking-tight">{stage.caseStudy.title}</h2>
                <PhishingCaseAnimation type={stage.type} panels={stage.caseStudy.panels} />
                <div className="flex justify-end">
                  <Button onClick={() => nextStep("quiz")} variant="cyber">
                    Quick check <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {p.step === "quiz" && (
              <Card className="border-primary/30">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <p className="font-bold text-sm">Lock it in</p>
                  </div>
                  <p className="text-sm">{stage.quiz.question}</p>
                  <div className="grid gap-2">
                    {stage.quiz.options.map((opt, i) => {
                      const isPicked = pickedQuiz === i;
                      const isCorrect = i === stage.quiz.correctIndex;
                      const showState = pickedQuiz !== null;
                      return (
                        <button
                          key={opt}
                          onClick={() => pickedQuiz === null && setPickedQuiz(i)}
                          disabled={pickedQuiz !== null}
                          className={`text-left text-sm px-3 py-2 rounded-md border transition ${
                            showState && isCorrect
                              ? "border-success/60 bg-success/10"
                              : showState && isPicked && !isCorrect
                              ? "border-destructive/60 bg-destructive/10"
                              : "border-border/60 hover:border-primary/50"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {showState && isCorrect && <CheckCircle2 className="h-4 w-4 text-success" />}
                            {showState && isPicked && !isCorrect && <XCircle className="h-4 w-4 text-destructive" />}
                            {opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {pickedQuiz !== null && (
                    <>
                      <p className="text-xs text-muted-foreground">{stage.quiz.explanation}</p>
                      <div className="flex justify-end">
                        <Button onClick={completeStage} variant="cyber">
                          {p.stageIdx + 1 >= totalStages ? "Finish quest" : "Next stage"}{" "}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
