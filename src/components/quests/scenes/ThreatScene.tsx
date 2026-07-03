import { Mail, MessageSquare, Phone, QrCode, MessageCircle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Threat } from "@/data/defenderThreats";

interface Props {
  threat: Threat;
  showRedFlags: boolean;
}

const SCENE_META = {
  email: { icon: Mail, label: "INCOMING EMAIL", color: "hsl(220 90% 65%)" },
  sms: { icon: MessageSquare, label: "NEW SMS", color: "hsl(140 70% 55%)" },
  call: { icon: Phone, label: "INCOMING CALL", color: "hsl(30 95% 60%)" },
  qr: { icon: QrCode, label: "QR CODE SCANNED", color: "hsl(180 80% 55%)" },
  dm: { icon: MessageCircle, label: "DIRECT MESSAGE", color: "hsl(320 80% 65%)" },
  push: { icon: Bell, label: "SYSTEM ALERT", color: "hsl(0 90% 60%)" },
} as const;

// Highlight red flags inline when revealed
function renderWithFlags(text: string, flags: string[], show: boolean) {
  if (!show || flags.length === 0) return text;
  let out: (string | JSX.Element)[] = [text];
  flags.forEach((flag, fi) => {
    const next: (string | JSX.Element)[] = [];
    out.forEach((seg) => {
      if (typeof seg !== "string") return next.push(seg);
      const parts = seg.split(flag);
      parts.forEach((p, i) => {
        next.push(p);
        if (i < parts.length - 1) {
          next.push(
            <span
              key={`${fi}-${i}-${next.length}`}
              className="bg-destructive/40 text-destructive-foreground px-1 rounded font-bold underline decoration-destructive decoration-2 underline-offset-2 animate-pulse"
            >
              {flag}
            </span>,
          );
        }
      });
    });
    out = next;
  });
  return <>{out}</>;
}

/**
 * Unified themed scene container — variant per SceneType.
 * Each scene has its own entry animation + skin.
 */
export default function ThreatScene({ threat, showRedFlags }: Props) {
  const meta = SCENE_META[threat.scene];
  const Icon = meta.icon;

  // Scene-specific presentation
  const skin = (() => {
    switch (threat.scene) {
      case "email":
        return {
          wrap: "border-blue-500/40 bg-gradient-to-br from-blue-950/40 to-slate-900/60",
          enter: "animate-[fade-in_0.4s_ease-out]",
        };
      case "sms":
        return {
          wrap: "border-green-500/40 bg-gradient-to-br from-green-950/40 to-slate-900/60 [animation:sms-buzz_0.5s_ease-out]",
          enter: "",
        };
      case "call":
        return {
          wrap: "border-orange-500/40 bg-gradient-to-br from-orange-950/40 to-slate-900/60",
          enter: "animate-[fade-in_0.3s_ease-out] [animation:call-ring_1s_ease-in-out_infinite]",
        };
      case "qr":
        return {
          wrap: "border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 to-slate-900/60",
          enter: "animate-[scale-in_0.35s_ease-out]",
        };
      case "dm":
        return {
          wrap: "border-pink-500/40 bg-gradient-to-br from-pink-950/40 to-slate-900/60",
          enter: "animate-[fade-in_0.35s_ease-out]",
        };
      case "push":
        return {
          wrap: "border-red-500/40 bg-gradient-to-br from-red-950/40 to-slate-900/60",
          enter: "[animation:push-drop_0.4s_ease-out]",
        };
    }
  })();

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 p-4 space-y-3 shadow-2xl",
        skin.wrap,
        skin.enter,
      )}
    >
      {/* Header stripe */}
      <div className="flex items-center gap-2 pb-2 border-b border-white/10">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: meta.color + "33", color: meta.color }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest font-black" style={{ color: meta.color }}>
            {meta.label}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            From: <span className="text-foreground font-mono">{renderWithFlags(threat.from, threat.redFlags, showRedFlags)}</span>
          </div>
        </div>
        {threat.decoy && (
          <div className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/40 font-black uppercase animate-pulse">
            ?
          </div>
        )}
      </div>

      {threat.subject && (
        <div className="font-bold text-sm leading-snug text-foreground">
          {renderWithFlags(threat.subject, threat.redFlags, showRedFlags)}
        </div>
      )}

      {/* Body — visual varies subtly per scene */}
      {threat.scene === "call" ? (
        <div className="rounded-lg bg-black/40 p-3 border border-orange-500/20">
          <div className="text-[10px] uppercase text-orange-500 mb-2 font-black flex items-center gap-2">
            📞 Live transcript
            <span className="flex gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="w-0.5 bg-orange-500 animate-pulse"
                  style={{ height: `${6 + Math.random() * 10}px`, animationDelay: `${i * 100}ms` }}
                />
              ))}
            </span>
          </div>
          <p className="text-sm font-mono leading-relaxed text-foreground italic">
            "{renderWithFlags(threat.body, threat.redFlags, showRedFlags)}"
          </p>
        </div>
      ) : threat.scene === "sms" ? (
        <div className="rounded-2xl rounded-tl-sm bg-green-500/10 border border-green-500/30 p-3">
          <p className="text-sm leading-relaxed">
            {renderWithFlags(threat.body, threat.redFlags, showRedFlags)}
          </p>
        </div>
      ) : threat.scene === "qr" ? (
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 shrink-0 rounded-lg bg-white grid grid-cols-5 grid-rows-5 gap-0.5 p-1.5 shadow-lg">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className={cn("rounded-sm", Math.random() > 0.4 ? "bg-black" : "bg-white")} />
            ))}
          </div>
          <p className="text-sm leading-relaxed flex-1">
            {renderWithFlags(threat.body, threat.redFlags, showRedFlags)}
          </p>
        </div>
      ) : threat.scene === "push" ? (
        <div className="rounded-lg bg-slate-800/80 border border-white/10 p-3 shadow-inner">
          <p className="text-sm leading-relaxed font-medium">
            {renderWithFlags(threat.body, threat.redFlags, showRedFlags)}
          </p>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-foreground">
          {renderWithFlags(threat.body, threat.redFlags, showRedFlags)}
        </p>
      )}

      {showRedFlags && (
        <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-2 text-[11px] text-yellow-400 animate-fade-in">
          🚩 <b>Red flags revealed.</b> Now pick the safe action.
        </div>
      )}
    </div>
  );
}
