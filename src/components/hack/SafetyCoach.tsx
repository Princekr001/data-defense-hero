import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, HeartHandshake, LoaderCircle, Send, ShieldCheck } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

interface CoachResponse {
  advice?: string;
  error?: string;
}

export default function SafetyCoach({ onClose }: { onClose: () => void }) {
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const [situation, setSituation] = useState("");
  const [advice, setAdvice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  const getSafeError = async (requestError: unknown): Promise<string> => {
    if (requestError && typeof requestError === "object" && "context" in requestError) {
      const context = requestError.context;
      if (context instanceof Response) {
        try {
          const body = (await context.json()) as CoachResponse;
          if (typeof body.error === "string" && body.error.trim()) return body.error;
        } catch {
          // Fall through to the SDK's safe message.
        }
      }
    }
    if (requestError instanceof Error && requestError.message.trim()) return requestError.message;
    return "Safety Coach couldn't finish this request. Your message is still here—please try again.";
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || busy || !situation.trim()) return;

    const controller = new AbortController();
    requestRef.current = controller;
    setBusy(true);
    setError("");
    setAdvice("");

    try {
      const { data, error: invokeError } = await (await import("@/integrations/supabase/client")).supabase.functions.invoke<CoachResponse>(
        "safety-coach",
        { body: { situation }, signal: controller.signal },
      );
      if (invokeError) throw invokeError;
      if (!data || typeof data.advice !== "string" || !data.advice.trim()) {
        throw new Error("Safety Coach returned no guidance. Your message is still here—please try again.");
      }
      setAdvice(data.advice);
    } catch (requestError) {
      if (!controller.signal.aborted) setError(await getSafeError(requestError));
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  };

  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-background/95 p-4 backdrop-blur-md animate-fade-in">
      <div className="mx-auto flex min-h-full w-full max-w-2xl items-center justify-center py-12">
        <Card className="w-full border-primary/25 bg-card/95 text-foreground">
          <CardContent className="space-y-5 p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-md border border-primary/30 bg-primary/10 p-2.5 text-primary">
                  <HeartHandshake className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2 border-primary/30 text-primary">PRIVATE GUIDANCE</Badge>
                  <h2 className="font-display text-2xl font-bold uppercase">Safety Coach</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Tell Cipher what happened online. Get clear next steps.</p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Back to mission grid">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>

            {!authLoading && !user ? (
              <div className="space-y-4 rounded-md border border-border bg-muted/30 p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Sign in before sharing a situation. Your story is sent for guidance and isn’t saved in your game history.
                  </p>
                </div>
                <Button variant="cyber" onClick={() => setAuthOpen(true)}>Sign in or create an account</Button>
              </div>
            ) : (
              <>
                {authLoading ? (
                  <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                    <LoaderCircle className="h-4 w-4 animate-spin" /> Checking sign-in…
                  </div>
                ) : (
                  <>
                    <form className="space-y-3" onSubmit={submit}>
                      <label htmlFor="safety-situation" className="text-sm font-medium">What happened?</label>
                      <Textarea
                        id="safety-situation"
                        value={situation}
                        onChange={(event) => setSituation(event.target.value)}
                        maxLength={2000}
                        rows={5}
                        placeholder="For example: Someone I don’t know sent me a link and says my account will be deleted if I don’t sign in."
                        disabled={busy}
                        required
                        aria-describedby="safety-privacy-note"
                        className="min-h-32 resize-y border-border bg-background"
                      />
                      <p id="safety-privacy-note" className="text-xs leading-relaxed text-muted-foreground">
                        Don’t include your name, school, address, passwords, or private codes. Your message is sent to Lovable AI for guidance and isn’t saved in your game history.
                      </p>
                      <div className="flex justify-end text-xs tabular-nums text-muted-foreground">
                        {situation.length}/2000
                      </div>
                      <Button type="submit" variant="cyber" className="w-full" disabled={busy || !situation.trim()}>
                        {busy ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Getting safe steps…</> : <><Send className="h-4 w-4" /> Get safe steps</>}
                      </Button>
                    </form>

                    {error && (
                      <div role="alert" className="flex gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <p>{error}</p>
                      </div>
                    )}

                    {advice && (
                      <section aria-live="polite" className="space-y-3 rounded-md border border-primary/25 bg-primary/5 p-4">
                        <h3 className="flex items-center gap-2 font-display font-bold uppercase">
                          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" /> Your next safe steps
                        </h3>
                        <div className="whitespace-pre-wrap break-words text-sm leading-7 text-foreground">{advice}</div>
                        <p className="border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                          If anyone is in immediate danger, get help from a trusted adult now or contact local emergency services.
                        </p>
                      </section>
                    )}
                  </>
                )}
              </>
            )}

            <div className="border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
              If something feels urgent or scary, tell a trusted adult. You don’t have to handle it alone.
            </div>
          </CardContent>
        </Card>
      </div>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} onSignIn={signIn} onSignUp={signUp} />
    </div>
  );
}