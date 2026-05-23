import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldCheck, BookOpen, CheckCircle2, XCircle, Brain } from "lucide-react";
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
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
