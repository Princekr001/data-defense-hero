import { ArrowRight, ShieldCheck, ShieldAlert, TrendingDown, TrendingUp, FileWarning, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MeterKey, Exposure } from "@/data/defenderThreats";
import { METER_LABELS } from "@/data/defenderThreats";

const EXPOSURE_LABEL: Record<Exposure, { label: string; detail: string }> = {
  credentials: { label: "Login credentials", detail: "Username + password captured — usable across other sites you reuse." },
  otp: { label: "One-time password", detail: "OTP handed to attacker — bypasses 2FA for ~60 seconds." },
  device: { label: "Device access", detail: "Malware or remote tool installed — screen, keys and files exposed." },
  contacts: { label: "Contact list", detail: "Friends & family now targets for spoofed follow-up scams." },
  bank: { label: "Bank / card data", detail: "Card number, CVV or UPI PIN in attacker hands — expect withdrawals." },
  identity: { label: "Personal identity", detail: "Name, DOB, Aadhaar/SSN fragments — used for account takeover." },
};

interface Props {
  outcome: "safe" | "compromised";
  actionTaken: string;
  category: string;
  message: string;
  teach: string;
  damage?: Partial<Record<MeterKey, number>>;
  heal?: Partial<Record<MeterKey, number>>;
  metersBefore: Record<MeterKey, number>;
  metersAfter: Record<MeterKey, number>;
  exposures: Exposure[];
  branchTag?: string;
  onContinue: () => void;
}

function fmt(k: MeterKey, v: number) {
  if (k === "bank") return `₹${v.toLocaleString()}`;
  if (k === "contacts") return v.toString();
  return `${v}%`;
}

export default function DamageReport({
  outcome,
  actionTaken,
  category,
  message,
  teach,
  damage,
  heal,
  metersBefore,
  metersAfter,
  exposures,
  branchTag,
  onContinue,
}: Props) {
  const safe = outcome === "safe";
  const meterKeys = (Object.keys(metersBefore) as MeterKey[]).filter((k) => metersBefore[k] !== metersAfter[k]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border-2 bg-card/95 backdrop-blur-xl shadow-2xl animate-[scale-in_0.25s_ease-out]",
          safe ? "border-primary/60 shadow-[0_0_50px_hsl(var(--primary)/0.35)]" : "border-destructive/60 shadow-[0_0_50px_hsl(var(--destructive)/0.5)]",
        )}
      >
        {/* Header */}
        <div className={cn("p-4 border-b flex items-start gap-3", safe ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/10")}>
          {safe ? <ShieldCheck className="w-9 h-9 text-primary shrink-0" /> : <ShieldAlert className="w-9 h-9 text-destructive shrink-0 animate-pulse" />}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Damage Report · {category}</div>
            <div className={cn("text-xl font-black leading-tight", safe ? "text-primary" : "text-destructive")}>
              {safe ? "Threat Neutralized" : "You Were Compromised"}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Your action: <span className="font-semibold text-foreground">{actionTaken}</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Narrative */}
          <p className="text-sm leading-relaxed text-foreground">{message}</p>
          {branchTag && (
            <div className={cn("text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md border",
              safe ? "text-primary border-primary/40 bg-primary/10" : "text-destructive border-destructive/40 bg-destructive/10")}>
              {branchTag}
            </div>
          )}

          {/* Meter deltas */}
          <div className="rounded-xl border border-white/10 bg-black/30 p-3 space-y-2">
            <div className="text-[10px] uppercase tracking-widest font-black text-muted-foreground flex items-center gap-1.5">
              {safe && heal ? <TrendingUp className="w-3 h-3 text-primary" /> : <TrendingDown className="w-3 h-3 text-destructive" />}
              Meter changes
            </div>
            {meterKeys.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">No meters changed. Clean save.</div>
            ) : (
              <div className="space-y-1.5">
                {meterKeys.map((k) => {
                  const before = metersBefore[k];
                  const after = metersAfter[k];
                  const delta = after - before;
                  const positive = delta > 0;
                  return (
                    <div key={k} className="grid grid-cols-[80px_1fr_auto] items-center gap-2 text-xs">
                      <span className="text-muted-foreground">{METER_LABELS[k]}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {fmt(k, before)} <ArrowRight className="inline w-3 h-3 mx-1" /> <span className="text-foreground font-bold">{fmt(k, after)}</span>
                      </span>
                      <span className={cn("font-mono font-black text-xs px-1.5 py-0.5 rounded",
                        positive ? "text-primary bg-primary/15" : "text-destructive bg-destructive/15")}>
                        {positive ? "+" : ""}{k === "bank" ? `₹${Math.abs(delta).toLocaleString()}` : Math.abs(delta)}{k === "identity" || k === "device" ? "%" : ""}
                        {!positive && ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Data at risk */}
          <div className={cn("rounded-xl border p-3 space-y-2",
            exposures.length ? "border-destructive/40 bg-destructive/10" : "border-primary/30 bg-primary/5")}>
            <div className={cn("text-[10px] uppercase tracking-widest font-black flex items-center gap-1.5",
              exposures.length ? "text-destructive" : "text-primary")}>
              <FileWarning className="w-3 h-3" /> Data put at risk
            </div>
            {exposures.length === 0 ? (
              <div className="text-xs text-primary/90">Nothing leaked. Your defenses held this vector.</div>
            ) : (
              <ul className="space-y-1.5">
                {exposures.map((e) => (
                  <li key={e} className="text-xs">
                    <div className="font-bold text-destructive">• {EXPOSURE_LABEL[e].label}</div>
                    <div className="text-muted-foreground pl-3 leading-snug">{EXPOSURE_LABEL[e].detail}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Lesson learned */}
          <div className="rounded-xl border border-primary/40 bg-primary/5 p-3">
            <div className="text-[10px] uppercase tracking-widest font-black text-primary mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-3 h-3" /> Lesson learned
            </div>
            <p className="text-xs leading-relaxed text-foreground/90">{teach}</p>
          </div>

          <Button onClick={onContinue} className="w-full gap-2 font-black" size="lg">
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
