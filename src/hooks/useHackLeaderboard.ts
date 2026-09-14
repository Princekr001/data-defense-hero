import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardRow {
  user_id: string;
  hacker_name: string;
  xp: number;
  mastery: number;
  certificates: number;
  levels_cleared: number;
  updated_at: string;
}

export interface MyStats {
  hackerName: string;
  xp: number;
  mastery: number;
  certificates: number;
  levelsCleared: number;
}

/** Reads the public leaderboard and publishes the signed-in player's own stats. */
export function useHackLeaderboard() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hack_leaderboard")
      .select("user_id,hacker_name,xp,mastery,certificates,levels_cleared,updated_at")
      .order("xp", { ascending: false })
      .order("mastery", { ascending: false })
      .limit(50);
    if (error) setError(error.message);
    else {
      setError(null);
      setRows((data ?? []) as LeaderboardRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUserId(session?.user?.id ?? null),
    );
    refresh();
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  /** Upsert the current player's row. No-op when signed out. */
  const publish = useCallback(
    async (stats: MyStats) => {
      if (!userId) return { ok: false, reason: "signed-out" as const };
      const { error } = await supabase.from("hack_leaderboard").upsert(
        {
          user_id: userId,
          hacker_name: stats.hackerName.trim() || "Anonymous Defender",
          xp: stats.xp,
          mastery: stats.mastery,
          certificates: stats.certificates,
          levels_cleared: stats.levelsCleared,
        },
        { onConflict: "user_id" },
      );
      if (error) return { ok: false, reason: error.message };
      await refresh();
      return { ok: true as const, reason: null };
    },
    [userId, refresh],
  );

  return { rows, loading, error, userId, refresh, publish };
}
