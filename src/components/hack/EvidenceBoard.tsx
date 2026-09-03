import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail, Terminal, Globe, MonitorSmartphone, MessageSquare,
  ShieldAlert, CheckCircle2, XCircle, Lightbulb, ArrowRight,
} from "lucide-react";
import type { Evidence, EvidenceCase } from "@/data/evidenceCases";

interface EvidenceBoardProps {
  evidenceCase: EvidenceCase;
  accent: string;
  onContinue: () => void;
  onAbort: () => void;
}

function EvidenceCard({ item }: { item: Evidence }) {
  if (item.kind === "email") {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.06] border-b border-white/10">
          <Mail className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-white/60">Mail client</span>
        </div>
        <div className="p-3 space-y-2 text-sm">
          <div className="space-y-0.5">
            <p className="font-semibold text-white">{item.subject}</p>
            <p className="text-xs text-white/70">
              {item.from} <span className="font-mono text-destructive">&lt;{item.fromRaw}&gt;</span>
            </p>
            <p className="text-xs text-white/50">to {item.to} · {item.received}</p>
          </div>
          <div className="rounded-lg bg-black/50 border border-white/10 p-2 font-mono text-[11px] text-white/70 space-y-0.5">
            {item.headers.map((h) => <p key={h} className="break-all">{h}</p>)}
          </div>
          <div className="space-y-1.5 text-white/85 text-[13px] leading-relaxed">
            {item.body.map((line, i) => <p key={i}>{line}</p>)}
          </div>
          {item.attachment && (
            <Badge variant="outline" className="border-destructive/40 text-destructive text-[11px]">
              📎 {item.attachment}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  if (item.kind === "log") {
    return (
      <div className="rounded-xl border border-white/10 bg-black/60 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.06] border-b border-white/10">
          <Terminal className="h-3.5 w-3.5 text-accent" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-white/60">{item.source}</span>
        </div>
        <div className="p-3 font-mono text-[11px] leading-relaxed text-emerald-300/90 space-y-0.5 overflow-x-auto">
          {item.lines.map((l, i) => (
            <p key={i} className={l.includes("FAIL") ? "text-destructive" : undefined}>{l}</p>
          ))}
        </div>
      </div>
    );
  }

  if (item.kind === "url") {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.06] border-b border-white/10">
          <Globe className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-white/60">Address bar</span>
        </div>
        <div className="p-3 space-y-2">
          <div className="rounded-full bg-black/60 border border-white/10 px-3 py-1.5 font-mono text-[11px] text-white/60 break-all">
            {item.displayed}
          </div>
          <div className="rounded-full bg-destructive/10 border border-destructive/40 px-3 py-1.5 font-mono text-[11px] text-destructive break-all">
            → {item.actual}
          </div>
          <p className="text-[11px] text-white/60">
            TLS: <span className={item.tls === "valid" ? "text-emerald-400" : "text-destructive"}>{item.tls}</span> · {item.note}
          </p>
        </div>
      </div>
    );
  }

  if (item.kind === "screenshot") {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.06] border-b border-white/10">
          <MonitorSmartphone className="h-3.5 w-3.5 text-accent" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-white/60">{item.app}</span>
        </div>
        <div className="p-3 space-y-2">
          <p className="text-[11px] text-white/50">{item.caption}</p>
          <div className="divide-y divide-white/5">
            {item.rows.map((r) => (
              <div key={r.label} className="flex items-start justify-between gap-3 py-1.5">
                <span className="text-xs text-white/60">{r.label}</span>
                <span className={`text-xs text-right ${r.flag ? "text-destructive font-semibold" : "text-white/85"}`}>
                  {r.flag && "⚠ "}{r.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.06] border-b border-white/10">
        <MessageSquare className="h-3.5 w-3.5 text-primary" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-white/60">{item.sender}</span>
      </div>
      <div className="p-3 space-y-2">
        {item.messages.map((m, i) => (
          <div key={i} className={m.from === "you" ? "flex justify-end" : "flex justify-start"}>
            <div className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-[13px] ${
              m.from === "you" ? "bg-primary/20 text-white" : "bg-white/10 text-white/85"
            }`}>
              {m.text}
              <span className="block text-[10px] text-white/40 mt-0.5">{m.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EvidenceBoard({ evidenceCase, accent, onContinue, onAbort }: EvidenceBoardProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const chosen = evidenceCase.options.find((o) => o.id === picked) ?? null;

  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <Card className="mx-auto w-full max-w-2xl border-white/10 bg-black/70 text-white">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" style={{ color: accent }} />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/50">Evidence board</span>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-[0.05em]">{evidenceCase.title}</h2>
            <p className="text-sm text-white/70 mt-1 leading-relaxed">{evidenceCase.situation}</p>
          </div>

          <div className="space-y-3">
            {evidenceCase.evidence.map((item, i) => <EvidenceCard key={i} item={item} />)}
          </div>

          <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: `${accent}55` }}>
            <p className="font-semibold text-sm">{evidenceCase.question}</p>
            <div className="space-y-2">
              {evidenceCase.options.map((opt) => {
                const isPicked = picked === opt.id;
                const reveal = picked !== null;
                const tone = !reveal
                  ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
                  : opt.correct
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : isPicked
                      ? "border-destructive/50 bg-destructive/10"
                      : "border-white/5 bg-white/[0.02] opacity-60";
                return (
                  <button
                    key={opt.id}
                    disabled={reveal}
                    onClick={() => setPicked(opt.id)}
                    className={`w-full text-left rounded-lg border p-3 transition-all text-sm flex gap-2 items-start ${tone}`}
                  >
                    {reveal && (opt.correct
                      ? <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      : isPicked ? <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" /> : <span className="w-4 shrink-0" />)}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {chosen && (
            <div className="space-y-3 animate-fade-in">
              <div className={`rounded-xl border p-3 text-sm leading-relaxed ${
                chosen.correct ? "border-emerald-500/40 bg-emerald-500/10" : "border-destructive/40 bg-destructive/10"
              }`}>
                <p className="font-semibold mb-1">{chosen.correct ? "Right call" : "What actually happens"}</p>
                <p className="text-white/85">{chosen.outcome}</p>
              </div>
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 flex gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-sm text-white/85 leading-relaxed">{evidenceCase.takeaway}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={onAbort}>
              Back
            </Button>
            <Button variant="cyber" className="flex-1" disabled={!picked} onClick={onContinue}>
              Start mission <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
