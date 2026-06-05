import { useMemo, useState } from "react";
import type { PhishingStage } from "@/data/phishingStream";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Lock,
  Mail,
  MessageSquare,
  ShieldAlert,
  XCircle,
} from "lucide-react";

interface Props {
  stage: PhishingStage;
  /** called when player picks a choice */
  onResolved: (choiceId: string, outcome: "secure" | "risky" | "neutral") => void;
}

const MIN_FLAGS = 2;

export default function PhishingSim({ stage, onResolved }: Props) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [picked, setPicked] = useState<string | null>(null);

  const flagsFound = useMemo(
    () => stage.hotspots.filter((h) => revealed.has(h.id) && h.risk).length,
    [revealed, stage.hotspots]
  );

  const canChoose = flagsFound >= MIN_FLAGS;
  const chosen = picked ? stage.choices.find((c) => c.id === picked) : null;

  function toggle(id: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function pick(id: string) {
    if (picked) return;
    const c = stage.choices.find((x) => x.id === id);
    if (!c) return;
    setPicked(id);
    onResolved(id, c.outcome);
  }

  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
      {/* surface */}
      <Card className="border-border/60 overflow-hidden">
        <CardContent className="p-0">
          <Surface stage={stage} />
        </CardContent>
      </Card>

      {/* inspector */}
      <div className="space-y-3">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-primary" />
              <p className="text-sm font-bold">Inspect before you act</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Click each element to reveal what it really is. Find at least{" "}
              <span className="text-primary font-semibold">{MIN_FLAGS} red flags</span> to unlock your decision.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {stage.hotspots.map((h) => {
                const open = revealed.has(h.id);
                return (
                  <button
                    key={h.id}
                    onClick={() => toggle(h.id)}
                    className={`text-left text-xs px-3 py-2 rounded-md border transition ${
                      open
                        ? h.risk
                          ? "border-destructive/50 bg-destructive/10 text-foreground"
                          : "border-success/50 bg-success/10 text-foreground"
                        : "border-border/60 bg-card hover:border-primary/50"
                    }`}
                    aria-label={`Inspect ${h.label}`}
                  >
                    <span className="flex items-center gap-1 font-semibold">
                      {open ? (
                        h.risk ? (
                          <AlertTriangle className="h-3 w-3 text-destructive" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3 text-success" />
                        )
                      ) : (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                      {h.label}
                    </span>
                    {open && <span className="block mt-1 text-muted-foreground">{h.reveal}</span>}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Red flags found:{" "}
              <span className={flagsFound >= MIN_FLAGS ? "text-destructive font-bold" : "font-bold"}>
                {flagsFound}/{stage.hotspots.filter((h) => h.risk).length}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* choices */}
        <Card className={canChoose ? "border-accent/40" : "border-border/40 opacity-70"}>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="h-4 w-4 text-accent" />
              <p className="text-sm font-bold">Your move</p>
            </div>
            {stage.choices.map((c) => {
              const isPicked = picked === c.id;
              return (
                <Button
                  key={c.id}
                  variant={isPicked ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => pick(c.id)}
                  disabled={!canChoose || (!!picked && !isPicked)}
                >
                  <span className="text-xs">{c.label}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {chosen && (
          <Card
            className={`animate-fade-in ${
              chosen.outcome === "secure"
                ? "border-success/50 bg-success/10"
                : chosen.outcome === "risky"
                ? "border-destructive/50 bg-destructive/10"
                : "border-warning/50 bg-warning/10"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {chosen.outcome === "secure" ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : chosen.outcome === "risky" ? (
                  <XCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
                <p className="text-sm font-bold uppercase tracking-wider">
                  {chosen.outcome === "secure" ? "Secure choice" : chosen.outcome === "risky" ? "Risky outcome" : "Neutral"}
                </p>
                <Badge variant="outline" className="ml-auto text-[10px]">{chosen.label}</Badge>
              </div>
              <p className="text-xs text-foreground/90">{chosen.consequence}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ------------ surface renderers ------------ */

function Surface({ stage }: { stage: PhishingStage }) {
  const s = stage.surface;
  if (s.kind === "inbox") {
    return (
      <div className="bg-card">
        <div className="px-4 py-2 border-b border-border/50 bg-muted/30 flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5" /> Inbox — 1 unread
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="font-semibold text-sm">{s.sender}</p>
              <p className="text-xs text-muted-foreground">{s.senderAddress}</p>
            </div>
            <span className="text-xs text-muted-foreground">today, 4:55pm</span>
          </div>
          <p className="font-bold text-base mb-3">{s.subject}</p>
          <p className="text-sm whitespace-pre-line text-foreground/90 mb-4">{s.body}</p>
          {s.linkText && (
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-block text-sm text-primary underline underline-offset-2"
              title={s.linkHref}
            >
              {s.linkText}
            </a>
          )}
          <p className="mt-6 text-xs text-muted-foreground">— SecureBank Support Team</p>
        </div>
      </div>
    );
  }
  if (s.kind === "message") {
    return (
      <div className="bg-card">
        <div className="px-4 py-2 border-b border-border/50 bg-muted/30 flex items-center gap-2 text-xs text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" /> Direct message
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">P</div>
            <div>
              <p className="font-semibold text-sm">{s.sender}</p>
              <p className="text-xs text-muted-foreground">{s.senderAddress}</p>
            </div>
          </div>
          <p className="font-bold text-sm mb-2">{s.subject}</p>
          <p className="text-sm whitespace-pre-line text-foreground/90">{s.body}</p>
          <div className="mt-4 p-2 rounded border border-dashed border-border/60 text-xs text-muted-foreground">
            📎 vendor-aurora.pdf
          </div>
        </div>
      </div>
    );
  }
  // browser
  return (
    <div className="bg-card">
      <div className="px-3 py-2 border-b border-border/50 bg-muted/30 flex items-center gap-2">
        <div className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-1 rounded bg-background border border-border/50 text-xs">
          <Lock className="h-3 w-3 text-success" />
          <span className="truncate">{s.urlBar}</span>
        </div>
      </div>
      <div className="p-6 bg-white text-slate-900">
        <p className="text-center font-bold text-base mb-1">{s.subject}</p>
        <p className="text-center text-xs text-slate-500 mb-5">{s.urlReal}</p>
        <pre className="text-xs whitespace-pre-wrap font-sans text-slate-700">{s.body}</pre>
      </div>
    </div>
  );
}
