import { useEffect, useRef } from "react";
import { BookOpen, ShieldCheck, ShieldAlert, X, ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { METER_LABELS, type MeterKey } from "@/data/defenderThreats";

export interface JournalEntry {
  id: string;
  step: number;
  category: string;
  actionTaken: string;
  outcome: "safe" | "compromised";
  damage?: Partial<Record<MeterKey, number>>;
  heal?: Partial<Record<MeterKey, number>>;
  lesson: string;
  time: string;
}

interface Props {
  entries: JournalEntry[];
  open: boolean;
  onClose: () => void;
  onClear?: () => void;
}

function fmt(k: MeterKey, v: number) {
  if (k === "bank") return `₹${v.toLocaleString()}`;
  return `${v}${k === "contacts" ? "" : "%"}`;
}

export default function ActionJournal({ entries, open, onClose, onClear }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = 0;
  }, [open, entries.length]);

  const safeCount = entries.filter((e) => e.outcome === "safe").length;
  const compCount = entries.length - safeCount;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      {/* Panel */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-[56] h-full w-full sm:max-w-md",
          "bg-gradient-to-b from-[#0b1020] via-[#0a0f1e] to-[#050810]",
          "border-l-2 border-primary/40 shadow-[0_0_80px_hsl(var(--primary)/0.35)]",
          "transition-transform duration-300 ease-out flex flex-col",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="relative p-4 border-b border-primary/25 bg-black/40">
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] uppercase tracking-[0.25em] font-black text-primary/70">Field Log</div>
              <div className="text-lg font-black text-foreground leading-tight">Action Journal</div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md border border-white/10 hover:border-primary/60 hover:bg-primary/10 flex items-center justify-center transition"
              aria-label="Close journal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="rounded-md border border-white/10 bg-white/5 px-2 py-1.5">
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Steps</div>
              <div className="text-lg font-black font-mono text-foreground">{entries.length}</div>
            </div>
            <div className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1.5">
              <div className="text-[9px] uppercase tracking-widest text-primary">Safe</div>
              <div className="text-lg font-black font-mono text-primary">{safeCount}</div>
            </div>
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1.5">
              <div className="text-[9px] uppercase tracking-widest text-destructive">Hit</div>
              <div className="text-lg font-black font-mono text-destructive">{compCount}</div>
            </div>
          </div>
        </div>

        {/* List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {entries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-muted-foreground py-16">
              <BookOpen className="w-10 h-10 opacity-30" />
              <div className="text-sm font-bold">No steps logged yet</div>
              <div className="text-xs max-w-[240px]">Every choice you make will appear here — with damage, heals, and the lesson.</div>
            </div>
          ) : (
            entries
              .slice()
              .reverse()
              .map((e) => {
                const safe = e.outcome === "safe";
                const dmgKeys = e.damage ? (Object.keys(e.damage) as MeterKey[]) : [];
                const healKeys = e.heal ? (Object.keys(e.heal) as MeterKey[]) : [];
                return (
                  <div
                    key={e.id}
                    className={cn(
                      "relative rounded-xl border p-3 bg-card/60 backdrop-blur animate-fade-in",
                      safe ? "border-primary/40" : "border-destructive/50",
                    )}
                  >
                    <div className="absolute -left-px top-3 bottom-3 w-1 rounded-r bg-gradient-to-b"
                      style={{
                        background: safe
                          ? "linear-gradient(180deg, hsl(var(--primary)), transparent)"
                          : "linear-gradient(180deg, hsl(var(--destructive)), transparent)",
                      }}
                    />
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                        safe ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive",
                      )}>
                        {safe ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] uppercase tracking-widest font-black text-muted-foreground">
                          Step {e.step} · {e.category}
                        </div>
                        <div className={cn("text-sm font-black leading-tight truncate", safe ? "text-primary" : "text-destructive")}>
                          {safe ? "Neutralized" : "Compromised"}
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground shrink-0">{e.time}</div>
                    </div>

                    <div className="text-[11px] text-foreground/90 mb-1.5">
                      <span className="text-muted-foreground">Choice:</span>{" "}
                      <span className="font-semibold">{e.actionTaken}</span>
                    </div>

                    {(dmgKeys.length > 0 || healKeys.length > 0) && (
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {healKeys.map((k) => (
                          <span key={`h-${k}`} className="inline-flex items-center gap-1 text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">
                            <ArrowUp className="w-2.5 h-2.5" />
                            {METER_LABELS[k]} +{fmt(k, e.heal![k]!)}
                          </span>
                        ))}
                        {dmgKeys.map((k) => (
                          <span key={`d-${k}`} className="inline-flex items-center gap-1 text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-destructive/15 text-destructive border border-destructive/30">
                            <ArrowDown className="w-2.5 h-2.5" />
                            {METER_LABELS[k]} −{fmt(k, e.damage![k]!)}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-[11px] leading-snug text-foreground/80 border-l-2 border-primary/30 pl-2 italic">
                      {e.lesson}
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {onClear && entries.length > 0 && (
          <div className="p-3 border-t border-white/10 bg-black/40">
            <Button variant="ghost" size="sm" onClick={onClear} className="w-full gap-1 text-muted-foreground hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5" /> Clear log
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
