import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle, ChevronRight, Lightbulb, RotateCw } from "lucide-react";
import type { HackLevel } from "@/data/hackTargets";
import { reviewForLevel } from "@/data/scenarioReviews";

interface Props {
  level: HackLevel;
  outcome: "success" | "fail";
  onContinue: () => void;
  onReplay?: () => void;
}

export default function ScenarioReview({ level, outcome, onContinue, onReplay }: Props) {
  const review = reviewForLevel(level);

  return (
    <div className="absolute inset-0 z-30 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-black/75 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-2xl my-auto border border-white/10 bg-black/85 text-white">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">Scenario review</div>
              <h2 className="font-display text-xl font-bold tracking-[0.1em] uppercase">{level.name}</h2>
            </div>
            <Badge
              variant="outline"
              className={outcome === "success" ? "border-accent/50 text-accent" : "border-destructive/50 text-destructive"}
            >
              {outcome === "success" ? "CLEARED" : "FAILED"}
            </Badge>
          </div>

          <p className="text-sm leading-relaxed text-white/70">{review.situation}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-accent/30 bg-accent/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Why this is secure</span>
              </div>
              <p className="text-sm font-semibold text-white">{review.secure.label}</p>
              <ul className="space-y-1.5">
                {review.secure.why.map((w) => (
                  <li key={w} className="text-xs leading-relaxed text-white/75 flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Why this is risky</span>
              </div>
              <p className="text-sm font-semibold text-white">{review.unsafe.label}</p>
              <ul className="space-y-1.5">
                {review.unsafe.why.map((w) => (
                  <li key={w} className="text-xs leading-relaxed text-white/75 flex gap-2">
                    <span className="text-destructive">✕</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-3 flex items-start gap-2.5">
            <Lightbulb className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-white/85">
              <span className="font-bold text-white">Takeaway: </span>
              {review.takeaway}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {onReplay && (
              <Button
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                onClick={onReplay}
              >
                <RotateCw className="h-4 w-4" /> Replay Level
              </Button>
            )}
            <Button variant="cyber" className="flex-1" onClick={onContinue}>
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
