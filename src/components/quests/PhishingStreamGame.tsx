import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { phishingTypes } from "@/data/phishingTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trash2, Inbox, AlertTriangle, ShieldCheck, Clock, Sparkles } from "lucide-react";
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
}

interface Props {
  durationSec?: number;
  onComplete: (result: Result) => void;
  onExit: () => void;
}

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

export default function PhishingStreamGame({
  durationSec = 60,
  onComplete,
  onExit,
}: Props) {
  const pool = useMemo(() => shuffle(buildPool()), []);
  const cursor = useRef(0);

  const [queue, setQueue] = useState<StreamMessage[]>(() => pool.slice(0, 3));
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [result, setResult] = useState<Result>({ correct: 0, wrong: 0, missed: 0, total: 0 });
  const [feedback, setFeedback] = useState<{
    kind: "correct" | "wrong" | "missed";
    text: string;
  } | null>(null);
  const [finished, setFinished] = useState(false);

  // refill queue cursor starts after the initial 3
  useEffect(() => {
    cursor.current = 3;
  }, []);

  const popNext = useCallback((): StreamMessage | null => {
    const next = pool[cursor.current % pool.length];
    cursor.current += 1;
    return next ? { ...next, id: `${next.id}-${cursor.current}` } : null;
  }, [pool]);

  const flashFeedback = useCallback((kind: "correct" | "wrong" | "missed", text: string) => {
    setFeedback({ kind, text });
    window.setTimeout(() => setFeedback(null), 1100);
  }, []);

  const handleDecision = useCallback(
    (msg: StreamMessage, action: "remove" | "keep") => {
      if (finished) return;
      const isCorrect =
        (msg.phish && action === "remove") || (!msg.phish && action === "keep");

      setResult((r) => ({
        ...r,
        correct: r.correct + (isCorrect ? 1 : 0),
        wrong: r.wrong + (isCorrect ? 0 : 1),
        total: r.total + 1,
      }));

      flashFeedback(
        isCorrect ? "correct" : "wrong",
        isCorrect
          ? msg.phish
            ? `Removed — ${msg.typeName} attack neutralized!`
            : `Kept — that was a legit message.`
          : msg.phish
            ? `Missed a ${msg.typeName} phish: ${msg.hint ?? "watch the red flags."}`
            : `Oops — that one was actually safe.`,
      );

      setQueue((q) => {
        const filtered = q.filter((m) => m.id !== msg.id);
        const next = popNext();
        return next ? [...filtered, next] : filtered;
      });
    },
    [finished, popNext, flashFeedback],
  );

  // countdown
  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearTimeout(id);
  }, [timeLeft, finished]);

  // auto-cycle oldest message every ~6s if untouched (counts as "missed")
  useEffect(() => {
    if (finished || queue.length === 0) return;
    const id = window.setTimeout(() => {
      const oldest = queue[0];
      if (!oldest) return;
      setResult((r) => ({
        ...r,
        missed: r.missed + (oldest.phish ? 1 : 0),
        total: r.total + 1,
      }));
      if (oldest.phish) {
        flashFeedback("missed", `Let through: ${oldest.typeName}. ${oldest.hint ?? ""}`);
      }
      setQueue((q) => {
        const rest = q.slice(1);
        const next = popNext();
        return next ? [...rest, next] : rest;
      });
    }, 6000);
    return () => window.clearTimeout(id);
  }, [queue, finished, popNext, flashFeedback]);

  useEffect(() => {
    if (finished) onComplete(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const accuracy =
    result.total === 0 ? 100 : Math.round((result.correct / result.total) * 100);

  return (
    <Card className="bg-card/90 backdrop-blur-xl border-primary/30">
      <CardContent className="p-6 space-y-5">
        {/* HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-primary" />
            <span className="font-bold">Inbox Defense — Phishing Stream</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" /> {timeLeft}s
            </Badge>
            <Badge variant="default" className="gap-1">
              <ShieldCheck className="h-3 w-3" /> {result.correct} correct
            </Badge>
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" /> {result.wrong + result.missed} errors
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" /> {accuracy}%
            </Badge>
          </div>
        </div>
        <Progress value={(timeLeft / durationSec) * 100} className="h-2" />

        {/* feedback toast */}
        <div className="h-10 flex items-center justify-center">
          {feedback && (
            <div
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border animate-fade-in",
                feedback.kind === "correct" &&
                  "bg-primary/15 border-primary/40 text-primary",
                feedback.kind === "wrong" &&
                  "bg-destructive/15 border-destructive/40 text-destructive",
                feedback.kind === "missed" &&
                  "bg-yellow-500/10 border-yellow-500/40 text-yellow-600 dark:text-yellow-400",
              )}
            >
              {feedback.text}
            </div>
          )}
        </div>

        {/* message stream */}
        <div className="space-y-3 min-h-[280px]">
          {queue.length === 0 && (
            <p className="text-center text-muted-foreground py-10">Inbox clear...</p>
          )}
          {queue.map((m, i) => (
            <div
              key={m.id}
              className={cn(
                "rounded-xl border p-4 bg-card/60 backdrop-blur transition-all animate-fade-in",
                i === 0 ? "border-primary/40 shadow-lg" : "border-border opacity-90",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">📩</div>
                <p className="flex-1 text-sm sm:text-base leading-snug text-foreground">
                  {m.text}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDecision(m, "keep")}
                  disabled={finished}
                  className="gap-1"
                >
                  <Inbox className="h-4 w-4" /> Keep
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDecision(m, "remove")}
                  disabled={finished}
                  className="gap-1"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-2">
          <Button variant="ghost" size="sm" onClick={onExit}>
            Exit
          </Button>
          <p className="text-xs text-muted-foreground self-center">
            Tip: remove phishing, keep legit messages. Hesitation = let-through.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
