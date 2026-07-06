import { useEffect } from "react";
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

// Cinematic auto-advance overlay — no button, 2.5s total.
export default function ConsequenceOverlay({ outcome, message, teach, damage, onDone }: Props) {
  const safe = outcome === "safe";
  const damageEntries = damage ? (Object.entries(damage) as [MeterKey, number][]).filter(([, v]) => v > 0) : [];

  useEffect(() => {
    const t = setTimeout(onDone, safe ? 2200 : 2800);
    return () => clearTimeout(t);
  }, [safe, onDone]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md",
        safe ? "bg-primary/10 animate-fade-in" : "bg-destructive/25 [animation:glitch_0.4s_ease-in-out_2]",
      )}
    >
      {/* SAFE: expanding shield rings + big stamp */}
      {safe && (
        <>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-4 border-primary" style={{ animation: "shield-expand 1.4s ease-out forwards" }} />
            <div className="absolute w-40 h-40 rounded-full border-4 border-primary" style={{ animation: "shield-expand 1.4s ease-out 0.3s forwards" }} />
          </div>
          {/* stamp */}
          <div
            className="absolute pointer-events-none border-4 border-primary text-primary font-black text-4xl px-6 py-3 rounded-lg tracking-widest"
            style={{ animation: "stamp-slam 0.5s ease-out forwards", background: "hsl(var(--primary) / 0.1)" }}
          >
            NEUTRALIZED
          </div>
          {/* XP particles */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-primary font-mono text-xs animate-fade-in"
              style={{
                left: `${40 + Math.random() * 20}%`,
                top: `${45 + Math.random() * 10}%`,
                animation: `fade-in 0.5s ease-out ${i * 60}ms both, push-drop 1s ease-out ${i * 60}ms reverse`,
              }}
            >
              +XP
            </div>
          ))}
        </>
      )}

      {/* COMPROMISED: pixel dissolve + leaking packets */}
      {!safe && (
        <>
          <div className="absolute inset-0 bg-destructive/40 mix-blend-screen animate-pulse pointer-events-none" />
          <div
            className="absolute inset-x-0 top-1/2 h-1 bg-destructive/70"
            style={{ animation: "glitch 0.3s ease-in-out infinite" }}
          />
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-destructive font-mono text-xs"
                style={{
                  left: `${5 + Math.random() * 90}%`,
                  top: `${5 + Math.random() * 90}%`,
                  animation: `pixel-dissolve 1.4s ease-out ${i * 40}ms both`,
                }}
              >
                {["10101", "SSN:***", "OTP:479", "CARD:41**", "AUTH:XX", "PIN:0000"][i % 6]}
              </div>
            ))}
          </div>
          {/* stamp */}
          <div
            className="absolute pointer-events-none border-4 border-destructive text-destructive font-black text-4xl px-6 py-3 rounded-lg tracking-widest"
            style={{ animation: "stamp-slam 0.5s ease-out forwards", background: "hsl(var(--destructive) / 0.1)" }}
          >
            BREACHED
          </div>
        </>
      )}

      <div
        className={cn(
          "relative max-w-lg w-full rounded-2xl border-2 p-5 space-y-3 bg-card/95 backdrop-blur-xl mt-32",
          "animate-[scale-in_0.25s_ease-out]",
          safe ? "border-primary/60 shadow-[0_0_40px_hsl(var(--primary)/0.4)]" : "border-destructive/60 shadow-[0_0_40px_hsl(var(--destructive)/0.5)]",
        )}
      >
        <div className="flex items-center gap-3">
          {safe ? (
            <ShieldCheck className="w-8 h-8 text-primary" />
          ) : (
            <AlertOctagon className="w-8 h-8 text-destructive animate-pulse" />
          )}
          <div>
            <div className={cn("text-lg font-black tracking-tight", safe ? "text-primary" : "text-destructive")}>
              {safe ? "Threat neutralized" : "You've been compromised"}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {safe ? "Data safe" : "Attacker succeeded"}
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-foreground">{message}</p>

        {damageEntries.length > 0 && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-2.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-destructive">
              <TrendingDown className="w-3 h-3" /> Damage
            </div>
            {damageEntries.map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{METER_LABELS[k]}</span>
                <span className="font-mono font-bold text-destructive">
                  {k === "bank" ? `-₹${v.toLocaleString()}` : `-${v}${k === "identity" || k === "device" ? "%" : ""}`}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-2.5">
          <div className="text-[10px] uppercase tracking-widest text-primary font-bold mb-0.5">💡 Threat intel</div>
          <p className="text-xs leading-relaxed text-foreground/90">{teach}</p>
        </div>
      </div>
    </div>
  );
}
