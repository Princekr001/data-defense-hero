import { Wallet, User, Users, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MeterKey } from "@/data/defenderThreats";
import { METER_STARTS, NEWS_TICKER } from "@/data/defenderThreats";

interface Props {
  meters: Record<MeterKey, number>;
  wave: number;
  waveTotal: number;
  timeLeftMs: number;
  reactWindowMs: number;
}

const ICONS: Record<MeterKey, typeof Wallet> = {
  bank: Wallet,
  identity: User,
  contacts: Users,
  device: Cpu,
};

function meterColor(pct: number) {
  if (pct > 60) return "hsl(var(--primary))";
  if (pct > 30) return "hsl(45 95% 55%)";
  return "hsl(var(--destructive))";
}

function fmt(k: MeterKey, v: number) {
  if (k === "bank") return `₹${v.toLocaleString()}`;
  if (k === "contacts") return v.toString();
  return `${v}%`;
}

export default function DefenderHUD({ meters, wave, waveTotal, timeLeftMs, reactWindowMs }: Props) {
  const timePct = Math.max(0, Math.min(100, (timeLeftMs / reactWindowMs) * 100));

  return (
    <div className="space-y-2">
      {/* live news ticker */}
      <div className="relative overflow-hidden rounded-lg border border-destructive/30 bg-destructive/5 h-7">
        <div className="absolute top-0 left-0 h-full px-3 bg-destructive/80 text-destructive-foreground text-[10px] font-black uppercase tracking-widest flex items-center z-10">
          LIVE
        </div>
        <div className="pl-16 flex whitespace-nowrap animate-[ticker_40s_linear_infinite] text-[11px] leading-7 text-foreground/80">
          {[...NEWS_TICKER, ...NEWS_TICKER].map((n, i) => (
            <span key={i} className="mr-8">
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* meters */}
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(METER_STARTS) as MeterKey[]).map((k) => {
          const Icon = ICONS[k];
          const start = METER_STARTS[k];
          const v = meters[k];
          const pct = Math.max(0, (v / start) * 100);
          const color = meterColor(pct);
          return (
            <div
              key={k}
              className={cn(
                "rounded-lg border bg-card/60 backdrop-blur px-2 py-1.5 transition-all",
                pct < 30 && "border-destructive animate-pulse",
                pct >= 30 && "border-primary/20",
              )}
            >
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                <Icon className="w-3 h-3" style={{ color }} />
                {k}
              </div>
              <div className="font-mono font-black text-sm truncate" style={{ color }}>
                {fmt(k, v)}
              </div>
              <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* wave + reaction timer */}
      <div className="flex items-center gap-2">
        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground shrink-0">
          Wave {wave}/{waveTotal}
        </div>
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full transition-all",
              timePct > 50 ? "bg-primary" : timePct > 25 ? "bg-yellow-500" : "bg-destructive animate-pulse",
            )}
            style={{ width: `${timePct}%` }}
          />
        </div>
        <div className="text-[10px] font-mono text-muted-foreground shrink-0">
          {(timeLeftMs / 1000).toFixed(1)}s
        </div>
      </div>
    </div>
  );
}
