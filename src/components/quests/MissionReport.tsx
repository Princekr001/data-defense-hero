import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Brain, Trophy, BookOpen, Zap, RotateCcw, Home } from "lucide-react";

interface Props {
  correct: number;
  wrong: number;
  missed: number;
  score: number;
  bestCombo: number;
  bankSaved: number;
  identityLeft: number;
  knowledgeGained: number;
  factsUnlocked: number;
  achievements: number;
  onRetry: () => void;
  onExit: () => void;
}

function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function Row({ icon: Icon, label, value, color, suffix, delay }: any) {
  const v = useCountUp(value, 800 + delay);
  return (
    <div
      className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 p-3 animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-sm">{label}</span>
      </div>
      <span className={`font-mono font-black ${color}`}>
        {suffix === "₹" ? "₹" : ""}
        {v.toLocaleString()}
        {suffix && suffix !== "₹" ? suffix : ""}
      </span>
    </div>
  );
}

export default function MissionReport(p: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 p-4 flex items-center justify-center">
      <Card className="max-w-xl w-full bg-card/95 backdrop-blur-xl border-primary/40 overflow-hidden animate-[scale-in_0.35s_ease-out]">
        <div className="h-1 bg-gradient-to-r from-primary via-yellow-400 to-destructive animate-pulse" />
        <CardContent className="p-6 space-y-4">
          <div className="text-center space-y-1">
            <div className="text-5xl animate-[bounce-in_0.5s_ease-out]">🛡️</div>
            <h2 className="text-2xl font-black tracking-tight">MISSION REPORT</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">City security snapshot</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Row icon={Shield} label="Threats neutralized" value={p.correct} color="text-primary" delay={0} />
            <Row icon={Zap} label="Best combo" value={p.bestCombo} color="text-orange-400" delay={100} suffix="x" />
            <Row icon={Brain} label="Knowledge gained" value={p.knowledgeGained} color="text-cyan-400" delay={200} />
            <Row icon={BookOpen} label="Facts unlocked" value={p.factsUnlocked} color="text-pink-400" delay={300} />
            <Row icon={Trophy} label="Achievements" value={p.achievements} color="text-yellow-400" delay={400} />
            <Row icon={Shield} label="Identity intact" value={p.identityLeft} color="text-primary" delay={500} suffix="%" />
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Money protected</div>
              <div className="text-2xl font-black text-primary">₹{p.bankSaved.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Final score</div>
              <div className="text-2xl font-black text-yellow-400">{p.score.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 h-11 gap-1 font-bold" onClick={p.onRetry}>
              <RotateCcw className="w-4 h-4" /> Retry
            </Button>
            <Button className="flex-1 h-11 gap-1 font-bold" onClick={p.onExit}>
              <Home className="w-4 h-4" /> Cipher City
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
