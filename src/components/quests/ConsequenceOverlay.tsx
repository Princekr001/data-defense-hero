import { AlertOctagon, ShieldCheck, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MeterKey } from "@/data/defenderThreats";
import { METER_LABELS } from "@/data/defenderThreats";

interface Props {
  outcome: "safe" | "compromised";
  message: string;
  teach: string;
  damage?: Partial<Record<MeterKey, number>>;
  onDone: () => void;
}

export default function ConsequenceOverlay({ outcome, message, teach, damage, onDone }: Props) {
  const safe = outcome === "safe";
  const damageEntries = damage ? (Object.entries(damage) as [MeterKey, number][]).filter(([, v]) => v > 0) : [];

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in",
        safe ? "bg-primary/10" : "bg-destructive/20",
      )}
    >
      {/* screen glitch when compromised */}
      {!safe && (
        <>
          <div className="absolute inset-0 bg-destructive/30 mix-blend-screen animate-pulse pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none">
            {/* leaking data packets */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-destructive font-mono text-xs animate-fade-in"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 60}ms`,
                }}
              >
                {["10101", "SSN:***", "OTP:479", "CARD:41**", "AUTH:XX"][i % 5]}
              </div>
            ))}
          </div>
        </>
      )}
      {/* shield pulse when safe */}
      {safe && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-96 h-96 rounded-full border-2 border-primary/40 animate-ping" />
        </div>
      )}

      <div
        className={cn(
          "relative max-w-lg w-full rounded-2xl border-2 p-6 space-y-4 animate-scale-in bg-card/95 backdrop-blur-xl",
          safe ? "border-primary/60 shadow-[0_0_40px_hsl(var(--primary)/0.4)]" : "border-destructive/60 shadow-[0_0_40px_hsl(var(--destructive)/0.5)]",
        )}
      >
        <div className="flex items-center gap-3">
          {safe ? (
            <ShieldCheck className="w-10 h-10 text-primary" />
          ) : (
            <AlertOctagon className="w-10 h-10 text-destructive animate-pulse" />
          )}
          <div>
            <div className={cn("text-2xl font-black tracking-tight", safe ? "text-primary" : "text-destructive")}>
              {safe ? "THREAT NEUTRALIZED" : "YOU'VE BEEN COMPROMISED"}
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {safe ? "Data safe" : "Attacker succeeded"}
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-foreground">{message}</p>

        {damageEntries.length > 0 && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-destructive">
              <TrendingDown className="w-3.5 h-3.5" /> Damage report
            </div>
            {damageEntries.map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{METER_LABELS[k]}</span>
                <span className="font-mono font-bold text-destructive">
                  {k === "bank" ? `-₹${v.toLocaleString()}` : `-${v}${k === "identity" || k === "device" ? "%" : ""}`}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
          <div className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
            💡 Threat intel
          </div>
          <p className="text-xs leading-relaxed text-foreground/90">{teach}</p>
        </div>

        <button
          onClick={onDone}
          className={cn(
            "w-full h-11 rounded-lg font-black tracking-wider text-sm transition-all",
            safe
              ? "bg-primary text-primary-foreground hover:brightness-110"
              : "bg-destructive text-destructive-foreground hover:brightness-110",
          )}
        >
          NEXT THREAT →
        </button>
      </div>
    </div>
  );
}
