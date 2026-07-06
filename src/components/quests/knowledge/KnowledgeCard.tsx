import { useEffect, useState } from "react";
import { Brain, Sparkles, Lightbulb, Split, BookOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FunFact, ComicCase, MythPair, CyberTip } from "@/data/knowledge";

export type KnowledgePayload =
  | { kind: "fact"; data: FunFact }
  | { kind: "comic"; data: ComicCase }
  | { kind: "myth"; data: MythPair }
  | { kind: "tip"; data: CyberTip };

interface Props {
  payload: KnowledgePayload;
  onDone: () => void;
}

const AUTO_MS = 4200;

export default function KnowledgeCard({ payload, onDone }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [panelIdx, setPanelIdx] = useState(0);

  // auto-progress comic panels
  useEffect(() => {
    if (payload.kind !== "comic") return;
    const t = setTimeout(() => setPanelIdx((i) => Math.min(i + 1, 3)), 900);
    return () => clearTimeout(t);
  }, [payload, panelIdx]);

  // myth flip
  useEffect(() => {
    if (payload.kind !== "myth") return;
    const t = setTimeout(() => setFlipped(true), 1200);
    return () => clearTimeout(t);
  }, [payload]);

  // auto-dismiss
  useEffect(() => {
    const ms = payload.kind === "comic" ? 5200 : AUTO_MS;
    const t = setTimeout(onDone, ms);
    return () => clearTimeout(t);
  }, [payload, onDone]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-md bg-background/60 animate-fade-in">
      <button
        onClick={onDone}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-2"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* +Knowledge XP badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full border border-primary/60 bg-primary/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 animate-[bounce-in_0.4s_ease-out]">
        <Brain className="w-3 h-3" /> +15 KNOWLEDGE
      </div>

      <div className="w-full max-w-md">
        {payload.kind === "fact" && <FactView f={payload.data} />}
        {payload.kind === "comic" && <ComicView c={payload.data} idx={panelIdx} />}
        {payload.kind === "myth" && <MythView m={payload.data} flipped={flipped} />}
        {payload.kind === "tip" && <TipView t={payload.data} />}
      </div>

      {/* progress bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-40 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary"
          style={{ animation: `shrink-bar ${(payload.kind === "comic" ? 5200 : AUTO_MS)}ms linear forwards` }}
        />
      </div>
    </div>
  );
}

function FactView({ f }: { f: FunFact }) {
  return (
    <div className="relative rounded-3xl border-2 border-primary/60 bg-card/95 p-6 shadow-[0_0_60px_hsl(var(--primary)/0.4)] animate-[scale-in_0.3s_ease-out]">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
        <div className="text-[10px] uppercase tracking-widest text-yellow-400 font-black">Fun Fact</div>
      </div>
      <p className="text-lg font-bold leading-snug text-foreground">💡 {f.text}</p>
      {f.punchline && (
        <p className="mt-3 text-sm text-muted-foreground italic animate-fade-in" style={{ animationDelay: "300ms" }}>
          {f.punchline}
        </p>
      )}
    </div>
  );
}

function ComicView({ c, idx }: { c: ComicCase; idx: number }) {
  return (
    <div className="relative rounded-3xl border-2 border-pink-500/60 bg-card/95 p-5 shadow-[0_0_60px_hsl(320_80%_60%/0.4)] animate-[scale-in_0.3s_ease-out]">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-5 h-5 text-pink-400" />
        <div className="text-[10px] uppercase tracking-widest text-pink-400 font-black">Comic Case</div>
      </div>
      <h3 className="text-lg font-black mb-3 text-foreground">{c.title}</h3>
      <div className="space-y-2">
        {c.panels.map((p, i) => (
          <div
            key={i}
            className={cn(
              "rounded-xl border-2 border-white/10 bg-black/40 p-3 text-sm transition-all",
              i <= idx ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6",
            )}
            style={{ transitionDuration: "300ms" }}
          >
            <span className="text-[9px] font-black text-primary mr-2">PANEL {i + 1}</span>
            {p}
          </div>
        ))}
        {idx >= 3 && (
          <div className="rounded-xl border-2 border-yellow-500/60 bg-yellow-500/10 p-3 text-sm font-bold animate-fade-in">
            {c.moral}
          </div>
        )}
      </div>
    </div>
  );
}

function MythView({ m, flipped }: { m: MythPair; flipped: boolean }) {
  return (
    <div className="relative rounded-3xl border-2 border-purple-500/60 bg-card/95 p-6 shadow-[0_0_60px_hsl(270_80%_60%/0.4)] animate-[scale-in_0.3s_ease-out]">
      <div className="flex items-center gap-2 mb-3">
        <Split className="w-5 h-5 text-purple-400" />
        <div className="text-[10px] uppercase tracking-widest text-purple-400 font-black">Myth vs Reality</div>
      </div>
      <div
        className={cn(
          "rounded-xl border-2 p-4 mb-2 transition-all duration-500",
          flipped ? "border-primary/60 bg-primary/10" : "border-destructive/60 bg-destructive/10",
        )}
        style={{ transform: flipped ? "rotateY(0deg)" : "rotateY(0deg)" }}
      >
        <div className={cn("text-[10px] font-black uppercase tracking-widest mb-1", flipped ? "text-primary" : "text-destructive")}>
          {flipped ? "✓ REALITY" : "✗ MYTH"}
        </div>
        <p className="text-base font-bold leading-snug">{flipped ? m.reality : m.myth}</p>
      </div>
      <div className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
        {flipped ? "The truth revealed" : "Flipping…"}
      </div>
    </div>
  );
}

function TipView({ t }: { t: CyberTip }) {
  return (
    <div className="relative rounded-3xl border-2 border-cyan-500/60 bg-card/95 p-6 shadow-[0_0_60px_hsl(180_80%_55%/0.4)] animate-[scale-in_0.3s_ease-out]">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-cyan-400 animate-pulse" />
        <div className="text-[10px] uppercase tracking-widest text-cyan-400 font-black">Cipher Bot Tip</div>
      </div>
      <p className="text-lg font-bold leading-snug text-foreground">🤖 {t.tip}</p>
    </div>
  );
}
