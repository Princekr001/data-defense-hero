import { useCallback, useEffect, useMemo, useState } from "react";
import { hackLevels } from "@/data/hackTargets";
import type { HackLevel } from "@/data/hackTargets";

const KEY = "ddh.dailyChallenge.v1";

/** UTC day stamp, e.g. "2026-09-16" — the challenge rolls over every 24h at 00:00 UTC. */
const dayStamp = (d = new Date()) => d.toISOString().slice(0, 10);

const prevDayStamp = () => dayStamp(new Date(Date.now() - 86_400_000));

interface DailyState {
  day: string;
  levelId: number;
  claimed: boolean;
  streak: number;
  lastClaimDay: string | null;
  bonusXp: number;
  /** Bonus mastery points earned per category from daily clears. */
  masteryBonus?: Record<string, number>;
}

const CODENAMES = ["Nightshade", "Glasswall", "Redline", "Ghost Relay", "Iron Veil", "Zero Hour", "Blackout", "Cold Trace", "Silent Key", "Neon Siege"];
const MODIFIERS = [
  "Attacker is already inside — act fast.",
  "Logs are partially wiped — read carefully.",
  "A decoy alert is running in parallel.",
  "The SOC is short-staffed tonight — you're alone.",
  "Executive target — the stakes are doubled.",
];

/** Mastery points granted for a daily clear (grows with streak, max +10). */
export const masteryRewardFor = (streak: number) => 4 + Math.min(streak, 6);

const hashDay = (day: string) => {
  let h = 0;
  for (let i = 0; i < day.length; i++) h = (h * 31 + day.charCodeAt(i)) >>> 0;
  return h;
};

const load = (): DailyState | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DailyState) : null;
  } catch {
    return null;
  }
};

/** Reward scales with the streak so coming back day after day is worth it. */
export const rewardFor = (streak: number) => 150 + Math.min(streak, 6) * 50;

/**
 * A single rotating target that resets every 24 hours (UTC).
 * Clearing it once per day grants bonus XP and grows a return streak.
 */
export function useDailyChallenge(candidates: HackLevel[]) {
  const [state, setState] = useState<DailyState>(() => {
    const saved = load();
    const today = dayStamp();
    if (saved && saved.day === today) return saved;
    return {
      day: today,
      levelId: -1,
      claimed: false,
      streak: saved?.lastClaimDay === prevDayStamp() ? saved.streak : 0,
      lastClaimDay: saved?.lastClaimDay ?? null,
      bonusXp: saved?.bonusXp ?? 0,
      masteryBonus: saved?.masteryBonus ?? {},
    };
  });

  // Pick today's target once a candidate pool is available, then keep it stable.
  useEffect(() => {
    if (state.levelId !== -1 || candidates.length === 0) return;
    const pool = candidates.length ? candidates : hackLevels;
    const pick = pool[hashDay(state.day) % pool.length];
    setState((s) => (s.levelId === -1 ? { ...s, levelId: pick.id } : s));
  }, [candidates, state.levelId, state.day]);

  // Roll over while the page stays open past midnight UTC.
  useEffect(() => {
    const t = setInterval(() => {
      const today = dayStamp();
      setState((s) =>
        s.day === today
          ? s
          : {
              ...s,
              day: today,
              levelId: -1,
              claimed: false,
              streak: s.lastClaimDay === prevDayStamp() ? s.streak : 0,
            },
      );
    }, 60_000) as ReturnType<typeof setInterval>;
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const target = useMemo(
    () => hackLevels.find((l) => l.id === state.levelId) ?? null,
    [state.levelId],
  );

  const reward = rewardFor(state.streak);
  const masteryReward = masteryRewardFor(state.streak);
  const h = hashDay(state.day);
  const codename = `Operation ${CODENAMES[h % CODENAMES.length]}`;
  const modifier = MODIFIERS[(h >> 3) % MODIFIERS.length];

  /** Call after a win. Returns the bonus XP granted, or 0 when it wasn't today's target. */
  const completeLevel = useCallback(
    (levelId: number) => {
      if (state.claimed || levelId !== state.levelId) return 0;
      const today = dayStamp();
      const streak = state.lastClaimDay === prevDayStamp() ? state.streak + 1 : 1;
      const gained = rewardFor(streak - 1);
      const mGain = masteryRewardFor(streak - 1);
      const cat = hackLevels.find((l) => l.id === levelId)?.category ?? "phishing";
      setState((s) => {
        const mb = { ...(s.masteryBonus ?? {}) };
        mb[cat] = Math.min(30, (mb[cat] ?? 0) + mGain);
        return { ...s, claimed: true, streak, lastClaimDay: today, bonusXp: s.bonusXp + gained, masteryBonus: mb };
      });
      return gained;
    },
    [state.claimed, state.levelId, state.lastClaimDay, state.streak],
  );

  /** ms until the next UTC reset */
  const msLeft = useMemo(() => {
    const now = new Date();
    const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
    return next - now.getTime();
  }, [state.day]);

  const reset = useCallback(
    () =>
      setState({
        day: dayStamp(),
        levelId: -1,
        claimed: false,
        streak: 0,
        lastClaimDay: null,
        bonusXp: 0,
        masteryBonus: {},
      }),
    [],
  );

  return {
    target,
    claimed: state.claimed,
    streak: state.streak,
    bonusXp: state.bonusXp,
    reward,
    masteryReward,
    masteryBonus: state.masteryBonus ?? {},
    codename,
    modifier,
    msLeft,
    completeLevel,
    reset,
  };
}
