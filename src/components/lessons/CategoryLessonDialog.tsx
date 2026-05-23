import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldCheck, BookOpen, CheckCircle2, XCircle, Brain, Wrench, ListChecks } from "lucide-react";
import CategoryAnimation from "./CategoryAnimation";
import { categoryLessons, resolveLessonKey } from "@/data/categoryLessons";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Category key — can be quiz or hack flavor; we normalize via resolveLessonKey. */
  category: string | null;
}

export default function CategoryLessonDialog({ open, onOpenChange, category }: Props) {
  const key = category ? resolveLessonKey(category) : null;
  const lesson = key ? categoryLessons[key] : null;

  // Reset the reinforcement quiz whenever the dialog opens or category changes
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => {
    if (open) setPicked(null);
  }, [open, key]);

  return (
    <Dialog open={open && !!lesson} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {lesson && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="text-3xl" aria-hidden>{lesson.emoji}</div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    {lesson.title}
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">Mini-lesson</Badge>
                  </DialogTitle>
                  <DialogDescription className="text-sm mt-1">{lesson.tagline}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5 pt-2">
              {/* Animated 2D character scene (~20s loop) */}
              <div className="overflow-hidden rounded-lg border bg-gradient-to-br from-background to-muted/40">
                <CategoryAnimation category={lesson.id} />
              </div>

              {/* Why the wrong answer matters */}
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-center gap-2 mb-2 text-destructive font-semibold">
                  <AlertTriangle className="h-4 w-4" /> Why that answer was risky
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{lesson.whyWrong}</p>
              </div>

              {/* Risks grid */}
              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider text-destructive mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> The real risks
                </h4>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {lesson.risks.map((r) => (
                    <li key={r} className="text-sm rounded-md border border-border bg-card/60 p-2.5 leading-snug">
                      {r}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Real world examples */}
              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Threats you'll meet in real life
                </h4>
                <ul className="space-y-1.5">
                  {lesson.realWorld.map((r) => (
                    <li key={r} className="text-sm flex gap-2 leading-snug">
                      <span className="text-primary">›</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* How to avoid */}
              <section className="rounded-md border border-primary/30 bg-primary/5 p-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> How to avoid it
                </h4>
                <ul className="space-y-1.5">
                  {lesson.howToAvoid.map((r) => (
                    <li key={r} className="text-sm flex gap-2 leading-snug">
                      <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Risk → Solution pairs */}
              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                  <Wrench className="h-4 w-4" /> Solutions for each risk
                </h4>
                <ul className="space-y-2">
                  {lesson.riskSolutions.map((rs) => (
                    <li
                      key={rs.risk}
                      className="rounded-md border border-border bg-card/60 p-3 grid sm:grid-cols-[1fr_auto_2fr] gap-2 items-start"
                    >
                      <div className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{rs.risk}</span>
                      </div>
                      <span className="hidden sm:block text-muted-foreground self-center" aria-hidden>
                        →
                      </span>
                      <div className="flex items-start gap-2 text-sm">
                        <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="leading-snug text-foreground/90">{rs.solution}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Step-by-step action plan */}
              <section className="rounded-md border border-primary/30 bg-primary/5 p-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                  <ListChecks className="h-4 w-4" /> Step-by-step: how to solve it today
                </h4>
                <ol className="space-y-2.5">
                  {lesson.stepByStep.map((step, i) => (
                    <li key={step.title} className="flex gap-3">
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center"
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <div className="leading-snug">
                        <p className="text-sm font-semibold text-foreground">{step.title}</p>
                        <p className="text-sm text-foreground/80">{step.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Reinforcement quiz */}
              <section className="rounded-md border border-primary/40 bg-primary/5 p-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4" /> Quick check — lock in the secure choice
                </h4>
                <p className="text-sm font-medium text-foreground mb-3">{lesson.quiz.question}</p>
                <div className="grid gap-2">
                  {lesson.quiz.options.map((opt, i) => {
                    const isCorrect = i === lesson.quiz.correctIndex;
                    const isPicked = picked === i;
                    const answered = picked !== null;
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={answered}
                        onClick={() => setPicked(i)}
                        className={cn(
                          "text-left text-sm rounded-md border p-3 transition-all flex items-start gap-2",
                          !answered && "border-border bg-card/60 hover:border-primary hover:bg-primary/10",
                          answered && isCorrect && "border-primary bg-primary/15 text-foreground",
                          answered && isPicked && !isCorrect && "border-destructive bg-destructive/10 text-foreground",
                          answered && !isCorrect && !isPicked && "border-border bg-muted/40 opacity-60",
                        )}
                      >
                        {answered && isCorrect && <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />}
                        {answered && isPicked && !isCorrect && <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {picked !== null && (
                  <div className="mt-3 space-y-2">
                    <div
                      className={cn(
                        "text-sm font-semibold flex items-center gap-2",
                        picked === lesson.quiz.correctIndex ? "text-primary" : "text-destructive",
                      )}
                    >
                      {picked === lesson.quiz.correctIndex ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" /> Correct — that's the secure move.
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" /> Not quite — the highlighted option is the secure one.
                        </>
                      )}
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{lesson.quiz.explanation}</p>
                    <Button size="sm" variant="outline" onClick={() => setPicked(null)}>
                      Try again
                    </Button>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
