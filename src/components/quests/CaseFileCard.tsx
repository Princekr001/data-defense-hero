import { useEffect } from "react";
import { FileWarning, Skull, DollarSign, HelpCircle, Shield } from "lucide-react";
import type { CaseFile } from "@/data/knowledge";
import { Button } from "@/components/ui/button";

interface Props {
  file: CaseFile;
  onDone: () => void;
}

export default function CaseFileCard({ file, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 12000);
    return () => clearTimeout(t);
  }, [onDone]);

  const rows = [
    { icon: Skull, label: "Attack", value: file.attack, color: "text-destructive" },
    { icon: DollarSign, label: "Damage", value: file.damage, color: "text-yellow-400" },
    { icon: HelpCircle, label: "Why", value: file.why, color: "text-orange-400" },
    { icon: Shield, label: "Prevention", value: file.prevention, color: "text-primary" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-md bg-background/70 animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border-2 border-primary/60 bg-card/95 overflow-hidden shadow-[0_0_60px_hsl(var(--primary)/0.5)] animate-[scale-in_0.3s_ease-out]">
        {/* Terminal header */}
        <div className="bg-primary/20 border-b border-primary/40 px-4 py-2 flex items-center gap-2">
          <FileWarning className="w-4 h-4 text-primary" />
          <div className="font-mono text-xs text-primary font-black tracking-wider">
            CASE FILE #{file.number.toString().padStart(3, "0")}
          </div>
          <div className="ml-auto flex gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>

        <div className="p-5 space-y-4">
          <h2 className="text-2xl font-black tracking-tight text-foreground">{file.title}</h2>

          <div className="space-y-2">
            {rows.map((r, i) => (
              <div
                key={r.label}
                className="rounded-lg border border-white/10 bg-black/30 p-3 flex gap-3 animate-fade-in"
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: "both" }}
              >
                <r.icon className={`w-4 h-4 mt-0.5 shrink-0 ${r.color}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] font-black uppercase tracking-widest ${r.color}`}>{r.label}</div>
                  <p className="text-sm leading-snug text-foreground">{r.value}</p>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={onDone} className="w-full h-11 font-black tracking-wider">
            NEXT WAVE →
          </Button>
        </div>
      </div>
    </div>
  );
}
