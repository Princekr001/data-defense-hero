import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trophy, Award, Brain, UploadCloud, RefreshCw } from "lucide-react";
import { useHackLeaderboard } from "@/hooks/useHackLeaderboard";
import { useToast } from "@/hooks/use-toast";

interface Props {
  accent?: string;
  myStats: { xp: number; mastery: number; certificates: number; levelsCleared: number };
  defaultName?: string;
  onClose: () => void;
}

const medal = (i: number) => (i === 0 ? "#fbbf24" : i === 1 ? "#d1d5db" : i === 2 ? "#f59e0b" : "#64748b");

export default function LeaderboardPanel({ accent = "#22d3ee", myStats, defaultName = "", onClose }: Props) {
  const { rows, loading, userId, refresh, publish } = useHackLeaderboard();
  const [name, setName] = useState(defaultName);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const submit = async () => {
    setBusy(true);
    const res = await publish({
      hackerName: name,
      xp: myStats.xp,
      mastery: myStats.mastery,
      certificates: myStats.certificates,
      levelsCleared: myStats.levelsCleared,
    });
    setBusy(false);
    toast(
      res.ok
        ? { title: "Score posted", description: "Your rank is live on the leaderboard." }
        : {
            title: res.reason === "signed-out" ? "Sign in to compete" : "Could not post score",
            description:
              res.reason === "signed-out"
                ? "Create an account to appear on the leaderboard."
                : String(res.reason),
            variant: "destructive" as const,
          },
    );
  };

  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <Card className="mx-auto w-full max-w-2xl border-white/10 bg-black/70 text-white">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" style={{ color: accent }} />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/50">Top hackers</span>
            </div>
            <button onClick={refresh} className="text-white/50 hover:text-white" aria-label="Refresh leaderboard">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: `${accent}55` }}>
            <p className="text-xs text-white/60">
              Your run: <span className="font-mono text-white">{myStats.xp} XP</span> ·{" "}
              <span className="font-mono text-white">{myStats.mastery}% mastery</span> ·{" "}
              <span className="font-mono text-white">{myStats.certificates}</span> certificate
              {myStats.certificates === 1 ? "" : "s"}
            </p>
            <div className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your hacker name"
                aria-label="Hacker name"
                className="bg-white/5 border-white/15 text-white placeholder:text-white/35"
              />
              <Button variant="cyber" onClick={submit} disabled={busy}>
                <UploadCloud className="h-4 w-4" /> Post
              </Button>
            </div>
            {!userId && (
              <p className="text-[11px] text-white/45">Sign in to post your score and compete with friends.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 px-3 text-[10px] font-mono uppercase tracking-wider text-white/35">
              <span className="w-6">#</span>
              <span className="flex-1">Hacker</span>
              <span className="w-14 text-right">XP</span>
              <span className="w-12 text-right">Mast.</span>
              <span className="w-10 text-right">Cert</span>
            </div>
            {rows.length === 0 && !loading && (
              <p className="text-sm text-white/55 px-3 py-6 text-center">
                No scores yet — be the first to post one.
              </p>
            )}
            {rows.map((r, i) => {
              const mine = r.user_id === userId;
              return (
                <div
                  key={r.user_id}
                  className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                    mine ? "border-primary/50 bg-primary/10" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <span className="w-6 font-mono font-bold" style={{ color: medal(i) }}>
                    {i + 1}
                  </span>
                  <span className="flex-1 min-w-0 truncate font-semibold text-white">
                    {r.hacker_name}
                    {mine && <span className="ml-2 text-[10px] uppercase tracking-wider text-primary">you</span>}
                  </span>
                  <span className="w-14 text-right font-mono tabular-nums text-white/85">{r.xp}</span>
                  <span className="w-12 text-right font-mono tabular-nums text-[#22d3ee] flex items-center justify-end gap-1">
                    <Brain className="h-3 w-3" aria-hidden />
                    {r.mastery}
                  </span>
                  <span className="w-10 text-right font-mono tabular-nums text-yellow-300 flex items-center justify-end gap-1">
                    <Award className="h-3 w-3" aria-hidden />
                    {r.certificates}
                  </span>
                </div>
              );
            })}
          </div>

          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" /> Back to grid
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
