import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, CheckCircle2, XCircle, Lightbulb, FileText, GraduationCap, BookOpen,
} from "lucide-react";
import { caseFiles, loadReviewedCases, saveReviewedCases } from "@/data/caseFiles";
import type { CaseFile } from "@/data/caseFiles";

const KIND_LABEL: Record<CaseFile["kind"], string> = {
  incident: "Real Incident",
  certification: "Certification",
};

export function CaseDetail({
  file,
  accent = "#22d3ee",
  onReviewed,
  onBack,
  backLabel = "Back",
  continueLabel = "Done",
}: {
  file: CaseFile;
  accent?: string;
  onReviewed: () => void;
  onBack: () => void;
  backLabel?: string;
  continueLabel?: string;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const options = Object.entries(file.actions) as [string, { text: string; type: "safe" | "risky" }][];
  const chosen = picked ? file.actions[picked as keyof typeof file.actions] : null;

  return (
    <Card className="mx-auto w-full max-w-2xl border-white/10 bg-black/75 text-white">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className={file.kind === "incident"
              ? "border-destructive/50 text-destructive"
              : "border-primary/50 text-primary"}
          >
            {file.kind === "incident" ? <FileText className="h-3 w-3 mr-1" /> : <GraduationCap className="h-3 w-3 mr-1" />}
            {KIND_LABEL[file.kind]}
          </Badge>
          <Badge variant="outline" className="border-white/20 text-white/70 capitalize">{file.category}</Badge>
          <span className="text-[11px] font-mono text-white/40 ml-auto">+{file.xpReward} XP</span>
        </div>

        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-[0.04em]">{file.title}</h2>
          <p className="text-xs text-white/50 mt-1">{file.character}</p>
        </div>

        <p className="text-sm text-white/75 leading-relaxed">{file.description}</p>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/85 leading-relaxed">
          {file.situation}
        </div>

        <div className="rounded-xl border p-4 space-y-2" style={{ borderColor: `${accent}55` }}>
          <p className="font-semibold text-sm">What do you do?</p>
          {options.map(([key, opt]) => {
            const isPicked = picked === key;
            const reveal = picked !== null;
            const safe = opt.type === "safe";
            const tone = !reveal
              ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
              : safe
                ? "border-emerald-500/50 bg-emerald-500/10"
                : isPicked
                  ? "border-destructive/50 bg-destructive/10"
                  : "border-white/5 bg-white/[0.02] opacity-60";
            return (
              <button
                key={key}
                disabled={reveal}
                onClick={() => setPicked(key)}
                className={`w-full text-left rounded-lg border p-3 transition-all text-sm flex gap-2 items-start ${tone}`}
              >
                {reveal && (safe
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  : isPicked ? <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" /> : <span className="w-4 shrink-0" />)}
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {chosen && (
          <div className="space-y-3 animate-fade-in">
            <div className={`rounded-xl border p-3 text-sm leading-relaxed ${
              chosen.type === "safe" ? "border-emerald-500/40 bg-emerald-500/10" : "border-destructive/40 bg-destructive/10"
            }`}>
              <p className="font-semibold mb-1">{chosen.type === "safe" ? "Right call" : "What actually happens"}</p>
              <p className="text-white/85">{file.feedback.correct}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/85">
              <span className="font-bold">Concept: </span>{file.feedback.concept}
            </div>
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 flex gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
              <ul className="space-y-1 text-sm text-white/85 leading-relaxed">
                {file.feedback.tips.map((t) => <li key={t}>· {t}</li>)}
              </ul>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Button>
          <Button variant="cyber" className="flex-1" disabled={!picked} onClick={onReviewed}>
            {continueLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CaseFilesPanel({ accent = "#22d3ee", onClose }: { accent?: string; onClose: () => void }) {
  const [reviewed, setReviewed] = useState<number[]>(() => loadReviewedCases());
  const [openId, setOpenId] = useState<number | null>(null);
  const open = useMemo(() => caseFiles.find((c) => c.id === openId) ?? null, [openId]);

  const markReviewed = (id: number) => {
    setReviewed((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      saveReviewedCases(next);
      return next;
    });
    setOpenId(null);
  };

  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      {open ? (
        <CaseDetail
          file={open}
          accent={accent}
          onBack={() => setOpenId(null)}
          onReviewed={() => markReviewed(open.id)}
          backLabel="All cases"
          continueLabel="Mark reviewed"
        />
      ) : (
        <Card className="mx-auto w-full max-w-2xl border-white/10 bg-black/70 text-white">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" style={{ color: accent }} />
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/50">Case files</span>
              </div>
              <span className="text-xs font-mono text-white/60">
                {reviewed.filter((id) => caseFiles.some((c) => c.id === id)).length} of {caseFiles.length} reviewed
              </span>
            </div>

            <p className="text-sm text-white/65 leading-relaxed">
              Real cyber-crime incidents and certification-style questions. Pick a case, make the call, see what happened.
            </p>

            <div className="space-y-2">
              {caseFiles.map((c) => {
                const done = reviewed.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => setOpenId(c.id)}
                    className="w-full text-left rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors p-3 flex items-start gap-3"
                  >
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${c.kind === "incident"
                            ? "border-destructive/50 text-destructive"
                            : "border-primary/50 text-primary"}`}
                        >
                          {KIND_LABEL[c.kind]}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] border-white/15 text-white/60 capitalize">
                          {c.category}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-white leading-snug">{c.title}</p>
                      <p className="text-xs text-white/55 leading-relaxed line-clamp-2">{c.description}</p>
                    </div>
                    {done && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>

            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" /> Back to grid
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
