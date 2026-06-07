import { useEffect, useState } from "react";
import { PhishingType, PhishingCaseStep } from "@/data/phishingTypes";
import { cn } from "@/lib/utils";

interface Props {
  type: PhishingType;
  /** Loop or stop after one pass. */
  loop?: boolean;
  /** Notify parent when storyboard finishes one pass. */
  onFinishOnce?: () => void;
}

const STEP_MS = 3500; // ~17-25s per type (5 steps * 3.5s)

const actorVisual = (actor: PhishingCaseStep["actor"]) => {
  switch (actor) {
    case "victim":
      return { emoji: "🧑‍💻", color: "from-blue-500/30 to-cyan-500/10", label: "Victim" };
    case "attacker":
      return { emoji: "🕷️", color: "from-red-500/30 to-orange-500/10", label: "Attacker" };
    case "device":
      return { emoji: "💻", color: "from-purple-500/30 to-pink-500/10", label: "Device" };
    case "alert":
      return { emoji: "⚠️", color: "from-yellow-500/30 to-red-500/10", label: "Risk" };
  }
};

export default function PhishingTypeAnimation({ type, loop = true, onFinishOnce }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [type.id]);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => {
        const next = s + 1;
        if (next >= type.storyboard.length) {
          onFinishOnce?.();
          return loop ? 0 : s;
        }
        return next;
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, [type.id, type.storyboard.length, loop, onFinishOnce]);

  const current = type.storyboard[step];
  const visual = actorVisual(current.actor);

  return (
    <div className="relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-primary/20">
      {/* moving grid backdrop */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,85,247,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          animation: "scroll-grid 8s linear infinite",
        }}
        aria-hidden
      />
      <style>{`
        @keyframes scroll-grid {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 32px 32px, 32px 32px; }
        }
        @keyframes float-y {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* title chip */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/60 backdrop-blur px-3 py-1 rounded-full border border-primary/20 text-xs">
        <span>{type.emoji}</span>
        <span className="font-semibold">{type.name}</span>
      </div>

      {/* progress dots */}
      <div className="absolute top-3 right-3 flex gap-1.5">
        {type.storyboard.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === step ? "w-6 bg-primary" : i < step ? "w-3 bg-primary/50" : "w-3 bg-muted",
            )}
          />
        ))}
      </div>

      {/* scene */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div
          key={`${type.id}-${step}`}
          className={cn(
            "w-28 h-28 rounded-full flex items-center justify-center text-6xl bg-gradient-to-br border border-primary/30 shadow-2xl animate-scale-in",
            visual.color,
          )}
          style={{ animation: "float-y 2.5s ease-in-out infinite" }}
          aria-hidden
        >
          {visual.emoji}
        </div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {visual.label}
        </div>
        <p
          key={`cap-${type.id}-${step}`}
          className="max-w-md text-base sm:text-lg font-medium text-foreground animate-fade-in"
        >
          {current.caption}
        </p>
      </div>
    </div>
  );
}
